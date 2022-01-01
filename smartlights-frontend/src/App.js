import React from 'react';
import './App.css';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { RgbaColorPicker } from 'react-colorful';
import * as API from './API';


class SwitchAndColorPicker extends React.Component {
  state = {
    color: { ...this.props.color, a: (this.props.brightness / 100) },
    power: this.props.power,
    displayColorPicker: false,
  };

  handleColorButtonClick = () => {
    if (this.state.power === 'disconnected') {
      return;
    }
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleColorChange = (color) => {
    this.setState({ color });
    const lightColor = { r: color.r, g: color.g, b: color.b };
    API.setLightColorAndBrightness(
      this.props.lightId,
      lightColor,
      color.a * 100
    );
  };

  handleSwitchChange = () => {
    const newPowerState = this.state.power === 'on' ? 'off' : 'on';
    this.setState({ power: newPowerState });
    API.setLightPower(this.props.lightId, newPowerState);
    this.props.onPowerChange && this.props.onPowerChange(this.props.lightId, newPowerState);
  };

  static getDerivedStateFromProps(props, state) {
    if (state.power !== props.power) {
      return { power: props.power };
    }
    return null;
  }

  render() {
    let colorButtonClasses = 'ColorButton';
    let colorButtonStyle = null;
    if (this.state.power !== 'disconnected') {
      colorButtonClasses += ' Enabled';

      const {r, g, b, a} = this.state.color;
      colorButtonStyle = {
        background: `rgba(${r},${g},${b},${a})`,
      };
    }

    const colorButton =
      <div
        className={ colorButtonClasses }
        style={ colorButtonStyle }
        onClick={ this.handleColorButtonClick }
      />;

    const switchControl =
      <Switch
        disabled={ this.state.power === 'disconnected' }
        checked={ this.state.power === 'on' }
        onChange={ this.handleSwitchChange }
      />;

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker =
        <div className="ColorPicker">
          <div className="Cover" onClick={ this.handleColorPickerClose }/>
          <RgbaColorPicker color={ this.state.color } onChange={ this.handleColorChange } />
        </div>;
    }

    return (
      <div className="SwitchAndColorPicker">
        { colorButton }
        <FormControlLabel control={ switchControl } label={ this.props.label } />
        { colorPicker }
      </div>
    );
  }
}

class LightSwitches extends React.Component {
  state = {
    lightStatuses: {},
  };

  handleAllLightsSwitchChange = () => {
    const newLightStatuses = {...this.state.lightStatuses};
    const newPowerStatus = this.areAllAvailableLightsTurnedOn() ? 'off' : 'on';

    Object.keys(newLightStatuses).forEach(lightId => {
      if (newLightStatuses[lightId].power !== 'disconnected') {
        newLightStatuses[lightId].power = newPowerStatus;
      }
      API.setLightPower(lightId, newPowerStatus);
    });

    this.setState({ lightStatuses: newLightStatuses });
  };

  handleLightPowerChange = (lightId, power) => {
    let newLightStatuses = {...this.state.lightStatuses};
    newLightStatuses[lightId].power = power;
    this.setState({ lightStatuses: newLightStatuses });
  };

  areAllAvailableLightsTurnedOn = () => {
    return Object.values(this.state.lightStatuses).every(l => l.power === 'on' || l.power === 'disconnected');
  }

  async fetchLights() {
    const lightStatuses = await API.getLights();
    this.setState({ lightStatuses });
  }

  componentDidMount() {
    this.fetchLights();
  }

  render() {
    return (
      <FormGroup className="LightSwitches">
        <FormControlLabel
          control={
            <Switch
              checked={ this.areAllAvailableLightsTurnedOn() }
              onChange={ this.handleAllLightsSwitchChange }
            />
          }
          label="All lights"
        />
        { Object.values(this.state.lightStatuses).length === 0 && <div className='LoaderContainer'><div className='Loader' /></div> }
        { Object.entries(this.state.lightStatuses).map(([lightId, lightStatus]) =>
          <SwitchAndColorPicker
            key={ lightId }
            lightId={ lightId }
            label={ lightStatus.name }
            color={ lightStatus.color }
            power={ lightStatus.power }
            brightness={ lightStatus.brightness }
            onPowerChange={ this.handleLightPowerChange }
          />
        ) }
      </FormGroup>
    );
  }
}

function App() {
  return (
    <div className="App">
      <h1>Light switches</h1>
      <LightSwitches />
    </div>
  );
}

export default App;
