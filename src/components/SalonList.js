import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

class SalonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            salons: [],
            search: '',
            statusMap: {},
            loadingStatuses: false,
            showRefreshModal: false
        };
    }

    componentDidMount() {
        this.loadSalons();
    }

    loadSalons = () => {
        fetch('http://localhost:5000/api/salons/all')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    this.setState({ salons: data }, this.fetchStatuses);
                } else {
                    alert("Invalid response from server");
                }
            })
            .catch(() => alert("Failed to load salons"));
    };

    fetchStatuses = async () => {
        this.setState({ loadingStatuses: true, showRefreshModal: true });
        document.body.style.overflow = 'hidden';

        const { salons } = this.state;
        const statusMap = {};
        const today = new Date().toISOString().split('T')[0];

        await Promise.all(
            salons.map(async (salon) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/salons/status/${encodeURIComponent(salon.salonName)}`);
                    const data = await res.json();

                    if (!data.success || data.isOpen === false) {
                        statusMap[salon._id] = { status: 'Unknown', count: 0 };
                        return;
                    }

                    const apptRes = await fetch(`http://localhost:5000/api/appointments/salon/${encodeURIComponent(salon.salonName)}`);
                    const apptData = await apptRes.json();

                    const todaysAppointments = apptData.appointments?.filter(appt => appt.date === today) || [];
                    const isBusy = todaysAppointments.length > 0;

                    statusMap[salon._id] = {
                        status: isBusy ? 'Busy' : 'Free',
                        count: todaysAppointments.length
                    };
                } catch {
                    statusMap[salon._id] = { status: 'Unknown', count: 0 };
                }
            })
        );

        this.setState({ statusMap, loadingStatuses: false });

        setTimeout(() => {
            this.setState({ showRefreshModal: false });
            document.body.style.overflow = 'auto';
        }, 1500);
    };

    handleSearch = (e) => {
        this.setState({ search: e.target.value });
    };

    handleCheckStatus = (salonName) => {
        const encoded = encodeURIComponent(salonName);
        window.open(`/salonstatus?salon=${encoded}`, '_blank');
    };

    render() {
        const { salons, search, statusMap, loadingStatuses, showRefreshModal } = this.state;

        const filteredSalons = salons.filter(salon =>
            salon.salonName.toLowerCase().includes(search.toLowerCase()) ||
            salon.city.toLowerCase().includes(search.toLowerCase()) ||
            salon.state.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div>
                {/* Inline CSS for popup modal */}
                <style>{`
                    .refresh-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 1050;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .refresh-modal-box {
                        background: white;
                        padding: 40px 50px;
                        border-radius: 12px;
                        text-align: center;
                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                    }
                `}</style>

                {/* Refresh Modal */}
                {showRefreshModal && (
                    <div className="refresh-modal-overlay">
                        <div className="refresh-modal-box">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="mt-3 fw-semibold">Refreshing statuses...</p>
                        </div>
                    </div>
                )}

                <section className="inner-page-banner" id="home"></section>

                <div className="breadcrumb-agile">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">Salon List</li>
                    </ol>
                </div>

                <div className="container py-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>All Registered Salons</h2>
                        <button className="btn btn-outline-primary btn-sm" onClick={this.fetchStatuses}>
                            🔄 Refresh Status
                        </button>
                    </div>

                    <div className="input-group mb-4 shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <FaSearch />
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search by name, city, or state"
                            value={search}
                            onChange={this.handleSearch}
                        />
                    </div>

                    <div className="row">
                        {filteredSalons.map((salon, index) => {
                            const statusObj = statusMap[salon._id];
                            const status = statusObj?.status;
                            const count = statusObj?.count;

                            return (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">{salon.salonName}</h5>
                                            <p><strong>Email:</strong> {salon.email}</p>
                                            <p><strong>Phone:</strong> {salon.phone}</p>
                                            <p><strong>Address:</strong> {salon.address}, {salon.city}, {salon.state} - {salon.pin}</p>

                                            <p className="mb-2">
                                                <strong>Status:</strong>{' '}
                                                {loadingStatuses ? (
                                                    <span className="badge bg-secondary">Checking...</span>
                                                ) : (
                                                    <span className={`badge ${
                                                        status === 'Busy' ? 'bg-danger' :
                                                        status === 'Free' ? 'bg-success' :
                                                        'bg-secondary'
                                                    }`}>
                                                        {status}{status === 'Busy' && count ? ` (${count})` : ''}
                                                    </span>
                                                )}
                                            </p>

                                            <button
                                                className="btn btn-warning mt-2 w-100 fw-bold"
                                                onClick={() => this.handleCheckStatus(salon.salonName)}
                                            >
                                                About Salon
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredSalons.length === 0 && (
                            <div className="col-12 text-center text-danger">
                                No salons found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default SalonList;
