const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator');
const newUserSchema = mongoose.Schema({  
  email: { type: String, required: true, unique: true },
  
  password: { type: String, required: true}
})

newUserSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", newUserSchema) 