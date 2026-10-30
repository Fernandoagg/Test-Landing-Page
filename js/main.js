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

  function selectTab(targetId) {
    tabTriggers.forEach((btn) => {
      const isMatch = btn.getAttribute("aria-controls") === targetId;
      btn.setAttribute("aria-selected", String(isMatch));
      if (isMatch) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });

    tabPanels.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });
  }

  tabTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      if (panelId) selectTab(panelId);
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
        if (panelId) selectTab(panelId);
      }
    });
  });

  // 3. Acordeón accesible de Preguntas Frecuentes
  const faqButtons = document.querySelectorAll(".faq-trigger");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      const content = document.getElementById(panelId);
      const icon = btn.querySelector(".faq-icon");
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Cerrar otros acordeones si se desea mantener uno solo abierto
      faqButtons.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherPanelId = otherBtn.getAttribute("aria-controls");
          const otherContent = document.getElementById(otherPanelId);
          const otherIcon = otherBtn.querySelector(".faq-icon");
          if (otherContent) otherContent.classList.add("hidden");
          if (otherIcon) otherIcon.textContent = "+";
        }
      });

      // Alternar estado actual
      btn.setAttribute("aria-expanded", String(!isExpanded));
      if (content) {
        content.classList.toggle("hidden");
      }
      if (icon) {
        icon.textContent = isExpanded ? "+" : "−";
      }
    });
  });

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
          <div class="p-4 rounded-lg bg-violeta-light border border-violeta-border text-tinta text-sm leading-relaxed">
            <p class="font-semibold text-violeta mb-1">Información validada localmente</p>
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
