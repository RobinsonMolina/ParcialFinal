const path = require('path');
const express = require('express');
const Reservation = require('./models/reservation');
require('./drivers/connect_db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/controller', express.static(path.join(__dirname, 'controller')));
app.use(express.json());

app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
});

app.post('/api/reservations', async (req, res) => {
    const { seat, customer } = req.body;

    if (!seat || !customer) {
        return res.status(400).json({ error: 'Se requiere el asiento y el cliente.' });
    }

    const existingReservation = await Reservation.findOne({ seatNumber: seat });
    if (existingReservation) {
        return res.status(400).json({ error: 'Este asiento ya está reservado.' });
    }

    const newReservation = new Reservation({
        seatNumber: seat,
        isAvailable: false,
        userId: customer,
    });

    try {
        await newReservation.save();
        res.status(201).json({ message: 'Reserva creada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
});

app.get('/api/report', async (req, res) => {
    try {
        const reservations = await Reservation.find({ isAvailable: false });
        const seatsSold = reservations.length;
        const totalSales = seatsSold * 15000;
        const occupancy = ((seatsSold / 100) * 100).toFixed(2);

        res.json({
            seatsSold,
            totalSales,
            occupancy: `${occupancy}%`,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el informe' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
