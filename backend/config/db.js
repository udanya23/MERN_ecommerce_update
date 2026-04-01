const mongoose = require("mongoose")
const { GridFSBucket } = require("mongodb")




const connectDB = async (app) => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully");
        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads"
        })
        app.locals.bucket = bucket;
        console.log("grid file storage bucket created successfully");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
module.exports = connectDB;