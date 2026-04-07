import { cn } from "@/lib/utils"
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";
import { ShoppingCart } from "lucide-react";


function Rating({ rating, total }) {
  let stars = [];
  for (let i = 0; i < rating; i++)
    stars.push(<div className="-skew-10 w-2 h-2 bg-orange-300"></div>)


  for (let j = 5 - rating; j > 0; j--)
    stars.push(<div className="-skew-10 w-2 h-2 bg-gray-300"></div>)

  return <div className="w-3/4 flex justify-between items-center"><div className="flex gap-1">{stars}</div> <span>{total}</span></div>

}

function countDiscount(price, discount) {
  return price - price * discount / 100;
}

function handleAdd() {
}

export default function ProductCard({ image, category, name, rating, ratingCount, brand, price, discount, sale, className }) {
  return (
    <div className={cn("md:shadow-sm relative flex justify-center items-center flex-col w-32 md:w-60 rounded-xl md:border p-2 ", className)}>

      <span className="rounded-tl-xl rounded-br-xl absolute top-0 left-0 bg-green-500 text-white px-5 py-1 hidden md:inline">{discount}%</span>
      {sale && <span className="rounded-tr-xl rounded-bl-xl absolute top-0 right-0 bg-blue-400 text-white px-5 py-1  hidden md:inline">Sale</span>}

      <div className="relative rounded-xl md:border-2 w-full md:w-40 md:m-10">
        <img src={image} alt={image} className="w-full overflow-hidden rounded-xl" />

        <Button onClick={handleAdd} variant="outline" className='absolute border border-green-200 rounded-sm text-green-800 block md:hidden -bottom-1 -right-1'><span>Add</span></Button>
      </div>

      <div className="py-2 w-full flex justify-center items-center flex-col ">

        <span className="w-full text-gray-500 text-sm">{category}</span>
        <span className="w-full text-lg font-bold">{name}</span>

        <div className="w-full">
          <Rating rating={rating} total={ratingCount} />
        </div>

        <span className="w-full"><span className="text-gray-500  text-xs">By</span> <span className="text-green-500 text-sm">{brand}</span></span>


        <div className="flex justify-around items-center w-full">
          <span className="text-green-500 underline font-extrabold">	&#8377; {countDiscount(price, discount)}</span>
          <span className="line-through text-gray-300">&#8377; {price}</span>
          <Button onClick={handleAdd} variant="outline" className='bg-green-100 rounded-sm text-green-800 hidden md:flex'><ShoppingCart /><span>Add</span></Button>
        </div>

      </div>


    </div>
  )
}

