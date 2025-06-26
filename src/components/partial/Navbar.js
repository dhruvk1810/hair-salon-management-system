import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSalonLoggedIn: false
        };
    }

    componentDidMount() {
        this.syncLoginStatus();
        window.addEventListener('storage', this.syncLoginStatus);
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.syncLoginStatus);
    }

    syncLoginStatus = () => {
        const loggedIn = localStorage.getItem('salonLoggedIn') === 'true';
        this.setState({ isSalonLoggedIn: loggedIn });
    };

    handleLogout = () => {
        localStorage.removeItem('salonLoggedIn');
        localStorage.removeItem('salonEmail');
        window.location.href = '/';
    };

    render() {
        const { isSalonLoggedIn } = this.state;

        return (
            <header className="sticky-navbar">
                <div className="container">
                    <div className="header d-lg-flex justify-content-between align-items-center py-3">
                        <div className="header-agile">
                            <h1>
                                <Link to="/" className="navbar-brand logo">
                                    <span className="fa fa-scissors" aria-hidden="true"></span> HSM System
                                </Link>
                            </h1>
                        </div>
                        <div className="nav_w3ls">
                            <nav>
                                <label htmlFor="drop" className="toggle mt-lg-0 mt-1">
                                    <span className="fa fa-bars" aria-hidden="true"></span>
                                </label>
                                <input type="checkbox" id="drop" />
                                <ul className="menu">

                                    {!isSalonLoggedIn ? (
                                        <>
                                            {/* 👇 First group */}
                                            <li className="mr-lg-3 mr-2"><Link to="/">Home</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/salonlogin">Salon Login</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/salonregister">Salon Register</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/salonlist">Salon List</Link></li>

                                            {/* 👇 Second group */}
                                            <li className="mr-lg-3 mr-2"><Link to="/about">About</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/services">Services</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/contact">Contact Us</Link></li>
                                        </>
                                    ) : (
                                        <>
                                            {/* 👇 When logged in */}
                                            <li className="mr-lg-3 mr-2"><Link to="/salonhome">Salon Home</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/about">About</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/services">Services</Link></li>
                                            <li className="mr-lg-3 mr-2"><Link to="/contact">Contact Us</Link></li>
                                            <li className="mr-lg-3 mr-2">
                                                <button
                                                    onClick={this.handleLogout}
                                                    className="btn-sm"
                                                    style={{
														  backgroundColor: '#ffc905',
                                                          border: 'none',
                                                          padding: '5px 15px',
                                                          fontWeight: 'bold',
														  cursor: 'pointer'
                                                          }}>
        
                                                    Logout
                                                </button>
                                            </li>
                                        </>
                                    )}

                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Navbar;
