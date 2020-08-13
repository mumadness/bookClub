const socket = io();

const bookRecForm = document.getElementById("book-rec-form");

bookRecForm.addEventListener("submit", e => {
    try{
        const inputVal = parseInt(e.target.elements[0].value);
        e.target.elements[0].value = '';

        //NaN => Not a Number
        if (isNaN(inputVal)){
            e.preventDefault();
            throw new TypeError("Input must be a number");
        }

        //Out of range handling
        if (inputVal < 1 || inputVal > 5){
            e.preventDefault()
            throw new RangeError("Input must be within range (1-5)")
        }

        socket.emit("recommend_books", inputVal);

    } catch (err) {
        //get error-message element
        const errorMessage = document.getElementById('error-message');

        //print error message to screen
        errorMessage.innerHTML = `${err.name}: ${err.message}`;
        
        //makes it disappear after 3 secs
        setTimeout(() => {
            errorMessage.innerHTML = ''
        }, 3000);
    }
})