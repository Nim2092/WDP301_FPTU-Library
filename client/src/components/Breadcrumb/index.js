import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Function to format path names (e.g., "title-of-the-article" => "Title Of The Article")
  const formatPathname = (name) => {
    return name
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Trang chủ</Link>
        </li>
        {pathnames.map((value, index) => {
          // Construct the link URL dynamically
          const to = `/${pathnames.slice(0, index + 1)}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li key={to} className="breadcrumb-item active" aria-current="page">
              {formatPathname(value)}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item">
              <Link to={to}>{formatPathname(value)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
