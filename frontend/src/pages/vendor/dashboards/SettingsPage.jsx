import { useEffect, useMemo, useState } from "react";
import {
  Upload,
  Eye,
  EyeOff,
  Save,
  Store,
  User,
  Lock,
  Bell,
} from "lucide-react";
import API from "../../../api/axios";

const getVendorFromResponse = (data) => {
  if (data?.user) return data.user;
  if (data?.data) return data.data;
  return data;
};

const splitName = (fullName = "") => {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };

  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
};

const getAddressesFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.addresses)) return data.addresses;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [store, setStore] = useState({
    storeName: "",
    gstNumber: "",
    addressId: "",
    openTime: "",
    closeTime: "",
    deliveryRadius: "",
    minOrderAmount: "",
    freeDeliveryAbove: "",
  });

  const [passwords, setPasswords] = useState({
    email: "",
    otp: "",
    new: "",
    confirm: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [storeSaving, setStoreSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [storeMessage, setStoreMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  const sectionNav = [
    { id: "profile", label: "Vendor Profile", icon: User },
    { id: "store", label: "Store Details", icon: Store },
    { id: "password", label: "Reset Password", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setPageLoading(true);
        setPageError("");

        const [vendorRes, addressRes] = await Promise.all([
          API.get("/vendor/me"),
          API.get("/address"),
        ]);

        const user = getVendorFromResponse(vendorRes.data);
        const vendorAddresses = getAddressesFromResponse(addressRes.data);
        const { firstName, lastName } = splitName(user?.name || "");

        setProfile({
          firstName,
          lastName,
          email: user?.email || "",
          phone: user?.phone || "",
          image: user?.image || "",
        });

        setAddresses(vendorAddresses);

        setStore({
          storeName: user?.store?.storeName || "",
          gstNumber: user?.store?.gstNumber || "",
          addressId: user?.store?.address || "",
          openTime: user?.store?.openTime || "",
          closeTime: user?.store?.closeTime || "",
          deliveryRadius: user?.store?.deliveryRadius ?? "",
          minOrderAmount: user?.store?.minOrderAmount ?? "",
          freeDeliveryAbove: user?.store?.freeDeliveryAbove ?? "",
        });

        setPasswords((prev) => ({
          ...prev,
          email: user?.email || "",
        }));
      } catch (err) {
        setPageError(
          err?.response?.data?.message || "Failed to load vendor settings.",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const profilePreviewImage = useMemo(() => {
    if (profileImageFile) return URL.createObjectURL(profileImageFile);
    return profile.image || "";
  }, [profileImageFile, profile.image]);

  const selectedAddress = useMemo(() => {
    return addresses.find((item) => item._id === store.addressId) || null;
  }, [addresses, store.addressId]);

  const handleProfileChange = (e) => {
    setProfileMessage({ type: "", text: "" });
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStoreChange = (e) => {
    setStoreMessage({ type: "", text: "" });
    setStore((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);
  };

  const handleProfileSave = async () => {
    try {
      setProfileSaving(true);
      setProfileMessage({ type: "", text: "" });

      const payload = new FormData();
      payload.append("name", `${profile.firstName} ${profile.lastName}`.trim());
      payload.append("email", profile.email);
      payload.append("phone", profile.phone);

      if (profileImageFile) {
        payload.append("image", profileImageFile);
      }

      const res = await API.put("/vendor/profile", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = getVendorFromResponse(res.data);
      const { firstName, lastName } = splitName(updatedUser?.name || "");

      setProfile({
        firstName,
        lastName,
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
        image: updatedUser?.image || "",
      });

      setProfileImageFile(null);

      setProfileMessage({
        type: "success",
        text: "Vendor profile updated successfully.",
      });
    } catch (err) {
      setProfileMessage({
        type: "error",
        text:
          err?.response?.data?.message || "Failed to update vendor profile.",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleStoreSave = async () => {
    try {
      setStoreSaving(true);
      setStoreMessage({ type: "", text: "" });

      await API.put("/vendor/store", {
        storeName: store.storeName,
        gstNumber: store.gstNumber,
        address: store.addressId,
        openTime: store.openTime,
        closeTime: store.closeTime,
        deliveryRadius:
          store.deliveryRadius === "" ? 0 : Number(store.deliveryRadius),
        minOrderAmount:
          store.minOrderAmount === "" ? 0 : Number(store.minOrderAmount),
        freeDeliveryAbove:
          store.freeDeliveryAbove === "" ? 0 : Number(store.freeDeliveryAbove),
      });

      setStoreMessage({
        type: "success",
        text: "Store details updated successfully.",
      });
    } catch (err) {
      setStoreMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update store details.",
      });
    } finally {
      setStoreSaving(false);
    }
  };

  const handleNewAddressChange = (e) => {
    setNewAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddAddress = async () => {
    try {
      setAddressSaving(true);

      const res = await API.post("/address", newAddress);
      const createdAddress = res.data.address;

      setAddresses((prev) => [createdAddress, ...prev]);
      setStore((prev) => ({ ...prev, addressId: createdAddress._id }));

      setNewAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });

      setShowAddressModal(false);
      setStoreMessage({
        type: "success",
        text: "Address added successfully.",
      });
    } catch (err) {
      setStoreMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to add address.",
      });
    } finally {
      setAddressSaving(false);
    }
  };

  const handleSendResetOtp = async () => {
    try {
      setSendingOtp(true);
      setPasswordMessage({ type: "", text: "" });

      await API.post("/auth/forgot-password", {
        email: passwords.email,
      });

      setPasswordMessage({
        type: "success",
        text: "OTP sent to your email successfully.",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerifyingOtp(true);
      setPasswordMessage({ type: "", text: "" });

      await API.post("/auth/verify-otp", {
        email: passwords.email,
        otp: passwords.otp,
      });

      setPasswordMessage({
        type: "success",
        text: "OTP verified successfully. You can now reset your password.",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err?.response?.data?.message || "OTP verification failed.",
      });
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordMessage({ type: "", text: "" });

      await API.post("/auth/reset-password", {
        email: passwords.email,
        password: passwords.new,
      });

      setPasswords((prev) => ({
        ...prev,
        otp: "",
        new: "",
        confirm: "",
      }));

      setPasswordMessage({
        type: "success",
        text: "Password reset successfully.",
      });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to reset password.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 bg-gray-50 transition-all";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-3xl font-extrabold text-white mx-auto overflow-hidden">
                {profilePreviewImage ? (
                  <img
                    src={profilePreviewImage}
                    alt="Vendor profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {(profile.firstName || "V").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                <Upload className="w-3 h-3 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
            <p className="font-bold text-gray-800">
              {`${profile.firstName} ${profile.lastName}`.trim() || "Vendor"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {profile.email || "No email added"}
            </p>
            <div className="mt-3 px-3 py-1.5 bg-green-50 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-700">
                {"\uD83C\uDFEA"} {store.storeName || "Store not added yet"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {sectionNav.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold border-b border-gray-50 last:border-0 transition-all ${
                  activeSection === id
                    ? "text-green-700 bg-green-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${activeSection === id ? "text-green-600" : "text-gray-400"}`}
                />
                {label}
                {activeSection === id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 space-y-5">
          {pageError && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {pageError}
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-gray-800 text-base">
                    Vendor Profile
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your personal information
                  </p>
                </div>
                <button
                  onClick={handleProfileSave}
                  disabled={pageLoading || profileSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {profileMessage.text && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                    profileMessage.type === "success"
                      ? "bg-green-50 border-green-100 text-green-700"
                      : "bg-red-50 border-red-100 text-red-600"
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "store" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-gray-800 text-base">
                    Store Details
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure your kirana store settings
                  </p>
                </div>
                <button
                  onClick={handleStoreSave}
                  disabled={pageLoading || storeSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {storeSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {storeMessage.text && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                    storeMessage.type === "success"
                      ? "bg-green-50 border-green-100 text-green-700"
                      : "bg-red-50 border-red-100 text-red-600"
                  }`}
                >
                  {storeMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Store Name</label>
                  <input
                    name="storeName"
                    value={store.storeName}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>GST Number</label>
                  <input
                    name="gstNumber"
                    value={store.gstNumber}
                    onChange={handleStoreChange}
                    className={inputClass}
                    placeholder="Enter GST number"
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Store Address</label>
                  <div className="flex gap-2">
                    <select
                      name="addressId"
                      value={store.addressId}
                      onChange={handleStoreChange}
                      className={inputClass}
                      disabled={pageLoading}
                    >
                      <option value="">Select existing address</option>
                      {addresses.map((address) => (
                        <option key={address._id} value={address._id}>
                          {address.addressLine}, {address.city}, {address.state}{" "}
                          {address.pincode}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {selectedAddress && (
                    <p className="text-xs text-gray-400 mt-1">
                      Selected: {selectedAddress.addressLine},{" "}
                      {selectedAddress.city}, {selectedAddress.state}{" "}
                      {selectedAddress.pincode}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Opening Time</label>
                  <input
                    type="time"
                    name="openTime"
                    value={store.openTime}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Closing Time</label>
                  <input
                    type="time"
                    name="closeTime"
                    value={store.closeTime}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Delivery Radius (km)</label>
                  <input
                    type="number"
                    name="deliveryRadius"
                    value={store.deliveryRadius}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Min Order Amount (Rs)</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={store.minOrderAmount}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
                <div>
                  <label className={labelClass}>Free Delivery Above (Rs)</label>
                  <input
                    type="number"
                    name="freeDeliveryAbove"
                    value={store.freeDeliveryAbove}
                    onChange={handleStoreChange}
                    className={inputClass}
                    disabled={pageLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "password" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="mb-5">
                <h2 className="font-bold text-gray-800 text-base">
                  Reset Password
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Reset your password securely using OTP verification
                </p>
              </div>

              {passwordMessage.text && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                    passwordMessage.type === "success"
                      ? "bg-green-50 border-green-100 text-green-700"
                      : "bg-red-50 border-red-100 text-red-600"
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="max-w-md space-y-4">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={passwords.email}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendResetOtp}
                  disabled={sendingOtp}
                  className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm mt-2 disabled:opacity-70"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>

                <div>
                  <label className={labelClass}>OTP</label>
                  <input
                    name="otp"
                    value={passwords.otp}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        otp: e.target.value,
                      }))
                    }
                    placeholder="Enter OTP"
                    className={inputClass}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                  className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm mt-2 disabled:opacity-70"
                >
                  {verifyingOtp ? "Verifying OTP..." : "Verify OTP"}
                </button>

                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="new"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          new: e.target.value,
                        }))
                      }
                      placeholder="Enter new password"
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirm"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                      placeholder="Re-enter new password"
                      className={`${inputClass} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={passwordSaving}
                  className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm mt-2 disabled:opacity-70"
                >
                  {passwordSaving ? "Resetting Password..." : "Reset Password"}
                </button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="mb-5">
                <h2 className="font-bold text-gray-800 text-base">
                  Notification Preferences
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Choose which alerts you want to receive
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "New Order Alerts",
                    desc: "Get notified when a new order is placed",
                    enabled: true,
                  },
                  {
                    label: "Low Stock Warnings",
                    desc: "Alert when product stock falls below threshold",
                    enabled: true,
                  },
                  {
                    label: "Payment Confirmations",
                    desc: "Notify on successful payment receipt",
                    enabled: true,
                  },
                  {
                    label: "Delivery Updates",
                    desc: "Updates on order delivery status changes",
                    enabled: false,
                  },
                  {
                    label: "Weekly Reports",
                    desc: "Receive weekly sales and performance reports",
                    enabled: true,
                  },
                  {
                    label: "Promotional Alerts",
                    desc: "Updates on new features and promotions",
                    enabled: false,
                  },
                ].map((notif, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {notif.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {notif.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={notif.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button className="mt-4 flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Add Address</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Add a new address for your store
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                x
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Address Line</label>
                  <input
                    name="addressLine"
                    value={newAddress.addressLine}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Pincode</label>
                  <input
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  disabled={addressSaving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {addressSaving ? "Saving..." : "Add Address"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
