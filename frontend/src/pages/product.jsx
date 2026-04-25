import { Recycle } from "lucide-react";
import CategoryCard from "../components/common/categoryCard";
import Navbar from "../components/layout/navbar";
import Topbar from "../components/layout/topbar";
import ProductPage from "../components/product/productPage";
import CategoryEntry from "../components/common/categoryEntry";
import ProductCardHorizontal from "../components/product/productCardHorizontal";
import Cta from "../components/home/sections/cta";
import Footer from "../components/layout/footer";

export default function Product() {
  return (
    <div className="bg-white min-h-screen">
      <div className="border ">
        <div className="px-30">
          <Topbar />
        </div>
        <div className="px-10 md:px-30 ">
          <Navbar />
        </div>
      </div>

      {/* <div>Product</div> */}
      <div className="flex justify-between">
        <div>
          <ProductPage />
        </div>

        <div>
          <CategoryCard className="my-5 w-70 md:w-110" title="Category">
            <CategoryEntry
              icon={<Recycle size={16} />}
              text="Compare"
              number="4"
              link="#"
            />
            <CategoryEntry
              icon={<Recycle size={16} />}
              text="Compare"
              number="4"
              link="#"
            />
            <CategoryEntry
              icon={<Recycle size={16} />}
              text="Compare"
              number="4"
              link="#"
            />
            <CategoryEntry
              icon={<Recycle size={16} />}
              text="Compare"
              number="4"
              link="#"
            />
          </CategoryCard>

          <CategoryCard className="my-5 w-70 md:w-110" title="New Products">
            <ProductCardHorizontal
              image="adverse.jpeg"
              ratingCount={20}
              category="Fresh Food"
              name="Organic Red Rice"
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />
            <ProductCardHorizontal
              image="adverse.jpeg"
              ratingCount={20}
              category="Fresh Food"
              name="Organic Red Rice"
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />
          </CategoryCard>
        </div>
      </div>

      <Cta/>
      <Footer/>
    </div>
  );
}
