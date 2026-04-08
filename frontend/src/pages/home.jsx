import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/pages/home/topbar.jsx";
import Navbar from "../components/pages/home/navbar.jsx";
import ImageSlider from "../components/imageSlider.jsx";
import PopularProduct from "../components/pages/home/popularProduct.jsx";
import DealsOfDay from "../components/dealsOfDayComponent.jsx";
import Banner from "../assets/banner.png";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  return (
    <div className="bg-white min-h-screen">
      <Topbar />
      <Navbar />

      <div>
        <ImageSlider
          slides={[
            {
              src: Banner,
            },
            {
              src: Banner,
            },
            {
              src: Banner,
            },
          ]}
        />
      </div>

      <PopularProduct />

      <DealsOfDay />
    </div>
  );
}
