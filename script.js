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

// Open modal with paper PDF
document.querySelectorAll('.publication-card').forEach(card => {
  card.addEventListener('click', () => {
    const pdfPath = card.querySelector('a').getAttribute('href');
    modalPdf.src = pdfPath;
    modal.style.display = 'flex';
  });
});

// Close modal functionality
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  modalPdf.src = ''; // Clear the PDF source when closing
});

// Close modal if the backdrop is clicked
modal.addEventListener('click', (e) => {
  // Typing animation with academic identity text
const texts = [
  "Chemical Engineering Student",
  "Aspiring PhD Candidate",
  "Available for remote, voluntary research collaboration in chemical and biochemical engineering"
];
let currentTextIndex = 0;
let charIndex = 0;
const typingSpeed = 75;
const erasingSpeed = 40;
const delayBetweenTexts = 2000;
const heroTextElement = document.getElementById("hero-text");

function typeText() {
  if (!heroTextElement) return;
  if (charIndex < texts[currentTextIndex].length) {
    heroTextElement.textContent += texts[currentTextIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, typingSpeed);
  } else {
    setTimeout(eraseText, delayBetweenTexts);
  }
}

function eraseText() {
  if (!heroTextElement) return;
  if (charIndex > 0) {
    heroTextElement.textContent = texts[currentTextIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, erasingSpeed);
  } else {
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    setTimeout(typeText, typingSpeed);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  typeText();
});

  if (e.target === modal) {
    modal.style.display = 'none';
    modalPdf.src = '';
  }
});
