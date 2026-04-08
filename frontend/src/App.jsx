import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup.jsx'
import Login from './pages/login.jsx'
import ForgotPassword from './pages/forgot.jsx'
import VerifyOTP from './pages/verify.jsx'
import Success from './pages/success.jsx'
import { Button } from './components/ui/button.jsx'
import SearchProduct from './components/searchProduct.jsx'
import NavbarBtn from './components/navbarBtn.jsx'
import { Recycle } from 'lucide-react'
import CategoryEntry from './components/categoryEntry.jsx'
import CategoryCard from './components/categoryCard.jsx'
import ProductCard from './components/productCard.jsx'
import Topbar from './components/pages/home/topbar.jsx'
import Navbar from './components/pages/home/navbar.jsx'
import ImageSlider from './components/imageSlider.jsx'
import PopularProduct from './components/pages/home/popularProduct.jsx'
import DealsOfDay from './components/pages/home/dealsOfDay.jsx'
import AdverseComponent from './components/adverseComponent.jsx'

function Home() {
  return (
    <div className='bg-white min-h-screen'>
      <Topbar />
      <Navbar />

      <div className='px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4'>
        <ImageSlider slides={[
          { href: 'ritish.site', src: 'https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' },
          { href: 'ritish.site', src: 'https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' },
          { href: 'ritish.site', src: 'https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg' }
        ]} />
      </div>

      <PopularProduct />


      <DealsOfDay />

      <div className='m-20 flex gap-2'>
        <AdverseComponent image='adverse.jpeg' text='EveryDay Fresh & Clean' link='link' />
      </div>


    </div>
  )
}

function App() {
  return (
    <div className='w-full'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify' element={<VerifyOTP />} />
        <Route path='/success' element={<Success />} />
      </Routes>
    </div>
  )
}

export default App


// Component Usage
// <>
//   <SearchProduct />
//
//   <NavbarBtn icon={<Recycle />} text='Compare' badge={{ status: true, value: 5 }} link='https://ritish.site' />
//
//   <CategoryCard title='Category' >
//     <CategoryEntry icon={<Recycle />} text='compare' number='4' link='https://ritish.site' />
//   </CategoryCard>
//
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
//
//
//   <Navbar />
//
//
// </>
//
// <CategoryCard title='Category' >
//   <CategoryEntry icon={<Recycle />} text='compare' number='4' link='https://ritish.site' />
// </CategoryCard>
//
// <div className='flex gap-5'>
//
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
//   <ProductCard image='https://www.sirimart.in/wp-content/uploads/2023/12/Organic_Red_Rice.jpg' ratingCount={20} category='Fresh Food' name='Organic Red Rice' rating={4} brand="NestFood" price={200} discount={5} sale={true} />
// </div>
