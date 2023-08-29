/* 
  sliderName : name, // id слайдера
  vertical : false, // вертикальная ориентация слайдера
  buttonsShow : true, // показывать кнопок листания true/false
  dots : true; // показывать точки навичации слайдера true/false
  timeTransition : 1, // скорость смены слайдов (секунды)
  changeScenario : 'ease', // сценарий смены слайдов linear, ease (свойства transition)
  gapSlider : 20, // интервал между слайдами 'px'
  quantitySlider : 3, // количество видимых слайдов
  quantitySliderTransition : 1,  // количество пролистаных слайдов за раз
  autoPlay : false, // автоматическая прокрутка слайдов true/false
  autoPlayReverse : 'left', // направление движения слайдера в режиме авто left/right
  autoPlayInterval : 1, // интервал прокрутки слайдов в авто режиме (секунды)
  autoplayOff : false, // остановка автовоспроизведения при наведении курсока на слайдер true/false
  waitForAnimate : true, // отключение быстрой прокрутки при быстрой серии нажатий true/false
  infinitySlider : true, // бесконечный слайдер true/false
  verticalSlider : false, // вертикальная прокрутка
  activeSlider : false, // выделение активного слайдера (можно задать дополнительнике стили)
  activeSliderTimeTransition : 1, // плавность перехода стилей активного слайдера
  activeSliderScenarioTransition : 'ease', // сценарий смены стилей активного слайдера linear, ease (свойства transition)
  activeSliderNamber : 2, // какой слайдер по счёту от левого края будет активный
  dragdrop: true,  // листание курсором или смахиванием touchscreen
  dragdropPercentSwipe: 25, // какой процент ширины необходимо протянуть для листания мышкой или touchscreen
*/

window.addEventListener('load', function (win) {

   class GSlider {
      offset = 0;
      stopAutoplay = true;
      sliderDots;
      constructor(arg) {
         this.arg = arg;
         this.sliderName = arg.sliderName; // id блока слайдера
         this.source = document.querySelectorAll(`#${this.sliderName}>* `); // исходное содержимое контейнера слайдера
         this.vertical = arg.vertical == true ? true : false; // вертикальная ориентация слайдера
         this.nameSlider = document.querySelector('#' + this.sliderName); // родительский контейнер слайдера, id слайдера
         this.buttonsShow = arg.buttonsShow == false ? false : true; // показывать кнопок листания true/false
         this.dots = arg.dots == false ? false : true; // показывать точки навичации слайдера true/false
         this.timeTransition = arg.timeTransition ? arg.timeTransition : 1; // скорость смены слайдов (секунды)
         this.changeScenario = arg.changeScenario ? arg.changeScenario : 'ease'; // сценарий смены слайдов linear, ease (свойства transition)
         this.gapSlider = arg.gapSlider ? arg.gapSlider : 0; // интервал между слайдами 'px'
         this.quantitySlider = arg.quantitySlider ? arg.quantitySlider : 1; // количество видимых слайдов
         this.quantitySliderTransition = arg.quantitySliderTransition ? arg.quantitySliderTransition : 1;  // количество пролистаных слайдов за раз
         this.autoPlay = arg.autoPlay == true ? true : false; // автоматическая прокрутка слайдов true/false
         this.autoPlayReverse = arg.autoPlayReverse == 'left' ? 'left' : 'right'; // направление движения слайдера в режиме авто left/right
         this.autoPlayInterval = arg.autoPlayInterval ? arg.autoPlayInterval : 1; // интервал прокрутки слайдов в авто режиме (секунды)
         this.autoplayOff = arg.autoplayOff = true ? true : false; // остановка автовоспроизведения при наведении курсока на слайдер
         this.waitForAnimate = arg.waitForAnimate == false ? false : true; // отключение быстрой прокрутки при быстрой серии нажатий true/false
         this.infinitySlider = arg.infinitySlider == true ? true : false; // бесконечный слайдер true/false
         this.activeSlider = arg.activeSlider == true ? true : false; // выделение активного слайдера (можно задать дополнительнике стили)
         this.activeSliderTimeTransition = arg.activeSliderTimeTransition ? arg.activeSliderTimeTransition : 1; // плавность перехода стилей активного слайдера
         this.activeSliderScenarioTransition = arg.activeSliderScenarioTransition ? arg.activeSliderScenarioTransition : 'ease'; // сценарий смены стилей активного слайдера linear, ease (свойства transition)
         this.activeSliderNamber = arg.activeSliderNamber ? arg.activeSliderNamber : 1; // какой слайдер по счёту от левого края будет активный
         this.dragdrop = arg.dragdrop == false ? false : true; // листание курсором или смахиванием
         this.dragdropPercentSwipe = arg.dragdropPercentSwipe ? arg.dragdropPercentSwipe : 10; // какой процент ширины необходимо протянуть для листания мышкой или touchscreen
         this.mediaQuerys = arg.mediaQuerys; // настройки при медиазапросах
         this.mediaPresence = this.mediaQuerys ? true : false; // проверка наличия медиазапросов в настройках
         this.mediaQuerysArray = this.mediaPresence ? Object.keys(this.mediaQuerys) : false;
      }

      initSlider = () => {
         // сортировка медиазапросов
         if (this.mediaPresence) this.mediaQuerysArray.sort(function (a, b) { return a - b });
         // отслеживание ширины слайдера для адаптива
         const observerSlider = new ResizeObserver((entries) => { this.sliderResize() });
         observerSlider.observe(this.nameSlider);
         // инициализация медиазапросов
         this.initMedia();
         // построение слайдера
         this.duildSlider();
      }

      // построение структуры слайдера
      duildSlider = (sliderName) => {
         this.sliderElement = this.nameSlider.querySelectorAll(`#${this.sliderName}>div`);
         this.nameSlider.insertAdjacentHTML('afterbegin', `<div class="slider"></div>`);
         this.slider = this.nameSlider.querySelector('.slider');
         this.slider.insertAdjacentHTML('afterbegin', `<div class="slider__doby"></div>`);
         this.sliderBoby = this.slider.querySelector('.slider__doby');
         this.sliderElement.forEach(e => {
            e.classList.add('slider__item');
            this.sliderBoby.append(e);
         })

         if (this.dots == true) {
            this.nameSlider.insertAdjacentHTML('beforeend', `<ul class="slider__dots-lists"></ul>`);
            this.sliderDots = this.nameSlider.querySelector('.slider__dots-lists');
            for (let i = 1; i <= this.sliderElement.length; i++) {
               this.sliderDots.insertAdjacentHTML('beforeend', `<li class="slider__dot-item" data-namberdot='${i}'><button></button></li>`)
            }
         }

         if (this.buttonsShow == true) {
            this.nameSlider.insertAdjacentHTML(
               'beforeend',
               `<div class="slider__button-block">
                  <button type="button" class="slider__button-prev slider__button-style">Prev</button>
                  <button type="button" class="slider__button-next slider__button-style">Next</button>
               </div>`
            )
         }

         this.sliderItem = this.slider.getElementsByClassName('slider__item');
         this.sliderButtonPrev = this.nameSlider.querySelector('.slider__button-prev') ? this.nameSlider.querySelector('.slider__button-prev') : 0;
         this.sliderButtonNext = this.nameSlider.querySelector('.slider__button-next') ? this.nameSlider.querySelector('.slider__button-next') : 0;
         this.sliderItemArrey = Object.values(this.sliderItem);
         this.sliderDotsItem = this.sliderDots ? this.sliderDots.getElementsByClassName('slider__dot-item') : 0;

         this.options();
         // нумерация слайдеров (не клонов)
         for (let i = 0; i < this.sliderItemArrey.length; i++) { this.sliderItemArrey[i].setAttribute('data-namberslider', `${i + 1}`) }

         // клонирование элементов в бесконечном режиме слайдера
         if (this.infinitySlider) { this.cloneElement() }

         this.activeOptions();

         // инициализация событий
         this.addEvent();

      }

      // при наличии настроек медиазапроса
      initMedia = () => {
         if (this.mediaPresence) {
            this.mediaQuerysArray.forEach((e, i) => { (this.media(i == 0 ? 0 : this.mediaQuerysArray[i - 1], this.mediaQuerysArray[i]))() });
            (this.media(this.mediaQuerysArray[this.mediaQuerysArray.length - 1], 999999))();
            this.mediaQuerys[999999] = this.arg;
         };
      }

      // инициализация настроек
      options = () => {
         // ширина или высота окна слайдера
         this.sliderWindowSize = this.vertical ? this.slider.offsetHeight : this.slider.offsetWidth;
         // ширина или высота элемента слайда
         this.sizeItemSlider = (this.sliderWindowSize - this.gapSlider * (this.quantitySlider - 1)) / this.quantitySlider;
         // ширина ленты слайдера до клонирования
         this.sliderSize = this.sliderItemArrey.length * (this.gapSlider + this.sizeItemSlider);
         // присвоение ширины элемента слайдера
         this.sliderBoby.style.setProperty('--s', `${this.sizeItemSlider}px`);
         // this.sliderItemArrey.forEach(element => { element.style.flex = `0 0 ${this.sizeItemSlider}px` });
         // присвоение отступов между элементами слайдера
         // this.sliderBoby.style.columnGap = `${this.gapSlider}px`; // ??? проверить работу gap
         this.sliderBoby.style.gap = `${this.gapSlider}px`;
         // присвоение position:relative для вычисления координат дочерних элементов
         this.sliderBoby.style.position = 'relative';
         // поправка величины смещения слайдера с учётом отступов между элементами
         this.gaps = this.gapSlider + (this.gapSlider * (this.quantitySliderTransition - 1));
         // смещение слайдера с учётом количества сменяемых элементов и отступов
         this.offsetSlider = this.sizeItemSlider * this.quantitySliderTransition + this.gaps;
         // проверка будующего положения слайдера перед перемещением для анализа корректности
         this.verificationNext = this.sizeItemSlider * (this.sliderItem.length + 1) + this.gapSlider * (this.sliderItem.length - 1);
      }

      activeOptions = () => {
         // позиционирование ленты слайдера при бесконечном режиме при загрузке страницы
         if (this.infinitySlider) { this.infinitySliderPositionStart() };
         // добавление и удаление класса не активной кнопки
         if (!this.infinitySlider) { this.offButton() };
         // авто прокрутка
         if (this.autoPlay == true) { this.autoplayStart() };
         // активный слайдер
         if (this.activeSlider == true) { this.sliderActive(true) }
         // подсветка точки активного слайдера
         if (this.dots == true) { this.dotActive() };
         // отключение Drag'n'Drop браузера 
         if (this.dragdrop == true) { window.ondragstart = function () { return false } }
      }

      cloneElement = () => {
         // клонирование элементов в бесконечном режиме слайдера
         for (let i = 0; i < this.quantitySliderTransition + 1; i++) {
            this.sliderItem[0].before(this.sliderItemArrey[this.sliderItemArrey.length - (1 + i)].cloneNode(true));
         }
         for (let i = this.sliderItemArrey.length - 1, x = 0; i >= (this.sliderItemArrey.length - 1) - Math.max(this.quantitySliderTransition, this.quantitySlider); i--, x++) {
            this.sliderItem[this.sliderItem.length - 1].after(this.sliderItemArrey[x].cloneNode(true));
         }
         // позиция первого слайдера не клонированного
         this.startPositionSlider = this.vertical ? this.sliderItemArrey[0].offsetTop : this.sliderItemArrey[0].offsetLeft;
         // размер ленты с клонированными элементами
         this.sliderCloneSize = this.sliderItem.length * (this.sizeItemSlider + this.gapSlider) - this.gapSlider;
      }

      media = (k, k2) => {
         return () => {
            const mediaQuery = window.matchMedia(`(min-width: ${k}px) and (max-width: ${k2}px)`);
            // перезаписывает настройки
            if (mediaQuery.matches) { for (let e in this.mediaQuerys[k2]) { this[e] = this.mediaQuerys[k2][e] } };
            function changeOptions() {
               if (mediaQuery.matches) {
                  // перезаписывает настройки
                  this.nameSlider.innerHTML = '';
                  this.source.forEach((e) => {
                     e.removeAttribute('data-namberslider');
                     this.nameSlider.append(e);
                  })
                  for (let e in this.arg) { this[e] = this.arg[e] }
                  for (let e in this.mediaQuerys[k2]) { this[e] = this.mediaQuerys[k2][e] }
                  this.duildSlider(this.sliderName);
               }
            }
            mediaQuery.addEventListener('change', changeOptions.bind(this))
         }
      }

      // настройки при изменении размера
      sliderResize = () => {

         this.sliderWindowSize = this.vertical ? this.slider.offsetHeight : this.slider.offsetWidth;
         this.sizeItemSlider = (this.sliderWindowSize - this.gapSlider * (this.quantitySlider - 1)) / this.quantitySlider;
         this.sliderSize = this.sliderItemArrey.length * (this.gapSlider + this.sizeItemSlider);
         this.sliderCloneSize = this.sliderItem.length * (this.sizeItemSlider + this.gapSlider) - this.gapSlider;
         this.gaps = this.gapSlider + (this.gapSlider * (this.quantitySliderTransition - 1));
         this.offsetSlider = this.sizeItemSlider * this.quantitySliderTransition + this.gaps;
         this.verificationNext = this.sizeItemSlider * (this.sliderItem.length + 1) + this.gapSlider * (this.sliderItem.length - 1);

         // for (let e of this.sliderItemArrey) { }

         setTimeout(() => {
            for (let e of this.sliderItem) {
               //  e.style.flex = `0 0 ${this.sizeItemSlider}px`;
               this.sliderBoby.style.setProperty('--s', `${this.sizeItemSlider}px`);
               if (this.activeSlider !== true) { e.classList.remove('slider__active') }
               if (e.hasAttribute('marck')) {
                  this.offset = -e.offsetLeft;
                  this.positionSlider();
               }
            }
         }, 0)
      }

      markcItem = () => {
         for (let e of this.sliderItem) {
            if (-e.offsetLeft + 20 > this.offset && -e.offsetLeft - 20 < this.offset) {
               e.setAttribute('marck', '')
            } else {
               e.removeAttribute('marck')
            }
         }
      }

      // функция инициализации событий
      addEvent = () => {
         if (this.buttonsShow == true) {
            this.sliderButtonPrev.addEventListener('click', this.activeButtonPrev);
            this.sliderButtonNext.addEventListener('click', this.activeButtonNext);
            document.addEventListener('keydown', this.activeKeydown);
         }
         if (this.dragdrop == true) {
            // листание мышкой и touchscreen
            this.slider.addEventListener('mousedown', this.mouseDown);
            this.slider.addEventListener('touchstart', this.startTouch, { "passive": true });
         }
         // событие клика на точках
         if (this.dots == true) { this.sliderDots.addEventListener('click', this.dotsClick) };
         if (this.autoplayOff == true) {
            this.slider.addEventListener('mouseenter', this.autoplayStop);
            this.slider.addEventListener('mouseleave', this.autoplayRun);
         }
      }
      // функция удаления событий
      removeEvent = () => {
         if (this.buttonsShow == true) {
            this.sliderButtonNext.removeEventListener('click', this.activeButtonNext)
            this.sliderButtonPrev.removeEventListener('click', this.activeButtonPrev)
            document.removeEventListener('keydown', this.activeKeydown);
         }
         if (this.dragdrop == true) {
            this.slider.removeEventListener('mousedown', this.mouseDown);
            document.removeEventListener('mouseup', this.mouseUp);
            this.slider.removeEventListener('touchstart', this.startTouch);
            document.removeEventListener('touchend', this.endTouch);
         }
         if (this.dots == true) { this.sliderDots.removeEventListener('click', this.dotsClick) };
      }
      //  ==ФУНКЦИИ СОБЫТИЙ==
      // позиционирование ленты слайдера при бесконечном режиме при загрузке страницы
      infinitySliderPositionStart = () => {
         this.offset = -this.startPositionSlider;
         this.positionSlider();
      }

      positionSlider = () => {
         if (this.vertical) {
            this.sliderBoby.style.transform = `translate(0px, ${this.offset}px)`;
         } else {
            this.sliderBoby.style.transform = `translate(${this.offset}px, 0px)`;
            this.markcItem();
         }

      }

      // * NEXT - кнопка листания ВПЕРЁД
      activeButtonNext = () => {
         // отключение события для ожидания анимации перемещения
         if (this.waitForAnimate == true && this.buttonsShow == true) { this.removeEvent() };
         // смещение ленты
         if (-this.offset <= this.verificationNext) {
            this.offset -= this.offsetSlider; // расчёт смещения ленты слайдера
            // ограничение перемещения при ограниченном (не бесконечном) слайдере
            if (!this.infinitySlider && -this.offset + this.sliderWindowSize > this.sliderCloneSize) { this.offset = -(this.sliderCloneSize - this.sliderWindowSize) };
            // коррекция положения при максимально допустимом смещении
            if (this.offset - this.sliderWindowSize < -this.sliderCloneSize) {
               this.offset += (this.sliderSize + this.offsetSlider);
               this.sliderBoby.style.transition = '';
               this.positionSlider();
            } else {
               this.sliderBoby.style.transition = `transform ${this.timeTransition}s ${this.changeScenario}`;
               this.positionSlider();
               if (!this.infinitySlider) { this.offButton() }; // отключение кнопки  prev/next
               if (this.dots == true) { this.dotActive() }; // подсветка точек
               if (this.activeSlider == true) { this.sliderActive(false) };
               setTimeout(this.infinityPosition, this.timeTransition * 1000);
            }
         }
      }
      // * PREV - кнопка листания НАЗАД
      activeButtonPrev = () => {
         // отключение события для ожидания анимации перемещения
         if (this.waitForAnimate == true && this.buttonsShow == true) { this.removeEvent() };
         // смещение ленты
         if (this.offset < 0) {
            this.offset += this.offsetSlider;
            // ограничение перемещения при ограниченном слайдере
            if (this.offset > 0) { this.offset = 0 };
            this.sliderBoby.style.transition = `transform ${this.timeTransition}s ${this.changeScenario}`;
            this.positionSlider();
         }
         if (!this.infinitySlider) { this.offButton() }; // отключение кнопки  prev/next
         if (this.dots == true) { this.dotActive() }; // подсветка точек
         if (this.activeSlider == true) { this.sliderActive(false) };
         setTimeout(this.infinityPosition, this.timeTransition * 1000);
      }
      // * КЛАВИАТУРА управление стрелками
      activeKeydown = (event) => {
         if (event.code == 'ArrowRight' || event.code == 'ArrowLeft') {
            if (!event.repeat) { // проверка залипания клавиши
               // отключение события для ожидания анимации перемещения
               if (this.waitForAnimate && event.code == 'ArrowRight' || event.code == 'ArrowLeft') { this.removeEvent() };
               if (event.code == 'ArrowRight') { this.activeButtonNext() };
               if (event.code == 'ArrowLeft') { this.activeButtonPrev() };
            }
         }
      }
      // функция проверки и коректировки крайнего положения слайдера при бесконечной прокрутке
      infinityPosition = () => {
         this.sliderBoby.style.transition = ``;
         //prev
         if (-this.startPositionSlider < this.offset) {
            this.offset -= this.sliderSize;
            this.positionSlider();
         }
         // next
         if (-this.offset >= this.sliderSize + this.startPositionSlider) {
            this.offset += this.sliderSize;
            this.positionSlider();
         }
         // плавность переходов активного слайдера
         if (this.activeSlider == true) {
            this.sliderActive(true)
            for (let element of this.sliderItem) { element.style.transition = `all ${this.activeSliderTimeTransition}s ${this.activeSliderScenarioTransition} 0s` }
         }
         this.addEvent();

      }
      // функция добавление и удаление класса не активной кнопки prev/next
      offButton = () => {
         if (this.offset >= 0) {
            this.sliderButtonPrev.classList.add('button__slider-off');
         } else {
            this.sliderButtonPrev.classList.remove('button__slider-off');
         }
         if (-this.offset >= this.sliderCloneSize - this.sliderWindowSize) {
            this.sliderButtonNext.classList.add('button__slider-off');
         } else {
            this.sliderButtonNext.classList.remove('button__slider-off');
         }
      }
      // авто прокрутка
      autoplayStart = () => {
         if (this.autoPlayReverse == 'right' && this.stopAutoplay) { this.activeButtonNext() };
         if (this.autoPlayReverse == 'left' && this.stopAutoplay) { this.activeButtonPrev() };
         setTimeout(this.autoplayStart, (this.autoPlayInterval + this.timeTransition) * 1000);
      }
      // остановка автовоспроизведения при наведении курсока на слайдер
      autoplayStop = (event) => { this.stopAutoplay = false };
      autoplayRun = (event) => { this.stopAutoplay = true };
      // активный слайдер
      sliderActive = (trans) => {
         if (this.activeSlider == true) {
            for (let element of this.sliderItem) {
               if (trans) { element.style.transition = `` }
               element.classList.toggle('slider__active',
                  Math.round((this.vertical ? element.offsetTop : element.offsetLeft) / 10) == Math.round((-this.offset + (this.gapSlider + this.sizeItemSlider) * (this.activeSliderNamber - 1)) / 10));
            }
         }
      }
      // листание курсором
      mouseDown = (event) => {
         if (event.target.closest('.slider')) {
            this.vertical ? this.startDrop = event.clientY : this.startDrop = event.clientX;
            document.addEventListener('mouseup', this.mouseUp);
         }
      }
      mouseUp = (event) => {
         let c = this.vertical ? event.clientY : event.clientX;
         if (Math.abs(this.startDrop - c) / this.sliderWindowSize * 100 >= this.dragdropPercentSwipe) {
            if (this.startDrop - c < 0) { this.activeButtonPrev() };
            if (this.startDrop - c > 0) { this.activeButtonNext() };
            if (this.waitForAnimate == true && this.buttonsShow == true) { this.removeEvent() };
         }
         document.removeEventListener('mouseup', this.mouseUp);
      }
      // листание touchscreen
      startTouch = (event) => {
         if (event.target.closest('.slider')) {
            this.startDrop = this.vertical ? event.changedTouches[0].clientY : event.changedTouches[0].clientX;
            document.addEventListener('touchend', this.endTouch);
         }
      }
      endTouch = (event) => {
         let c = this.vertical ? event.changedTouches[0].clientY : event.changedTouches[0].clientX
         if (Math.abs(this.startDrop - c) / this.sliderWindowSize * 100 >= this.dragdropPercentSwipe) {
            if (this.startDrop - c < 0) { this.activeButtonPrev() };
            if (this.startDrop - c > 0) { this.activeButtonNext() };
            if (this.waitForAnimate == true && this.buttonsShow == true) { this.removeEvent() };
         }
         document.removeEventListener('touchend', this.endTouch);
      }
      // подсветка точки активного слайдера
      dotActive = () => {
         this.y = this.offset;
         if (-this.startPositionSlider < this.offset) { this.y = this.offset - this.sliderSize }
         if (-this.offset >= this.sliderSize + this.startPositionSlider) { this.y = this.offset + this.sliderSize };
         this.z;
         for (let e of this.sliderItem) {
            if ((this.vertical ? e.offsetTop : e.offsetLeft) + 10 > -this.y &&
               (this.vertical ? e.offsetTop : e.offsetLeft) - 10 < -this.y) {
               this.z = e.dataset.namberslider;
            }
         }
         for (let i of this.sliderDotsItem) {
            i.classList.toggle('slider__dot-active', i.dataset.namberdot == this.z)
         };
      }
      // листание нажанием на точки
      dotsClick = (event) => {
         if (event.target.closest('button')) {
            this.namberdot = event.target.closest('.slider__dot-item').dataset.namberdot;
            this.sliderItemArrey.forEach(e => {
               if (e.dataset.namberslider == this.namberdot) {
                  if (this.vertical) {
                     this.offset = -(e.offsetTop);
                  } else {
                     this.offset = -(e.offsetLeft);
                  }
                  this.sliderBoby.style.transition = `transform ${this.timeTransition}s ${this.changeScenario}`;
                  this.positionSlider();
               }
            })
         }
         this.dotActive();
         if (!this.infinitySlider) { this.offButton() }
         if (this.activeSlider == true) { this.sliderActive(false) };
      }

   } // конец

   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




   /* 
      let sliderFirst = new GSlider({
         sliderName: 'slider-first', // id блока слайдера
         vertical: false, // вертикальная ориентация true/false
         buttonsShow: true, // показывать кнопок листания true/false
         dots: true, // показывать точки навичации слайдера true/false
         timeTransition: 1, // скорость смены слайдов (секунды)
         changeScenario: 'ease', // сценарий смены слайдов linear, ease (свойства transition)
         gapSlider: 20, // интервал между слайдами 'px'
         quantitySlider: 2, // количество видимых слайдов
         quantitySliderTransition: 1,  // количество пролистаных слайдов за раз
         autoPlay: false, // автоматическая прокрутка слайдов true/false
         autoPlayReverse: 'left', // направление движения слайдера в режиме авто left/right
         autoPlayInterval: 1, // интервал прокрутки слайдов в авто режиме (секунды)
         waitForAnimate: true, // отключение быстрой прокрутки при быстрой серии нажатий true/false
         infinitySlider: true, // бесконечный слайдер true/false
         activeSlider: false, // выделение активного слайдера (можно задать дополнительнике стили)
         activeSliderTimeTransition: 1, // плавность перехода стилей активного слайдера
         activeSliderScenarioTransition: 'ease', // сценарий смены стилей активного слайдера linear, ease (свойства transition)
         activeSliderNamber: 1, // какой слайдер по счёту от левого края будет активный
         dragdrop: true,  // листание курсором или смахиванием touchscreen
         dragdropPercentSwipe: 25, // какой процент ширины необходимо протянуть для листания мышкой или touchscreen
   
         mediaQuerys: {
   
            1100: {
               quantitySlider: 3,
               gapSlider: 0,
               dots: false,
   
            },
            766.98: {
               quantitySlider: 3,
               activeSlider: true,
               activeSliderNamber: 2,
               quantitySliderTransition: 1,
            },
            991.98: {
               quantitySlider: 4,
               gapSlider: 3,
               vertical: true,
               buttonsShow: false,
            },
   
   
         },
   
      });
      sliderFirst.initSlider();
   
    */


   let slider_1 = new GSlider({
      sliderName: 'slider-1',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_1.initSlider();

   let slider_2 = new GSlider({
      sliderName: 'slider-2',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_2.initSlider();

   let slider_3 = new GSlider({
      sliderName: 'slider-3',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_3.initSlider();

   let slider_4 = new GSlider({
      sliderName: 'slider-4',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_4.initSlider();

   let slider_5 = new GSlider({
      sliderName: 'slider-5',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_5.initSlider();

   let slider_6 = new GSlider({
      sliderName: 'slider-6',
      buttonsShow: true, // показывать кнопок листания true/false
      dots: false, // показывать точки навичации слайдера true/false
      infinitySlider: true,
   })
   slider_6.initSlider();





})



document.body.addEventListener('click', (e) => {

   if (e.target.closest('.cube__side')) {
      e.target.closest('.cube__side').classList.add('slider_show')
      e.target.closest('.cube__body').classList.add('slider_show')
   }

   if (e.target.closest('.button-apply')) {
      e.target.closest('.cube__side').classList.remove('slider_show')
      e.target.closest('.cube__body').classList.remove('slider_show')
   }

})


