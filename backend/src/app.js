import express from 'express'
import authRouter from './routes/auth.route.js';
import cors from 'cors'
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import config from './config/config.js';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import path from 'path';
import { fileURLToPath } from "url";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin:config.Domain,
    credentials:true
}))

app.use(express.json());
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'));

app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: config.GoogleClientID,
  clientSecret: config.GoogleClientSecret,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.get("/health",(req,res)=>{
    res.send("good health")
})
app.use("/api/auth",authRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)


app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname,"..","./public/index.html"));
});
export default app;