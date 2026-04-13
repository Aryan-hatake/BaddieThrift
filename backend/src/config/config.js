import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw Error("MONGO URI NOT PROVIDED")
}
if(!process.env.JWT_SECRET){
    throw Error("JWT SECRET NOT PROVIDED")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw Error("GOOGLE CLIENT ID NOT PROVIDED")
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw Error("GOOGLE CLIENT SECRET NOT PROVIDED")
}
if(!process.env.IMAGEKIT_PRIVATE_KEY){
      throw Error("IMAGE KIT PRIVATE KEY NOT PROVIDED")
}

const config = {
    MongoURI : process.env.MONGO_URI,
    GoogleClientID : process.env.GOOGLE_CLIENT_ID,
    GoogleClientSecret : process.env.GOOGLE_CLIENT_SECRET,
    JWTSecret : process.env.JWT_SECRET,
    ImageKitPrivateKey : process.env.IMAGEKIT_PRIVATE_KEY
}

export default config