import LiveExampleBuilder from '@site/src/components/LiveExampleBuilder';
import {useUpdateCSSVariable} from '@site/src/components/Hooks';

import ButtonDemo from '/examples/ui/client-capabilities/interaction/button.js';
import CheckboxDemo from '/examples/ui/client-capabilities/interaction/checkbox.js';
import ComboboxDemo from '/examples/ui/client-capabilities/interaction/combobox.js';
import FileUploadDemo from '/examples/ui/client-capabilities/interaction/fileupload.js';
import NumberFieldDemo from '/examples/ui/client-capabilities/interaction/number-field.js';
import RadioGroupDemo from '/examples/ui/client-capabilities/interaction/radiogroup.js';
import RadioDemo from '/examples/ui/client-capabilities/interaction/radio.js';
import SelectDemo from '/examples/ui/client-capabilities/interaction/select.js';
import SliderDemo from '/examples/ui/client-capabilities/interaction/slider.js';
import StepperDemo from '/examples/ui/client-capabilities/interaction/stepper.js';
import SwitchDemo from '/examples/ui/client-capabilities/interaction/switch.js';
import TextAreaDemo from '/examples/ui/client-capabilities/interaction/text-area.js';
import TextFieldDemo from '/examples/ui/client-capabilities/interaction/text-field.js';
import ToolbarDemo from '/examples/ui/client-capabilities/interaction/toolbar.js';

import CriteriaSegmentedControlDemo from '/examples/ui/client-capabilities/interaction/criteria-segmented-control.js';
import SegmentedControlDemo from '/examples/ui/client-capabilities/interaction/segmented-control.js';
import MultiselectDemo from '/examples/ui/client-capabilities/interaction/multiselect';
import CategorizedMultiselectDemo from '../../../../examples/ui/client-capabilities/interaction/categorized-multiselect';

const cardData = [
  {
    "heading": "Button",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-button/",
    "text": "Clickable element to indicate action",
    children: <ButtonDemo />,
  },
  {
    "heading": "Categorized Multiselect",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-categorized-multiselect/",
    "text": "Select multiple categorized options, including descriptions",
    children: <CategorizedMultiselectDemo />,
  },
  {
    "heading": "Checkbox",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-checkbox/",
    "text": "Control for selecting multiple options",
    children: <CheckboxDemo />,
  },
  {
    "heading": "Criteria Segmented Control",
    "link": "/develop/client-capabilities/forms/form-layout/client-interaction-criteria-segmented-control/",
    "text": "Generate a criteria based on a selected item",
    children: <CriteriaSegmentedControlDemo />,
  },
  {
    "heading": "Combobox",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-combobox/",
    "text": "Combination of text input and dropdown list with customizable filtering options",
    children: <ComboboxDemo />,
  },
  {
    "heading": "File Upload",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-file-upload/",
    "text": "Control for uploading files",
    children: <FileUploadDemo />,
  },
  {
    "heading": "Multiselect",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-multiselect/",
    "text": "Select one or more options",
    children: <MultiselectDemo />,
  },
  {
    "heading": "Number Field",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-number-field/",
    "text": "Input field for numerical values",
    children: <NumberFieldDemo />,
  },
  {
    "heading": "Radio Group",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-radio-group/",
    "text": "Group of mutually exclusive options",
    children: <RadioGroupDemo />,
  },
  {
    "heading": "Radio",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-radio/",
    "text": "Single selection control",
    children: <RadioDemo />,
  },
  {
    "heading": "Segmented Control",
    "link": "/develop/client-capabilities/forms/form-layout/client-interaction-segmented-control/",
    "text": "Select a value from a set of buttons",
    children: <SegmentedControlDemo />,
  },
  {
    "heading": "Select",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-select/",
    "text": "Dropdown menu for selecting options",
    children: <SelectDemo />,
  },
  {
    "heading": "Slider",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-slider/",
    "text": "Control for selecting a value from a range",
    children: <SliderDemo />,
  },
  {
    "heading": "Stepper",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-stepper/",
    "text": "Increment/decrement control for numbers",
    children: <StepperDemo />,
  },
  {
    "heading": "Switch",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-switch/",
    "text": "Toggle between two states",
    children: <SwitchDemo />,
  },
  {
    "heading": "Text Area",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-text-area/",
    "text": "Multi-line text input field",
    children: <TextAreaDemo />,
  },
  {
    "heading": "Text Field",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-text-field/",
    "text": "Single-line text input field",
    children: <TextFieldDemo />,
  },
  {
    "heading": "Toolbar",
    "link": "/develop/client-capabilities/forms/form-inputs/client-interaction-toolbar/",
    "text": "Container for grouping related controls",
    children: <ToolbarDemo />,
  },
];

export default function FormsIndex() {
	useUpdateCSSVariable('--toc-sidebar-width', '0px')
  return (
		<LiveExampleBuilder itemData={cardData} />
  );
}