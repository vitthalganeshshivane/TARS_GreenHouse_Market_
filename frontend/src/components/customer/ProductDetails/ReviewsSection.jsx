import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, ImagePlus, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import {
  deleteReviewAsync,
  fetchMyReviewAsync,
  fetchProductReviewsAsync,
  submitReviewAsync,
} from "../../../redux/slices/reviewSlice";
import { fetchMyOrdersAsync } from "../../../redux/slices/orderSlice";

const StarButton = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="transition-transform hover:scale-105"
  >
    <Star
      className={active ? "fill-green-500 text-green-500" : "text-gray-300"}
      size={18}
    />
  </button>
);

export default function ReviewsSection({ product }) {
  const dispatch = useDispatch();
  const { items, ratings, myReview, loading, submitting } = useSelector(
    (state) => state.review,
  );
  const { myOrders } = useSelector((state) => state.order);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!product?._id) return;
    dispatch(fetchProductReviewsAsync(product._id));
    dispatch(fetchMyReviewAsync(product._id));
    dispatch(fetchMyOrdersAsync());
  }, [dispatch, product?._id]);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 5);
      setTitle(myReview.title || "");
      setComment(myReview.comment || "");
    }
  }, [myReview]);

  const hasPurchasedProduct = useMemo(() => {
    if (!product?._id || !myOrders?.length) return false;

    return myOrders.some((order) => {
      if (order?.orderStatus === "cancelled") return false;

      return (order?.items || []).some((item) => {
        const itemProductId =
          typeof item.product === "object" ? item.product?._id : item.product;
        return itemProductId?.toString() === product._id.toString();
      });
    });
  }, [myOrders, product?._id]);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPurchasedProduct && !myReview) {
      toast.error("Only verified purchases can leave reviews for this product");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a short feedback note");
      return;
    }

    const formData = new FormData();
    formData.append("rating", String(rating));
    formData.append("title", title.trim());
    formData.append("comment", comment.trim());

    files.forEach((file) => {
      formData.append("images", file);
    });

    const result = await dispatch(
      submitReviewAsync({ productId: product._id, formData }),
    );

    if (submitReviewAsync.fulfilled.match(result)) {
      toast.success("Review saved");
      setFiles([]);
    } else {
      toast.error(result.payload?.message || "Failed to save review");
    }
  };

  const handleDelete = async () => {
    if (!myReview?._id) return;
    const result = await dispatch(
      deleteReviewAsync({ reviewId: myReview._id }),
    );

    if (deleteReviewAsync.fulfilled.match(result)) {
      toast.success("Review deleted");
      setRating(5);
      setTitle("");
      setComment("");
      setFiles([]);
    } else {
      toast.error(result.payload?.message || "Failed to delete review");
    }
  };

  return (
    <div className="mt-5 border rounded-xl p-5 bg-white">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-black/80">
            Reviews & Feedback
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Only verified purchases can review this product
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {ratings?.average || 0}
            <span className="text-sm text-gray-400 font-medium"> / 5</span>
          </div>
          <div className="text-xs text-gray-500">
            {ratings?.count || 0} review(s)
          </div>
        </div>
      </div>

      {!hasPurchasedProduct && !myReview ? (
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
          You need to buy this product before you can leave a review.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <StarButton
                  key={value}
                  active={value <= rating}
                  onClick={() => setRating(value)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short note
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Fresh and well packed"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add photos
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-2.5 text-sm text-gray-500 hover:border-green-300 hover:bg-green-50">
                <ImagePlus size={16} className="text-green-600" />
                Upload up to 5 photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback note
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write a short review about taste, freshness, packaging, delivery, or value."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none"
            />
          </div>

          {!!previews.length && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((img, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-xl border border-gray-200"
                >
                  <img
                    src={img.url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting || (!hasPurchasedProduct && !myReview)}
              className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {myReview ? "Update Review" : "Submit Review"}
            </button>

            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-6 border-t border-gray-100 pt-5">
        <h3 className="text-lg font-semibold text-black/80">
          Customer reviews
        </h3>

        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading reviews...</div>
        ) : items.length === 0 ? (
          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
            No reviews yet. Be the first to add feedback.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {items.map((review) => (
              <div
                key={review._id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700 overflow-hidden">
                      {review.user?.image ? (
                        <img
                          src={review.user.image}
                          alt={review.user?.name || "User"}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {review.user?.name || "Customer"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        {review.isVerifiedPurchase && (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                            Verified purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={14}
                        className={
                          value <= review.rating
                            ? "fill-green-500 text-green-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <div className="mt-3 text-sm font-semibold text-gray-800">
                    {review.title}
                  </div>
                )}

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {review.comment}
                </p>

                {!!review.images?.length && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {review.images.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Review ${index + 1}`}
                        className="h-20 w-full rounded-lg object-cover border border-gray-100"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
