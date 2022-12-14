const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51LXUdaAYllmvDdRqfbye5yZGirX5g26bj8Ct0gLoawLPzyuzYeLv2NkkdCssRxFgSDw9ZAcDyNpAPS0UEc3tYrWn00XvpTzw72"
);
const orderSchema = require("../models/orderModel");

router.post("/placeorder", async (req, res) => {
  const { token, subTotal, currentUser, cartItems } = req.body;
  const idempotencyKey = uuidv4();
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: subTotal * 100,
        currency: "pkr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey,
      }
    );
    if (payment) {
      const newOrder = new orderSchema({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subTotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          pincode: token.card.address_zip,
        },
        transactionId: payment.source.id,
      });
      newOrder.save();
      res.status(200).send("Payment Success");
    } else {
      res.send("Payment Failed");
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.stack });
  }
});

router.post("/getuserorder", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await orderSchema.find({ userid }).sort({_id: "-1"});
    res.status(200).send(orders);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.stack });
  }
});

router.get("/getalluserorder", async (req, res) => {
  try {
    const orders = await orderSchema.find({});
    res.status(200).send(orders);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.stack });
  }
});

router.get("/deliverorder", async (req, res) => {
  const orderid = req.body.orderid;
  try {
    const order = await orderSchema.findOne({_id: orderid});
    order.isDeliverd = true;
    await order.save();
    res.status(200).send("Order Deliverd Success");
  } catch (error) {
    res
      .status(400)
      .json({ message: "Something went wrong", error: error.stack });
  }
});

module.exports = router;
