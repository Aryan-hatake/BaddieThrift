import express from 'express'
import authRouter from './routes/auth.route.js';
import cors from 'cors'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import config from './config/config.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import productRouter from './routes/product.route.js';

const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.GoogleClientID,
  clientSecret: config.GoogleClientSecret,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use("/api/auth",authRouter)
app.use("/api/product",productRouter)

export default app;