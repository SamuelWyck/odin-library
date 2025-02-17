const bookTable = document.querySelector(".book-display");
const addBookBtn = document.querySelector(".add-book-btn");
const popup = document.querySelector(".form-popup");
const form = document.querySelector("form");

bookTable.addEventListener("click", function(event) {
    if (event.target.matches(".read-toggle")) {
        changeReadStatus(event.target);
    } else if (event.target.matches(".delete-btn")) {
        deleteBook(event.target);
    }
});

addBookBtn.addEventListener("click", function(event) {
    showPopup();
});

popup.addEventListener("click", function(event) {
    if (event.target.matches(".popup-exit")) {
        hidePopup();
    } else if (event.target.matches(".form-submit-btn")) {
        event.preventDefault();
        handleFormSubmit();
    }
});



function Library() {
    this.books = [];
    
    this.addBook = function(title, author, pages, read=false) {
        const book = new Book(title, author, pages, read);
        this.books.push(book);
    };

    this.removeBook = function(title, author) {
        const targetBook = this.getBook(title, author);
        let newArray = [];
        for (let i = 0; i < this.books.length; i += 1) {
            const book = this.books[i];
            if (book !== targetBook) {
                newArray.push(book);
            }
        }
        this.books = newArray;
    };

    this.getBook = function(title, author) {
        for (let i = 0; i < this.books.length; i += 1) {
            const book = this.books[i];
            if (book.title === title && book.author === author) {
                return book;
            }
        }
    };
}



// function Book(title, author, pages, read=false) {
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
// };

// Book.prototype.toggleRead = function() {
//     this.read = !this.read;
// };

// Book.prototype.getReadStatus = function() {
//     if (this.read) {
//         return "Read";
//     }
//     return "Not yet read";
// }

class Book {
    constructor(title, author, pages, read=false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    };

    toggleRead() {
        this.read = !this.read;
    };

    getReadStatus() {
        if (this.read) {
            return "Read";
        }
        return "Not yet read";
    };
};

const library = new Library();

library.addBook("The Dragon Reborn", "Robert Jordan", "624", true);
library.addBook("War and Peace", "Leo Tolstoy", "1225", false);

for (let i = 0; i < library.books.length; i += 1) {
    const book = library.books[i];
    addToBookDisplay(book, i);
}


function addToBookDisplay(book, bookNumber) {
    const titleDiv = createInfoElement(book.title, bookNumber, "title");
    const authorDiv = createInfoElement(book.author, bookNumber, "author");
    const pagesDiv = createInfoElement(book.pages, bookNumber, "pages");
    const readDiv = createInfoElement(book.getReadStatus(), bookNumber, "read");
    const readBtnDiv = createButtonDiv("Toggle Read", "read-toggle", bookNumber);
    const deleteBtnDiv = createButtonDiv("Remove", "delete-btn", bookNumber);

    bookTable.appendChild(titleDiv);
    bookTable.appendChild(authorDiv);
    bookTable.appendChild(pagesDiv);
    bookTable.appendChild(readDiv);
    bookTable.appendChild(readBtnDiv);
    bookTable.appendChild(deleteBtnDiv);
}

function createInfoElement(text, id, classNameStart) {
    const div = document.createElement("div");
    div.innerText = text;
    div.dataset.number = id;
    div.classList.add("grid-item");
    div.classList.add(`${classNameStart}-${id}`);
    return div;
}

function createButtonDiv(text, className, id) {
    const div = document.createElement("div");
    div.dataset.number = id;
    div.classList.add("grid-item");
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.dataset.number = id;
    btn.classList.add(className);
    div.appendChild(btn);
    return div;
}

function changeReadStatus(element) {
    const bookId = element.dataset.number;
    const [title, author] = getTitleAndAuthor(bookId);
    const readDiv = document.querySelector(`.read-${bookId}`);
    const book = library.getBook(title, author);
    book.toggleRead();
    readDiv.innerText = book.getReadStatus();
}

function deleteBook(element) {
    const bookId = element.dataset.number;
    const [title, author] = getTitleAndAuthor(bookId);
    library.removeBook(title, author);
    removeFromDisplay(bookId);
}

function removeFromDisplay(bookId) {
    const infoDivs = document.querySelectorAll(`div[data-number$="${bookId}"]`);
    for (let div of infoDivs) {
        div.remove();
    }
}

function getTitleAndAuthor(bookId) {
    const title = document.querySelector(`.title-${bookId}`).innerText;
    const author = document.querySelector(`.author-${bookId}`).innerText;
    return [title, author];
}

function showPopup() {
    popup.classList.remove("hide-popup")
}

function hidePopup() {
    popup.classList.add("hide-popup");
    form.reset();
    removeErrorMessages();
}

function handleFormSubmit() {
    const formData = getFormData();
    if (typeof formData === "string") {
        handleError(formData);
        return;
    }

    const book = addToLibrary(formData);
    addToBookDisplay(book, library.books.length - 1);
    hidePopup();
}

function addToLibrary(formData) {
    const title = formData["title"];
    const author = formData["author"];
    const pages = formData["pages"];
    const read = formData["read"];

    library.addBook(title, author, pages, read);
    return library.getBook(title, author);
}

function handleError(classPrefix) {
    removeErrorMessages();
    const message = getErrorMessage(classPrefix);
    const label = document.querySelector(`.${classPrefix}-label`);
    label.classList.add("error");
    label.style.setProperty("--content", `'${message}'`);
}

function removeErrorMessages() {
    const labels = document.querySelectorAll("label");
    for (let label of labels) {
        label.classList.remove("error");
    }
}

function getErrorMessage(field) {
    if (field === "title") {
        return "Enter a valid title";
    } else if (field === "author") {
        return "Enter a valid author";
    } else if (field === "pages") {
        return "Enter a valid number";
    }
}

function getFormData() {
    const data = {};
    const formData = new FormData(form);

    const title = formData.get("title").trim();
    if (title === "" || !isNaN(title)) {
        return "title";
    } else {
        data["title"] = title;
    }

    const author = formData.get("author").trim();
    if (author === "" || !isNaN(author)) {
        return "author";
    } else {
        data["author"] = author;
    }

    const pages = formData.get("pages").trim();
    if (pages === "" || isNaN(pages)) {
        return "pages";
    } else {
        data["pages"] = pages;
    }

    const read = formData.get("read");
    if (read === null) {
        data["read"] = false;
    } else {
        data["read"] = true;
    }
    return data;
}