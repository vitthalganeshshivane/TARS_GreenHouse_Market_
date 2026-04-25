import { cn } from "@/lib/utils"

const CategoryCard = ({ title, children, className }) => {
  return (
    <div className={cn("rounded-md shadow-sm w-50 p-2 md:p-4", className)}>
      <div className="font-bold">
        {title}
      </div>

      <div className="h-[1px] rounded-full w-full bg-gray-300">
        <span className="h-full w-[40%] bg-green-500 block rounded-full"></span>
      </div>


      <div className="h-full my-5 flex-col flex gap-2 ">

        {children}
      </div>
    </div>
  )
}

export default CategoryCard
