export default function ChooseUsComponent({ icon, heading, subHeading }) {
  return (
    <div className="w-full md:w-auto bg-white rounded-2xl p-5 sm:p-6 
                    shadow-sm hover:shadow-lg 
                    transition-all duration-300 
                    flex items-start gap-4 
                    border border-gray-100 
                    hover:border-[#3bb77e]/30">

      {/* Icon */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 
                      flex items-center justify-center 
                      bg-[#3bb77e]/10 rounded-xl 
                      shrink-0">
        <img
          src={icon}
          alt="icon"
          className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <h2 className="text-base sm:text-lg font-semibold text-[#253D4E] mb-1">
          {heading}
        </h2>

        <span className="text-sm text-gray-500 leading-relaxed">
          {subHeading}
        </span>
      </div>
    </div>
  );
}
