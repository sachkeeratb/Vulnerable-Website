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

/* XSS example inputs

<img src="x" onerror="alert('XSS Attack!')"> Broken image sending an alert
<a href="javascript:alert('XSS')">Click me</a> Link sending an alert on click
<script>alert("XSS attack!");</script> Sends an alert (may not work on some browers)

*/
