// Require mongoose
var mongoose = require('mongoose');

// Saved reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    intro: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }    
});

// Create Article model from above schema using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export Article model
module.exports = Article;