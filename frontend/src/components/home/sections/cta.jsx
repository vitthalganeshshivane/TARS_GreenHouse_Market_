import { useState } from "react";

export default function Cta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;

    console.log("Subscribed:", email);

    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 py-8 px-5 rounded-lg bg-gray-100 overflow-hidden">

        {/* Content */}
        <div className="w-full md:w-1/2 z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Stay Home & get your daily needs from our shop
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Start Your Daily Shopping
          </p>

          {/* Newsletter Form */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-black"
                required
              />

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <p className="text-green-600 text-sm font-medium">
              ✓ Subscribed successfully
            </p>
          )}
        </div>

        {/* Image */}
        <div className="hidden w-full md:w-1/2 md:flex justify-center md:justify-end">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/004/948/401/small/organic-shop-poster-finished-design-trolley-with-vegetables-vector.jpg"
            alt="grocery"
            className="w-40 sm:w-56 md:w-64 lg:w-72 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
