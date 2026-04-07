import { Recycle } from "lucide-react"
import CategoryCard from "../../categoryCard"
import CategoryEntry from "../../categoryEntry"
import ProductCard from "../../productCard"
import Tags from "../../tags"
import DealsOfDay from "./dealsOfDay"

export default function PopularProduct() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-6">

      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT: Products */}
        <div className="flex-1">
          <h2 className="text-xl md:text-3xl font-semibold mb-5">
            Popular Products
          </h2>


          <div className="flex flex-wrap gap-0 justify-around md:gap-6">

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />

            <ProductCard
              image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg'
              ratingCount={20}
              category='Fresh Food'
              name='Organic Red Rice'
              rating={4}
              brand="NestFood"
              price={200}
              discount={5}
              sale={true}
            />
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="hidden md:flex w-full lg:w-[280px] flex-col gap-6">

          <CategoryCard title='Category'>
            <CategoryEntry icon={<Recycle size={16} />} text='Compare' number='4' link='#' />
            <CategoryEntry icon={<Recycle size={16} />} text='Compare' number='4' link='#' />
            <CategoryEntry icon={<Recycle size={16} />} text='Compare' number='4' link='#' />
            <CategoryEntry icon={<Recycle size={16} />} text='Compare' number='4' link='#' />
          </CategoryCard>

          <CategoryCard title='Tags'>
            <div className="flex flex-wrap gap-2">
              <Tags name='Brown' />
              <Tags name='Coffee' />
              <Tags name='Organic' />
              <Tags name='Rice' />
            </div>
          </CategoryCard>

        </aside>


      </div>
    </section>
  )
}
