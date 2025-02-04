


function Library() {
    this.books = [];
    
    this.addBook = function(title, author, pages, read=false) {
        const book = Book(title, author, pages, read);
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
                break;
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

