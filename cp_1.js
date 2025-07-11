document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const output = document.getElementById('output');
  const feedbackDisplay = document.getElementById('feedback-display');
  const charCount = document.getElementById('char-count');
  const tooltip = document.getElementById('tooltip');

  const commentsField = form.comments;

  // 1. Character count as user types
  commentsField.addEventListener('input', () => {
    charCount.textContent = `Characters: ${commentsField.value.length}`;
  });

  // 2. Tooltip logic for all inputs
  form.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      const tip = e.target.getAttribute('data-tooltip');
      if (tip) {
        tooltip.textContent = tip;
        tooltip.classList.add('show');
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
      }
    }
  });

  form.addEventListener('mousemove', (e) => {
    tooltip.style.top = `${e.pageY + 10}px`;
    tooltip.style.left = `${e.pageX + 10}px`;
  });

  form.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      tooltip.classList.remove('show');;
    }
  });

  // 3 & 4. Validation and dynamic display
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const comments = commentsField.value.trim();

    // Validation
    if (!name || !email || !comments) {
      alert('All fields are required!');
      return;
    }

    // Show thank you message
    output.style.display = 'block';
    output.innerHTML = `<h3>Thanks for your feedback, ${name}!</h3>`;

    // Append to feedback display
    const entry = document.createElement('div');
    entry.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comments:</strong><br>${comments}</p>
      <hr/>
    `;
    feedbackDisplay.appendChild(entry);

    // Reset form
    form.reset();
    charCount.textContent = 'Characters: 0';
  });
});
