(() => {
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.style.background =
        window.scrollY > 20 ? "rgba(5, 7, 13, 0.72)" : "rgba(5, 7, 13, 0.35)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Stack parents: hover (CSS) + click/tap toggle
  const parents = document.querySelectorAll("[data-tech-parent]");
  parents.forEach((parent) => {
    const btn = parent.querySelector(".stack-tech__main");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const willOpen = !parent.classList.contains("is-open");

      parents.forEach((other) => {
        if (other === parent) return;
        other.classList.remove("is-open");
        const otherBtn = other.querySelector(".stack-tech__main");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      parent.classList.toggle("is-open", willOpen);
      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-tech-parent]")) return;
    parents.forEach((parent) => {
      parent.classList.remove("is-open");
      const btn = parent.querySelector(".stack-tech__main");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });
})();
