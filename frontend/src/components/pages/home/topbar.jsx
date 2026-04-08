import { Link } from "react-router";

export default function Topbar() {
  return (
    // <<<<<<< HEAD
    //     <div className="hidden md:block border-b bg-white text-xs md:text-sm">
    //       <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between">
    //         {/* LEFT */}
    //         <div className="text-gray-500 flex items-center gap-3 md:gap-4 flex-wrap">
    //           <Link to="/about" className="hover:text-primary transition">
    //             About Us
    //           </Link>
    //           <Link to="/account" className="hover:text-primary transition">
    //             My Account
    //           </Link>
    //           <Link to="/wishlist" className="hover:text-primary transition">
    //             Wishlist
    //           </Link>
    //           <Link to="/tracking" className="hover:text-primary transition">
    //             Order Tracking
    //           </Link>
    //         </div>
    //
    //         {/* CENTER */}
    //         <div className="text-green-500 hidden xl:block text-center">
    //           100% Secure delivery without contacting the courier
    //         </div>
    //
    //         {/* RIGHT */}
    //         <Link
    //           to="tel:+917828767035"
    //           className="hover:text-primary transition whitespace-nowrap"
    //         >
    //           Need Help? Call us{" "}
    //           <span className="text-green-500 font-medium">+91 7828767035</span>
    //         </Link>
    // =======
    <div className="hidden md:flex text-xs py-1 md:text-sm  flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-0 ">
      <div className="text-gray-500 flex flex-wrap min-w-90 justify-between ">
        <Link className=" hover:text-primary transition" href='/about'>About Us</Link>
        <Link className=" hover:text-primary transition" href='/account'>My Account</Link>
        <Link className=" hover:text-primary transition" href='/whishlist'>Whishlist</Link>
        <Link className=" hover:text-primary transition" href='/tracking'>Order Tracking</Link>
      </div>
    </div>
  );
}
