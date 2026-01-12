import mongoose from "mongoose";


export const connection = ()=>{
    console.log("Mongo URI:", process.env.MONGO_URI);

    mongoose.connect(process.env.MONGO_URI,{
        dbName:"JOB_DEKHO",
    }).then(() => {
        console.log("Connected to MongoDB.")
    }).catch(err => {
        console.log(`some error occured while connecting to databse: ${err}`);
    })
}


// import mongoose from "mongoose";
// import { config } from "dotenv";

// config({ path: "../config/.env" });

// const connectDB = async () => {
//   const MONGO_URI = process.env.MONGO_URI;

//   let retries = 5;
//   while (retries) {
//     try {
//       await mongoose.connect(MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 5000,
//       });
//       console.log("MongoDB connected successfully");
//       return;
//     } catch (error) {
//       console.error(`Connection failed, ${retries} retries left...`, error.message);
//       retries -= 1;
//       await new Promise(res => setTimeout(res, 5000));
//     }
//   }

//   throw new Error("Could not connect to MongoDB after several attempts.");
// };

// export default connectDB;