import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Hàm để cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Theo dõi vị trí cuộn của trang
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) { // Ẩn hiện khi cuộn qua 100px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          variant="primary"
          className="position-fixed"
          style={{ bottom: "20px", right: "20px", zIndex: "1000", opacity: "0.5" }}
        >
          <i className="fa fa-arrow-up"></i> 
        </Button>
      )}
    </div>
  );
}

export default ScrollTop;
