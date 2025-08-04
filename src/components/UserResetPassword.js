import React, { Component } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// HOC to use hooks in class component
function withLocation(Component) {
    return function WrappedComponent(props) {
        const location = useLocation();
        return <Component {...props} location={location} />;
    };
}

class UserResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            showPassword: false,
            loading: false,
            message: '',
            error: '',
            success: false,
            showSuccessPopup: false
        };
    }

    getEmailFromQuery = () => {
        const params = new URLSearchParams(this.props.location.search);
        return params.get('email');
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '', message: '' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmPassword } = this.state;
        const email = this.getEmailFromQuery();

        if (!email) {
            this.setState({ error: 'Email not found in URL. Go back and verify OTP again.' });
            return;
        }

        if (!password || !confirmPassword) {
            this.setState({ error: 'Please enter all fields.' });
            return;
        }

        if (password !== confirmPassword) {
            this.setState({ error: 'Passwords do not match.' });
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await fetch(`http://localhost:5000/api/users/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ showSuccessPopup: true });

                setTimeout(() => {
                    this.setState({ success: true });
                }, 1500);
            } else {
                this.setState({ error: data.error || 'Reset failed.' });
            }
        } catch (err) {
            this.setState({ error: 'Server error. Try again later.' });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const {
            password,
            confirmPassword,
            showPassword,
            error,
            message,
            loading,
            success,
            showSuccessPopup
        } = this.state;

        if (success) {
            return <Navigate to="/userlogin" />;
        }

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">User Reset Password</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4">
                                <h3 className="text-center mb-4">Reset Your Password</h3>

                                {error && <div className="alert alert-danger">{error}</div>}
                                {message && <div className="alert alert-success">{message}</div>}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3 position-relative">
                                        <label>New Password:</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-control"
                                            value={password}
                                            onChange={this.handleChange}
                                            placeholder="Enter new password"
                                        />
                                        <span
                                            onClick={() => this.setState({ showPassword: !showPassword })}
                                            style={{
                                                position: 'absolute',
                                                top: '48px',
                                                right: '15px',
                                                cursor: 'pointer',
                                                color: '#999'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Confirm Password:</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={this.handleChange}
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>

                                <p className="text-center mt-3">
                                    <Link to="/userlogin">Back to Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {showSuccessPopup && (
                    <div style={styles.overlay}>
                        <div style={styles.popup}>
                            <div className="spinner-border text-success mb-3" role="status" />
                            <h5 className="text-success">Password reset successful</h5>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

// Popup Styles
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

export default withLocation(UserResetPassword);
