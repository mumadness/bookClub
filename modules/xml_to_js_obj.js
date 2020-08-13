const parser = require("xml2json")

//parses xml to json, and then converts to JS object
module.exports = {
    toJSObject: async(xml) => {
        const json = parser.toJson(xml)
        let obj = JSON.parse(json)
        return obj;
    }
}