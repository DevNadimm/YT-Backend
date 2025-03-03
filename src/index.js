import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.error("ERROR ", error);
        throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at port: ${process.env.PORT || 8000}`);
    })
})
.catch((err) => {
    console.error("MongoDB connection failed! ", err);
})















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