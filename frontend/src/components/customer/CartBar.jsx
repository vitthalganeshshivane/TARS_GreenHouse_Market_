import { Delete, Trash, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CartBar() {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  if (!items.length) return null;

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-slate-100 text-white px-3 py-2 flex justify-between items-center z-50 gap-3 rounded-md mb-3">
      {" "}
      <div className="flex items-center text-black ">
        <p className="text-md font-semibold">{totalItems} items</p>
        {/* <p>₹{totalAmount}</p> */}
      </div>
      <button
        onClick={() => navigate("/cart")}
        className="bg-green-600 px-4 py-2 rounded-md text-white"
      >
        View Cart →
      </button>
      <button className="p-2 hover:bg-red-200/50 rounded cursor-pointer">
        <Trash size={19} strokeWidth={2} className="text-red-400" />
      </button>
    </div>
  );
}
