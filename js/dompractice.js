const container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

const red = document.createElement("p");
red.style.color = "red";
red.textContent = "I'm red!";
container.appendChild(red);

const h3 = document.createElement("h3");
h3.style.color = "blue";
h3.textContent = "I'm a blue h3!";
container.appendChild(h3);

const div = document.createElement("div");

const h1Div = document.createElement("h1");
h1Div.textContent = "I'm in a div";
div.appendChild(h1Div);

const p = document.createElement("p");
p.textContent = "ME TOO!";
div.appendChild(p);

container.appendChild(div);
