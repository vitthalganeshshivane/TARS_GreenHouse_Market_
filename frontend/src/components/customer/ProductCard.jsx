import { useSelector } from "react-redux";
import ProductCard from "../product/productCard";

export default function ProductCard2({ product }) {
  const getDefaultVariant = (variants) => {
    if (!variants || variants.length === 0) return null;

    return variants.reduce((min, curr) => {
      return curr.price < min.price ? curr : min;
    }, variants[0]);
  };

  const defaultVariant = getDefaultVariant(product.variants);
  return <div></div>;
}
