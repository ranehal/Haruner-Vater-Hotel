import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('hotel_user');
        setUser(null);
        navigate('/login');
        setDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3 text-gold" to="/" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
                    <i className="bi bi-buildings-fill me-2"></i> HARUN'S
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item px-2">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {user?.role === 'GUEST' && (
                            <li className="nav-item d-flex align-items-center ms-3">
                                <div className="nav nav-pills glass-panel p-1 d-inline-flex rounded-pill border-0 shadow-sm">
                                    <Link to="/rooms" className={`nav-link rounded-pill px-3 py-1 small fw-bold ${location.pathname === '/rooms' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        <i className="bi bi-calendar-check me-2"></i>Book a Stay
                                    </Link>
                                    <Link to="/my-bookings" className={`nav-link rounded-pill px-3 py-1 small fw-bold mx-1 ${location.pathname === '/my-bookings' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        <i className="bi bi-journal-text me-2"></i>My Bookings
                                    </Link>
                                    <Link to="/my-bills" className={`nav-link rounded-pill px-3 py-1 small fw-bold mx-1 ${location.pathname === '/my-bills' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        <i className="bi bi-receipt me-2"></i>Invoices
                                    </Link>
                                    <Link to="/services" className={`nav-link rounded-pill px-3 py-1 small fw-bold ${location.pathname === '/services' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        <i className="bi bi-bell me-2"></i>Concierge
                                    </Link>
                                </div>
                            </li>
                        )}

                        {user?.role === 'MANAGER' && (
                            <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                                <div className="nav nav-pills glass-panel p-1 d-flex flex-wrap flex-lg-nowrap justify-content-center rounded-pill border-0 shadow-sm" style={{overflowX: 'auto'}}>
                                    <Link to="/manager" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap ${location.pathname === '/manager' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Overview
                                    </Link>
                                    <Link to="/manager/bookings" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap mx-1 ${location.pathname === '/manager/bookings' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Front Desk
                                    </Link>
                                    <Link to="/manager/rooms" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap ${location.pathname === '/manager/rooms' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Rooms
                                    </Link>
                                    <Link to="/manager/services" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap mx-1 ${location.pathname === '/manager/services' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Services
                                    </Link>
                                    <Link to="/manager/maintenance" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap ${location.pathname === '/manager/maintenance' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Maintenance
                                    </Link>
                                    <Link to="/manager/reviews" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap mx-1 ${location.pathname === '/manager/reviews' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Reviews
                                    </Link>
                                    <Link to="/manager/bills" className={`nav-link rounded-pill px-3 py-1 small fw-bold text-nowrap ${location.pathname === '/manager/bills' ? 'active btn-navy text-white' : 'text-dark'}`}>
                                        Billing
                                    </Link>
                                </div>
                            </li>
                        )}

                        {user?.role === 'ADMIN' && (
                            <li className="nav-item px-2"><Link className="nav-link" to="/admin">Administration</Link></li>
                        )}
                        
                        {/* Always show Rooms link for visitors to browse */}
                        {!user && (
                             <li className="nav-item px-2"><Link className="nav-link" to="/rooms">Stay</Link></li>
                        )}
                    </ul>
                    
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <div className="dropdown" ref={dropdownRef}>
                                <button 
                                    className={`btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 ${dropdownOpen ? 'show' : ''}`} 
                                    type="button" 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    aria-expanded={dropdownOpen}
                                >
                                    <div className="bg-white text-navy rounded-circle d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                                        <i className="bi bi-person-fill" style={{fontSize: '0.9rem'}}></i>
                                    </div>
                                    <span className="font-heading">{user.username}</span>
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 glass-panel p-2 ${dropdownOpen ? 'show' : ''}`} style={{right: 0, left: 'auto'}}>
                                    <li><span className="dropdown-item-text small text-muted text-uppercase fw-bold">Signed in as</span></li>
                                    <li><span className="dropdown-item-text font-heading text-navy fw-bold mb-2">{user.username}</span></li>
                                    <li><hr className="dropdown-divider opacity-25" /></li>
                                    <li>
                                        <button className="dropdown-item rounded-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right"></i> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-gold btn-sm px-4 rounded-pill shadow-sm fw-bold">Sign In</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
