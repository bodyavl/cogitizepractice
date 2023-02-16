const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
function connect()
{
    try {
        mongoose.connect('mongodb+srv://bodyavl:TBSmYNicB7HeSWgd@cluster0.3zcezdx.mongodb.net/?retryWrites=true&w=majority')
        console.log('Connected to mongodb')
    } catch (error) {
        console.log('Error occured: ', error.message);
    }
}

connect();