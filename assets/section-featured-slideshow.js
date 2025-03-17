defineCustomElement(
  'featured-slideshow-section',
  () =>
    class FeaturedSlideshowSection extends SliderComponent {
      constructor() {
        super();

        this.enableSliderLooping = true;
        this.addEventListener('visible', this.init.bind(this));
        this.addEventListener('slideChanged', this.slideChange.bind(this));
      }

      init() {
        // Bind page number click event
        this.sliderControlLinksArray = Array.from(this.querySelectorAll('.slider-counter__link'));
        this.sliderControlLinksArray.forEach((controlLink) =>
          controlLink.addEventListener('click', this.linkToSlide.bind(this)),
        );

        this.slideChange();
      }

      linkToSlide(event) {
        event.preventDefault();
        this.slideTo(this.sliderControlLinksArray.indexOf(event.currentTarget) + 1);
      }

      slideChange() {
        if (this.sliderControlLinksArray.length) {
          const ACTIVE_CLASS = 'slider-counter__link--active';
          this.sliderControlLinksArray.forEach((link) => link.classList.remove(ACTIVE_CLASS));
          this.sliderControlLinksArray[this.currentPage - 1].classList.add(ACTIVE_CLASS);
        }
      }
    },
);
