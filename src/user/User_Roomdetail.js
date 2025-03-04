import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../Logo/Fulllogo.png";
import "./side.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Roomdetail() {
    const { id } = useParams();
    const [equipmentDetails, setEquipmentDetails] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const racks = [
        {
            id: 1,
            name: "แร็ค 1",
            link: "/user/rack/1",
            equipment: [
                { name: "อุปกรณ์ 1", code: "E001", brand: "ยี่ห้อ A", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 2", code: "E002", brand: "ยี่ห้อ B", status: "ไม่ได้ใช้งาน" }
            ]
        },
        {
            id: 2,
            name: "แร็ค 2",
            link: "/user/rack/2",
            equipment: [
                { name: "อุปกรณ์ 3", code: "E003", brand: "ยี่ห้อ C", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 4", code: "E004", brand: "ยี่ห้อ D", status: "ไม่ได้ใช้งาน" }
            ]
        },
        {
            id: 3,
            name: "แร็ค 3",
            link: "/user/rack/3",
            equipment: [
                { name: "อุปกรณ์ 5", code: "E005", brand: "ยี่ห้อ E", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 6", code: "E006", brand: "ยี่ห้อ F", status: "ไม่ได้ใช้งาน" }
            ]
        },
        {
            id: 4,
            name: "แร็ค 4",
            link: "/user/rack/4",
            equipment: [
                { name: "อุปกรณ์ 7", code: "E007", brand: "ยี่ห้อ G", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 8", code: "E008", brand: "ยี่ห้อ H", status: "ไม่ได้ใช้งาน" }
            ]
        },
        {
            id: 5,
            name: "แร็ค 5",
            link: "/user/rack/5",
            equipment: [
                { name: "อุปกรณ์ 9", code: "E009", brand: "ยี่ห้อ I", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 10", code: "E010", brand: "ยี่ห้อ J", status: "ไม่ได้ใช้งาน" }
            ]
        },
        {
            id: 6,
            name: "แร็ค 6",
            link: "/user/rack/6",
            equipment: [
                { name: "อุปกรณ์ 11", code: "E011", brand: "ยี่ห้อ K", status: "ใช้งานอยู่" },
                { name: "อุปกรณ์ 12", code: "E012", brand: "ยี่ห้อ L", status: "ไม่ได้ใช้งาน" }
            ]
        }
    ];

    // Fetch equipment details and its items
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch equipment details
                const equipResponse = await fetch(`https://test-api-deploy-flax.vercel.app/api/equipement/${id}`);
                const equipData = await equipResponse.json();
                setEquipmentDetails(equipData);

                // Fetch items for this equipment
                const itemsResponse = await fetch(`https://test-api-deploy-flax.vercel.app/api/items/${id}`);
                const itemsData = await itemsResponse.json();
                setItems(itemsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/"; // เปลี่ยนหน้าโดยตรง
    };

    // Filter items based on search
    const filteredItems = items.filter(item =>
        item.Serial_Number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Get status class based on item status
    const getStatusClass = (status) => {
        return status === "active" ? "text-success" : "text-danger";
    };

    if (loading) return <div>Loading...</div>;
    if (!equipmentDetails) return <div>Equipment not found</div>;

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
                            <Link to="/user/Room">
                                <img src="https://cdn-icons-png.flaticon.com/128/151/151846.png" alt="back-icon" style={{ width: '20px', height: '20px' }} />
                            </Link>

                            <div className="container">
                                <h1 className="mb-5">ตู้แร็ค</h1>
                                <div className="container border rounded p-4 mt-4">
                                    <div className="row">
                                        {racks.map((rack) => (
                                            <div className="col-md-3 mb-4" key={rack.id}>
                                                <Link to={`/user/rack/${rack.id}`} className="text-decoration-none">
                                                    <div className="card h-100 text-center d-flex justify-content-center align-items-center border-primary">
                                                        <div className="card-body">
                                                            <h3 className="card-text text-primary fw-bold">{rack.name}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Roomdetail;
