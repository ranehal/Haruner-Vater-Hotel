import { useEffect, useState } from 'react';
import ServiceOrder from './ServiceOrder';
import RoomList from './RoomList';
import { useToast } from '../context/ToastContext';

const GuestDashboard = ({ user, initialTab = 'browse' }) => {
    const [myBookings, setMyBookings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bills, setBills] = useState([]); // Add bills state
    const [activeTab, setActiveTab] = useState(initialTab); // browse, my-bookings, services, billing
    const { addToast } = useToast();
    
    // Rating State
    const [reviewModal, setReviewModal] = useState(null); // { booking, existingReview? }
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

    // Trip Planner State
    const [tripDetails, setTripDetails] = useState('');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    useEffect(() => {
        if (user) {
            fetchBookingsAndReviews();
        }
    }, [user, activeTab]); 

    const fetchBookingsAndReviews = () => {
        Promise.all([
            fetch(`/api/bookings?userId=${user.id}`).then(res => res.json()),
            fetch('/api/reviews').then(res => res.json())
        ]).then(([bookingsData, reviewsData]) => {
            setMyBookings(bookingsData);
            setReviews(reviewsData);
            
            // Fetch bills for these bookings
            const billPromises = bookingsData.map(b => 
                fetch(`/api/bills/booking/${b.id}`).then(res => res.ok ? res.json() : null)
            );
            Promise.all(billPromises).then(billsData => {
                setBills(billsData.filter(b => b !== null));
            });
        });
    };

    const payBill = (billId) => {
        if(!confirm("Proceed with payment of bill #" + billId + "?")) return;
        
        fetch(`/api/bills/${billId}/pay`, { method: 'PUT' })
        .then(async res => {
            if(res.ok) {
                addToast("Payment Successful! Thank you.", "success");
                await fetchBookingsAndReviews(); // Wait for fetch
            } else {
                addToast("Payment failed. Please try again.", "error");
            }
        })
        .catch(err => addToast("Network error: " + err.message, "error"));
    };

    const openReviewModal = (booking, existingReview = null) => {
        setReviewModal({ booking, existingReview });
        if (existingReview) {
            setReviewData({ rating: existingReview.rating, comment: existingReview.comment });
        } else {
            setReviewData({ rating: 5, comment: '' });
        }
    };

    const submitReview = () => {
        const isEdit = !!reviewModal.existingReview;
        const url = isEdit ? `/api/reviews/${reviewModal.existingReview.id}` : '/api/reviews';
        const method = isEdit ? 'PUT' : 'POST';

        const payload = {
            room: { id: reviewModal.booking.room.id },
            customerName: user.username,
            rating: parseInt(reviewData.rating),
            comment: reviewData.comment
        };

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(async res => {
            if(res.ok) {
                addToast(isEdit ? "Review Updated Successfully" : "Review Submitted Successfully", 'success');
                setReviewModal(null);
                setReviewData({ rating: 5, comment: '' });
                fetchBookingsAndReviews(); // Refresh to show new stars
            } else {
                const errText = await res.text();
                addToast(`Failed to save review: ${errText}`, 'error');
            }
        })
        .catch(err => {
            addToast(`Network error: ${err.message}`, 'error');
        });
    };

    const submitTripPlan = () => {
        if (!tripDetails.trim()) return;
        
        fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'TRIP',
                description: `Trip Plan Request: ${tripDetails}`,
                cost: 0.00,
                status: 'PENDING',
                roomNumber: "N/A"
            })
        }).then(() => {
            addToast("Trip Planner request submitted! Concierge will contact you.", "success");
            setTripDetails('');
        });
    };

    return (
        <div className="container my-4">
            {/* Content Area */}
            <div className="mt-3">
                {/* Room Browser */}
                {activeTab === 'browse' && (
                    <RoomList user={user} />
                )}

                {/* My Bookings Grid */}
                {activeTab === 'my-bookings' && (
                    <div className="glass-panel p-4">
                        <h4 className="mb-4 text-navy font-heading">My Bookings</h4>
                        {myBookings.length === 0 ? <p className="text-muted text-center py-5">No active bookings found.</p> : (
                            <div className="row row-cols-1 row-cols-lg-2 g-4">
                                {myBookings.map(b => {
                                    // Find review for this room by this user
                                    const userReview = reviews.find(r => r.room.id === b.room.id && r.customerName === user.username);
                                    
                                    return (
                                        <div className="col" key={b.id}>
                                            <div className="card h-100 border-0 shadow-sm glass-card p-3">
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <h5 className="mb-1 text-navy font-heading">{b.room.type}</h5>
                                                        <span className="text-muted small">Room {b.room.roomNumber}</span>
                                                    </div>
                                                    {b.checkedOut ? 
                                                        <span className="badge bg-secondary rounded-pill">Completed</span> : 
                                                        <span className="badge bg-success bg-opacity-75 rounded-pill">Active</span>
                                                    }
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <div className="d-flex align-items-center mb-1 text-muted small">
                                                        <i className="bi bi-calendar3 me-2 text-gold"></i>
                                                        {b.checkInDate} — {b.checkOutDate}
                                                    </div>
                                                    <div className="fw-bold text-navy small">Total: ${b.totalCost}</div>
                                                </div>
                                                
                                                <div className="mt-auto d-flex justify-content-end align-items-center pt-3 border-top border-light">
                                                    {b.checkedOut && (
                                                        <>
                                                            {userReview ? (
                                                                <button className="btn btn-sm btn-light text-warning border-0 rounded-pill" onClick={() => openReviewModal(b, userReview)} title="Edit Rating">
                                                                    {Array.from({length: userReview.rating}).map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
                                                                    <i className="bi bi-pencil-square ms-2 text-muted small"></i>
                                                                </button>
                                                            ) : (
                                                                <button className="btn btn-sm btn-gold text-white rounded-pill px-3 shadow-sm" onClick={() => openReviewModal(b)}>
                                                                    Rate Stay
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                    <div className="glass-panel p-4">
                        <h4 className="mb-4 text-navy font-heading"><i className="bi bi-credit-card-2-front me-2"></i>My Invoices</h4>
                        {bills.length === 0 ? <p className="text-muted text-center py-5">No invoices generated yet.</p> : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Date</th>
                                            <th>Room</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bills.map(bill => (
                                            <tr key={bill.id}>
                                                <td>INV-{bill.id + 1000}</td>
                                                <td>{bill.issueDate}</td>
                                                <td>{bill.booking.room.type}</td>
                                                <td className="fw-bold text-navy">${bill.amount}</td>
                                                <td>
                                                    <span className={`badge ${bill.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                        {bill.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {bill.status !== 'PAID' ? (
                                                        <button className="btn btn-sm btn-gold rounded-pill px-3 shadow-sm" onClick={() => payBill(bill.id)}>
                                                            Pay Now
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" disabled>
                                                            <i className="bi bi-check-circle me-1"></i> Paid
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Services & Trip Planner */}
                {activeTab === 'services' && (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="glass-panel p-4 h-100">
                                <h4 className="text-navy font-heading mb-4"><i className="bi bi-cup-hot me-2"></i>Order Service</h4>
                                <ServiceOrder />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="glass-panel p-4 h-100">
                                <h4 className="text-navy font-heading mb-3"><i className="bi bi-compass me-2"></i>Trip Planner</h4>
                                <p className="small text-muted mb-4">Input your desired experiences. Our concierge team will create a custom itinerary for you.</p>
                                <textarea className="form-control mb-3" rows="5" placeholder="I wish to visit the Art Museum and have a romantic dinner..."
                                    value={tripDetails} onChange={e => setTripDetails(e.target.value)}></textarea>
                                <button className="btn btn-gold w-100 rounded-pill" onClick={submitTripPlan}>Submit Request</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {reviewModal && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content glass-panel border-0 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title font-heading text-navy">
                                    {reviewModal.existingReview ? 'Edit Your Review' : 'Rate Your Stay'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setReviewModal(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Rating (1-5)</label>
                                    <div className="d-flex gap-2 mb-2">
                                        {[1,2,3,4,5].map(star => (
                                            <i 
                                                key={star} 
                                                className={`bi bi-star-fill fs-4 cursor-pointer ${star <= reviewData.rating ? 'text-warning' : 'text-muted opacity-25'}`}
                                                onClick={() => setReviewData({...reviewData, rating: star})}
                                                style={{cursor: 'pointer'}}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small fw-bold">Comments</label>
                                    <textarea className="form-control border-0 shadow-sm" rows="3" value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})}></textarea>
                                </div>
                                <button className="btn btn-navy w-100 rounded-pill" onClick={submitReview}>
                                    {reviewModal.existingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestDashboard;