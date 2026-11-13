document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // Barra de anuncio: se puede cerrar y no reaparece durante la sesión
  const announceBar = document.getElementById("announce-bar");
  const announceClose = document.getElementById("announce-close");
  try {
    if (sessionStorage.getItem("announce-closed") === "1") announceBar?.remove();
  } catch (_) { /* almacenamiento no disponible: la barra se queda */ }

  announceClose?.addEventListener("click", () => {
    announceBar?.remove();
    try { sessionStorage.setItem("announce-closed", "1"); } catch (_) { /* sin almacenamiento */ }
  });

  // 2. Selector de Especialidades (Tabs accesibles con color propio)
  const tabTriggers = document.querySelectorAll("[role='tab']");
  const tabPanels = document.querySelectorAll("[role='tabpanel']");
  const tabDots = document.querySelectorAll("#tab-dots .tab-dot");
  const tabList = document.querySelector("[role='tablist']");

  // Última ficha elegida por el usuario (la de carga inicial no cuenta)
  let chosenPanelId = null;

  // direction: 1 = siguiente, -1 = anterior (define el lado desde el que entra la ficha)
  function selectTab(targetId, direction = 0) {
    chosenPanelId = targetId;
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

  // Botones externos que abren directamente una pestaña específica (ej. Promo Turismo Corto)
  document.querySelectorAll("[data-open-tab]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetPanelId = trigger.getAttribute("data-open-tab");
      if (targetPanelId) {
        selectTab(targetPanelId, 1);
        const tabPanelsEl = document.getElementById("tab-panels");
        if (tabPanelsEl) {
          const headerHeight = document.querySelector("header")?.offsetHeight || 72;
          const top = tabPanelsEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

  // Preselección automática de especialidad en el formulario desde botones de promo
  document.querySelectorAll("[data-select-specialty]").forEach((cta) => {
    cta.addEventListener("click", () => {
      const val = cta.getAttribute("data-select-specialty");
      const selectEl = document.getElementById("f-especialidad");
      if (val && selectEl) {
        selectEl.value = val;
      }
    });
  });

  // Barra fija de móvil: si el usuario ya eligió una ficha, el formulario llega con esa especialidad
  // (los id de panel coinciden con los value del select: panel-turismo-corto → turismo-corto)
  document.querySelector("#mobile-cta a[href='#formulario']")?.addEventListener("click", () => {
    const selectEl = document.getElementById("f-especialidad");
    if (chosenPanelId && selectEl && !selectEl.value) {
      selectEl.value = chosenPanelId.replace("panel-", "");
    }
  });

  // 3. Acordeón accesible de Preguntas Frecuentes
  // La altura se anima con grid-template-rows (ver .faq-content en style.css)
  const faqButtons = document.querySelectorAll(".faq-trigger");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      const content = document.getElementById(panelId);
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Cerrar otros acordeones para mantener uno solo abierto
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

  // 4. Tarjeta de lección: rotación entre 4 especialidades cada 6 s (fade, sin rotación)
  // Sin cambio automático si prefers-reduced-motion
  const lessonCard = document.getElementById("lesson-card");
  const heroQuiz = document.getElementById("hero-quiz");

  const SCENES = [
    {
      sector: "Negocios",
      title: "Lección 2 · Reunión de seguimiento",
      leftLabel: "Colleague",
      leftText: "Could we review the quarterly report this afternoon?",
      rightLabel: "You",
      rightText: "Sure, let's schedule a follow-up meeting at 3 PM.",
      prompt: "Elija la respuesta adecuada del colega:",
      options: [
        { text: "I don't know what you say.", feedback: "Informal e inapropiado para el entorno corporativo." },
        { text: "Perfect. I'll send the calendar invite right away.", correct: true, feedback: "Correcto. Es una respuesta profesional y eficiente." },
        { text: "Meeting tomorrow yes.", feedback: "La estructura gramatical no es adecuada." }
      ]
    },
    {
      sector: "Turismo",
      title: "Lección 4 · Atención al cliente",
      leftLabel: "Agent",
      leftText: "Good afternoon. How may I help you today?",
      rightLabel: "Customer",
      rightText: "I'd like to change my reservation, please.",
      prompt: "Elija la respuesta adecuada del agente:",
      options: [
        { text: "What do you want?", feedback: "Se entiende, pero es poco cortés para atención al cliente." },
        { text: "Of course. May I have your name, please?", correct: true, feedback: "Correcto. Es una respuesta cortés y profesional." },
        { text: "Yes, I am change it now.", feedback: "La estructura no es correcta. Intente con otra opción." }
      ]
    },
    {
      sector: "Gastronomía",
      title: "Lección 3 · Servicio en sala",
      leftLabel: "Server",
      leftText: "Good evening. Are you ready to order?",
      rightLabel: "Guest",
      rightText: "Could you tell me more about today's special, please?",
      prompt: "Elija la respuesta adecuada del mesero:",
      options: [
        { text: "It has meat and things.", feedback: "Demasiado informal y poco descriptivo." },
        { text: "Certainly. It's grilled salmon served with seasonal vegetables.", correct: true, feedback: "Correcto. Describe el platillo con cortesía y claridad profesional." },
        { text: "You read the menu.", feedback: "Inadecuado y descortés con el comensal." }
      ]
    },
    {
      sector: "Medicina",
      title: "Lección 5 · Consulta inicial",
      leftLabel: "Doctor",
      leftText: "Hello. What brings you in today?",
      rightLabel: "Patient",
      rightText: "I've had a persistent headache since yesterday.",
      prompt: "Elija la respuesta adecuada del médico:",
      options: [
        { text: "Take pills now.", feedback: "Respuesta incompleta y poco profesional." },
        { text: "I understand. Can you describe where the pain is located?", correct: true, feedback: "Correcto. Es una pregunta clínica precisa y empática." },
        { text: "Headache is bad thing.", feedback: "La formulación gramatical no es profesional." }
      ]
    }
  ];

  if (lessonCard) {
    let currentScene = 1; // Inicia en Turismo (índice 1) como en la maqueta inicial
    const sceneContainer = lessonCard.querySelector(".scene");
    const titleEl = lessonCard.querySelector("[data-scene='title']");
    const sectorEl = lessonCard.querySelector("[data-scene='sector']");
    const leftLabelEl = lessonCard.querySelector("[data-scene='left-label']");
    const leftTextEl = lessonCard.querySelector("[data-scene='left-text']");
    const rightLabelEl = lessonCard.querySelector("[data-scene='right-label']");
    const rightTextEl = lessonCard.querySelector("[data-scene='right-text']");
    const promptEl = lessonCard.querySelector("[data-scene='prompt']");
    const optionsContainer = lessonCard.querySelector("[data-scene='options']");
    const feedbackEl = lessonCard.querySelector(".quiz-feedback");
    const progressEl = lessonCard.querySelector(".quiz-progress");
    const sceneDots = lessonCard.querySelectorAll(".scene-dot");

    function renderScene(index) {
      const data = SCENES[index];
      if (!data) return;

      if (titleEl) titleEl.textContent = data.title;
      if (sectorEl) sectorEl.textContent = data.sector;
      if (leftLabelEl) leftLabelEl.textContent = data.leftLabel;
      if (leftTextEl) leftTextEl.textContent = data.leftText;
      if (rightLabelEl) rightLabelEl.textContent = data.rightLabel;
      if (rightTextEl) rightTextEl.textContent = data.rightText;
      if (promptEl) promptEl.textContent = data.prompt;

      if (optionsContainer) {
        optionsContainer.innerHTML = data.options.map((opt) => `
          <button type="button" class="quiz-option"${opt.correct ? ' data-correct="true"' : ''} data-feedback="${opt.feedback}">
            ${opt.text}
          </button>
        `).join("");
      }

      if (feedbackEl) {
        feedbackEl.textContent = "";
        feedbackEl.className = "quiz-feedback text-xs mt-3 min-h-[1rem]";
      }

      if (progressEl) {
        progressEl.style.width = "60%";
      }

      sceneDots.forEach((dot, i) => {
        dot.setAttribute("aria-pressed", String(i === index));
      });
    }

    function goToScene(nextIndex) {
      if (nextIndex === currentScene) return;
      currentScene = nextIndex;

      if (prefersReducedMotion || !sceneContainer) {
        renderScene(currentScene);
        return;
      }

      sceneContainer.classList.add("is-fading");
      setTimeout(() => {
        renderScene(currentScene);
        sceneContainer.classList.remove("is-fading");
      }, 250);
    }

    // Selector manual con botones dot
    sceneDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const idx = Number(dot.dataset.index);
        if (!Number.isNaN(idx)) {
          goToScene(idx);
          restartInterval();
        }
      });
    });

    // Delegación de eventos para las opciones del mini ejercicio
    if (heroQuiz) {
      heroQuiz.addEventListener("click", (e) => {
        const option = e.target.closest(".quiz-option");
        if (!option || option.disabled) return;

        const isCorrect = option.dataset.correct === "true";
        if (feedbackEl) {
          feedbackEl.textContent = option.dataset.feedback || "";
          feedbackEl.classList.toggle("is-correct", isCorrect);
          feedbackEl.classList.toggle("is-wrong", !isCorrect);
        }

        if (isCorrect) {
          option.classList.add("is-correct");
          heroQuiz.querySelectorAll(".quiz-option").forEach((o) => { o.disabled = true; });
          if (progressEl) progressEl.style.width = "80%";
        } else {
          option.classList.add("is-wrong");
          option.disabled = true;
        }

        restartInterval();
      });
    }

    // Rotación automática cada 6 segundos (solo si el usuario no tiene reducción de movimiento)
    let rotationTimer = null;

    function startInterval() {
      if (prefersReducedMotion) return;
      stopInterval();
      rotationTimer = setInterval(() => {
        const next = (currentScene + 1) % SCENES.length;
        goToScene(next);
      }, 6000);
    }

    function stopInterval() {
      if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
      }
    }

    function restartInterval() {
      stopInterval();
      startInterval();
    }

    // Pausar rotación al interactuar directamente con la tarjeta
    lessonCard.addEventListener("mouseenter", stopInterval);
    lessonCard.addEventListener("mouseleave", startInterval);
    lessonCard.addEventListener("focusin", stopInterval);
    lessonCard.addEventListener("focusout", startInterval);

    startInterval();
  }

  // 5. Barra fija de propuesta en móvil: oculta mientras se ven el hero, el formulario o el footer
  const mobileCta = document.getElementById("mobile-cta");
  const whatsappFloat = document.getElementById("whatsapp-float");
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
      if (whatsappFloat) {
        whatsappFloat.classList.toggle("has-mobile-cta", show);
      }
    });
    ctaHideZones.forEach((zone) => ctaObserver.observe(zone));
  }

  // 6. Movimiento sutil: entrada al hacer scroll, línea de pasos y contador del hero (solo 4 y 5)
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

    // Animar contadores con data-count (solo 4 y 5 en hero; 60-80 se mantiene fijo)
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

  // 7. Validación del Formulario de Solicitud Institucional
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
          <div class="p-4 rounded-btn bg-teal-claro border border-teal/20 text-tinta text-sm leading-relaxed">
            <p class="font-semibold text-teal mb-1">Información validada localmente</p>
            <p>Los datos requeridos fueron completados correctamente. El endpoint de procesamiento y envío por correo quedará habilitado al vincular el servicio de producción (PHP / servidor de correo del cliente).</p>
          </div>
        `;
        formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // 8. Desplazamiento suave compensando la barra de navegación fija
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
