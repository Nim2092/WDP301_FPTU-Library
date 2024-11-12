import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // import toastify CSS

const CreateAccount = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState(""); // Initially empty, will set to librarian role after fetching
  const [roles, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // Fetch roles from the backend
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:9999/api/user/all-role");
        const rolesData = response.data.data;

        // Set the default role to librarian if found
        const librarianRole = rolesData.find((r) => r.name === "librarian");
        if (librarianRole) {
          setRole(librarianRole._id);
        }

        // Filter out borrower role and set roles
        const filteredRoles = rolesData.filter((r) => r.name !== "borrower");
        setRoles(filteredRoles);
      } catch (error) {
        toast.error("Error fetching roles. Please try again later.");
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append("image", image);
    formData.append("fullName", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("role_id", role);
    formData.append("email", email);
    formData.append("code", code);
    formData.append("password", password);

    try {
      await axios.post("http://localhost:9999/api/user/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Account created successfully");
      setTimeout(() => {
        navigate("/account-list");
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while creating the account.";
      toast.error(errorMessage);
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="create-account-container mt-4" style={{ margin: "100px 100px" }}>
      <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Image Upload Section */}
          <div className="col-md-3">
            <div className="create-account-image-upload form-group">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Selected" className="img-thumbnail" />
              ) : (
                <div
                  className="img-thumbnail d-flex justify-content-center align-items-center"
                  style={{
                    height: "200px",
                    width: "100%",
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  Thêm Ảnh
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="col-md-9">
            <div className="create-account-form-group form-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="code">Mã người dùng</label>
              <input
                required
                type="text"
                className="form-control"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã người dùng"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                required
                type="text"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="role">Vai trò</label>
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Chọn vai trò</option>
                {roles.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name === "librarian" ? "Thủ thư" : r.name === "admin" ? "Quản trị viên" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                required
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            <div className="create-account-form-group form-group mt-3">
              <label htmlFor="password">Mật khẩu</label>
              <input
                required
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
