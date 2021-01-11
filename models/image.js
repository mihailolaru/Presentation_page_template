const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const ImageSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    img: 
      { data: Buffer, contentType: String }
});

//create collection and add schema
mongoose.model('image', ImageSchema);

//The way described in the mongoose documentation documentation
// const Image = mongoose.model('Image', BookSchema);
// module.exports = Image;