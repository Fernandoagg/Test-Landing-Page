document.addEventListener("DOMContentLoaded", () => {
  // 1. Navegación móvil accesible
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", String(!isExpanded));
      mobileMenu.classList.toggle("hidden");
      hamburgerIcon?.classList.toggle("hidden");
      closeIcon?.classList.toggle("hidden");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        hamburgerIcon?.classList.remove("hidden");
        closeIcon?.classList.add("hidden");
      });
    });
  }

  // 2. Selector de Especialidades (Tabs accesibles)
  const tabTriggers = document.querySelectorAll("[role='tab']");
  const tabPanels = document.querySelectorAll("[role='tabpanel']");
  const tabDots = document.querySelectorAll("#tab-dots .tab-dot");
  const tabList = document.querySelector("[role='tablist']");

  // direction: 1 = siguiente, -1 = anterior (define el lado desde el que entra la ficha)
  function selectTab(targetId, direction = 0) {
    tabTriggers.forEach((btn, i) => {
      const isMatch = btn.getAttribute("aria-controls") === targetId;
      btn.setAttribute("aria-selected", String(isMatch));
      btn.classList.toggle("is-active", isMatch);
      tabDots[i]?.classList.toggle("is-active", isMatch);

      // Mantener visible la pestaña activa en la fila deslizable de móvil
      if (isMatch && tabList && tabList.scrollWidth > tabList.clientWidth) {
        const offset = btn.getBoundingClientRect().left - tabList.getBoundingClientRect().left;
        tabList.scrollTo({ left: tabList.scrollLeft + offset - 16, behavior: "smooth" });
      }
    });

    tabPanels.forEach((panel) => {
      const isMatch = panel.id === targetId;
      panel.classList.toggle("hidden", !isMatch);
      if (isMatch) {
        panel.style.setProperty("--panel-dx", `${direction * 16}px`);
        panel.classList.remove("panel-enter");
        void panel.offsetWidth; // reinicia la animación
        panel.classList.add("panel-enter");
      }
    });
  }

  function selectTabByOffset(step) {
    const tabsArray = Array.from(tabTriggers);
    const current = tabsArray.findIndex((btn) => btn.getAttribute("aria-selected") === "true");
    const next = (current + step + tabsArray.length) % tabsArray.length;
    selectTab(tabsArray[next].getAttribute("aria-controls"), step);
  }

  // Gesto de deslizar sobre la ficha (móvil)
  const tabPanelsBox = document.getElementById("tab-panels");
  if (tabPanelsBox) {
    let startX = 0;
    let startY = 0;

    tabPanelsBox.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    tabPanelsBox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        selectTabByOffset(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  tabTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabsArray = Array.from(tabTriggers);
      const current = tabsArray.findIndex((t) => t.getAttribute("aria-selected") === "true");
      const panelId = btn.getAttribute("aria-controls");
      if (panelId) selectTab(panelId, Math.sign(tabsArray.indexOf(btn) - current));
    });

    // Soporte teclado (flechas izquierda/derecha)
    btn.addEventListener("keydown", (e) => {
      const tabsArray = Array.from(tabTriggers);
      const currentIndex = tabsArray.indexOf(btn);
      let nextIndex = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % tabsArray.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabsArray[nextIndex].focus();
        const panelId = tabsArray[nextIndex].getAttribute("aria-controls");
        if (panelId) selectTab(panelId, nextIndex > currentIndex ? 1 : -1);
      }
    });
  });

  // 3. Acordeón accesible de Preguntas Frecuentes
  // La altura se anima con grid-template-rows (ver .faq-content en style.css)
  const faqButtons = document.querySelectorAll(".faq-trigger");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      const content = document.getElementById(panelId);
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Cerrar otros acordeones si se desea mantener uno solo abierto
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherContent = document.getElementById(otherBtn.getAttribute("aria-controls"));
          if (otherContent) otherContent.classList.remove("is-open");
        }
      });

      // Alternar estado actual
      btn.setAttribute("aria-expanded", String(!isExpanded));
      if (content) {
        content.classList.toggle("is-open", !isExpanded);
      }
    });
  });

  // 3.1 Mini ejercicio de la tarjeta de lección
  const quiz = document.getElementById("hero-quiz");
  if (quiz) {
    const options = quiz.querySelectorAll(".quiz-option");
    const feedback = quiz.querySelector(".quiz-feedback");
    const progress = document.querySelector(".quiz-progress");

    options.forEach((option) => {
      option.addEventListener("click", () => {
        const isCorrect = option.dataset.correct === "true";
        if (feedback) {
          feedback.textContent = option.dataset.feedback || "";
          feedback.classList.toggle("is-correct", isCorrect);
          feedback.classList.toggle("is-wrong", !isCorrect);
        }

        if (isCorrect) {
          option.classList.add("is-correct");
          options.forEach((o) => { o.disabled = true; });
          if (progress) progress.style.width = "80%";
        } else {
          option.classList.add("is-wrong");
          option.disabled = true;
        }
      });
    });
  }

  // 3.2 Barra fija de propuesta en móvil: oculta mientras se ven el hero, el formulario o el footer
  const mobileCta = document.getElementById("mobile-cta");
  const ctaHideZones = ["hero", "formulario"].map((id) => document.getElementById(id))
    .concat(document.querySelector("footer"))
    .filter(Boolean);

  if (mobileCta && ctaHideZones.length && "IntersectionObserver" in window) {
    const visibleZones = new Set();
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleZones.add(entry.target);
        else visibleZones.delete(entry.target);
      });
      const show = visibleZones.size === 0;
      mobileCta.classList.toggle("is-shown", show);
      mobileCta.setAttribute("aria-hidden", String(!show));
      if (show) {
        mobileCta.removeAttribute("inert");
      } else {
        mobileCta.setAttribute("inert", "");
      }
      mobileCta.inert = !show;
    });
    ctaHideZones.forEach((zone) => ctaObserver.observe(zone));
  }

  // 3.3 Movimiento sutil: entrada al hacer scroll, línea de pasos y contador del hero
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal, .draw-line");
  const counters = document.querySelectorAll("[data-count]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    // Cada elemento aparece una sola vez
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach((el) => revealObserver.observe(el));

    // El HTML ya contiene el valor final; aquí solo se anima de 0 a ese valor
    const animateCount = (el) => {
      const target = Number(el.dataset.count);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  }

  // 4. Validación del Formulario de Solicitud Institucional
  // NOTA TÉCNICA: El envío real mediante servicio backend (PHP / API de correo)
  // se conectará en el entorno de producción. Por regla del proyecto, no se simula
  // un estado de éxito ficticio al cliente.
  const form = document.getElementById("proposal-form");
  const formFeedback = document.getElementById("form-feedback");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-70", "cursor-not-allowed");
      }

      if (formFeedback) {
        formFeedback.classList.remove("hidden");
        formFeedback.innerHTML = `
          <div class="p-4 rounded-lg bg-marino-light border border-marino-border text-tinta text-sm leading-relaxed">
            <p class="font-semibold text-marino mb-1">Información validada localmente</p>
            <p>Los datos requeridos fueron completados correctamente. El endpoint de procesamiento y envío por correo quedará habilitado al vincular el servicio de producción (PHP / servidor de correo del cliente).</p>
          </div>
        `;
        formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // 5. Desplazamiento suave compensando la barra de navegación fija
  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = document.querySelector("header")?.offsetHeight || 72;
          const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
          window.scrollTo({
            top: targetTop,
            behavior: "smooth"
          });
        }
      }
    });
  });
});
