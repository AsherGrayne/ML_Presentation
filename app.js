// Presentation JavaScript
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 22;
        this.slides = document.querySelectorAll('.slide');
        
        this.init();
    }
    
    init() {
        this.setupNavigationControls();
        this.setupKeyboardControls();
        this.setupNavigationDots();
        this.updateUI();
    }
    
    setupNavigationControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.addEventListener('click', () => this.previousSlide());
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Disable/enable buttons based on current slide
        this.updateNavigationButtons();
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                default:
                    // Check for number keys (1-9)
                    if (e.key >= '1' && e.key <= '9') {
                        const slideNum = parseInt(e.key);
                        if (slideNum <= this.totalSlides) {
                            e.preventDefault();
                            this.goToSlide(slideNum);
                        }
                    }
                    break;
            }
        });
    }
    
    setupNavigationDots() {
        const navDotsContainer = document.getElementById('navDots');
        navDotsContainer.innerHTML = '';
        
        for (let i = 1; i <= this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'nav-dot';
            if (i === this.currentSlide) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => this.goToSlide(i));
            dot.setAttribute('aria-label', `Go to slide ${i}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            
            // Add keyboard support for dots
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(i);
                }
            });
            
            navDotsContainer.appendChild(dot);
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active class from current slide
        const currentSlideElement = document.querySelector('.slide.active');
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            currentSlideElement.classList.add('prev');
        }
        
        // Add active class to new slide
        const newSlideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideElement) {
            // Remove any transition classes
            this.slides.forEach(slide => {
                slide.classList.remove('prev');
            });
            
            newSlideElement.classList.add('active');
        }
        
        this.currentSlide = slideNumber;
        this.updateUI();
        
        // Add slide transition effect
        this.addSlideTransition(slideNumber);
    }
    
    addSlideTransition(slideNumber) {
        const slide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (slide) {
            // Add a subtle entrance animation
            slide.style.transform = 'translateX(50px)';
            slide.style.opacity = '0';
            
            // Force reflow
            slide.offsetHeight;
            
            // Animate to final position
            slide.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            slide.style.transform = 'translateX(0)';
            slide.style.opacity = '1';
            
            // Clean up after animation
            setTimeout(() => {
                slide.style.transition = '';
                slide.style.transform = '';
                slide.style.opacity = '';
            }, 500);
        }
    }
    
    updateUI() {
        this.updateProgressBar();
        this.updateSlideCounter();
        this.updateNavigationDots();
        this.updateNavigationButtons();
    }
    
    updateProgressBar() {
        const progress = document.getElementById('progress');
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        progress.style.width = `${progressPercentage}%`;
    }
    
    updateSlideCounter() {
        const currentSlideSpan = document.getElementById('currentSlide');
        currentSlideSpan.textContent = this.currentSlide;
    }
    
    updateNavigationDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            if (index + 1 === this.currentSlide) {
                dot.classList.add('active');
                dot.setAttribute('aria-pressed', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update ARIA attributes
        prevBtn.setAttribute('aria-disabled', this.currentSlide === 1);
        nextBtn.setAttribute('aria-disabled', this.currentSlide === this.totalSlides);
    }
    
    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
}

// Utility functions for enhanced user experience
class PresentationUtils {
    static setupFullscreenToggle() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                PresentationUtils.toggleFullscreen();
            }
        });
    }
    
    static toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    static setupMouseNavigation() {
        const slidesContainer = document.querySelector('.slides-container');
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        slidesContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
        });
        
        slidesContainer.addEventListener('mouseup', (e) => {
            endX = e.clientX;
            endY = e.clientY;
            PresentationUtils.handleSwipe(startX, startY, endX, endY);
        });
    }
    
    static setupTouchNavigation() {
        const slidesContainer = document.querySelector('.slides-container');
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            PresentationUtils.handleSwipe(startX, startY, endX, endY);
        });
    }
    
    static handleSwipe(startX, startY, endX, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const threshold = 50;
        
        // Only handle horizontal swipes that are longer than vertical swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swiped left - go to next slide
                window.presentationController.nextSlide();
            } else {
                // Swiped right - go to previous slide
                window.presentationController.previousSlide();
            }
        }
    }
    
    static setupPreloader() {
        // Add a subtle preloader effect for smoother transitions
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            if (index > 0) {
                slide.style.display = 'flex';
                slide.style.opacity = '0';
                slide.style.pointerEvents = 'none';
            }
        });
    }
    
    static addAccessibilityFeatures() {
        // Add ARIA labels and roles
        const slidesContainer = document.querySelector('.slides-container');
        slidesContainer.setAttribute('role', 'application');
        slidesContainer.setAttribute('aria-label', 'Presentation slides');
        
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'img');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });
        
        // Add live region for slide announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        liveRegion.id = 'slide-announcer';
        document.body.appendChild(liveRegion);
    }
    
    static announceSlideChange(slideNumber, totalSlides) {
        const announcer = document.getElementById('slide-announcer');
        if (announcer) {
            const slideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
            const slideTitle = slideElement?.querySelector('.slide-title')?.textContent || `Slide ${slideNumber}`;
            announcer.textContent = `${slideTitle}. Slide ${slideNumber} of ${totalSlides}`;
        }
    }
    
    static setupPrintMode() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                PresentationUtils.enterPrintMode();
            }
        });
    }
    
    static enterPrintMode() {
        // Show all slides for printing
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.style.position = 'relative';
            slide.style.opacity = '1';
            slide.style.transform = 'none';
            slide.style.pageBreakAfter = 'always';
        });
        
        // Hide navigation elements
        const navElements = document.querySelectorAll('.navigation-controls, .progress-bar, .slide-counter, .nav-dots');
        navElements.forEach(element => {
            element.style.display = 'none';
        });
        
        window.print();
        
        // Restore normal view after printing
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main presentation controller
    window.presentationController = new PresentationController();
    
    // Setup additional utilities
    PresentationUtils.setupFullscreenToggle();
    PresentationUtils.setupMouseNavigation();
    PresentationUtils.setupTouchNavigation();
    PresentationUtils.setupPreloader();
    PresentationUtils.addAccessibilityFeatures();
    PresentationUtils.setupPrintMode();
    
    // Add slide change announcements for accessibility
    const originalGoToSlide = window.presentationController.goToSlide.bind(window.presentationController);
    window.presentationController.goToSlide = function(slideNumber) {
        originalGoToSlide(slideNumber);
        PresentationUtils.announceSlideChange(slideNumber, this.totalSlides);
    };
    
    // Add keyboard shortcuts help
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
    
    function showKeyboardShortcuts() {
        const shortcuts = [
            'Arrow Keys: Navigate slides',
            'Space: Next slide',
            'Home: First slide',
            'End: Last slide',
            '1-9: Jump to slide number',
            'F11: Toggle fullscreen',
            'Ctrl+P: Print mode',
            '?: Show this help'
        ];
        
        alert('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
    }
    
    // Performance optimization: Preload next slide
    let preloadTimeout;
    const originalGoToSlideOptimized = window.presentationController.goToSlide.bind(window.presentationController);
    window.presentationController.goToSlide = function(slideNumber) {
        originalGoToSlideOptimized(slideNumber);
        
        // Clear previous timeout
        if (preloadTimeout) {
            clearTimeout(preloadTimeout);
        }
        
        // Preload next slide after a short delay
        preloadTimeout = setTimeout(() => {
            const nextSlide = slideNumber + 1;
            if (nextSlide <= this.totalSlides) {
                const nextSlideElement = document.querySelector(`.slide[data-slide="${nextSlide}"]`);
                if (nextSlideElement) {
                    // Force browser to parse the slide content
                    nextSlideElement.offsetHeight;
                }
            }
        }, 100);
    };
    
    // Handle window resize for responsive design
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            // Recalculate slide positions if needed
            const currentSlideElement = document.querySelector('.slide.active');
            if (currentSlideElement) {
                currentSlideElement.style.transform = 'translateX(0)';
            }
        }, 250);
    });
    
    // Add visual feedback for slide transitions
    const addTransitionFeedback = () => {
        const slidesContainer = document.querySelector('.slides-container');
        slidesContainer.addEventListener('transitionstart', () => {
            slidesContainer.style.pointerEvents = 'none';
        });
        
        slidesContainer.addEventListener('transitionend', () => {
            slidesContainer.style.pointerEvents = 'auto';
        });
    };
    
    addTransitionFeedback();
    
    // Initialize with first slide announcement
    setTimeout(() => {
        PresentationUtils.announceSlideChange(1, 22);
    }, 500);
    
    console.log('IoT Mental Health Monitoring Presentation initialized successfully!');
    console.log('Use arrow keys, space bar, or click buttons to navigate.');
    console.log('Press ? to see all keyboard shortcuts.');
});