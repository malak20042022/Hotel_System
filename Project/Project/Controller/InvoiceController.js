const Invoice=require('../Model/Invoices.js');
const booking=require('../Model/Booking.js');
const {catchAsync} = require('../Utils/CatchAsync.js');
const AppError = require('../Utils/AppError.js');

const saveData=async(Data)=>{
    await fs.writeFile(filepath,JSON.stringify(Data,null,2));
};

exports.getAllInvoices=catchAsync(async(req,res,next)=>{
    const Invoices=await Invoice.find().populate('bookingId').populate('CustomerId');

  res.status(200).json({ message: 'Invoices fetched successfully', Invoices });
});
exports.InvoicesById=catchAsync(async(req,res,next)=>{
    const getInvoiceById=await Invoice.findById(req.params.id).populate('bookingId').populate('CustomerId');
    if(!getInvoiceById){
        return next(new AppError('Invoice not found', 404));
    }
    res.status(200).json({message:'invoice fetched successfully', getInvoiceById});
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  const {issueDate, paymentMethod, isPaid,bookingId} = req.body;

  if (!bookingId) {
    return next(new AppError("Booking ID is required", 400));
  }
const booked=await booking.findById(bookingId)
if(!bookingId){
  return next(new AppError('booking not found', 404));
}

  if (!booked.customerId) {
    return next(new AppError('Booking does not have a linked customer', 400));
  }

const invoice= await Invoice.create({
   amount:booked.totalPrice, 
   issueDate, 
   paymentMethod,
    isPaid,
    bookingId,
    CustomerId: booked.customerId
  });
  res.status(201).json({
    status: "success",
    data: invoice,
  });
});

exports.updateInvoice=catchAsync(async(req,res,next)=>{
    const updateInvoice= await Invoice.findByIdAndUpdate(
        {_id: req.params.id},
        req.body,
            {new: true, runValidators: true}
       );
       if (!updateInvoice) {
    return next(new AppError('Invoice not found', 404));
  }
  res.status(200).json({ message: 'Invoice updated successfully', updateInvoice });
});

exports.deleteInvoice=catchAsync(async(req,res,next)=>{
    const deletedInvoice=await Invoice.findByIdAndDelete(req.params.id);
    if(!deletedInvoice){
        return next(new AppError('Invoice not found', 404));
    }
    res.status(200).json({message:'Invoice deleted successfully'});
});
