import MenuWidget from './MenuWidget';

const menuWidgetNode = document.querySelector('.js-menu-widget');

if (menuWidgetNode) {
  new MenuWidget(menuWidgetNode);
}
