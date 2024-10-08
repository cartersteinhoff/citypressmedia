import { CONFIG } from 'src/config-global';

import { CarouselView } from 'src/sections/_examples/extra/carousel-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Carousel | Components - ${CONFIG.appName}` };

export default function Page() {
  return <CarouselView />;
}
