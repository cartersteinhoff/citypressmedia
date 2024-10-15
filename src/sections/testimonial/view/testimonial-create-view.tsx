'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// import { TestimonialNewEditForm } from '../testimonial-new-edit-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new user"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.chapterLeader.root },
          { name: 'New user' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* <TestimonialNewEditForm /> */}
    </DashboardContent>
  );
}
