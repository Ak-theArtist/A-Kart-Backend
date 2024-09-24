const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log('Mongodb is Connected');
    } catch (error) {
        console.error('Database Connection Error:', error); 
        process.exit(1);  
    }
};
module.exports = dbConnect;
