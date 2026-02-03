const Card = require('./models/Card');
const Deck = require('./models/Deck');
const Accessory = require('./models/Accessory');

// Helper pour obtenir le modèle selon le type
const getModel = (itemType) => {
  switch (itemType) {
    case 'card': return Card;
    case 'deck': return Deck;
    case 'accessory': return Accessory;
    default: throw new Error('Type d\'article invalide');
  }
};

module.exports = {
    getModel
};