
document.addEventListener('DOMContentLoaded', () => {

    const workoutDetailModal = document.getElementById('workoutDetailModal');
    const workoutDetailModalContent = document.getElementById('workoutDetailModalContent');
    const workoutDetailModalLoading = document.getElementById('workoutDetailModalLoading');
    const modalWorkoutMember = document.getElementById('modal-workout-member');
    const modalWorkoutType = document.getElementById('modal-workout-type');
    const modalWorkoutDuration = document.getElementById('modal-workout-duration');
    const modalWorkoutDate = document.getElementById('modal-workout-date');
    const modalWorkoutEditBtn = document.getElementById('modal-workout-edit-button');
    const modalWorkoutDeleteBtn = document.getElementById('modal-workout-delete-button');

    const openWorkoutDetailButtons = document.querySelectorAll('.open-workout-detail-modal');
    const closeWorkoutDetailButtons = document.querySelectorAll('.close-workout-detail-modal');
    const workoutDetailModalOverlay = document.querySelector('.workout-detail-modal-overlay');

    function showWorkoutDetailLoading() {
        if(workoutDetailModalLoading) workoutDetailModalLoading.classList.remove('hidden');
        if(workoutDetailModalContent) workoutDetailModalContent.classList.add('hidden');
    }

    function hideWorkoutDetailLoading() {
         if(workoutDetailModalLoading) workoutDetailModalLoading.classList.add('hidden');
         if(workoutDetailModalContent) workoutDetailModalContent.classList.remove('hidden');
    }

    function populateWorkoutDetailModal(data) {
        if (!data) return;

        // Member Info (with link)
        if(modalWorkoutMember) {
             if (data.member && data.member.url && data.member.name) {
                modalWorkoutMember.innerHTML = `<a href="${data.member.url}" class="text-blue-600 hover:underline">${data.member.name}</a>`;
            } else if (data.member && data.member.name) {
                modalWorkoutMember.textContent = data.member.name; 
            }
             else {
                modalWorkoutMember.textContent = 'N/A';
            }
        }

        if(modalWorkoutType) modalWorkoutType.textContent = data.workout_type || 'N/A';
        if(modalWorkoutDuration) modalWorkoutDuration.textContent = data.duration ? `${data.duration} minutes` : 'N/A';
        if(modalWorkoutDate) modalWorkoutDate.textContent = data.date_display || data.date || 'N/A';

        // Action Buttons
        if(modalWorkoutEditBtn && data.edit_url) modalWorkoutEditBtn.href = data.edit_url;
        if(modalWorkoutDeleteBtn && data.delete_url) {
             const objectName = `${data.workout_type || 'Session'} for ${data.member?.name || '?'} on ${data.date || '?'}`;
             modalWorkoutDeleteBtn.setAttribute('data-delete-url', data.delete_url);
             modalWorkoutDeleteBtn.setAttribute('data-object-name', objectName);
             modalWorkoutDeleteBtn.setAttribute('data-object-type', 'Workout Session');
             modalWorkoutDeleteBtn.classList.add('open-delete-modal');
        }
    }


    function openWorkoutDetailModal(url) {
        if (!workoutDetailModal || !url) return;
        showWorkoutDetailLoading();
        workoutDetailModal.classList.remove('hidden');
        workoutDetailModal.classList.add('flex');

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                populateWorkoutDetailModal(data);
                hideWorkoutDetailLoading();
            })
            .catch(error => {
                console.error("Error fetching workout details:", error);
                if (workoutDetailModalContent) workoutDetailModalContent.innerHTML = '<p class="text-red-600 text-center py-10">Could not load workout details.</p>';
                hideWorkoutDetailLoading();
            });
    }

    function closeWorkoutDetailModal() {
        if(workoutDetailModal) {
            workoutDetailModal.classList.add('hidden');
            workoutDetailModal.classList.remove('flex');

            if(modalWorkoutMember) modalWorkoutMember.innerHTML = '';
             if(modalWorkoutType) modalWorkoutType.textContent = '';
             if(modalWorkoutDuration) modalWorkoutDuration.textContent = '';
             if(modalWorkoutDate) modalWorkoutDate.textContent = '';
             if(modalWorkoutEditBtn) modalWorkoutEditBtn.href = '#';
             if(modalWorkoutDeleteBtn) {
                 modalWorkoutDeleteBtn.setAttribute('data-delete-url', '');
                 modalWorkoutDeleteBtn.setAttribute('data-object-name', '');
                 modalWorkoutDeleteBtn.setAttribute('data-object-type', '');
             }
        }
    }

    // Workout Detail Modal Event Listeners
    openWorkoutDetailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const detailUrl = button.dataset.detailUrl;
            openWorkoutDetailModal(detailUrl);
        });
    });

    closeWorkoutDetailButtons.forEach(button => {
        button.addEventListener('click', closeWorkoutDetailModal);
    });

    if (workoutDetailModalOverlay) {
        workoutDetailModalOverlay.addEventListener('click', closeWorkoutDetailModal);
    }

    // ESC key listener specifically for this modal
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && workoutDetailModal && !workoutDetailModal.classList.contains('hidden')) {
            closeWorkoutDetailModal();
        }
    });

}); 