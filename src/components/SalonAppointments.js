import React, { Component } from 'react';

class SalonAppointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      salonClosed: false,
      loading: true,
      error: '',
      message: '',
      toast: '',
      totalAppointments: 0,
      todayCount: 0,
      cancelledCount: 0,
      pendingCount: 0,
      completedCount: 0,
      showAllAppointments: false,
    };
  }

  componentDidMount() {
    this.fetchSalonStatusAndAppointments();
  }

  fetchSalonStatusAndAppointments = async () => {
    const salonName = localStorage.getItem('salonName');
    if (!salonName) {
      this.setState({ error: 'Salon name not found in localStorage', loading: false });
      return;
    }

    try {
      const statusRes = await fetch(`http://localhost:5000/api/salons/status/${encodeURIComponent(salonName)}`);
      const statusData = await statusRes.json();
      if (statusData.success) {
        this.setState({ salonClosed: statusData.isOpen === false });
      }

      const apptRes = await fetch(`http://localhost:5000/api/appointments/salon/${encodeURIComponent(salonName)}`);
      const apptData = await apptRes.json();

      if (apptData.success) {
        const allAppointments = apptData.appointments;
        const today = new Date().toISOString().split('T')[0];

        const appointmentsToShow = this.state.showAllAppointments
          ? allAppointments
          : allAppointments.filter(appt => appt.date === today);

        const totalAppointments = allAppointments.length;
        const todayCount = appointmentsToShow.length;
        const cancelledCount = allAppointments.filter(a => a.status === 'cancelled').length;
        const pendingCount = allAppointments.filter(a => !a.status || a.status === 'pending').length;
        const completedCount = allAppointments.filter(a => a.status === 'completed').length;

        this.setState({
          appointments: appointmentsToShow.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)),
          totalAppointments,
          todayCount,
          cancelledCount,
          pendingCount,
          completedCount,
          loading: false,
          error: ''
        });
      } else {
        this.setState({ error: 'No appointments found.', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Server error fetching data.', loading: false });
    }
  };

  updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (data.success) {
        this.setState((prev) => ({
          appointments: prev.appointments.map((appt) =>
            appt._id === id ? { ...appt, status: newStatus } : appt
          ),
          message: `Appointment marked as ${newStatus}.`,
          error: ''
        }));
      } else {
        this.setState({ error: 'Failed to update appointment status.', message: '' });
      }
    } catch (err) {
      this.setState({ error: 'Error updating appointment.', message: '' });
    }
  };

  handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        this.setState((prev) => ({
          appointments: prev.appointments.filter((appt) => appt._id !== appointmentId),
          message: 'Appointment canceled successfully.',
          error: ''
        }));
      } else {
        this.setState({ error: 'Failed to cancel appointment.', message: '' });
      }
    } catch {
      this.setState({ error: 'Server error while deleting appointment.', message: '' });
    }
  };

  toggleSalonStatus = async () => {
    const salonName = localStorage.getItem('salonName');
    const newStatus = !this.state.salonClosed;

    try {
      const res = await fetch(`http://localhost:5000/api/salons/status/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonName, isOpen: !newStatus })
      });

      const result = await res.json();
      if (result.success) {
        this.setState({
          salonClosed: newStatus,
          toast: newStatus ? 'Salon Closed' : 'Salon Reopened'
        });

        setTimeout(() => this.setState({ toast: '' }), 1500);
      } else {
        this.setState({ error: 'Failed to update salon status.' });
      }
    } catch {
      this.setState({ error: 'Error updating salon status.' });
    }
  };

  formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hour, +minute);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  render() {
    const { appointments, loading, error, message, salonClosed, toast } = this.state;
    
    const showActionColumn = appointments.some(appt => appt.status === 'pending');

    return (
      <div className="container my-5">
        <div className="row justify-content-center gy-4 text-center my-lg-5 mb-5">
    {/* Total */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="bg-primary text-white rounded-4 p-4 shadow-lg d-flex flex-column justify-content-center align-items-center h-100">
        <h5 className="fw-bold mb-2">Total</h5>
        <h2 className="fw-bold">{this.state.totalAppointments}</h2>
      </div>
    </div>

    {/* Today */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="bg-purple text-black rounded-4 p-4 shadow-lg d-flex flex-column justify-content-center align-items-center h-100">
        <h5 className="fw-bold mb-2">Today</h5>
        <h2 className="fw-bold">{this.state.todayCount}</h2>
      </div>
    </div>

    {/* Cancelled */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="bg-danger text-white rounded-4 p-4 shadow-lg d-flex flex-column justify-content-center align-items-center h-100">
        <h5 className="fw-bold mb-2">Cancelled</h5>
        <h2 className="fw-bold">{this.state.cancelledCount}</h2>
      </div>
    </div>

    {/* Pending */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="bg-warning text-dark rounded-4 p-4 shadow-lg d-flex flex-column justify-content-center align-items-center h-100">
        <h5 className="fw-bold mb-2">Pending</h5>
        <h2 className="fw-bold">{this.state.pendingCount}</h2>
      </div>
    </div>

    {/* Completed */}
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="bg-success text-white rounded-4 p-4 shadow-lg d-flex flex-column justify-content-center align-items-center h-100">
        <h5 className="fw-bold mb-2">Completed</h5>
        <h2 className="fw-bold">{this.state.completedCount}</h2>
      </div>
    </div>
  </div>
        
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2>📋 Salon Appointments {this.state.showAllAppointments ? '(All)' : '(Today)'}</h2>
    <div>
      <button
        className={`btn ${this.state.salonClosed ? 'btn-success' : 'btn-danger'}`}
        onClick={this.toggleSalonStatus}
      >
        {this.state.salonClosed ? 'Open Salon' : 'Close Salon'}
      </button>
      <button
        className="btn btn-primary m-3"
        onClick={() => {
          this.setState(
            (prev) => ({ showAllAppointments: !prev.showAllAppointments, loading: true }),
            () => this.fetchSalonStatusAndAppointments()
          );
        }}
      >
        {this.state.showAllAppointments ? 'Show Today Only' : 'Show All Appointments'}
      </button>
    </div>
  </div>

        {toast && <div className="alert alert-info text-center">{toast}</div>}
        {loading && <div className="text-center"><div className="spinner-border text-warning" role="status" /></div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {message && <div className="alert alert-success text-center">{message}</div>}

        {!loading && !salonClosed && appointments.length === 0 && !error && (
          <div className="alert alert-info text-center">No appointments found.</div>
        )}

        {!salonClosed && appointments.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  {showActionColumn && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={index}>
                    <td>{appt.name}</td>
                    <td>{appt.email}</td>
                    <td>{appt.phone}</td>
                    <td>{this.formatDate(appt.date)}</td>
                    <td>{this.formatTime(appt.time)}</td>
                    <td>{appt.service || 'N/A'}</td>
                    <td>
                      {appt.status === 'completed' && <span className="badge bg-success">✔️ Completed</span>}
                      {appt.status === 'cancelled' && <span className="badge bg-danger">❌ Cancelled</span>}
                      {(!appt.status || appt.status === 'pending') && <span className="badge bg-secondary">⏳ Pending</span>}
                    </td>
                    { showActionColumn && (
                      <td>
                        {(!appt.status || appt.status === 'pending') && (
                          <>
                            <button className="btn btn-sm btn-success me-2" onClick={() => this.updateStatus(appt._id, 'completed')}>✔️</button>
                            <button className="btn btn-sm btn-danger me-2" onClick={() => this.updateStatus(appt._id, 'cancelled')}>❌</button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {salonClosed && (
          <div className="alert alert-warning text-center mt-4">
            🚫 Salon is currently closed. Please reopen to manage appointments.
          </div>
        )}
      </div>
    );
  }
}

export default SalonAppointments;
