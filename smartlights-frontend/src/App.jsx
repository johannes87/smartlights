import React from 'react';
import LightSwitches from './components/LightSwitches';
import Presets from './components/Presets';

function App() {
  return (
    <div className="App">
      <div className="section">
        <div className="title">Light switches</div>
        <div className="content">
          <LightSwitches />
        </div>
      </div>
      <div className="section">
        <div className="title">Presets</div>
        <div className="content">
          <Presets />
        </div>
      </div>
    </div>
  );
}

export default App;
