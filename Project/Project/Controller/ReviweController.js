const Review=require('../Model/Review.js');
const {catchAsync} = require('../Utils/CatchAsync.js');
const AppError=require('../Utils/AppError.js')

const saveData = async (data) => {
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find().populate('customerId').populate('roomId');

    res.status(200).json({ message: 'Reviews fetched successfully', reviews });
});

exports.ReviewsById = catchAsync(async (req, res, next) => {
    const getReviewById = await Review.findById(req.params.id).populate('customerId').populate('roomId');
    if (!getReviewById) {
        return next(new AppError('Review not found', 404));
    }
    res.status(200).json({ message: 'Review fetched successfully', getReviewById });
});


exports.createReview = catchAsync(async (req, res, next) => {
  const {roomId,paymentMethod ,rating,reviewDate} = req.body;

  if (!roomId) {
    return next(new AppError("room ID is required", 400));
  }

  const review= await Review.create({
   customerId:req.user._id, 
   roomId, 
   paymentMethod,
    rating,
    reviewDate,
  });
  res.status(201).json({
    status: "success",
    data: review,
  });
})

exports.updateReview = catchAsync(async (req, res, next) => {

    const updateReview = await Review.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
        );
        if (!updateReview) {
            return next(new AppError('Review not found', 404));
        }
        res.status(200).json({ message: 'Review updated successfully' ,updateReview});
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
        return next(new AppError('Review not found', 404));
    }
    res.status(200).json({ message: 'Review deleted successfully' });
});

