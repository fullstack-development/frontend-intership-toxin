import Carousel from './Carousel';

const carouselElements = document.querySelectorAll('.js-carousel');
carouselElements.forEach((element) => new Carousel(element));
