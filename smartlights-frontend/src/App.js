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
    const styles = reactCSS({
      'default': {
        colorButton: {
          background: this.state.color,
          display: 'inline-flex',
          border: '1px solid black',
          borderRadius: '4px',
          width: '20px',
          height: '20px',
          marginRight: '0.8em',
          cursor: 'pointer',
          position: 'relative',
          top: '7px',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    let colorPicker = null;
    if (this.state.displayColorPicker) {
      colorPicker =
        <div style={ styles.popover }>
          <div className="cover" style={ styles.cover } onClick={ this.handleClose }/>
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
        <div style={ styles.colorButton } onClick={ this.handleClick } />
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
