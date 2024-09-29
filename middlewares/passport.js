const User = require("../models/User")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy

const localStrategy = new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password"
    },
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username })
            if(!user) return done({message: "username or password incorrect"});
            const isMatched = await bcrypt.compare(password, user.password)
            if(!isMatched) return done({message: "username or password incorrect"});
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
  )

module.exports = {localStrategy}