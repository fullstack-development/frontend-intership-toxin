import Like from './Like';

const likeButtonNodes = document.querySelectorAll('.js-like');
likeButtonNodes.forEach((selector) => new Like(selector));
