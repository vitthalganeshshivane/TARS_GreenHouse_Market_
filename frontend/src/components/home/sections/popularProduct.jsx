import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../product/productCard";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useNavigate } from "react-router";
import CategoryAside from "../../customer/Category/CategoryAside";
import API from "../../../api/axios";

export default function PopularProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);

  const handleCategorySelect = async (slug) => {
    try {
      setFilterLoading(true);
      const { data } = await API.get(`/product/category/${slug}`);
      setFilteredProducts(data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setFilterLoading(false);
    }
  };

  const { products, loading, error } = useSelector((state) => state.product);

  const displayProducts = filteredProducts || products;

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
  if (filterLoading) return <p>Filtering...</p>;
  return (
    <section className="w-full px-6 py-4">
      <h2 className="px-4 text-xl md:text-3xl font-semibold mb-5">
        Popular Products
      </h2>

      <button
        onClick={() => setFilteredProducts(null)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded"
      >
        All Products
      </button>

      <div className="flex">
        {/* left side */}
        <div className="flex-1 flex flex-wrap justify-start gap-4 md:gap-6">
          {displayProducts.map((item) => {
            const defaultVariant = getDefaultVariant(item.variants);
            // console.log("variant", defaultVariant);
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

        {/* right side */}
        <div className="hidden lg:block w-70 shrink-0">
          <CategoryAside onSelectCategory={handleCategorySelect} />
        </div>
      </div>
    </section>
  );
}
