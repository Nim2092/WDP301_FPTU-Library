import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AccountList = () => {
  const [accountData, setAccountData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 20;
  const navigate = useNavigate();

  // Calculate the indices for slicing the account data
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accountData.slice(indexOfFirstAccount, indexOfLastAccount);

  const handleEdit = (id) => {
    navigate(`/update-account/${id}`);
    console.log(`Edit account with ID: ${id}`);
  };

  const handleAccountStatusChange = (id, isActive) => {
    axios
      .put(`http://localhost:9999/api/user/update/${id}`, { isActive })
      .then(() => {
        // Thông báo thành công
        toast.success("Account status changed successfully");
        
        // Cập nhật state trực tiếp mà không reload trang
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
    console.log("Create new account");
    navigate("/create-account");
  };

  useEffect(() => {
    Axios.get("http://localhost:9999/api/user/getAll")
      .then((response) => {
        setAccountData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching account list:", error);
      });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-4 mb-4">
      <ToastContainer />
      <div className="d-flex justify-content-between">
        <h2>Account List</h2>
        <button className="btn btn-primary" onClick={handleCreateNewAccount}>
          Create new account
        </button>
      </div>
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account, index) => (
            <tr key={account._id}>
              <td>{indexOfFirstAccount + index + 1}</td>
              <td>{account.fullName}</td>
              <td>{account.email}</td>
              <td>{account.phoneNumber}</td>
              <td>{account.role_id.name}</td>
              <td className="d-flex justify-content-between">
                <button className="btn btn-warning" onClick={() => handleEdit(account._id)}>
                  Update
                </button>
             
                {account.isActive ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleAccountStatusChange(account._id, false)}
                  >
                    Inactive
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccountStatusChange(account._id, true)}
                  >
                    Active
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination float-end mb-4">
        {Array.from({ length: Math.ceil(accountData.length / accountsPerPage) }, (_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
