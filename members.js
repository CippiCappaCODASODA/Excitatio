window.addEventListener("DOMContentLoaded", function() {
  const membersList = document.getElementById("membersList");

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Only show user accounts, not loggedInUser session
    if (key !== "loggedInUser") {
      try {
        const user = JSON.parse(localStorage.getItem(key));
        
        if (user && user.username && user.rank) {
          const li = document.createElement("li");
          li.textContent = `${user.username} - Rank: ${user.rank}`;
          membersList.appendChild(li);
        }
      } catch (error) {
        console.error("Error loading member:", error);
      }
    }
  }
});
