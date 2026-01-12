import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast show align-items-center text-white bg-${toast.type === 'error' ? 'danger' : toast.type === 'success' ? 'success' : 'primary'} border-0 mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                {toast.message}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => removeToast(toast.id)} aria-label="Close"></button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
