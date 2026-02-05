const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  // Informations de base
  nameFR: {
    type: String,
    required: [true, 'Nom français requis'],
    trim: true
  },
  nameEN: {
    type: String,
    required: [true, 'Nom anglais requis'],
    trim: true
  },

  // Identification unique de la carte
  setCode: {
    type: String,
    required: [true, 'Code du set requis'],
    uppercase: true,
    trim: true,
    index: true
    // Ex: "OBF" pour Obsidian Flames, "PAL" pour Paldea Evolved
  },
  setName: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: [true, 'Numéro de carte requis'],
    trim: true
    // Format: "032/197" ou "086/197"
  },

  // Caractéristiques
  rarity: {
    type: String,
    required: true,
    enum: ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare', 'Secret Rare', 'Illustration Rare', 'Special Illustration Rare', 'Hyper Rare', 'Promo']
  },
  type: {
    type: String,
    required: true,
    enum: ['Pokémon', 'Trainer', 'Energy', 'Supporter', 'Item', 'Stadium']
  },
  subType: {
    type: String
    // Ex: "Basic", "Stage 1", "Stage 2", "V", "VMAX", "ex", etc.
  },

  // Type Pokémon (si applicable)
  pokemonType: [{
    type: String,
    enum: ['Colorless', 'Darkness', 'Dragon', 'Fairy', 'Fighting', 'Fire', 'Grass', 'Lightning', 'Metal', 'Psychic', 'Water']
  }],

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

  // Images
  images: {
    front: {
      type: String,
      required: true
    },
    back: String,
    thumbnail: String
  },

  // Description et détails
  description: {
    type: String
  },
  abilities: [{
    name: String,
    text: String,
    type: {
      type: String,
      enum: ['Ability', 'Poké-Power', 'Poké-Body', 'Ancient Trait']
    }
  }],
  attacks: [{
    name: String,
    cost: [String], // Ex: ["Fire", "Fire", "Colorless"]
    damage: String, // Ex: "120", "30+", "×"
    text: String
  }],

  // Stats (pour Pokémon)
  hp: Number,
  retreatCost: Number,
  weaknesses: [{
    type: String,
    multiplier: String // Ex: "×2", "+20"
  }],
  resistances: [{
    type: String,
    value: String // Ex: "-30"
  }],

  // Informations complémentaires
  language: {
    type: String,
    enum: ['FR', 'EN'],
    default: 'FR'
  },
  format: [{
    type: String,
    enum: ['Standard', 'Expanded', 'Unlimited']
  }],
  isPromo: {
    type: Boolean,
    default: false
  },
  releaseDate: Date,

  // SEO et recherche
  tags: [String],
  slug: {
    type: String,
    unique: true
  },

  // Statistiques
  popularity: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
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

cardSchema.virtual('availability').get(function() {
  if (this.stock > 5) {
    return 'available';
  } else if (this.stock > 0) {
    return 'low-stock';
  }
  return 'out-of-stock';
})

// Générer le slug avant validation
cardSchema.pre('validate', function(next) {
  if (!this.slug) {
    const slugBase = `${this.nameFR.toLowerCase().replace(/\s+/g, '-')}-${this.setCode.toLowerCase()}-${this.cardNumber.replace('/', '-')}`;
    this.slug = slugBase.replace(/[^a-z0-9-]/g, '');
  }
  next();
});

cardSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
})

// Méthode pour vérifier la disponibilité
cardSchema.methods.isAvailable = function(quantity = 1) {
  return this.stock >= quantity && this.availability !== 'out-of-stock';
};

// Méthode pour mettre à jour le stock
cardSchema.methods.updateStock = async function(quantity, operation = 'subtract') {
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
  } else if (this.stock <= 5) {
    this.availability = 'low-stock';
  } else {
    this.availability = 'available';
  }

  await this.save();
  return this.stock;
};

// Méthode pour obtenir l'identifiant unique (pour Deck-to-Stock Builder)
cardSchema.methods.getUniqueIdentifier = function() {
  return `${this.setCode}-${this.cardNumber}`;
};

// Index pour optimiser les recherches
cardSchema.index({ nameFR: 'text', nameEN: 'text', setName: 'text' });
cardSchema.index({ setCode: 1, cardNumber: 1 }, { unique: true });
cardSchema.index({ type: 1 });
cardSchema.index({ rarity: 1 });
cardSchema.index({ pokemonType: 1 });
cardSchema.index({ price: 1 });
cardSchema.index({ availability: 1 });
cardSchema.index({ popularity: -1 });
cardSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Card', cardSchema);
