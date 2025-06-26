import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Appointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            salon: '',
            service: '',
            salonList: [],
            availableSlots: [],
            loading: false,
            showSuccessPopup: false,
            message: '',
            error: ''
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/salons/names')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({ salonList: data.salons.sort() });
                } else {
                    this.setState({ error: 'Failed to load salon list' });
                }
            })
            .catch(() => {
                this.setState({ error: 'Error loading salon list' });
            });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value, error: '', message: '' }, () => {
            if (name === 'salon' || name === 'date') {
                this.fetchAvailableSlots();
            }
        });
    };

    fetchAvailableSlots = async () => {
        const { salon, date } = this.state;
        if (!salon || !date) return;

        try {
            const res = await fetch(`http://localhost:5000/api/appointments/salon/${encodeURIComponent(salon)}`);
            const data = await res.json();

            if (data.success) {
                const bookedTimes = data.appointments
                    .filter(appt => appt.date === date)
                    .map(appt => appt.time);

                const day = new Date(date).getDay();
                const allSlots = this.generateTimeSlots(day);

                const available = allSlots.filter(slot => !bookedTimes.includes(slot));
                this.setState({ availableSlots: available });
            }
        } catch {
            this.setState({ error: 'Failed to fetch slots' });
        }
    };

    generateTimeSlots = (day) => {
        const slots = [];
        const [start, end] = day === 0 ? [9, 14] : [9, 22];

        for (let h = start; h <= end; h++) {
            for (let m of [0, 30]) {
                if (h === end && m > 0) continue;
                const hr = String(h).padStart(2, '0');
                const min = String(m).padStart(2, '0');
                slots.push(`${hr}:${min}`);
            }
        }
        return slots;
    };

    formatAMPM = (time) => {
        const [h, m] = time.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    handleSlotClick = (slot) => {
        this.setState({ time: slot });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, phone, date, time, salon, service } = this.state;

        if (!name || !email || !phone || !date || !time || !salon || !service) {
            this.setState({ error: 'Please fill all fields.' });
            return;
        }

        const selectedTime = new Date(`${date}T${time}`);
        const now = new Date();
        if (selectedTime < now) {
            this.setState({ error: 'Cannot book for past time.' });
            return;
        }

        this.setState({ loading: true });

        fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, date, time, salon, service })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({
                        name: '', email: '', phone: '', date: '', time: '', salon: '', service: '',
                        message: 'Appointment booked successfully!',
                        error: '', loading: false, showSuccessPopup: true, availableSlots: []
                    });
                    setTimeout(() => {
                        this.setState({ showSuccessPopup: false });
                    }, 1500);
                } else {
                    this.setState({ error: data.error || 'Failed to book', loading: false });
                }
            })
            .catch(() => {
                this.setState({ error: 'Server error', loading: false });
            });
    };

    render() {
        const {
            name, email, phone, date, time, salon, service,
            salonList, availableSlots, loading, showSuccessPopup,
            message, error
        } = this.state;

        const serviceOptions = [
            'Basic Haircut', 'Beard Trim', 'Hair Styling', 'Hair Coloring',
            'Facial', 'Manicure', 'Pedicure', 'Head Massage',
            'Full Body Massage', 'Hair Spa', 'Skin Whitening', 'Anti-Dandruff Treatment'
        ];

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>
                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Book Appointment</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow p-4">
                                <h3 className="text-center mb-4">Book an Appointment</h3>

                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                )}

                                {error && <div className="alert alert-danger">{error}</div>}
                                {message && <div className="alert alert-success">{message}</div>}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Your Name:</label>
                                        <input type="text" name="name" className="form-control" placeholder='Enter your name' value={name} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Email:</label>
                                        <input type="email" name="email" className="form-control" placeholder='Enter your email' value={email} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Phone:</label>
                                        <input type="tel" name="phone" className="form-control" placeholder='Enter your phone number' value={phone} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Select Salon:</label>
                                        <select name="salon" className="form-control" value={salon} onChange={this.handleChange}>
                                            <option value="">-- Select Salon --</option>
                                            {salonList.map((s, i) => (
                                                <option key={i} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Date:</label>
                                        <input type="date" name="date" className="form-control" value={date} onChange={this.handleChange} />
                                    </div>

                                    {availableSlots.length > 0 && (
                                        <div className="form-group mb-3">
                                            <label>Select Time Slot:</label>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {availableSlots.map((slot, i) => (
                                                    <button
                                                        type="button"
                                                        key={i}
                                                        className={`btn btn-sm ${time === slot ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => this.handleSlotClick(slot)}
                                                    >
                                                        {this.formatAMPM(slot)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group mb-3">
                                        <label>Select Service:</label>
                                        <select name="service" className="form-control" value={service} onChange={this.handleChange}>
                                            <option value="">-- Select Service --</option>
                                            {serviceOptions.map((srv, i) => (
                                                <option key={i} value={srv}>{srv}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                        {loading ? 'Booking...' : 'Book Appointment'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showSuccessPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">Appointment booked successfully!</h5>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
    },
    popup: {
        background: '#fff',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    }
};

export default Appointment;
