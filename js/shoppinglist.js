const ul = document.querySelector("ul");
const input = document.querySelector("input");
const button = document.querySelector("button");

function onClick() {
    let value = input.value;
    input.value = '';

    let li = document.createElement("li");
    let span = document.createElement("span");
    let btn = document.createElement("button");

    li.appendChild(span);
    li.appendChild(btn);

    span.textContent = value;
    btn.textContent = "delete";

    ul.appendChild(li);

    btn.addEventListener('click', () => ul.removeChild(li));
    input.focus();
}

button.addEventListener('click', onClick);
