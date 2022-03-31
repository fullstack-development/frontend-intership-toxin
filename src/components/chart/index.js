import './chart.scss';
import Chart from './Chart';

const chartElements = document.querySelectorAll('.js-chart');
chartElements.forEach((element) => new Chart(element));
