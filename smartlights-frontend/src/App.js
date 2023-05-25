import React from 'react';
import './App.css';
import LightSwitches from './components/LightSwitches';
import Presets from './components/Presets';

function App() {
  return (
    <div className="App">
      <h1>Light switches</h1>
      <LightSwitches />
      <Presets />
    </div>
  );
}

export default App;
