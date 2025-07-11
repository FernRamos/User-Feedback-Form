document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const output = document.getElementById('output');
  const feedbackDisplay = document.getElementById('feedback-display');
  const charCount = document.getElementById('char-count');
  const tooltip = document.getElementById('tooltip');
  const clearBtn = document.getElementById('clearBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const maxChars = 300;

  // 1. Character count
   form.addEventListener('input', (e) => {
    if (e.target.id === 'comments') {
      const length = e.target.value.length;
      charCount.textContent = `Characters: ${length} / ${maxChars}`;
      charCount.style.color = length > 250 ? 'red' : '#333';
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
    const timestamp = new Date().toLocaleString();

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

    const entry = { name, email, comments, timestamp };
    const saved = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
    saved.push(entry);
    localStorage.setItem('feedbackEntries', JSON.stringify(saved));

    renderEntry(entry, saved.length - 1);
    form.reset();
    charCount.textContent = `Characters: 0 / ${maxChars}`;
  });

  // Render one feedback entry
  function renderEntry({ name, email, comments, timestamp }, index) {
    const entry = document.createElement('div');
    entry.classList.add('feedback-entry');
    entry.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comments:</strong><br>${comments}</p>
      <p><em>Submitted on: ${timestamp}</em></p>
      <p><button class="delete-btn" data-index="${index}">🗑 Delete</button></p>
      <hr/>
    `;
    feedbackDisplay.appendChild(entry);
  }

  // Load existing feedback from localStorage
  const storedEntries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
  storedEntries.forEach((entry, index) => renderEntry(entry, index));

  // Delete individual feedback entry
  feedbackDisplay.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.dataset.index);
      let entries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
      entries.splice(index, 1);
      localStorage.setItem('feedbackEntries', JSON.stringify(entries));
      location.reload(); // reload to re-render with correct indexes
    }
  });

    // Clear form
  clearBtn.addEventListener('click', () => {
    form.reset();
    charCount.textContent = `Characters: 0 / ${maxChars}`;
    output.style.display = 'none';
    [form.name, form.email, form.comments].forEach(field => {
      field.style.borderColor = '#ccc';
    });
  });
    // Clear all feedback
  clearAllBtn.addEventListener('click', () => {
    localStorage.removeItem('feedbackEntries');
    feedbackDisplay.innerHTML = '';
  });

// Prevent background click events from reacting to form actions
  document.querySelector('main').addEventListener('click', () => {
    console.log('Main background clicked');
  });

  form.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent clicks inside the form from reaching the background
  });
});