import {
  X,
  Grid,
  Star,
  Home,
  ShoppingBag,
  Percent,
  Info,
  PhoneCall,
  Mail,
  User,
  Heart,
  ShoppingCart,
  Recycle,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Navigations } from "./navigation";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-1">
              <Leaf className="h-7 w-7 fill-emerald-700 text-emerald-700" />
              <span className="text-xl font-bold text-green-800">
                Greenhouse Market
              </span>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Section */}
            <div className="p-4 border-b bg-gray-50">
              <Link to="/account" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">
                QUICK LINKS
              </h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 hover:text-primary transition"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 hover:text-primary transition"
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                  <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 hover:text-primary transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link>
                {/* <Link 
                  to="/compare"
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 hover:text-primary transition"
                >
                  <Recycle className="w-5 h-5" />
                  <span>Compare</span>
                  <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link> */}
              </div>
            </div>

            {/* Categories */}
            <div className="p-4 border-b">
              <Button className="bg-primary text-white flex items-center gap-2 w-full justify-start mb-3">
                <Grid className="w-4 h-4" />
                <span className="font-medium">Browse All Categories</span>
              </Button>
              <Link
                to="/hot-deals"
                onClick={onClose}
                className="flex items-center gap-3 py-2 hover:text-primary transition"
              >
                <Star className="w-5 h-5" />
                <span>Hot Deals</span>
              </Link>
            </div>

            {/* Navigation Links */}
            {/* <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">MENU</h3>
              <div className="flex flex-col space-y-2">
                <Navigations mobile onClose={onClose} />
              </div>
            </div> */}

            {/* Vendor Section */}
            <div className="p-4 border-b">
              <Button
                variant="outline"
                className="w-full text-primary justify-center"
              >
                <span>Become Vendor</span>
              </Button>
            </div>
          </div>

          {/* Footer - Contact */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <PhoneCall className="text-primary w-6 h-6" />
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-primary">7828767035</span>
                <span className="text-xs text-gray-500">
                  24/7 Support Center
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
