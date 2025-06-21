// Toggle the modal for viewing the certificate PDF
document.querySelectorAll('.view-pdf').forEach(button => {
  button.addEventListener('click', () => {
    const pdfPath = button.getAttribute('data-pdf');
    const modal = document.getElementById('modal');
    const modalPdf = document.getElementById('modal-pdf');
    modalPdf.src = pdfPath;
    modal.style.display = 'flex';
  });
});

// Close modal functionality
document.querySelector('.close-modal').addEventListener('click', () => {
  const modal = document.getElementById('modal');
  const modalPdf = document.getElementById('modal-pdf');
  modal.style.display = 'none';
  modalPdf.src = ''; // Clear the PDF source when closing
});

// Close modal if the backdrop is clicked
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal')) {
    const modal = document.getElementById('modal');
    const modalPdf = document.getElementById('modal-pdf');
    modal.style.display = 'none';
    modalPdf.src = '';
  }
});

// Toggle visibility of abstract/paper in the research section
document.querySelectorAll('.toggle-abstract-btn').forEach(button => {
  button.addEventListener('click', () => {
    const abstract = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';

    if (expanded) {
      abstract.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'Show Paper';
    } else {
      abstract.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
      button.textContent = 'Hide Paper';
    }
  });
});
