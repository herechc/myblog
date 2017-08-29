var mongoose = require('mongoose')
var commentSchema = require('../schemas/comment')

var Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment