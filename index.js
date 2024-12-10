// index.js (Servidor con Node.js y Express)
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos de la carpeta public
app.use(express.static('public'));
app.use(express.json()); // Para manejar JSON en las solicitudes

// Datos simulados (esto normalmente estaría en una base de datos)
const totalSeats = 32; // Asientos disponibles en el cine
let reservations = [];

const path = require('path');
app.use('/controller', express.static(path.join(__dirname, 'controller')));


// Ruta para obtener las reservas actuales
app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});

// Ruta para agregar una nueva reserva
app.post('/api/reservations', (req, res) => {
  const { seat, customer } = req.body;

  if (!seat || !customer) {
    return res.status(400).json({ error: 'Se requiere el asiento y el cliente.' });
  }
  if (seat < 1 || seat > totalSeats) {
    return res.status(400).json({ error: 'El asiento no existe.' });
  }
  if (reservations.some(res => res.seat === seat)) {
    return res.status(400).json({ error: 'Este asiento ya está reservado.' });
  }

  reservations.push({ seat, customer });
  res.status(201).json({ message: 'Reserva creada correctamente.' });
});

// Ruta para obtener un informe de taquilla
app.get('/api/report', (req, res) => {
  const seatsSold = reservations.length;
  const totalSales = seatsSold * 10; // Ejemplo: cada asiento cuesta $10
  const occupancy = ((seatsSold / totalSeats) * 100).toFixed(2);

  res.json({
    seatsSold,
    totalSales,
    occupancy: `${occupancy}%`,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
