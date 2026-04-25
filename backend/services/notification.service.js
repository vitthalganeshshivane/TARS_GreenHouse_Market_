import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Wishlist from "../models/WishList.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMAIL_TEMPLATE_TYPES = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  IN_STOCK: "IN_STOCK",
  OTP: "OTP",
  WELCOME: "WELCOME",
};

const STOCK_NOTIFICATION_TYPES = {
  OUT_OF_STOCK: EMAIL_TEMPLATE_TYPES.OUT_OF_STOCK,
  IN_STOCK: EMAIL_TEMPLATE_TYPES.IN_STOCK,
};

const TEMPLATE_MAP = {
  [EMAIL_TEMPLATE_TYPES.OUT_OF_STOCK]: {
    fileName: "out-of-stock-email.html",
    subject: "Product from your wishlist is now out of stock",
  },
  [EMAIL_TEMPLATE_TYPES.IN_STOCK]: {
    fileName: "back-in-stock-email.html",
    subject: "Product from your wishlist is back in stock",
  },
  [EMAIL_TEMPLATE_TYPES.OTP]: {
    fileName: "otp-email.html",
    subject: "Your GreenHouse Market verification code",
  },
  [EMAIL_TEMPLATE_TYPES.WELCOME]: {
    fileName: "welcome-email.html",
    subject: "Welcome to GreenHouse Market",
  },
};

const getEmailTemplatePath = (fileName) => {
  return path.join(__dirname, "../templates/emails", fileName);
};

const replacePlaceholders = (template, data = {}) => {
  return template.replace(/{{\s*([^{}\s]+)\s*}}/g, (_, key) => {
    return data[key] ?? "";
  });
};

const renderEmailTemplate = async (type, data) => {
  const config = TEMPLATE_MAP[type];

  if (!config) {
    throw new Error(`Unsupported stock notification type: ${type}`);
  }

  const templatePath = getEmailTemplatePath(config.fileName);
  const template = await fs.readFile(templatePath, "utf-8");
  const html = replacePlaceholders(template, data);

  return {
    subject: config.subject,
    html,
  };
};

const getWishlistUsersForProduct = async (productId) => {
  const wishlists = await Wishlist.find({
    products: productId,
  }).populate("user", "name email");

  const uniqueUsersMap = new Map();

  for (const wishlist of wishlists) {
    const user = wishlist.user;

    if (!user?._id || !user?.email) continue;

    const key = user._id.toString();

    if (!uniqueUsersMap.has(key)) {
      uniqueUsersMap.set(key, {
        _id: user._id,
        name: user.name || "User",
        email: user.email,
      });
    }
  }

  return Array.from(uniqueUsersMap.values());
};

const dispatchEmailNotification = async ({ to, subject, html }) => {
  await sendEmail(to, subject, html);
};

export const sendTemplatedEmail = async ({ type, to, data }) => {
  const { subject, html } = await renderEmailTemplate(type, data);

  await dispatchEmailNotification({
    to,
    subject,
    html,
  });
};

export const detectStockNotificationType = ({ oldStock, newStock }) => {
  const wasInStock = Number(oldStock) > 0;
  const isInStock = Number(newStock) > 0;

  if (wasInStock && !isInStock) {
    return STOCK_NOTIFICATION_TYPES.OUT_OF_STOCK;
  }

  if (!wasInStock && isInStock) {
    return STOCK_NOTIFICATION_TYPES.IN_STOCK;
  }

  return null;
};

export const notifyWishlistUsersForStockChange = async ({
  product,
  oldStock,
  newStock,
}) => {
  const notificationType = detectStockNotificationType({ oldStock, newStock });

  if (!notificationType) {
    return {
      success: true,
      skipped: true,
      reason: "No stock boundary change detected",
    };
  }

  const users = await getWishlistUsersForProduct(product._id);

  if (!users.length) {
    return {
      success: true,
      skipped: true,
      reason: "No wishlist users found for this product",
    };
  }

  const results = await Promise.allSettled(
    users.map(async (user) => {
      const { subject, html } = await renderEmailTemplate(notificationType, {
        username: user.name,
        productName: product.title,
        productImage: product.thumbnail || "",
        productId: product._id.toString(),
        shopUrl: `${process.env.CLIENT_URL}/product/${product._id}`,
      });

      await dispatchEmailNotification({
        to: user.email,
        subject,
        html,
      });

      return user.email;
    }),
  );

  const sent = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  const failed = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason?.message || "Email sending failed");

  return {
    success: true,
    type: notificationType,
    totalUsers: users.length,
    sentCount: sent.length,
    failedCount: failed.length,
    sent,
    failed,
  };
};
