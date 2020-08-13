const LocalStrategy = require('passport-local').Strategy;
const mongodb = require("./mongodb.js");
const bcrypt = require("bcrypt");

function initialize(passport, getCorrectUser) {
    const getUser = async(username, password, done) => {
        try{
            //retrieve correct user from db
            const user = await getCorrectUser(username)

            //if user is not found
            if (user == "user not found"){
                done(null, false, { message: "no such user found"} )
            } 
            else //if user found
            {
                if (await bcrypt.compare(password, user.password)){
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Password incorrect" });
                }
            }

        } catch(e) {
            return done(e);
        }
        
    }
    passport.use(new LocalStrategy(getUser));
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => { done(null, user)});
}

module.exports = initialize;