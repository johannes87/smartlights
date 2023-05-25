import React, { useCallback, useEffect, useState } from 'react';
import { addPreset, getLights, getPresets, removePreset } from '../API';

export default function Presets() {
  const [presets, setPresets] = useState(null);
  const [newPresetName, setNewPresetName] = useState('');

  const onUsePreset = useCallback((presetData) => {}, []);

  const onRemovePreset = useCallback(async (presetName) => {
    await removePreset(presetName);
    setPresets(await getPresets());
  }, []);

  const onAddNewPreset = useCallback(async () => {
    if (newPresetName) {
      const lights = await getLights();
      for (const light of Object.keys(lights)) {
        // we don't want to save the name, we don't need it
        delete lights[light].name;
      }
      await addPreset(newPresetName, lights);
      setPresets(await getPresets());
      setNewPresetName('');
    }
  }, [newPresetName]);

  useEffect(() => {
    async function loadPresets() {
      setPresets(await getPresets());
    }
    loadPresets();
  }, []);

  return (
    presets && (
      <div className="Presets">
        <div className="PresetList">
          {Object.entries(presets).map(([presetName, presetData]) => (
            <div className="PresetListEntry" key={presetName}>
              {presetName}
              <button type="button" onClick={() => onUsePreset(presetData)}>
                Use Preset
              </button>
              <button type="button" onClick={() => onRemovePreset(presetName)}>
                Delete Preset
              </button>
            </div>
          ))}
        </div>
        <div className="AddNewPreset">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Enter a name for the new preset..."
          />
          <button type="button" onClick={onAddNewPreset}>
            Add curent colors as preset!
          </button>
        </div>
      </div>
    )
  );
}
