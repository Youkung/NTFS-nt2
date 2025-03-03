import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../Logo/Fulllogo.png";
import "./side.css";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const UserManagement = () => {
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    roleId: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchCategory, setSearchCategory] = useState('all');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    console.log("Adding user:", newUser);
    setErrorMessage("");

    try {
      if (editingUserId) {
        const response = await fetch(
          `http://localhost:8080/api/user/${editingUserId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
          throw new Error("Failed to update user");
        }

        const updatedData = await response.json();
        setUsers(users.map(user =>
          user.User_ID === editingUserId ? updatedData.user : user
        ));
      } else {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          if (response.status === 400) {
            setErrorMessage("Username already exists. Please choose a different username.");
          } else {
            setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
          }
          throw new Error("Failed to add user");
        }

        const result = await response.json();
        // Add the new user to the users array
        setUsers(prevUsers => [...prevUsers, result.user]);
        setFilteredUsers(prevFiltered => [...prevFiltered, result.user]);
      }

      setShowUserPopup(false);
      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phone: "",
        email: "",
        roleId: "",
      });
      setEditingUserId(null);
    } catch (error) {
      console.error("Error handling user:", error);
      alert("Error processing user. Please try again.");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/roles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const result = await response.json();
      setRoles(result.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/user/${userId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter((user) => user.User_ID !== userId));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again.");
      }
    }
  };

  // In the handleEditUser function, modify it to include the role selection:
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.User_ID === userId);
    console.log("Editing User:", userToEdit); // ตรวจสอบค่าก่อนเซ็ต

    const [firstName, lastName] = userToEdit.Name.split(" ");
    setNewUser({
      firstName,
      lastName,
      username: userToEdit.Username,
      password: "",
      phone: userToEdit.phone,
      email: userToEdit.Email,
      roleId: userToEdit.Role_ID // Use the Role_ID directly from the user object
    });

    setEditingUserId(userId);
    setShowUserPopup(true);
  };

  const handleCancelEdit = () => {
    setNewUser({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      phone: "",
      email: "",
      roleId: "",
    });
    setEditingUserId(null);
    setShowUserPopup(false);
    setErrorMessage("");
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(`${user.Name}`);
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");
        const result = await response.json();
        console.log("Fetched Users:", result.data); // ตรวจสอบข้อมูล
        setUsers(result.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
    fetchRoles(); // เรียก fetchRoles() ครั้งเดียว
  }, []);

  useEffect(() => {
    if (editingUserId) {
      const userToEdit = users.find((user) => user.User_ID === editingUserId);
      if (userToEdit) {
        const [firstName, lastName] = userToEdit.Name.split(" ");
        setNewUser({
          firstName,
          lastName,
          username: userToEdit.Username,
          password: "",
          phone: userToEdit.phone,
          email: userToEdit.Email,
          roleId: userToEdit.Role_ID ? userToEdit.Role_ID.toString() : "", // ตรวจสอบค่า roleId
        });
      }
    }
  }, [editingUserId, users]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (!searchValue) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => {
      switch (searchCategory) {
        case 'name':
          return user.Name?.toLowerCase().includes(searchValue);
        case 'username':
          return user.Username?.toLowerCase().includes(searchValue);
        case 'email':
          return user.Email?.toLowerCase().includes(searchValue);
        default: // 'all'
          return (
            user.Name?.toLowerCase().includes(searchValue) ||
            user.Username?.toLowerCase().includes(searchValue) ||
            user.Email?.toLowerCase().includes(searchValue)
          );
      }
    });

    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <div
        className="d-flex align-items-center px-4 py-2 bg-light border-bottom"
        style={{ height: "80px" }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ height: "50px", width: "auto" }}
          className="ms-5 me-2"
        />
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3">{userName || "Loading..."}</span>
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/749/751/non_2x/avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg"
            alt="Profile"
            className="rounded-circle"
            style={{ height: "40px", width: "40px" }}
          />
        </div>
      </div>

      {/* Main Area */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div
          className="border-end d-flex flex-column align-items-center bg-secondary-subtle"
          style={{
            width: "200px",
          }}
        >
          <ul className="nav flex-column w-100 text-center">
            <Link
              to="/admin/dashboard"
              className="nav-link text-dark py-3 sidebar-link font-cute"
            >
              <i className="bi bi-tools me-2"></i>รายงาน
            </Link>
            <li className="nav-item">
              <Link
                to="/admin/Equipment"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>อุปกรณ์
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/Note"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>บันทึก
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/Room"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>สถานที่
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/accounts"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>บัญชีผู้ใช้
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/UserManagement"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>การจัดการผู้ใช้
              </Link>
            </li>
            <li className="nav-item">
              <a
                href="#"
                onClick={handleLogout}
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>ออกจากระบบ
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1 d-flex flex-column"
          style={{ background: "linear-gradient(to bottom, #ffcc00, #EEE891)" }}
        >
          <div className="min-vh-100 d-flex py-4">
            <div className="container mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-center mb-4">การจัดการผู้ใช้</h1>
                <div className="d-flex gap-2 align-items-center">
                  <select
                    className="form-select"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    style={{ width: '150px' }}
                  >
                    <option value="all">ค้นหาทั้งหมด</option>
                    <option value="name">ชื่อ</option>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`ค้นหา${searchCategory === 'all' ? 'ทั้งหมด' :
                      searchCategory === 'name' ? 'ตามชื่อ' :
                        searchCategory === 'username' ? 'ตาม Username' :
                          'ตาม Email'}...`}
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '300px' }}
                  />
                  <Button
                    className="m-0"
                    variant="primary"
                  >
                    ค้นหา
                  </Button>
                  <Button
                    className="m-0"
                    variant="success"
                    onClick={() => setShowUserPopup(true)}
                  >
                    เพิ่มผู้ใช้
                  </Button>
                </div>
              </div>
              <div className="card p-4 mb-4">
                <h2>รายชื่อ</h2>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ชื่อ</th>
                      <th>ชื่อผู้ใช้</th>
                      <th>หมายเลขโทรศัพท์</th>
                      <th>อีเมล</th>
                      <th>บทบาท</th>
                      <th>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.User_ID}>
                        <td>{user.Name}</td>
                        <td>{user.Username}</td>
                        <td>{user.phone}</td>
                        <td>{user.Email}</td>
                        <td>{user.RoleName}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-md m-0 me-2"
                            onClick={() => handleEditUser(user.User_ID)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="btn btn-danger btn-md m-0"
                            onClick={() => handleDeleteUser(user.User_ID)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ป๊อปอัพเพิ่ม/แก้ไขผู้ใช้ */}
      <Modal show={showUserPopup} onHide={handleCancelEdit} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="text-primary fw-bold">
            {editingUserId ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <Alert variant="danger" className="text-center">
              {errorMessage}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label className="fw-semibold">ชื่อ</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="กรอกชื่อ"
                value={newUser.firstName}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="fw-semibold">นามสกุล</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="กรอกนามสกุล"
                value={newUser.lastName}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="fw-semibold">ชื่อผู้ใช้</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="กรอกชื่อผู้ใช้"
                value={newUser.username}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="fw-semibold">รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="กรอกรหัสผ่าน"
                value={newUser.password}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label className="fw-semibold">เบอร์โทรศัพท์</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="กรอกเบอร์โทรศัพท์"
                value={newUser.phone}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="fw-semibold">อีเมล</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="กรอกอีเมล"
                value={newUser.email}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="roleId">
              <Form.Label className="fw-semibold">บทบาท</Form.Label>
              <Form.Select
                name="roleId"
                value={newUser.roleId || ''}
                onChange={handleInputChange}
                className="border-primary shadow-sm w-100"
              >
                <option value="" disabled>เลือกบทบาท</option>
                {roles.map((role) => (
                  <option key={role.Role_ID} value={role.Role_ID}>
                    {role.Rolename}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit} className="btn-cancel">
            ปิด
          </Button>
          <Button variant="primary" onClick={handleAddUser} className="btn-submit">
            {editingUserId ? "อัปเดตผู้ใช้" : "เพิ่มผู้ใช้"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default UserManagement;
