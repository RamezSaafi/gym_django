document.addEventListener("DOMContentLoaded", () => {
    const detailModal = document.getElementById("memberDetailModal");
    const detailModalContent = document.getElementById("detailModalContent");
    const detailModalLoading = document.getElementById("detailModalLoading");
    const detailModalName = document.getElementById("modal-member-name");
    const detailModalEmail = document.getElementById("modal-member-email");
    const detailModalTrainer = document.getElementById("modal-member-trainer");
    const detailModalWorkouts = document.getElementById("modal-member-workouts");
    const detailModalEditBtn = document.getElementById("modal-edit-button");
    const detailModalDeleteBtn = document.getElementById("modal-delete-button"); // The button inside the detail modal
  
    const openDetailButtons = document.querySelectorAll(".open-detail-modal");
    const closeDetailButtons = document.querySelectorAll(".close-detail-modal");
    const detailModalOverlay = document.querySelector(".detail-modal-overlay");
  
    function showDetailLoading() {
      if (detailModalLoading) detailModalLoading.classList.remove("hidden");
      if (detailModalContent) detailModalContent.classList.add("hidden"); // Hide content while loading
    }
  
    function hideDetailLoading() {
      if (detailModalLoading) detailModalLoading.classList.add("hidden");
      if (detailModalContent) detailModalContent.classList.remove("hidden"); // Show content
    }
  
    function populateDetailModal(data) {
      if (!data) return;
      // Basic Info
      if (detailModalName) detailModalName.textContent = data.name || "N/A";
      if (detailModalEmail) detailModalEmail.textContent = data.email || "N/A";
  
      // Trainer Info (with link if available)
      if (detailModalTrainer) {
        if (data.trainer && data.trainer.url && data.trainer.name) {
          detailModalTrainer.innerHTML = `<a href="${data.trainer.url}" class="text-blue-600 hover:underline">${data.trainer.name}</a>`;
        } else {
          detailModalTrainer.innerHTML = `<span class="text-gray-500">None</span>`;
        }
      }
  
      // Workout Sessions
      if (detailModalWorkouts) {
        if (data.workout_sessions && data.workout_sessions.length > 0) {
          let workoutHTML = '<ul class="list-disc list-inside space-y-1">';
          data.workout_sessions.forEach((session) => {
            workoutHTML += `<li>`;
            if (session.url) {
              workoutHTML += `<a href="${session.url}" class="text-blue-600 hover:underline">`;
            }
            workoutHTML += `${session.workout_type || "Workout"} on ${
              session.date || "N/A"
            } (${session.duration || "?"} mins)`;
            if (session.url) {
              workoutHTML += `</a>`;
            }
            workoutHTML += `</li>`;
          });
          workoutHTML += "</ul>";
          detailModalWorkouts.innerHTML = workoutHTML;
        } else {
          detailModalWorkouts.innerHTML =
            '<p class="text-gray-500">No workout sessions recorded.</p>';
        }
      }
  
      // Action Buttons
      if (detailModalEditBtn && data.edit_url)
        detailModalEditBtn.href = data.edit_url;
      if (detailModalDeleteBtn && data.delete_url) {
        // Set data attributes needed by the delete modal's JS
        detailModalDeleteBtn.setAttribute("data-delete-url", data.delete_url);
        detailModalDeleteBtn.setAttribute("data-member-name", data.name || "");
        // Ensure it has the class to trigger the *delete* modal
        detailModalDeleteBtn.classList.add("open-delete-modal");
      }
    }
  
    function openDetailModal(url) {
      if (!detailModal || !url) return;
  
      showDetailLoading(); // Show loading indicator
      detailModal.classList.remove("hidden");
      detailModal.classList.add("flex"); // Use flex to center
  
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          populateDetailModal(data);
          hideDetailLoading(); // Hide loading, show content
        })
        .catch((error) => {
          console.error("Error fetching member details:", error);
          if (detailModalContent)
            detailModalContent.innerHTML =
              '<p class="text-red-600 text-center py-10">Could not load member details.</p>';
          hideDetailLoading();
        });
    }
  
    function closeDetailModal() {
      if (detailModal) {
        detailModal.classList.add("hidden");
        detailModal.classList.remove("flex");
        // Optional: Clear content when closing
        if (detailModalName) detailModalName.textContent = "";
        if (detailModalEmail) detailModalEmail.textContent = "";
        if (detailModalTrainer) detailModalTrainer.innerHTML = "";
        if (detailModalWorkouts) detailModalWorkouts.innerHTML = "";
        if (detailModalEditBtn) detailModalEditBtn.href = "#";
        if (detailModalDeleteBtn) {
          detailModalDeleteBtn.setAttribute("data-delete-url", "");
          detailModalDeleteBtn.setAttribute("data-member-name", "");
        }
      }
    }
  
    // --- Event Listeners ---
    openDetailButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const detailUrl = button.dataset.detailUrl;
        openDetailModal(detailUrl);
      });
    });
  
    closeDetailButtons.forEach((button) => {
      button.addEventListener("click", closeDetailModal);
    });
  
    if (detailModalOverlay) {
      detailModalOverlay.addEventListener("click", closeDetailModal);
    }
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !detailModal.classList.contains("hidden")) {
        closeDetailModal();
      }
    });
  
    // Add event listener for the delete button *inside* the detail modal
    // This makes sure it triggers the *delete* confirmation modal
    // Ensure the delete modal's JS is also loaded and ready to handle '.open-delete-modal'
    if (detailModalDeleteBtn) {
      detailModalDeleteBtn.addEventListener("click", () => {
        // We don't need to do anything extra here IF the delete modal's
        // JS correctly picks up the 'open-delete-modal' class and
        // reads the data attributes we set in populateDetailModal.
        // The detail modal stays open until the delete is confirmed/canceled.
      });
    }
  });
  