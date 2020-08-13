const socket = io();



socket.emit("retrieveAllBooks");

socket.on("displayAllBooks", allBooks => {
    const allBooksDiv = document.getElementById('all-books');
    allBooks.forEach(book => {
        const oneBookDiv = document.createElement('tr');
        oneBookDiv.className = 'one-book';
        for (let attr in book){
            const elem = document.createElement('td');
            elem.className = attr;
            const content = document.createTextNode(book[attr]);
            elem.appendChild(content);
            oneBookDiv.appendChild(elem);
        }

        /********       Create remove button        *******/
        const removeWrapper = document.createElement('td');
        removeWrapper.className = 'remove-wrapper';

        const removeForm = document.createElement('form')
        removeForm.setAttribute('class', 'remove-form');
        removeForm.setAttribute('action', '/all_books');
        removeForm.setAttribute('method', 'GET');

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        const removeText = document.createTextNode('Remove');

        /* Set appropriate parent-child relations for DOM */
        removeButton.appendChild(removeText);
        removeForm.appendChild(removeButton);
        removeWrapper.appendChild(removeForm);

        oneBookDiv.appendChild(removeWrapper);

        allBooksDiv.appendChild(oneBookDiv);
    })


    /*****   Add event listener for form submit       *****/
    document.querySelectorAll('.remove-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const parentToRemove = e.target.parentElement.parentElement;
            const bookTitle = parentToRemove.childNodes[0].innerHTML;
            socket.emit('removeBook', bookTitle)

            parentToRemove.remove();

            const removeNotifWrapper = document.getElementById('remove-notification');
            removeNotifWrapper.innerHTML = `'${bookTitle}' has been deleted from the collection`;
            setTimeout(() => {
                removeNotifWrapper.innerHTML = '';
            }, 3000)

            if (document.querySelectorAll('.remove-form').length == 0){
                document.getElementById('all-books').remove();

                const emptyCollectionMessageWrapper = document.createElement('h2');
                const emptyMessage = document.createTextNode("Empty book collection.");
                emptyCollectionMessageWrapper.appendChild(emptyMessage);
                document.body.appendChild(emptyCollectionMessageWrapper);
            }
        })
    })


})

