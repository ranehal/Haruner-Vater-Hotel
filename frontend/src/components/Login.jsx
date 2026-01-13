import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(async res => {
            if (res.ok) {
                const user = await res.json();
                setUser(user);
                
                // Redirect based on role
                if (user.role === 'ADMIN') navigate('/admin');
                else if (user.role === 'MANAGER') navigate('/manager');
                else navigate('/rooms'); // Customer
            } else {
                setError('Invalid Credentials');
            }
        })
        .catch(() => setError('Connection Failed.'));
    };

    const fillCredentials = (u, p) => {
        setUsername(u);
        setPassword(p);
    };

    return (
        <div className="d-flex justify-content-center align-items-center position-relative overflow-hidden" 
             style={{
                 minHeight: '100vh', 
                 marginTop: '-86px', // Offset navbar
                 paddingTop: '80px'
             }}>
            
            {/* Background Image with Parallax-like fix */}
            <div className="position-absolute top-0 start-0 w-100 h-100" 
                 style={{
                     backgroundImage: "url('/images/rooms/luxury.jpg')",
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     zIndex: -2
                 }}>
            </div>
            
            {/* Dark Overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{background: 'rgba(15, 23, 42, 0.5)', zIndex: -1}}></div>
            
            <div className="card glass-panel p-5 border-0 position-relative z-2" style={{maxWidth: '450px', width: '100%'}}>
                <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center bg-white text-navy rounded-circle mb-3 shadow-lg" style={{width: '70px', height: '70px'}}>
                        <i className="bi bi-buildings-fill fs-2"></i>
                    </div>
                    <h3 className="font-heading fw-bold text-navy mb-1">Welcome Back</h3>
                    <p className="text-muted small">Enter your credentials to access your account</p>
                </div>

                {error && <div className="alert alert-danger py-2 small text-center rounded-3 border-0 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-2">Username</label>
                        <input 
                            type="text" 
                            className="form-control border-0 shadow-sm" 
                            placeholder="e.g. guest"
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase letter-spacing-2">Password</label>
                        <input 
                            type="password" 
                            className="form-control border-0 shadow-sm" 
                            placeholder="••••••"
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-navy w-100 py-3 shadow-lg fw-bold mb-3 rounded-pill">
                        SIGN IN
                    </button>
                </form>
                
                <div className="text-center mt-3">
                    <span className="text-muted small">New here? </span>
                    <Link to="/signup" className="text-navy text-decoration-none fw-bold small">Create an Account</Link>
                </div>
                
                <div className="mt-5 pt-3 border-top border-white border-opacity-50 text-center">
                    <p className="text-muted small mb-2 fw-bold text-uppercase" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>Tap to Auto-fill Demo Account</p>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button type="button" className="btn badge bg-white text-dark border fw-normal p-2 shadow-sm" onClick={() => fillCredentials('guest', 'password')}>guest</button>
                        <button type="button" className="btn badge bg-white text-dark border fw-normal p-2 shadow-sm" onClick={() => fillCredentials('manager', 'password')}>manager</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
