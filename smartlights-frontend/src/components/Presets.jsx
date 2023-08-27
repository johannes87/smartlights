import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import List from '@mui/material/List';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import { createPreset, deletePreset, getPresets, loadPreset } from '../Api';

export default function Presets() {
  const [presets, setPresets] = useState(undefined);
  const [newPresetName, setNewPresetName] = useState('');

  async function fetchPresets() {
    setPresets(await getPresets());
  }

  const createNewPresetClick = useCallback(async () => {
    const result = await createPreset(newPresetName);
    // TODO: error handling
    setNewPresetName('');
    await fetchPresets();
  }, [newPresetName]);

  const deletePresetClick = useCallback(async (presetName) => {
    const result = await deletePreset(presetName);
    // TODO: confirmation dialog
    // TODO: error handling
    await fetchPresets();
  }, []);

  const loadPresetClick = useCallback(async (presetName) => {
    const result = await loadPreset(presetName);
    // TODO: error handling
    // TODO: success notification
  }, []);

  useEffect(() => {
    fetchPresets();
  }, []);

  return (
    <div className="presets-component">
      {presets && (
        <>
          <div className="new-preset">
            <TextField
              id="new-preset-name"
              label="Name your new preset"
              variant="filled"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
            />
            <Button variant="contained" onClick={createNewPresetClick}>
              Create it!
            </Button>
          </div>
          <List>
            {presets.map(
              (
                /** @type {{ presetName: string; createDate: string; }} */ preset
              ) => (
                <ListItem
                  key={preset.presetName}
                  className="preset"
                  secondaryAction={
                    <div className="secondary-actions">
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deletePresetClick(preset.presetName)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  }
                >
                  <ListItemButton
                    onClick={() => loadPresetClick(preset.presetName)}
                  >
                    <ListItemText
                      primary={preset.presetName}
                      secondary={DateTime.fromISO(preset.createDate).toFormat(
                        'dd.LL.yyyy HH:mm:ss'
                      )}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </>
      )}
    </div>
  );
}
