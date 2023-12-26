export default function BrightnessIndicator({
  currentBrightness,
  onIndicatorClick,
}) {
  const filledBackground = {
    background: `linear-gradient(to right, grey ${currentBrightness}%, transparent ${currentBrightness}%)`,
  };
  return (
    <div
      className="brightness-indicator-component"
      style={filledBackground}
      onClick={onIndicatorClick}
    >
      {currentBrightness} %
    </div>
  );
}
