let mongoose = require('mongoose');

// Create a model
let contactModel = mongoose.Schema(
    {
    name: String,
    address: String,
    phone_number: String
},
{
    collection: "phonebook"
}
);
module.exports = mongoose.model('contact', contactModel);
