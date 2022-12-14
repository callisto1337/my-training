import React from 'react';
import { BaseTemplate } from 'components/templates';
import { WorkoutEdit } from 'components/features';
import { ROUTES, ROUTES_TITLES } from 'utils/constants';

const breadcrumbs = [
  {
    to: ROUTES.WORKOUT_PLANS,
    children: ROUTES_TITLES.WORKOUT_PLANS,
  },
  {
    to: ROUTES.WORKOUT_PLANS,
    children: ROUTES_TITLES.WORKOUT_PLAN_EDIT,
    active: true,
  },
];

export function WorkoutEditPage(): JSX.Element {
  return (
    <BaseTemplate
      title={ROUTES_TITLES.WORKOUT_PLAN_EDIT}
      breadcrumbs={breadcrumbs}
    >
      <BaseTemplate.Content>
        <WorkoutEdit />
      </BaseTemplate.Content>
    </BaseTemplate>
  );
}
