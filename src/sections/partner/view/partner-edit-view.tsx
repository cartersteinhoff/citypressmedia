'use client';

import { useMemo } from 'react';
import type { IUserItem } from 'src/types/user';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PartnerNewEditForm } from '../partner-new-edit-form';

// ----------------------------------------------------------------------

// type Props = {
//   user?: IUserItem;
// };

export function PartnerEditView({ user: currentUser }: any) {
  // Ensure reserved_cities and reserved_states are arrays
  const formattedCurrentUser = useMemo(
    () => ({
      ...currentUser,
    }),
    [currentUser]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Partner', href: paths.dashboard.partner.root },
          { name: `${formattedCurrentUser?.first_name} ${formattedCurrentUser?.last_name}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PartnerNewEditForm currentUser={formattedCurrentUser} edit />
    </DashboardContent>
  );
}
