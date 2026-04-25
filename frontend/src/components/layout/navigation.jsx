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

export function Navigations() {
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
