// Toggle Abstract Visibility
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

// Modal for PDF Viewer
const modal = document.getElementById('modal');
const modalPdf = document.getElementById('modal-pdf');
const closeModalBtn = document.querySelector('.close-modal');

document.querySelectorAll('.publication-card').forEach(card => {
  card.addEventListener('click', () => {
    const pdfPath = card.querySelector('a').getAttribute('href');
    modalPdf.src = pdfPath;
    modal.style.display = 'flex';
  });
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  modalPdf.src = ''; // Clear the PDF source when closing
});

// Close modal if the backdrop is clicked
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    modalPdf.src = '';
  }
});
