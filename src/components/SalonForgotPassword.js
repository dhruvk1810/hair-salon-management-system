import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';

class SalonForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
        email: '',
        otp: '',
        error: '',
        message: '',
        loading: false,
        otpSent: false,
        verified: false,
        showSuccessPopup: false // ✅ New state
   };
}

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '', message: '' });
    };

    handleSendOtp = async (e) => {
        e.preventDefault();
        const { email } = this.state;

        if (!email) return this.setState({ error: 'Please enter your registered email.' });

        this.setState({ loading: true });

        try {
            const res = await fetch('http://localhost:5000/api/salons/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                this.setState({ message: data.message || 'OTP sent to your email.', otpSent: true });
            } else {
                this.setState({ error: data.message || 'Failed to send OTP.' });
            }
        } catch {
            this.setState({ error: 'Server error. Try again.' });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleVerifyOtp = async (e) => {
    e.preventDefault();
    const { email, otp } = this.state;

    if (!otp) return this.setState({ error: 'Please enter the OTP.' });

    this.setState({ loading: true });

    try {
        const res = await fetch('http://localhost:5000/api/salons/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const data = await res.json();
        if (res.ok) {
            this.setState({ showSuccessPopup: true });

            setTimeout(() => {
                this.setState({ verified: true, showSuccessPopup: false });
            }, 1500);
        } else {
            this.setState({ error: data.message || 'Invalid OTP.' });
        }
    } catch {
        this.setState({ error: 'Server error. Try again.' });
    } finally {
        this.setState({ loading: false });
    }
};


    render() {
        const { email, otp, error, message, loading, otpSent, verified } = this.state;

        if (verified) {
            return <Navigate to={`/salonresetpassword?email=${email}`} />;
        }

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Forgot Password</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4 position-relative">
                                <h3 className="text-center mb-4">Forgot Password</h3>

                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger">{error}</div>
                                )}

                                {message && (
                                    <div className="alert alert-success">{message}</div>
                                )}

                                <form onSubmit={otpSent ? this.handleVerifyOtp : this.handleSendOtp}>
                                    <div className="form-group mb-3">
                                        <label>Email address:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={email}
                                            onChange={this.handleChange}
                                            placeholder="Enter your registered email"
                                            disabled={otpSent}
                                        />
                                    </div>

                                    {otpSent && (
                                        <div className="form-group mb-3">
                                            <label>Enter OTP:</label>
                                            <input
                                                type="text"
                                                name="otp"
                                                className="form-control"
                                                value={otp}
                                                onChange={this.handleChange}
                                                placeholder="Enter OTP sent to your email"
                                            />
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading
                                            ? otpSent ? 'Verifying...' : 'Sending OTP...'
                                            : otpSent ? 'Verify OTP' : 'Send OTP'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    <Link to="/salonlogin">Back to Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {verified && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">OTP Verified</h5>
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

export default SalonForgotPassword;
