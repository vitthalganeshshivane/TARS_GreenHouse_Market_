import { useRef } from "react";
import { Input } from "@/components/ui/input";

export default function OTPInput({ length = 6, onChange }) {
  const inputsRef = useRef([]);

  const triggerChange = () => {
    const otp = inputsRef.current.map((input) => input?.value || "").join("");
    onChange?.(otp);
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    triggerChange();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    pasteData.split("").forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index].value = char;
      }
    });

    const nextIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[nextIndex]?.focus();

    triggerChange();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          maxLength={1}
          inputMode="numeric"
          className="h-12 w-10 rounded-xl border-0 bg-slate-100 text-center text-lg font-semibold text-slate-900 shadow-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:h-14 sm:w-12 sm:text-xl"
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}