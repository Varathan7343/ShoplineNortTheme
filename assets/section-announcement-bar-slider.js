defineCustomElement(
  'announcement-bar-slider',
  () =>
    class AnnouncementBarSlider extends HTMLElement {
      constructor() {
        super();

        this.speed = (Number(this.dataset.speed) || 5) * 1000;

        this.initSlider();
      }

      initSlider() {
        if (!window.Splide) return;
        const splide = new window.Splide(this.querySelector('.splide'), {
          type: 'loop',
          pagination: false,
          perPage: 1,
          arrows: false,
          autoplay: true,
          autoWidth: true,
          interval: this.speed,
          direction: 'ltr',
          snap: true,
        });
        splide.mount();
      }

      disconnectedCallback() {}
    },
);
