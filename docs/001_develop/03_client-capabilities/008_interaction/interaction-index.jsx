import LiveExampleBuilder from '@site/src/components/LiveExampleBuilder';
import {useUpdateCSSVariable} from '@site/src/components/Hooks';

import AccordionDemo from '/examples/ui/client-capabilities/interaction/accordion.js';
import AnchorDemo from '/examples/ui/client-capabilities/interaction/anchor.js';
import AnchoredRegionDemo from '/examples/ui/client-capabilities/interaction/anchored-region.js';
import CronSchedulerDemo from '../../../../examples/ui/client-capabilities/interaction/scheduler';
import DialogDemo from '/examples/ui/client-capabilities/interaction/dialog.js';
import DropdownMenuDemo from '/examples/ui/client-capabilities/interaction/dropdown-menu.js';
import FlipperDemo from '/examples/ui/client-capabilities/interaction/flipper.js';
import ListboxDemo from '/examples/ui/client-capabilities/interaction/listbox.js';
import MenuDemo from '/examples/ui/client-capabilities/interaction/menu.js';
import ModalDemo from '/examples/ui/client-capabilities/interaction/modal.js';
import TabsDemo from '/examples/ui/client-capabilities/interaction/tabs.js';
import TooltipDemo from '/examples/ui/client-capabilities/interaction/tooltip.js';
import TreeViewDemo from '/examples/ui/client-capabilities/interaction/tree-view.js';

const cardData = [
  {
    "heading": "Accordion",
    "link": "/develop/client-capabilities/interaction/client-interaction-accordion/",
    "text": "Expandable and collapsible sections",
    children: <AccordionDemo />,
  },
  {
    "heading": "Anchor",
    "link": "/develop/client-capabilities/interaction/client-interaction-anchor/",
    "text": "Create linkable document sections",
    children: <AnchorDemo />,
  },
  {
    "heading": "Anchored Region",
    "link": "/develop/client-capabilities/interaction/client-interaction-anchored-region/",
    "text": "Position content relative to other elements",
    children: <AnchoredRegionDemo />,
  },
  {
    "heading": "Dialog",
    "link": "/develop/client-capabilities/interaction/client-interaction-dialog/",
    "text": "Modal or non-modal message boxes",
    children: <DialogDemo />,
  },
  {
    "heading": "Dropdown Menu",
    "link": "/develop/client-capabilities/interaction/client-interaction-dropdown-menu/",
    "text": "Expandable menu with selectable options",
    children: <DropdownMenuDemo />,
  },
  {
    "heading": "Flipper",
    "link": "/develop/client-capabilities/interaction/client-interaction-flipper/",
    "text": "Navigate through a sequence of items",
    children: <FlipperDemo />,
  },
  {
    "heading": "Listbox",
    "link": "/develop/client-capabilities/interaction/client-interaction-listbox/",
    "text": "Select one or multiple options from a list",
    children: <ListboxDemo />,
  },
  {
    "heading": "Menu",
    "link": "/develop/client-capabilities/interaction/client-interaction-menu/",
    "text": "Navigation or command menu",
    children: <MenuDemo />,
  },
  {
    "heading": "Modal",
    "link": "/develop/client-capabilities/interaction/client-interaction-modal/",
    "text": "Focused overlay content",
    children: <ModalDemo />,
  },
  // {
  //   "heading": "Scheduler",
  //   "link": "/develop/client-capabilities/interaction/client-interaction-scheduler/",
  //   "text": "component for scheduling tasks",
  //   children: <CronSchedulerDemo />,
  // },
  {
    "heading": "Tabs",
    "link": "/develop/client-capabilities/interaction/client-interaction-tabs/",
    "text": "Organize content into tabbed sections",
    children: <TabsDemo />,
  },
  {
    "heading": "Tooltip",
    "link": "/develop/client-capabilities/interaction/client-interaction-tooltip/",
    "text": "Display additional information on hover",
    children: <TooltipDemo />,
  },
  {
    "heading": "Tree View",
    "link": "/develop/client-capabilities/interaction/client-interaction-tree-view/",
    "text": "Hierarchical list with expandable items",
    children: <TreeViewDemo />,
  }
];

export default function InteractionIndex() {
	useUpdateCSSVariable('--toc-sidebar-width', '0px')
  return (
		<LiveExampleBuilder itemData={cardData} />
  );
}
