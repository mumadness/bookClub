module.exports = {
    getEssentialInfo: async(bookObj) => {
        const bookInfo = bookObj.GoodreadsResponse.book;
        //data to print
        const essentialInfo = {
            title: bookInfo.title,
            author: bookInfo.authors.author.name,
            isbn: bookInfo.isbn,
            isbn13: bookInfo.isbn13,
            publication_time: `${bookInfo.publication_year}-${bookInfo.publication_month}-${bookInfo.publication_day}`,
            description: bookInfo.description.replace(/<.+>/g, ''), //regex replace any potential markup tags with empty string
            average_rating: bookInfo.average_rating,
            similar_books: bookInfo.similar_books
        }

        return new Promise(resolve => resolve(essentialInfo));
    }
}