import React, { useEffect } from "react";
import ProductImage from "./ProductImage";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct } from "../../../redux/slices/productSlice";
import { useParams } from "react-router";
import Navbar from "../../layout/navbar";
import ProductInfo from "./ProductInfo";
import ProductData from "./ProductData";
import ProductInfoSection from "./ProductInfoSection";

export default function ProductDetail() {
  const { id } = useParams();
  const { singleProduct, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [id]);

  useEffect(() => {
    console.log("single product:", singleProduct);
  }, []);

  if (!singleProduct || loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-10 border-1 border-gray-100">
        <Navbar />
      </div>
      <div>
        <div className="max-w-[700px]  mx-auto flex justify-center mt-5 p-5 gap-5">
          <ProductImage images={singleProduct.images} />
          <div>
            <ProductInfo product={singleProduct} />
            <ProductData product={singleProduct} />
          </div>
        </div>

        <div className="max-w-[700px] mx-auto pb-50">
          <ProductInfoSection product={singleProduct} />
        </div>
      </div>
    </div>
  );
}
