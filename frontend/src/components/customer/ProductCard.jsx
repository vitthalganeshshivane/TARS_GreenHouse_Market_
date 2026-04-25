import ProductCard from "../product/productCard";

function getDefaultVariant(variants) {
  if (!variants || variants.length === 0) return null;

  return variants.reduce((min, curr) => {
    return curr.price < min.price ? curr : min;
  }, variants[0]);
}

export default function ProductCard2({ product }) {
  if (!product) return null;

  const defaultVariant = getDefaultVariant(product.variants);

  return (
    <ProductCard
      productId={product._id}
      image={product.thumbnail}
      category={product.category}
      name={product.title}
      rating={product.ratings?.average || 4}
      ratingCount={product.ratings?.count || 20}
      brand={product.brand}
      price={defaultVariant?.price || 0}
      discount={defaultVariant?.discountPrice || 0}
      label={defaultVariant?.label || ""}
      sale={true}
    />
  );
}

// import { useSelector } from "react-redux";
// import ProductCard from "../product/productCard";

// export default function ProductCard2({ product }) {
//   const getDefaultVariant = (variants) => {
//     if (!variants || variants.length === 0) return null;

//     return variants.reduce((min, curr) => {
//       return curr.price < min.price ? curr : min;
//     }, variants[0]);
//   };

//   const defaultVariant = getDefaultVariant(product.variants);
//   return <div></div>;
// }
