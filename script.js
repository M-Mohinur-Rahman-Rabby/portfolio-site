// Modal Functionality for PDF Viewing (General)
const modals = document.querySelectorAll('.modal');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Open modal when clicking an element (like a button or card)
document.querySelectorAll('.open-modal-documents').forEach(button => {
  button.addEventListener('click', () => {
    // Open the modal for the corresponding section
    const targetModal = document.querySelector(button.getAttribute('data-target-modal'));
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

// Handling the abstract toggle visibility
document.querySelectorAll('.toggle-abstract-btn').forEach(button => {
  button.addEventListener('click', () => {
    const abstract = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';

    if (abstract) {
      if (expanded) {
        abstract.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Show Abstract';
        abstract.setAttribute('aria-hidden', 'true');
      } else {
        abstract.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        button.textContent = 'Hide Abstract';
        abstract.setAttribute('aria-hidden', 'false');
      }
    }
  });
});

// PDF Viewer in the modal (For Research Papers)
document.querySelectorAll('.publication-card').forEach(card => {
  card.addEventListener('click', () => {
    const pdfPath = card.querySelector('a').getAttribute('href');
    const modal = document.getElementById('modal');
    const modalPdf = document.getElementById('modal-pdf');

    modalPdf.src = pdfPath;
    modal.style.display = 'flex';
  });
});

// Close modal when clicking on backdrop
const modalBackdrop = document.getElementById('modal');
const modalPdf = document.getElementById('modal-pdf');
const closeModalBtn = document.querySelector('.close-modal');

closeModalBtn.addEventListener('click', () => {
  modalBackdrop.style.display = 'none';
  modalPdf.src = ''; // Clear the PDF source when closing the modal
});

// Handling modal for document viewing (PDF)
document.querySelectorAll('.document-card').forEach(card => {
  card.addEventListener('click', () => {
    const pdfPath = card.querySelector('a').getAttribute('href');
    const documentModal = document.getElementById('document-modal');
    const documentPdf = document.getElementById('document-pdf');

    documentPdf.src = pdfPath;
    documentModal.style.display = 'flex';
  });
});

// Close document modal when clicking on backdrop
const documentModal = document.getElementById('document-modal');
const documentPdf = document.getElementById('document-pdf');

documentModal.addEventListener('click', (e) => {
  if (e.target === documentModal) {
    documentModal.style.display = 'none';
    documentPdf.src = ''; // Clear the PDF source when closing
  }
});
