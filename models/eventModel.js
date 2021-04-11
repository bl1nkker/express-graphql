const mongoose = require('mongoose')
// This is autopopulate models! (Cool Stuff!)
const autopopulate = require('mongoose-autopopulate')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        autopopulate: true
    }
})

eventSchema.plugin(autopopulate)

module.exports = mongoose.model('eventModel', eventSchema)

