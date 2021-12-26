import React, { useState, useEffect } from 'react';
import './App.css';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';
import { getLights, setLightPower } from './API';


class SwitchAndColorPicker extends React.Component {
  state = {
    color: this.props.color,
    power: this.props.power,
    displayColorPicker: false,
  };

  handleClick = () => {
    if (this.state.power === 'disconnected') {
      return;
    }
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex })
  };

  handleSwitchChange = () => {
    const newPowerState = this.state.power === 'on' ? 'off' : 'on';
    this.setState({ power: newPowerState });
    setLightPower(this.props.lightId, newPowerState);
  };

  render() {
    const styles = {
      colorButton: {
        background: this.state.color,
        cursor: 'pointer',
      },
    };

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker =
        <div className="ColorPicker">
          <div className="Cover" onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
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
        <div style={ styles.colorButton } className="ColorButton" onClick={ this.handleClick } />
        <FormControlLabel control={ switchControl } label={ this.props.label } />
        { colorPicker }
      </div>
    );
  }
}

function App() {
  const [lights, setLights] = useState([]);
  const fetchLights = () => {
    getLights()
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
      })
  }

  useEffect(fetchLights, []);

  return (
    <div className="App">
      <h1>Light switches</h1>
      <FormGroup className="LightSwitches">
        <FormControlLabel control={<Switch />} label="All lights" />
        { lights }
      </FormGroup>
    </div>
  );
}

export default App;
