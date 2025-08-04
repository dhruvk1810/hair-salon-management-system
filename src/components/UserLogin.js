import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import 'bootstrap-icons/font/bootstrap-icons.css';

class UserLogin extends Component {
    state = {
        email: '',
        password: '',
        error: '',
        loading: false,
        showSuccessPopup: false,
        showPassword: false
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        if (!email || !password) {
            return this.setState({ error: 'Please enter email and password.' });
        }

        this.setState({ loading: true, error: '' });

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ showSuccessPopup: true });

                setTimeout(() => {
                    this.setState({ showSuccessPopup: false });
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userLoggedIn', 'true');
                    window.location.href = '/';
                }, 1500);
            } else {
                this.setState({ error: data.error || data.message || 'Login failed', loading: false });
            }
        } catch (err) {
            this.setState({ error: 'Server error. Please try again later.', loading: false });
        }
    };

    handleSocialLogin = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userLoggedIn', 'true');
            window.location.href = '/';
        } catch (error) {
            this.setState({ error: error.message });
        }
    };

    render() {
        const { email, password, showPassword, loading, showSuccessPopup, error } = this.state;

        return (
            <div>
                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">User Login</li>
                    </ol>
                </div>

                <div className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow p-4 position-relative">
                                <h3 className="text-center mb-4">User Login</h3>

                                {loading && (
                                    <div className="text-center mb-3">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label>Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={email}
                                            onChange={this.handleChange}
                                            placeholder="Enter email"
                                        />
                                    </div>

                                    <div className="form-group mb-2 position-relative">
                                        <label>Password:</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            className="form-control"
                                            value={password}
                                            onChange={this.handleChange}
                                            placeholder="Enter password"
                                        />
                                        <span
                                            onClick={() => this.setState({ showPassword: !showPassword })}
                                            style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '48px',
                                                cursor: 'pointer',
                                                color: '#999'
                                            }}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </span>
                                    </div>

                                    <div className="mb-3 text-end">
                                        <Link to="/userforgotpassword" className="text-decoration-none">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <div className="d-grid mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ height: '45px' }}
                                            disabled={loading}
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                </form>

                                <p className="text-center mt-3 mb-3">
                                    Don’t have an account? <Link to="/useraccount">Register here</Link>
                                </p>

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-2 text-muted">OR</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <div className="d-flex flex-column gap-2">
                                    <button
                                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                                        style={{ height: '45px' }}
                                        onClick={() => this.handleSocialLogin(googleProvider)}
                                    >
                                        <i className="bi bi-google"></i> Continue with Google
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

export default UserLogin;
