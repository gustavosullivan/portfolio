(() => {
  // smooth header shadow on scroll
  const header = document.querySelector(".header");
  if (!header) return;

  const onScroll = () => {
    header.style.background =
      window.scrollY > 20 ? "rgba(5, 7, 13, 0.72)" : "rgba(5, 7, 13, 0.35)";
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
