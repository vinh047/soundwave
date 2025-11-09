import { ClipLoader } from "react-spinners";

type SpinnerProps = {
  fullscreen?: boolean; // toàn trang hay không
  size?: number;
  color?: string;
  label?: string;
  overlay?: boolean; // có lớp mờ nền không
};

export default function Spinner({
  fullscreen = false,
  size = 40,
  color = "#36d7b7",
  label,
  overlay = false,
}: SpinnerProps) {
  const base = "flex flex-col items-center justify-center";

  if (fullscreen) {
    return (
      <div
        className={`fixed inset-0 z-50 ${base} ${
          overlay ? "bg-black/30 backdrop-blur-sm" : ""
        }`}
      >
        <ClipLoader size={size} color={color} />
        {label && (
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm animate-pulse">
            {label}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`${base} py-4`}>
      <ClipLoader size={size} color={color} />
      {label && (
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
}
