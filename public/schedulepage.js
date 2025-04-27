document.addEventListener("DOMContentLoaded", () => {
  // Handle switching between different days
  const dayButtons = document.querySelectorAll(".day-btn");

  dayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove the active style from all buttons
      dayButtons.forEach((btn) => btn.classList.remove("active"));

      // Highlight the button that was clicked
      this.classList.add("active");

      // Update the page header with the selected day's info
      const dayName = this.querySelector(".day-name").textContent;
      const dayDate = this.querySelector(".day-date").textContent;

      document.querySelector(".section-title").textContent = `${dayName}, June ${dayDate}, 2023`;
    });
  });

  // Allow users to move between months on the calendar
  const prevMonthBtn = document.querySelector(".calendar-controls .btn:first-child");
  const nextMonthBtn = document.querySelector(".calendar-controls .btn:last-child");
  const currentMonthEl = document.querySelector(".current-month");

  if (prevMonthBtn && nextMonthBtn && currentMonthEl) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    let currentMonthIndex = months.indexOf("June");
    let currentYear = 2023;

    prevMonthBtn.addEventListener("click", () => {
      // Go to the previous month
      currentMonthIndex--;
      if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        currentYear--;
      }
      currentMonthEl.textContent = `${months[currentMonthIndex]} ${currentYear}`;
    });

    nextMonthBtn.addEventListener("click", () => {
      // Move to the next month
      currentMonthIndex++;
      if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
      }
      currentMonthEl.textContent = `${months[currentMonthIndex]} ${currentYear}`;
    });
  }

  // Allow users to set reminders for debates
  const reminderButtons = document.querySelectorAll(".btn-primary.btn-sm");

  reminderButtons.forEach((button) => {
    if (button.textContent.includes("Set Reminder")) {
      button.addEventListener("click", function () {
        this.innerHTML = '<i class="fas fa-check"></i> Reminder Set';
        this.classList.add("reminder-set");

        // (In a real app, we'd schedule a notification for the debate)
        alert("Reminder set! You will be notified when this debate goes live.");
      });
    }
  });

  // Allow users to add debates to their calendar
  const calendarButtons = document.querySelectorAll(".btn-outline.btn-sm");

  calendarButtons.forEach((button) => {
    if (button.textContent.includes("Add to Calendar")) {
      button.addEventListener("click", () => {
        // (In a real app, this would create and download a calendar event file)
        alert("Calendar event created! Check your downloads folder for the .ics file.");
      });
    }
  });

  // Allow users to filter debates by tags
  const filterTags = document.querySelectorAll(".filter-tag");

  filterTags.forEach((tag) => {
    tag.addEventListener("click", function () {
      // Remove active highlight from all tags
      filterTags.forEach((t) => t.classList.remove("active"));
      // Highlight the selected tag
      this.classList.add("active");

      // (In a real app, we'd filter the list of debates shown)
      alert(`Filtering debates by: ${this.textContent}`);
    });
  });

  // Search for debates by keyword
  const searchBox = document.querySelector(".search-box");

  if (searchBox) {
    const searchInput = searchBox.querySelector("input");
    const searchButton = searchBox.querySelector(".btn");

    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        // (In a real app, we'd actually perform a search)
        alert(`Searching for: ${searchTerm}`);
      }
    });

    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.trim();
        if (searchTerm) {
          // (In a real app, we'd actually perform a search)
          alert(`Searching for: ${searchTerm}`);
        }
      }
    });
  }

  // Handle newsletter/email subscriptions
  const subscribeForm = document.querySelector(".subscribe-form");

  if (subscribeForm) {
    const emailInput = subscribeForm.querySelector("input");
    const subscribeButton = subscribeForm.querySelector(".btn");

    subscribeButton.addEventListener("click", () => {
      const email = emailInput.value.trim();

      if (email && isValidEmail(email)) {
        // (In a real app, we'd send this email to our server)
        alert(`Thank you for subscribing with: ${email}`);
        emailInput.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });

    // Helper function to validate email format
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  }
});
