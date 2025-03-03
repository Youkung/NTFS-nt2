import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Logo/Fulllogo.png";
import "./side.css";
import "bootstrap/dist/css/bootstrap.min.css";

const RackDetail = () => {
    const racks = [
        {
            id: 1,
            name: "แร๊ค 1",
            equipment: [
                { id: "1", name: "อุปกรณ์ 1", code: "E001", brand: "ยี่ห้อ A", status: "ใช้งานอยู่" },
                { id: "2", name: "อุปกรณ์ 2", code: "E002", brand: "ยี่ห้อ B", status: "ไม่ได้ใช้งาน" },
                { id: "3", name: "อุปกรณ์ 3", code: "E003", brand: "ยี่ห้อ C", status: "ใช้งานอยู่" },
                { id: "4", name: "อุปกรณ์ 4", code: "E004", brand: "ยี่ห้อ B", status: "ไม่ได้ใช้งาน" },
                { id: "5", name: "อุปกรณ์ 5", code: "E005", brand: "ยี่ห้อ A", status: "ใช้งานอยู่" },
                { id: "6", name: "อุปกรณ์ 6", code: "E006", brand: "ยี่ห้อ B", status: "ไม่ได้ใช้งาน" },
                { id: "7", name: "อุปกรณ์ 7", code: "E007", brand: "ยี่ห้อ A", status: "ใช้งานอยู่" },
                { id: "8", name: "อุปกรณ์ 8", code: "E008", brand: "ยี่ห้อ B", status: "ไม่ได้ใช้งาน" }
            ]
        }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
            const user = JSON.parse(userData); // แปลงข้อมูลจาก JSON เป็นออบเจ็กต์
            setUserName(`${user.Name}`); // กำหนดชื่อผู้ใช้
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/"; // เปลี่ยนหน้าโดยตรง
    };

    return (
        <div className="d-flex vh-100 flex-column">
            <div className="d-flex align-items-center px-4 py-2 bg-light border-bottom" style={{ height: "80px" }}>
                <img src={logo} alt="Logo" style={{ height: "50px", width: "auto" }} className="ms-5 me-2" />
                <div className="ms-auto d-flex align-items-center">
                    <span className="me-3">{userName || "Loading..."}</span> {/* แสดงชื่อผู้ใช้ */}
                    <img src="https://static.vecteezy.com/system/resources/previews/009/749/751/non_2x/avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg" alt="Profile" className="rounded-circle" style={{ height: "40px", width: "40px" }} />
                </div>
            </div>

            <div className="d-flex flex-grow-1">
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

                <div className="flex-grow-1 d-flex flex-column" style={{ background: "linear-gradient(to bottom, #ffcc00, #EEE891)" }}>
                    <div className="p-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            {/* ปรับปุ่มกลับให้อยู่ข้างบน */}
                            <Link to="/user/UserRoomdetail">
                                <img src="https://cdn-icons-png.flaticon.com/128/151/151846.png" alt="back-icon" style={{ width: '20px', height: '20px' }} />
                            </Link>

                            <div className="container py-4">
                                <h1 className="mb-3">{racks[0].name}</h1>
                                <input
                                    type="text"
                                    className="form-control mb-4"
                                    placeholder="Search by equipment name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <div className="row">
                                    {racks[0].equipment
                                        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((item) => (
                                            <div key={item.id} className="col-md-4 mb-4">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.name}</h5>
                                                        <p><strong>Code:</strong> {item.code}</p>
                                                        <p><strong>Brand:</strong> {item.brand}</p>
                                                        <p className={`card-text ${item.status === 'ใช้งานอยู่' ? 'text-success' : 'text-danger'}`}>
                                                            <strong>Status:</strong> {item.status}
                                                        </p>
                                                        <button className="btn btn-primary">Change Status</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RackDetail;
