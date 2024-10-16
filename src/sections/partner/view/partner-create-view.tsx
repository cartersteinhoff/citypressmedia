'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PartnerNewEditForm } from '../partner-new-edit-form';

// ----------------------------------------------------------------------

export function PartnerCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new partner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Partner', href: paths.dashboard.partner.root },
          { name: 'New partner' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PartnerNewEditForm />
    </DashboardContent>
  );
}
