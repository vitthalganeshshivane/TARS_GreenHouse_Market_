import { Link } from "react-router";

export default function Topbar() {
  return (
    <div className="hidden lg:block border-b bg-white text-xs md:text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between">
        {/* LEFT */}
        <div className="text-gray-500 flex items-center gap-3 md:gap-4 flex-wrap">
          <Link to="/about" className="hover:text-primary transition">
            About Us
          </Link>
          <Link to="/account" className="hover:text-primary transition">
            My Account
          </Link>
          <Link to="/wishlist" className="hover:text-primary transition">
            Wishlist
          </Link>
          <Link to="/tracking" className="hover:text-primary transition">
            Order Tracking
          </Link>
        </div>

        {/* CENTER */}
        <div className="text-green-500 hidden xl:block text-center">
          100% Secure delivery without contacting the courier
        </div>

        {/* RIGHT */}
        <Link
          to="tel:+917828767035"
          className="hover:text-primary transition whitespace-nowrap"
        >
          Need Help? Call us{" "}
          <span className="text-green-500 font-medium">+91 7828767035</span>
        </Link>
      </div>
    </div>
  );
}
