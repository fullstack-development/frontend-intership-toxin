import Pagination from './Pagination';

const paginationNodes = document.querySelectorAll('.js-pagination');
paginationNodes.forEach((element) => new Pagination(element));
