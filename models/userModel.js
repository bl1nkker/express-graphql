const mongoose = require('mongoose')
// This is autopopulate models! (Cool Stuff!)
const autopopulate = require('mongoose-autopopulate')

const userSchema = new mongoose.Schema({ 
    email: {
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    // It's a list of items (actually list of event's ids)
    createdEvents: [ 
        // So, every items will contain this properties
        {
            // Event's id
            type: mongoose.Schema.Types.ObjectId,
            // And reference to a event model (IDK what this actually means. Maybe some semantical for NodeJS)
            ref: 'eventModel',
            autopopulate: true
            
        } 
    ]
})

userSchema.plugin(autopopulate)

module.exports = mongoose.model('userModel', userSchema)