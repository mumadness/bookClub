const fetch = require("node-fetch");

const DEVELOPER_KEY = 'QkJMTkYUlZ25C5UTmXHfA';

const helpers = {
    build_url: isbn => {
        return 'https://www.goodreads.com/book/isbn/' + isbn + '?format=xml&key=' + DEVELOPER_KEY;
    }
}


module.exports = {
    show_by_isbn: isbn => {
        const requestURL = helpers.build_url(isbn);
        return new Promise(resolve => resolve(fetch(requestURL)));
    }
}