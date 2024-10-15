import { CONFIG } from 'src/config-global';

import { PartnerListView } from 'src/sections/partner/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PartnerListView type="chapterLeader" />;
}
