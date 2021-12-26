import React, { useState, useEffect } from 'react';
import './App.css';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { SketchPicker } from 'react-color';
import * as API from './API';


class SwitchAndColorPicker extends React.Component {
  state = {
    color: this.props.color,
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
    this.setState({ color: color.hex });
    API.setLightColor(this.props.lightId, color.rgb);
  };

  handleSwitchChange = () => {
    const newPowerState = this.state.power === 'on' ? 'off' : 'on';
    this.setState({ power: newPowerState });
    API.setLightPower(this.props.lightId, newPowerState);
  };

  render() {
    let colorButtonClasses = 'ColorButton';
    let colorButtonStyle = null;
    if (this.state.power !== 'disconnected') {
      colorButtonClasses += ' Enabled';
      colorButtonStyle = { background: this.state.color };
    }

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker =
        <div className="ColorPicker">
          <div className="Cover" onClick={ this.handleColorPickerClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleColorChange } />
        </div>;
    }

    const switchControl =
      <Switch
        disabled={ this.state.power === 'disconnected' }
        checked={ this.state.power === 'on' }
        onChange={ this.handleSwitchChange }
      />

    return (
      <div className="SwitchAndColorPicker">
        <div
          className={ colorButtonClasses }
          style={ colorButtonStyle }
          onClick={ this.handleColorButtonClick }
        />
        <FormControlLabel control={ switchControl } label={ this.props.label } />
        { colorPicker }
      </div>
    );
  }
}

function App() {
  const [lights, setLights] = useState([]);
  const [lightsLoaded, setLightsLoaded] = useState(false);

  const fetchLights = () => {
    API.getLights()
      .then(lightStates => {
        setLights(lightStates.map(lightState => {
          const hexColor = lightState.color ?
            `#${Number(lightState.color).toString(16)}`
            : null;

          return <SwitchAndColorPicker
            key={lightState.id}
            lightId={lightState.id}
            label={lightState.name}
            color={hexColor}
            power={lightState.power}
            brightness={lightState.brightness}
          />
        }));
        setLightsLoaded(true);
      })
  }

  useEffect(fetchLights, []);

  return (
    <div className="App">
      <h1>Light switches</h1>
      <FormGroup className="LightSwitches">
        <FormControlLabel control={<Switch />} label="All lights" />
        { !lightsLoaded && <div className='LoaderContainer'><div className='Loader' /></div> }
        { lights }
      </FormGroup>
    </div>
  );
}

export default App;
