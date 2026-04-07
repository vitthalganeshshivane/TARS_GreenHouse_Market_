import { useEffect, useState, useCallback, useRef } from "react";

export default function ImageSlider({ slides = [], interval = 3000 }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slides.length) % slides.length); // FIX 1: removed dead `prev` param
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto slide
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [goNext, interval, isPaused, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // FIX 2: Touch/swipe support
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
      className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh] overflow-hidden rounded-xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}   // FIX 2: swipe support
      onTouchEnd={handleTouchEnd}       // FIX 2: swipe support
      role="region"
      aria-label="Image slider"
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative flex-shrink-0"
            aria-hidden={index !== current} // FIX 3: hide inactive slides from screen readers
          >
            <a
              href={slide.href}
              tabIndex={index !== current ? -1 : 0}
              aria-label={slide.alt || `Slide ${index + 1}`} // FIX 3: accessible link label
            >
              <img
                src={slide.src}
                alt={slide.alt || `Slide ${index + 1}`} // FIX 3: use slide.alt if provided
                className="w-full h-full object-cover cursor-pointer"
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </a>
          </div>
        ))}
      </div>

      {/* Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Previous slide" // FIX 3: aria-label on arrow buttons
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 md:opacity-0 group-hover:opacity-100 touch:opacity-100 transition hover:bg-black/60 text-lg md:text-xl"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Next slide" // FIX 3: aria-label on arrow buttons
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 md:opacity-0 group-hover:opacity-100 touch:opacity-100 transition hover:bg-black/60 text-lg md:text-xl"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
          role="tablist"           // FIX 3: semantic role for dot nav
          aria-label="Slide navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              role="tab"                                      // FIX 3: semantic tab role
              aria-selected={current === index}              // FIX 3: selected state
              aria-label={`Go to slide ${index + 1}`}       // FIX 3: descriptive label
              className={`h-1.5 rounded-full transition-all duration-300 ${current === index
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
