import { CONFIG } from 'src/config-global';

import { PartnerListView } from 'src/sections/partner/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Partner list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PartnerListView type="partner" />;
}
