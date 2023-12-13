import React from "react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ name, link, name2, link2, name3 }) => {
  const navigate = useNavigate();

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        margin: "15px 20px",
        fontSize: "14px",
      }}
    >
      <ol className="breadcrumb">
        <li className="breadcrumb-item pointer" onClick={() => navigate("/")}>
          <span>Home</span>
        </li>
        <li
          className="breadcrumb-item pointer"
          onClick={() => navigate(`/${link}`)}
        >
          <span>{name}</span>
        </li>
        <li
          className={name2 ? "breadcrumb-item pointer" : "pointer"}
          onClick={() => navigate(`/${link2}`)}
        >
          <span>{name2}</span>
        </li>
        <li
          className={name3 ? "breadcrumb-item pointer" : "pointer"}
          // onClick={() => navigate(`/${link2}`)}
        >
          <span>{name3}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Navigation;
