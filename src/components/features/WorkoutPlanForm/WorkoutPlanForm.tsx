import React, { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { WorkoutPlan } from 'types';
import { Controller, useForm } from 'react-hook-form';
import { FORM_ERRORS } from 'utils/constants';
import { ModalConfirm } from 'components/common/ModalConfirm';
import { actionsStyles } from './WorkoutPlanForm.styles';

interface WorkoutPlanItemProps {
  name?: string;
  onSubmit?: (data: WorkoutPlan) => Promise<unknown>;
  onRemove?: () => Promise<unknown>;
}

export function WorkoutPlanForm(props: WorkoutPlanItemProps): JSX.Element {
  const { name, onSubmit, onRemove } = props;
  const [loading, setLoading] = useState<boolean>();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>();
  const { handleSubmit, control } = useForm<WorkoutPlan>({
    defaultValues: {
      name,
    },
  });

  function onSubmitHandler(data: WorkoutPlan) {
    setLoading(true);

    onSubmit(data).finally(() => {
      setLoading(false);
    });
  }

  function onRemoveHandler() {
    setShowConfirmModal(false);
    setLoading(true);

    onRemove().finally(() => {
      setLoading(false);
    });
  }

  function onOpenModalHandler() {
    setShowConfirmModal(true);
  }

  function onCloseModalHandler() {
    setShowConfirmModal(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <Grid container spacing={3}>
          <Grid item width="100%">
            <Controller
              name="name"
              control={control}
              rules={{ required: FORM_ERRORS.REQUIRED }}
              render={({ field, fieldState }) => {
                return (
                  <TextField
                    autoComplete="off"
                    label="Название"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    fullWidth
                    disabled={loading}
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          <Grid item width="100%">
            <Grid container spacing={2} sx={actionsStyles}>
              {onRemoveHandler && (
                <Grid item>
                  <Button
                    onClick={onOpenModalHandler}
                    variant="contained"
                    disabled={loading}
                    color="error"
                  >
                    Удалить
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button variant="contained" type="submit" disabled={loading}>
                  Сохранить
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <ModalConfirm
        open={showConfirmModal}
        confirmText={`Вы уверены, что хотите удалить программу "${name}"`}
        onClose={onCloseModalHandler}
        onConfirm={onRemoveHandler}
      />
    </>
  );
}