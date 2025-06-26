import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SalonHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salon: null,
            error: '',
            loading: true
        };
    }

    componentDidMount() {
        const email = localStorage.getItem('salonEmail'); // Set during login
        if (!email) {
            this.setState({ error: 'Unauthorized access. Please login.', loading: false });
            return;
        }

        fetch(`http://localhost:5000/api/salons/email/${email}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    this.setState({ salon: data.salon, loading: false });
                    localStorage.setItem('salonName', data.salon.salonName); // Optional for filtering appointments
                } else {
                    this.setState({ error: 'Salon not found', loading: false });
                }
            })
            .catch(() => {
                this.setState({ error: 'Failed to fetch salon data', loading: false });
            });
    }

    handleCardClick = () => {
        window.open('/salonappointments', '_blank');
    };

    render() {
        const { salon, error, loading } = this.state;

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Salon Home</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <h2 className="text-center mb-4">Welcome to Your Dashboard</h2>

                    {loading && (
                        <div className="text-center mb-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center">{error}</div>
                    )}

                    {salon && (
                        <div className="card shadow mx-auto" style={{ maxWidth: '600px' }}>
                            <div className="card-body">
                                <h4 className="card-title text-center mb-4">{salon.salonName}</h4>
                                <p><strong>Email:</strong> {salon.email}</p>
                                <p><strong>Phone:</strong> {salon.phone}</p>
                                <p><strong>Address:</strong> {salon.address}, {salon.city}, {salon.state} - {salon.pin}</p>
                                
                                <div className="text-center mt-4">
                                    <button
                                        onClick={this.handleCardClick}
                                        className="btn btn-warning"
                                        style={{ fontSize: '16px',
                                                 padding: '10px 20px', 
                                                 backgroundColor: '#ffc905', 
                                                 border: 'none', 
                                                 fontWeight: 'bold' }}>       
                                        View All Appointments
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default SalonHome;
