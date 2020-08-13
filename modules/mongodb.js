const { MongoError } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.SESSION_SECRET}:${process.env.MONGO_PASSWORD}@bookclub.j1vyn.gcp.mongodb.net/local?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const helpers = {
    retrieveAllBooks: async() => {
        const bookClubDB = client.db('bookClub');
        return bookClubDB.collection('books').find().toArray();
    },

    allSimilarBooks: async() => {
        //next values dependent on this operation, await used
        const allBooks = await helpers.retrieveAllBooks();

        const allSimilars = [];
        allBooks.forEach(ownedBook => {
            ownedBook.similar_books.book.forEach(similarBook => {
                allSimilars.push(similarBook)
            })
        })
        return new Promise(resolve => resolve(allSimilars));
    },

    getRandomIndex: async(MAX) => {
        return new Promise(resolve => { resolve(Math.floor(Math.random() * MAX))});
    }
}



module.exports = {
    connect: async() => {
        client.connect();
    },

    // data storing template, can receive three unique types:
    // type: [ book, member, message]
    storeData: async(data, type) => {
        collectionName = '';
        if (type == "book"){
            collectionName = 'books';
        } else if (type == "message") {
            collectionName = 'chats';
        } else {
            collectionName = 'members';
        }
        //if connected to the cluster
        if (client.isConnected()){
            // create/get db
            const bookClubDB = client.db('bookClub');

            //grab collection
            bookClubDB.collection(collectionName, {strict: true}, async(err, coll) => {
                if (err){ //if collection does not exist
                    await bookClubDB.createCollection(collectionName);
                    coll = bookClubDB.collection(collectionName);
                }

                try {
                    if (collectionName == "books") {
                        if (bookClubDB.collection(collectionName).find({title: data.title}).count() > 0)
                            throw MongoError("Item already exists in collection");
                    }
                    coll.insertOne(data);
                } catch (error) {
                    console.log(`${error.name}: ${error.message}`);
                }
                
            })
        }
    },

    displayBookData: async() => {
        //retrieve all books in the 'books' collection
        const allBooks = await helpers.retrieveAllBooks();
        
        //simplify displaying info
        const toDisplay = [];
        allBooks.forEach(book => {
            thisObject = {};
            thisObject.title = book.title;
            thisObject.author = book.author;
            toDisplay.push(thisObject);
        })

        //must resolve promise for new array for expected behavior
        return new Promise(resolve => resolve(toDisplay));
    },

    removeBook: (bookTitle) => {
        const booksColl = client.db('bookClub').collection('books');

        //delete from db collection
        booksColl.deleteOne({'title': bookTitle});
    },

    

    recommendBooks: async(amount) => {
        let bookRecs = [];
        const allSimilars = await helpers.allSimilarBooks();

        //get random index 'amount' of times
        for (let i=amount; i>0; i--){

            //allSimilars.length updates with every iteration, will never be out of range
            const randomIndex = await helpers.getRandomIndex(allSimilars.length);
            const randomBook = allSimilars[randomIndex];
            bookRecs.push(randomBook);

            //delete from allSimilar, to avoid duplicate book recs
            allSimilars.splice(randomIndex, 1);
        }

        return new Promise(resolve => resolve(bookRecs));
    },

    getCorrectUser: async(username) => {
        users = client.db('bookClub').collection('members');
        return new Promise((resolve, reject) => {
            users.findOne({name: username}, (err, result) => {
                if (err){
                    console.log(err)
                }
                if (!result){
                    resolve('user not found')
                }
                resolve(result);
            })
        })
    }
};