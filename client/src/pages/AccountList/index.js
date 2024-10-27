import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountList = () => {
  const [accountData, setAccountData] = useState([]);

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/update-account/${id}`);
    console.log(`Edit account with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      Axios.delete(`http://localhost:9999/api/user/delete/${id}`)
        .then(() => {
          console.log(`Account with ID: ${id} deleted successfully`);
          setAccountData(accountData.filter((account) => account._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }
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

  return (
    <div className="container mt-4">
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
          {accountData.map((account, index) => (
            <tr key={account._id}>
              <td>{index + 1}</td>
              <td>{account.fullName}</td>
              <td>{account.email}</td>
              <td>{account.phoneNumber}</td>
              <td>{account.role_id.name}</td>
              <td className="d-flex justify-content-between">
                <button className="btn btn-warning" onClick={() => handleEdit(account._id)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(account._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountList;
