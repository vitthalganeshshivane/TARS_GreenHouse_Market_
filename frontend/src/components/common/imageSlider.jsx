import { useEffect, useState, useCallback, useRef } from "react";
export default function ImageSlider({ slides = [], interval = 3000 }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [goNext, interval, isPaused, slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full h-[160px] sm:h-[240px] md:h-[320px] lg:h-[350px] overflow-hidden rounded-sm group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full">
            <img
              src={slide.src}
              alt={slide.alt || ""}
              className="w-full h-full object-cover rounded-sm"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      {/* <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-70 lg:opacity-0 lg:group-hover:opacity-100"
      >
        ‹
      </button> */}

      {/* <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-70 lg:opacity-0 lg:group-hover:opacity-100"
      >
        ›
      </button> */}

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1.5 rounded-full ${
              current === index ? "w-5 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
