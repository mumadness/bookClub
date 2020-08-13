const socket = io();
const isbnForm = document.getElementById("isbn-form");

isbnForm.addEventListener('submit', e => {

    const isbn = e.target.elements[0].value;
    e.target.elements[0].value = "";
    socket.emit("isbnSubmit", isbn);
})

