import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(function AlertDialogOverlay(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] ${className}`}
      {...props}
    />
  );
});

const AlertDialogContent = React.forwardRef(function AlertDialogContent(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl focus:outline-none ${className}`}
        {...props}
      />
    </AlertDialogPortal>
  );
});

const AlertDialogHeader = ({ className = "", ...props }) => (
  <div
    className={`flex flex-col space-y-2 text-left ${className}`}
    {...props}
  />
);

const AlertDialogFooter = ({ className = "", ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 ${className}`}
    {...props}
  />
);

const AlertDialogTitle = React.forwardRef(function AlertDialogTitle(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={`text-lg font-bold text-gray-800 ${className}`}
      {...props}
    />
  );
});

const AlertDialogDescription = React.forwardRef(function AlertDialogDescription(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={`text-sm text-gray-500 ${className}`}
      {...props}
    />
  );
});

const AlertDialogAction = React.forwardRef(function AlertDialogAction(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors focus:outline-none ${className}`}
      {...props}
    />
  );
});

const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(
  { className = "", ...props },
  ref,
) {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none ${className}`}
      {...props}
    />
  );
});

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
