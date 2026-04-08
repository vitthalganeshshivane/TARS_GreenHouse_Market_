
export default function AdverseComponent({ image, text, link }) {
  return (
    <div className="bg-white relative w-150 min-h-[200px] rounded-xl p-6 overflow-hidden">

      {/* Content */}
      <div className="max-w-[60%]">
        <h2 className="text-xl md:text-2xl font-bold mb-3">
          {text}
        </h2>

        <a
          href={link}
          className="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Explore
        </a>
      </div>

      {/* Image (bottom-right corner) */}
      <img
        src={image}
        alt={text}
        className="absolute bottom-0 right-0 w-50 md:w-40 object-contain"
      />
    </div>
  );
}
