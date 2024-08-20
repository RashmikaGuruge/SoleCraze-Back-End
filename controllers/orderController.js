import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import Stripe from 'stripe';
import cartModel from "../models/cartModel.js";
import createError from "../utils/createError.js";

export const intent = async (req,res,next) => {
  const stripe = new Stripe(
    process.env.STRIPE
  );

  const cart = await cartModel.findById(req.params.cartId);

  if (!cart) {
    return res.status(400).send("Cart not found");
  }

  let amount = 0;

      // Check if cart.products is defined and not empty before using reduce
      if (cart.products && cart.products.length > 0) {
          amount = cart.products.reduce((total, product) => {
              return total + (product.price * product.quantity || 0);
          }, 0);
      }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new orderModel({
    userId: cart.userId,
    products: cart.products,
    amount: amount,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret : paymentIntent.client_secret
  });
}

// export const createOrder = async (req, res, next) => {
//   try {
//       const cart = await cartModel.findById(req.params.cartId);

//       if (!cart) {
//           return res.status(400).send("Cart not found");
//       }

//       let amount = 0;

//       // Check if cart.products is defined and not empty before using reduce
//       if (cart.products && cart.products.length > 0) {
//           amount = cart.products.reduce((total, product) => {
//               return total + (product.price * product.quantity || 0);
//           }, 0);
//       }

//       // Check if amount is a valid number
//       if (isNaN(amount)) {
//           return res.status(400).send("Invalid amount");
//       }

//       console.log(cart);

//       const newOrder = new orderModel({
//           userId: cart.userId,
//           products: cart.products,
//           amount: amount,
//           payment_intent: "temporary",
//       });

//       await newOrder.save();
//       res.status(200).send("Order Successful!");
//   } catch (err) {
//       next(err);
//   }
// };



export const getOrders = async (req, res, next) => {
    try {
      const orders = await orderModel.find({
        userId: req.params.userId,
        isCompleted: true,
      });
  
      res.status(200).send(orders);
    } catch (err) {
      next(err);
    }
};

export const getAllOrders = async (req, res, next) => {
    if(!req.isAdmin) return next(createError(403, "Users can't view all Orders!"));
    const query = req.query.new;
    
    try {
      const orders = query
            ? await orderModel.find({ isCompleted: true }).sort({ _id: -1 }).limit(4)
            : await orderModel.find({ isCompleted: true }).sort({ _id: -1 });

      res.status(200).send(orders);
    } catch (err) {
      next(err);
    }
};


export const confirm = async (req, res, next) => {
    try {
      const order = await orderModel.findOneAndUpdate(
        {
          payment_intent: req.body.payment_intent
        },
        {
          $set: {
            isCompleted: true
          }
        }
      );

  
      // Assuming your order model has a field named `products` containing an array of products in the order
      const productsInOrder = order.products;
  
      // Iterate through each product in the order and update its stock
      for (const productInOrder of productsInOrder) {
        const product = await productModel.findById(productInOrder.productId);
  
        // Check if the product exists and has enough stock
        if (product && product.stock >= productInOrder.quantity) {
          // Update the product stock
          product.stock -= productInOrder.quantity/2;
  
          // Save the updated product
          await product.save();
        } else {
          // Handle insufficient stock or missing product (you may want to throw an error)
          // For simplicity, we'll just log a message here
          console.error(`Insufficient stock for product with ID: ${productInOrder.productId}`);
        }
      }
  
      res.status(200).send("Order has been confirmed");
    } catch (err) {
      next(err);
    }
  };
  

export const getMonthlyIncome = async (req, res, next) => {
  if(!req.isAdmin) return next(createError(403, "Users can't view Monthly Income!"));

  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};


export const getMonthlyProductIncome = async (req, res, next) => {
  if(!req.isAdmin) return next(createError(403, "Users can't view monthly product income!"));

  const productId = req.params.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};