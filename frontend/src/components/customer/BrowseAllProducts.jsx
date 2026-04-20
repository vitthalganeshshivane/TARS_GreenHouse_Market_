import API from "../../api/axios";
import ProductCard from "../product/productCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/layout/navbar";
import ProductModal from "./ProductDetails/ProductModal";

export default function BrowseAllProducts() {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const getDefaultVariant = (variants) => {
    if (!variants || variants.length === 0) return null;

    return variants.reduce((min, curr) => {
      return curr.price < min.price ? curr : min;
    }, variants[0]);
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get("/product/grouped-by-category");
      setData(res.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-white px-6 pb-4">
      <Navbar />
      {data.map((cat) => (
        <div key={cat.categoryId} className="mb-8 mt-5">
          <h2 className="text-xl font-bold mb-4">{cat.categoryName}</h2>

          <div className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 sm:gap-4">
            {cat.products.map((p) => {
              const defaultVariant = getDefaultVariant(p.variants);

              return (
                <div
                  key={p._id}
                  className="w-full"
                  onClick={() => setSelectedProduct(p)}
                >
                  <ProductCard
                    productId={p._id}
                    image={p.thumbnail}
                    category={p.category}
                    name={p.title}
                    rating={p.ratings?.average || 4}
                    ratingCount={p.ratings?.count || 20}
                    brand={p.brand}
                    price={defaultVariant?.price}
                    discount={defaultVariant?.discountPrice || 0}
                    label={defaultVariant?.label}
                    sale={true}
                  />

                  {/* <ProductCard
                    image={p.thumbnail}
                    category={p.category}
                    name={p.title}
                    rating={p.ratings?.average || 4}
                    ratingCount={p.ratings?.count || 20}
                    brand={p.brand}
                    price={defaultVariant?.price}
                    discount={defaultVariant?.discountPrice || 0}
                    label={defaultVariant?.label}
                    sale={true}
                  /> */}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedProduct && (
        <div
          className="px-5 fixed inset-0 bg-black/30 z-50 flex justify-center items-center"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
