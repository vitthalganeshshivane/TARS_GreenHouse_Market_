import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
} from "lucide-react";
import {
  fetchAddresses,
  createAddressAsync,
  updateAddressAsync,
  deleteAddressAsync,
  setDefaultAddressAsync,
} from "../../../redux/slices/addressSlice";
import { useAuth } from "../../../hooks/useAuth";

// const mockAddresses = [
//   {
//     _id: "1",
//     fullName: "Rahul Sharma",
//     addressLine: "12, Shanti Nagar, Near Central Mall",
//     city: "Nagpur",
//     state: "Maharashtra",
//     pincode: "440001",
//     type: "Home",
//     isDefault: true,
//   },
//   {
//     _id: "2",
//     fullName: "Rahul Sharma",
//     addressLine: "Office 304, IT Park Tower B, Wardha Road",
//     city: "Nagpur",
//     state: "Maharashtra",
//     pincode: "440025",
//     type: "Work",
//     isDefault: false,
//   },
// ];

export default function AddressPage() {
  const { user } = useAuth();
  // console.log("user:", user);
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    type: "",
    isDefault: false,
  });

  const handleEdit = (address) => {
    setEditingId(address._id);
    setForm(address);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await dispatch(updateAddressAsync({ id: editingId, data: form }));
    } else {
      console.log("creating new address");
      await dispatch(createAddressAsync({ data: form }));
    }

    setShowForm(false);
    setEditingId(null);
    setForm({
      fullName: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      type: "",
      isDefault: false,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteAddressAsync(id));
      dispatch(fetchAddresses());
    }
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddressAsync(id));
  };

  useEffect(() => {
    if (addresses.length && !selectedAddressId) {
      const defaultAddress = addresses.find((a) => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    }
  }, [addresses]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              My Addresses
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {addresses.length} saved addresses
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 border border-green-500 text-green-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add new
          </button>
        </div>

        {/* Loading State */}
        {loading && addresses.length === 0 && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-green-500" />
          </div>
        )}

        {/* Saved Address Cards */}
        <div className="flex flex-col gap-3 mb-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white rounded-xl p-4 border ${
                address.isDefault ? "border-green-400" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon */}
                <div
                  className={`mt-1 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    address.type === "Home" ? "bg-green-50" : "bg-gray-100"
                  }`}
                >
                  {address.type === "Home" ? (
                    <Home size={16} className="text-green-500" />
                  ) : (
                    <Briefcase size={16} className="text-gray-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {address.fullName}
                    </span>
                    {address.isDefault && (
                      <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                    <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {address.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {address.addressLine}, {address.city}, {address.state} —{" "}
                    {address.pincode}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefault(address._id)}
                          className="flex items-center gap-1.5 text-xs text-green-600 border border-green-200 px-3 py-1.5 rounded-md hover:bg-green-50 transition-colors"
                        >
                          <Check size={12} />
                          Set as default
                        </button>
                        <button
                          onClick={() => handleDelete(address._id)}
                          className="flex items-center gap-1.5 text-xs text-red-500 border border-red-100 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Add new address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Address Line */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Address line
                </label>
                <input
                  type="text"
                  placeholder="House / Flat no., Street, Area"
                  value={form.addressLine}
                  onChange={(e) =>
                    setForm({ ...form, addressLine: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  State
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select state</option>
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Gujarat</option>
                  <option>Rajasthan</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Address type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select type</option>
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Map Pin */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Pin location{" "}
                  <span className="text-gray-300 font-normal">(optional)</span>
                </label>
                <div className="border border-dashed border-gray-200 rounded-lg h-28 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors">
                  <MapPin size={22} className="text-green-500" />
                  <p className="text-sm text-gray-500">Use current location</p>
                  <p className="text-xs text-gray-300">
                    Tap to auto-detect your location
                  </p>
                </div>
              </div>
            </div>

            {/* Set Default */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="isDefault"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm({ ...form, isDefault: e.target.checked })
                }
                className="accent-green-500 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="isDefault"
                className="text-sm text-gray-500 cursor-pointer"
              >
                Set as default address
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-500 border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-sm text-white bg-green-500 px-5 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Save address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
