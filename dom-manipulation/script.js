
// --- Initial quotes (used only if no localStorage data exists) ---
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// Load quotes from localStorage if available
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`; // reset

  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Show a random quote (filtered if category is selected) & save last viewed
function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quoteObj = filteredQuotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quoteObj.text}"</p>
    <small>— ${quoteObj.category}</small>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quoteObj));
}

// Filter quotes and save filter preference
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Dynamically create the Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Add a new quote and update categories if needed
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories(); // update category dropdown

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Export quotes as a JSON file
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

// --- Initialization ---
loadQuotes();
createAddQuoteForm();
populateCategories();
showRandomQuote();

//something new is coming

// ====== Step 1: Simulated server ======
// We'll use JSONPlaceholder's posts API as "quotes"
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ====== Step 2: Sync function ======
async function syncQuotes() {
  try {
    // Fetch from server
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    // Get local quotes
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Conflict resolution: server wins
    // Overwrite local with server data
    localStorage.setItem("quotes", JSON.stringify(serverQuotes));

    // Inform user
    console.log("Quotes synced from server. Conflicts resolved: Server version kept.");
    showNotification("Quotes updated from server.");
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// ====== Step 3: Push new quotes ======
async function pushQuote(newQuote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote),
    });

    const savedQuote = await response.json();
    console.log("Quote saved on server:", savedQuote);

    // Add locally too
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    localQuotes.push(savedQuote);
    localStorage.setItem("quotes", JSON.stringify(localQuotes));

    showNotification("New quote synced to server.");
  } catch (error) {
    console.error("Error pushing quote:", error);
  }
}

// ====== Step 4: Notification helper ======
function showNotification(message) {
  const div = document.createElement("div");
  div.textContent = message;
  div.style.background = "#222";
  div.style.color = "#fff";
  div.style.padding = "10px";
  div.style.position = "fixed";
  div.style.bottom = "10px";
  div.style.right = "10px";
  div.style.borderRadius = "5px";
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// ====== Step 5: Auto-sync every 30s ======
setInterval(syncQuotes, 30000);
