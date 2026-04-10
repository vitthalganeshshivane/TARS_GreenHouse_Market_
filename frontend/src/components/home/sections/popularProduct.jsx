import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../product/productCard";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useNavigate } from "react-router";

export default function PopularProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
    console.log("All Product:", products);
  }, [dispatch]);

  const getDefaultVariant = (variants) => {
    if (!variants || variants.length === 0) return null;

    return variants.reduce((min, curr) => {
      return curr.price < min.price ? curr : min;
    }, variants[0]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <section className="w-full px-6 py-4">
      <h2 className="px-4 text-xl md:text-3xl font-semibold mb-5">
        Popular Products
      </h2>

      <div className="flex flex-wrap justify-start gap-4 md:gap-6">
        {products.map((item) => {
          const defaultVariant = getDefaultVariant(item.variants);
          console.log("variant", defaultVariant);
          return (
            <ProductCard
              key={item._id}
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
    </section>
  );
}
