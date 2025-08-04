import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSalonLoggedIn: false,
      isUserLoggedIn: false
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
    const salonLoggedIn = localStorage.getItem('salonLoggedIn') === 'true';
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    this.setState({
      isSalonLoggedIn: salonLoggedIn,
      isUserLoggedIn: userLoggedIn
    });
  };

  handleLogout = () => {
    localStorage.removeItem('salonLoggedIn');
    localStorage.removeItem('salonEmail');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = '/';
  };

  render() {
    const { isSalonLoggedIn, isUserLoggedIn } = this.state;

    const btnStyle = {
      backgroundColor: '#ffc905',
      border: 'none',
      padding: '5px 15px',
      fontWeight: 'bold',
      cursor: 'pointer'
    };

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
                  {/* Default Navbar when NOT logged in */}
                  {!isSalonLoggedIn && !isUserLoggedIn && (
                    <>
                      <li className="mr-lg-3 mr-2"><Link to="/">Home</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/userlogin">User Login</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/salonlogin">Salon Login</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/salonlist">Salon List</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/about">About</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/services">Services</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/contact">Contact Us</Link></li>
                    </>
                  )}

                  {/* When Salon is Logged In */}
                  {isSalonLoggedIn && (
                    <>
                      <li className="mr-lg-3 mr-2"><Link to="/salonhome">Salon Home</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/about">About</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/services">Services</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/contact">Contact Us</Link></li>
                      <li className="mr-lg-3 mr-2">
                        <button onClick={this.handleLogout} className="btn-sm" style={btnStyle}>Logout</button>
                      </li>
                    </>
                  )}

                  {/* When User is Logged In */}
                  {isUserLoggedIn && (
                    <>
                     <li className="mr-lg-3 mr-2"><Link to="/">Home</Link></li>
                      <li className="mr-lg-3 mr-2"><Link to="/userhistory">History</Link></li>
                      <li className="mr-lg-3 mr-2">
                        <button onClick={this.handleLogout} className="btn-sm" style={btnStyle}>Logout</button>
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
