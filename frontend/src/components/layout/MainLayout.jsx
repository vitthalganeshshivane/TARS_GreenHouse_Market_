import { Outlet } from "react-router";
import CartBar from "../customer/CartBar";

export default function MainLayout() {
  return (
    <>
      <div className="pb-20">
        <Outlet />
      </div>

      <CartBar />
    </>
  );
}
