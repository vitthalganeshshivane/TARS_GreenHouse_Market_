import React from "react";
import { Leaf } from "lucide-react";

const footerData = {
  brand: {
    name: "Nest",
    tagline: "MART & GROCERY",
    description: "Awesome grocery store website template",
    address: "5171 W Campbell Ave undefined Kent, Utah 53127 United States",
    phone: "(+91)-540-025-124553",
    email: "sale@Nest.com",
    hours: "10:00 - 18:00, Mon - Sat",
  },
  columns: [
    {
      title: "Company",
      links: [
        "About Us",
        "Delivery Information",
        "Privacy Policy",
        "Terms & Conditions",
        "Contact Us",
        "Support Center",
        "Careers",
      ],
    },
    {
      title: "Account",
      links: [
        "Sign In",
        "View Cart",
        "My Wishlist",
        "Track My Order",
        "Help Ticket",
        "Shipping Details",
        "Compare products",
      ],
    },
    {
      title: "Corporate",
      links: [
        "Become a Vendor",
        "Affiliate Program",
        "Farm Business",
        "Farm Careers",
        "Our Suppliers",
        "Accessibility",
        "Promotions",
      ],
    },
    {
      title: "Popular",
      links: [
        "Milk & Flavoured Milk",
        "Butter and Margarine",
        "Eggs Substitutes",
        "Marmalades",
        "Sour Cream and Dips",
        "Tea & Kombucha",
        "Cheese",
      ],
    },
  ],
  contact: [
    { phone: "1900646666", label: "Working 8:00 - 22:00" },
    { phone: "1900648888", label: "24/7 Support Center" },
  ],
};

// ---------- Icons ----------
const IconWrapper = ({ children }) => (
  <span className="shrink-0 mt-0.5 text-[#3bb77e]">{children}</span>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 11.9a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.06a16 16 0 0 0 6.03 6.03l1.32-1.34a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16v16H4z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ---------- Components ----------
const FooterColumn = ({ title, links }) => (
  <div>
    <h3 className="font-semibold text-[#253D4E] mb-3">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link}>
          <a href="#" className="text-sm text-gray-500 hover:text-[#3bb77e]">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ContactItem = ({ icon, children }) => (
  <div className="flex items-start gap-2 text-sm text-gray-500">
    <IconWrapper>{icon}</IconWrapper>
    <span>{children}</span>
  </div>
);

// ---------- Main ----------
export default function Footer() {
  return (
    <footer className="bg-white ">
      {/* Top */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <div
          className="grid gap-8 
                        grid-cols-1 
                        sm:grid-cols-2 
                        md:grid-cols-3 
                        lg:grid-cols-5 
                        xl:grid-cols-6"
        >
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-7 w-7 fill-emerald-700 text-emerald-700" />
              <span className="text-xl font-bold text-green-800">
                Greenhouse Market
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {footerData.brand.description}
            </p>

            <div className="space-y-2">
              <ContactItem icon={<MapPinIcon />}>
                {footerData.brand.address}
              </ContactItem>
              <ContactItem icon={<PhoneIcon />}>
                {footerData.brand.phone}
              </ContactItem>
              <ContactItem icon={<MailIcon />}>
                {footerData.brand.email}
              </ContactItem>
              <ContactItem icon={<ClockIcon />}>
                {footerData.brand.hours}
              </ContactItem>
            </div>
          </div>

          {/* Links */}
          {footerData.columns.map((col) => (
            <FooterColumn key={col.title} {...col} />
          ))}

          {/* App Section */}
          <div>
            <h3 className="font-semibold mb-3">Install App</h3>
            <p className="text-sm text-gray-400 mb-3">
              From App Store or Google Play
            </p>

            <div className="space-y-2">
              <div className="bg-black text-white px-3 py-2 rounded-lg text-sm w-fit">
                Google Play
              </div>
              <div className="bg-black text-white px-3 py-2 rounded-lg text-sm w-fit">
                App Store
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t">
        <div
          className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 
                        flex flex-col md:flex-row 
                        gap-4 md:items-center md:justify-between"
        >
          <div className="text-xs text-gray-500">
            © 2022 Nest. All rights reserved.
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {footerData.contact.map((c) => (
              <div key={c.phone} className="flex items-center gap-2">
                <PhoneIcon size={14} />
                <div>
                  <div className="text-[#3bb77e] font-semibold">{c.phone}</div>
                  <div className="text-xs text-gray-400">{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500">Follow us</div>
        </div>
      </div>
    </footer>
  );
}
