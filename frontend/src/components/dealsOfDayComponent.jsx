import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function DealsOfDayComponent({ name, image, brand, price, discount }) {

  function countDiscount(price, discount) {
    return price - price * discount / 100;
  }

  function handleAdd() {
    // handling add
  }

  return (
    <div className="relative flex justify-center">
      <img className="w-45 h-45 md:w-90 md:h-90 rounded-xl" src={image} alt={image} />

      <div className="w-40 md:w-70 absolute p-5 rounded-xl top-3/4 bg-white shadow-md ">
        <h2 className="text-extrabold text-md md:text-xl">{name}</h2>
        <span className="text-sm md:text-md"><span className="text-gray-500">By</span> <span className="text-primary font-bold">{brand}</span></span>

        <div className="flex justify-around items-center w-full">
          <span className="text-green-500 underline font-extrabold">	&#8377; {countDiscount(price, discount)}</span>
          <span className="line-through text-gray-300">&#8377; {price}</span>
          <Button onClick={handleAdd} variant="outline" className='bg-green-100 rounded-sm text-green-800 flex'><ShoppingCart /><span>Add</span></Button>
        </div>
      </div>
    </div>
  )
}

