document.addEventListener('DOMContentLoaded', () => {
    const sideNav = document.getElementById('sideNav');
    const overlay = document.getElementById('overlay');
    const navToggle = document.querySelector('.nav-toggle');
    const navClose = document.getElementById('navClose');

    function toggleNavigation() {
        console.log('Navigation toggle clicked'); // Debug log
        try {
            sideNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.scrollBehavior = 'smooth';
        } catch (error) {
            console.error('Error toggling navigation:', error);
        }
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleNavigation);
    } else {
        console.error('navToggle element not found');
    }
    if (navClose) {
        navClose.addEventListener('click', toggleNavigation);
    } else {
        console.error('navClose element not found');
    }
    if (overlay) {
        overlay.addEventListener('click', toggleNavigation);
    } else {
        console.error('overlay element not found');
    }

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchGames, 300));
    }

    function searchGames(e) {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    let currentSlide = 0;
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const indicatorsContainer = document.getElementById('galleryIndicators');
    const prevButton = document.querySelector('.gallery-nav.prev');
    const nextButton = document.querySelector('.gallery-nav.next');
    let autoScrollInterval;

    galleryItems.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('gallery-indicator');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    function updateIndicators() {
        document.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % galleryItems.length;
        updateGallery();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + galleryItems.length) % galleryItems.length;
        updateGallery();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateGallery();
    }

    function updateGallery() {
        galleryTrack.scrollTo({
            left: galleryItems[currentSlide].offsetLeft,
            behavior: 'smooth'
        });
        updateIndicators();
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoScroll();
        startAutoScroll();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoScroll();
        startAutoScroll();
    });

    galleryTrack.addEventListener('mouseenter', stopAutoScroll);
    galleryTrack.addEventListener('mouseleave', startAutoScroll);

    let touchStartX = 0;
    let touchEndX = 0;

    galleryTrack.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
    });

    galleryTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoScroll();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDifference = touchStartX - touchEndX;

        if (swipeDifference > swipeThreshold) {
            nextSlide();
        } else if (swipeDifference < -swipeThreshold) {
            prevSlide();
        }
    }

    startAutoScroll();

    const tabs = document.querySelectorAll('.section-tab');
    const sections = document.querySelectorAll('.section-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const sectionId = `${this.dataset.section}-section`;
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const sectionTabs = document.querySelector('.section-tabs');
    let isDown = false;
    let startX;
    let scrollLeft;

    sectionTabs.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - sectionTabs.offsetLeft;
        scrollLeft = sectionTabs.scrollLeft;
        sectionTabs.style.cursor = 'grabbing';
        sectionTabs.style.scrollBehavior = 'auto';
    });

    sectionTabs.addEventListener('mouseleave', () => {
        isDown = false;
        sectionTabs.style.cursor = 'grab';
    });

    sectionTabs.addEventListener('mouseup', () => {
        isDown = false;
        sectionTabs.style.cursor = 'grab';
        sectionTabs.style.scrollBehavior = 'smooth';
    });

    sectionTabs.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - sectionTabs.offsetLeft;
        const walk = (x - startX) * 1.5;
        sectionTabs.scrollLeft = scrollLeft - walk;
    });

    sectionTabs.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - sectionTabs.offsetLeft;
        scrollLeft = sectionTabs.scrollLeft;
    }, { passive: true });

    sectionTabs.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - sectionTabs.offsetLeft;
        const walk = (x - startX) * 1.5;
        sectionTabs.scrollLeft = scrollLeft - walk;
    }, { passive: true });

    sectionTabs.addEventListener('touchend', () => {
        isDown = false;
    });
});