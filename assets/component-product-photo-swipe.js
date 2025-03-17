defineCustomElement(
  'product-photo-swipe',
  () =>
    class ProductPhotoSwipe extends HTMLElement {
      constructor() {
        super();
        const [, sectionId] = this.id.split('ProductPhotoSwipe-');
        this.sectionId = sectionId;
        const { relateMediaGallery } = this;
        this.updateDataSource();
        const lightbox = new window.PhotoSwipeLightbox({
          bgOpacity: 1,
          arrowPrev: false,
          arrowNext: false,
          zoom: false,
          close: false,
          counter: false,
          mainClass: 'product-photo-swipe',
          dataSource: this.dataSource,
          pswpModule: window.PhotoSwipe,
          returnFocus: false,
          appendToEl: this,
        });
        this.lightbox = lightbox;
        lightbox.on('uiRegister', function () {
          lightbox.pswp.ui.registerElement({
            name: 'productPhotoSwipeToolbar',
            className: 'product-pswp__toolbar',
            appendTo: 'wrapper',
            onInit: (el, pswp) => {
              const template = `
              <button class="product-pswp__button product-pswp__button--arrow--left ${
                pswp.getNumItems() <= 1 && 'display-none'
              }" title="Previous" style="">
                <svg class="icon directional" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1L3 6L8 11" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>        
              </button>
              <button class="product-pswp__button product-pswp__button--close" title="Close (Esc)">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8002 1.19999L1.2002 10.8" stroke-width="1.2" stroke-linecap="round"></path>
                  <path d="M1.1998 1.19999L10.7998 10.8" stroke-width="1.2" stroke-linecap="round"></path>
                </svg>
              </button>
              <button class="product-pswp__button product-pswp__button--arrow--right ${
                pswp.getNumItems() <= 1 && 'display-none'
              }" title="Next" style="">
                <svg class="icon directional" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 11L9 6L4 1" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>
              </button>
              `;
              const fragment = document.createRange().createContextualFragment(template);
              // register event
              fragment.querySelector('.product-pswp__button--arrow--left').addEventListener('click', () => {
                pswp.prev();
              });
              fragment.querySelector('.product-pswp__button--arrow--right').addEventListener('click', () => {
                pswp.next();
              });
              fragment.querySelector('.product-pswp__button--close').addEventListener('click', () => {
                pswp.close();
              });

              el.appendChild(fragment);
            },
          });
        });
        lightbox.addFilter('thumbEl', (thumbEl, data) => {
          const el = relateMediaGallery.elements.viewer.querySelector(`#Slide-main-product-info-${data.mediaId}`);
          if (el) {
            return el;
          }
          return thumbEl;
        });
        lightbox.addFilter('placeholderSrc', (placeholderSrc, slide) => {
          const el = relateMediaGallery.elements.viewer.querySelector(
            `#Slide-main-product-info-${slide.data.mediaId} img`,
          );
          if (el) {
            return el.src;
          }
          return placeholderSrc;
        });
        lightbox.on('change', () => {
          const currSlideMediaId = lightbox.pswp.currSlide.data.mediaId;
          relateMediaGallery.setActiveMedia(`${sectionId}-${currSlideMediaId}`, false);
        });

        this.lightbox.init();
      }

      get relateMediaGallery() {
        // Compatible with multiple media gallery for featured product
        if (window.innerWidth < 960) {
          return document.querySelector(`#MediaGallery-${this.sectionId}`);
        }
        return (
          document.querySelector(`#MediaGallery-${this.sectionId}-duplicate`) ||
          document.querySelector(`#MediaGallery-${this.sectionId}`)
        );
      }

      updateDataSource() {
        let currentActiveSlides = null;
        // If a thumbnail exists, the thumbnail data source will be used first.
        if (
          this.relateMediaGallery.elements.thumbnails?.slideItems &&
          window.getComputedStyle(this.relateMediaGallery.elements.thumbnails).display !== 'none'
        ) {
          currentActiveSlides = this.relateMediaGallery.elements.thumbnails?.slideItems;
        } else {
          currentActiveSlides = this.relateMediaGallery.elements.viewer.slideItems;
        }
        const dataSource = currentActiveSlides.map((node) => {
          const mediaId = node.dataset.target || node.dataset.mediaId;
          const dataItem = this.querySelector(
            `.photo-swipe-image-source[data-media-id="${mediaId.replace(`${this.sectionId}-`, '')}"]`,
          );
          return {
            src: dataItem.dataset.src,
            alt: dataItem.alt,
            width: dataItem.width,
            height: dataItem.height,
            mediaId: dataItem.dataset.mediaId,
          };
        });
        this.dataSource = dataSource;
        return dataSource;
      }

      close() {
        this.lightbox.close();
      }

      open(opener) {
        const index =
          this.dataSource.findIndex((item) => {
            return item.mediaId === opener.dataset.mediaId;
          }) || 0;
        this.lightbox.loadAndOpen(index);
      }

      prepend() {
        const pswp = this.lightbox;
        pswp.options.dataSource = this.updateDataSource();
      }

      disconnectedCallback() {
        if (this.lightbox) {
          this.lightbox.destroy();
        }
      }
    },
);
