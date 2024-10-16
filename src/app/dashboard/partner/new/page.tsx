import { CONFIG } from 'src/config-global';

import { PartnerCreateView } from 'src/sections/Partner/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PartnerCreateView />;
}
