const {default: mongoose } = require("mongoose");

const dbConnect =() => {
    try{
    const connection = mongoose.connect(process.env.MONGODB_URL)
    console.log('Mongodb is Connected')
    } catch (error) {
        console.log('Database Error')
    }
};

module.exports= dbConnect;