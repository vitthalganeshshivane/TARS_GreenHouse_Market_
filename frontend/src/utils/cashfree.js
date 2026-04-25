export const loadCashfreeSdk = () => {
  return new Promise((resolve, rejected) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));

    document.body.appendChild(script);
  });
};

export const openCashfreeCheckout = async (paymentSessionId) => {
  const Cashfree = await loadCashfreeSdk();

  const cashfree = Cashfree({
    mode:
      import.meta.env.VITE_APP_ENV === "production" ? "production" : "sandbox",
  });

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget: "_self",
  });
};
