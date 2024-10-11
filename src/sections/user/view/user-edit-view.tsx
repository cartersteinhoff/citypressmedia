'use client';

import { useMemo } from 'react';
import type { IUserItem } from 'src/types/user';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export function UserEditView({ user: currentUser }: Props) {
  // Ensure reserved_cities and reserved_states are arrays
  const formattedCurrentUser = useMemo(
    () => ({
      ...currentUser,
      reserved_cities: Array.isArray(currentUser.reserved_cities)
        ? currentUser.reserved_cities
        : currentUser.reserved_cities
          ? [currentUser.reserved_cities]
          : [], // Ensure it's an array
      reserved_states: Array.isArray(currentUser.reserved_states)
        ? currentUser.reserved_states
        : currentUser.reserved_states
          ? [currentUser.reserved_states]
          : [], // Ensure it's an array
    }),
    [currentUser]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.chapterLeader.root },
          { name: `${formattedCurrentUser?.first_name} ${formattedCurrentUser?.last_name}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentUser={formattedCurrentUser} edit />
    </DashboardContent>
  );
}
