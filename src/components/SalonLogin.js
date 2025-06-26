import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SalonLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({ error: 'Please enter email and password.' });
            return;
        }

        this.setState({ loading: true, error: '' });

        try {
            const response = await fetch('http://localhost:5000/api/salons/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ showSuccessPopup: true });

                setTimeout(() => {
                    this.setState({ showSuccessPopup: false });
                    localStorage.setItem('salonEmail', email); // ✅ Set salon email
                    localStorage.setItem('salonLoggedIn', 'true'); // ✅ Mark salon as logged in
                    window.location.href = '/salonhome'; // ✅ Redirect to SalonHome
                }, 1500);
            } else {
                this.setState({ error: data.error, loading: false });
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
                        <li className="breadcrumb-item active">Salon Login</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4 position-relative">
                                <h3 className="text-center mb-4">Salon Login</h3>

                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {this.state.error && (
                                    <div className="alert alert-danger">{this.state.error}</div>
                                )}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            placeholder="Enter email"
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label>Password:</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            placeholder="Enter password"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    Don’t have an account? <Link to="/salonregister">Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Popup Box */}
                {showSuccessPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">Login successful</h5>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

// ✅ Popup Styles
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

export default SalonLogin;
