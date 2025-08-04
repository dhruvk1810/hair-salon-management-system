// salon-backend.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `user-${req.params.userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

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
    isOpen: { type: Boolean, default: true },
    otp: String,
    otpExpiry: Date
});
const Salon = mongoose.model('Salon', salonSchema);

const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: String,
    time: String,
    salon: String,
    service: String,
    status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

const userSchema = new mongoose.Schema({
      fullName: String,
      email: { type: String, unique: true },
      phone: String,
      password: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      profilePic: String,
      createdAt: { type: Date, default: Date.now },
      otp: String,
      otpExpiry: Date
});
const User = mongoose.model("User", userSchema);

// ======================
// Utility: Generate OTP
// ======================
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ======================
// Email Transporter
// ======================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhruvkanpariya706@gmail.com',
        pass: 'ccak ltdj bqvz cgvk'
    }
});

// ======================
// User Routes
// ======================

// 🔐 User Register
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Simple validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered with this email.' });
        }

        // Create and save user
        const newUser = new User({
            fullName: name, // make sure it matches your User schema field
            email,
            phone,
            password // plain text for now (⚠️ dev-only)
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // helpful debug info
        res.status(500).json({ error: 'Registration failed due to server error' });
    }
});

// 🔐 User Login
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Login successful', userId: user._id });
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// 🔑 User Forgot Password - Send OTP
app.post('/api/users/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute.
        await user.save();

        await transporter.sendMail({
            from: 'dhruvkanpariya706@gmail.com',
            to: user.email,
            subject: 'User OTP for Password Reset',
            text: `Your OTP is ${otp}. It is valid for 1 minute. Do not share it with anyone.This is an automated email, please do not reply.`
        });

        res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error sending OTP' });
    }
});

// ✅ User Verify OTP
app.post('/api/users/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
        res.json({ success: true, message: 'OTP verified' });
    } catch {
        res.status(500).json({ success: false, message: 'Server error verifying OTP' });
    }
});

// 🔐 User Reset Password
app.post('/api/users/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.password = password; // ⚠️ Optional: hash if needed
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error resetting password' });
    }
});

// 📋 Get User Appointments History
app.get('/api/user/appointments', async (req, res) => {
  try {
    const { email } = req.query;
    const appointments = await Appointment.find({ email }).sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// 🗑️ Cancel Appointment by ID
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Appointment not found' });
    }

    // Send cancellation email
     transporter.sendMail({
      from: 'dhruvkanpariya706@gmail.com',
      to: deleted.email,
      subject: 'Appointment Cancelled',
      text: `Dear ${deleted.name},

             This is to confirm that your appointment at ${deleted.salon} has been successfully cancelled.
             
             📅 Date: ${deleted.date}
             ⏰ Time: ${deleted.time}
             💇‍♂️ Service: ${deleted.service}
             
             We’re sorry to see you cancel, but we hope to see you again soon. You’re always welcome to rebook at your convenience.
             
             Thank you for using our service.
             
             Warm regards,  
             ${deleted.salon} Team.`

     });

    res.json({ success: true, message: 'Appointment cancelled and email sent' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

// 📅 Update Appointment Status
app.put('/api/appointments/status/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Send email if cancelled by salon
    if (status === 'cancelled') {
      await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: updated.email,
        subject: 'Appointment Cancelled by Salon',
        text: `Dear ${updated.name},

               We regret to inform you that your appointment at ${updated.salon} has been cancelled by the salon due to unforeseen circumstances.
               
               📅 Date: ${updated.date}
               ⏰ Time: ${updated.time}
               💇‍♂️ Service: ${updated.service}
               
               We apologize for the inconvenience. You may rebook at another time, or contact the salon directly for assistance.
               
               Thank you for your understanding.
               
               Sincerely,  
               ${updated.salon} Team`

      });
    }

    res.json({ success: true, message: 'Status updated and email sent', appointment: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// ======================
// Salon Routes
// ======================


// 🔐 Salon Register
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

// 🔐 Salon Login
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

// 🔑 Salon Forgot Password - Send OTP
app.post('/api/salons/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const salon = await Salon.findOne({ email });
        if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

        const otp = generateOTP();
        salon.otp = otp;
        salon.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute.
        await salon.save();

        transporter.sendMail({
            from: 'dhruvkanpariya706@gmail.com',
            to: salon.email,
            subject: 'Salon OTP for Password Reset',
            text: `Your OTP is ${otp}. It is valid for 1 minute. Do not share it with anyone.This is an automated email, please do not reply.`
        });

        res.json({ success: true, message: 'OTP sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error sending OTP' });
    }
});

// ✅ Salon Verify OTP
app.post('/api/salons/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const salon = await Salon.findOne({ email });
        if (!salon || salon.otp !== otp || salon.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }
        res.json({ success: true, message: 'OTP verified' });
    } catch {
        res.status(500).json({ success: false, message: 'Server error verifying OTP' });
    }
});

// 🔑 SalonReset Password
app.post('/api/salons/reset-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        const salon = await Salon.findOne({ email });
        if (!salon) return res.status(404).json({ success: false, message: 'Salon not found' });

        salon.password = password;
        salon.otp = undefined;
        salon.otpExpiry = undefined;

        await salon.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error resetting password' });
    }
});


// 📅 Book Appointment
app.post('/api/appointments', async (req, res) => {
    const appointment = new Appointment(req.body);
    await appointment.save();

    // Send email confirmation
    transporter.sendMail({
        from: 'your-email@gmail.com',
        to: appointment.email,
        subject: 'Appointment Booked Successfully',
        text: `Dear ${appointment.name},

               We are pleased to confirm your appointment at ${appointment.salon}.
               
               📅 Date: ${appointment.date}
               ⏰ Time: ${appointment.time}
               💇‍♂️ Service: ${appointment.service}
               
               Your booking has been successfully confirmed. If you have any questions or need to make changes, feel free to contact the salon.
               
               Thank you for choosing us!
               
               Best regards,  
               ${appointment.salon} Team.`
    });

    res.status(201).json(appointment);
               
    const { name, email, phone, date, time, salon, service } = req.body;
    try {
        const foundSalon = await Salon.findOne({ salonName: salon });
        if (!foundSalon) return res.status(404).json({ success: false, error: 'Salon not found' });
        if (!foundSalon.isOpen) return res.status(400).json({ success: false, error: 'This salon is currently closed.' });

        const exists = await Appointment.findOne({ salon, date, time });
        if (exists) {
            return res.status(400).json({ success: false, error: 'This time slot is already booked.' });
        }

        const appointment = new Appointment({ name, email, phone, date, time, salon, service });
        await appointment.save();

        res.status(201).json({ success: true, message: 'Appointment booked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error. Booking failed.' });
    }
});

// 📥 Get Appointments by Salon
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

// 🔍 Get Salon Status
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
