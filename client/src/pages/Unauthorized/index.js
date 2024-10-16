import React from 'react';
import './Unauthorized.scss';

function Unauthorized() {
  return (
    <div className="unauthorized-container">
      <img
        src="https://bkhost.vn/wp-content/uploads/2022/06/loi-401-1.jpg"
        alt="Unauthorized Access"
        className="unauthorized-image"
      />
      <h1>Unauthorized Access - Error 401</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

export default Unauthorized;
