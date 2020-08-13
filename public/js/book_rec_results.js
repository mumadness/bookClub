const socket = io();

socket.on("displayBookRecs", books => {
    displayBookRecs(books)
})

function displayBookRecs(books) {
    const resultsTable = document.getElementById("results-table");
    
    for (let i=0; i<books.length; i++) {
        const bookRow = document.createElement('tr');
        bookRow.className = 'book-content';
        
        const title = document.createElement('td');
        title.className = 'title';
        title.innerHTML = books[i].title;

        const author = document.createElement('td');
        author.className = 'author';
        author.innerHTML = books[i].authors.author.name;

        const viewMoreButton = document.createElement('button');
        viewMoreButton.className = 'add-book-button';
        viewMoreButton.innerHTML = 'Add to Collection';
        viewMoreButton.setAttribute('index', i);

        bookRow.appendChild(title);
        bookRow.appendChild(author);
        bookRow.appendChild(viewMoreButton);

        resultsTable.appendChild(bookRow);
    }

    /************* Event handler for Add button *****************/
    document.querySelectorAll(".add-book-button").forEach(button => {
        button.addEventListener("click", e => {
            const isbn = books[e.target.getAttribute('index')].isbn;
            socket.emit('addRecommendedBook', isbn);

            const parent = e.target.parentElement;
            //show success message
            const successMessageElement = document.getElementById('add-success-message')
            successMessageElement.innerHTML = `'${parent.children[0].innerHTML}' has been added to the collection!`
            setTimeout(() => {
                successMessageElement.innerHTML = ''
            }, 3000);

            //delete element
            e.target.parentElement.remove(); 

            //if no more book recs
            if (document.getElementsByClassName('book-content').length == 0){
                resultsTable.remove();

                const bookRecResults = document.getElementById('book-rec-results');
                const noMoreRecs = document.createElement('p');
                noMoreRecs.innerHTML = "No more book recommendations";
                bookRecResults.appendChild(noMoreRecs);
            }
        })
    })
}