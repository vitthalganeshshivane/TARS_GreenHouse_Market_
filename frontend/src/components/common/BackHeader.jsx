import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import NavbarBtn from "../layout/navbarBtn";
import { useSelector } from "react-redux";

export default function BackHeader({ title, fallback = "/" }) {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    // sticky top-0 z-50
    <div className="flex items-center justify-between py-1 px-1 sm:py-3 sm:px-10  border-b border-gray-150 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <button
          onClick={handleBack}
          className="py-2 px-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </button>

        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center justify-between gap-4 py-2 px-2">
        {/* <NavbarBtn icon={<Recycle />} text="Compare" link="/compare" /> */}
        <NavbarBtn
          icon={<Heart size={18} />}
          text="Wishlist"
          link="/wishlist"
        />
        <NavbarBtn
          icon={<ShoppingCart size={18} />}
          text="Cart"
          link="/cart"
          badge={{ status: totalItems > 0, value: totalItems }}
        />
        <NavbarBtn icon={<User size={18} />} text="Account" link="/account" />
      </div>
    </div>
  );
}
