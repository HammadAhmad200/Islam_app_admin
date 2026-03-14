const mongoose = require('mongoose');

const donationTypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['regular', 'zakat', 'emergency'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DonationType', donationTypeSchema);
