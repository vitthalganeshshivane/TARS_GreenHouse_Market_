import { Link } from "react-router";
import { cn } from "@/lib/utils"

export default function AdverseComponent({ color, image, text, link, className }) {
  return (
    <div style={{ background: color }} className={cn("flex md:w-md justify-center items-center py-9 px-5 rounded-lg", className)}>

      {/* Content */}
      <div className="max-w-[60%]">
        <h2 className="text-xl md:text-2xl font-bold mb-3">
          {text}
        </h2>

        <Link
          href={link}
          className="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Explore
        </Link>
      </div>

      {/* Image (bottom-right corner) */}
      <img
        src={image}
        alt={text}
        className="h-full w-1/2 object-contain"
      />
    </div>
  );
}
