import { Link } from "react-router";

export default function Topbar() {
  return (
    <div className="text-xs md:text-sm p-2 flex flex-col md:flex-row justify-center md:justify-around items-center gap-2 md:gap-0 border-b">
      <div className="text-gray-500 flex flex-wrap justify-center gap-2 md:gap-0">
        <Link className="md:ml-4 hover:text-primary transition" href='/about'>About Us</Link>
        <Link className="md:ml-4 hover:text-primary transition" href='/account'>My Account</Link>
        <Link className="md:ml-4 hover:text-primary transition" href='/whishlist'>Whishlist</Link>
        <Link className="md:ml-4 hover:text-primary transition" href='/tracking'>Order Tracking</Link>
      </div>

      <div className="text-green-500 text-center hidden md:block">
        100% Secure delivery without contacting the courier
      </div>

      <Link href='tel:+917828767035' className="hover:text-primary transition text-center">
        Need Help?Call us <span className="text-green-500">+917828767035</span>
      </Link>

    </div>
  )
}

