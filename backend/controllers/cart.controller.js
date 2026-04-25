import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// helper: recalculate total
const calculateTotal = (items) => {
  return items.reduce(
    (acc, item) => acc + item.variant.priceAtTime * item.quantity,
    0,
  );
};

// add to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantLabel, quantity = 1 } = req.body;

    if (!productId || !variantLabel || quantity < 1) {
      return res.status(404).json({ message: "Invalid Input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variant = product.variants.find((v) => v.label === variantLabel);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // 🔥 STOCK CHECK
    if (variant.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const finalPrice = variant.discountPrice || variant.price;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variant.label === variantLabel,
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        name: product.title,
        image: product.thumbnail,
        vendor: product.vendor,
        variant: {
          label: variant.label,
          priceAtTime: finalPrice,
        },
      });
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    console.log("item added");

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Add to cart failed" });
  }
};

// update cart item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantLabel, quantity } = req.body;

    if (!productId || !variantLabel || quantity < 1) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.label === variantLabel,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantLabel } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.variant.label === variantLabel
        ),
    );

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Remove failed" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title thumbnail",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalAmount: 0 },
      });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetch cart failed" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Clear failed" });
  }
};
