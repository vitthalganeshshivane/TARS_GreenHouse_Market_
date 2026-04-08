import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/pages/home/topbar.jsx";
import Navbar from "../components/pages/home/navbar.jsx";
import ImageSlider from "../components/imageSlider.jsx";
import PopularProduct from "../components/pages/home/popularProduct.jsx";
import DealsOfDay from "../components/pages/home/dealsOfDay.jsx";
import Advertisement from "../components/pages/home/advertisement.jsx";
import ShopByCategory from "../components/pages/home/shopByCategory.jsx";
import Ranking from "../components/pages/home/ranking.jsx";
import Cta from "../components/pages/home/cta.jsx";
import Banner from "../assets/banner.png";
import Footer from "../components/footer.jsx";
import ChooseUsComponent from "../components/chooseUsComponent.jsx";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  return (
    <div className='bg-white min-h-screen'>
      <div className="border ">
        <div className="px-30">
          <Topbar />
        </div>
        <div className="px-10 md:px-30 ">

          <Navbar />
        </div>
      </div>

      <div className='px-2 sm:px-4 md:px-6 lg:px-8 py-2 md:py-4'>
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

      <Advertisement />

      <ShopByCategory />

      <Ranking />
      <Cta />


      <div className="flex flex-wrap justify-between gap-2 w-full px-4 md:px-8 lg:px-12 py-6">
        <ChooseUsComponent icon='/bpo.png' heading='Best Prices & offers' subHeading='Orders 100 rs or more' />
        <ChooseUsComponent icon='/bpo.png' heading='Best Prices & offers' subHeading='Orders 100 rs or more' />
        <ChooseUsComponent icon='/bpo.png' heading='Best Prices & offers' subHeading='Orders 100 rs or more' />
        <ChooseUsComponent icon='/bpo.png' heading='Best Prices & offers' subHeading='Orders 100 rs or more' />
      </div>
      <Footer />

    </div>
  );
}

