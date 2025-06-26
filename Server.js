const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ======================
// MongoDB Connection
// ======================
mongoose.connect('mongodb://127.0.0.1:27017/salonDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ======================
// Schemas & Models
// ======================
const salonSchema = new mongoose.Schema({
    salonName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    status: { type: String, enum: ['Busy', 'Free'] },
    isOpen: { type: Boolean, default: true }
});
const Salon = mongoose.model('Salon', salonSchema);

const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String, // Format: YYYY-MM-DD
    time: String,
    salon: String,
    service: String
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ======================
// Routes
// ======================

// 🔐 Register
app.post('/api/salons/register', async (req, res) => {
    try {
        const exists = await Salon.findOne({ email: req.body.email });
        if (exists) return res.status(400).json({ error: 'Salon already registered with this email.' });

        const newSalon = new Salon(req.body);
        await newSalon.save();
        res.status(201).json({ message: 'Salon registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// 🔐 Login
app.post('/api/salons/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const salon = await Salon.findOne({ email });
        if (!salon || salon.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful', salonId: salon._id });
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// 📅 Book Appointment (with duplicate check)
app.post('/api/appointments', async (req, res) => {
    const { name, email, phone, date, time, salon, service } = req.body;

    try {
        // Check if salon is open
        const foundSalon = await Salon.findOne({ salonName: salon });
        if (!foundSalon) return res.status(404).json({ success: false, error: 'Salon not found' });
        if (!foundSalon.isOpen) return res.status(400).json({ success: false, error: 'This salon is currently closed.' });

        // Check for existing appointment at same date, time, salon
        const exists = await Appointment.findOne({ salon, date, time });
        if (exists) {
            return res.status(400).json({
                success: false,
                error: 'This time slot is already booked. Please choose a different time.'
            });
        }

        const appointment = new Appointment({ name, email, phone, date, time, salon, service });
        await appointment.save();

        res.status(201).json({ success: true, message: 'Appointment booked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error. Booking failed.' });
    }
});


// 📥 Get Appointments by Salon (if open)
app.get('/api/appointments/salon/:salonName', async (req, res) => {
    try {
        const salonName = decodeURIComponent(req.params.salonName);
        const salon = await Salon.findOne({ salonName });
        if (!salon) return res.status(404).json({ success: false, error: 'Salon not found' });

        if (!salon.isOpen) return res.json({ success: true, appointments: [] });

        const appointments = await Appointment.find({ salon: salonName });
        res.json({ success: true, appointments });
    } catch {
        res.status(500).json({ success: false, error: 'Fetch error' });
    }
});

// ❌ Delete Appointment
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, error: 'Not found' });

        res.json({ success: true, message: 'Deleted' });
    } catch {
        res.status(500).json({ success: false, error: 'Delete error' });
    }
});

// 📋 Get All Salons
app.get('/api/salons/all', async (_, res) => {
    try {
        const salons = await Salon.find({});
        res.json(salons);
    } catch {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// 📋 Get Salon Names
app.get('/api/salons/names', async (_, res) => {
    try {
        const salons = await Salon.find({}, 'salonName');
        res.json({ success: true, salons: salons.map(s => s.salonName) });
    } catch {
        res.status(500).json({ success: false, error: 'Failed to fetch names' });
    }
});

// 🔍 Get Salon by Email
app.get('/api/salons/email/:email', async (req, res) => {
    try {
        const salon = await Salon.findOne({ email: req.params.email });
        if (!salon) return res.status(404).json({ success: false, error: 'Not found' });

        res.json({ success: true, salon });
    } catch {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// 🔍 Get Salon Status (Busy / Free / Unknown)
app.get('/api/salons/status/:salonName', async (req, res) => {
    try {
        const name = decodeURIComponent(req.params.salonName);
        const salon = await Salon.findOne({ salonName: name });
        if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

        if (!salon.isOpen) {
            return res.json({ success: true, salonName: salon.salonName, status: 'Unknown', isOpen: false });
        }

        const today = new Date().toISOString().split('T')[0];
        const count = await Appointment.countDocuments({ salon: name, date: today });
        const status = count > 0 ? 'Busy' : 'Free';

        res.json({
            success: true,
            salonName: salon.salonName,
            isOpen: true,
            status,
            appointmentCount: count
        });
    } catch {
        res.status(500).json({ success: false, message: 'Status fetch failed' });
    }
});


//🟢 Toggle Open/Close Status
app.post('/api/salons/status/update', async (req, res) => {
    try {
        const { salonName, isOpen } = req.body;
        if (typeof isOpen !== 'boolean') {
            return res.status(400).json({ success: false, message: 'isOpen must be true/false' });
        }

        const updated = await Salon.findOneAndUpdate({ salonName }, { isOpen }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Salon not found' });

        res.json({ success: true, message: 'Salon open status updated', updated });
    } catch {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// ======================
// Start Server
// ======================

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
