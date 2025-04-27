document.addEventListener("DOMContentLoaded", () => {
  // Handle FAQ expand/collapse
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      faqItem.classList.toggle("active");

      // Close any other open FAQ items
      document.querySelectorAll(".faq-item.active").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
        }
      });
    });
  });

  // Handle contact form submission
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Grab form input values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Normally, you'd send this data to your server here
      // For now, just show a success alert
      alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);

      // Clear the form after submission
      contactForm.reset();
    });
  }
});
