import express from "express"
import payment, { verifyPayment } from "../middlewares/payment.js"
import { auth } from "../middlewares/authenticationMiddleware.js";
const paymentRouter = express.Router()

paymentRouter.post("/payment",auth, payment)

paymentRouter.post("/payment/verify", verifyPayment)

export default paymentRouter;