import LiveExampleBuilder from '@site/src/components/LiveExampleBuilder';

import AvatarDemo from './examples/avatar.js';
import BadgeDemo from './examples/badge.js';
import BannerDemo from './examples/banner.js';
import BreadcrumbDemo from './examples/breadcrumb.js';
import CardDemo from './examples/card.js';
import ConnectionIndicatorDemo from './examples/connection-indicator.js';
import DisclosureDemo from './examples/disclosure.js';
import DividerDemo from './examples/divider.js';
import HorizontalScrollDemo from './examples/horizontal-scroll.js';
import IconDemo from './examples/icon.js';
import ProgressRingDemo from './examples/progress-ring.js';
import ProgressDemo from './examples/progress.js';
import SkeletonDemo from './examples/skeleton.js';

const cardData = [
  {
    "heading": "Avatar",
    "link": "/develop/client-capabilities/presentation/client-presentation-avatar/",
    "text": "Display image or text representing a person",
    children: <AvatarDemo />,
  },
  {
    "heading": "Badge",
    "link": "/develop/client-capabilities/presentation/client-presentation-badge/",
    "text": "Display a small count or status indicator",
    children: <BadgeDemo />,
  },
  {
    "heading": "Banner",
    "link": "/develop/client-capabilities/presentation/client-presentation-banner/",
    "text": "Display important messages or announcements",
    children: <BannerDemo />,
  },
  {
    "heading": "Breadcrumb",
    "link": "/develop/client-capabilities/presentation/client-presentation-breadcrumb/",
    "text": "Show navigation hierarchy",
    children: <BreadcrumbDemo />,
  },
  {
    "heading": "Card",
    "link": "/develop/client-capabilities/presentation/client-presentation-card/",
    "text": "Container for related content and actions",
    children: <CardDemo />,
  },
  {
    "heading": "Connection Indicator",
    "link": "/develop/client-capabilities/presentation/client-presentation-connection-indicator/",
    "text": "Display network connection status",
    children: <ConnectionIndicatorDemo />,
  },
  {
    "heading": "Disclosure",
    "link": "/develop/client-capabilities/presentation/client-presentation-disclosure/",
    "text": "Toggle visibility of content",
    children: <DisclosureDemo />,
  },
  {
    "heading": "Divider",
    "link": "/develop/client-capabilities/presentation/client-presentation-divider/",
    "text": "Separate content visually",
    children: <DividerDemo />,
  },
  {
    "heading": "Horizontal Scroll",
    "link": "/develop/client-capabilities/presentation/client-presentation-horizontal-scroll/",
    "text": "Horizontally scrollable container",
    children: <HorizontalScrollDemo />,
  },
  {
    "heading": "Icon",
    "link": "/develop/client-capabilities/presentation/client-presentation-icon/",
    "text": "Display symbolic visual elements",
    children: <IconDemo />,
  },
  {
    "heading": "Progress Ring",
    "link": "/develop/client-capabilities/presentation/client-presentation-progress-ring/",
    "text": "Show circular progress indicator",
    children: <ProgressRingDemo />,
  },
  {
    "heading": "Progress",
    "link": "/develop/client-capabilities/presentation/client-presentation-progress/",
    "text": "Display linear progress indicator",
    children: <ProgressDemo />,
  },
  {
    "heading": "Skeleton",
    "link": "/develop/client-capabilities/presentation/client-presentation-skeleton/",
    "text": "Show loading state placeholder",
    children: <SkeletonDemo />,
  },
];

export default function PresentationIndex() {
  return (
		<LiveExampleBuilder itemData={cardData} />
  );
}
