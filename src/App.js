import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Company from "./pages/Company";
import AddCompany from "./pages/Company/add";
import UpdateCompany from "./pages/Company/update";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import VSH from "./pages/Games/vsh";
import NHIE from "./pages/Games/nhie";
import UserManagement from "./pages/User";
import RoomVSH from "./pages/Games/roomVsh";
import ListCompany from "./pages/Home/company";
import ListGame from "./pages/Home/game";
import WOF from "./pages/Games/wof";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<ListCompany />} />
        <Route path="/list-game/:id" element={<ListGame />} />
        <Route path="/company-management" element={<Company />} />
        <Route path="/add-company" element={<AddCompany />} />
        <Route path="/update-company/:id" element={<UpdateCompany />} />
        <Route path="/user-management/:id" element={<UserManagement />} />
        <Route path="/vsh/:id/:id2" element={<VSH />} />
        <Route path="/vsh-room/:id/:id2" element={<RoomVSH />} />
        <Route path="/nhie/:id/:id2" element={<NHIE />} />
        <Route path="/wof/:id/:id2" element={<WOF />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
