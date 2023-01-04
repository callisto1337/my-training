import React, { useLayoutEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import urlJoin from 'url-join';
import { child, get, update, set } from 'firebase/database';
import { Box, Grid, Divider, Typography } from '@mui/material';
import { dbRef } from 'services/firebase';
import { ROUTES, SNAPSHOT_PATHS } from 'utils/constants';
import { CenteredSpinner } from 'components/common';
import { WorkoutExercise, WorkoutPlan } from 'types';
import {
  WorkoutEditInput,
  WorkoutEditRemoveWorkoutButton,
  WorkoutEditAddExerciseButton,
  WorkoutEditExercisesList,
} from './components';
import {
  exercisesListStyles,
  contentWrapperStyles,
} from './WorkoutEdit.styles';

export function WorkoutEdit(): JSX.Element {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>();
  const [loading, setLoading] = useState<boolean>();
  const { id } = useParams();
  const navigate = useNavigate();
  const workoutPlanPath = urlJoin(SNAPSHOT_PATHS.WORKOUT_PLANS, id);

  function getWorkoutPlan() {
    setLoading(true);

    get(child(dbRef, workoutPlanPath))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setWorkoutPlan(snapshot.val());
        } else {
          navigate(ROUTES.WORKOUT_PLANS);
        }
      })
      .catch(() => {
        // TODO тут
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function updateWorkoutPlan(plan: WorkoutPlan) {
    setWorkoutPlan(plan);

    return update(dbRef, {
      [workoutPlanPath]: plan,
    });
  }

  function updateWorkoutPlanName(name: string) {
    return updateWorkoutPlan({
      ...workoutPlan,
      name,
    });
  }

  function removeWorkoutPlan() {
    return get(child(dbRef, SNAPSHOT_PATHS.WORKOUT_PLANS))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          delete data[id];

          return set(dbRef, { [SNAPSHOT_PATHS.WORKOUT_PLANS]: data });
        }
      })
      .then(() => {
        navigate(ROUTES.WORKOUT_PLANS);
      });
  }

  function addExercise(newExercise: WorkoutExercise) {
    const prevExercises = workoutPlan?.exercises || [];
    const updatedWorkoutPlan = {
      ...workoutPlan,
      exercises: [...prevExercises, newExercise],
    };

    return updateWorkoutPlan(updatedWorkoutPlan).then(() => {
      setWorkoutPlan(updatedWorkoutPlan);
    });
  }

  useLayoutEffect(() => {
    getWorkoutPlan();
  }, []);

  if (loading) {
    return <CenteredSpinner />;
  }

  return (
    <>
      <Box sx={contentWrapperStyles}>
        <Grid container spacing={2}>
          <Grid item width="100%">
            <WorkoutEditInput
              name={workoutPlan?.name}
              onSubmit={updateWorkoutPlanName}
            />
          </Grid>
          <Grid item width="100%">
            <Typography variant="h5">Упражнения</Typography>
            <WorkoutEditExercisesList
              sx={exercisesListStyles}
              exercises={workoutPlan?.exercises}
            />
          </Grid>
          <Grid item width="100%">
            <WorkoutEditAddExerciseButton onAdd={addExercise} />
          </Grid>
          <Grid item width="100%">
            <Divider />
          </Grid>
          <Grid item width="100%">
            <WorkoutEditRemoveWorkoutButton
              onRemove={removeWorkoutPlan}
              name={workoutPlan?.name}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
