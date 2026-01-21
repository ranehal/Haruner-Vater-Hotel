import { useEffect, useState, useRef } from 'react';
import { Modal } from 'bootstrap';
import { useToast } from '../context/ToastContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const RoomList = ({ user }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomBookings, setRoomBookings] = useState([]); // Store booked dates for selected room
    const [guestName, setGuestName] = useState(user ? user.username : '');
    
    // Booking Dates State
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [dateError, setDateError] = useState('');
    
    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState('');
    const [isCouponValid, setIsCouponValid] = useState(false);

    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const { addToast } = useToast();

    // Fetch Rooms & Sort
    useEffect(() => {
        fetch('/api/rooms')
            .then(res => res.json())
            .then(data => {
                // Sort: Available first
                const sorted = data.sort((a, b) => (a.status === 'AVAILABLE' ? -1 : 1));
                setRooms(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching rooms:", err);
                addToast("Failed to load rooms. Please try again.", "error");
            });
    }, [addToast]);

    // Initialize Modal
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new Modal(modalRef.current);
        }
        return () => {
            if (modalInstance.current) {
                modalInstance.current.dispose();
                modalInstance.current = null;
            }
        };
    }, []);

    // Get excluded dates
    const getExcludedDates = () => {
        const excluded = [];
        roomBookings.forEach(booking => {
            let current = new Date(booking.checkInDate);
            const end = new Date(booking.checkOutDate);
            // Include start date, exclude end date typically, but here we want to block the night.
            // If someone checks out on date X, date X is available for checkin.
            // So we block from Start (inclusive) to End (exclusive)
            while (current < end) {
                excluded.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
        });
        return excluded;
    };

    // Calculate Total Cost & Validate Dates
    useEffect(() => {
        setDateError('');
        if (selectedRoom && checkIn && checkOut) {
            if (checkIn >= checkOut) {
                setTotalCost(0);
                return;
            }

            // Check overlap logic is handled by DatePicker exclude, but double check cost calc
            const diffTime = Math.abs(checkOut - checkIn);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays > 0) {
                let cost = diffDays * selectedRoom.pricePerNight;
                if (couponDiscount > 0) {
                    cost = cost * (1 - couponDiscount / 100);
                }
                setTotalCost(cost);
            } else {
                setTotalCost(0);
            }
        } else {
            setTotalCost(0);
        }
    }, [checkIn, checkOut, selectedRoom, couponDiscount]);

    const validateCoupon = () => {
        if (!couponCode.trim()) return;
        
        fetch(`/api/coupons/validate/${couponCode}`)
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setCouponDiscount(data.discountPercentage);
                    setCouponMessage(data.message); // "Coupon applied successfully!"
                    setIsCouponValid(true);
                    addToast("Coupon applied successfully!", "success");
                } else {
                    setCouponDiscount(0);
                    setCouponMessage(data.message || "Invalid coupon.");
                    setIsCouponValid(false);
                    addToast(data.message || "Invalid coupon.", "error");
                }
            })
            .catch(err => {
                console.error(err);
                setCouponDiscount(0);
                setCouponMessage("Error validating coupon.");
                setIsCouponValid(false);
            });
    };

    const openBookingModal = (room) => {
        setSelectedRoom(room);
        setRoomBookings([]); // Clear previous
        setDateError('');
        
        // Reset Coupon
        setCouponCode('');
        setCouponDiscount(0);
        setCouponMessage('');
        setIsCouponValid(false);
        
        // Fetch bookings for this room to determine availability
        fetch(`/api/bookings?roomId=${room.id}`)
            .then(res => res.json())
            .then(bookings => setRoomBookings(bookings))
            .catch(err => console.error("Failed to fetch room bookings", err));
        
        // Default Dates: Today -> Tomorrow
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setCheckIn(today);
        setCheckOut(tomorrow);

        // Reset name only if not logged in or keep user's name
        if (!guestName && user?.username) {
            setGuestName(user.username);
        } else if (!user) {
             setGuestName('');
        }
        
        if (!modalInstance.current && modalRef.current) {
            modalInstance.current = new Modal(modalRef.current);
        }
        modalInstance.current?.show();
    };

    const confirmBooking = () => {
        if (!guestName.trim()) {
            addToast("Please enter your name.", "error");
            return;
        }

        if (totalCost <= 0 || dateError) {
             addToast("Invalid stay duration or unavailable dates.", "error");
             return;
        }

        // Format dates for backend (YYYY-MM-DD)
        // Adjust for timezone offset to avoid previous day issue
        const formatDate = (date) => {
            const offset = date.getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - (offset*60*1000));
            return adjustedDate.toISOString().split('T')[0];
        };

        const booking = {
            room: { id: selectedRoom.id },
            customerName: guestName,
            customerEmail: user ? user.email : "guest@hotel.com",
            checkInDate: formatDate(checkIn),
            checkOutDate: formatDate(checkOut),
            couponCode: isCouponValid ? couponCode : null
        };

        const userId = user ? user.id : '';
        
        fetch(`/api/bookings?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        })
        .then(async res => {
            if (res.ok) {
                const data = await res.json();
                modalInstance.current.hide();
                addToast(`✨ Booking Confirmed! Total: $${data.totalCost || totalCost}`, "success");
            } else {
                const txt = await res.text();
                throw new Error(txt);
            }
        })
        .catch(err => {
            console.error("Booking failed", err);
            addToast(`Booking failed: ${err.message}`, "error");
        });
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <div className="spinner-border text-gold" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="w-100 py-3">
            {/* Header */}
            <div className="text-center mb-5 pb-3">
                <span className="text-gold text-uppercase fw-bold letter-spacing-2 small d-block mb-2">Accommodations</span>
                <h2 className="display-4 font-heading text-navy fw-bold">Suites & Rooms</h2>
                <p className="text-muted mx-auto mt-3" style={{maxWidth: '600px'}}>
                    Discover our collection of exclusive rooms, designed for comfort and crafted for luxury.
                </p>
            </div>

            {/* Room Grid */}
            <div className="row g-4">
                {rooms.map((room, index) => (
                    <div className="col-lg-4 col-md-6" key={room.id} style={{animation: `fadeInUp 0.6s ease forwards ${index * 0.1}s`, opacity: 0}}>
                        <div className="card glass-card h-100 border-0 overflow-hidden">
                            <div className="position-relative overflow-hidden">
                                <img 
                                    src={room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop"} 
                                    className="card-img-top" 
                                    alt={room.type} 
                                    style={{height: '280px', objectFit: 'cover', transition: 'transform 0.5s ease'}}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                                />
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className={`badge ${room.status === 'AVAILABLE' ? 'bg-white text-success' : 'bg-dark text-white'} rounded-pill px-3 py-2 shadow-sm border border-light`}>
                                        {room.status === 'AVAILABLE' ? 'Available' : 'Booked'}
                                    </span>
                                </div>
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-black to-transparent" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
                                     <h5 className="text-white font-heading mb-0 fs-4">{room.type}</h5>
                                </div>
                            </div>
                            
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-end mb-3">
                                    <div>
                                        <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Starting from</small>
                                        <div className="text-navy fw-bold fs-3 font-heading">${room.pricePerNight}</div>
                                    </div>
                                    <div className="text-warning small">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                </div>
                                
                                <p className="card-text text-muted small flex-grow-1 line-clamp-3">
                                    {room.description}
                                </p>
                                
                                <div className="d-flex justify-content-between align-items-center my-3 py-3 border-top border-bottom text-muted small">
                                    <span data-bs-toggle="tooltip" title="Free High-Speed WiFi"><i className="bi bi-wifi fs-5 me-1 text-gold"></i> WiFi</span>
                                    <span data-bs-toggle="tooltip" title="King Sized Bed"><i className="bi bi-layout-sidebar fs-5 me-1 text-gold"></i> Bed</span>
                                    <span data-bs-toggle="tooltip" title="24/7 Room Service"><i className="bi bi-cup-hot fs-5 me-1 text-gold"></i> Service</span>
                                </div>
                                
                                <button 
                                    className={`btn w-100 ${room.status === 'AVAILABLE' ? 'btn-navy' : 'btn-secondary disabled'}`} 
                                    onClick={() => openBookingModal(room)}
                                    disabled={room.status !== 'AVAILABLE'}
                                >
                                    {room.status === 'AVAILABLE' ? 'Book This Room' : 'Currently Unavailable'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Modal */}
            <div className="modal fade" id="bookingModal" tabIndex="-1" ref={modalRef} aria-hidden="true" style={{zIndex: 1055}} data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="modal-header bg-navy text-white border-0" style={{background: 'var(--primary-color)'}}>
                            <h5 className="modal-title font-heading text-white">Complete Your Reservation</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 bg-light">
                            {selectedRoom && (
                                <div className="mb-4 d-flex gap-3 align-items-center p-3 bg-white rounded shadow-sm border">
                                    <img 
                                        src={selectedRoom.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop"} 
                                        alt="Room" 
                                        className="rounded" 
                                        style={{width: '80px', height: '80px', objectFit: 'cover'}} 
                                    />
                                    <div>
                                        <h6 className="mb-1 font-heading text-navy">{selectedRoom.type}</h6>
                                        <span className="text-gold fw-bold">${selectedRoom.pricePerNight} <small className="text-muted fw-normal">/ night</small></span>
                                    </div>
                                </div>
                            )}
                            <div className="mb-3">
                                <label className="form-label small text-uppercase fw-bold text-muted">Guest Name</label>
                                <input 
                                    type="text" 
                                    className="form-control text-dark" 
                                    placeholder="Enter your full name" 
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="form-label small text-uppercase fw-bold text-muted">Check-In</label>
                                    <DatePicker
                                        selected={checkIn}
                                        onChange={date => setCheckIn(date)}
                                        selectsStart
                                        startDate={checkIn}
                                        endDate={checkOut}
                                        minDate={new Date()}
                                        excludeDates={getExcludedDates()}
                                        className="form-control text-dark"
                                        placeholderText="Select Date"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-uppercase fw-bold text-muted">Check-Out</label>
                                    <DatePicker
                                        selected={checkOut}
                                        onChange={date => setCheckOut(date)}
                                        selectsEnd
                                        startDate={checkIn}
                                        endDate={checkOut}
                                        minDate={checkIn}
                                        excludeDates={getExcludedDates()}
                                        className="form-control text-dark"
                                        placeholderText="Select Date"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                                {dateError && <div className="col-12 text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{dateError}</div>}
                            </div>
                            
                            {/* Unavailable Dates List */}
                            {roomBookings.length > 0 && (
                                <div className="mb-3 p-3 bg-warning bg-opacity-10 rounded border border-warning border-opacity-25">
                                    <h6 className="small fw-bold text-warning mb-2"><i className="bi bi-calendar-x me-1"></i> Unavailable Dates</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {roomBookings.filter(b => new Date(b.checkOutDate) >= new Date()).map(b => (
                                            <span key={b.id} className="badge bg-white text-dark border shadow-sm fw-normal">
                                                {b.checkInDate} <i className="bi bi-arrow-right-short text-muted"></i> {b.checkOutDate}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Coupon Code Section */}
                            <div className="mb-3">
                                <label className="form-label small text-uppercase fw-bold text-muted">Coupon Code</label>
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className={`form-control ${isCouponValid ? 'is-valid' : ''}`} 
                                        placeholder="Have a promo code?"
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value.toUpperCase());
                                            setIsCouponValid(false); // Reset validation on edit
                                            setCouponDiscount(0);
                                            setCouponMessage('');
                                        }}
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={validateCoupon}
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponMessage && (
                                    <div className={`form-text ${isCouponValid ? 'text-success' : 'text-danger'}`}>
                                        {couponMessage}
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center p-3 bg-navy text-white rounded mb-3" style={{background: 'var(--primary-color)'}}>
                                <span className="fw-bold">Total Cost</span>
                                <span className="fs-4 fw-bold text-gold">${totalCost.toFixed(2)}</span>
                            </div>

                            <div className="alert alert-info small border-0 bg-opacity-10 bg-primary mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                Payment will be collected upon arrival at the hotel.
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light p-3">
                            <button type="button" className="btn btn-light text-muted" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-navy px-4" onClick={confirmBooking} disabled={totalCost <= 0 || dateError}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .react-datepicker-wrapper {
                    width: 100%;
                }
                `}
            </style>
        </div>
    );
};

export default RoomList;