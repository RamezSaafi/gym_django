// tracker/static/tracker/js/trainer_modals.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Trainer Detail Modal Elements & Functions ---
    const trainerDetailModal = document.getElementById('trainerDetailModal'); // Changed ID
    const trainerDetailModalContent = document.getElementById('trainerDetailModalContent'); // Changed ID
    const trainerDetailModalLoading = document.getElementById('trainerDetailModalLoading'); // Changed ID
    const modalTrainerName = document.getElementById('modal-trainer-name'); // Changed ID
    const modalTrainerSpecialty = document.getElementById('modal-trainer-specialty'); // Changed ID
    const modalTrainerMembers = document.getElementById('modal-trainer-members'); // Changed ID
    const modalTrainerEditBtn = document.getElementById('modal-trainer-edit-button'); // Changed ID
    const modalTrainerDeleteBtn = document.getElementById('modal-trainer-delete-button'); // Changed ID

    // Specific triggers and closers for this modal type
    const openTrainerDetailButtons = document.querySelectorAll('.open-trainer-detail-modal');
    const closeTrainerDetailButtons = document.querySelectorAll('.close-trainer-detail-modal');
    const trainerDetailModalOverlay = document.querySelector('.trainer-detail-modal-overlay');

    function showTrainerDetailLoading() {
        if(trainerDetailModalLoading) trainerDetailModalLoading.classList.remove('hidden');
        if(trainerDetailModalContent) trainerDetailModalContent.classList.add('hidden');
    }

    function hideTrainerDetailLoading() {
         if(trainerDetailModalLoading) trainerDetailModalLoading.classList.add('hidden');
         if(trainerDetailModalContent) trainerDetailModalContent.classList.remove('hidden');
    }

    function populateTrainerDetailModal(data) {
        if (!data) return;
        if(modalTrainerName) modalTrainerName.textContent = data.name || 'N/A';
        if(modalTrainerSpecialty) modalTrainerSpecialty.textContent = data.specialty || 'N/A';

        // Assigned Members
        if(modalTrainerMembers) {
            if (data.members && data.members.length > 0) {
                let memberHTML = '<ul class="list-disc list-inside space-y-1">';
                data.members.forEach(member => {
                    memberHTML += `<li>`;
                    if (member.url) {
                         memberHTML += `<a href="${member.url}" class="text-blue-600 hover:underline">`;
                    }
                    memberHTML += `${member.name || 'Member'}`;
                    if (member.url) {
                        memberHTML += `</a>`;
                    }
                    memberHTML += `</li>`;
                });
                memberHTML += '</ul>';
                modalTrainerMembers.innerHTML = memberHTML;
            } else {
                modalTrainerMembers.innerHTML = '<p class="text-gray-500">No members assigned.</p>';
            }
        }

        // Action Buttons
        if(modalTrainerEditBtn && data.edit_url) modalTrainerEditBtn.href = data.edit_url;
        // Prepare the delete button inside this modal to trigger the generic delete modal
        if(modalTrainerDeleteBtn && data.delete_url) {
             modalTrainerDeleteBtn.setAttribute('data-delete-url', data.delete_url);
             // Use a generic name 'data-object-name' for the delete modal JS
             modalTrainerDeleteBtn.setAttribute('data-object-name', data.name || '');
             // Add object type for potentially more specific messaging in delete modal JS
             modalTrainerDeleteBtn.setAttribute('data-object-type', 'Trainer');
             // Ensure it has the class to trigger the *delete* modal logic
             modalTrainerDeleteBtn.classList.add('open-delete-modal');
        }
    }

    function openTrainerDetailModal(url) {
        if (!trainerDetailModal || !url) return;
        showTrainerDetailLoading();
        trainerDetailModal.classList.remove('hidden');
        trainerDetailModal.classList.add('flex');

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                populateTrainerDetailModal(data);
                hideTrainerDetailLoading();
            })
            .catch(error => {
                console.error("Error fetching trainer details:", error);
                if (trainerDetailModalContent) trainerDetailModalContent.innerHTML = '<p class="text-red-600 text-center py-10">Could not load trainer details.</p>';
                hideTrainerDetailLoading();
            });
    }

    function closeTrainerDetailModal() {
        if(trainerDetailModal) {
            trainerDetailModal.classList.add('hidden');
            trainerDetailModal.classList.remove('flex');
             // Optional: Clear content
             if(modalTrainerName) modalTrainerName.textContent = '';
             if(modalTrainerSpecialty) modalTrainerSpecialty.textContent = '';
             if(modalTrainerMembers) modalTrainerMembers.innerHTML = '';
             if(modalTrainerEditBtn) modalTrainerEditBtn.href = '#';
             if(modalTrainerDeleteBtn) {
                 modalTrainerDeleteBtn.setAttribute('data-delete-url', '');
                 modalTrainerDeleteBtn.setAttribute('data-object-name', '');
                 modalTrainerDeleteBtn.setAttribute('data-object-type', '');
             }
        }
    }

    // Trainer Detail Modal Event Listeners
    openTrainerDetailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const detailUrl = button.dataset.detailUrl;
            openTrainerDetailModal(detailUrl);
        });
    });

    closeTrainerDetailButtons.forEach(button => {
        button.addEventListener('click', closeTrainerDetailModal);
    });

    if (trainerDetailModalOverlay) {
        trainerDetailModalOverlay.addEventListener('click', closeTrainerDetailModal);
    }

    // ESC key listener specifically for this modal
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && trainerDetailModal && !trainerDetailModal.classList.contains('hidden')) {
            closeTrainerDetailModal();
        }
    });

     // Note: The generic delete modal logic (opening, closing, submitting)
     // should be in a separate shared file or duplicated in the member_modals.js
     // if you want strict separation per model. For simplicity, let's assume
     // the delete modal logic from member_modals.js is available globally or
     // loaded separately and handles the '.open-delete-modal' class triggers.

}); // End DOMContentLoaded