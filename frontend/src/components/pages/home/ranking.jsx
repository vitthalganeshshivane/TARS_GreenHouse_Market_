import CategoryCard from "../../categoryCard"
import ProductCardHorizontal from "../../productCardHorizontal"

export default function Ranking() {
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-6">

      <div className="flex justify-around flex-wrap">
        <CategoryCard className='w-70 md:w-110' title='Trending Products'>

          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />
          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />

        </CategoryCard>
        <CategoryCard className='w-70 md:w-110' title='Top Selling'>

          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />
          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />

        </CategoryCard>
        <CategoryCard className='w-70 md:w-110' title='Top Rated'>

          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />
          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />

        </CategoryCard>
        <CategoryCard className='w-70 md:w-110' title='Recently Added'>

          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />
          <ProductCardHorizontal
            image='adverse.jpeg'
            ratingCount={20}
            category='Fresh Food'
            name='Organic Red Rice'
            rating={4}
            brand="NestFood"
            price={200}
            discount={5}
            sale={true}
          />

        </CategoryCard>
      </div>
    </div>
  )
}

