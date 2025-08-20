const express= require('express');
const { getAllReviews, ReviewsById, createReview, updateReview, deleteReview } = require('../Controller/ReviweController');
const {protect, restrictTo}=require('../Controller/AuthController');

const router = express.Router();
router.use(protect);

router.get('/',getAllReviews);
router.get('/:id',ReviewsById);
router.post('/',restrictTo("customer"),createReview);
router.patch('/:id',restrictTo("customer"),updateReview);
router.delete('/:id',deleteReview);

module.exports = router;