import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../../redux/slices/productSlice";
import { useParams } from "react-router";
import Navbar from "../../layout/navbar";

import ProductInfoSection from "./ProductInfoSection";
import ProductModal from "./ProductModal";

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
      <div className="px-10 border-1 border-gray-100">
        <Navbar />
      </div>
      <div>
        <ProductModal product={singleProduct} />

        <div className="max-w-[700px] mx-auto pb-50 px-5">
          <ProductInfoSection product={singleProduct} />
        </div>
      </div>
    </div>
  );
}
