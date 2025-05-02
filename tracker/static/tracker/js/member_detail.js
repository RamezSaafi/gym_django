document.addEventListener("DOMContentLoaded", () => {
  const detailModal = document.getElementById("memberDetailModal");
  const detailModalContent = document.getElementById("detailModalContent");
  const detailModalLoading = document.getElementById("detailModalLoading");
  const detailModalName = document.getElementById("modal-member-name");
  const detailModalEmail = document.getElementById("modal-member-email");
  const detailModalTrainer = document.getElementById("modal-member-trainer");
  const detailModalWorkouts = document.getElementById("modal-member-workouts");
  const detailModalEditBtn = document.getElementById("modal-edit-button");
  const detailModalDeleteBtn = document.getElementById("modal-delete-button");

  const openDetailButtons = document.querySelectorAll(".open-detail-modal");
  const closeDetailButtons = document.querySelectorAll(".close-detail-modal");
  const detailModalOverlay = document.querySelector(".detail-modal-overlay");

  function showDetailLoading() {
    if (detailModalLoading) detailModalLoading.classList.remove("hidden");
    if (detailModalContent) detailModalContent.classList.add("hidden");
  }

  function hideDetailLoading() {
    if (detailModalLoading) detailModalLoading.classList.add("hidden");
    if (detailModalContent) detailModalContent.classList.remove("hidden");
  }

  function populateDetailModal(data) {
    if (!data) return;

    if (detailModalName) detailModalName.textContent = data.name || "N/A";
    if (detailModalEmail) detailModalEmail.textContent = data.email || "N/A";


    if (detailModalTrainer) {
      if (data.trainer && data.trainer.url && data.trainer.name) {
        detailModalTrainer.innerHTML = `<a href="${data.trainer.url}" class="text-blue-600 hover:underline">${data.trainer.name}</a>`;
      } else {
        detailModalTrainer.innerHTML = `<span class="text-gray-500">None</span>`;
      }
    }

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

    if (detailModalEditBtn && data.edit_url)
      detailModalEditBtn.href = data.edit_url;
    if (detailModalDeleteBtn && data.delete_url) {

      detailModalDeleteBtn.setAttribute("data-delete-url", data.delete_url);
      detailModalDeleteBtn.setAttribute("data-member-name", data.name || "");

      detailModalDeleteBtn.classList.add("open-delete-modal");
    }
  }

  function openDetailModal(url) {
    if (!detailModal || !url) return;

    showDetailLoading(); 
    detailModal.classList.remove("hidden");
    detailModal.classList.add("flex");

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        populateDetailModal(data);
        hideDetailLoading(); 
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

  if (detailModalDeleteBtn) {
    detailModalDeleteBtn.addEventListener("click", () => {
      
    });
  }
});
