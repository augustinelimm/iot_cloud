export default function ProgressBar({ value = 0, color = "#8fa954" }) {
  // Ensure progress value is between 0 and 100
  const clampedProgressValue = Math.max(0, Math.min(100, Number(value) || 0));
  
  return (
    <div
      className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedProgressValue}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${clampedProgressValue}%`, backgroundColor: color }}
      />
    </div>
  );
}
