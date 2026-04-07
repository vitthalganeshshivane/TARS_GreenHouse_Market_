import { Link } from "react-router";

export default function Topbar() {
  return (
    <div className="flex justify-around border-b">
      <div className="text-gray-500 flex">
        <Link className="ml-4" href='/about'>About Us</Link>
        <Link className="ml-4" href='/account'>My Account</Link>
        <Link className="ml-4" href='/whishlist'>Whishlist</Link>
        <Link className="ml-4" href='/tracking'>Order Tracking</Link>
      </div>

      <div className="text-green-500">
        100% Secure delivery without contacting the courier
      </div>

      <Link href='tel:+917828767035'>
        Need Help?Call us <span className="text-green-500">+917828767035</span>
      </Link>

    </div>
  )
}

