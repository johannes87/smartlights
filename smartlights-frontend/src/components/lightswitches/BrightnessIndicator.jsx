export default function BrightnessIndicator({
  currentBrightness,
  onIndicatorClick,
}) {
  const filledBackground = {
    background: `linear-gradient(to right, grey ${currentBrightness}%, transparent ${currentBrightness}%)`,
  };
  return (
    <button
      className="brightness-indicator-component"
      style={filledBackground}
      onClick={onIndicatorClick}
    >
      {currentBrightness} %
    </button>
  );
}
