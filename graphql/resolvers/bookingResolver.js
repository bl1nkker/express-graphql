const EventModel = require('../../models/eventModel.js')
const BookingModel = require('../../models/bookingModel.js')

exports.getBookinglist = async(params, req) =>{
    // With this check, we protect our resolvers from unauthorized users!
    // (req.isAuth comes from authMiddleware.js. It's custom property)
    if (!req.isAuth){
        throw new Error("You don't have any permission to do this!")
    }
    try {
        // Here we define a variablr, that contains all the "booking" - object from the database
        const bookings = await BookingModel.find({ user:req.userId }).populate(['user','event'])
        // ... and just return it as response
        return bookings
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.bookEvent = async(params, req) =>{
    // With this check, we protect our resolvers from unauthorized users!
    // (req.isAuth comes from authMiddleware.js. It's custom property)
    if (!req.isAuth){
        throw new Error("You don't have any permission to do this!")
    }
    // Get ID of event from params
    const eventId = params.eventId
    // Create new booking - object (TEMP_USER_ID required to be fixed)
    const newBooking = new BookingModel({
        event: eventId,
        user: req.userId
    })
    try {
        // ... and finally save this object at the database
        await newBooking.save()
        return newBooking
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.unbookEvent = async(params, req) => {
    // With this check, we protect our resolvers from unauthorized users!
    // (req.isAuth comes from authMiddleware.js. It's custom property)
    if (!req.isAuth){
        throw new Error("You don't have any permission to do this!")
    }
    // Get ID of event from params
    const bookingId = params.bookingId
    try {
        // Check, if BookingID is really exist...
        const existedBooking = await BookingModel.findById({ _id:bookingId })
        // ... if no, we will throw an error
        if (!existedBooking) throw new Error("Booking with such ID is not exists!")

        // ... if all right, then we will find this object
        const bookedEvent = await EventModel.findById({ _id:existedBooking.event._id })
        // And delete object from database (i think this not so necessary)
        await BookingModel.deleteOne({ _id:bookingId })
        // ... and return booking object as response
        return bookedEvent
    } catch (error) {
        console.log(error)
        throw error
    }
}