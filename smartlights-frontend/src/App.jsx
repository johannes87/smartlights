import React from 'react';
import LightSwitches from './components/lightswitches/LightSwitches';
import Presets from './components/presets/Presets';
import GlobalSnackBar from 'components/GlobalSnackBar';
import { Paper } from '@mui/material';

function App() {
  const paperElevation = 24;
  return (
    <div className="App">
      <Paper elevation={paperElevation} className="section">
        <div className="title">Light switches</div>
        <div className="content">
          <LightSwitches />
        </div>
      </Paper>
      <Paper elevation={paperElevation} className="section">
        <div className="title">Presets</div>
        <div className="content">
          <Presets />
        </div>
      </Paper>
      <GlobalSnackBar />
    </div>
  );
}

export default App;
