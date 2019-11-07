// Require mongoose
var mongoose = require('mongoose');

// Saved reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
var NoteSchema = new Schema({
    // title: String,
    body: String
});

// Create model from schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;