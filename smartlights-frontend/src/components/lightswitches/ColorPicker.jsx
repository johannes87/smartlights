import { RgbColorPicker } from 'react-colorful';

export default function ColorPicker({
  currentColor,
  onColorChange,
  open,
  onClose,
}) {
  return (
    open && (
      <div className="color-picker-component">
        <button className="page-background" onClick={onClose} />
        <RgbColorPicker color={{ ...currentColor }} onChange={onColorChange} />
      </div>
    )
  );
}
