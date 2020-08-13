const socket = io();

socket.on("displayEssentialInfo", essentialInfo => {
    // Object.assign(bookInfo, essentialInfo);
    // console.log(bookInfo)
    // Object.assign(bookRecs, similarBooks);
    // console.log(bookRecs)
    displayEssentialInfo(essentialInfo)

    const confirmationForm = document.getElementById('confirmation-form');

    confirmationForm.addEventListener('submit', e => {
        socket.emit('writeToDB', essentialInfo)
    })
})

//socket.on("")


//DOM to display essential book info
function displayEssentialInfo(essentialInfo) {
    //makes success message
    const successMsgElement = document.getElementById("success-msg")
    const successMsg = document.createTextNode(`Would you like to add '${essentialInfo.title}' to your collection?`)
    successMsgElement.appendChild(successMsg)

    //book essential information
    const bookInfoTable = document.getElementById("book-info-table")

    //iterate thru each key:value pair in obj, append to html page
    for (let key in essentialInfo) {
        //create row for each book object attribute in table
        const attributeElement = document.createElement("tr")
        attributeElement.className = "book-object-attribute"

        //key column for attribute
        const keyElement = document.createElement("td")
        keyElement.className = 'key'
        const attrKey = document.createTextNode(key)
        keyElement.appendChild(attrKey)

        //value column ...
        const valElement = document.createElement("td")
        valElement.className = 'value'
        const attrVal = document.createTextNode(essentialInfo[key])
        valElement.appendChild(attrVal)

        attributeElement.appendChild(keyElement)
        attributeElement.appendChild(valElement)

        bookInfoTable.appendChild(attributeElement)
    }
}


