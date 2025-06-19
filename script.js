// Общие JavaScript функции для сайта тайм-менеджмента

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initProgressBars();
    initNotifications();
    initTooltips();
    initLazyLoading();
});

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Добавляем задержку для последовательной анимации
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = delay + 'ms';
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с классом fade-in-element
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });

    // Автоматически добавляем класс fade-in-element к карточкам
    document.querySelectorAll('.card, .technique-card, .step-card, .resource-card').forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });
}

// Изменение навигации при скролле
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Добавляем класс при скролле
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Скрываем/показываем навигацию
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Плавная прокрутка к якорям
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Учитываем высоту навигации
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимация прогресс-баров
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-progress') || '0';
                
                setTimeout(() => {
                    progressBar.style.width = targetWidth + '%';
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Система уведомлений
function initNotifications() {
    window.showNotification = function(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-${getNotificationIcon(type)} mr-2"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Автоматически скрываем
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    };

    function getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Инициализация тултипов
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.classList.add('tooltip');
    });
}

// Ленивая загрузка изображений
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Функции для модальных окон
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Добавляем анимацию появления
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Инициализация графиков при открытии модального окна
        if (modalId === 'pomodoroModal' && typeof initPomodoroChart === 'function') {
            setTimeout(initPomodoroChart, 100);
        } else if (modalId === 'detoxModal' && typeof initDistractionChart === 'function') {
            setTimeout(initDistractionChart, 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Закрытие модального окна по Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Функция для копирования текста в буфер обмена
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Скопировано в буфер обмена!', 'success', 2000);
    }).catch(function() {
        showNotification('Ошибка при копировании', 'error', 2000);
    });
}

// Функция для сохранения прогресса в localStorage
function saveProgress(key, value) {
    try {
        localStorage.setItem('timeManagement_' + key, JSON.stringify(value));
    } catch (e) {
        console.warn('Не удалось сохранить прогресс:', e);
    }
}

function loadProgress(key) {
    try {
        const saved = localStorage.getItem('timeManagement_' + key);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.warn('Не удалось загрузить прогресс:', e);
        return null;
    }
}

// Функция для отслеживания времени на странице
function trackTimeOnPage() {
    const startTime = Date.now();
    const pageName = document.title;
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const timeData = loadProgress('timeTracking') || {};
        timeData[pageName] = (timeData[pageName] || 0) + timeSpent;
        saveProgress('timeTracking', timeData);
    });
}

// Инициализация отслеживания времени
trackTimeOnPage();

// Функция для создания эффекта печатающегося текста
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Функция для создания конфетти эффекта
function createConfetti() {
    const colors = ['#ff6b35', '#4299e1', '#48bb78', '#9f7aea', '#ed64a6'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 9999;
            pointer-events: none;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Функция для проверки выполнения чек-листа
function initChecklistProgress() {
    const checklists = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checklists.forEach(checkbox => {
        // Загружаем сохраненное состояние
        const checkboxId = checkbox.id;
        const saved = loadProgress('checklist_' + checkboxId);
        if (saved) {
            checkbox.checked = saved;
        }
        
        checkbox.addEventListener('change', function() {
            // Сохраняем состояние
            saveProgress('checklist_' + checkboxId, this.checked);
            
            // Проверяем прогресс
            const totalCheckboxes = checklists.length;
            const checkedBoxes = Array.from(checklists).filter(cb => cb.checked).length;
            const progress = Math.round((checkedBoxes / totalCheckboxes) * 100);
            
            // Показываем прогресс
            if (progress === 100) {
                showNotification('Поздравляем! Вы выполнили все пункты!', 'success');
                createConfetti();
            } else if (this.checked) {
                showNotification(`Прогресс: ${progress}%`, 'info', 1500);
            }
        });
    });
}

// Инициализация чек-листов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initChecklistProgress, 500);
});

// Функция для создания эффекта параллакса
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * (element.dataset.parallax || 0.5);
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Функция для создания эффекта частиц
function createParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 107, 53, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
    }
}

// Экспорт функций для использования в других файлах
window.TimeManagementUtils = {
    openModal,
    closeModal,
    showNotification,
    copyToClipboard,
    saveProgress,
    loadProgress,
    typeWriter,
    createConfetti,
    createParticles
};

