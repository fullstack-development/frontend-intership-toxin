import 'jquery-ui-slider/jquery-ui';

import RangeSlider from './RangeSlider';

const rangeSliderNodes = document.querySelectorAll('.js-range-slider');
rangeSliderNodes.forEach((element) => new RangeSlider(element));
