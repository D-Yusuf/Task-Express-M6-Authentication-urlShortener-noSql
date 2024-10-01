const User = require("../models/User")
const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
require("dotenv").config()

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

const JwtStrategy = new JWTStrategy(
{
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
},
async (payload, done) => {
    try {
    const user = await User.findById(payload._id);
    if (!user) return done({ messsage: "User is not Found" });

    const expiry = new Date(payload.exp * 1000); // It converts the expiration timestamp from the JWT (which is in seconds) to millisecond
    const now = new Date();
    if (now > expiry) return done({ message: "Token expired" });

    return done(null, user); //req.user
    } catch (error) {
    return done(error);
    }
}
);

module.exports = {localStrategy, JwtStrategy}