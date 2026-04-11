import app from "./src/app.js";
import connectToDB from "./src/config/db.js";
const port = 3000;


connectToDB()
app.listen(port,()=>{
    console.log("server is running on port 3000")
})