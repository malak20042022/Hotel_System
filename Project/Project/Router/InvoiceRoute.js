const express= require('express');
const { getAllInvoices, InvoicesById, createInvoice,updateInvoice, deleteInvoice } = require('../Controller/InvoiceController');
const { protect,restrictTo } = require('../Controller/AuthController');

const router = express.Router();
router.use(protect);

router.get('/',restrictTo("staff"),getAllInvoices);
router.get('/:id',InvoicesById);
router.post('/',restrictTo("staff"),createInvoice); 
router.patch('/:id',restrictTo("staff"),updateInvoice);
router.delete('/:id',restrictTo("staff"),deleteInvoice);

module.exports = router;