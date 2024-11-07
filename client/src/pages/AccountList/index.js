import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'font-awesome/css/font-awesome.min.css';
import ReactPaginate from 'react-paginate';

const AccountList = () => {
  const [accountData, setAccountData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;
  const navigate = useNavigate();

  // Add new state for search, role, and status filters
  const [searchKey, setSearchKey] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Calculate the indices for slicing the account data
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accountData.slice(indexOfFirstAccount, indexOfLastAccount);

  const handleEdit = (id) => {
    navigate(`/update-account/${id}`);
    console.log(`Edit account with ID: ${id}`);
  };

  const handleAccountStatusChange = (id, isActive) => {
    const account = accountData.find(account => account._id === id);
    if (account.role_id.name === "admin" && !isActive) {
      toast.error("Admin accounts cannot be deactivated");
      return;
    }
    axios
      .put(`https://fptu-library.xyz/api/user/status/${id}`, { isActive })
      .then(() => {
        toast.success("Account status changed successfully");

        // Update state directly without reloading the page
        setAccountData((prevData) =>
          prevData.map((account) =>
            account._id === id ? { ...account, isActive } : account
          )
        );
      })
      .catch((error) => {
        console.error("Error updating account status:", error);
        toast.error("Failed to update account status");
      });
  };

  const handleCreateNewAccount = () => {
    navigate("/create-account");
  };

  useEffect(() => {
    Axios.get("https://fptu-library.xyz/api/user/getAll")
      .then((response) => {
        const sortedData = response.data.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAccountData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching account list:", error);
      });
  }, []);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios.get(`https://fptu-library.xyz/api/user/search?searchKey=${searchKey}`)
      .then((response) => {
        setAccountData(response.data.data);
      })
      .catch((error) => {
        console.error("Error searching accounts:", error);
        toast.error("Failed to search accounts");
      });
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    if (role) {
      axios.get(`https://fptu-library.xyz/api/user/role/${role}`)
        .then((response) => {
          const sortedData = response.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setAccountData(sortedData);
        })
        .catch((error) => {
          console.error("Error filtering by role:", error);
          toast.error("Failed to filter by role");
        });
    } else {
      Axios.get("https://fptu-library.xyz/api/user/getAll")
        .then((response) => {
          const sortedData = response.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setAccountData(sortedData);
        });
    }
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    if (status) {
      axios.get(`https://fptu-library.xyz/api/user/active/${status}`)
        .then((response) => {
          const sortedData = response.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setAccountData(sortedData);
        })
        .catch((error) => {
          console.error("Error filtering by status:", error);
          toast.error("Failed to filter by status");
        });
    } else {
      Axios.get("https://fptu-library.xyz/api/user/getAll")
        .then((response) => {
          const sortedData = response.data.data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setAccountData(sortedData);
        });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchKey(e.target.value);
  };

  return (
    <div className="container mt-4 mb-4">
       
      <div className="row mt-4">
        <div className="col-md-4">
          <form className="d-flex" onSubmit={handleSearch}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm kiếm theo tên, email, hoặc code"
              value={searchKey}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className="btn btn-outline-primary"><i className="fa fa-search" aria-hidden="true"></i></button>
          </form>
        </div>
        <div className="d-flex gap-2 col-md-8 justify-content-end">
          {/* Role Filter */}
          <select className="form-select" style={{ width: "auto" }} value={selectedRole} onChange={handleRoleChange}>
            <option value="">Lọc theo vai trò</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="borrower">Borrower</option>
          </select>

          {/* Status Filter */}
          <select className="form-select" style={{ width: "auto" }} value={selectedStatus} onChange={handleStatusChange}>
            <option value="">Lọc theo trạng thái</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button className="btn btn-primary" title="Tạo mới" onClick={handleCreateNewAccount}>
            <i className="fa fa-plus" aria-hidden="true"></i>
            <span className="tooltip-text"> Tạo mới</span>
          </button>
        </div>
      </div>
      <table className="table table-bordered mt-4 shadow-sm rounded">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Code</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account, index) => (
            <tr key={account._id}>
              <td>{indexOfFirstAccount + index + 1}</td>
              <td>{account.fullName}</td>
              <td>{account.code}</td>
              <td>{account.email}</td>
              <td>+84{account.phoneNumber}</td>
              <td>{account.role_id.name}</td>
              <td className="d-flex justify-content-between">
                <button className="btn btn-warning" title="Sửa" onClick={() => handleEdit(account._id)}>
                  <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>

                {account.role_id.name !== "admin" && (
                  account.isActive ? (
                    <button
                      className="btn btn-danger"
                      title="Khóa"
                      onClick={() => handleAccountStatusChange(account._id, false)}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      title="Mở khóa"
                      onClick={() => handleAccountStatusChange(account._id, true)}
                    >
                      <i className="fa fa-check" aria-hidden="true"></i>
                    </button>
                  )
                )}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination float-end mb-4">
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(accountData.length / accountsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakLinkClassName={'page-link'}
        />
      </div>
    </div>
  );
};

export default AccountList;
