document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const output = document.getElementById('output');
  const feedbackDisplay = document.getElementById('feedback-display');
  const charCount = document.getElementById('char-count');
  const tooltip = document.getElementById('tooltip');
  const clearBtn = document.getElementById('clearBtn');

  // 1. Character count
  form.addEventListener('input', (e) => {
    if (e.target.id === 'comments') {
      charCount.textContent = `Characters: ${e.target.value.length}`;
    }
  });

  // 2. Tooltip (mouse)
  form.addEventListener('mouseover', (e) => {
    if (e.target.matches('input, textarea')) {
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
    if (e.target.matches('input, textarea')) {
      tooltip.classList.remove('show');
    }
  });

  // 3. Tooltip (keyboard focus)
  form.addEventListener('focusin', (e) => {
    if (e.target.matches('input, textarea')) {
      const tip = e.target.getAttribute('data-tooltip');
      if (tip) {
        tooltip.textContent = tip;
        tooltip.classList.add('show');
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  });

  form.addEventListener('focusout', () => {
    tooltip.classList.remove('show');
  });

  // Submit form
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const comments = form.comments.value.trim();

    if (!name || !email || !comments) {
      [form.name, form.email, form.comments].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'red';
        }
      });
      alert('All fields are required!');
      return;
    }

    [form.name, form.email, form.comments].forEach(field => {
      field.style.borderColor = '#ccc';
    });

    output.style.display = 'block';
    output.innerHTML = `<h3>Thanks for your feedback, ${name}!</h3>`;

    const entry = document.createElement('div');
    entry.classList.add('feedback-entry');
    entry.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comments:</strong><br>${comments}</p>
      <hr/>
    `;
    feedbackDisplay.appendChild(entry);

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
    saved.push({ name, email, comments });
    localStorage.setItem('feedbackEntries', JSON.stringify(saved));

    // Reset
    form.reset();
    charCount.textContent = 'Characters: 0';
  });

  // Clear form button
  clearBtn.addEventListener('click', () => {
    form.reset();
    charCount.textContent = 'Characters: 0';
    output.style.display = 'none';
    [form.name, form.email, form.comments].forEach(field => {
      field.style.borderColor = '#ccc';
    });
  });

  // Load saved feedback
  const storedEntries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
  storedEntries.forEach(({ name, email, comments }) => {
    const entry = document.createElement('div');
    entry.classList.add('feedback-entry');
    entry.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comments:</strong><br>${comments}</p>
      <hr/>
    `;
    feedbackDisplay.appendChild(entry);
  });
  
// Prevent background click events from reacting to form actions
  document.querySelector('main').addEventListener('click', () => {
    console.log('Main background clicked');
  });

  form.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent clicks inside the form from reaching the background
  });
});