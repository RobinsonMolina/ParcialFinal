const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    seatNumber: String,
    isAvailable: Boolean,
    room: String,
    price: Number,
    userId: String,
    reservedAt: { type: Date, default: Date.now },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
