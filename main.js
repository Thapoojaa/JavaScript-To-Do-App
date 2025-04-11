// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeSwitch = document.getElementById('theme-switch');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Theme handling
themeSwitch.checked = localStorage.getItem('theme') === 'dark';
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

themeSwitch.addEventListener('change', () => {
  const theme = themeSwitch.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
});

// Todo functions
function addTodo(e) {
  e.preventDefault();
  
  const text = todoInput.value.trim();
  if (!text) {
    todoInput.classList.add('shake');
    setTimeout(() => todoInput.classList.remove('shake'), 300);
    return;
  }

  const todo = {
    id: Date.now().toString(),
    text,
    category: categorySelect.value,
    completed: false,
    createdAt: new Date()
  };

  todos.unshift(todo);
  saveTodos();
  renderTodos();
  
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  const todoElement = document.querySelector(`[data-id="${id}"]`);
  todoElement.classList.add('slide-out');
  
  setTimeout(() => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
  }, 300);
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodos(filter) {
  currentFilter = filter;
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

function renderTodos() {
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  todoList.innerHTML = filteredTodos.map(todo => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <button class="toggle-btn" onclick="toggleTodo('${todo.id}')">
        ${todo.completed ? `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        ` : `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
        `}
      </button>
      <div class="todo-content">
        <div class="todo-text">${todo.text}</div>
        <div class="todo-category">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          ${todo.category}
        </div>
      </div>
      <div class="todo-actions">
        <button class="delete-btn" onclick="deleteTodo('${todo.id}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  emptyState.style.display = filteredTodos.length === 0 ? 'block' : 'none';
}

// Event listeners
todoForm.addEventListener('submit', addTodo);
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => filterTodos(btn.dataset.filter));
});

// Make functions available globally for onclick handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

// Initial render
renderTodos();