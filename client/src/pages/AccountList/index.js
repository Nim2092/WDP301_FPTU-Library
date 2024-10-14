import React from "react";

const AccountList = () => {
  const accountData = [
    { id: 1, fullName: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Admin" },
    { id: 2, fullName: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", role: "Librarian" },
    { id: 3, fullName: "Mike Johnson", email: "mike@example.com", phone: "555-666-7777", role: "Admin" }
  ];

  const handleEdit = (id) => {
    console.log(`Edit account with ID: ${id}`);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      console.log(`Delete account with ID: ${id}`);
    }
  };

  const handleCreateNewAccount = () => {
    console.log("Create new account");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>Account List</h2>
        <button
          className="btn btn-primary"
          onClick={handleCreateNewAccount}
        >
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {accountData.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.fullName}</td>
              <td>{account.email}</td>
              <td>{account.phone}</td>
              <td>{account.role}</td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(account.id)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(account.id)}
                >
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
