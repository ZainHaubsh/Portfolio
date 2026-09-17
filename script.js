document.addEventListener('DOMContentLoaded', () => {
    initNavbarScrollEffect();
    initScrollspy();
    initBackToTop();
    initScrollReveal();
    initContactForm();
    initScrollProgress();
    initFooterYear();
});

function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (!yearEl) return;
    yearEl.textContent = new Date().getFullYear();
}

function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${percent}%`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
}

function initNavbarScrollEffect() {
    const nav = document.querySelector('.navSection');
    if (!nav) return;

    const updateNav = () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
}

function initScrollspy() {
    const links = document.querySelectorAll('.nav-links .link[href^="#"]');
    if (!links.length) return;

    const sections = Array.from(links)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActive = (id) => {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    const toggleVisibility = () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.storyItem, .bigCard, .projectCard, .expCard, .contactCard, .contactForm'
    );
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('reveal', 'revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
        observer.observe(el);
    });
}

function initContactForm() {
    const form = document.querySelector('.contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.submitBtn');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';

    let status = form.querySelector('.formStatus');
    if (!status) {
        status = document.createElement('p');
        status.className = 'formStatus';
        form.appendChild(status);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = '';
        status.className = 'formStatus';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                status.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
                status.classList.add('success');
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            status.textContent = 'Something went wrong. Please email me directly at zhaubsh@gmail.com.';
            status.classList.add('error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}
