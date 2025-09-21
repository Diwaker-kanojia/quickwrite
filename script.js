const notesContainer = document.getElementById("notesContainer");
const emptyState = document.getElementById("emptyState");
const addNoteBtn = document.getElementById("addNoteBtn");
const addNoteModal = document.getElementById("addNoteModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const noteForm = document.getElementById("noteForm");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const closeConfirmBtn = document.getElementById("closeConfirmBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const themeToggle = document.getElementById("themeToggle");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let deleteNoteId = null;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "light");
  }
});

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  notesContainer.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase();
  const selectedTag = filterSelect.value;

  const filteredNotes = notes.filter(
    (note) =>
      (note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)) &&
      (selectedTag === "all" || note.tag === selectedTag)
  );

  if (filteredNotes.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";

    filteredNotes.forEach((note) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card fade-in";

      const noteContent = document.createElement("div");
      noteContent.className = "note-content";

      const noteHeader = document.createElement("div");
      noteHeader.className = "note-header";

      const noteTitle = document.createElement("h3");
      noteTitle.className = "note-title";
      noteTitle.textContent = note.title;

      const noteActions = document.createElement("div");
      noteActions.className = "note-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = () => {
        deleteNoteId = note.id;
        deleteConfirmModal.classList.add("active");
      };

      noteActions.appendChild(deleteBtn);
      noteHeader.appendChild(noteTitle);
      noteHeader.appendChild(noteActions);

      const noteText = document.createElement("p");
      noteText.className = "note-text";
      noteText.textContent = note.content;

      const noteFooter = document.createElement("div");
      noteFooter.className = "note-footer";

      const noteTag = document.createElement("span");
      noteTag.className = `note-tag tag-${note.tag}`;
      switch (note.tag) {
        case "work":
          noteTag.innerHTML = '<i class="fas fa-briefcase"></i> ' + "Work";
          break;
        case "personal":
          noteTag.innerHTML = '<i class="fas fa-user"></i> ' + "Personal";
          break;
        case "ideas":
          noteTag.innerHTML = '<i class="fas fa-lightbulb"></i> ' + "Ideas";
          break;
        case "reminders":
          noteTag.innerHTML = '<i class="fas fa-bell"></i> ' + "Reminder";
          break;
      }

      const noteDate = document.createElement("span");
      noteDate.className = "note-date";
      noteDate.textContent = new Date(note.date).toLocaleDateString();

      noteFooter.appendChild(noteTag);
      noteFooter.appendChild(noteDate);

      noteContent.appendChild(noteHeader);
      noteContent.appendChild(noteText);
      noteContent.appendChild(noteFooter);

      noteCard.appendChild(noteContent);
      notesContainer.appendChild(noteCard);
    });
  }
}

addNoteBtn.addEventListener("click", () => {
  addNoteModal.classList.add("active");
});

closeModalBtn.addEventListener("click", () => {
  addNoteModal.classList.remove("active");
});

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const tag = document.querySelector('input[name="noteTag"]:checked').value;

  const newNote = {
    id: Date.now(),
    title,
    content,
    tag,
    date: new Date().toISOString(),
  };

  notes.push(newNote);
  saveNotes();
  renderNotes();

  noteForm.reset();
  addNoteModal.classList.remove("active");
  showToast("Note Added Successfully ✅", "success");
});

closeConfirmBtn.addEventListener("click", () => {
  deleteConfirmModal.classList.remove("active");
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteConfirmModal.classList.remove("active");
});

confirmDeleteBtn.addEventListener("click", () => {
  notes = notes.filter((note) => note.id !== deleteNoteId);
  saveNotes();
  renderNotes();
  deleteConfirmModal.classList.remove("active");
  showToast("Deleted Successfully 🗑️", "success");
});

searchInput.addEventListener("input", renderNotes);
filterSelect.addEventListener("change", renderNotes);

renderNotes();

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Remove toast after animation ends
  setTimeout(() => {
    toast.remove();
  }, 4000);
}
