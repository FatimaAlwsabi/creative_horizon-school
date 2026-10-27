// قائمة الهاتف + تأثيرات الظهور + أرقام الإحصائيات + نموذج التواصل
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      menuButton.classList.toggle("menu-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        menuButton.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  // إظهار العناصر تدريجيًا عندما تدخل الشاشة
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("revealed"));
  }

  // تحريك أرقام الإحصائيات
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1300;
        const startTime = performance.now();
        const update = now => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-US") + (target >= 100 ? "+" : "+");
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(counter => counterObserver.observe(counter));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // نموذج واجهة فقط، لا يرسل البيانات إلى الإنترنت
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (form && status) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = form.elements.name.value.trim();
      status.textContent = `شكرًا ${name}، تم التحقق من النموذج بنجاح. لفعالية الإرسال الحقيقية اربطي النموذج بخادم أو خدمة بريد.`;
      status.classList.add("status-visible");
      form.reset();
    });
  }
});