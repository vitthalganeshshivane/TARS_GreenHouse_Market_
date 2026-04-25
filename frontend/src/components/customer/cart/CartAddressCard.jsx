import { Home } from "lucide-react";
import { useSelector } from "react-redux";

export default function CartAddressCard() {
  const { addresses } = useSelector((state) => state.address);
  const defaultAddress = addresses.find((a) => a.isDefault);
  return (
    <div className="mt-5 bg-white px-4 py-4 rounded-xl">
      <div className="font-semibold text-black/90">Delivery Address</div>
      {defaultAddress ? (
        <div className="border px-4 py-2 rounded-lg bg-white mt-2">
          <div className="flex items-center gap-2">
            <Home size={16} className="text-black/80" />
            <p className="font-semibold text-black/80">
              {defaultAddress.fullName}
            </p>
          </div>
          <p className="text-[13px] text-gray-500 -mt-1">
            {defaultAddress.addressLine}, {defaultAddress.city},{" "}
            {defaultAddress.state} - {defaultAddress.pincode}
          </p>
        </div>
      ) : (
        <p className="text-red-500 text-sm">No default address selected</p>
      )}
    </div>
  );
}
