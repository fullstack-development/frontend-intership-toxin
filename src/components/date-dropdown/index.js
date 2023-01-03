import 'air-datepicker/dist/js/datepicker';

import DateDropdown from './DateDropdown';

const $dataDropdown = $('.js-date-dropdown');
$dataDropdown.each(function init() {
  new DateDropdown($(this));
});
