document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const output = document.getElementById('output');
  const feedbackDisplay = document.getElementById('feedback-display');
  const charCount = document.getElementById('char-count');
  const tooltip = document.getElementById('tooltip');
  const clearBtn = document.getElementById('clearBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const maxChars = 300;
  let editIndex = null;

  // Character count
  form.addEventListener('input', (e) => {
    if (e.target.id === 'comments') {
      const length = e.target.value.length;
      charCount.textContent = `Characters: ${length} / ${maxChars}`;
      charCount.style.color = length > 250 ? 'red' : '#333';
    }
  });

  // Tooltip on mouse
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

  // Tooltip on keyboard focus
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
  form.addEventListener('submit', (e) => {
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

    const entry = { name, email, comments, timestamp };
    let entries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];

    if (editIndex !== null) {
      entries[editIndex] = entry;
      editIndex = null;
    } else {
      entries.push(entry);
    }

    localStorage.setItem('feedbackEntries', JSON.stringify(entries));

    // Re-render entries
    feedbackDisplay.innerHTML = '';
    entries.forEach((entry, index) => renderEntry(entry, index));

    output.style.display = 'block';
    output.innerHTML = `<h3>Thanks for your feedback, ${name}!</h3>`;

    form.reset();
    charCount.textContent = `Characters: 0 / ${maxChars}`;
  });

  // Render feedback entry
  function renderEntry({ name, email, comments, timestamp }, index) {
    const entry = document.createElement('div');
    entry.classList.add('feedback-entry');
    entry.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Comments:</strong><br>${comments}</p>
      <p><em>Submitted on: ${timestamp}</em></p>
      <p>
        <button class="edit-btn" data-index="${index}">✏️ Edit</button>
        <button class="delete-btn" data-index="${index}">🗑 Delete</button>
      </p>
      <hr/>
    `;
    feedbackDisplay.appendChild(entry);
  }

  // Load existing feedback on page load
  const storedEntries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];
  storedEntries.forEach((entry, index) => renderEntry(entry, index));

  // Event delegation for edit/delete
  feedbackDisplay.addEventListener('click', (e) => {
    const index = parseInt(e.target.dataset.index);
    if (isNaN(index)) return;

    let entries = JSON.parse(localStorage.getItem('feedbackEntries')) || [];

    if (e.target.classList.contains('edit-btn')) {
      const entry = entries[index];
      form.name.value = entry.name;
      form.email.value = entry.email;
      form.comments.value = entry.comments;
      charCount.textContent = `Characters: ${entry.comments.length} / ${maxChars}`;
      editIndex = index;
      output.style.display = 'none';
    }

    if (e.target.classList.contains('delete-btn')) {
      entries.splice(index, 1);
      localStorage.setItem('feedbackEntries', JSON.stringify(entries));
      feedbackDisplay.innerHTML = '';
      entries.forEach((entry, i) => renderEntry(entry, i));
      if (editIndex !== null && editIndex === index) editIndex = null;
    }
  });

  // Clear form
  clearBtn.addEventListener('click', () => {
    form.reset();
    charCount.textContent = `Characters: 0 / ${maxChars}`;
    output.style.display = 'none';
    editIndex = null;
    [form.name, form.email, form.comments].forEach(field => {
      field.style.borderColor = '#ccc';
    });
  });

  // Clear all feedback
  clearAllBtn.addEventListener('click', () => {
    localStorage.removeItem('feedbackEntries');
    feedbackDisplay.innerHTML = '';
    editIndex = null;
  });

  // Prevent background click interference
  document.querySelector('main').addEventListener('click', () => {
    console.log('Main background clicked');
  });

  form.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  // ✅ Dark Mode Toggle
  const toggleBtn = document.getElementById('toggleDark');
  if (toggleBtn) {
    // Optional: Load saved preference
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
    }

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  }
});
