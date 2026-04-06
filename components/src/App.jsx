import { Button } from './components/ui/button.jsx'
import SearchProduct from './components/searchProduct.jsx'
import NavbarBtn from './components/navbarBtn.jsx'
import { Recycle } from 'lucide-react'
import CategoryEntry from './components/categoryEntry.jsx'
import CategoryCard from './components/categoryCard.jsx'

function App() {

  return (
    <>
      <SearchProduct />

      <NavbarBtn icon={<Recycle />} text='Compare' badge={{ status: true, value: 5 }} link='https://ritish.site' />

      <CategoryCard title='Category' >
        <CategoryEntry icon={<Recycle />} text='compare' number='4' link='https://ritish.site' />
      </CategoryCard>




    </>
  )
}

export default App


