const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Numéro de commande unique (Format: ADD-YYMM-XXXX)
  orderNumber: {
    type: String,
    unique: true
  },

  // Client (optionnel pour guest checkout)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isGuestOrder: {
    type: Boolean,
    default: false
  },

  // Informations client
  customerInfo: {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },

  // Articles commandés (cards, decks, accessories)
  items: [{
    itemType: {
      type: String,
      required: true,
      enum: ['card', 'deck', 'accessory']
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'items.itemModel'
    },
    itemModel: {
      type: String,
      required: true,
      enum: ['Card', 'Deck', 'Accessory']
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    // Snapshot des données au moment de la commande (pour historique)
    snapshot: {
      type: mongoose.Schema.Types.Mixed
    }
  }],

  // Adresse de livraison
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'France'
    },
    additionalInfo: String
  },

  // Adresse de facturation (si différente)
  billingAddress: {
    street: String,
    city: String,
    zipCode: String,
    country: String
  },
  useSameAddress: {
    type: Boolean,
    default: true
  },

  // Tarification
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },

  // Code promo
  promoCode: {
    code: String,
    discountAmount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },

  // Statut de la commande
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },

  // Paiement
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },

  // Livraison
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    carrier: String, // Colissimo, Chronopost, etc.
    trackingNumber: String,
    trackingUrl: String,
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date
  },

  // Notes
  customerNotes: String,
  internalNotes: String,

  // Historique des changements de statut
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Notifications envoyées
  notifications: {
    orderConfirmation: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    paymentConfirmation: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    shipping: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    delivered: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },

  // Dates importantes
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Générer le numéro de commande avant sauvegarde
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');

    // Compter les commandes du mois
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
      }
    });

    const orderNum = (count + 1).toString().padStart(4, '0');
    this.orderNumber = `ADD-${year}${month}-${orderNum}`;
  }

  this.updatedAt = Date.now();
  next();
});

// Ajouter un événement à l'historique lors du changement de statut
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      date: new Date()
    });
  }
  next();
});

// Méthode pour calculer le total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.pricing.subtotal;
  const shipping = this.pricing.shippingCost;
  const discount = this.pricing.discount || 0;

  // Calcul des frais de port selon les règles
  let actualShipping = shipping;
  if (subtotal >= 100) {
    actualShipping = 0; // Gratuit à partir de 100€
  } else if (subtotal >= 50) {
    actualShipping = 2.99;
  } else {
    actualShipping = 4.99;
  }

  // TVA 20% sur (subtotal - discount + shipping)
  const taxBase = subtotal - discount + actualShipping;
  const tax = taxBase * 0.20;

  this.pricing.shippingCost = actualShipping;
  this.pricing.tax = parseFloat(tax.toFixed(2));
  this.pricing.total = parseFloat((taxBase + tax).toFixed(2));

  return this.pricing.total;
};

// Méthode pour marquer comme payé
orderSchema.methods.markAsPaid = async function(transactionId) {
  this.payment.status = 'completed';
  this.payment.transactionId = transactionId;
  this.payment.paidAt = new Date();
  this.status = 'confirmed';
  this.confirmedAt = new Date();

  await this.save();

  // TODO: Envoyer email de confirmation de paiement P2

  // On déduit du stock
  for (let item of this.items) {
    item.item.updateStock(item.quantity, 'substract');
  }

  return this;
};

// Méthode pour marquer comme échoué
orderSchema.methods.markAsFailed = async function(transactionId) {
  this.payment.status = 'failed';
  this.payment.transactionId = transactionId;

  await this.save();

  return this;
};

// Méthode pour marquer comme expédié
orderSchema.methods.markAsShipped = async function(shippingInfo) {
  this.status = 'shipped';
  this.shipping.carrier = shippingInfo.carrier;
  this.shipping.trackingNumber = shippingInfo.trackingNumber;
  this.shipping.trackingUrl = shippingInfo.trackingUrl;
  this.shipping.shippedAt = new Date();

  if (shippingInfo.estimatedDelivery) {
    this.shipping.estimatedDelivery = shippingInfo.estimatedDelivery;
  }

  await this.save();

  // TODO: Envoyer email avec numéro de suivi P2

  return this;
};

// Méthode pour annuler la commande
orderSchema.methods.cancel = async function(reason) {
  if (['shipped', 'delivered'].includes(this.status)) {
    throw new Error('Impossible d\'annuler une commande déjà expédiée');
  }

  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;

  // On remet en stock
  for (let item of this.items) {
    item.item.updateStock(item.quantity, 'add');
  }

  await this.save();

  return this;
};


// Méthode pour rembourser la commande
orderSchema.methods.refund = async function(refundAmount) {
  //STRIPE
  if (this.payment.method === 'stripe') {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const refund = await stripe.refund.create({
      charge: this.payment.transactionId,
      amount: refundAmount * 100 //cents
    });
  }

  //TODO: Paypal

  this.payment.status = 'refunded';
  this.payment.refundedAt = new Date();
  this.payment.refundAmount = refundAmount;
  this.status = 'refunded';

  await this.save();

  return this;
}

// Index pour optimiser les recherches
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ user: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.paidAt': -1 });

module.exports = mongoose.model('Order', orderSchema);
