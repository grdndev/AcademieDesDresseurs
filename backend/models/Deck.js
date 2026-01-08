const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: [true, 'Nom du deck requis'],
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
  
  // Composition du deck
  cards: [{
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 4 // Règle Pokémon TCG: max 4 exemplaires d'une carte (sauf Énergies de base)
    }
  }],
  
  // Prix et stock
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  availability: {
    type: String,
    enum: ['available', 'low-stock', 'out-of-stock', 'custom'],
    default: 'custom'
  },
  
  // Catégorisation
  category: {
    type: String,
    required: true,
    enum: ['competitive', 'casual', 'budget', 'meta', 'fun', 'theme']
  },
  format: {
    type: String,
    required: true,
    enum: ['Standard', 'Expanded', 'Unlimited']
  },
  archetype: {
    type: String,
    trim: true
    // Ex: "Gardevoir ex", "Lost Zone Box", "Charizard ex", etc.
  },
  
  // Niveau de difficulté
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  
  // Style de jeu
  strategy: {
    type: String,
    enum: ['aggro', 'control', 'combo', 'midrange', 'stall'],
    default: 'midrange'
  },
  
  // Images
  coverImage: {
    type: String,
    required: true
  },
  thumbnailImage: String,
  cardImages: [String], // Images des cartes principales du deck
  
  // Auteur
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isOfficial: {
    type: Boolean,
    default: false // true = deck officiel de la boutique, false = deck custom utilisateur
  },
  isPublic: {
    type: Boolean,
    default: true // Les decks custom peuvent être privés
  },
  
  // Résultats en tournoi (si applicable)
  tournamentResults: [{
    tournament: String,
    position: String, // Ex: "1st", "Top 8", "Top 16"
    date: Date,
    player: String
  }],
  winRate: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Statistiques
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
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
  
  // Accessoires recommandés
  recommendedAccessories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accessory'
  }],
  
  // SEO
  tags: [String],
  slug: {
    type: String,
    unique: true
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
deckSchema.pre('save', function(next) {
  if (!this.slug) {
    const slugBase = this.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    this.slug = `${slugBase}-${Date.now()}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Validation: un deck doit contenir entre 40 et 60 cartes (règle Pokémon TCG)
deckSchema.path('cards').validate(function(cards) {
  const totalCards = cards.reduce((sum, item) => sum + item.quantity, 0);
  return totalCards >= 40 && totalCards <= 60;
}, 'Un deck doit contenir entre 40 et 60 cartes');

// Méthode pour calculer le nombre total de cartes
deckSchema.methods.getTotalCards = function() {
  return this.cards.reduce((sum, item) => sum + item.quantity, 0);
};

// Méthode pour vérifier la disponibilité complète du deck
deckSchema.methods.checkAvailability = async function() {
  await this.populate('cards.card');
  
  const unavailableCards = [];
  let fullyAvailable = true;
  
  for (const item of this.cards) {
    if (!item.card.isAvailable(item.quantity)) {
      fullyAvailable = false;
      unavailableCards.push({
        card: item.card,
        requested: item.quantity,
        available: item.card.stock
      });
    }
  }
  
  return {
    fullyAvailable,
    unavailableCards
  };
};

// Méthode pour obtenir la liste formatée (export Limitless, etc.)
deckSchema.methods.getFormattedList = async function() {
  await this.populate('cards.card');
  
  let list = '';
  for (const item of this.cards) {
    const card = item.card;
    list += `${item.quantity}× ${card.nameFR} (${card.setCode} ${card.cardNumber})\n`;
  }
  
  return list.trim();
};

// Index pour optimiser les recherches
deckSchema.index({ name: 'text', description: 'text', archetype: 'text' });
deckSchema.index({ category: 1 });
deckSchema.index({ format: 1 });
deckSchema.index({ archetype: 1 });
deckSchema.index({ difficulty: 1 });
deckSchema.index({ price: 1 });
deckSchema.index({ isOfficial: 1 });
deckSchema.index({ isPublic: 1 });
deckSchema.index({ createdBy: 1 });
deckSchema.index({ 'rating.average': -1 });
deckSchema.index({ viewCount: -1 });
deckSchema.index({ purchaseCount: -1 });
deckSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Deck', deckSchema);
