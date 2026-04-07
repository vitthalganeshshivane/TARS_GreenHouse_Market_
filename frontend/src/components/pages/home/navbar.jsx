import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import SearchProduct from "../../searchProduct"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Recycle } from 'lucide-react'
import NavbarBtn from "../../navbarBtn"
import { Heart } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { User } from "lucide-react"
import { Grid } from "lucide-react"
import { Link } from "react-router"
import { Star } from "lucide-react"
import { PhoneCall } from "lucide-react"

function Navigations() {
  return (
    <Menubar className="w-full justify-center gap-6">

      {/* Home */}
      <MenubarMenu>
        <MenubarTrigger>Home</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Home Default</MenubarItem>
          <MenubarItem>Home Modern</MenubarItem>
          <MenubarItem>Home Minimal</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* About */}
      <MenubarMenu>
        <MenubarTrigger>About</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Our Story</MenubarItem>
          <MenubarItem>Team</MenubarItem>
          <MenubarItem>Careers</MenubarItem>
          <MenubarItem>Testimonials</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Shop */}
      <MenubarMenu>
        <MenubarTrigger>Shop</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>All Products</MenubarItem>
            <MenubarItem>New Arrivals</MenubarItem>
            <MenubarItem>Best Sellers</MenubarItem>
          </MenubarGroup>

          <MenubarSeparator />

          <MenubarSub>
            <MenubarSubTrigger>Categories</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Clothing</MenubarItem>
              <MenubarItem>Electronics</MenubarItem>
              <MenubarItem>Accessories</MenubarItem>
              <MenubarItem>Home & Living</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>

          <MenubarSeparator />

          <MenubarItem>Cart</MenubarItem>
          <MenubarItem>Wishlist</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Blog */}
      <MenubarMenu>
        <MenubarTrigger>Blog</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>All Posts</MenubarItem>
          <MenubarItem>Latest Articles</MenubarItem>
          <MenubarItem>Guides</MenubarItem>
          <MenubarItem>News</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      {/* Pages */}
      <MenubarMenu>
        <MenubarTrigger>Pages</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>FAQ</MenubarItem>
          <MenubarItem>Pricing</MenubarItem>
          <MenubarItem>Privacy Policy</MenubarItem>
          <MenubarItem>Terms & Conditions</MenubarItem>

          <MenubarSeparator />

          <MenubarSub>
            <MenubarSubTrigger>Authentication</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Login</MenubarItem>
              <MenubarItem>Register</MenubarItem>
              <MenubarItem>Forgot Password</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      {/* Contact */}
      <MenubarMenu>
        <MenubarTrigger>Contact</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Contact Us</MenubarItem>
          <MenubarItem>Support</MenubarItem>
          <MenubarItem>Locations</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

    </Menubar>
  )
}

export default function Navbar() {
  return <div>
    <nav className="flex flex-col md:flex-row w-full justify-between md:justify-around items-center py-2 px-4 md:px-2 gap-3 md:gap-0">
      <div className="flex items-center justify-between gap-2 md:gap-4 w-full md:w-auto">

        <img className='h-7 md:h-9' src="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png" alt="https://brandlogos.net/wp-content/uploads/2025/08/bigbasket-logo_brandlogos.net_n0gb0-768x171.png" />

        <SearchProduct className='flex-1 md:flex-none md:w-100' />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">

        <Button variant='outline' className='text-primary text-xs md:text-sm px-2 md:px-4 hidden sm:flex'><span>Become Vendor</span> <ArrowRight className="w-4 h-4" /></Button>

        <div className="flex items-center gap-1">
          <NavbarBtn icon={<Recycle />} text='Compare' badge={{ status: true, value: 5 }} link='/compare' />
          <NavbarBtn icon={<Heart />} text='Wishlist' badge={{ status: true, value: 5 }} link='/whishlist' />
          <NavbarBtn icon={<ShoppingCart />} text='Cart' badge={{ status: true, value: 5 }} link='/cart' />
          <NavbarBtn icon={<User />} text='Account' badge={{ status: false, value: 5 }} link='/account' />
        </div>

      </div>

    </nav>

    <nav className="w-full border-t border-gray-200 bg-white px-2 md:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">

      <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto justify-between md:justify-start overflow-x-auto">

        <Button className="bg-primary text-white flex items-center gap-2 px-3 md:px-4 py-2 rounded-sm text-xs md:text-sm whitespace-nowrap">
          <Grid className="w-3 h-3 md:w-4 md:h-4" />
          <span className="font-medium">Browse All Categories</span>
        </Button>

        <Link
          href="/hot-deals"
          className="flex items-center gap-2 text-xs md:text-sm font-medium hover:text-primary transition whitespace-nowrap"
        >
          <Star className="w-3 h-3 md:w-4 md:h-4" />
          <span>Hot Deals</span>
        </Link>

        <div className="hidden lg:block">
          <Navigations />
        </div>

      </div>

      <div className="flex items-center gap-3 text-sm">

        <PhoneCall className="text-primary w-5 h-5 md:w-7 md:h-7" />

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-primary text-sm md:text-lg">
            7828767035
          </span>
          <span className="text-[10px] md:text-xs text-gray-500">
            24/7 Support Center
          </span>
        </div>

      </div>

    </nav>  </div>
}
