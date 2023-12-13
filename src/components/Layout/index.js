import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Outlet, useNavigate } from "react-router-dom";
// import logo from "../../assets/Logo Assesment Center-06.png";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const logoCompany = localStorage.getItem("logo_company");

  return (
    <div className="vh-100">
      <div className="row h-100 ms-0">
        <div
          className="card border-0 border-radius-0 col text-white"
          style={{ backgroundColor: "#6C9BCF", width: "18%" }}
        >
          <p className="fs-5 fw-bold mt-3 pb-2 border-bottom border-3 border-light text-center">
            Game Center <br />
            ONE GML
          </p>
          <div
            className="d-flex pointer sidebar-menu"
            onClick={() => navigate("/")}
          >
            <i class="fas fa-info-circle fa-fw mt-1"></i>
            <span className="ms-2 text-sidebar">Home</span>
          </div>
          {role === "1" ? (
            <div
              className="d-flex pointer sidebar-menu"
              onClick={() => navigate("/company-management")}
            >
              <i class="fas fa-user-alt fa-fw mt-1"></i>
              <span className="ms-2 text-sidebar">Company Management</span>
            </div>
          ) : (
            ""
          )}
          <span className="mt-auto text-xs text-center">v 1.0.0</span>
        </div>
        <div className="col-10 ps-0">
          <div className="d-flex shadow-sm p-3">
            {/* <img className="d-flex" src={logo} width="auto" height={40} /> */}
            {logoCompany ? (
              <img
                className="my-auto p-1"
                alt=""
                src={logoCompany}
                width="auto"
                height={33}
              ></img>
            ) : (
              ""
            )}
            <div className="d-flex justify-content-end ms-auto">
              <Dropdown>
                <Dropdown.Toggle className="d-flex" variant="none">
                  <i class="far fa-user-circle fs-4"></i>
                  <span className="ms-2">{name}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/login");
                      localStorage.clear();
                    }}
                  >
                    Keluar
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          {children} <Outlet />
          <div className="footer mt-2">
            <p className="text-center">
              Copyright © Digital Learning Solutions 2023. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
