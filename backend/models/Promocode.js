const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
  // Code promo
  code: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  }
});

promocodeSchema.methods.isValid = function() {
  const now = new Date();
  if (this.startDate && this.startDate > now) {
    return false;
  }
  if (this.endDate && this.endDate < now) {
    return false;
  }
  return true;
};

promocodeSchema.methods.calculateDiscount = function(total) {
  if (this.type === 'percentage') {
    return total * this.amount / 100;
  } else if (this.type === 'fixed') {
    return Math.min(total, this.amount);
  }

  return 0;
};

module.exports = mongoose.model('Promocode', promocodeSchema);
