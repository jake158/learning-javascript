"use strict";

function Book(title, author, pages, wasRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.wasRead = wasRead;

    this.info = function () {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${wasRead ? "was read" : "not read yet"}`;
    }
}

let theHobbit = new Book("The Hobbit", "Tolkien", 355, true);
console.log(theHobbit.info());
