import AdverseComponent from "../../adverseComponent"

export default function Advertisement() {
  return (
    <div className="flex gap-5  flex-wrap justify-around items-center w-full px-4 md:px-8 lg:px-12 py-6">

      <AdverseComponent image='https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' color='oklch(0.94 0.05 145)' text='Everyday Fresh & Clean With Our Products' link='/login' />
      <AdverseComponent image='https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' color='oklch(0.9 0.01 140)' text='Everyday Fresh & Clean With Our Products' link='/login' />
      <AdverseComponent image='https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' color='oklch(0.99 0.01 95)' text='Everyday Fresh & Clean With Our Products' link='/login' />
    </div>
  )
}

