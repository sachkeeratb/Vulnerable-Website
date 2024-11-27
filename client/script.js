function postComment() {
  const comment = document.getElementById("comment").value;

  // Inject user input directly into the DOM without sanitization (XSS Vulnerability)
  const commentSection = document.getElementById("comments");
  const newComment = document.createElement("div");

  // Unsafe injection of the user's comment (this is where XSS can happen)
  newComment.innerHTML = comment;

  commentSection.appendChild(newComment);

  document.getElementById("comment").value = ""; // Clear the input
}

document.addEventListener("DOMContentLoaded", () => {
  // Load the tasks list
  fetch("/tasks.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("tasks-container").innerHTML = data;
      initializeTasks();
    });

  // Initialize tasks
  function initializeTasks() {
    const tasks = [
      { id: "task1", key: "task1-complete" },
      { id: "task2", key: "task2-complete" },
      { id: "task3", key: "task3-complete" },
    ];

    tasks.forEach((task) => {
      const taskStatus = document.getElementById(`${task.id}-status`);
      let isComplete = localStorage.getItem(task.key);

      // If the task status is not there, set it to false
      if (isComplete === null) {
        localStorage.setItem(task.key, "false");
        isComplete = "false";
      }

      isComplete = isComplete === "true";

      taskStatus.textContent = isComplete ? "✔" : "✘";
      taskStatus.style.color = isComplete ? "green" : "red";

      // Add event listener to toggle task status
      document.getElementById(task.id).addEventListener("click", () => {
        const currentStatus = localStorage.getItem(task.key) === "true";
        localStorage.setItem(task.key, !currentStatus);
        taskStatus.textContent = !currentStatus ? "✔" : "✘";
        taskStatus.style.color = !currentStatus ? "green" : "red";
      });
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm && document.getElementById("sql-injection-page-identifier"))
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Get form data
      const formData = new FormData(loginForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Send login request
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        // Parse the response
        .then((response) => response.json())

        // Handle the result
        .then((result) => {
          if (result.success) {
            // Play coin sound
            const coinSound = document.getElementById("coinSound");
            coinSound.play();

            // Show popup
            alert(`Task completed, ${result.username}!`);

            // Update local storage
            localStorage.setItem("task1-complete", "true");

            // Redirect to homepage
            window.location.href = "/";
          } else {
            // Play the losing sound
            const loseSound = document.getElementById("loseSound");
            loseSound.play();
            alert("Invalid credentials. Please try again.");
          }
        })

        // Handle any errors with playing a losing sound
        .catch((error) => {
          const loseSound = document.getElementById("loseSound");
          loseSound.play();
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    });

  // Handle XSS alert
  if (document.getElementById("xss-page-identifier")) {
    const originalAlert = window.alert;
    window.alert = function (message) {
      // Play coin sound
      const coinSound = document.getElementById("coinSound");
      coinSound.play();

      // Update local storage
      localStorage.setItem("task2-complete", "true");

      // Update task status
      const taskStatus = document.getElementById("task2-status");
      taskStatus.textContent = "✔";
      taskStatus.style.color = "green";

      // Call the original alert function
      originalAlert(message);
    };
  }
});
