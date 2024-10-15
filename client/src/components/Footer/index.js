import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./Footer.scss"; // Custom CSS (if needed)

function Footer() {
  return (
    <footer className="footer text-white py-4">
      <div className="container text-start">
        <h5>FPT UNIVERSITY LIBRARY</h5>
        <p>
          Phòng 107 tòa nhà Delta, Trường Đại học FPT,
          <br />
          Khu CNC Hòa Lạc, Km29 Đại Lộ Thăng Long, Thạch Thất, Hà Nội
        </p>
        <p>
          Email:{" "}
          <a href="mailto:thuvien_fu_hoalac@fpt.edu.vn" className="text-white">
            thuvien_fu_hoalac@fpt.edu.vn
          </a>
          <br />
          Hotline: 02466 805 912
        </p>
      </div>
    </footer>
  );
}

export default Footer;
