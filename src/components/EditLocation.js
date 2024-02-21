import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./EditLocation.css";

function EditLocation() {
  const { geoId } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetch(`/getLocation/${geoId}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        setLocationData(fetchedData);
        // Reset title, description, etc. based on fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError("An error occurred while fetching data.");
      });
  }, [geoId]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (locationData) {
      setTitle(locationData.json_data.properties.title);
      setDescription(locationData.json_data.properties.description);
      setImage(locationData.json_data.properties.image);
      setLongitude(locationData.json_data.geometry.coordinates[0]);
      setLatitude(locationData.json_data.geometry.coordinates[1]);
    }
  }, [locationData]);


  // Inside your component
  const navigate = useNavigate();

  const goToAdmin = () => {
    navigate('/admin/location');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedLocation = {
      properties: {
        title,
        description,
        image,
      },
      geometry: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        type: "Point",
      },
      type: "Feature",
    };
  
    try {
      const response = await fetch(`/updateLocation/${geoId}`, {
        method: 'PUT', // or 'PATCH'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLocation),
      });
  
      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('fail');
      }
    } catch (error) {
      console.error("Error updating location:", error);
      // Handle client-side errors
    }
  };

  return (
    <div className="EditLocation">
      <h1>Edit Location</h1>
      <form onSubmit={handleSubmit} >
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button type="submit" className="form-button submit-button">Save</button>
        <button type="button" className="form-button cancel-button" onClick={goToAdmin}>Cancel</button>
        {submitStatus === 'success' && <div className="success-icon">✅ Chỉnh sửa thành công</div>}
        {submitStatus === 'fail' && <div className="fail-icon">❌ Chỉnh sửa thất bại</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  )
}
export default EditLocation;
