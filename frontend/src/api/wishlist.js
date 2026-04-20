import API from "./axios";

export const fetchWishlistApi = () => API.get("/wishlist");
export const addToWishlistApi = (productId) =>
  API.post(`/wishlist/${productId}`);
export const removeFromWishlistApi = (productId) =>
  API.delete(`/wishlist/${productId}`);
