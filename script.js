const bookTable = document.querySelector(".book-display");

bookTable.addEventListener("click", function(event) {
    if (event.target.matches(".read-toggle")) {
        changeReadStatus(event.target);
    }
});




function Library() {
    this.books = [];
    
    this.addBook = function(title, author, pages, read=false) {
        const book = new Book(title, author, pages, read);
        this.books.push(book);
    };

    this.removeBook = function(title, author) {
        let newArray = [];
        let found = false;
        for (let i = 0; i < this.books.length; i += 1) {
            const book = this.books[i];
            if (found || (book.title !== title || book.auhtor !== author)) {
                newArray.push(book);
            } else if (!found && (book.title === title && book.author === author)) {
                found = true;
            }
        }
        this.books = newArray;
    };

    this.toggleRead = function(title, author) {
        for (let i = 0; i < this.books.length; i += 1) {
            const book = this.books[i];
            if (book.title === title && book.author === author) {
                book.toggleRead();
                return book;
            }
        }
    };
}



function Book(title, author, pages, read=false) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
};

Book.prototype.toggleRead = function() {
    this.read = !this.read;
};

Book.prototype.getReadStatus = function() {
    if (this.read) {
        return "Read";
    }
    return "Not yet read";
}



const library = new Library();

library.addBook("The Dragon Reborn", "Robert Jordan", "624", true);
library.addBook("War and Peace", "Leo Tolstoy", "1,225", false);

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
    const title = document.querySelector(`.title-${bookId}`).innerText;
    const author = document.querySelector(`.author-${bookId}`).innerText;
    const readDiv = document.querySelector(`.read-${bookId}`);
    const changedBook = library.toggleRead(title, author);
    readDiv.innerText = changedBook.getReadStatus();
}