import React, { useEffect, useState } from "react";
import logo from "../Logo/Fulllogo.png";
import "./side.css";
import { Link } from "react-router-dom";
import "./room.css"
import Admin_AddRoomModal from "./User_newroom";

function Admin_Room() {
  const [userName, setUserName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  // Add these states at the top of your component
  const [searchBranchNumber, setSearchBranchNumber] = useState("");
  const [searchBranchName, setSearchBranchName] = useState("");
  const [searchBuilding, setSearchBuilding] = useState("");
  const [searchFloor, setSearchFloor] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [branchNumberSuggestions, setBranchNumberSuggestions] = useState([]);
  const [branchNameSuggestions, setBranchNameSuggestions] = useState([]);
  const [floorSuggestions, setFloorSuggestions] = useState([]);
  const [roomSuggestions, setRoomSuggestions] = useState([]);
  const [buildingSuggestions, setBuildingSuggestions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editData, setEditData] = useState({
    nodeName: "",
    nodeLocation: "",
    roomFloor: "",
    roomName: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (room) => {
    setEditData({
      nodeName: room.branch_name,
      nodeLocation: room.branch_number,
      roomFloor: room.floor,
      roomName: room.room_name,
      nodeId: room.node_id,
      roomId: room.room_id,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (type) => {
    if (window.confirm(`ยืนยันการแก้ไขข้อมูล${type === 'node' ? 'สาขา' : 'ห้อง'}?`)) {
      const endpoint = type === 'node' ?
        `http://localhost:8080/api/rooms/node/${editData.nodeId}` :
        `http://localhost:8080/api/rooms/room/${editData.roomId}`;

      const data = type === 'node' ?
        {
          Node_Name: editData.nodeName,
          Node_Location: editData.nodeLocation
        } :
        {
          Room_Floor: editData.roomFloor,
          Room_Name: editData.roomName
        };

      try {
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
          fetch("http://localhost:8080/api/rooms")
            .then(res => res.json())
            .then(data => setRooms(data.data));
          setShowEditModal(false);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการแก้ไขข้อมูล');
      }
    }
  };

  // Add delete handler
  const handleDelete = (nodeId, roomId) => {
    setSelectedItem({ nodeId, roomId });
    setShowDeleteModal(true);
  };

  // Add confirm delete handler
  const handleConfirmDelete = async (type) => {
    if (window.confirm(`ยืนยันการลบ${type === 'node' ? 'สาขา' : 'ห้อง'}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/rooms/${type}/${type === 'node' ? selectedItem.nodeId : selectedItem.roomId}`, {
          method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          fetch("http://localhost:8080/api/rooms")
            .then(res => res.json())
            .then(data => setRooms(data.data));
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลจาก localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData); // แปลงข้อมูลจาก JSON เป็นออบเจ็กต์
      setUserName(`${user.Name}`); // กำหนดชื่อผู้ใช้
    }
  }, []);

  // ฟังก์ชัน logout
  const handleLogout = () => {
    // ลบข้อมูลจาก localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // เปลี่ยนหน้าไปยังหน้าล็อกอิน
    window.location.href = "/"; // เปลี่ยนหน้าโดยตรง
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Add this function to handle search
  const handleSearch = () => {
    const searchParams = new URLSearchParams({
      branch_number: searchBranchNumber,
      branch_name: searchBranchName,
      building: searchBuilding,
      floor: searchFloor,
      room: searchRoom,
    }).toString();

    fetch(`http://localhost:8080/api/rooms/search?${searchParams}`)
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.data);
      })
      .catch((err) => console.error(err));
  };

  const handleBranchNumberSearch = (value) => {
    setSearchBranchNumber(value);
    if (value.length > 0) {
      fetch(
        `http://localhost:8080/api/rooms/suggestions?type=branch_number&search=${value}`
      )
        .then((res) => res.json())
        .then((data) => setBranchNumberSuggestions(data.suggestions));
    } else {
      setBranchNumberSuggestions([]);
    }
  };

  const handleBranchNameSearch = (value) => {
    setSearchBranchName(value);
    if (value.length > 0) {
      fetch(
        `http://localhost:8080/api/rooms/suggestions?type=branch_name&search=${value}`
      )
        .then((res) => res.json())
        .then((data) => setBranchNameSuggestions(data.suggestions));
    } else {
      setBranchNameSuggestions([]);
    }
  };

  const handleBuildingSearch = (value) => {
    setSearchBuilding(value);
    if (value.length > 0) {
      fetch(
        `http://localhost:8080/api/rooms/suggestions?type=building&search=${value}`
      )
        .then((res) => res.json())
        .then((data) => setBuildingSuggestions(data.suggestions));
    } else {
      setBuildingSuggestions([]);
    }
  };

  const handleFloorSearch = (value) => {
    setSearchFloor(value);
    if (value.length > 0) {
      fetch(
        `http://localhost:8080/api/rooms/suggestions?type=floor&search=${value}`
      )
        .then((res) => res.json())
        .then((data) => setFloorSuggestions(data.suggestions));
    } else {
      setFloorSuggestions([]);
    }
  };

  const handleRoomSearch = (value) => {
    setSearchRoom(value);
    if (value.length > 0) {
      fetch(
        `http://localhost:8080/api/rooms/suggestions?type=room&search=${value}`
      )
        .then((res) => res.json())
        .then((data) => setRoomSuggestions(data.suggestions));
    } else {
      setRoomSuggestions([]);
    }
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="d-flex vh-100 flex-column">
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
          <span className="me-3">{userName || "Loading..."}</span>{" "}
          {/* แสดงชื่อผู้ใช้ */}
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
              to="/user/dashboard"
              className="nav-link text-dark py-3 sidebar-link font-cute"
            >
              <i className="bi bi-tools me-2"></i>รายงาน
            </Link>
            <li className="nav-item">
              <Link
                to="/user/Equipment"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>อุปกรณ์
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/Note"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>บันทึก
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/Room"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>สถานที่
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/user/accounts"
                className="nav-link text-dark py-3 sidebar-link font-cute"
              >
                <i className="bi bi-tools me-2"></i>บัญชีผู้ใช้
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
          <div className="p-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h1 className="fw-bold text-dark" >สถานที่</h1>
              {/* Search Fields */}
              <div className="search-container row mb-3">
                <div className="search-container d-flex align-items-center gap-2">
                  {/* Branch Number Search */}
                  <div className="col-md-2 position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ค้นหา เลขสาขา"
                      value={searchBranchNumber}
                      onChange={(e) => handleBranchNumberSearch(e.target.value)}
                    />
                    {branchNumberSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 z-1">
                        {branchNumberSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setSearchBranchNumber(suggestion);
                              setBranchNumberSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="col-md-2 position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ค้นหา ชื่อสาขา"
                      value={searchBranchName}
                      onChange={(e) => handleBranchNameSearch(e.target.value)}
                    />
                    {branchNameSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 z-1">
                        {branchNameSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setSearchBranchName(suggestion);
                              setBranchNameSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="col-md-2 position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ค้นหา อาคาร"
                      value={searchBuilding}
                      onChange={(e) => handleBuildingSearch(e.target.value)}
                    />
                    {buildingSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 z-1">
                        {buildingSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setSearchBuilding(suggestion);
                              setBuildingSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="col-md-2 position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ค้นหา ชั้น"
                      value={searchFloor}
                      onChange={(e) => handleFloorSearch(e.target.value)}
                    />
                    {floorSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 z-1">
                        {floorSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setSearchFloor(suggestion);
                              setFloorSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="col-md-2 position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ค้นหา ห้อง"
                      value={searchRoom}
                      onChange={(e) => handleRoomSearch(e.target.value)}
                    />
                    {roomSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100 z-1">
                        {roomSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setSearchRoom(suggestion);
                              setRoomSuggestions([]);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    className="btn btn-success m-0 col-1"
                    onClick={handleSearch}
                  >
                    ค้นหา
                  </button>

                </div>
              </div>

              {/* Table */}
              <table className="table table-bordered text-center">
                <thead className="bg-light">
                  <tr>
                    <th style={{ padding: "16px", fontSize: "18px" }}>ที่อยู่สาขา</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>ชื่อสาขา</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>อาคาร</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>ชั้น</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>ห้อง</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>จำนวนอุปกรณ์</th>
                    <th style={{ padding: "16px", fontSize: "18px" }}>การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRooms.map((room, index) => (
                    <tr key={index}>
                      <td>{room.branch_number}</td>
                      <td>{room.branch_name}</td>
                      <td>{room.building_name}</td>
                      <td>{room.floor}</td>
                      <td>{room.room_name}</td>
                      <td>{room.item_count}</td>
                      <td>
                        <Link to={`/user/UserRoomdetail`} className="text-blue-500 hover:underline">
                          <button className="btn btn-primary btn-md me-2">รายละเอียด</button>
                        </Link>
                        <button className="btn btn-danger btn-md me-2" onClick={() => handleEdit(room)}>แก้ไข</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="pagination-container d-flex justify-content-center">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </button>

                {/* แสดงหมายเลขหน้า */}
                {[...Array(Math.ceil(rooms.length / roomsPerPage))].map((_, index) => (
                  <button
                    key={index}
                    className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-light'} me-2`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(rooms.length / roomsPerPage)}
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Edit Modal */}
        {showEditModal && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">แก้ไขข้อมูล</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  {/* Button Group */}
                  <div className="btn-group mb-4 w-100">
                    <button
                      className={`btn ${editType === "node" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setEditType("node")}
                    >
                      แก้ไขข้อมูลสาขา
                    </button>
                    <button
                      className={`btn ${editType === "room" ? "btn-info" : "btn-outline-info"}`}
                      onClick={() => setEditType("room")}
                    >
                      แก้ไขข้อมูลห้อง
                    </button>
                  </div>

                  {/* Edit Node Section */}
                  {editType === "node" && (
                    <div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">ชื่อสาขา</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรอกชื่อสาขา"
                          value={editData.nodeName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              nodeName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">เลขสาขา</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรอกเลขสาขา"
                          value={editData.nodeLocation}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              nodeLocation: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleEditSubmit("node")}
                      >
                        บันทึกข้อมูลสาขา
                      </button>
                    </div>
                  )}

                  {/* Edit Room Section */}
                  {editType === "room" && (
                    <div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">อาคาร</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรอกอาคาร"
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              roomFloor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">ชั้น</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรอกชั้น"
                          value={editData.roomFloor}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              roomFloor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-bold">ชื่อห้อง</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="กรอกชื่อห้อง"
                          value={editData.roomName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              roomName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleEditSubmit("room")}
                      >
                        บันทึกข้อมูลห้อง
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Delete Modal */}
        {showDeleteModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">เลือกการลบข้อมูล</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>กรุณาเลือกสิ่งที่ต้องการลบ:</p>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleConfirmDelete("node")}
                  >
                    ลบสาขา (Node)
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleConfirmDelete("room")}
                  >
                    ลบห้อง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Admin_AddRoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />


      </div>
    </div>
  );
}

export default Admin_Room;
