import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, occupancyRate: 0, revPAR: 0, totalRooms: 0 });
    const [rooms, setRooms] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'Single', pricePerNight: '', description: '', imageUrl: '', status: 'AVAILABLE' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/stats').then(res => res.json()).then(setStats);
        fetch('/api/rooms').then(res => res.json()).then(setRooms);
        fetch('/api/reviews').then(res => res.json()).then(setReviews);
    };

    const handleDeleteRoom = (id) => {
        if(confirm("Are you sure? This action cannot be undone.")) {
            fetch(`/api/rooms/${id}`, { method: 'DELETE' })
            .then(() => fetchData());
        }
    };

    const handleAddRoom = (e) => {
        e.preventDefault();
        fetch('/api/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        }).then(() => {
            setShowAddForm(false);
            fetchData();
            setNewRoom({ roomNumber: '', type: 'Single', pricePerNight: '', description: '', imageUrl: '', status: 'AVAILABLE' });
        });
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-navy border-bottom pb-2">
                <i className="bi bi-graph-up-arrow me-2"></i>Administration Console
            </h2>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3 p-3 h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Revenue</h5>
                            <p className="card-text display-6 fw-bold">${Math.round(stats.totalRevenue).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-success mb-3 p-3 h-100">
                        <div className="card-body">
                            <h5 className="card-title">Occupancy Rate</h5>
                            <p className="card-text display-6 fw-bold">{Math.round(stats.occupancyRate)}%</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-info mb-3 p-3 h-100">
                        <div className="card-body">
                            <h5 className="card-title">RevPAR</h5>
                            <p className="card-text display-6 fw-bold">${Math.round(stats.revPAR)}</p>
                            <small>Revenue Per Available Room</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-dark bg-warning mb-3 p-3 h-100">
                        <div className="card-body">
                            <h5 className="card-title">Total Rooms</h5>
                            <p className="card-text display-6 fw-bold">{stats.totalRooms}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Room Management */}
                <div className="col-lg-8">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-dark">Inventory Management</h4>
                        <button className="btn btn-navy" onClick={() => setShowAddForm(!showAddForm)}>
                            <i className="bi bi-plus-lg me-2"></i>Add New Room
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="card p-4 mb-4 bg-light">
                            <h5 className="text-navy mb-3">Create New Room Listing</h5>
                            <form onSubmit={handleAddRoom} className="row g-3">
                                <div className="col-md-2">
                                    <input type="text" className="form-control" placeholder="Room #" value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} required />
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})}>
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Penthouse">Penthouse</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <input type="number" className="form-control" placeholder="Price ($)" value={newRoom.pricePerNight} onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} required />
                                </div>
                                <div className="col-md-5">
                                    <input type="text" className="form-control" placeholder="Image URL" value={newRoom.imageUrl} onChange={e => setNewRoom({...newRoom, imageUrl: e.target.value})} />
                                </div>
                                <div className="col-12">
                                    <input type="text" className="form-control" placeholder="Description" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} />
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-success w-100">Save Room</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="row">
                        {rooms.map(room => (
                            <div className="col-md-6 mb-4" key={room.id}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title text-navy">Room {room.roomNumber}</h5>
                                            <span className="badge bg-secondary">{room.type}</span>
                                        </div>
                                        <p className="card-text text-muted small">{room.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-gold">${room.pricePerNight}</span>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRoom(room.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reviews Sidebar */}
                <div className="col-lg-4">
                    <h4 className="text-dark mb-3">Recent Feedback</h4>
                    <div className="card shadow-sm">
                        <ul className="list-group list-group-flush">
                            {reviews.slice(-5).reverse().map(r => (
                                <li className="list-group-item" key={r.id}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong className="text-navy">{r.customerName}</strong>
                                        <span className="badge bg-warning text-dark">{r.rating} <i className="bi bi-star-fill"></i></span>
                                    </div>
                                    <small className="text-muted d-block mb-1">Room {r.room.roomNumber}</small>
                                    <p className="mb-0 small fst-italic">"{r.comment}"</p>
                                </li>
                            ))}
                            {reviews.length === 0 && <li className="list-group-item text-center text-muted">No reviews yet.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
