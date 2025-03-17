class DropdownMenu extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      button: this.querySelector('button'),
      input: this.querySelector('input'),
      label: this.querySelector('*[data-label]'),
      panel: this.querySelector('.dropdown-menu__list-wrapper'),
    };
    this.elements.button.addEventListener('click', this.togglePanel.bind(this));
    this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

    this.querySelectorAll('a').forEach((item) => item.addEventListener('click', this.onItemClick.bind(this)));
    this.focusoutTimer = null;
  }

  hidePanel() {
    this.elements.panel.setAttribute('hidden', true);
    this.removeAttribute('open');
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    this.hidePanel();
    this.elements.button.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    this.hidePanel();
    if (this.elements.input.value !== event.currentTarget.dataset.value || !this.elements.input.value) {
      this.elements.input.value = event.currentTarget.dataset.value;
      this.elements.label.textContent = event.currentTarget.textContent;
      const evt = new Event('change');
      this.elements.input.dispatchEvent(evt);
    }
  }

  togglePanel() {
    this.elements.button.focus();
    this.elements.panel.toggleAttribute('hidden');
    this.toggleAttribute('open');
    if (this.focusoutTimer) {
      clearTimeout(this.focusoutTimer);
      this.focusoutTimer = null;
    }
  }

  closeSelector(event) {
    // https://github.com/angular/angular/issues/25899
    // safari bug
    this.focusoutTimer = setTimeout(() => {
      const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === 'BUTTON';
      if (event.relatedTarget === null || shouldClose) {
        this.hidePanel();
      }
    }, 150);
  }
}

defineCustomElement('dropdown-menu', () => DropdownMenu);
