// tracker/static/tracker/js/delete_modal.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Generic Delete Confirmation Modal Elements & Functions ---
    const deleteModal = document.getElementById('deleteConfirmationModal');
    const deleteModalForm = document.getElementById('deleteModalForm');
    const deleteModalMessage = document.getElementById('deleteModalMessage'); // Target for main message
    const deleteModalWarning = document.getElementById('deleteModalWarning'); // Target for warning
    const deleteCancelBtn = document.getElementById('cancelDeleteButton'); // Generic cancel button ID
    const deleteConfirmBtn = document.getElementById('confirmDeleteButton'); // Generic confirm button ID
    const deleteModalOverlay = document.querySelector('.delete-modal-overlay'); // Generic overlay class

    function showDeleteModal(deleteUrl, objectName, objectType = 'item') { // Added objectType
        if (!deleteModal || !deleteModalForm || !deleteModalMessage || !deleteConfirmBtn) {
            console.error("Generic delete modal elements not found!");
            return;
        }
        deleteModalForm.action = deleteUrl;

        // Customize messages based on object type
        let message = `Are you sure you want to delete this ${objectType.toLowerCase()}: <strong class="font-semibold">${objectName || 'this item'}</strong>?`;
        let warning = `This action cannot be undone.`;

        if (objectType === 'Trainer') {
            warning += ` Deleting this trainer will also delete all associated members and their workout sessions.`;
        } else if (objectType === 'Member') {
             warning += ` Deleting this member will also delete all their associated workout sessions.`;
        }
         // Add more specific warnings for other types if needed

        if(deleteModalMessage) deleteModalMessage.innerHTML = message; // Use innerHTML for the strong tag
        if(deleteModalWarning) deleteModalWarning.textContent = warning;


        deleteConfirmBtn.disabled = false;
        deleteConfirmBtn.textContent = 'Confirm Delete';
        if(deleteCancelBtn) deleteCancelBtn.disabled = false;

        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        if(deleteCancelBtn) deleteCancelBtn.focus();
    }

    function hideDeleteModal() {
        if(deleteModal) {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
            if(deleteModalForm) deleteModalForm.action = "";
            // Clear dynamic text
            if(deleteModalMessage) deleteModalMessage.textContent = 'Are you sure you want to delete this item?';
            if(deleteModalWarning) deleteModalWarning.textContent = 'This action cannot be undone.';
        }
    }

    // AJAX Form Submission for Delete Modal
    if (deleteModalForm) {
        deleteModalForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const url = this.action;
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Deleting...';
            if(deleteCancelBtn) deleteCancelBtn.disabled = true;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                 body: formData
            })
            .then(response => {
                if (response.ok) {
                    hideDeleteModal();
                    // Redirect after successful deletion
                    // Assumes backend sends redirect response
                    if (response.redirected || response.url !== url) { // Check if redirect happened
                         window.location.href = response.url;
                    } else {
                        // Fallback or handle cases where no redirect happens (e.g., API response)
                        window.location.reload(); // Simple fallback: reload the page
                    }

                } else {
                    response.text().then(text => {
                         console.error('Deletion failed:', text || response.statusText);
                         alert(`Error deleting item: ${text || response.statusText}`);
                         submitButton.disabled = false;
                         submitButton.textContent = originalButtonText;
                         if(deleteCancelBtn) deleteCancelBtn.disabled = false;
                    });
                 }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred while trying to delete the item.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                if(deleteCancelBtn) deleteCancelBtn.disabled = false;
            });
        });
    }

     // Delete Modal Trigger Listener (using event delegation)
     document.body.addEventListener('click', function(event) {
        const triggerButton = event.target.closest('.open-delete-modal');
        if (triggerButton) {
            event.preventDefault();
            const deleteUrl = triggerButton.dataset.deleteUrl;
            const objectName = triggerButton.dataset.objectName; // Generic name attribute
            const objectType = triggerButton.dataset.objectType || 'item'; // Get type, default to 'item'

            if (deleteUrl && objectName !== undefined) {
                 showDeleteModal(deleteUrl, objectName, objectType);
            } else {
                console.warn('Delete modal trigger clicked, but missing data-delete-url or data-object-name attributes.');
            }
        }
    });

    // Listeners for Cancel button and Overlay click
    const closeDeleteButtons = document.querySelectorAll('.close-delete-modal'); // Added specific class for cancel/close
     closeDeleteButtons.forEach(button => {
        button.addEventListener('click', hideDeleteModal);
    });
    if (deleteCancelBtn) { // Add listener to the specific cancel button too
         deleteCancelBtn.addEventListener('click', hideDeleteModal);
    }
    if (deleteModalOverlay) {
         deleteModalOverlay.addEventListener('click', hideDeleteModal);
    }

     // ESC key listener specifically for this modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && deleteModal && !deleteModal.classList.contains('hidden')) {
             hideDeleteModal();
        }
    });

}); // End DOMContentLoaded