import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';

class SwitchAndColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleColorButtonClick = () => {
    if (this.props.lightStatus.power === 'disconnected') {
      return;
    }
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = (color) => {
    this.props.onColorChange &&
      this.props.onColorChange(this.props.lightId, color);
  };

  handleSwitchChange = () => {
    this.props.onPowerChange &&
      this.props.onPowerChange(
        this.props.lightId,
        this.props.lightStatus.power === 'on' ? 'off' : 'on'
      );
  };

  render() {
    let colorButtonClasses = 'ColorButton';
    let colorButtonStyle = null;
    if (this.props.lightStatus.power !== 'disconnected') {
      colorButtonClasses += ' Enabled';

      const { r, g, b } = this.props.lightStatus.color;
      const a = this.props.lightStatus.brightness / 100;
      colorButtonStyle = {
        background: `rgba(${r},${g},${b},${a})`,
      };
    }

    const colorButton = (
      <div
        className={colorButtonClasses}
        style={colorButtonStyle}
        onClick={this.handleColorButtonClick}
      />
    );

    const switchControl = (
      <Switch
        disabled={this.props.lightStatus.power === 'disconnected'}
        checked={this.props.lightStatus.power === 'on'}
        onChange={this.handleSwitchChange}
      />
    );

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker = (
        <div className="ColorPicker">
          <div className="Cover" onClick={this.handleColorPickerClose} />
          <RgbaColorPicker
            color={this.props.lightStatus.color}
            onChange={this.handleColorChange}
          />
        </div>
      );
    }

    return (
      <div className="SwitchAndColorPicker">
        {colorButton}
        <FormControlLabel
          control={switchControl}
          label={this.props.lightStatus.name}
        />
        {colorPicker}
      </div>
    );
  }
}

export default SwitchAndColorPicker;
