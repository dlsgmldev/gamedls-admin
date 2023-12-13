import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCompany = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = () => {
    const PPData = new FormData();
    PPData.append("image", icon);
    PPData.append("name", name);
    PPData.append("id_app", 1);
    axios
      .post(`${process.env.REACT_APP_URL}general/admin/company/add`, PPData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        navigate("/company-management");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handlePic = (e) => {
    e.preventDefault();
    setIcon(e.target.files[0]);
  };

  return (
    <div className="card border-0 py-2 mx-3 shadow-lg my-4">
      <div className="card-body">
        <p className="text-blue fw-bold fs-4">Add Company</p>
        <div className="row">
          <label className="mb-1">Icon:</label>
          <div className="mb-3 form-group">
            {icon ? (
              <img
                className="my-3"
                alt=""
                width={150}
                src={URL.createObjectURL(icon)}
              />
            ) : (
              ""
            )}
            <input
              type="file"
              name="icon"
              className="form-control mt-1 input"
              defaultValue={icon}
              onChange={handlePic}
            />
          </div>
          <div className="mb-3">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div
          className="btn bg-blue w-25 float-right text-white"
          onClick={handleSubmit}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
