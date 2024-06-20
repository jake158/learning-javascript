'use strict';
const myLibrary = [];
const booksList = document.querySelector('.books');

const newBookButton = document.querySelector('.new');
const newBookDialog = document.querySelector('#newbook');
const cancelButton = document.querySelector('#cancelbutton');
const submitButton = document.querySelector('#submitbutton');


class Book {

    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    render(id, renderBookCallback, removeBookCallback) {
        const bookEntry = document.createElement('tr');

        for (const attr in this) {
            if (this.hasOwnProperty(attr)) {
                const td = document.createElement('td');
                attr === 'read' ? td.appendChild(this.#createReadButton(renderBookCallback)) : td.textContent = this[attr];
                bookEntry.appendChild(td);
            }
        }
        bookEntry.appendChild(this.#createRemoveButton(id, removeBookCallback));
        return bookEntry;
    }

    #createReadButton(renderBookCallback) {
        const button = document.createElement('button');
        button.textContent = this.read ? "True" : "False";
        button.style.color = this.read ? "green" : "red";
        button.addEventListener('click', () => {
            this.#flipRead(renderBookCallback);
        });
        return button;
    }

    #flipRead(renderBookCallback) {
        this.read = !this.read;
        renderBookCallback();
    }

    #createRemoveButton(id, removeBookCallback) {
        const removeButton = document.createElement('button');
        removeButton.textContent = 'x';
        removeButton.classList.add('removebtn');
        removeButton.addEventListener('click', () => {
            removeBookCallback(id);
        });
        const td = document.createElement('td');
        td.appendChild(removeButton);
        return td;
    }
}


function addBook(book) {
    myLibrary.push(book);
    displayBooks();
}

function removeBook(id) {
    myLibrary.splice(id, 1);
    displayBooks();
}

function displayBooks() {
    booksList.innerHTML = '';
    myLibrary.forEach((book, id) => {
        booksList.appendChild(book.render(id, displayBooks, removeBook));
    });
}

const hobbit = new Book("The Hobbit", "Tolkien", 365, true);
const hp = new Book("Harry Potter: Something something stone", "JKR", 256, false);
addBook(hobbit);
addBook(hp);


newBookButton.addEventListener('click', () => {
    newBookDialog.showModal();
});

cancelButton.addEventListener('click', () => {
    newBookDialog.close("Book not added");
});

newBookDialog.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const read = document.getElementById('read').checked;

    const newBook = new Book(title, author, pages, read);
    addBook(newBook);
    newBookDialog.close();
});
