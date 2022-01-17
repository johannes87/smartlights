import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';

class SwitchAndColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleColorButtonClick = () => {
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
    const colorPickerButton = () => {
      let colorPickerButtonClasses = 'ColorPickerButton';
      let colorPickerButtonStyle = null;
      let onClick = null;

      if (this.props.lightStatus.power !== 'disconnected') {
        const { r, g, b } = this.props.lightStatus.color;
        const a = this.props.lightStatus.brightness / 100;
        colorPickerButtonStyle = {
          background: `rgba(${r},${g},${b},${a})`,
        };
      }

      if (this.props.lightStatus.power === 'on') {
        colorPickerButtonClasses += ' Enabled';
        onClick = this.handleColorButtonClick;
      }

      return (
        <div
          className={colorPickerButtonClasses}
          style={colorPickerButtonStyle}
          onClick={onClick}
        />
      );
    }

    const lightSwitch = (
      <Switch
        disabled={this.props.lightStatus.power === 'disconnected'}
        checked={this.props.lightStatus.power === 'on'}
        onChange={this.handleSwitchChange}
      />
    );

    const colorPicker = () => {
      if (this.state.displayColorPicker) {
        return (
          <div className="ColorPicker">
            <div className="Cover" onClick={this.handleColorPickerClose} />
            <RgbaColorPicker
              color={this.props.lightStatus.color}
              onChange={this.handleColorChange}
            />
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <div className="SwitchAndColorPicker">
        {colorPickerButton()}
        <FormControlLabel
          control={lightSwitch}
          label={this.props.lightStatus.name}
        />
        {colorPicker()}
      </div>
    );
  }
}

export default SwitchAndColorPicker;
