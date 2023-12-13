import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useParams } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import { Spinner } from "react-bootstrap";
import Navigation from "../../components/Navigation";
import templateParticipant from "../../assets/template_participant.xlsx";
import PICManagement from "./pic";

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [dataUsers, setDataUsers] = useState([""]);
  const [totalData, setTotalData] = useState(0);
  const [current, setCurrent] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idUser, setIdUser] = useState("");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const getData = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(
        `${
          process.env.REACT_APP_URL
        }general/admin/usermanagement/list_participant/${id}/${
          pageSize ?? 10
        }/${pageIndex ?? 1}`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { search: searchIndex },
        }
      )
      .then((res) => {
        setDataUsers(res.data.data);
        setTotalData(res.data.totaldata);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAdd = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}general/admin/usermanagement/add_participant/${id}`,
        {
          email: email,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => alert(err));
  };

  const handleUpdate = () => {
    axios
      .put(
        `${process.env.REACT_APP_URL}general/admin/usermanagement/edit_participant/${idUser}`,
        {
          email: email,
        },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      });
  };

  const handleDelete = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}general/admin/usermanagement/delete/${idUser}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleUploadExcel = (file) => {
    const PPData = new FormData();
    PPData.append("excelFile", file);
    PPData.append("id_company", id);
    axios
      .post(
        `${process.env.REACT_APP_URL}general/admin/usermanagement/upload_participant_excel`,
        PPData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
        alert("success");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <Navigation
            link="company-management"
            name="Company Management"
            name2="User Management"
          />
          <PICManagement />

          <div className="card border-0 py-2 mx-3 shadow-lg mb-4">
            <div className="card-body">
              <p className="text-blue fw-bold fs-4">User Management</p>
              <div className="d-flex justify-content-between">
                <div className="input-group w-50">
                  <input
                    className="form-control input"
                    placeholder="Search"
                    onChange={(e) => {
                      setSearch(e.target.value);
                      getData(10, 1, e.target.value);
                    }}
                  />
                  <span className="input-group-text">
                    <i class="fas fa-search text-secondary"></i>
                  </span>
                </div>
                <div className="d-flex">
                  <a href={templateParticipant} download="template_user.xlsx">
                    <div className="btn bg-blue text-white me-2">
                      <i class="fa-solid fa-download me-2"></i>
                      Template
                    </div>
                  </a>
                  <div
                    className="btn bg-blue text-white me-2"
                    onClick={() => setShowAdd(true)}
                  >
                    <i class="fas fa-plus me-2"></i>
                    Add User
                  </div>
                  <FileUploader handleFile={handleUploadExcel} />
                </div>
              </div>
              {dataUsers.length !== 0 ? (
                <table class="table table-bordered mt-3 rounded rounded-3 overflow-hidden">
                  <thead>
                    <tr className="bg-blue text-white text-center">
                      <th className="fw-normal" width="5%">
                        No.
                      </th>
                      <th className="fw-normal">Email</th>
                      <th className="fw-normal">Group</th>
                      <th className="fw-normal" width="13%">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {dataUsers.map((item) => (
                    <tbody>
                      <tr>
                        <td className="text-center">{item.number}</td>
                        <td>{item.email}</td>
                        <td>{item.group}</td>
                        <td>
                          <i
                            class="far fa-trash-alt ms-4 pointer text-secondary"
                            onClick={() => {
                              setShowDelete(true);
                              setIdUser(item.id);
                            }}
                          ></i>
                          <i
                            class="far fa-edit ms-4 pointer text-secondary"
                            onClick={() => {
                              setShowUpdate(true);
                              setIdUser(item.id);
                              setEmail(item.email);
                            }}
                          ></i>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              ) : (
                <p className="text-center mt-4 mb-2 text-secondary">No Data</p>
              )}
              <PaginationControl
                page={current}
                total={totalData}
                limit={10}
                changePage={(page, size) => {
                  getData(size, page, search);
                  setCurrent(page);
                }}
              />
            </div>

            {/* for modal */}
            <Modal show={showAdd}>
              <Modal.Body>
                <p className="fs-4 fw-bold">Add User</p>
                <div className="mb-3">
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    className="w-100 mt-1 rounded-3 p-2 border form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={handleAdd}
                  >
                    OK
                  </div>
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={() => setShowAdd(false)}
                  >
                    Cancel
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <Modal show={showUpdate}>
              <Modal.Body>
                <p className="fs-4 fw-bold">Update User</p>
                <div className="mb-3">
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="email"
                    className="w-100 mt-1 rounded-3 p-2 border form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={handleUpdate}
                  >
                    OK
                  </div>
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={() => setShowUpdate(false)}
                  >
                    Cancel
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <Modal show={showDelete}>
              <Modal.Body>
                <p className="fs-4 fw-bold text-center">Confirmation</p>
                <p className="text-center">
                  Are you sure you want to delete this?
                </p>
                <div className="d-flex justify-content-center">
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={handleDelete}
                  >
                    OK
                  </div>
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={() => setShowDelete(false)}
                  >
                    Cancel
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
