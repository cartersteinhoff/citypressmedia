import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
