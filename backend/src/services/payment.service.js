import Razorpay from "razorpay";
import config from "../config/config.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";


const razorpay = new Razorpay({
  key_id:config.RazorPay_Key,
  key_secret:config.RazorPay_Secret
})


export async function createOrderService(amount,currency) {
    const options = {
        amount: amount*100,
        currency
    }
    const order = await razorpay.orders.create(options)
    return order
}

export async function verifyOrderService(orderId,paymentId,signature) {
    
    const razorSecret = config.RazorPay_Secret;
    const result = validatePaymentVerification({order_id:orderId,payment_id:paymentId},signature,razorSecret)
    console.log(result)
    if(!result){
        return false
    }
    return true
}