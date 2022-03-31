/* eslint-disable no-param-reassign */
import rootReducer from './redux/rootReducer';
import createStore from './redux/createStore';
import addCommaInText from './helpers/addCommaInText';
import declensionsText from './helpers/declensionsText';
import cutLongText from './helpers/cutLongText';
import { count, targetType } from './constants';

class Dropdown {
  constructor(selector) {
    this.mainNode = selector;
    const { options } = this.mainNode.dataset;

    try {
      this.options = JSON.parse(options);
      this.store = createStore(rootReducer, {});
      this.init();
    } catch (e) {
      throw new Error('Incorrect options passed to the Dropdown class', e);
    }
  }

  init() {
    this.maxItems = this.options.maxItems || Number.MAX_SAFE_INTEGER;
    this.store.subscribe((state) => {
      this.state = { ...state };
    });

    this.findDOMElements();
    this.addInitValuesToStore();
    this.countTotalItems();

    const { buttons } = this.options;
    if (buttons) this.addButtons();
    this.setInputText();
    this.checkClearButton();
    this.toggleButtonsCounter();
    this.bindEventListeners();
  }

  addInitValuesToStore() {
    this.menuItemsData.forEach((item) => {
      this.store.dispatchEvent({ type: count.INIT, id: item.id, value: item.value });
    });
  }

  findDOMElements() {
    this.input = this.mainNode.querySelector('.js-dropdown__input');
    this.drop = this.mainNode.querySelector('.js-dropdown__drop');
    this.arrow = this.mainNode.querySelector('.js-dropdown__arrow');
    const menuItemNodes = this.mainNode.querySelectorAll('.js-dropdown__menu-item');

    this.menuItemsData = Array.from(menuItemNodes).map((item) => ({
      increment: item.querySelector('.js-dropdown__counter-button_type_increment'),
      decrement: item.querySelector('.js-dropdown__counter-button_type_decrement'),
      countInput: item.querySelector('.js-dropdown__counter'),
      id: item.dataset.id,
      value: Number(item.querySelector('.js-dropdown__counter').value) || 0,
      [item.dataset.id]: Number(item.querySelector('.js-dropdown__counter').value),
    }));
  }

  countTotalItems() {
    const totalItems = this.menuItemsData.reduce(
      (acc, item) => item.value + acc, 0,
    );
    this.store.dispatchEvent({ type: count.INIT, id: count.TOTAL, value: totalItems });
  }

  bindEventListeners() {
    this.mainNode.addEventListener('click', this.handleDropdownClick.bind(this));
    this.mainNode.addEventListener('keydown', this.handleDropdownKeydown.bind(this));
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  addButtons() {
    const btnWrap = document.createElement('div');
    const clearBtn = document.createElement('button');
    const applyBtn = document.createElement('button');
    const clearText = document.createElement('span');
    const applyText = document.createElement('span');

    btnWrap.classList.add('dropdown__buttons');

    clearBtn.classList.add(
      'button',
      'button_variant_inline',
      'dropdown__button-clear',
      'js-dropdown__button-clear',
    );
    clearBtn.setAttribute('type', 'button');
    clearText.setAttribute('data-type', 'clear');
    clearText.innerHTML = 'Очистить';
    clearText.classList.add('button__inner', 'button__inner_text-color_purple');
    clearBtn.append(clearText);

    applyBtn.classList.add('button', 'button_variant_inline');
    applyBtn.setAttribute('type', 'button');
    applyText.setAttribute('data-type', 'apply');
    applyText.innerHTML = 'Применить';
    applyText.classList.add('button__inner', 'button__inner_text-color_purple');
    applyBtn.append(applyText);

    btnWrap.appendChild(clearBtn);
    btnWrap.appendChild(applyBtn);
    this.drop.appendChild(btnWrap);

    this.clearBtn = this.mainNode.querySelector(
      '.js-dropdown__button-clear',
    );
  }

  setInputText() {
    this.input.value = this.createFinalText();
  }

  createFinalText() {
    const { defaultText, total } = this.options;
    const { totalItems } = this.state;
    let textInput = '';

    if (totalItems > 0) {
      const { plurals, numberOfLetters = 19 } = this.options;
      if (total) {
        this.totalPluralWords = plurals.totalItems;
        textInput = addCommaInText(textInput);
        textInput += `${`${totalItems} ${declensionsText(
          totalItems,
          this.totalPluralWords,
        )}`}`;
      }

      this.menuItemsData.forEach((item) => {
        const { id } = item;
        const currentValue = this.state[id];

        if (Object.prototype.hasOwnProperty.call(plurals, id)) {
          this.currentPluralWords = plurals[id];
        } else {
          this.currentPluralWords = '';
        }
        if (currentValue === 0) {
          textInput += '';
        }

        const hasCurrentValueAndPlurals = currentValue && Array.isArray(this.currentPluralWords);

        if (hasCurrentValueAndPlurals) {
          textInput = addCommaInText(textInput);
          textInput += `${`${currentValue} ${declensionsText(
            currentValue,
            this.currentPluralWords,
          )}`}`;
        } else if (currentValue && !total) {
          textInput = addCommaInText(textInput);
          textInput += ` ${currentValue} add plurals `;
        }
      });
      return cutLongText(textInput, numberOfLetters);
    }
    return defaultText;
  }

  increment(target) {
    const parent = target.parentNode;
    const counter = parent.querySelector('.js-dropdown__counter');
    const increment = parent.querySelector('.js-dropdown__counter-button_type_increment');
    const decrement = parent.querySelector('.js-dropdown__counter-button_type_decrement');
    const { id } = parent.parentNode.dataset;
    const currentValue = Number(counter.value);
    const maxValue = this.maxItems - 1;

    if (currentValue === maxValue) {
      increment.disabled = true;
    }
    if (currentValue < this.maxItems) {
      const { totalItems } = this.state;
      this.store.dispatchEvent({ type: count.INCREMENT, id, value: currentValue });
      this.store.dispatchEvent({ type: count.INCREMENT, id: count.TOTAL, value: totalItems });

      counter.value = currentValue + 1;
      decrement.disabled = false;
    }

    this.setInputText();
    this.checkClearButton();
  }

  decrement(target) {
    const parent = target.parentNode;
    const counter = parent.querySelector('.js-dropdown__counter');
    const increment = parent.querySelector('.js-dropdown__counter-button_type_increment');
    const decrement = parent.querySelector('.js-dropdown__counter-button_type_decrement');
    const { id } = parent.parentNode.dataset;
    const currentValue = Number(counter.value);
    const equalZero = (currentValue - 1) === 0;

    if (equalZero) {
      decrement.disabled = false;
    }
    if (currentValue > 0) {
      const { totalItems } = this.state;
      this.store.dispatchEvent({ type: count.DECREMENT, id, value: currentValue });
      this.store.dispatchEvent({ type: count.DECREMENT, id: count.TOTAL, value: totalItems });

      counter.value = currentValue - 1;
      increment.disabled = true;
    }

    this.setInputText();
    this.toggleButtonsCounter();
    this.checkClearButton();
  }

  handleDropdownClick({ target }) {
    const { type } = target.dataset;

    if (type === count.INCREMENT) this.increment(target);
    if (type === count.DECREMENT) this.decrement(target);
    if (type === targetType.APPLY) this.close();
    if (type === targetType.CLEAR) this.clear();
    if (type === targetType.INPUT) this.toggle();
    if (type === targetType.ARROW) this.toggle();
  }

  handleDropdownKeydown(event) {
    const { code } = event;

    if (code === 'Space') {
      event.preventDefault();
      this.toggle();
    }
  }

  handleDocumentClick(event) {
    if (!event.target.closest('.dropdown')) {
      this.close();
    }
  }

  get isOpen() {
    return this.mainNode.classList.contains('dropdown_open');
  }

  get isNotEmpty() {
    const { totalItems } = this.state;
    return totalItems > 0;
  }

  toggleButtonsCounter() {
    const { minItems = 0 } = this.options;

    this.menuItemsData.forEach((item) => {
      const itemCount = Number(item.countInput.value);

      if (itemCount <= minItems) {
        item.decrement.disabled = true;
      } else {
        item.decrement.disabled = false;
      }
      if (itemCount >= this.maxItems) {
        item.increment.disabled = true;
      } else {
        item.increment.disabled = false;
      }
    });
  }

  checkClearButton() {
    if (this.clearBtn) {
      if (this.isNotEmpty) {
        this.clearBtn.classList.add('dropdown__button-clear_displayed');
      } else {
        this.clearBtn.classList.remove('dropdown__button-clear_displayed');
      }
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
      this.turnArrowDown();
    } else {
      this.open();
      this.turnArrowUp();
    }
  }

  turnArrowUp() {
    this.arrow.classList.remove('dropdown__arrow_down');
    this.arrow.classList.add('dropdown__arrow_up');
  }

  turnArrowDown() {
    this.arrow.classList.remove('dropdown__arrow_up');
    this.arrow.classList.add('dropdown__arrow_down');
  }

  clear() {
    const { defaultText } = this.options;

    this.menuItemsData.forEach((item) => {
      item.countInput.value = 0;
      this.store.dispatchEvent({ type: count.INIT, id: item.id, value: 0 });
    });
    this.store.dispatchEvent({ type: count.INIT, id: count.TOTAL, value: 0 });

    this.clearBtn.classList.remove('dropdown__button-clear_displayed');
    this.input.value = defaultText;
    this.toggleButtonsCounter();
  }

  open() {
    this.mainNode.classList.add('dropdown_open');
  }

  close() {
    this.mainNode.classList.remove('dropdown_open');
    this.turnArrowDown();
  }
}

export default Dropdown;
