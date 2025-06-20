// Modal Functionality for PDF Viewing (General)
const modals = document.querySelectorAll('.modal');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Open modal when clicking an element (like a button or card)
document.querySelectorAll('.open-modal-documents').forEach(button => {
  button.addEventListener('click', () => {
    const targetModal = document.getElementById(button.getAttribute('data-target-modal'));
    targetModal.style.display = 'flex';
  });
});

// Close the modal when the close button is clicked
closeModalBtns.forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  });
});

// Close the modal if the backdrop is clicked
modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Social Media Interaction (Flying Icons)
document.querySelectorAll('.social-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.classList.add('fly-icon');
  });
});
