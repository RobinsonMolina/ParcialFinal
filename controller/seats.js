// seats.js

const seatsContainer = document.getElementById('seats');

// Renderizar asientos
for (let i = 1; i <= 100; i++) {
    const seat = document.createElement('button');
    seat.className = 'btn btn-outline-secondary seat';
    seat.textContent = i;
    seat.onclick = () => reserveSeat(i);
    seatsContainer.appendChild(seat);
}

// Reservar asiento
async function reserveSeat(seatNumber) {
    const seatBtn = document.querySelector(`.seat:nth-child(${seatNumber})`);
    if (seatBtn.classList.contains('btn-danger')) {
        alert('Este asiento ya está reservado.');
        return;
    }

    const customer = prompt('Ingrese su nombre:');
    if (!customer) return;

    try {
        await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seat: seatNumber, customer }),
        });
        seatBtn.classList.remove('btn-outline-secondary');
        seatBtn.classList.add('btn-danger');
        seatBtn.disabled = true;
    } catch (error) {
        alert('Error al reservar el asiento.');
    }
}

// Obtener informe
async function getReport() {
    try {
        const response = await fetch('/api/report');
        const report = await response.json();
        document.getElementById('report').innerHTML = `
            <h2>Informe de taquilla</h2>
            <p>Boletas Vendidas: ${report.seatsSold}</p>
            <p>Ventas Totales: $${report.totalSales}</p>
            <p>Porcentaje de Ocupación: ${report.occupancy}</p>
        `;
    } catch (error) {
        alert('Error al obtener el informe.');
    }
}

// Actualizar asientos reservados desde el servidor
async function updateReservedSeats() {
    const response = await fetch('/api/reservations');
    const reservations = await response.json();
    reservations.forEach(reservation => {
        const seatBtn = document.querySelector(`.seat:nth-child(${reservation.seat})`);
        if (seatBtn) {
            seatBtn.classList.remove('btn-outline-secondary');
            seatBtn.classList.add('btn-danger');
            seatBtn.disabled = true;
        }
    });
}

updateReservedSeats();
