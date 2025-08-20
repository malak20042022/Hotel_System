const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },

    issueDate: {
        type: Date,
        default: Date.now,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'credit_card'],
        required: true,
    },

    isPaid: {
        type: Boolean,
        default: false,
    },
    bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    unique: true
  },
  CustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Invoice= mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
