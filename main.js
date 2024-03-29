// Book Class : Represents a book

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class : Handles UI interactions

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");

    div.className = `col-6 mx-auto alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".col-lg-6");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 1000);
  }

  static clearForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

// Store Class: Handles Storage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
// Event: Add a Book

document.querySelector("#book-form").addEventListener("submit", e => {
  //Prevent Actual submit
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate

  if (title === "" || author === "" || isbn === "") {
    // alert("Please fill in all the fields");
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    //Instatiate a book

    const book = new Book(title, author, isbn);
    console.log(book);

    //Add book to UI

    UI.addBookToList(book);

    //Add book to store

    Store.addBook(book);

    //Show Success message

    UI.showAlert("Book Added", "success");

    //Clear forms
    UI.clearForm();
  }
});

// Event: Remove a book

document.querySelector("#book-list").addEventListener("click", e => {
  //Remove book from UI
  UI.deleteBook(e.target);
  //Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert("Book Removed", "warning");
});
