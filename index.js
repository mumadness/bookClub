if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const http = require("http");
const moment = require("moment")
//const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

//talk to goodreads, get data
const goodreadsAPI = require("./modules/api.js");

//parser to parse xml and eventually convert to js object
const xmlParser = require("./modules/xml_to_js_obj.js");

//parse_info for extraction of information
const parseInfo = require("./modules/parse_info.js")

//router to process different requests
const router = require("./modules/router.js");

//mongodb driver module
const mongodb = require("./modules/mongodb.js");
const { MongoError } = require("mongodb");
mongodb.connect(); //custom mongodb module to establish connection

//middleware function to process static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded( {extended: false }));

// app.set('views', __dirname + '/public/views');
// app.set('view engine', 'ejs');

// while socket.io is connected
io.on('connection', socket => {

    //broadcast to all other users on new user
    socket.on('userConnect', username => {
        socket.username = username;
    });

    socket.on('chatMessage', (msg) => {
        //set all message object attributes here
        const message = {
            sender: socket.username,
            txt: msg,
            time: moment().format('h:mm a | MMM D')
        }

        //storing data, specify { type: 'message' }
        mongodb.storeData(message, 'message')
        

        socket.broadcast.emit('appendChatMessage', message)
        socket.emit('selfMessage', message)
    })

    socket.on('isbnSubmit', async(isbn) => {
        const essentialInfo = await helper.isbnToBookObj(isbn);
        io.emit("displayEssentialInfo", essentialInfo);
    })

    socket.on("writeToDB", dataToStore => {
        //storing data, specify { type: 'book' }
        mongodb.storeData(dataToStore, 'book')
    })

    socket.on("retrieveAllBooks", async() => {
        //display all books
        io.emit("displayAllBooks", await mongodb.displayBookData());
    })

    socket.on("removeBook", bookTitle => {
        mongodb.removeBook(bookTitle);
    })

    socket.on("recommend_books", async(number) => {
        const booksRecommended = await mongodb.recommendBooks(number);
        io.emit("displayBookRecs", booksRecommended);
    })

    socket.on("addRecommendedBook", async(isbn) => {
        const book = await helper.isbnToBookObj(isbn);
        mongodb.storeData(book, 'book');
    })
})

/************* A helper module, to avoid code duplication ****************/

/** function that automates the fetch -> ... -> bookInfo process **/
const helper = {
    isbnToBookObj: async(isbn) => {
        try {
            //imported custom goodreads module to get data
            const fetchedResult = await goodreadsAPI.show_by_isbn(isbn) // returns resolved Promise
            const fetchedString = await fetchedResult.text();

            //imported custom module to convert xml to JS object
            const bookObj = await xmlParser.toJSObject(fetchedString)

            //extract essential info for display and store in db
            const essentialInfo = await parseInfo.getEssentialInfo(bookObj)

            return new Promise(resolve => resolve(essentialInfo));

        } catch(e) {
            console.log(`${e.name}: ${e.message}`);
        }   
    }
}



app.use('/', router);


const PORT = process.env.PORT || 3000;

server.listen(PORT);


