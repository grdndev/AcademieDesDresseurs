const express = require('express');
const router = express.Router();
const Promocode = require('../models/Promocode');
const { authenticate, requireEditor } = require('../middleware/auth');

// Créer un code promo
router.post('/', authenticate, requireEditor, async (req, res) => {
  try {
    const { code, discountType, amount, startDate, endDate } = req.body;

    // Vérifier que le code n'existe pas déjà
    const existing = await Promocode.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Code promo déjà existant' });
    }

    const promocode = new Promocode({
      code,
      discountType,
      amount,
      startDate,
      endDate
    });

    await promocode.save();
    res.status(201).json(promocode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un code promo
router.delete('/:id', authenticate, requireEditor, async (req, res) => {
  try {
    const { id } = req.params;
    const promocode = await Promocode.findByIdAndDelete(id);
    if (!promocode) {
      return res.status(404).json({ message: 'Code promo non trouvé' });
    }
    res.json({ message: 'Code promo supprimé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
