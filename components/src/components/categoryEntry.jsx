import { Button } from "./ui/button"
import { Link, useNavigate } from "react-router"

import { cn } from "@/lib/utils"

const CategoryEntry = ({ className, icon, text, number, link }) => {
  const navigate = useNavigate();

  return (

    <Button className={cn(className)} onClick={() => { navigate(link) }} variant='outline' >



      <div className="flex justify-around items-center gap-10">
        <div className='flex justify-between items-center gap-1'>
          <span>
            {icon}
          </span>
          <span className='text-gray-500'>{text}</span>
        </div>



        <div className=" w-5 h-5 rounded-full bg-green-200">
          {number}
        </div>
      </div>

    </Button>
  )
}

export default CategoryEntry
