const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    reviewDate: {
      type: Date,
      required: false
    }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;