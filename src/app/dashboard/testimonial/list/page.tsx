import { CONFIG } from 'src/config-global';

import { TestimonialListView } from 'src/sections/testimonial/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TestimonialListView type="chapterLeader" />;
}
