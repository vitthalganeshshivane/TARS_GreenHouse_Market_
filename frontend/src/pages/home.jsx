import { useAuth } from "../hooks/useAuth";
import Topbar from "../components/layout/topbar.jsx";
import Navbar from "../components/layout/navbar.jsx";
import ImageSlider from "../components/common/imageSlider.jsx";
import PopularProduct from "../components/home/sections/popularProduct.jsx";
import DealsOfDay from "../components/home/sections/dealsOfDay.jsx";
import Advertisement from "../components/home/sections/advertisement.jsx";
import ShopByCategory from "../components/home/sections/shopByCategory.jsx";
import Ranking from "../components/home/sections/ranking.jsx";
import Cta from "../components/home/sections/cta.jsx";
import Banner1 from "../assets/newBanner.png";
import Banner2 from "../assets/banner.png";
import Footer from "../components/layout/footer.jsx";
import ChooseUsComponent from "../components/common/chooseUsComponent.jsx";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  return (
    <div className="bg-white min-h-screen">
      <div>
        {/* <div className="px-5">
          <Topbar />
        </div> */}
        <div className="px-5">
          <Navbar />
        </div>
      </div>

      <div className="px-2">
        <ImageSlider
          slides={[
            {
              src: Banner1,
            },
            {
              src: Banner2,
            },
            // {
            //   src: Banner1,
            // },
          ]}
        />
      </div>

      <PopularProduct />

      {/* <DealsOfDay /> */}

      {/* <Advertisement /> */}

      {/* <ShopByCategory /> */}

      {/* <Ranking />
      <Cta /> */}

      {/* <div className="flex flex-wrap justify-between gap-2 w-full px-4 md:px-8 lg:px-12 py-6">
        <ChooseUsComponent
          icon="/bpo.png"
          heading="Best Prices & offers"
          subHeading="Orders 100 rs or more"
        />
        <ChooseUsComponent
          icon="/bpo.png"
          heading="Best Prices & offers"
          subHeading="Orders 100 rs or more"
        />
        <ChooseUsComponent
          icon="/bpo.png"
          heading="Best Prices & offers"
          subHeading="Orders 100 rs or more"
        />
        <ChooseUsComponent
          icon="/bpo.png"
          heading="Best Prices & offers"
          subHeading="Orders 100 rs or more"
        />
      </div> */}
      <Footer />
    </div>
  );
}
