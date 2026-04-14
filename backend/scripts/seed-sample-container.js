#!/usr/bin/env node
const mongoose = require('mongoose');
const path = require('path');

// Load env from common locations depending on container layout
for (const envPath of [
  path.join(__dirname, '..', '.env.docker'),
  path.join(__dirname, '..', '..', '.env.docker'),
  '/app/.env.docker',
  '/app/backend/.env.docker',
]) {
  require('dotenv').config({ path: envPath });
}

function tryRequire(relPaths) {
  for (const p of relPaths) {
    try {
      return require(p);
    } catch (e) {
      // continue
    }
  }
  throw new Error('Could not require module from any known path');
}

const Card = tryRequire([
  path.join(__dirname, '..', 'models', 'Card'),
  path.join(__dirname, '..', '..', 'models', 'Card'),
  path.join(process.cwd(), 'models', 'Card'),
  './models/Card',
]);

const Accessory = tryRequire([
  path.join(__dirname, '..', 'models', 'Accessory'),
  path.join(__dirname, '..', '..', 'models', 'Accessory'),
  path.join(process.cwd(), 'models', 'Accessory'),
  './models/Accessory',
]);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/express_api_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB', MONGO_URI);

  // Sample card
  const existingCard = await Card.findOne({ nameFR: 'Pikachu (Sample)' });
  if (!existingCard) {
    const card = new Card({
      nameFR: 'Pikachu (Sample)',
      nameEN: 'Pikachu (Sample)',
      setCode: 'SMP',
      setNameFR: 'Sample Set',
      setNameEN: 'Sample Set',
      cardNumber: '001/001',
      rarity: 'Common',
      type: 'Pokémon',
      price: 1.5,
      stock: 10,
      images: { front: '', thumbnail: '' },
      description: 'Carte sample pour tests.',
      language: 'FR',
      format: ['Unlimited']
    });
    await card.save();
    console.log('Inserted sample card:', card._id.toString());
  } else {
    console.log('Sample card already exists:', existingCard._id.toString());
  }

  // Sample accessory
  const existingAccessory = await Accessory.findOne({ name: 'Sample Sleeves' });
  if (!existingAccessory) {
    const acc = new Accessory({
      name: 'Sample Sleeves',
      description: 'Manches de protection sample',
      shortDescription: '65 manches',
      category: 'sleeves',
      price: 4.99,
      stock: 50,
      images: { main: 'https://placehold.co/600x400', gallery: [], thumbnail: 'https://placehold.co/200x200' },
      specifications: { brand: 'SampleBrand', material: 'plastic', quantity: 65 }
    });
    await acc.save();
    console.log('Inserted sample accessory:', acc._id.toString());
  } else {
    console.log('Sample accessory already exists:', existingAccessory._id.toString());
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
