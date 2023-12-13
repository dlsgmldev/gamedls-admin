import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useParams } from "react-router-dom";
import FileUploader from "../../components/FileUploader";
import templatePIC from "../../assets/template_pic.xlsx";

const PICManagement = () => {
  const [dataPIC, setDataPIC] = useState([""]);
  const [totalDataPIC, setTotalDataPIC] = useState(0);
  const [currentPIC, setCurrentPIC] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [idUser, setIdUser] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [form, setForm] = useState({
    username: "",
    fullname: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getDataPIC = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(
        `${
          process.env.REACT_APP_URL
        }general/admin/usermanagement/list_pic/${id}/${pageSize ?? 10}/${
          pageIndex ?? 1
        }`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { search: searchIndex },
        }
      )
      .then((res) => {
        setDataPIC(res.data.data);
        setTotalDataPIC(res.data.totaldata);
      });
  };

  useEffect(() => {
    getDataPIC();
  }, []);

  const handleAdd = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}general/admin/usermanagement/add_pic/${id}`,
        form,
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
        `${process.env.REACT_APP_URL}general/admin/usermanagement/edit_pic/${idUser}`,
        form,
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
        `${process.env.REACT_APP_URL}general/admin/usermanagement/upload_pic_excel`,
        PPData,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="card border-0 py-2 mx-3 shadow-lg mb-4">
      <div className="card-body">
        <p className="text-blue fw-bold fs-4">PIC Management</p>
        <div className="d-flex justify-content-between">
          <div className="input-group w-50">
            <input
              className="form-control input"
              placeholder="Search"
              onChange={(e) => getDataPIC(10, 1, e.target.value)}
            />
            <span className="input-group-text">
              <i class="fas fa-search text-secondary"></i>
            </span>
          </div>
          <div className="d-flex">
            <a href={templatePIC} download="template_pic.xlsx">
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
              Add PIC
            </div>
            <FileUploader handleFile={handleUploadExcel} />
          </div>
        </div>
        {dataPIC.length !== 0 ? (
          <table class="table table-bordered mt-3 rounded rounded-3 overflow-hidden">
            <thead>
              <tr className="bg-blue text-white text-center">
                <th className="fw-normal" width="5%">
                  No.
                </th>
                <th className="fw-normal">Name</th>
                <th className="fw-normal">Username</th>
                <th className="fw-normal" width="13%">
                  Action
                </th>
              </tr>
            </thead>
            {dataPIC.map((item) => (
              <tbody>
                <tr>
                  <td className="text-center">{item.number}</td>
                  <td>{item.fullname}</td>
                  <td>{item.username}</td>
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
          page={currentPIC}
          total={totalDataPIC}
          limit={10}
          changePage={(page, size) => {
            getDataPIC(size, page);
            setCurrentPIC(page);
          }}
        />
      </div>

      {/* for modal */}
      <Modal show={showAdd}>
        <Modal.Body>
          <p className="fs-4 fw-bold">Add User</p>
          <div className="mb-3">
            <label>Fullname:</label>
            <input
              type="text"
              name="fullname"
              placeholder="fullname"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="text"
              name="password"
              placeholder="password"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.password}
              onChange={handleChange}
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
            <label>Fullname:</label>
            <input
              type="text"
              name="fullname"
              placeholder="fullname"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label>Password:</label>
            <input
              type="text"
              name="password"
              placeholder="password"
              className="w-100 mt-1 rounded-3 p-2 border form-control"
              value={form.password}
              onChange={handleChange}
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
          <p className="text-center">Are you sure you want to delete this?</p>
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
  );
};

export default PICManagement;
