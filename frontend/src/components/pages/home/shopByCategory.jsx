import { MoveRight, MoveLeft } from "lucide-react";
import { Button } from "../../ui/button";
import ShopByCategoryCard from "../../shopByCategoryCard";

export default function ShopByCategory() {
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        {/* Left side */}
        <div className="flex gap-5">
          <h2 className="text-xl md:text-3xl font-semibold mb-2">
            Shop By Categories
          </h2>
          <Button variant="ghost" className="text-primary flex items-center gap-2 px-0">
            <span>All Categories</span>
            <MoveRight size={18} />
          </Button>
        </div>

        {/* Right side (arrows) */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <MoveLeft size={18} />
          </Button>
          <Button variant="outline" size="icon">
            <MoveRight size={18} />
          </Button>
        </div>

      </div>

      <div className="flex justify-around flex-wrap gap-5 ">

        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />
        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />
        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />
        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />
        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />
        <ShopByCategoryCard link='/category' image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' itemCount={40} title='Milks And Dairies' />



      </div>
      {/* Categories Grid Placeholder */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"> */}
      {/*   {/* Example item */}
      {/*   <div className="bg-muted h-24 rounded-lg flex items-center justify-center"> */}
      {/*     Item */}
      {/*   </div> */}
      {/* </div> */}

    </div>
  );
}
