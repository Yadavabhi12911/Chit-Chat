import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" 
    ? "bg-green-500" 
    : type === "error" 
    ? "bg-red-500" 
    : "bg-blue-500";

  const icon = type === "success" 
    ? "✓" 
    : type === "error" 
    ? "✕" 
    : "ℹ";

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md border border-white/20 backdrop-blur-sm`}
      >
        <span className="text-2xl font-bold">{icon}</span>
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
