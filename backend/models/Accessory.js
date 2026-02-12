const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: [true, 'Nom de l\'accessoire requis'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },

  // Catégorie
  category: {
    type: String,
    required: true,
    enum: ['sleeves', 'deck-box', 'playmat', '3d-insert', 'counter', 'dice', 'binder', 'other']
  },
  subCategory: {
    type: String
    // Ex: "Standard", "Premium", "Japanese", "Oversized", etc.
  },

  // Prix et stock
  price: {
    type: Number,
    required: [true, 'Prix requis'],
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  availability: {
    type: String,
    enum: ['available', 'low-stock', 'out-of-stock', 'pre-order'],
    default: function() {
      if (this.stock === 0) return 'out-of-stock';
      if (this.stock <= 10) return 'low-stock';
      return 'available';
    }
  },

  // Images
  images: {
    main: {
      type: String,
      required: true
    },
    gallery: [String],
    thumbnail: String
  },

  // Spécifications techniques
  specifications: {
    brand: String,
    material: String,
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: {
        type: String,
        default: 'mm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        default: 'g'
      }
    },
    color: [String],
    quantity: Number, // Ex: 65 sleeves, 100 sleeves, etc.
    compatibility: [String] // Ex: ["Standard Size", "Pokemon TCG", "Double Sleeving"]
  },

  // Personnalisation (pour playmats, deck boxes custom, etc.)
  isCustomizable: {
    type: Boolean,
    default: false
  },
  customizationOptions: {
    allowCustomImage: {
      type: Boolean,
      default: false
    },
    allowCustomText: {
      type: Boolean,
      default: false
    },
    additionalCost: {
      type: Number,
      default: 0
    },
    minOrderQuantity: {
      type: Number,
      default: 1
    }
  },

  // SEO et recherche
  tags: [String],
  slug: {
    type: String,
    unique: true
  },

  // Relations
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accessory'
  }],
  compatibleDecks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  }],

  // Statistiques
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Mise en avant
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewItem: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },

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

// Générer le slug avant sauvegarde
accessorySchema.pre('save', function(next) {
  if (!this.slug) {
    const slugBase = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    this.slug = slugBase;
  }
  this.updatedAt = Date.now();
  next();
});

// Méthode pour vérifier la disponibilité
accessorySchema.methods.isAvailable = function(quantity = 1) {
  return this.stock >= quantity && this.availability !== 'out-of-stock';
};

// Méthode pour mettre à jour le stock
accessorySchema.methods.updateStock = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  } else if (operation === 'set') {
    this.stock = Math.max(0, quantity);
  }

  // Mettre à jour la disponibilité
  if (this.stock === 0) {
    this.availability = 'out-of-stock';
  } else if (this.stock <= 10) {
    this.availability = 'low-stock';
  } else {
    this.availability = 'available';
  }

  await this.save();
  return this.stock;
};

// Index pour optimiser les recherches
accessorySchema.index({ name: 'text', description: 'text' });
accessorySchema.index({ category: 1 });
accessorySchema.index({ subCategory: 1 });
accessorySchema.index({ price: 1 });
accessorySchema.index({ availability: 1 });
accessorySchema.index({ 'specifications.brand': 1 });
accessorySchema.index({ isCustomizable: 1 });
accessorySchema.index({ isFeatured: 1 });
accessorySchema.index({ isNewItem: 1 });
accessorySchema.index({ 'rating.average': -1 });
accessorySchema.index({ salesCount: -1 });
accessorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Accessory', accessorySchema);
