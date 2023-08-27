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
import {
  createPreset,
  deletePreset,
  getPresets,
  loadPreset,
  renamePreset,
} from '../Api';
import ConfirmPresetDeletionDialog from './ConfirmPresetDeletionDialog';
import RenamePresetDialog from './RenamePresetDialog';

export default function Presets() {
  const [presets, setPresets] = useState(undefined);
  const [newNameForCreatePreset, setNewNameForCreatePreset] = useState('');
  const [createPresetLoading, setCreatePresetLoading] = useState(false);
  const [confirmDeleteDialogPresetName, setConfirmDeleteDialogPresetName] =
    useState(null);
  const [renameDialogPresetName, setRenameDialogPresetName] = useState(null);

  async function fetchPresets() {
    setPresets(await getPresets());
  }

  const createNewPresetClick = useCallback(async () => {
    setCreatePresetLoading(true);
    const result = await createPreset(newNameForCreatePreset.trim());
    // TODO: error handling
    setNewNameForCreatePreset('');
    await fetchPresets();
    setCreatePresetLoading(false);
  }, [newNameForCreatePreset]);

  const deletePresetClick = useCallback(async (presetName) => {
    setConfirmDeleteDialogPresetName(presetName);
  }, []);

  const loadPresetClick = useCallback(async (presetName) => {
    const result = await loadPreset(presetName);
    // TODO: error handling
    // TODO: success notification
  }, []);

  const onDeletePresetConfirmed = useCallback(async () => {
    const result = await deletePreset(confirmDeleteDialogPresetName);
    // TODO: error handling
    // TODO: success notification
    await fetchPresets();
    setConfirmDeleteDialogPresetName(null);
  }, [confirmDeleteDialogPresetName]);

  const onRenamePresetNewNameChosen = useCallback(
    async (presetName, newPresetName) => {
      const result = await renamePreset(presetName, newPresetName);
      // TODO: error handling
      // TODO: succes noti
      await fetchPresets();
      setRenameDialogPresetName(null);
    },
    []
  );

  useEffect(() => {
    fetchPresets();
  }, []);

  return (
    <div className="presets-component">
      <ConfirmPresetDeletionDialog
        presetName={confirmDeleteDialogPresetName}
        onClose={() => setConfirmDeleteDialogPresetName(null)}
        onDeleteConfirmed={onDeletePresetConfirmed}
      />
      <RenamePresetDialog
        presetName={renameDialogPresetName}
        onNewNameChosen={onRenamePresetNewNameChosen}
        onClose={() => setRenameDialogPresetName(null)}
      />
      {presets && (
        <>
          <div className="new-preset">
            <TextField
              id="new-preset-name"
              label="New preset name"
              variant="filled"
              value={newNameForCreatePreset}
              onChange={(e) => setNewNameForCreatePreset(e.target.value)}
              disabled={createPresetLoading}
            />
            <Button
              variant="contained"
              onClick={createNewPresetClick}
              disabled={createPresetLoading}
            >
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
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() =>
                          setRenameDialogPresetName(preset.presetName)
                        }
                      >
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
