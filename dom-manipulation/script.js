// Initial quotes array with categories
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" }
];

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];
  
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p>"${quoteObj.text}"</p>
    <small>— ${quoteObj.category}</small>
  `;
}

// Add a new quote from user input
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear inputs after adding
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please fill in both fields.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Show an initial quote when the page loads
showRandomQuote();
