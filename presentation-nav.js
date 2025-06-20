// Система навигации презентации
class PresentationNavigator {
    constructor() {
        this.slides = [
            { url: 'index.html', title: 'Введение' },
            { url: 'problem-scale.html', title: 'Масштаб проблемы' },
            { url: 'definitions.html', title: 'Определения' },
            { url: 'techniques.html', title: 'Практические техники' },
            { url: 'psychology.html', title: 'Психология прокрастинации' },
            { url: 'implementation.html', title: 'Шаги по внедрению' },
            { url: 'resources.html', title: 'Полезные ресурсы' }
        ];
        
        this.currentSlide = this.getCurrentSlideIndex();
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Проверяем, инициализирована ли навигация уже
        if (document.body.dataset.presentationNavInitialized) {
            return; // Если да, выходим
        }
        document.body.dataset.presentationNavInitialized = 'true'; // Отмечаем, что инициализирована

        this.createNavigationElements();
        this.bindEvents();
        this.updateNavigation();
    }
    
    getCurrentSlideIndex() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageWithoutExt = currentPage.replace('.html', '');
        const slideIndex = this.slides.findIndex(slide => {
            const slideUrl = slide.url.replace('.html', '');
            return slideUrl === pageWithoutExt || slide.url === currentPage;
        });
        return slideIndex !== -1 ? slideIndex : 0;
    }
    
    createNavigationElements() {
        // Вместо удаления и повторного создания, будем проверять существование элементов
        // и создавать их только если они отсутствуют. Это предотвратит потерю стилей.

        // Создаем индикатор прогресса
        let progressIndicator = document.querySelector('.progress-indicator');
        if (!progressIndicator) {
            progressIndicator = document.createElement('div');
            progressIndicator.className = 'progress-indicator';
            progressIndicator.innerHTML = '<div class="progress-bar-presentation"></div>';
            document.body.appendChild(progressIndicator);
        }
        
        // Создаем номер слайда
        let slideNumber = document.querySelector('.slide-number');
        if (!slideNumber) {
            slideNumber = document.createElement('div');
            slideNumber.className = 'slide-number';
            slideNumber.id = 'slideNumber';
            document.body.appendChild(slideNumber);
        }
        
        // Создаем боковые стрелки
        let prevArrow = document.querySelector('.side-nav.prev');
        if (!prevArrow) {
            prevArrow = document.createElement('a');
            prevArrow.className = 'side-nav prev';
            prevArrow.id = 'prevSlide';
            prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevArrow.href = '#';
            document.body.appendChild(prevArrow);
        }
        
        let nextArrow = document.querySelector('.side-nav.next');
        if (!nextArrow) {
            nextArrow = document.createElement('a');
            nextArrow.className = 'side-nav next';
            nextArrow.id = 'nextSlide';
            nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextArrow.href = '#';
            document.body.appendChild(nextArrow);
        }
        
        // Создаем нижнюю панель навигации
        let presentationNav = document.querySelector('.presentation-nav');
        if (!presentationNav) {
            presentationNav = document.createElement('div');
            presentationNav.className = 'presentation-nav';
            
            // Стрелка назад
            const navPrev = document.createElement('a');
            navPrev.className = 'nav-arrow';
            navPrev.id = 'navPrev';
            navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
            navPrev.href = '#';
            
            // Счетчик слайдов
            const slideCounter = document.createElement('div');
            slideCounter.className = 'slide-counter';
            slideCounter.id = 'slideCounter';
            
            // Точки навигации
            const slideDots = document.createElement('div');
            slideDots.className = 'slide-dots';
            slideDots.id = 'slideDots';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'slide-dot';
                dot.dataset.slide = i;
                dot.title = this.slides[i].title;
                slideDots.appendChild(dot);
            }
            
            // Стрелка вперед
            const navNext = document.createElement('a');
            navNext.className = 'nav-arrow';
            navNext.id = 'navNext';
            navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
            navNext.href = '#';
            
            presentationNav.appendChild(navPrev);
            presentationNav.appendChild(slideCounter);
            presentationNav.appendChild(slideDots);
            presentationNav.appendChild(navNext);
            
            document.body.appendChild(presentationNav);
        }
    }
    
    bindEvents() {
        // Клики по стрелкам
        document.getElementById('prevSlide').addEventListener('click', (e) => {
            e.preventDefault();
            this.previousSlide();
        });
        
        document.getElementById('nextSlide').addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });
        
        document.getElementById('navPrev').addEventListener('click', (e) => {
            e.preventDefault();
            this.previousSlide();
        });
        
        document.getElementById('navNext').addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });
        
        // Клики по точкам навигации
        document.getElementById('slideDots').addEventListener('click', (e) => {
            if (e.target.classList.contains('slide-dot')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
            }
        });
        
        // Навигация с клавиатуры
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
    }
    
    updateNavigation() {
        // Обновляем счетчик слайдов
        document.getElementById('slideCounter').textContent =
            `${this.currentSlide + 1} / ${this.totalSlides}`;
        
        // Обновляем номер слайда
        document.getElementById('slideNumber').textContent =
            `Слайд ${this.currentSlide + 1}`;
        
        // Обновляем прогресс-бар
        const progressBar = document.querySelector('.progress-bar-presentation');
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Обновляем состояние стрелок
        const prevButtons = document.querySelectorAll('#prevSlide, #navPrev');
        const nextButtons = document.querySelectorAll('#nextSlide, #navNext');
        
        prevButtons.forEach(btn => {
            if (this.currentSlide === 0) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
        
        nextButtons.forEach(btn => {
            if (this.currentSlide === this.totalSlides - 1) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
        
        // Обновляем точки навигации
        document.querySelectorAll('.slide-dot').forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides) {
            const targetSlide = this.slides[slideIndex];
            
            // Добавляем эффект перехода
            document.body.style.opacity = '0.8';
            
            setTimeout(() => {
                window.location.href = targetSlide.url;
            }, 150);
        }
    }
}

// Инициализация навигации презентации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.presentationNav = new PresentationNavigator();
});

