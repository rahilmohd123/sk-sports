import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

// @desc    Get Razorpay Key
// @route   GET /api/payment/razorpay/config
// @access  Private
export const getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: 'receipt_' + crypto.randomBytes(4).toString('hex')
    };

    const order = await instance.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment details' });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};
