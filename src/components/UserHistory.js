import React, { useEffect, useState } from 'react';

const UserHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchAppointments();
  }, [userEmail]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/user/appointments?email=${userEmail}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
  const confirmCancel = window.confirm('Are you sure you want to cancel this appointment?');
  if (!confirmCancel) return;

  try {
    const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete appointment');
    }

    alert('Appointment cancelled and deleted!');

    // Remove from local state
    setAppointments((prev) => prev.filter((appt) => appt._id !== id));
  } catch (err) {
    console.error('Cancel error:', err);
    alert('Failed to delete appointment');
  }
};



  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(+hour, +minute);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderStatus = (appt) => {
    switch (appt.status) {
      case 'completed':
        return <span className="badge bg-success">✔️ Completed</span>;
      case 'cancelled':
        return <span className="badge bg-danger">❌ Cancelled</span>;
      case 'pending':
      default:
        return <span className="badge bg-secondary">⏳ Pending</span>;
    }
  };
  
  const showActionColumn = appointments.some(appt => appt.status === 'pending');

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📅 My Appointment History</h2>

      {loading && <div className="text-center">Loading...</div>}

      {!loading && error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !error && appointments.length === 0 && (
        <div className="text-center text-muted">No appointments found.</div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
                 <tr>
                   <th>#</th>
                   <th>Salon</th>
                   <th>Date</th>
                   <th>Time</th>
                   <th>Service</th>
                   <th>Status</th>
                   {showActionColumn && <th>Action</th>}
                 </tr>
               </thead>
            <tbody>
                  {appointments.map((appt, index) => (
                    <tr key={appt._id}>
                      <td>{index + 1}</td>
                      <td>{appt.salon}</td>
                      <td>{formatDate(appt.date)}</td>
                      <td>{formatTime(appt.time)}</td>
                      <td>{appt.service || 'N/A'}</td>
                      <td>{renderStatus(appt)}</td>
                      {showActionColumn && (
                        <td>
                          {appt.status === 'pending' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancel(appt._id)}
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
