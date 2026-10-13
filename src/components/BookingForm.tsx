import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

interface Booking {
  _id: string;
  roomId: number | string;
  userEmail: string;
  startTime: string;
  endTime: string;
  roomType: string;
}

export default function BookingForm() {
  const [statusMessage, setStatusMessage] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]); 

  // Fetch all Rooms
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/displayRoom');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Validation Schema
  const validationSchema = Yup.object({
    roomId: Yup.string().required('Room ID is required'),
    userEmail: Yup.string().email('Invalid email address').required('Email is required'),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
    roomType: Yup.string().required('Room type is required'),
  });

  // Formik Initialization
  const formik = useFormik({
    initialValues: {
      roomId: '',
      userEmail: '',
      startTime: '',
      endTime: '',
      roomType: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post('http://localhost:5000/bookRoom', values);

        if (response.status === 201) {
          setStatusMessage(`${response.data.message || 'Room booked successfully!'}`);
          resetForm();
          fetchBookings();
        }
      } catch (error) {
        console.error('Submission error:', error);
        setStatusMessage('Something went wrong with the submission.');
      }
    },
  });

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Room Booking</h2>
        
        <form onSubmit={formik.handleSubmit}>
          {/* Room ID */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="roomId" style={{ display: 'block', fontWeight: 'bold' }}>Room ID:</label>
            <input
              id="roomId"
              name="roomId"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.roomId}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
            {formik.touched.roomId && formik.errors.roomId ? (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{formik.errors.roomId}</div>
            ) : null}
          </div>

          {/* User Email */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="userEmail" style={{ display: 'block', fontWeight: 'bold' }}>Your Email:</label>
            <input
              id="userEmail"
              name="userEmail"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userEmail}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
            {formik.touched.userEmail && formik.errors.userEmail ? (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{formik.errors.userEmail}</div>
            ) : null}
          </div>

          {/* Start Time */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="startTime" style={{ display: 'block', fontWeight: 'bold' }}>Start Time:</label>
            <input
              id="startTime"
              name="startTime"
              type="datetime-local"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startTime}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
            {formik.touched.startTime && formik.errors.startTime ? (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{formik.errors.startTime}</div>
            ) : null}
          </div>

          {/* End Time */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="endTime" style={{ display: 'block', fontWeight: 'bold' }}>End Time:</label>
            <input
              id="endTime"
              name="endTime"
              type="datetime-local"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endTime}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
            {formik.touched.endTime && formik.errors.endTime ? (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{formik.errors.endTime}</div>
            ) : null}
          </div>

          {/* Room Type */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="roomType" style={{ display: 'block', fontWeight: 'bold' }}>Room Type:</label>
            <input
              id="roomType"
              name="roomType"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.roomType}
              style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
            />
            {formik.touched.roomType && formik.errors.roomType ? (
              <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{formik.errors.roomType}</div>
            ) : null}
          </div>

          <button 
            type="submit" 
            disabled={formik.isSubmitting}
            style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', width: '100%' }}
          >
            {formik.isSubmitting ? 'Processing...' : 'Submit Booking'}
          </button>
        </form>

        {statusMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>{statusMessage}</p>}
      </div>

      <hr style={{ margin: '40px 0', border: '0', borderTop: '2px solid #ccc' }} />

      <h3>All Room Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>Room ID</th>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>Room Type</th>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>User Email</th>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>Start Time</th>
                <th style={{ padding: '12px', fontWeight: 'bold' }}>End Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr 
                  key={booking._id} 
                  style={{ 
                    borderBottom: '1px solid #ddd', 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' 
                  }}
                >
                  <td style={{ padding: '12px' }}>{booking.roomId}</td>
                  <td style={{ padding: '12px' }}>{booking.roomType}</td>
                  <td style={{ padding: '12px' }}>{booking.userEmail}</td>
                  <td style={{ padding: '12px' }}>{new Date(booking.startTime).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>{new Date(booking.endTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
