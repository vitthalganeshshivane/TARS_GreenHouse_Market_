import { Button } from './components/ui/button.jsx'
import SearchProduct from './components/searchProduct.jsx'
import NavbarBtn from './components/navbarBtn.jsx'
import { Recycle } from 'lucide-react'
import CategoryEntry from './components/categoryEntry.jsx'
import CategoryCard from './components/categoryCard.jsx'
import ProductCard from './components/productCard.jsx'
import Navbar from './components/navbar.jsx'
import Topbar from './components/pages/home/topbar.jsx'

function App() {

  return (
    <Topbar />
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
