import Dropdown from './Dropdown';

const dropdownNodes = document.querySelectorAll('.js-dropdown');
dropdownNodes.forEach((element) => new Dropdown(element));
