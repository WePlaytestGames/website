/**
 * We Playtest Games - Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Modal Functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal functions
    function closeAllModals() {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // Close on X button
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Close on overlay click
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', closeAllModals);
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Form Submissions via Formspree
    function showSuccessMessage(form, successMessage) {
        const modalContent = form.closest('.modal-content');
        modalContent.innerHTML = `
            <button class="modal-close" aria-label="Close modal">&times;</button>
            <div class="success-message">
                <svg class="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>Success!</h3>
                <p>${successMessage}</p>
                <button class="cta-button-solid close-success-btn">CLOSE</button>
            </div>
        `;

        // Re-attach close handlers
        modalContent.querySelector('.modal-close').addEventListener('click', closeAllModals);
        modalContent.querySelector('.close-success-btn').addEventListener('click', closeAllModals);
    }

    async function handleFormSubmit(form, successMessage) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showSuccessMessage(form, successMessage);
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert('Error: ' + data.errors.map(e => e.message).join(', '));
                } else {
                    alert('Something went wrong. Please try again.');
                }
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Network error. Please check your connection and try again.');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    const streamForm = document.getElementById('stream-form');
    const bookForm = document.getElementById('book-form');
    const testerForm = document.getElementById('tester-form');

    if (streamForm) {
        streamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Thank you for your request! We\'ll let you know when your free streamed playtest is scheduled.');
        });
    }

    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Thank you! We\'ll be in touch soon to complete your booking.');
        });
    }

    if (testerForm) {
        testerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this, 'Thank you for applying! We\'ll review your application and be in touch soon.');
        });
    }

    // Smooth scroll for anchor links (fallback for older browsers)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(18, 18, 18, 0.98)';
            } else {
                header.style.background = 'rgba(18, 18, 18, 0.95)';
            }
        });
    }

    // Add subtle parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        });
    }

    // Animate cards on scroll into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('featured')
                    ? 'scale(1.02)'
                    : 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    document.querySelectorAll('.playtest-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
