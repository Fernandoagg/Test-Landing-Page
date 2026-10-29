document.addEventListener("DOMContentLoaded", () => {
      
      // 1. Menú Móvil Hamburguesa
      const mobileMenuBtn = document.getElementById("mobile-menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      const hamburgerIcon = document.getElementById("hamburger-icon");
      const closeIcon = document.getElementById("close-icon");

      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
          const isClosed = mobileMenu.classList.contains("hidden");
          if (isClosed) {
            mobileMenu.classList.remove("hidden");
            hamburgerIcon.classList.add("hidden");
            closeIcon.classList.remove("hidden");
          } else {
            mobileMenu.classList.add("hidden");
            hamburgerIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
          }
        });

        // Cerrar menú al hacer clic en cualquier enlace
        mobileMenu.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            hamburgerIcon.classList.remove("hidden");
            closeIcon.classList.add("hidden");
          });
        });
      }

      // 2. Especialidades: Pestañas Interactivas Dinámicas
      const tabButtons = document.querySelectorAll(".tab-btn");
      const tabPanels = document.querySelectorAll(".tab-panel");
      const cardSwitchButtons = document.querySelectorAll(".card-switch-tab");

      function switchTab(tabId) {
        // Actualizar estado botones de pestañas
        tabButtons.forEach(btn => {
          const isCurrent = btn.getAttribute("data-tab") === tabId;
          if (isCurrent) {
            btn.classList.add("tab-active", "bg-tinta", "text-white");
            btn.classList.remove("bg-white", "text-tinta");
          } else {
            btn.classList.remove("tab-active", "bg-tinta", "text-white");
            btn.classList.add("bg-white", "text-tinta");
          }
        });

        // Ocultar / Mostrar paneles
        tabPanels.forEach(panel => {
          if (panel.id === `panel-${tabId}`) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });
      }

      tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          const tab = btn.getAttribute("data-tab");
          if (tab) switchTab(tab);
        });
      });

      // Conexión desde las tarjetas resumen inferiores a las pestañas superiores
      cardSwitchButtons.forEach(cardBtn => {
        cardBtn.addEventListener("click", () => {
          const tab = cardBtn.getAttribute("data-switch");
          if (tab) {
            switchTab(tab);
            const especialidadesSection = document.getElementById("especialidades");
            if (especialidadesSection) {
              const headerOffset = 90;
              const elementPosition = especialidadesSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
          }
        });
      });

      // 3. FAQ Acordeón Interactivo
      const faqCards = document.querySelectorAll("#preguntas .bg-white");
      faqCards.forEach((card, idx) => {
        const header = card.querySelector(".cursor-pointer");
        const answer = card.querySelector(".mt-3");
        const icon = card.querySelector(".w-7, .w-8");
        
        if (header && answer && icon) {
          if (idx !== 0) {
            answer.style.display = "none";
            icon.textContent = "+";
          } else {
            answer.style.display = "block";
            icon.textContent = "×";
          }

          header.addEventListener("click", () => {
            const isOpen = answer.style.display === "block";
            
            // Cerrar todos
            faqCards.forEach(c => {
              const a = c.querySelector(".mt-3");
              const ic = c.querySelector(".w-7, .w-8");
              if (a) a.style.display = "none";
              if (ic) ic.textContent = "+";
            });

            // Abrir seleccionado si estaba cerrado
            if (!isOpen) {
              answer.style.display = "block";
              icon.textContent = "×";
            }
          });
        }
      });

      // 4. Envío de Formulario con Estado de Éxito
      const form = document.querySelector("#formulario form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const btn = form.querySelector("button[type=submit]");
          const originalText = btn.innerHTML;
          btn.innerHTML = "Enviando solicitud...";
          btn.style.opacity = "0.7";
          btn.disabled = true;

          setTimeout(() => {
            const formContainer = form.closest(".bg-white");
            if (formContainer) {
              formContainer.innerHTML = `
                <div style="text-align: center; padding: 36px 16px;">
                  <div style="width: 58px; height: 58px; border-radius: 50%; background: #c9f45c; color: #17132b; font-weight: 800; font-size: 28px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 10px 25px -5px rgba(201, 244, 92, 0.5);">✓</div>
                  <h3 style="font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 24px; color: #17132b; margin-bottom: 10px;">¡Solicitud recibida con éxito!</h3>
                  <p style="font-size: 14px; color: #5d5873; max-width: 440px; margin: 0 auto 24px; line-height: 1.6;">
                    Recibimos la información de tu organización. Un asesor corporativo preparará la propuesta con la cotización ajustada a tu grupo.
                  </p>
                  <div style="display: inline-block; padding: 8px 16px; background: #ede6ff; color: #6b3cff; border-radius: 999px; font-size: 12px; font-weight: 700;">
                    Atención de Lunes a Viernes 8:00 a 18:00 hrs (GMT-6)
                  </div>
                </div>
              `;
            }
          }, 600);
        });
      }

      // 5. Scroll suave compensando el sticky navbar
      document.querySelectorAll("a[href^='#']").forEach(link => {
        link.addEventListener("click", (e) => {
          const targetId = link.getAttribute("href");
          if (targetId && targetId !== "#") {
            const target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              const headerOffset = window.innerWidth < 640 ? 70 : 90;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
          }
        });
      });

    });
