import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import API from "../../../api/axios";

// ─── Reusable status banner ───────────────────────────────────────────────────
function StatusBanner({ type, message }) {
  if (!message) return null;
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50   border-red-200   text-red-600",
  };
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}
    >
      <Icon size={15} className="flex-shrink-0" />
      {message}
    </div>
  );
}

// ─── Profile Details Form ─────────────────────────────────────────────────────
function ProfileForm({ user, onUpdate }) {
  console.log("user from hook :", user.name);
  const { token } = useAuth(); // grab token from context
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const isDirty =
    form.name !== (user?.name ?? "") || form.phone !== (user?.phone ?? "");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;

    setLoading(true);
    setStatus({ type: "", message: "" });

    const payload = {};

    if (form.name !== user?.name) payload.name = form.name;
    if (form.phone !== user?.phone) payload.phone = form.phone;

    try {
      const res = await API.put("/user/profile", payload);
      //   console.log(res.data)

      console.log("API success:", res.data);

      onUpdate(res.data);

      console.log("onUpdate success");

      setStatus({
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (err) {
      console.log("Error in Account setting:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-[17px]">Profile Details</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Update your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <User size={15} className="text-gray-400" />
            </div>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700
                focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
        </div>

        {/* Email — read-only, backend does not allow email updates */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Email Address
            <span className="ml-2 text-[10px] text-gray-400 normal-case tracking-normal font-normal">
              (cannot be changed)
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail size={15} className="text-gray-300" />
            </div>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full pl-10 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm
                text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Phone size={15} className="text-gray-400" />
            </div>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700
                focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>
        </div>

        <StatusBanner type={status.type} message={status.message} />

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || !isDirty}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200
              disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm
              px-6 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-green-200"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save size={15} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Change Password Form ─────────────────────────────────────────────────────
function PasswordForm() {
  const { token } = useAuth();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (form.password.length < 6) {
      return setStatus({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
    }
    if (form.password !== form.confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match." });
    }

    setLoading(true);
    try {
      const res = await API.put("/user/profile", {
        password: form.password,
      });

      setForm({ password: "", confirmPassword: "" });

      setStatus({
        type: "success",
        message: "Password updated successfully!",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const passwordFields = [
    { name: "password", label: "New Password" },
    { name: "confirmPassword", label: "Confirm Password" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-[17px]">Change Password</h2>
        <p className="text-gray-400 text-sm mt-0.5">Keep your account secure</p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {passwordFields.map(({ name, label }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              {label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={15} className="text-gray-400" />
              </div>
              <input
                name={name}
                type={show[name] ? "text" : "password"}
                value={form[name]}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700
                  focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
              <button
                type="button"
                onClick={() => toggleShow(name)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {show[name] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}

        <StatusBanner type={status.type} message={status.message} />

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || !form.password || !form.confirmPassword}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-200
              disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm
              px-6 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-green-200"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Updating…
              </>
            ) : (
              <>
                <Save size={15} /> Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccountSettings({ user }) {
  const { updateUser } = useAuth(); // expose updateUser in your AuthContext

  const handleProfileUpdate = (updatedUser) => {
    updateUser(updatedUser); // sync fresh data back into context
  };

  return (
    <div className="space-y-5">
      <ProfileForm user={user} onUpdate={handleProfileUpdate} />
      <PasswordForm />
    </div>
  );
}
