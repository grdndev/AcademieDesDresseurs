const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Informations de base
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: function() {
      return !this.oauthProvider; // Requis uniquement si pas OAuth
    },
    minlength: [6, 'Mot de passe trop court (min 6 caractères)']
  },
  pseudo: {
    type: String,
    required: [true, 'Pseudo requis'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: '/assets/default-avatar.png'
  },
  phone: {
    type: String,
    trim: true
  },

  // Adresse par défaut
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: { type: String, default: 'France' },
    additionalInfo: String
  },

  // Préférences utilisateur
  preferences: {
    language: {
      type: String,
      enum: ['FR', 'EN'],
      default: 'FR'
    },
    favoriteFormat: {
      type: String,
      enum: ['Standard', 'Expanded', 'Unlimited'],
      default: 'Standard'
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    playStyle: {
      type: String,
      enum: ['competitive', 'casual', 'collector'],
      default: 'casual'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      restockAlerts: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      tournaments: { type: Boolean, default: false }
    }
  },

  // Decks sauvegardés
  savedDecks: [{
    deck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck'
    },
    name: String, // Nom personnalisé donné par l'utilisateur
    isCustom: {
      type: Boolean,
      default: false
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Wishlist (cartes, decks, accessoires)
  wishlist: {
    cards: [{
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
      },
      addedAt: {
        type: Date,
        default: Date.now
      },
      notifyOnRestock: {
        type: Boolean,
        default: true
      }
    }],
    decks: [{
      deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    accessories: [{
      accessory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Accessory'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Historique des commandes
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

  // Statistiques utilisateur
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    favoriteArchetype: String,
    lastOrderDate: Date
  },

  // OAuth (Google, Facebook, etc.)
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', 'discord']
  },
  oauthId: String,

  // Rôle et permissions
  role: {
    type: String,
    enum: ['user', 'editor', 'admin', 'super-admin'],
    default: 'user'
  },

  // Statut du compte
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // Consentement RGPD
  gdprConsent: {
    marketing: { type: Boolean, default: false },
    dataProcessing: { type: Boolean, default: true },
    consentDate: Date
  },

  // Timestamps
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le profil public (sans infos sensibles)
userSchema.methods.toPublicProfile = function() {
  return {
    id: this._id,
    pseudo: this.pseudo,
    avatar: this.avatar,
    role: this.role,
    createdAt: this.createdAt,
    stats: this.stats
  };
};

// Méthode pour mettre à jour les stats après une commande
userSchema.methods.updateStatsAfterOrder = async function(orderAmount) {
  this.stats.totalOrders += 1;
  this.stats.totalSpent += orderAmount;
  this.stats.averageOrderValue = this.stats.totalSpent / this.stats.totalOrders;
  this.stats.lastOrderDate = new Date();
  await this.save();
};

// Vérifier les permissions
userSchema.methods.hasPermission = function(requiredRole) {
  const roleHierarchy = {
    'user': 1,
    'editor': 2,
    'admin': 3,
    'super-admin': 4
  };
  return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
};

// Index pour optimiser les recherches
userSchema.index({ email: 1 });
userSchema.index({ pseudo: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model('User', userSchema);
