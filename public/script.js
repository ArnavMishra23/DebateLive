// Shared JavaScript for all pages
document.addEventListener("DOMContentLoaded", () => {
  
  // Handle opening and closing the mobile navigation menu
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      // Show or hide the nav links
      nav.classList.toggle("open");

      // Animate the hamburger icon into an X when menu is open
      const spans = menuToggle.querySelectorAll("span");
      spans.forEach((span) => span.classList.toggle("active"));
    });
  }

  // Highlight the current page link in the navigation
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    }
  });

  // Trigger animations when elements scroll into view
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  if (animateElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class once element is visible
            entry.target.classList.add("animate");
            // Stop observing once animated (no need to animate again)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }, // Trigger when 10% of the element is visible
    );

    animateElements.forEach((element) => {
      observer.observe(element);
    });
  }
});
