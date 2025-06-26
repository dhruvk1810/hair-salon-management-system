import React, { Component } from 'react';

class SalonStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            loading: true,
            error: '',
            salonName: '',
            status: 'Unknown'
        };
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const salonName = urlParams.get('salon');

        if (!salonName) {
            this.setState({ error: 'Salon not specified', loading: false });
            return;
        }

        this.setState({ salonName });

        // Fetch status & appointments
        fetch(`http://localhost:5000/api/salons/status/${encodeURIComponent(salonName)}`)
            .then(res => res.json())
            .then(async statusData => {
                if (!statusData.success) {
                    this.setState({ error: statusData.message, loading: false });
                    return;
                }

                const isOpen = statusData.isOpen;
                if (!isOpen) {
                    this.setState({ status: 'Unknown', appointments: [], loading: false });
                    return;
                }

                // Salon is open — fetch appointments
                const apptRes = await fetch(`http://localhost:5000/api/appointments/salon/${encodeURIComponent(salonName)}`);
                const apptData = await apptRes.json();

                if (apptData.success) {
                    const today = new Date().toISOString().split('T')[0];
                    const todaysAppointments = apptData.appointments.filter(appt => appt.date === today);

                    const sortedAppointments = apptData.appointments.sort((a, b) => {
                        const dateTimeA = new Date(`${a.date}T${a.time}`);
                        const dateTimeB = new Date(`${b.date}T${b.time}`);
                        return dateTimeA - dateTimeB;
                    });

                    this.setState({
                        appointments: sortedAppointments,
                        status: todaysAppointments.length > 0 ? 'Busy' : 'Free',
                        loading: false
                    });
                } else {
                    this.setState({ error: 'Failed to load appointments.', loading: false });
                }
            })
            .catch(() => {
                this.setState({ error: 'Failed to fetch status.', loading: false });
            });
    }

    render() {
        const { appointments, loading, error, salonName, status } = this.state;

        return (
            <div className="container py-5">
                <h2 className="text-center mb-3">{salonName} - Appointments</h2>

                <div className="text-center mb-4">
                    <span className={`badge ${
                        status === 'Busy' ? 'bg-danger' :
                        status === 'Free' ? 'bg-success' :
                        'bg-secondary'
                    }`}>
                        Status: {status}
                    </span>
                </div>

                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                {!loading && !error && (
                    <>
                        {status === 'Unknown' && (
                            <div className="alert alert-warning text-center">
                                Salon is currently <strong>closed</strong>.
                            </div>
                        )}

                        {status === 'Free' && (
                            <div className="alert alert-info text-center">
                                Salon has <strong>no appointments</strong> for today.
                            </div>
                        )}

                        {status === 'Busy' && appointments.length === 0 && (
                            <div className="alert alert-warning text-center">
                                No appointment data found, but status is <strong>Busy</strong>.
                            </div>
                        )}
                    </>
                )}

                {appointments.length > 0 && (
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
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt, index) => (
                                    <tr key={index}>
                                        <td>{appt.name}</td>
                                        <td>{appt.email}</td>
                                        <td>{appt.phone}</td>
                                        <td>{appt.date}</td>
                                        <td>{appt.time}</td>
                                        <td>{appt.service}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }
}

export default SalonStatus;
