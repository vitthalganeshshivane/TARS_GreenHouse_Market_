import API from "./axios";

export const fetchProductReviewsApi = (productId) =>
  API.get(`/reviews/product/${productId}`);

export const fetchMyReviewApi = (productId) =>
  API.get(`/reviews/product/${productId}/me`);

export const upsertReviewApi = (productId, formData) =>
  API.post(`/reviews/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteReviewApi = (reviewId) => API.delete(`/reviews/${reviewId}`);
