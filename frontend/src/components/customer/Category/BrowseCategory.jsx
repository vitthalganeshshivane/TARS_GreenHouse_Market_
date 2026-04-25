import { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "../../../api/axios";
import ProductCard from "../ProductCard.jsx";

export default function BrowseCategory() {
  const { slug } = useParams();
  console.log("slug from params:", slug);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!slug) {
      console.log("Slug not ready yet");
      return; // 🚨 STOP API CALL
    }
    const fetchProducts = async () => {
      const res = await API.get(`/product/category/${slug}`);
      console.log("product list:", res.data.products);
      setProducts(res.data.products);
    };

    fetchProducts();
  }, [slug]);

  return (
    <div className="flex">
      {/* LEFT SIDEBAR */}
      {/* <div className="w-1/4">
        <CategoryAside />
      </div> */}

      {/* RIGHT CONTENT */}
      <div className="w-3/4 p-4">
        <h1 className="text-xl font-bold mb-4">{slug}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
