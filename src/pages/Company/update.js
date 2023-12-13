import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCompany = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [dataClient, setDataClient] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}general/admin/company/detail/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setDataClient(res.data);
      });
  }, []);

  const handleSubmit = () => {
    const PPData = new FormData();
    PPData.append("image", icon ? icon : "");
    PPData.append("name", name ? name : dataClient?.name);
    axios
      .put(`${process.env.REACT_APP_URL}general/admin/company/update/${id}`, PPData, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        navigate("/company-management");
      })
      .catch((err) => {});
  };

  const handlePic = (e) => {
    e.preventDefault();
    setIcon(e.target.files[0]);
  };

  return (
    <div className="card border-0 py-2 mx-3 shadow-lg my-4">
      <div className="card-body">
        <p className="text-blue fw-bold fs-4">Update Company</p>
        <div className="row">
          <label className="mb-1">Icon:</label>
          <div className="mb-3 form-group">
            {icon ? (
              <img
                className="my-3"
                alt=""
                width={100}
                src={URL.createObjectURL(icon)}
              />
            ) : (
              <img className="my-3" alt="" width={100} src={dataClient.image} />
            )}
            <input
              type="file"
              name="icon"
              className="form-control"
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
              defaultValue={dataClient.name}
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

export default UpdateCompany;
