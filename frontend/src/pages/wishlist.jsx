import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import Topbar from "../components/layout/topbar.jsx";
import Navbar from "../components/layout/navbar.jsx";
import Footer from "../components/layout/footer.jsx";
import ProductCard from "../components/product/productCard";
import Loader from "../components/Loader.jsx";

function getDefaultVariant(variants) {
  if (!variants || variants.length === 0) return null;

  return variants.reduce((min, curr) => {
    return curr.price < min.price ? curr : min;
  }, variants[0]);
}

export default function WishlistPage() {
  const { items, loading } = useSelector((state) => state.wishlist);

  const wishlistItems = useMemo(() => items || [], [items]);

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      <div className="border">
        {/* <div className="px-10">
          <Topbar />
        </div> */}
        <div className="px-5 md:px-15">
          <Navbar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">
              {wishlistItems.length} saved items
            </p>
          </div>

          <Link
            to="/all-products"
            className="text-sm font-medium text-green-600 hover:text-green-700"
          >
            Continue shopping
          </Link>
        </div>

        {loading && wishlistItems.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Loader
              title="Loading wishlist..."
              subtitle="Fetching your wishlist..."
              plain
            />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Heart className="mx-auto mb-4 text-gray-300" size={44} />
            <h2 className="text-xl font-semibold text-gray-700">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Save products here to view them later.
            </p>
            <Link
              to="/all-products"
              className="inline-flex mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-white text-sm font-medium"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {wishlistItems.map((item) => {
              const defaultVariant = getDefaultVariant(item.variants);

              return (
                <ProductCard
                  key={item._id}
                  productId={item._id}
                  image={item.thumbnail}
                  category={item.category}
                  name={item.title}
                  rating={item.ratings?.average || 4}
                  ratingCount={item.ratings?.count || 20}
                  brand={item.brand}
                  price={defaultVariant?.price}
                  discount={defaultVariant?.discountPrice || 0}
                  label={defaultVariant?.label}
                  sale={true}
                  navigate={() => navigate(`/product/${item._id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
