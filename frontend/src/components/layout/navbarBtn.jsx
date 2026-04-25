import { Link } from "react-router";
import { cn } from "@/lib/utils";

const NavbarBtn = ({ icon, text, badge, link, className }) => {
  const { status, value = 0 } = badge || {};
  // console.log("status:", status);
  return (
    <Link
      to={link}
      className={cn("flex justify-between items-center relative ", className)}
    >
      <div className="flex justify-between items-center gap-1">
        <span className={`text-gray-500 `}>{icon}</span>
        <span className="hidden xl2:inline text-gray-500 text-sm">{text}</span>
      </div>

      {/* badge */}
      {status && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          <span className="text-[.6rem]">{value}</span>
        </div>
      )}
    </Link>
  );
};

export default NavbarBtn;
