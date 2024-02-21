import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map');
  };

  const goToAdd = () => {
    navigate('/admin/location/add');
  };

  const handleEdit = (geo_id) => {
    navigate(`/admin/location/edit/${geo_id}`);
  };

  const handleLogout = () => {
    // Clear any stored data related to authentication (like tokens)
    localStorage.removeItem('token');

    // Redirect to login or home page
    navigate('/login');
  };
  const [data, setData] = useState([]);
  // Fetch GeoJSON data from Flask API when the component mounts
  useEffect(() => {
    fetch("/get_geojson")
        .then((response) => response.json())
        .then((fetchedData) => {
            setData(fetchedData);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);
  
    const handleDelete = async (geo_id) => {
      // Confirm with the user
      if (window.confirm("Are you sure you want to delete this location?")) {
        try {
          const response = await fetch(`/deleteLocation/${geo_id}`, {
            method: 'DELETE',
            // Include headers and other API configurations as needed
          });
    
          if (response.ok) {
            // If the item is successfully deleted from the backend, remove it from the state
            setData(data => data.filter(item => item.geo_id !== geo_id));
          } else {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Failed to delete the item:", error);
        }
      }
    };
  
  return (
    <div>
      <header>
        <div className="logo">Hệ thống thông tin địa lý (GIS)</div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
        </div>
      </header>
      {/* Side menu */}
      <div className='container'>
        <nav className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={goToMap}>Map</li>
            <li>Account</li>
            <li>Location</li>
          </ul>
        </nav>
        {/* Rest of the component */}
        <div className="content">
          <div className="crud_container"> 
            <div className="crud_header">
              <h1>Location Management</h1>
            </div>
            <div className="crud_body">
              <div className="crud_body_header">
                <button className="add-button" onClick={goToAdd}>Add location</button>
                <button className="refresh-button" onClick={() => window.location.reload()}>Refresh</button>
                <button onClick={handleLogout} className="logout-button">Log out</button>
              </div>
              <div className="crud_body_content">
                <table>
                  <thead>
                    <tr>
                      <th className="id">ID</th>
                      <th className="title">Title</th>
                      <th className="description">Description</th>
                      <th className="coordinates">Coordinates</th>
                      <th className="image">Image</th>
                      <th className="action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map((item) => {
                    const feature = item.json_data;
                    return (
                      <tr key={item.geo_id}>
                        <td>{item.geo_id}</td> {/* Display Geo ID */}
                        <td>{feature.properties.title}</td>
                        <td>{feature.properties.description}</td>
                        <td>{`${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]}`}</td>
                        <td>
                          <img src={feature.properties.image} alt={feature.properties.title} width="100" />
                        </td>
                        <td>
                          <button className='action-button' onClick={() => handleEdit(item.geo_id)}>Edit</button>
                          <button className='action-button button-danger' onClick={() => handleDelete(item.geo_id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
