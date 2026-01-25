import { useEffect, useState } from 'react';

const ManagerDashboard = ({ initialTab = 'overview' }) => {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [bills, setBills] = useState([]); // Add bills state
    const [monthlyRevenue, setMonthlyRevenue] = useState(new Array(12).fill(0));
    const [activeTab, setActiveTab] = useState(initialTab); // overview, bookings, services, maintenance, reviews, rooms, bills
    
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);
    
    // Stats State
    const [stats, setStats] = useState({
        totalRevenue: 0,
        occupancyRate: 0,
        pendingServices: 0,
        avgRating: 0
    });

    // Room Form State
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [newRoom, setNewRoom] = useState({
        roomNumber: '',
        type: 'Standard King',
        pricePerNight: '',
        description: '',
        imageUrl: '',
        status: 'AVAILABLE'
    });

    const roomTypes = [
        "Standard Single", "Standard Double", "Standard King",
        "Deluxe Ocean View", "Deluxe Garden View",
        "Junior Suite", "Executive Suite", "Presidential Suite", "Penthouse"
    ];

    const defaultImages = {
        "Standard Single": "/images/rooms/single.jpg",
        "Standard Double": "/images/rooms/twin.jpg",
        "Standard King": "/images/rooms/queen.jpg",
        "Deluxe Ocean View": "/images/rooms/ocean.jpg",
        "Deluxe Garden View": "/images/rooms/garden.jpg",
        "Junior Suite": "/images/rooms/suite_junior.jpg",
        "Executive Suite": "/images/rooms/executive.jpg",
        "Presidential Suite": "/images/rooms/luxury.jpg",
        "Penthouse": "/images/rooms/luxury.jpg"
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [bookings, services, rooms, reviews, bills]);

    const fetchData = () => {
        const handleFetch = (p) => p.catch(err => {
            console.error(err);
            return []; // Return empty array on failure
        });

        Promise.all([
            fetch('/api/bookings').then(res => res.ok ? res.json() : []).catch(e => []),
            fetch('/api/services').then(res => res.ok ? res.json() : []).catch(e => []),
            fetch('/api/maintenance').then(res => res.ok ? res.json() : []).catch(e => []),
            fetch('/api/reviews').then(res => res.ok ? res.json() : []).catch(e => []),
            fetch('/api/rooms').then(res => res.ok ? res.json() : []).catch(e => []),
            fetch('/api/bills').then(res => res.ok ? res.json() : []).catch(e => [])
        ]).then(([b, s, m, rev, r, billsData]) => {
            setBookings(b || []);
            setServices(s || []);
            setMaintenance(m || []);
            setReviews(rev || []);
            setRooms(r || []);
            setBills(billsData || []);
        }).catch(err => {
             console.error("Dashboard data load failed", err);
             // alert("Failed to load dashboard data."); // Optional: don't annoy if just one failed
        });
    };

    const calculateStats = () => {
        // Revenue (from Paid Bills is more accurate, but falling back to bookings if no bills)
        const revenue = bills.filter(b => b.status === 'PAID').reduce((sum, b) => sum + (b.amount || 0), 0) || 
                        bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
        
        // Calculate Monthly Revenue from Paid Bills
        const monthly = new Array(12).fill(0);
        bills.forEach(bill => {
            if (bill.status === 'PAID' && bill.paymentDate) {
                const date = new Date(bill.paymentDate);
                if (date.getFullYear() === new Date().getFullYear()) { // Current Year
                    monthly[date.getMonth()] += (bill.amount || 0);
                }
            }
        });
        // If no real data yet, use simulated data for demo purposes so it's not empty
        const finalMonthly = monthly.every(m => m === 0) ? [4500, 5200, 4800, 7000, 8500, 9500, 8800, 9200, 7500, 6500, 5500, 9000] : monthly;
        setMonthlyRevenue(finalMonthly);

        // Occupancy (Simple: occupied rooms / total rooms)
        const occupied = rooms.filter(r => r.status === 'OCCUPIED').length;
        const totalRooms = rooms.length || 1;
        const occupancy = Math.round((occupied / totalRooms) * 100);

        // Pending Services
        const pending = services.filter(s => s.status !== 'COMPLETED').length;

        // Avg Rating
        const avg = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
            : 0;

        setStats({
            totalRevenue: revenue,
            occupancyRate: occupancy,
            pendingServices: pending,
            avgRating: avg
        });
    };

    const updateBookingStatus = (booking, isCheckedIn, isCheckedOut) => {
        const updated = { ...booking, checkedIn: isCheckedIn, checkedOut: isCheckedOut };
        fetch(`/api/bookings/${booking.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        }).then(() => fetchData());
    };

    const fulfillService = (request) => {
        fetch(`/api/services/${request.id}/complete`, { method: 'PUT' })
        .then(res => {
            if (res.ok) {
                fetchData();
            } else {
                alert('Failed to update service status');
            }
        })
        .catch(err => alert("Error updating service: " + err.message));
    };

    const resolveTicket = (id) => {
        fetch(`/api/maintenance/${id}/resolve`, { method: 'PUT' })
        .then(() => fetchData());
    };
    
    const generateBill = (bookingId) => {
        fetch(`/api/bills/generate/${bookingId}`, { method: 'POST' })
        .then(async res => {
            if(res.ok) {
                alert("Bill Generated Successfully!");
                fetchData();
            } else {
                const txt = await res.text();
                alert("Failed to generate bill: " + txt);
            }
        });
    };

    const markBillPaid = (billId) => {
         fetch(`/api/bills/${billId}/pay`, { method: 'PUT' })
        .then(() => fetchData());
    };

    const handleRoomTypeChange = (e) => {
        const type = e.target.value;
        setNewRoom({
            ...newRoom,
            type: type,
            imageUrl: defaultImages[type] || newRoom.imageUrl
        });
    };

    const handleCreateOrUpdateRoom = (e) => {
        e.preventDefault();
        const url = isEditing ? `/api/rooms/${selectedRoomId}` : '/api/rooms';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRoom)
        })
        .then(async res => {
            if (res.ok) {
                alert(isEditing ? "Room Updated Successfully!" : "Room Created Successfully!");
                setShowRoomForm(false);
                setIsEditing(false);
                setNewRoom({ roomNumber: '', type: 'Standard King', pricePerNight: '', description: '', imageUrl: '', status: 'AVAILABLE' });
                fetchData();
            } else {
                const txt = await res.text();
                throw new Error(txt);
            }
        })
        .catch(err => alert("Operation failed: " + err.message));
    };

    const editRoom = (room) => {
        setNewRoom(room);
        setSelectedRoomId(room.id);
        setIsEditing(true);
        setShowRoomForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteRoom = (id) => {
        if(confirm("Are you sure you want to delete this room? This cannot be undone.")) {
            fetch(`/api/rooms/${id}`, { method: 'DELETE' })
            .then(async res => {
                if (res.ok) {
                    fetchData();
                } else {
                    alert("Cannot delete room. It might be referenced by existing bookings.");
                }
            })
            .catch(err => alert("Delete failed."));
        }
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-navy border-bottom pb-2 font-heading">
                <i className="bi bi-speedometer2 me-2"></i>Manager Dashboard
            </h2>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="row g-4 animate-fade-in">
                    {/* KPI Cards */}
                    <div className="col-md-3">
                        <div className="card glass-panel border-0 shadow-sm p-3 h-100 text-center">
                            <h6 className="text-muted text-uppercase small fw-bold">Total Revenue</h6>
                            <h3 className="text-navy font-heading display-6 fw-bold">${stats.totalRevenue.toLocaleString()}</h3>
                            <div className="text-success small"><i className="bi bi-arrow-up"></i> +12% this week</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card glass-panel border-0 shadow-sm p-3 h-100 text-center">
                            <h6 className="text-muted text-uppercase small fw-bold">Occupancy Rate</h6>
                            <div className="position-relative d-inline-block my-2" style={{width: '60px', height: '60px'}}>
                                <svg viewBox="0 0 36 36" className="w-100 h-100">
                                    <path className="text-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                    <path className="text-gold" strokeDasharray={`${stats.occupancyRate}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                </svg>
                                <div className="position-absolute top-50 start-50 translate-middle fw-bold">{stats.occupancyRate}%</div>
                            </div>
                            <div className="text-muted small">{rooms.length} Total Rooms</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card glass-panel border-0 shadow-sm p-3 h-100 text-center">
                            <h6 className="text-muted text-uppercase small fw-bold">Service Requests</h6>
                            <h3 className="text-warning font-heading display-6 fw-bold">{stats.pendingServices}</h3>
                            <div className="text-muted small">Pending Actions</div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card glass-panel border-0 shadow-sm p-3 h-100 text-center">
                            <h6 className="text-muted text-uppercase small fw-bold">Guest Satisfaction</h6>
                            <h3 className="text-navy font-heading display-6 fw-bold">{stats.avgRating} <small className="fs-6 text-muted">/ 5.0</small></h3>
                            <div className="text-warning small">
                                {Array.from({length: Math.round(stats.avgRating)}).map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                            </div>
                        </div>
                    </div>

                    {/* Yearly Revenue Chart */}
                    <div className="col-md-8">
                        <div className="card glass-panel border-0 shadow-sm p-4 h-100">
                            <h5 className="text-navy font-heading mb-4">Yearly Revenue Overview</h5>
                            <div className="d-flex align-items-end justify-content-between h-100 ps-2 pb-2" style={{minHeight: '200px'}}>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                                    const maxRev = Math.max(...monthlyRevenue, 1);
                                    const val = monthlyRevenue[i];
                                    const heightPercentage = Math.max((val / maxRev) * 100, 5); // Min 5% height
                                    
                                    return (
                                        <div key={month} className="text-center w-100 mx-1">
                                            <div className="rounded-top mx-auto position-relative group-hover-tooltip" 
                                                 style={{
                                                     height: `${heightPercentage}%`, 
                                                     width: '100%', 
                                                     maxWidth: '30px',
                                                     background: 'linear-gradient(to top, var(--primary-color), var(--secondary-color))',
                                                     opacity: 0.8,
                                                     transition: 'height 1s ease',
                                                     cursor: 'pointer'
                                                 }} 
                                                 title={`$${val.toLocaleString()}`}
                                            >
                                                <div className="position-absolute bottom-100 start-50 translate-middle-x bg-dark text-white text-xs rounded px-2 py-1 mb-1 opacity-0 hover-opacity-100 transition-opacity" style={{pointerEvents: 'none', fontSize: '0.7rem'}}>
                                                    ${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}
                                                </div>
                                            </div>
                                            <small className="d-block mt-2 text-muted fw-bold" style={{fontSize: '0.7rem'}}>{month}</small>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="col-md-4">
                        <div className="card glass-panel border-0 shadow-sm p-4 h-100">
                            <h5 className="text-navy font-heading mb-4">Live Activity</h5>
                            <ul className="list-unstyled">
                                {bookings.slice(0, 3).map(b => (
                                    <li key={b.id} className="mb-3 border-bottom pb-2">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold text-navy">New Booking</span>
                                            <small className="text-muted">Just now</small>
                                        </div>
                                        <div className="small text-muted">{b.customerName} booked {b.room.type}</div>
                                    </li>
                                ))}
                                {services.slice(0, 2).map(s => (
                                    <li key={s.id} className="mb-3 border-bottom pb-2">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold text-warning">Service Req</span>
                                            <small className="text-muted">5m ago</small>
                                        </div>
                                        <div className="small text-muted">Room {s.roomNumber}: {s.type}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Front Desk Tab */}
            {activeTab === 'bookings' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <h4 className="card-title mb-3 text-navy font-heading"><i className="bi bi-people me-2"></i>Guest Manifest</h4>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Guest Info</th>
                                    <th>Room</th>
                                    <th>Stay Duration</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>
                                            <strong>{b.customerName}</strong><br/>
                                            <small className="text-muted"><i className="bi bi-envelope me-1"></i>{b.customerEmail}</small>
                                        </td>
                                        <td><span className="badge bg-white text-dark border shadow-sm">{b.room.roomNumber}</span></td>
                                        <td>{b.checkInDate} <i className="bi bi-arrow-right-short text-muted"></i> {b.checkOutDate}</td>
                                        <td>
                                            {b.checkedOut ? <span className="badge bg-secondary">Departed</span> : 
                                             b.checkedIn ? <span className="badge bg-success">In-House</span> : 
                                             <span className="badge bg-warning text-dark">Arriving</span>}
                                        </td>
                                        <td>
                                            {!b.checkedIn && !b.checkedOut && (
                                                <button className="btn btn-sm btn-outline-success me-2 rounded-pill" onClick={() => updateBookingStatus(b, true, false)}>
                                                    Check In
                                                </button>
                                            )}
                                            {b.checkedIn && !b.checkedOut && (
                                                <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => updateBookingStatus(b, true, true)}>
                                                    Check Out
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="card-title text-navy font-heading"><i className="bi bi-key me-2"></i>Room Management</h4>
                        <button className="btn btn-navy rounded-pill btn-sm" onClick={() => setShowRoomForm(!showRoomForm)}>
                            <i className="bi bi-plus-lg me-1"></i> Add Room
                        </button>
                    </div>

                    {showRoomForm && (
                        <div className="card border-0 bg-light p-4 mb-4 rounded-3 shadow-inner">
                            <h5 className="mb-3 text-navy">{isEditing ? 'Update Room' : 'Add New Room'}</h5>
                            <form onSubmit={handleCreateOrUpdateRoom}>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold">Room Number</label>
                                        <input type="text" className="form-control" placeholder="e.g. 501" required
                                            value={newRoom.roomNumber} onChange={e => setNewRoom({...newRoom, roomNumber: e.target.value})} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold">Type</label>
                                        <select className="form-select" value={newRoom.type} onChange={handleRoomTypeChange}>
                                            {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold">Price / Night</label>
                                        <input type="number" className="form-control" placeholder="e.g. 250.00" required
                                            value={newRoom.pricePerNight} onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label small fw-bold">Status</label>
                                        <select className="form-select" value={newRoom.status} onChange={e => setNewRoom({...newRoom, status: e.target.value})}>
                                            <option value="AVAILABLE">Available</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="DIRTY">Dirty</option>
                                            <option value="OCCUPIED">Occupied</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Description</label>
                                        <textarea className="form-control" rows="2" placeholder="Room features..." required
                                            value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label small fw-bold">Room Image</label>
                                        <div className="input-group mb-2">
                                            <input type="file" className="form-control" accept="image/*" onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    fetch('/api/uploads/room-image', {
                                                        method: 'POST',
                                                        body: formData
                                                    })
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        if (data.url) {
                                                            setNewRoom({...newRoom, imageUrl: data.url});
                                                        } else {
                                                            alert('Upload failed: ' + (data.error || 'Unknown error'));
                                                        }
                                                    })
                                                    .catch(err => alert('Upload error: ' + err.message));
                                                }
                                            }} />
                                        </div>
                                        <input type="text" className="form-control" placeholder="Or enter Image URL manually..."
                                            value={newRoom.imageUrl} onChange={e => setNewRoom({...newRoom, imageUrl: e.target.value})} />
                                        <div className="form-text">Upload an image or paste a URL. Defaults applied based on room type if left blank.</div>
                                        {newRoom.imageUrl && (
                                            <div className="mt-2">
                                                <small className="d-block text-muted mb-1">Preview:</small>
                                                <img src={newRoom.imageUrl} alt="Preview" className="img-thumbnail" style={{height: '100px'}} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-12 text-end">
                                        <button type="button" className="btn btn-link text-muted me-2" onClick={() => { setShowRoomForm(false); setIsEditing(false); setNewRoom({ roomNumber: '', type: 'Standard King', pricePerNight: '', description: '', imageUrl: '', status: 'AVAILABLE' }); }}>Cancel</button>
                                        <button type="submit" className="btn btn-gold rounded-pill px-4">{isEditing ? 'Update Room' : 'Create Room'}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Room #</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Reviews</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(r => (
                                    <tr key={r.id}>
                                        <td className="fw-bold">{r.roomNumber}</td>
                                        <td>{r.type}</td>
                                        <td className="text-gold fw-bold">${r.pricePerNight}</td>
                                        <td>
                                            <span className={`badge ${r.status === 'AVAILABLE' ? 'bg-success' : r.status === 'MAINTENANCE' ? 'bg-danger' : 'bg-secondary'}`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td><i className="bi bi-star-fill text-warning me-1"></i>{r.averageRating || '-'} ({r.totalReviews || 0})</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary rounded-circle me-2" onClick={() => editRoom(r)} title="Edit Room">
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => deleteRoom(r.id)} title="Delete Room">
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <h4 className="card-title mb-3 text-navy font-heading"><i className="bi bi-bell me-2"></i>Concierge Requests</h4>
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Type</th>
                                <th>Room</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(s => (
                                <tr key={s.id}>
                                    <td><span className="badge bg-info text-dark">{s.type}</span></td>
                                    <td>{s.roomNumber}</td>
                                    <td>{s.description}</td>
                                    <td>
                                        {s.status !== 'COMPLETED' && (
                                            <button className="btn btn-sm btn-primary rounded-pill" onClick={() => fulfillService(s)}>
                                                Mark Done
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === 'maintenance' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <h4 className="card-title mb-3 text-navy font-heading"><i className="bi bi-tools me-2"></i>Maintenance Tickets</h4>
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Room</th>
                                <th>Issue</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenance.map(t => (
                                <tr key={t.id}>
                                    <td>{t.roomNumber}</td>
                                    <td>{t.issueDescription}</td>
                                    <td>
                                        <span className={`badge ${t.priority === 'HIGH' ? 'bg-danger' : t.priority === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td>{t.status}</td>
                                    <td>
                                        {t.status === 'OPEN' && (
                                            <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => resolveTicket(t.id)}>
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <h4 className="card-title mb-3 text-navy font-heading"><i className="bi bi-star me-2"></i>Guest Feedback</h4>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Room</th>
                                    <th>Guest</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map(r => (
                                    <tr key={r.id}>
                                        <td>{r.room.roomNumber}</td>
                                        <td>{r.customerName}</td>
                                        <td>
                                            {Array.from({ length: r.rating }).map((_, i) => (
                                                <i key={i} className="bi bi-star-fill text-warning small"></i>
                                            ))}
                                        </td>
                                        <td className="text-muted">"{r.comment}"</td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No reviews yet</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Bills Tab */}
            {activeTab === 'bills' && (
                <div className="card glass-panel border-0 shadow-sm p-3">
                    <h4 className="card-title mb-3 text-navy font-heading"><i className="bi bi-receipt me-2"></i>Billing & Invoices</h4>
                    
                    <ul className="nav nav-tabs mb-3" id="billingTabs" role="tablist">
                         <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="all-bills-tab" data-bs-toggle="tab" data-bs-target="#all-bills" type="button" role="tab">All Bills</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="pending-gen-tab" data-bs-toggle="tab" data-bs-target="#pending-gen" type="button" role="tab">Pending Generation</button>
                        </li>
                    </ul>

                    <div className="tab-content" id="billingTabsContent">
                        <div className="tab-pane fade show active" id="all-bills" role="tabpanel">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Guest</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.map(bill => (
                                            <tr key={bill.id}>
                                                <td>INV-{bill.id + 1000}</td>
                                                <td>{bill.booking.customerName}</td>
                                                <td className="fw-bold text-navy">${bill.amount}</td>
                                                <td>
                                                    <span className={`badge ${bill.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {bill.status}
                                                    </span>
                                                </td>
                                                <td>{bill.issueDate}</td>
                                                <td>
                                                    {bill.status !== 'PAID' && (
                                                        <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => markBillPaid(bill.id)}>
                                                            Mark Paid
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {bills.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No bills generated yet</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="pending-gen" role="tabpanel">
                             <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Guest</th>
                                            <th>Room</th>
                                            <th>Stay</th>
                                            <th>Total Cost</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.filter(b => !bills.some(bill => bill.booking.id === b.id)).map(b => (
                                            <tr key={b.id}>
                                                <td>{b.customerName}</td>
                                                <td>{b.room.roomNumber}</td>
                                                <td>{b.checkInDate} - {b.checkOutDate}</td>
                                                <td className="fw-bold">${b.totalCost}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-gold rounded-pill" onClick={() => generateBill(b.id)}>
                                                        Generate Bill
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                         {bookings.filter(b => !bills.some(bill => bill.booking.id === b.id)).length === 0 && 
                                            <tr><td colSpan="5" className="text-center text-muted">All bookings have bills.</td></tr>
                                         }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;