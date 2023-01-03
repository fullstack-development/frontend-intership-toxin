import 'components/navigation';

import MenuBurger from './Header';

const menuBurgerNode = document.querySelectorAll('.js-header__menu-burger');
menuBurgerNode.forEach((selector) => new MenuBurger(selector));
