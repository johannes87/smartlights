export default function BrightnessIndicator({
  lightStatus,
  onIndicatorClick,
}) {
  const currentBrightness = lightStatus.brightness;
  const isEnabled = lightStatus.power !== 'disconnected';
  const fillColor = 'rgba(185, 185, 185, 0.52)';
  const filledBackground = {
    background: `linear-gradient(to right, ${fillColor} ${currentBrightness}%, transparent ${currentBrightness}%)`,
  };
  const brightnessText = isEnabled ? `${currentBrightness}%` : '🚫';

  return (
    <button
      className={`brightness-indicator-component ${isEnabled ? 'enabled': ''}`}
      style={filledBackground}
      onClick={isEnabled ? onIndicatorClick : null}
    >
      {brightnessText}
    </button>
  );
}
