import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})
const app = express();

connectDB();















/* 🚀 Basic approach

(
    async () => {
        try{
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

            app.on("error", (error) => {
                console.error("ERROR ", error);
                throw error;
            });

            app.listen(process.env.PORT || 3000, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            });
            
        } catch (err){
            console.error("ERROR ", err);
            throw err;
        }
    }
)()

*/