import React, { Component } from 'react';

class SalonAppointments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            loading: true,
            error: '',
            message: '',
            salonClosed: false,
            toast: ''
        };
    }

    componentDidMount() {
        this.fetchSalonStatusAndAppointments();
    }

    fetchSalonStatusAndAppointments = async () => {
        const salonName = localStorage.getItem('salonName');
        if (!salonName) {
            this.setState({ error: 'Salon not found in localStorage', loading: false });
            return;
        }

        try {
            // 1. Get status from server
            const res = await fetch(`http://localhost:5000/api/salons/status/${encodeURIComponent(salonName)}`);
            const data = await res.json();
            if (data.success) {
                this.setState({ salonClosed: data.isOpen === false }); // if isOpen=false → salonClosed=true
            }

            // 2. Get appointments
            const apptRes = await fetch(`http://localhost:5000/api/appointments/salon/${encodeURIComponent(salonName)}`);
            const apptData = await apptRes.json();

            if (apptData.success) {
                const sortedAppointments = apptData.appointments.sort((a, b) => {
                    const dateTimeA = new Date(`${a.date}T${a.time}`);
                    const dateTimeB = new Date(`${b.date}T${b.time}`);
                    return dateTimeA - dateTimeB;
                });

                this.setState({ appointments: sortedAppointments, loading: false });
            } else {
                this.setState({ error: 'No appointments found.', loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Failed to load data', loading: false });
        }
    };

    handleDelete = (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState(prev => ({
                        appointments: prev.appointments.filter(appt => appt._id !== appointmentId),
                        message: 'Appointment removed successfully.',
                        error: ''
                    }));
                } else {
                    this.setState({ error: data.error || 'Failed to remove appointment.', message: '' });
                }
            })
            .catch(() => {
                this.setState({ error: 'Server error while deleting appointment.', message: '' });
            });
    };

    toggleSalonStatus = async () => {
        const salonName = localStorage.getItem('salonName');
        const newStatus = !this.state.salonClosed;

        try {
            const res = await fetch(`http://localhost:5000/api/salons/status/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    salonName,
                    isOpen: !newStatus // salonClosed true → isOpen false
                })
            });

            const result = await res.json();

            if (result.success) {
                this.setState({
                    salonClosed: newStatus,
                    toast: newStatus ? 'Salon Closed.' : 'Salon Reopened.'
                });

                setTimeout(() => this.setState({ toast: '' }), 1500);
            } else {
                this.setState({ error: 'Failed to update salon status.' });
            }
        } catch (error) {
            this.setState({ error: 'Error updating salon status.' });
        }
    };

    render() {
        const { appointments, loading, error, message, salonClosed, toast } = this.state;

        return (
            <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Salon Appointments</h2>
                    <button
                        className={`btn ${salonClosed ? 'btn-success' : 'btn-danger'}`}
                        onClick={this.toggleSalonStatus}
                    >
                        {salonClosed ? 'Open Salon' : 'Close Salon'}
                    </button>
                </div>

                {toast && <div className="alert alert-info text-center">{toast}</div>}
                {loading && <div className="text-center"><div className="spinner-border text-warning" role="status" /></div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}
                {message && <div className="alert alert-success text-center">{message}</div>}

                {!loading && !salonClosed && appointments.length === 0 && !error && (
                    <div className="alert alert-info text-center">No appointments found for today.</div>
                )}

                {!salonClosed && appointments.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Service</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.name}</td>
                                        <td>{appt.email}</td>
                                        <td>{appt.phone}</td>
                                        <td><span className="badge bg-light text-dark">{appt.date}</span></td>
                                        <td><span className="badge bg-primary">{appt.time}</span></td>
                                        <td>{appt.service}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => this.handleDelete(appt._id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {salonClosed && (
                    <div className="alert alert-warning text-center mt-4">
                        Salon is currently closed. Please reopen to manage appointments.
                    </div>
                )}
            </div>
        );
    }
}

export default SalonAppointments;
