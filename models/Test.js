const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const TestSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    questions: [{
        text:{ 
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: false
        }
    }]
});

//create collection and add schema
mongoose.model('tests', TestSchema, 'tests');