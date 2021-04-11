const mongoose = require('mongoose')
// This is autopopulate models! (Cool Stuff!)
const autopopulate = require('mongoose-autopopulate')

const bookingSchema = new mongoose.Schema({
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventModel',
        autopopulate: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        autopopulate: true
    }

}, 
{ timestamps: true })

bookingSchema.plugin(autopopulate)

module.exports = mongoose.model('bookingModel', bookingSchema)