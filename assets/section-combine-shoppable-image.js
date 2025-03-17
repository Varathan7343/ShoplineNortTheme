defineCustomElement(
  'combine-shoppable-image',
  () =>
    class combineShoppableImage extends SliderComponent {
      constructor() {
        super();

        this.index = 1;
        this.length = this.getAttribute('data-block_len');
        this.pc_cols = this.getAttribute('data-pc_cols');

        this.lastBtn = this.querySelector('.combine-shoppable-image__arrow-last');
        this.nextBtn = this.querySelector('.combine-shoppable-image__arrow-next');
        this.addEventListener('visible', this.init.bind(this));
        this.addEventListener('slideChanged', this.slideChange.bind(this));
      }

      arrowStatusHandler(index) {
        const direction = this.index >= index ? 'last' : 'next';
        if (direction === 'last')
          if (index === 1) {
            this.nextBtn?.classList.remove('combine-shoppable-image__arrow-disible');
            this.lastBtn?.classList.add('combine-shoppable-image__arrow-disible');
          } else {
            this.nextBtn?.classList.remove('combine-shoppable-image__arrow-disible');
          }

        if (direction === 'next')
          if (Number(index) + Number(this.pc_cols) > this.length) {
            this.lastBtn?.classList.remove('combine-shoppable-image__arrow-disible');
            this.nextBtn?.classList.add('combine-shoppable-image__arrow-disible');
          } else {
            this.lastBtn?.classList.remove('combine-shoppable-image__arrow-disible');
          }

        this.index = index;
      }

      init() {
        this.lastBtn?.classList.add('combine-shoppable-image__arrow-disible');

        this.lastBtn?.addEventListener('click', () => {
          if (this.lastBtn.classList.contains('combine-shoppable-image__arrow-disible')) {
            return;
          }
          const targetIndex = this.index - 1;
          this.slideTo(targetIndex);
        });
        this.nextBtn?.addEventListener('click', () => {
          if (this.nextBtn.classList.contains('combine-shoppable-image__arrow-disible')) {
            return;
          }
          const targetIndex = this.index + 1;
          this.slideTo(targetIndex);
        });
      }

      slideChange(e) {
        this.arrowStatusHandler(e.detail.currentPage);
      }
    },
);
