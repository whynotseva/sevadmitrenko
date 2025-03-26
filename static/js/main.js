document.addEventListener('DOMContentLoaded', () => {
    // Проверка мобильного устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Если мобильное устройство, добавляем класс
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Управление темой
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Получаем сохраненную тему из localStorage или используем системные предпочтения
    function getThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return prefersDarkScheme.matches ? 'dark' : 'light';
    }
    
    // Устанавливаем тему
    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    }
    
    // Инициализация темы
    function initTheme() {
        const currentTheme = getThemePreference();
        setTheme(currentTheme);
    }
    
    // Переключатель темы
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = getThemePreference();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    // Инициализация темы при загрузке
    initTheme();
    
    // Мобильное меню
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    function toggleMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Изменение иконки гамбургер-меню
        if (navMenu.classList.contains('active')) {
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }
    
    // Закрытие меню при клике на оверлей
    if (menuOverlay) {
        menuOverlay.addEventListener('click', toggleMenu);
    }

    // Закрывать мобильное меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                const yOffset = -80; // Учитываем высоту шапки
                const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({top: y, behavior: 'smooth'});
            }
        });
    });

    // Подсветка активного пункта меню при прокрутке
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Поиск элемента по атрибуту onclick, содержащему идентификатор секции
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('onclick').includes(`'${sectionId}'`)) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Анимация появления секций при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        sectionObserver.observe(section);
    });

    // Фильтрация по категориям промптов
    const categoryBtns = document.querySelectorAll('.category-btn');
    const promptCards = document.querySelectorAll('.prompt-card');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс на нажатую кнопку
            btn.classList.add('active');
            
            const category = btn.textContent.trim();
            
            // Фильтруем карточки
            promptCards.forEach(card => {
                const cardCategory = card.querySelector('.prompt-category').textContent.trim();
                
                if (category === 'Все' || category === 'Маркетинг' || cardCategory === category) {
                    card.style.display = 'block';
                    // Добавляем анимацию появления, если GSAP загружен
                    if (typeof gsap !== 'undefined') {
                        gsap.from(card, {
                            opacity: 0,
                            y: 20,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Кастомный курсор (только для десктопа)
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!isMobile && cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Анимация при наведении на ссылки
        const links = document.querySelectorAll('a, button');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            link.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    // GSAP анимации
    if (typeof gsap !== 'undefined') {
        try {
            gsap.registerPlugin(ScrollTrigger);
            
            // Анимация заголовка
            gsap.from('.hero-title', {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            });

            // Анимация статистики
            gsap.from('.stat-item', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.hero-stats',
                    start: 'top 80%'
                }
            });

            // Анимация правил
            gsap.from('.rule-card', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.rules-grid',
                    start: 'top 80%'
                }
            });

            // Анимация промптов
            gsap.from('.prompt-card', {
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.prompts-grid',
                    start: 'top 80%'
                }
            });
            
            // Анимация блока консультации
            gsap.from('.consultation-content', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.consultation',
                    start: 'top 80%'
                }
            });
        } catch (error) {
            console.error('GSAP animation error:', error);
        }
    }

    // Изменение цвета хедера при скролле
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Управление видимостью мобильной GPT кнопки
    const mobileGptBtn = document.querySelector('.mobile-gpt-btn');
    const heroSection = document.getElementById('hero');

    if (mobileGptBtn && heroSection) {
        let heroHeight = heroSection.offsetHeight;
        let isVisible = true;
        
        function toggleGptButtonVisibility() {
            const currentScroll = window.pageYOffset;
            
            // Если скролл больше 60% высоты первой секции и кнопка видима
            if (currentScroll > heroHeight * 0.6 && isVisible) {
                mobileGptBtn.classList.add('hidden');
                isVisible = false;
            } 
            // Если скролл меньше 60% высоты первой секции и кнопка скрыта
            else if (currentScroll <= heroHeight * 0.6 && !isVisible) {
                mobileGptBtn.classList.remove('hidden');
                isVisible = true;
            }
        }
        
        // Первоначальная проверка при загрузке страницы
        toggleGptButtonVisibility();
        
        // Отслеживание скролла с небольшой задержкой для производительности
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (scrollTimer) clearTimeout(scrollTimer);
            scrollTimer = setTimeout(toggleGptButtonVisibility, 10);
        });
        
        // Обновление высоты секции при изменении размера окна
        window.addEventListener('resize', () => {
            heroHeight = heroSection.offsetHeight;
            toggleGptButtonVisibility();
        });
    }
}); 