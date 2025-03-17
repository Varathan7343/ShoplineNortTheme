defineCustomElement(
  'featured-collection-tabs',
  () =>
    class FeaturedCollectionTabs extends HTMLElement {
      constructor() {
        super();

        this.tabWrap = this.querySelector('.featured-collection__tabs');
        this.tabs = this.querySelectorAll('.featured-collection__tabs-item');

        this.tabs.forEach((tab) => {
          tab.addEventListener('click', (event) => this.switchTo(event.target.dataset.index));
        });
      }

      get loading() {
        return this.parentElement.dataset.loading === 'true';
      }

      set loading(force) {
        this.parentElement.dataset.loading = String(force);
      }

      async loadContent(index, awaitTime) {
        let content = null;
        this.loading = true;

        if (awaitTime) {
          await new Promise((resolve) => {
            setTimeout(resolve, awaitTime);
          });
        }

        try {
          const queryPath = new URL(window.location);
          const { searchParams } = queryPath;

          searchParams.append('section_id', this.dataset.sectionId);
          searchParams.append(
            'attributes',
            JSON.stringify({
              index,
            }),
          );

          const response = await fetch(queryPath.toString());
          const responseText = await response.text();
          const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
          const blockSelector = `.slider-block--${index}`;

          content = responseHTML.querySelector(blockSelector);

          if (content) {
            const oldContent = this.parentElement.querySelector(blockSelector);
            if (oldContent) {
              this.parentElement.replaceChild(content, oldContent);
            } else {
              this.parentElement.appendChild(content);
            }
            window.initVisibleAnimation();
          }
        } finally {
          this.loading = false;
        }

        return content;
      }

      switchTo(index, awaitTime) {
        if (!index) return;

        this.tabs.forEach(async (tab) => {
          const currentIndex = tab.dataset.index;
          let isActive = currentIndex === index;

          const controller = this.parentElement.querySelector(`.slider-block-controller--${currentIndex}`);
          controller && controller.classList.toggle('display-none', !isActive);

          tab.classList.toggle('button--secondary', isActive);
          isActive && this.tabWrap.scrollTo({ left: tab.offsetLeft - tab.clientWidth - 10, behavior: 'smooth' });

          let content = this.parentElement.querySelector(`.slider-block--${currentIndex}`);
          if (isActive && !content) {
            content = await this.loadContent(currentIndex, awaitTime);
            // reset active status
            isActive = tab.classList.contains('button--secondary');
          }
          content && content.classList.toggle('display-none', !isActive);
        });
      }

      switchTab(index) {
        const targetTab = this.querySelector(
          `.featured-collection__tabs .featured-collection__tabs-item:nth-of-type(${index})`,
        );

        this.switchTo(targetTab.dataset.id, 1000);
      }
    },
);
