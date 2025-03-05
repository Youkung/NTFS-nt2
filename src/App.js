import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import UserDashboard from "./user/User_Dashboard";
import User_Dashboard_detail from './user/User_Dashboard_detail'; // Fix import path
import UserEquipment from "./user/User_Equipment";
import UserAccount from "./user/User_Account";
import UserNote from "./user/User_Note";
import UserRoom from "./user/User_Room";
import UserEquipmentDetail from "./user/User_EquipmentDetail";
import UserRoomdetail from "./user/User_Roomdetail"
import UserMyNotesPage from './user/User_Mynote';
import UserRackdetail from "./user/User_Rackdetail"
import AdminEquipment from "./admin/Admin_Equipment";
import AdminAccount from './admin/Admin_Account';
import AdminNote from "./admin/Admin_Note";
import AdminRoom from "./admin/Admin_Room";
import AdminEquipmentDetail from "./admin/Admin_EquipmentDetail";
import AdminMyNotesPage from './admin/Admin_Mynote';
import AdminDashboard from "./admin/Admin_Dashboard";
import AdminAddRoom from "./admin/Admin_AddRoom";
import Adminshowuser from "./admin/Admin_showuser"
import Adminroomdetail from "./admin/Admin_roomdetail"
import AdminRackdetail from "./admin/Admin_rackdetail"

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/Equipment" element={<AdminEquipment />} />
        <Route path="/admin/equipment/:id" element={<AdminEquipmentDetail />} />
        <Route path="/admin/accounts" element={<AdminAccount />} />
        <Route path="/admin/Note" element={<AdminNote />} />
        <Route path="/admin/Room" element={<AdminRoom />} />
        <Route path="/admin/my-notes" element={<AdminMyNotesPage />} />
        <Route path="/admin/addroom" element={<AdminAddRoom />} />
        <Route path="/admin/UserManagement" element={<Adminshowuser />} />
        <Route path="/admin/adminRoomdetail/:id" element={<Adminroomdetail />} /> {/* Updated this line */}
        <Route path="/admin/rackdetail/:id" element={<AdminRackdetail />} /> {/* Updated this line */}
        
        {/* User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/dashboard_detail" element={<User_Dashboard_detail />} />
        <Route path="/user/Equipment" element={<UserEquipment />} />
        <Route path="/user/equipment/:id" element={<UserEquipmentDetail />} />
        <Route path="/user/accounts" element={<UserAccount />} />
        <Route path="/user/Note" element={<UserNote />} />
        <Route path="/user/Room" element={<UserRoom />} />
        <Route path="/user/my-notes" element={<UserMyNotesPage />} />
        <Route path="/user/UserRoomdetail" element={<UserRoomdetail />} />
        <Route path="/user/rack/:id" element={<UserRackdetail />} />

      </Routes>
    </Router>
  );

}
export default App;
