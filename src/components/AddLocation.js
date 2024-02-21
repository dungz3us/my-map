import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AddLocation.css";

function AddLocation() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [submitStatus, setSubmitStatus] = useState(null);

  const navigate = useNavigate();
  const goToAdmin = () => {
    navigate('/admin/location');
  };

  const handleSubmit = async (e) => { // Declare the function as async
    e.preventDefault();
    
    // Convert longitude and latitude from string to number
    const coordsArray = [Number(longitude), Number(latitude)];
  
    const geojson = { // Changed variable name from formData to geojson
      "type": "Feature",
      "properties": {
        "title": title,
        "description": description,
        "image": imageUrl,
      },
      "geometry": {
        "type": "Point",
        "coordinates": coordsArray,
      }
    };

    try {
      const response = await fetch('/addLocation', { // Replace with your actual endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geojson), // Use geojson here
      });
  
      if (response.ok) {
        setSubmitStatus('success');
        // Thêm logic xử lý khi thành công (ví dụ: clear form)
        if (submitStatus === 'success') {
          setTitle('');
          setDescription('');
          setLongitude('');
          setLatitude('');
          setImageUrl('');
        }
          
      } else {
        setSubmitStatus('fail');
      }
      const result = await response.json();
      console.log('Success:', result);
      // Handle success (e.g., showing a success message or redirecting the user)
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here (e.g., showing an error message to the user)
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="add-location-form">
      <div className="form-header">
        <h1>Add Location</h1>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="text"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        placeholder="Longitude"
        required
      />
      <input
        type="text"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        placeholder="Latitude"
        required
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        required
      />
      <button type="submit" className="form-button submit-button">Submit</button>
      <button type="button" onClick={goToAdmin} className="form-button cancel-button">Back</button>
      {submitStatus === 'success' && <div className="success-icon">✅ Thêm thành công</div>}
      {submitStatus === 'fail' && <div className="fail-icon">❌ Thêm thất bại</div>}
    </form>
  );
}

export default AddLocation;