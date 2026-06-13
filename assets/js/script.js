/* =========================================================
   PT LAKSAMANA MARTAPURA INDONESIA — MAIN JS
   Premium Corporate Website Interactions
   Version: 2.2.0 | Production Ready | All Bugs Fixed
   ========================================================= */

(function () {
  'use strict';

  // ========= UTILITIES =========
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Check if running in LOCAL development environment ONLY
   * Excludes staging/preview environments (Netlify, Vercel, etc)
   */
  const isDev = () => {
    const hostname = location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname.endsWith('.local') ||
           hostname.endsWith('.test');
  };

  /**
   * Debounce function untuk performance
   */
  const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  /**
   * Safe localStorage wrapper
   */
  const storage = {
    get: (key) => {
      try { return localStorage.getItem(key); }
      catch { return null; }
    },
    set: (key, value) => {
      try { localStorage.setItem(key, value); }
      catch { /* Silent fail */ }
    },
    remove: (key) => {
      try { localStorage.removeItem(key); }
      catch { /* Silent fail */ }
    }
  };

  // ========= 1. LOADING SCREEN =========
  const initLoader = () => {
    const loader = $('#loader');
    if (!loader) return;

    const hideLoader = () => {
      loader.classList.add('hidden');
      loader.setAttribute('aria-hidden', 'true');
      setTimeout(() => loader.remove(), 600);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 400), { once: true });
    }

    // Fallback: force hide after 3 seconds
    setTimeout(hideLoader, 3000);
  };

  // ========= 2. THEME TOGGLE (DARK MODE) =========
  const initThemeToggle = () => {
    const themeToggle = $('#themeToggle');
    const themeColorMeta = $('#themeColorMeta');
    const STORAGE_KEY = 'lmi_theme';
    const root = document.documentElement;

    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);

      if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        themeToggle.setAttribute('aria-label',
          `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }

      if (themeColorMeta) {
        themeColorMeta.setAttribute('content', theme === 'dark' ? '#07152B' : '#0B2447');
      }

      storage.set(STORAGE_KEY, theme);
    };

    const getPreferredTheme = () => {
      const saved = storage.get(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    applyTheme(getPreferredTheme());

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!storage.get(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
  };

  // ========= 3. NAVBAR SCROLL =========
  const initNavbarScroll = () => {
    const navbar = $('#navbar');
    const scrollProgress = $('#scrollProgress');
    const backTop = $('#backTop');
    const navLinks = $$('.nav-link');
    const sections = $$('section[id]');

    if (!navbar && !scrollProgress && !backTop) return;

    const updateScrollState = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
        scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
      }

      if (navbar) {
        navbar.classList.toggle('scrolled', scrollY > 60);
      }

      if (backTop) {
        if (scrollY > 600) {
          backTop.removeAttribute('hidden');
        } else {
          backTop.setAttribute('hidden', '');
        }
      }

      if (sections.length && navLinks.length) {
        let currentId = 'home';
        const scrollOffset = 120;

        for (const section of sections) {
          const top = section.offsetTop - scrollOffset;
          const bottom = top + section.offsetHeight;
          if (scrollY >= top && scrollY < bottom) {
            currentId = section.id;
            break;
          }
        }

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('active', isActive);
          link.setAttribute('aria-current', isActive ? 'page' : 'false');
        });
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollState();
  };

  // ========= 4. HAMBURGER / MOBILE MENU =========
  const initMobileMenu = () => {
    const hamburger = $('#hamburger');
    const navbarMenu = $('#navbarMenu');
    const menuOverlay = $('#menuOverlay');
    const navLinks = $$('.nav-link', navbarMenu);

    if (!hamburger || !navbarMenu) return;

    const getScrollbarWidth = () =>
      window.innerWidth - document.documentElement.clientWidth;

    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    const openMenu = () => {
      lastFocusedElement = document.activeElement;

      const scrollbarWidth = getScrollbarWidth();
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('menu-open');

      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Tutup menu navigasi');
      navbarMenu.classList.add('active');

      if (menuOverlay) {
        menuOverlay.classList.add('active');
        menuOverlay.setAttribute('aria-hidden', 'false');
      }

      setTimeout(() => {
        const firstLink = navLinks[0];
        if (firstLink) firstLink.focus();
      }, 400);
    };

    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      document.body.style.removeProperty('--scrollbar-width');

      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Buka menu navigasi');
      navbarMenu.classList.remove('active');

      if (menuOverlay) {
        menuOverlay.classList.remove('active');
        menuOverlay.setAttribute('aria-hidden', 'true');
      }

      if (lastFocusedElement) {
        setTimeout(() => lastFocusedElement.focus(), 400);
      }
    };

    const isMenuOpen = () => navbarMenu.classList.contains('active');
    const toggleMenu = () => isMenuOpen() ? closeMenu() : openMenu();

    hamburger.addEventListener('click', toggleMenu);

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen()) {
        closeMenu();
      }
    });

    // Focus trap
    navbarMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !isMenuOpen()) return;

      const focusables = $$(focusableSelectors, navbarMenu);
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 1024 && isMenuOpen()) {
          closeMenu();
        }
      }, 150);
    });

    // Swipe right to close
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!isMenuOpen()) return;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = Math.abs(touchEndY - touchStartY);

      if (diffX > 80 && diffY < 100) {
        closeMenu();
      }
    }, { passive: true });
  };

  // ========= 5. SMOOTH SCROLL =========
  const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;

        const target = $(href);
        if (!target) return;

        e.preventDefault();

        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, href);
        }

        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  };

  // ========= 6. SCROLL REVEAL =========
  const initScrollReveal = () => {
    if (prefersReducedMotion()) {
      $$('.reveal').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    $$('.reveal').forEach((el) => observer.observe(el));
  };

  // ========= 7. COUNTER ANIMATION =========
  const initCounterAnimation = () => {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.querySelector('small')?.textContent || '';
      const numEl = el.querySelector('span') || el;

      if (prefersReducedMotion()) {
        numEl.textContent = target;
        el.setAttribute('aria-label', `${target}${suffix}`);
        return;
      }

      const duration = 1500;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        numEl.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numEl.textContent = target;
          el.setAttribute('aria-label', `${target}${suffix}`);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));
  };

  // ========= 8. TESTIMONIAL SLIDER =========
  const initTestimonialSlider = () => {
    const slides = $$('.testi-slide');
    const dots = $$('.testi-dot');
    const prevBtn = $('#testiPrev');
    const nextBtn = $('#testiNext');
    const wrapper = $('#testiWrapper');

    if (!slides.length) return;

    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayTimer = null;
    const AUTO_PLAY_DELAY = 6000;

    const goToSlide = (newIndex, direction = 'direct') => {
      if (isAnimating) return;
      if (newIndex === currentIndex) return;
      if (newIndex < 0 || newIndex >= slides.length) return;

      isAnimating = true;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[newIndex];

      slides.forEach((s) => {
        s.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-right', 'slide-in-left');
        s.setAttribute('aria-hidden', 'true');
      });

      if (direction === 'next') {
        currentSlide.classList.add('slide-out-left');
        nextSlide.classList.add('slide-in-right');
      } else if (direction === 'prev') {
        currentSlide.classList.add('slide-out-right');
        nextSlide.classList.add('slide-in-left');
      }

      void nextSlide.offsetWidth;

      setTimeout(() => {
        nextSlide.classList.add('active');
        nextSlide.setAttribute('aria-hidden', 'false');
      }, 30);

      dots.forEach((dot, i) => {
        const isActive = i === newIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
        dot.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      currentIndex = newIndex;

      const liveRegion = $('.testi-display');
      if (liveRegion) {
        liveRegion.setAttribute('aria-label',
          `Testimoni ${newIndex + 1} dari ${slides.length}`);
      }

      setTimeout(() => {
        isAnimating = false;
      }, 600);
    };

    const nextSlide = () => {
      const next = (currentIndex + 1) % slides.length;
      goToSlide(next, 'next');
    };

    const prevSlide = () => {
      const prev = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prev, 'prev');
    };

    const startAutoPlay = () => {
      if (prefersReducedMotion()) return;
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, AUTO_PLAY_DELAY);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const dir = i > currentIndex ? 'next' : 'prev';
        goToSlide(i, dir);
        startAutoPlay();
      });

      dot.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (i + 1) % dots.length;
          dots[next].focus();
          goToSlide(next, 'next');
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (i - 1 + dots.length) % dots.length;
          dots[prev].focus();
          goToSlide(prev, 'prev');
        }
      });
    });

    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoPlay);
      wrapper.addEventListener('mouseleave', startAutoPlay);
      wrapper.addEventListener('focusin', stopAutoPlay);
      wrapper.addEventListener('focusout', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
      if (!wrapper?.contains(document.activeElement)) return;

      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoPlay();
      }
    });

    let touchStartX = 0;
    if (wrapper) {
      wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          diff > 0 ? nextSlide() : prevSlide();
        }
        startAutoPlay();
      }, { passive: true });
    }

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === 0);
      s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
    });

    startAutoPlay();

    if (isDev()) {
      window.__testiSlider = { goTo: goToSlide, next: nextSlide, prev: prevSlide };
    }
  };

  // ========= 9. CONTACT FORM VALIDATION =========
  const initContactForm = () => {
    const form = $('#contactForm');
    const formSuccess = $('#formSuccess');
    const formAlertError = $('#formAlertError');
    const formWrapper = $('#contactFormWrapper');
    const formResetBtn = $('#formResetBtn');

    if (!form || !formSuccess || !formWrapper) return;

    const FORM_STORAGE_KEY = 'lmi_form_draft';

    const validators = {
      formName: {
        validate: (v) => v.trim().length >= 2,
        msg: 'Nama minimal 2 karakter.'
      },
      formEmail: {
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
        msg: 'Format email tidak valid.'
      },
      formPhone: {
        validate: (v) => /^[0-9+\-\s()]{8,20}$/.test(v.trim()),
        msg: 'Nomor telepon tidak valid.'
      },
      formService: {
        validate: (v) => v.trim().length > 0,
        msg: 'Pilih jenis layanan.'
      },
      formMessage: {
        validate: (v) => v.trim().length >= 10,
        msg: 'Pesan minimal 10 karakter.'
      }
    };

    const showError = (name, msg) => {
      const field = form.querySelector(`#${name}`);
      const errorEl = form.querySelector(`[data-for="${name}"]`);
      if (errorEl) errorEl.textContent = msg;
      if (field) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
      }
    };

    const clearError = (name) => {
      const field = form.querySelector(`#${name}`);
      const errorEl = form.querySelector(`[data-for="${name}"]`);
      if (errorEl) errorEl.textContent = '';
      if (field) {
        field.classList.remove('invalid');
        field.setAttribute('aria-invalid', 'false');
      }
    };

    const restoreDraft = () => {
      try {
        const draft = JSON.parse(storage.get(FORM_STORAGE_KEY) || '{}');
        Object.keys(draft).forEach((key) => {
          const field = form.querySelector(`#${key}`);
          if (field && draft[key]) field.value = draft[key];
        });
      } catch { /* ignore */ }
    };

    const saveDraft = () => {
      const data = {};
      Object.keys(validators).forEach((key) => {
        const field = form.querySelector(`#${key}`);
        if (field) data[key] = field.value;
      });
      const company = form.querySelector('#formCompany');
      if (company) data.formCompany = company.value;
      storage.set(FORM_STORAGE_KEY, JSON.stringify(data));
    };

    const clearDraft = () => {
      storage.remove(FORM_STORAGE_KEY);
    };

    const resetForm = () => {
      formWrapper.classList.remove('submitted');
      form.reset();
      form.removeAttribute('style');
      formSuccess.setAttribute('hidden', '');
      form.removeAttribute('hidden');
      if (formAlertError) formAlertError.setAttribute('hidden', '');

      Object.keys(validators).forEach(clearError);
    };

    if (formResetBtn) {
      formResetBtn.addEventListener('click', resetForm);
    }

    restoreDraft();

    form.addEventListener('input', debounce(saveDraft, 500));

    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`#${name}`);
      const validator = validators[name];

      if (!field) return;

      field.addEventListener('blur', () => {
        if (!validator.validate(field.value)) {
          showError(name, validator.msg);
        } else {
          clearError(name);
        }
      });

      field.addEventListener('input', debounce(() => {
        if (field.classList.contains('invalid') && validator.validate(field.value)) {
          clearError(name);
        }
      }, 300));

      if (name === 'formPhone') {
        field.addEventListener('paste', () => {
          setTimeout(() => {
            if (!validator.validate(field.value)) {
              showError(name, validator.msg);
            }
          }, 10);
        });
      }
    });

    const sanitize = (str) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return String(str).replace(/[&<>"']/g, (c) => map[c]);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidField = null;

      Object.keys(validators).forEach((name) => {
        const field = form.querySelector(`#${name}`);
        const validator = validators[name];

        if (!field) return;

        if (!validator.validate(field.value)) {
          showError(name, validator.msg);
          isValid = false;
          if (!firstInvalidField) firstInvalidField = field;
        } else {
          clearError(name);
        }
      });

      if (!isValid) {
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      // sanitize() is NOT used here — encodeURIComponent handles URL safety.
      // sanitize() is only for injecting into innerHTML (e.g. formAlertError).
      const data = {
        name: form.querySelector('#formName').value.trim(),
        company: form.querySelector('#formCompany')?.value.trim() || '',
        email: form.querySelector('#formEmail').value.trim(),
        phone: form.querySelector('#formPhone').value.trim(),
        service: form.querySelector('#formService').value,
        message: form.querySelector('#formMessage').value.trim()
      };

      const waText = [
        'Halo LMI,%0A%0A',
        `Nama: ${encodeURIComponent(data.name)}%0A`,
        data.company ? `Perusahaan: ${encodeURIComponent(data.company)}%0A` : '',
        `Email: ${encodeURIComponent(data.email)}%0A`,
        `Telepon: ${encodeURIComponent(data.phone)}%0A`,
        `Layanan: ${encodeURIComponent(data.service)}%0A%0A`,
        `Pesan: ${encodeURIComponent(data.message)}`
      ].join('');

      if (isDev()) {
        console.log('[LMI Lead]', data);
      }

      const waUrl = `https://wa.me/6281298904311?text=${waText}`;
      const newWindow = window.open(waUrl, '_blank', 'noopener,noreferrer');

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        if (formAlertError) {
          formAlertError.removeAttribute('hidden');
          formAlertError.innerHTML = `
            <p>⚠️ Popup WhatsApp diblokir oleh browser. Silakan:</p>
            <ol>
              <li>Izinkan popup untuk website ini di pengaturan browser, atau</li>
              <li><a href="${waUrl}" target="_blank" rel="noopener noreferrer">Klik di sini untuk buka WhatsApp manual</a></li>
            </ol>
            <button type="button" class="btn btn-ghost" onclick="this.parentElement.setAttribute('hidden', '')">Tutup</button>
          `;
          formAlertError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      clearDraft();
      formWrapper.classList.add('submitted');
      if (formAlertError) formAlertError.setAttribute('hidden', '');
      formSuccess.removeAttribute('hidden');
      formSuccess.focus();
    });
  };

  // ========= 10. BACK TO TOP =========
  const initBackToTop = () => {
    const backTop = $('#backTop');
    if (!backTop) return;

    backTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });
    });

    backTop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        backTop.click();
      }
    });
  };

  // ========= 11. FAQ ACCORDION =========
  const initFAQ = () => {
    const faqItems = $$('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const summary = item.querySelector('.faq-summary');
      if (!summary) return;

      item.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', String(item.open));
      });
    });
  };

  // ========= 12. SECURE EXTERNAL LINKS =========
  const initSecureLinks = () => {
    $$('a[target="_blank"]').forEach((a) => {
      const rel = a.getAttribute('rel') || '';
      if (!rel.includes('noopener')) {
        a.setAttribute('rel', `${rel} noopener noreferrer`.trim());
      }
    });
  };

  // ========= 13. PERFORMANCE OPTIMIZATIONS =========
  const initPerformance = () => {
    const lazyImages = $$('img[data-src]');
    if (lazyImages.length) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            imageObserver.unobserve(img);
          }
        });
      });
      lazyImages.forEach((img) => imageObserver.observe(img));
    }

    $$('a[href]').forEach((link) => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/') && !href.includes('.')) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'prefetch';
          preloadLink.href = href;
          document.head.appendChild(preloadLink);
        }
      }, { once: true });
    });
  };

  // ========= 14. PROCESS FLOW & SOP TIMELINE STAGGER =========
  const initProcessFlow = () => {
    const processSteps = $$('.process-step');
    if (processSteps.length) {
      const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processSteps.forEach((step, index) => {
              setTimeout(() => step.classList.add('visible'), index * 100);
            });
            processObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      const processFlow = $('.process-flow');
      if (processFlow) processObserver.observe(processFlow);
    }

    const timelineItems = $$('.timeline-item');
    if (timelineItems.length) {
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timelineItems.forEach((item, index) => {
              setTimeout(() => item.classList.add('visible'), index * 150);
            });
            timelineObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      const sopTimeline = $('.sop-timeline');
      if (sopTimeline) timelineObserver.observe(sopTimeline);
    }
  };

  // ========= 15. CONSOLE SIGNATURE =========
  const initConsoleSignature = () => {
    if (typeof console === 'undefined' || !console.log) return;
    if (!isDev()) return;

    console.log(
      '%c PT Laksamana Martapura Indonesia %c v2.2.0 ',
      'background:#0B2447;color:#C9A84C;font-size:14px;padding:6px 12px;border-radius:4px 0 0 4px;font-weight:bold;',
      'background:#C9A84C;color:#0B2447;font-size:14px;padding:6px 12px;border-radius:0 4px 4px 0;font-weight:bold;'
    );
    console.log(
      '%c Premium Corporate Website ',
      'color:#C9A84C;font-weight:600;font-size:12px;'
    );
  };

  // ========= 16. GALLERY FILTER =========
const initGalleryFilter = () => {
  const filters = $$('.gallery-filter');
  const items   = $$('.gallery-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });
};

  // ========= INITIALIZATION =========
  const init = () => {
    initLoader();
    initThemeToggle();
    initNavbarScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCounterAnimation();
    initTestimonialSlider();
    initContactForm();
    initBackToTop();
    initFAQ();
    initSecureLinks();
    initProcessFlow();
    initGalleryFilter();

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initPerformance();
        initConsoleSignature();
      });
    } else {
      setTimeout(() => {
        initPerformance();
        initConsoleSignature();
      }, 1000);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();