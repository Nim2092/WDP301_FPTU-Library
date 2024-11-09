import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const UpdateAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role_id: "",
    image: "",
    code: "",
    password: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesResponse = await axios.get("https://fptu-library.xyz/api/user/all-role");
        setRoles(rolesResponse.data.data);

        // Fetch user data
        const userResponse = await axios.get(`https://fptu-library.xyz/api/user/get/${id}`);
        const { fullName, email, phoneNumber, role_id, image, code } = userResponse.data.data;

        setFormData({
          fullName: fullName || "",
          email: email || "",
          phoneNumber: phoneNumber || "",
          role_id: role_id?._id || "",
          code: code || "",
          password: "",
          image: image || "",
        });

        if (image) {
          setImagePreview(`https://fptu-library.xyz/api/user/image/${image.split("/").pop()}`);
        }
      } catch (error) {
        toast.error("Failed to load data.");
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await axios.put(`https://fptu-library.xyz/api/user/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Account updated successfully");
      setTimeout(() => navigate("/account-list"), 1000);
    } catch (error) {
      toast.error("Error updating account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-account-container mt-4" style={{ margin: "100px 100px" }}>
       <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3">
            <div className="update-account-image-upload form-group">
              {imagePreview ? (
                <img src={imagePreview} alt="Selected" className="img-thumbnail" />
              ) : (
                <div className="img-thumbnail d-flex justify-content-center align-items-center" style={{ height: "200px", width: "100%", backgroundColor: "#f0f0f0" }}>
                 Chọn Ảnh
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="col-md-9">
            {["Họ vầ tên", "email", "Số điện thoại", "Mã người dùng"].map((field) => (
              <div className="form-group mt-3" key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  className="form-control"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  placeholder={`Nhập ${field}`}
                />
              </div>
            ))}

            {/* Role Selection - Only Rendered Once */}
            <div className="form-group mt-3">
              <label htmlFor="role_id">Vai trò</label>
              <select
                className="form-control"
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
              >
                <option value="">Chọn vai trò</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.name === "librarian" ? "Thủ thư" : role.name === "admin" ? "Quản trị viên" : role.name === "borrower" ? "Người mượn" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu mới (Để trống nếu giữ nguyên)"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAccount;
