import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/pages/home/topbar.jsx";
import Navbar from "../components/pages/home/navbar.jsx";
import ImageSlider from "../components/imageSlider.jsx";
import PopularProduct from "../components/pages/home/popularProduct.jsx";
import DealsOfDay from "../components/dealsOfDayComponent.jsx";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  return (
    <div className="bg-white min-h-screen">
      <Topbar />
      <Navbar />

      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4">
        <ImageSlider
          slides={[
            {
              href: "ritish.site",
              src: "https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg",
            },
            {
              href: "ritish.site",
              src: "https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg",
            },
            {
              href: "ritish.site",
              src: "https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg",
            },
          ]}
        />
      </div>

      <PopularProduct />

      <DealsOfDay />
    </div>
  );
}
