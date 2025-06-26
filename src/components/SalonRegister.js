import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SalonRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salonName: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pin: '',
            password: '',
            confirmPassword: '',
            error: '',
            loading: false,
            showSuccessPopup: false
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const {
            salonName, email, phone, address, city, state, pin,
            password, confirmPassword
        } = this.state;

        if (!salonName || !email || !phone || !address || !city || !state || !pin || !password || !confirmPassword) {
            this.setState({ error: 'All fields are required.' });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ error: 'Passwords do not match.' });
            return;
        }

        this.setState({ loading: true, error: '' });

        try {
            const response = await fetch('http://localhost:5000/api/salons/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    salonName, email, phone, address, city, state, pin, password
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ showSuccessPopup: true });

                setTimeout(() => {
                    this.setState({ showSuccessPopup: false });
                    window.location.href = '/salonlogin';
                }, 2500);
            } else {
                this.setState({ error: data.error || 'Registration failed', loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Server error', loading: false });
        }
    };

    render() {
        const { loading, showSuccessPopup } = this.state;

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Salon Register</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4">
                                <h3 className="text-center mb-4">Salon Registration</h3>

                                {/* Spinner */}
                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {this.state.error && (
                                    <div className="alert alert-danger">{this.state.error}</div>
                                )}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Salon Name:</label>
                                        <input type="text" name="salonName" className="form-control"
                                            value={this.state.salonName}
                                            onChange={this.handleChange}
                                            placeholder="Enter salon name" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Email:</label>
                                        <input type="email" name="email" className="form-control"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            placeholder="Enter email" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Phone Number:</label>
                                        <input type="tel" name="phone" className="form-control"
                                            value={this.state.phone}
                                            onChange={this.handleChange}
                                            placeholder="Enter phone number" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input type="password" name="password" className="form-control"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            placeholder="Enter password" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Confirm Password:</label>
                                        <input type="password" name="confirmPassword" className="form-control"
                                            value={this.state.confirmPassword}
                                            onChange={this.handleChange}
                                            placeholder="Confirm password" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Address:</label>
                                        <input type="text" name="address" className="form-control"
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            placeholder="Enter address" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>City:</label>
                                        <input type="text" name="city" className="form-control"
                                            value={this.state.city}
                                            onChange={this.handleChange}
                                            placeholder="Enter city" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>State:</label>
                                        <input type="text" name="state" className="form-control"
                                            value={this.state.state}
                                            onChange={this.handleChange}
                                            placeholder="Enter state" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>PIN Code:</label>
                                        <input type="text" name="pin" className="form-control"
                                            value={this.state.pin}
                                            onChange={this.handleChange}
                                            placeholder="Enter PIN code" />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    Already have an account? <Link to="/salonlogin">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Popup on successful registration */}
                {showSuccessPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">Salon registered successfully!</h5>
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

export default SalonRegister;
