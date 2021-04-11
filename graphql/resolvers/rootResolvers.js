const eventResolver = require('./eventResolver')
const bookingResolver = require('./bookingResolver.js')
const userResolver = require('./userResolver.js')

const root = {
    // Event Resolvers
    events: eventResolver.getEventList,
    createEvent: (params, req) => eventResolver.createEvent(params, req),

    // Booking resolvers
    bookings: (params, req) => bookingResolver.getBookinglist(params, req),
    bookEvent: (params, req) => bookingResolver.bookEvent(params, req),
    unbookEvent: (params, req) => bookingResolver.unbookEvent(params, req),

    // Create User resolver
    signUpUser: (params) => userResolver.signUpUser(params),
    signInUser: (params) => userResolver.signInUser(params)

}

module.exports = root