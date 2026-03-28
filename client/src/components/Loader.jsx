import { Loader2 } from "lucide-react";
import clsx from "clsx";

const Loader = ({
  size = 24,
  fullScreen = false,
  text = "",
  className = "",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2
        size={size}
        className={clsx("animate-spin text-gray-600", className)}
      />
      {text && (
        <p className="text-sm text-gray-500">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;