export default function ColorIndicator({ lightStatus, onIndicatorClick }) {
  const isEnabled = lightStatus.power === 'on';
  let style = null;

  if (lightStatus.power !== 'disconnected') {
    const { r, g, b } = lightStatus.color;
    style = {
      background: `rgb(${r},${g},${b})`,
    };
  }

  return (
    <button
      className={`color-indicator-component ${isEnabled ? 'enabled' : ''}`}
      style={style}
      onClick={isEnabled ? onIndicatorClick : null}
    />
  );
}
