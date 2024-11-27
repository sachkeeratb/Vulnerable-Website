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
      if (document.getElementById("tasks-container")) {
        document.getElementById("tasks-container").innerHTML = data;
        initializeTasks();
      }
    });

  // Initialize tasks
  function initializeTasks() {
    const tasks = [
      { id: "task1", key: "task1-complete" },
      { id: "task2", key: "task2-complete" },
      { id: "task3", key: "task3-complete" },
      { id: "task4", key: "task4-complete" },
      { id: "task5", key: "task5-complete" },
      { id: "task6", key: "task6-complete" },
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

  function showModal() {
    const modal = document.getElementById("taskModal");
    const span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    span.onclick = function () {
      modal.style.display = "none";
      window.location.href = "/";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        window.location.href = "/";
      }
    };
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

            document.cookie = `username=${result.username}`;

            // Show popup
            alert(`Task completed, ${result.username}!`);

            // Update local storage
            localStorage.setItem("task1-complete", "true");

            showModal();
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

      showModal();
    };
  }

  // Handle CSRF form submission
  const csrfForm = document.getElementById("csrfForm");
  if (csrfForm) {
    csrfForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(csrfForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      const username = document.cookie
        .split("; ")
        .find((row) => row.startsWith("username="))
        ?.split("=")[1];

      fetch("/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `username=${username}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())

        // If they have the user's token, it is successful
        .then((result) => {
          if (result.success) {
            const coinSound = document.getElementById("coinSound");
            coinSound.play();
            alert(`Task completed; $${result.transferred} transferred!`);
            localStorage.setItem("task3-complete", "true");
            showModal();
          }

          // Otherwise, no authorization
          else alert("You are not authorized to perform this action.");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }

  // Handle Open Redirect
  if (document.getElementById("open-redirect-page-identifier")) {
    const redirectLink = document.querySelector("a[href^='/redirect']");
    redirectLink.addEventListener("click", (event) => {
      event.preventDefault();
      const url = redirectLink.href;

      // Open the URL in a new tab
      const newTab = window.open(url, "_blank");

      // Check if the new tab was opened successfully
      if (newTab) {
        // Play coin sound
        const coinSound = document.getElementById("coinSound");
        coinSound.play();

        // Update local storage
        localStorage.setItem("task4-complete", "true");

        // Update task status
        const taskStatus = document.getElementById("task4-status");
        taskStatus.textContent = "✔";
        taskStatus.style.color = "green";

        showModal();
      } else {
        // Play the losing sound
        const loseSound = document.getElementById("loseSound");
        loseSound.play();
        alert(
          "Failed to open the link in a new tab. Please allow pop-ups for this site."
        );
      }
    });
  }

  // Handle IDOR form submission
  const idorForm = document.getElementById("idorForm");
  if (idorForm) {
    idorForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(idorForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Send request to fetch user data
      fetch(`/user?userId=${data.userId}`)
        .then((response) => response.json())
        .then((result) => {
          const coinSound = document.getElementById("coinSound");
          coinSound.play();
          alert(
            `Task completed; User's username is ${result.username} and password is ${result.password}`
          );
          localStorage.setItem("task5-complete", "true");

          showModal();
        })
        .catch((error) => {
          const loseSound = document.getElementById("loseSound");
          loseSound.play();
          alert("Either an error occured or the user is not found... Or both!");
          console.error("Error:", error);
        });
    });
  }
});
