import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../../redux/slices/productSlice";
import { useParams } from "react-router";
import Navbar from "../../layout/navbar";
import ProductInfoSection from "./ProductInfoSection";
import ProductModal from "./ProductModal";
import BackHeader from "../../common/BackHeader";
import ProductCartSummary from "./ProductCartSummary";
import ReviewsSection from "./ReviewsSection";

export default function ProductDetail() {
  const { id } = useParams();
  const { singleProduct, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [id]);

  // useEffect(() => {
  //   console.log("single product:", singleProduct);
  // }, []);

  if (!singleProduct || loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* <div className="px-10 border-1 border-gray-100">
        <Navbar />
      </div> */}
      <BackHeader title="Product" fallback="/home" />
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ProductModal product={singleProduct} />
            <ProductInfoSection product={singleProduct} />
            <ReviewsSection product={singleProduct} />
          </div>

          <div className="lg:col-span-1">
            <ProductCartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
