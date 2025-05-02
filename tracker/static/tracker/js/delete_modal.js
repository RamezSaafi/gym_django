
document.addEventListener('DOMContentLoaded', () => {
    const deleteModal = document.getElementById('deleteConfirmationModal');
    const deleteModalForm = document.getElementById('deleteModalForm');
    const deleteModalMessage = document.getElementById('deleteModalMessage'); 
    const deleteModalWarning = document.getElementById('deleteModalWarning');  
    const deleteCancelBtn = document.getElementById('cancelDeleteButton'); 
    const deleteConfirmBtn = document.getElementById('confirmDeleteButton'); 
    const deleteModalOverlay = document.querySelector('.delete-modal-overlay'); 
    function showDeleteModal(deleteUrl, objectName, objectType = 'item') {
        if (!deleteModal || !deleteModalForm || !deleteModalMessage || !deleteConfirmBtn) {
            console.error("Generic delete modal elements not found!");
            return;
        }
        deleteModalForm.action = deleteUrl;

        let message = `Are you sure you want to delete this ${objectType.toLowerCase()}: <strong class="font-semibold">${objectName || 'this item'}</strong>?`;
        let warning = `This action cannot be undone.`;

        if (objectType === 'Trainer') {
            warning += ` Deleting this trainer will also delete all associated members and their workout sessions.`;
        } else if (objectType === 'Member') {
             warning += ` Deleting this member will also delete all their associated workout sessions.`;
        }

        if(deleteModalMessage) deleteModalMessage.innerHTML = message;
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
            if(deleteModalMessage) deleteModalMessage.textContent = 'Are you sure you want to delete this item?';
            if(deleteModalWarning) deleteModalWarning.textContent = 'This action cannot be undone.';
        }
    }

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
                    if (response.redirected || response.url !== url) {
                         window.location.href = response.url;
                    } else {
                        window.location.reload();
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
     document.body.addEventListener('click', function(event) {
        const triggerButton = event.target.closest('.open-delete-modal');
        if (triggerButton) {
            event.preventDefault();
            const deleteUrl = triggerButton.dataset.deleteUrl;
            const objectName = triggerButton.dataset.objectName; 
            const objectType = triggerButton.dataset.objectType || 'item'; 

            if (deleteUrl && objectName !== undefined) {
                 showDeleteModal(deleteUrl, objectName, objectType);
            } else {
                console.warn('Delete modal trigger clicked, but missing data-delete-url or data-object-name attributes.');
            }
        }
    });

    const closeDeleteButtons = document.querySelectorAll('.close-delete-modal');
     closeDeleteButtons.forEach(button => {
        button.addEventListener('click', hideDeleteModal);
    });
    if (deleteCancelBtn) { 
         deleteCancelBtn.addEventListener('click', hideDeleteModal);
    }
    if (deleteModalOverlay) {
         deleteModalOverlay.addEventListener('click', hideDeleteModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && deleteModal && !deleteModal.classList.contains('hidden')) {
             hideDeleteModal();
        }
    });

});