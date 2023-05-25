import React from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { FormControlLabel, Switch } from '@mui/material';
import { fetchLights, setLights } from '../redux/slices/lightsSlice';
import { connect } from 'react-redux';
import { setLightPower, setLightColorAndBrightness } from '../API';

class SwitchAndColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
  };

  getLight = () => {
    return this.props.lights[this.props.lightId];
  };

  handleColorButtonClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = async (color) => {
    const lightColor = { r: color.r, g: color.g, b: color.b };
    const lightBrightness = color.a * 100;
    await setLightColorAndBrightness(
      this.props.lightId,
      lightColor,
      lightBrightness
    );
    this.props.setLights({
      ...this.props.lights,
      [this.props.lightId]: {
        ...this.props.lights[this.props.lightId],
        color: lightColor,
        brightness: lightBrightness,
      },
    });
  };

  handleSwitchChange = async () => {
    const newPowerStatus = this.getLight().power === 'on' ? 'off' : 'on';
    await setLightPower(this.props.lightId, newPowerStatus);
    this.props.setLights({
      ...this.props.lights,
      [this.props.lightId]: {
        ...this.props.lights[this.props.lightId],
        power: newPowerStatus,
      },
    });
  };

  render() {
    const alphaColor = this.getLight().brightness / 100;

    const colorPickerButton = () => {
      let classNames = 'ColorPickerButton';
      let style = null;
      let onClick = null;

      if (this.getLight().power !== 'disconnected') {
        const { r, g, b } = this.getLight().color;
        style = {
          background: `rgba(${r},${g},${b},${alphaColor})`,
        };
      }

      if (this.getLight().power === 'on') {
        classNames += ' Enabled';
        onClick = this.handleColorButtonClick;
      }

      return <div className={classNames} style={style} onClick={onClick} />;
    };

    const lightSwitch = (
      <Switch
        disabled={this.getLight().power === 'disconnected'}
        checked={this.getLight().power === 'on'}
        onChange={this.handleSwitchChange}
      />
    );

    const colorPicker = () => {
      if (this.state.displayColorPicker) {
        return (
          <div className="ColorPicker">
            <div className="Cover" onClick={this.handleColorPickerClose} />
            <RgbaColorPicker
              color={{ ...this.getLight().color, a: alphaColor }}
              onChange={this.handleColorChange}
            />
          </div>
        );
      } else {
        return null;
      }
    };

    return (
      <div className="SwitchAndColorPicker">
        {colorPickerButton()}
        <FormControlLabel control={lightSwitch} label={this.getLight().name} />
        {colorPicker()}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    lights: state.lights.lights,
  };
};

const mapDispatchToProps = {
  setLights,
  fetchLights,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwitchAndColorPicker);
