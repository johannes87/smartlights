export default function BrightnessIndicator({
  currentBrightness,
  onIndicatorClick,
}) {
  const fillColor = 'rgba(185, 185, 185, 0.52)';
  const filledBackground = {
    background: `linear-gradient(to right, ${fillColor} ${currentBrightness}%, transparent ${currentBrightness}%)`,
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
