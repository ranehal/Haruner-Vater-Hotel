import { useState } from 'react';

const ServiceOrder = () => {
    const [type, setType] = useState('FOOD');
    const [desc, setDesc] = useState('');
    const [roomNumber, setRoomNumber] = useState('');

    const order = () => {
        if (!roomNumber) {
            alert("Please enter a room number.");
            return;
        }

        const request = {
            type: type,
            description: desc,
            cost: 20.00, // Flat rate for demo
            roomNumber: roomNumber
        };

        fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        })
        .then(res => res.json())
        .then(() => {
            alert("Service Ordered!");
            setDesc('');
            setRoomNumber('');
        });
    };

    return (
        <div className="h-100">
            <h4 className="text-navy mb-4 font-heading"><i className="bi bi-bell me-2"></i>Order Room Service</h4>
            <div className="mb-3">
                <label className="form-label small fw-bold">Room Number</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 101" 
                    value={roomNumber} 
                    onChange={e => setRoomNumber(e.target.value)} 
                />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Service Type</label>
                <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                    <option value="FOOD">Food & Dining</option>
                    <option value="TRANSPORT">Airport Transport</option>
                    <option value="TRIP">Trip Planning</option>
                    <option value="CLEANING">Housekeeping</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="form-label small fw-bold">Details</label>
                <textarea 
                    className="form-control" 
                    rows="4"
                    placeholder="Describe your request (e.g., 'Club Sandwich to Room 101')" 
                    value={desc} 
                    onChange={e => setDesc(e.target.value)} 
                />
            </div>
            <button className="btn btn-navy w-100 rounded-pill" onClick={order}>
                Submit Order <span className="opacity-75 ms-1">($20.00)</span>
            </button>
        </div>
    );
};

export default ServiceOrder;
