// Set default travel date to today
const dateInput = document.getElementById('travelDate');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
dateInput.min = today;

// Sample bus data
const busData = [
  { id: 1, operator: 'Express Lines',    type: 'AC Sleeper',  rating: 4.5, departure: '08:00', arrival: '13:30', duration: '5h 30m', price: 25 },
  { id: 2, operator: 'Comfort Travels',  type: 'AC Seater',   rating: 4.2, departure: '10:15', arrival: '15:45', duration: '5h 30m', price: 20 },
  { id: 3, operator: 'Luxury Coaches',   type: 'AC Sleeper',  rating: 4.8, departure: '13:00', arrival: '18:15', duration: '5h 15m', price: 35 },
  { id: 4, operator: 'City Connect',     type: 'Non-AC Seat', rating: 3.9, departure: '16:30', arrival: '22:30', duration: '6h 00m', price: 15 },
  { id: 5, operator: 'Star Bus',         type: 'AC Seater',   rating: 4.4, departure: '19:45', arrival: '01:00', duration: '5h 15m', price: 22 },
  { id: 6, operator: 'Royal Rides',      type: 'AC Sleeper',  rating: 4.6, departure: '22:00', arrival: '03:30', duration: '5h 30m', price: 30 },
];

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Swap cities
document.querySelector('.swap-btn').addEventListener('click', () => {
  const from = document.getElementById('fromCity');
  const to = document.getElementById('toCity');
  [from.value, to.value] = [to.value, from.value];
});

// Search form submission
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const from = document.getElementById('fromCity').value;
  const to = document.getElementById('toCity').value;
  if (from === to) {
    alert('Departure and destination cannot be the same');
    return;
  }
  renderBuses();
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
});

// Filter chips
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

function renderBuses() {
  const list = document.getElementById('busList');
  list.innerHTML = busData.map(bus => `
    <div class="bus-card">
      <div class="bus-info">
        <h4>${bus.operator}</h4>
        <div class="bus-type">${bus.type}</div>
        <div class="rating">★ ${bus.rating}</div>
      </div>
      <div class="bus-times">
        <strong>${bus.departure}</strong>
        <span>→ ${bus.arrival}</span>
        <div class="duration">${bus.duration}</div>
      </div>
      <div class="bus-price">
        $${bus.price}<small>per seat</small>
      </div>
      <div class="bus-action">
        <button class="btn btn-primary" onclick="openBooking(${bus.id})">Book Now</button>
      </div>
    </div>
  `).join('');
}

// Booking modal
let selectedBus = null;

function openBooking(busId) {
  selectedBus = busData.find(b => b.id === busId);
  const summary = document.getElementById('bookingSummary');
  const from = document.getElementById('fromCity').value;
  const to = document.getElementById('toCity').value;
  const date = document.getElementById('travelDate').value;

  summary.innerHTML = `
    <div><span>Operator</span><span>${selectedBus.operator}</span></div>
    <div><span>Route</span><span>${from} → ${to}</span></div>
    <div><span>Date</span><span>${date}</span></div>
    <div><span>Time</span><span>${selectedBus.departure} → ${selectedBus.arrival}</span></div>
    <div><span>Type</span><span>${selectedBus.type}</span></div>
  `;
  updatePrice();
  document.getElementById('bookingModal').classList.add('open');
}

document.getElementById('seatsInput').addEventListener('input', updatePrice);

function updatePrice() {
  if (!selectedBus) return;
  const seats = parseInt(document.getElementById('seatsInput').value) || 1;
  const total = selectedBus.price * seats;
  document.getElementById('priceDisplay').textContent = `Total: $${total}`;
}

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('bookingModal').classList.remove('open');
});

// Confirm booking
document.getElementById('bookingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('bookingModal').classList.remove('open');
  const seats = document.getElementById('seatsInput').value;
  const ref = 'BG' + Math.random().toString(36).substr(2, 8).toUpperCase();
  document.getElementById('confirmText').innerHTML =
    `Your booking for ${seats} seat(s) is confirmed.<br><strong>Reference: ${ref}</strong>`;
  document.getElementById('confirmModal').classList.add('open');
  e.target.reset();
  document.getElementById('seatsInput').value = 1;
});

document.getElementById('closeConfirm').addEventListener('click', () => {
  document.getElementById('confirmModal').classList.remove('open');
});

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
});
