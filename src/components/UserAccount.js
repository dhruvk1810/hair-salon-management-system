import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
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
        const { name, email, phone, password, confirmPassword } = this.state;

        // Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            this.setState({ error: 'All fields are required.' });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ error: 'Passwords do not match.' });
            return;
        }

        this.setState({ loading: true, error: '' });

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ showSuccessPopup: true });

                setTimeout(() => {
                    this.setState({ showSuccessPopup: false });
                    window.location.href = '/userlogin';
                }, 2500);
            } else {
                this.setState({ error: data.error || 'Registration failed', loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Server error. Please try again later.', loading: false });
        }
    };

    render() {
        const {
            name,
            email,
            phone,
            password,
            confirmPassword,
            error,
            loading,
            showSuccessPopup
        } = this.state;

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">User Registration</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4">
                                <h3 className="text-center mb-4">User Registration</h3>

                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Full Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={name}
                                            onChange={this.handleChange}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={email}
                                            onChange={this.handleChange}
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Phone Number:</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            value={phone}
                                            onChange={this.handleChange}
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={password}
                                            onChange={this.handleChange}
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Confirm Password:</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={this.handleChange}
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    Already have an account? <Link to="/userlogin">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Popup */}
                {showSuccessPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">User registered successfully!</h5>
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

export default UserAccount;
