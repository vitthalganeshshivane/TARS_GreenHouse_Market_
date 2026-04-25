import { Banknote, Smartphone, CheckCircle2 } from "lucide-react";

const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: Banknote,
  },
  {
    id: "upi",
    label: "UPI",
    desc: "Pay online using any UPI app",
    icon: Smartphone,
  },
];

export default function CartPaymentMethod({ selectedMethod, onChangeMethod }) {
  return (
    <div className="bg-white rounded-xl mt-4 px-4 py-4">
      <h2 className="text-lg font-semibold text-black/85 mb-3">
        Payment Method
      </h2>

      <div className="space-y-3">
        {paymentOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedMethod === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeMethod(option.id)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isSelected ? "text-green-600" : "text-gray-500"}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-black/85">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.desc}</p>
                </div>
              </div>

              <CheckCircle2
                size={20}
                className={isSelected ? "text-green-600" : "text-gray-300"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
