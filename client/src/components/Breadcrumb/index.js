import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Breadcrumb.scss';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapping path names from English to Vietnamese
  const pathNameMap = {
    "advanced-search": "Tìm Kiếm Nâng Cao",
    "news": "Tin Tức",
    "rule-detail": "Chi Tiết Quy Định",
    "news-detail": "Chi Tiết Tin Tức",
    "book-detail": "Chi Tiết Sách",
    "profile": "Hồ Sơ",
    "list-book-borrowed": "Danh Sách Đã Mượn",
    "order-book-detail": "Chi Tiết Đơn Mượn Sách",
    "fines": "Tiền Phạt",
    "list-rule-user": "Quy Định",
    "search-results": "Kết Quả Tìm Kiếm",
    "chart": "Thống Kê",
    "notification": "Thông Báo",
    "manage-order": "Quản Lý Mượn Sách",
    "create-news": "Tạo Tin Tức",
    "list-news-admin": "Quản Lý Tin Tức",
    "update-news": "Cập Nhật Tin Tức",
    "return-book": "Quản Lý Trả Sách",
    "list-fines": "Danh Sách Tiền Phạt",
    "create-account": "Tạo Tài Khoản",
    "list-catalog": "Quản Lý Danh Mục",
    "account-list": "Danh Sách Tài Khoản",
    "update-account": "Cập Nhật Tài Khoản",
    "create-book": "Tạo Lô Sách Mới",
    "list-book-set": "Quản Lý Lô Sách",
    "update-bookset": "Cập Nhật Lô Sách",
    "list-rule": "Quản Lý Quy Định",
    "create-new-rule": "Tạo Quy Định Mới",
    "update-rule": "Cập Nhật Quy Định",
    "list-penalty-reasons": "Quản Lý Mức Phạt",
    "update-penalty-reason": "Cập Nhật Mức Phạt",
    "create-penalty-reason": "Tạo Mức Phạt",
    "unauthorized": "Không Có Quyền Truy Cập",
    // Thêm các mapping khác nếu cần
  };

  // Function to format path names
  const formatPathname = (name) => {
    return pathNameMap[name] || name
      .replace(/-/g, ' ') // Thay dấu gạch ngang thành khoảng trắng
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Viết hoa chữ cái đầu mỗi từ
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb custom-breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">Home</Link>
        </li>
        {pathnames
          .filter((value) => !/^[a-fA-F0-9]{24}$/.test(value))
          .map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).filter((x) => !/^[a-fA-F0-9]{24}$/.test(x)).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return isLast ? (
              <li key={to} className="breadcrumb-item active breadcrumb-active" aria-current="page">
                {formatPathname(value)}
              </li>
            ) : (
              <li key={to} className="breadcrumb-item">
                <Link to={to} className="breadcrumb-link">{formatPathname(value)}</Link>
              </li>
            );
          })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
