export default function CartBillDetails({ item, subtotal }) {
  // 🔥 Simple MVP rules
  // const deliveryFee = subtotal > 499 ? 0 : 40;
  const deliveryFee = 0;
  const platformFee = 0;
  const discount = 0; // later coupon logic

  const total = subtotal + deliveryFee + platformFee - discount;

  if (!item.length) return null;
  return (
    <div className="bg-white p-5 rounded-xl  mt-5">
      <h2 className="font-semibold text-gray-800 ">Bill Details</h2>

      <div className="space-y-1 text-sm mt-2 border border-gray-200 p-4 rounded-xl">
        {/* Item Total */}
        <div className="flex justify-between">
          <span className="text-[13px] text-gray-600 font-semibold">
            Item Total
          </span>
          <span className="font-semibold text-[13px]">₹{subtotal}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between">
          <span className="text-[13px] text-gray-600 font-semibold">
            Delivery Fee
          </span>
          <span className="font-semibold text-[13px]">
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        {/* Platform Fee */}
        <div className="flex justify-between">
          <span className="text-[13px] text-gray-600 font-semibold">
            Platform Fee
          </span>
          <span className="font-semibold text-[13px]">₹{platformFee}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t pt-2 flex justify-between font-semibold text-sm">
          <span>To Pay</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* 💡 Smart UX */}
      {deliveryFee > 0 && (
        <p className="text-xs text-gray-400 mt-3">
          Add ₹{499 - subtotal} more for FREE delivery
        </p>
      )}
    </div>
  );
}
