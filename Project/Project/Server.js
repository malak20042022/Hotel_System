const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' }); 

 const app = require('./App');
const portNumber = process.env.PORT ||5000;

const dbAtlasString = process.env.DB.replace(
    '<db_password>',
    process.env.DB_PASSWORD
);

mongoose.connect(dbAtlasString).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
});

app.listen(portNumber, () => {
    console.log(`Server is running on port ${portNumber}`);
});


