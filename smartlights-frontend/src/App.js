import React from 'react';
import './App.css';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';


class SwitchAndColorPicker extends React.Component {
  state = {
    color: '#fff',
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

    return (
      <div className="SwitchAndColorPicker">
        <div style={ styles.colorButton } onClick={ this.handleClick } />
        <FormControlLabel control={<Switch />} label={this.props.label} />
        { colorPicker }
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <h1>Light switches</h1>
      <FormGroup className="LightSwitches">
        <FormControlLabel control={<Switch />} label="All lights" />
        <SwitchAndColorPicker label="Bedroom" />
        <SwitchAndColorPicker label="Livingroom" />
        <SwitchAndColorPicker label="Kitchen" />
      </FormGroup>
    </div>
  );
}

export default App;
