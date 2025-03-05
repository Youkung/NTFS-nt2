import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import logo from "../Logo/Fulllogo.png";
import "./side.css"
import { Link } from "react-router-dom";

function MyNotesPage() {
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editNote, setEditNote] = useState(null);
    const [editImages, setEditImages] = useState([]);
    const [userName, setUserName] = useState("");
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);

    useEffect(() => {
        if (userId) {
            fetchNotes();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
            if (!token) {
                console.error('No token found');
                handleLogout();
                return;
            }

            const response = await fetch('https://test-api-deploy-git-main-ntfs.vercel.app/api/user/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            if (userData.User_ID) {
                setUserId(userData.User_ID);
            } else {
                throw new Error('Invalid user data received');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            handleLogout();
        }
    };

    const fetchNotes = async () => {
        try {
            if (!userId) return;

            const response = await fetch(`https://test-api-deploy-git-main-ntfs.vercel.app/api/note/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.data) {
                setNotes(result.data.map(note => ({
                    id: note.Note_ID,
                    title: note.Note_Head,
                    content: note.Note,
                    date: note.Note_CreateDate,
                    author: note.author,
                    Note_Photo: note.Note_Photo
                })));
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            // Consider showing an error message to the user
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        window.location.href = "/";
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                const response = await fetch(`https://test-api-deploy-git-main-ntfs.vercel.app/api/note/${noteId}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    throw new Error("Failed to delete note");
                }
                setNotes(notes.filter((note) => note.id !== noteId));
                alert("Note deleted successfully!");
            } catch (error) {
                console.error("Error deleting note:", error);
                alert("Error deleting note. Please try again.");
            }
        }
    };

    const handleViewDetails = async (note) => {
        try {
            const response = await fetch(`https://test-api-deploy-git-main-ntfs.vercel.app/api/note/images/${note.id}`);
            const result = await response.json();
            setSelectedNote({
                ...note,
                images: result.images.map(image => ({
                    ...image,
                    Image_Path: `https://test-api-deploy-git-main-ntfs.vercel.app${image.Image_Path}`
                })),
            });
            setShowDetailsPopup(true);
        } catch (error) {
            console.error("Error fetching note images:", error);
        }
    };

    const handleEdit = async (note) => {
        try {
            const response = await fetch(`https://test-api-deploy-git-main-ntfs.vercel.app/api/note/images/${note.id}`);
            const result = await response.json();
            setEditNote({
                ...note,
                images: result.images || []
            });
            setEditImages(result.images || []);
            setShowEditModal(true);
        } catch (error) {
            console.error("Error fetching note details:", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://test-api-deploy-git-main-ntfs.vercel.app/api/note/${editNote.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    User_ID: userId,
                    Note_Head: editNote.title,
                    Note: editNote.content,
                    Note_CreateDate: editNote.date,
                    Note_Images: editImages.map(img => img.Image_Path)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            // Refresh notes list
            fetchNotes();
            setShowEditModal(false);
            alert('Note updated successfully!');
        } catch (error) {
            console.error('Error updating note:', error);
            alert('Failed to update note. Please try again.');
        }
    };

    const renderTableRow = (note) => (
        <tr key={note.id}>
            <td>{note.title}</td>
            <td>{note.author}</td>
            <td>
                {new Date(note.date).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })}
            </td>
            <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleViewDetails(note)}>
                    View
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteNote(note.id)}>
                    Delete
                </Button>
            </td>
        </tr>
    );

    const renderEditModal = () => (
        <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            size="xl"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editNote && (
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editNote.title}
                                onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <textarea
                                className="form-control"
                                rows={5}
                                value={editNote.content}
                                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Current Images</label>
                            <div className="d-flex flex-wrap gap-2">
                                {editImages.map((image, index) => (
                                    <div key={image.Image_ID} className="position-relative">
                                        <img
                                            src={`https://test-api-deploy-git-main-ntfs.vercel.app${image.Image_Path}`}
                                            alt={`Note image ${index + 1}`}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                objectFit: "cover"
                                            }}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0"
                                            onClick={() => setEditImages(editImages.filter(img => img.Image_ID !== image.Image_ID))}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}
            </Modal.Body>
        </Modal>
    );

    useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
            const user = JSON.parse(userData); // แปลงข้อมูลจาก JSON เป็นออบเจ็กต์
            setUserName(`${user.Name}`); // กำหนดชื่อผู้ใช้
        }
    }, []);

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
                    <span className="me-3">{userName || "Loading..."}</span> {/* แสดงชื่อผู้ใช้ */}
                    <img
                        src="https://static.vecteezy.com/system/resources/previews/009/749/751/non_2x/avatar-man-icon-cartoon-male-profile-mascot-illustration-head-face-business-user-logo-free-vector.jpg"
                        alt="Profile"
                        className="rounded-circle"
                        style={{ height: "40px", width: "40px" }}
                    />
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

                <div
                    className="flex-grow-1 d-flex flex-column"
                    style={{ background: "linear-gradient(to bottom, #ffcc00, #EEE891)" }}
                >
                    <div className="p-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <h1>บันทึกของฉัน</h1>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Button variant="outline-primary" as={Link} to="/admin/Note">
                                    ดูบันทึกทั้งหมด
                                </Button>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{ width: "30%" }}>เรื่อง</th>
                                        <th style={{ width: "30%" }}>ชื่อผู้เขียน</th>
                                        <th style={{ width: "20%" }}>วันที่เขียน</th>
                                        <th style={{ width: "20%" }}>การดำเนินการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notes
                                        .slice()
                                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // เรียงลำดับจากใหม่ไปเก่า
                                        .map(renderTableRow)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showDetailsPopup} onHide={() => setShowDetailsPopup(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Note Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNote && (
                        <div className="note-details">
                            <div className="note-header">
                                <h5>Title: {selectedNote.title}</h5>
                                <p><strong>Author:</strong> {selectedNote.author}</p>
                                <p><strong>Date:</strong> {new Date(selectedNote.date).toLocaleDateString()}</p>
                            </div>

                            <div className="note-content mt-4">
                                <p><strong>Content:</strong> {selectedNote.content}</p>
                            </div>

                            <div className="note-images mt-4">
                                <strong>Images:</strong>
                                <div className="image-gallery">
                                    {selectedNote.images && selectedNote.images.length > 0 ? (
                                        selectedNote.images.map((image) => (
                                            <img
                                                key={image.Image_ID}
                                                src={image.Image_Path}
                                                alt={`Note image`}
                                                style={{
                                                    width: "200px",
                                                    height: "200px",
                                                    objectFit: "cover",
                                                    margin: "5px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <p>No images attached</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => {
                            setShowDetailsPopup(false);
                            handleEdit(selectedNote);
                        }}
                    >
                        Edit
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDetailsPopup(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {renderEditModal()}
        </div>
    );
}

export default MyNotesPage;
