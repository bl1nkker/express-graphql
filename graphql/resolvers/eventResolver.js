const EventModel = require('../../models/eventModel.js')
const UserModel = require('../../models/userModel.js')

const TEMP_USER_ID = '60648bedae29dd2ef87146dc'

exports.getEventList = async() => {
    try {
        // We used populate() here, because we identifyed "ref: UserModel" prop in the eventModel.js
        // so now we can get all the data about user (UserModel), with just the user._id
        const events = await EventModel.find()
        return events
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.createEvent = async(params, req) => {
    // With this check, we protect our resolvers from unauthorized users!
    // (req.isAuth comes from authMiddleware.js. It's custom property)
    if (!req.isAuth){
        throw new Error("You don't have any permission to do this!")
    }
    // Event data comes from RootMutations -> createEvent
    const eventData = params.eventInput
    const newEvent = new EventModel({ ...eventData, creator: req.userId })
    console.log(newEvent)
    try {
        // If all fine, firstly we add eventId to user that created this event
        const creator = await UserModel.findById(req.userId)
        creator.createdEvents.push(newEvent._id)
        await creator.save()
        // And then we create event at the database
        await newEvent.save()
        
        return newEvent
    } catch (error) {
        console.log(error)
        throw error
    }
}