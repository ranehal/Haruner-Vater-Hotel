import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ setUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(async res => {
            if (res.ok) {
                const user = await res.json();
                setUser(user); // Auto-login on signup
                navigate('/rooms');
            } else {
                const msg = await res.text();
                setError(msg || 'Registration failed');
            }
        })
        .catch(() => setError('Connection failed'));
    };

    return (
        <div className="d-flex justify-content-center align-items-center position-relative overflow-hidden" 
             style={{
                 minHeight: '100vh', 
                 marginTop: '-86px', 
                 paddingTop: '80px'
             }}>
            
            {/* Background Image */}
            <div className="position-absolute top-0 start-0 w-100 h-100" 
                 style={{
                     backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop')",
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     zIndex: -2
                 }}>
            </div>
            
            {/* Dark Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'rgba(15, 23, 42, 0.6)', zIndex: -1}}></div>
            
            <div className="card glass-panel p-5 border-0 position-relative z-2" style={{maxWidth: '450px', width: '100%'}}>
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center bg-white text-navy rounded-circle mb-3 shadow-lg" style={{width: '70px', height: '70px'}}>
                        <i className="bi bi-person-plus-fill fs-2"></i>
                    </div>
                    <h3 className="font-heading fw-bold text-navy mb-1">Create Account</h3>
                    <p className="text-muted small">Join us for a premium experience</p>
                </div>

                {error && <div className="alert alert-danger py-2 small text-center rounded-3 border-0 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-2">Username</label>
                        <input type="text" 
                            className="form-control border-0 shadow-sm" 
                            placeholder="Choose a username"
                            value={formData.username} 
                            onChange={e => setFormData({...formData, username: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-2">Email Address</label>
                        <input type="email" 
                            className="form-control border-0 shadow-sm" 
                            placeholder="name@example.com"
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-2">Password</label>
                        <input type="password" 
                            className="form-control border-0 shadow-sm" 
                            placeholder="••••••••"
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-gold w-100 py-3 shadow-lg fw-bold mb-3 rounded-pill text-white">
                        REGISTER
                    </button>
                </form>
                
                <div className="text-center mt-3">
                    <span className="text-muted small">Already a member? </span>
                    <Link to="/login" className="text-navy text-decoration-none fw-bold small">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
