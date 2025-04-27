document.addEventListener("DOMContentLoaded", () => {
  // Set default styles for all charts
  Chart.defaults.font.family = "'Open Sans', sans-serif";
  Chart.defaults.color = "#666";

  // Color palette for charts
  const COLORS = ['#3a5dd9', '#2c3e50', '#e74c3c', '#2ecc71', '#f39c12'];

  // -------------------------------
  // Popular Topics Chart (Bar Chart)
  // -------------------------------
  const topicsCtx = document.getElementById("topicsChart");
  if (topicsCtx) {
    const topicData = [
      { topic: "Climate Change", engagements: 8500 },
      { topic: "Artificial Intelligence", engagements: 7200 },
      { topic: "Economic Policy", engagements: 6300 },
      { topic: "Healthcare Reform", engagements: 5800 },
      { topic: "Education Systems", engagements: 4900 }
    ];

    new Chart(topicsCtx, {
      type: "bar",
      data: {
        labels: topicData.map(item => item.topic),
        datasets: [{
          label: "Engagements",
          data: topicData.map(item => item.engagements),
          backgroundColor: COLORS[0],
          borderColor: COLORS[0],
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y', // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Most Popular Debate Topics" },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // -------------------------------
  // Demographics Chart (Pie Chart)
  // -------------------------------
  const demographicsCtx = document.getElementById("demographicsChart");
  if (demographicsCtx) {
    const demographicsData = [
      { name: "18-24", value: 25 },
      { name: "25-34", value: 35 },
      { name: "35-44", value: 20 },
      { name: "45-54", value: 15 },
      { name: "55+", value: 5 },
    ];

    new Chart(demographicsCtx, {
      type: "pie",
      data: {
        labels: demographicsData.map(item => item.name),
        datasets: [{
          label: "Age Demographics",
          data: demographicsData.map(item => item.value),
          backgroundColor: COLORS,
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Viewer Age Demographics (%)" },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
      },
    });
  }

  // -------------------------------
  // Platform Usage Chart (Doughnut)
  // -------------------------------
  const platformsCtx = document.getElementById("platformsChart");
  if (platformsCtx) {
    const platformData = [
      { name: "Desktop", value: 45 },
      { name: "Mobile", value: 35 },
      { name: "Tablet", value: 15 },
      { name: "Smart TV", value: 5 }
    ];

    new Chart(platformsCtx, {
      type: "doughnut",
      data: {
        labels: platformData.map(item => item.name),
        datasets: [{
          label: "Platform Usage",
          data: platformData.map(item => item.value),
          backgroundColor: COLORS,
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Engagement by Platform (%)" },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
      },
    });
  }

  // -------------------------------
  // Debate Outcomes Chart (Pie Chart)
  // -------------------------------
  const outcomesCtx = document.getElementById("outcomesChart");
  if (outcomesCtx) {
    const outcomeData = [
      { name: "Win", value: 35 },
      { name: "Loss", value: 30 },
      { name: "Draw", value: 25 },
      { name: "Ongoing", value: 10 }
    ];

    new Chart(outcomesCtx, {
      type: "pie",
      data: {
        labels: outcomeData.map(item => item.name),
        datasets: [{
          label: "Debate Outcomes",
          data: outcomeData.map(item => item.value),
          backgroundColor: COLORS,
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Debate Outcomes Distribution (%)" },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
      },
    });
  }

  // -------------------------------
  // Platform Growth Over Time (Line Chart)
  // -------------------------------
  const growthCtx = document.getElementById("growthChart");
  if (growthCtx) {
    const growthData = [
      { month: "Jan", users: 1200 },
      { month: "Feb", users: 1900 },
      { month: "Mar", users: 2400 },
      { month: "Apr", users: 2800 },
      { month: "May", users: 3500 },
      { month: "Jun", users: 4200 },
      { month: "Jul", users: 4800 },
      { month: "Aug", users: 5500 },
      { month: "Sep", users: 6300 },
      { month: "Oct", users: 7100 },
      { month: "Nov", users: 7800 },
      { month: "Dec", users: 8500 }
    ];

    new Chart(growthCtx, {
      type: "line",
      data: {
        labels: growthData.map(item => item.month),
        datasets: [{
          label: "Monthly Active Users",
          data: growthData.map(item => item.users),
          fill: true,
          backgroundColor: "rgba(58, 93, 217, 0.1)",
          borderColor: "rgba(58, 93, 217, 1)",
          tension: 0.4,
          pointBackgroundColor: "rgba(58, 93, 217, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          title: { display: true, text: "Platform Growth Over Time" },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // -------------------------------
  // Animate Stat Numbers Counting Up
  // -------------------------------
  const statValues = document.querySelectorAll(".stat-value");

  statValues.forEach((value) => {
    const finalValue = value.textContent;
    let startValue = 0;

    // If value has a decimal or 'K'/'M' suffix, skip animation
    if (finalValue.includes(".") || finalValue.includes("K") || finalValue.includes("M")) {
      return;
    }

    const duration = 2000; // Animation duration: 2 seconds
    const increment = parseInt(finalValue) / (duration / 16); // Approximate 60 frames per second

    const animateValue = () => {
      startValue += increment;
      if (startValue < parseInt(finalValue)) {
        value.textContent = Math.floor(startValue);
        requestAnimationFrame(animateValue);
      } else {
        value.textContent = finalValue;
      }
    };

    animateValue();
  });

  // -------------------------------
  // Download Button Behavior
  // -------------------------------
  const downloadBtn = document.querySelector(".download-actions .btn-primary");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Your download would start here in a real implementation.");
    });
  }

  // -------------------------------
  // Request Custom Analysis Button
  // -------------------------------
  const requestBtn = document.querySelector(".download-actions .btn-outline");

  if (requestBtn) {
    requestBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("You would be redirected to a form to request custom analysis in a real implementation.");
    });
  }

  // -------------------------------
  // Animate Elements on Scroll
  // -------------------------------
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  if (animateElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    animateElements.forEach((element) => {
      observer.observe(element);
    });
  }
});
