import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import Navigation from "../../components/Navigation";

const Company = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataClient, setDataClient] = useState([""]);
  const [totalData, setTotalData] = useState(0);
  const [current, setCurrent] = useState(1);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const token = localStorage.getItem("token");

  const getData = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}general/admin/company/list/1/${
          pageSize ?? 10
        }/${pageIndex ?? 1}`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { search: searchIndex },
        }
      )
      .then((res) => {
        setDataClient(res.data.data);
        setTotalData(res.data.totaldata);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDelete = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}general/admin/company/delete/${id}`,
        { id_value: id },
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

  return (
    <>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Navigation link="/company-management" name="Company Management" />
          <div className="card border-0 py-2 mx-3 shadow-lg mb-4">
            <div className="card-body">
              <p className="text-blue fw-bold fs-4">Company Management</p>
              <div className="d-flex justify-content-between">
                <div className="input-group w-70">
                  <input
                    className="form-control input"
                    placeholder="Search"
                    onChange={(e) => getData(10, 1, e.target.value)}
                  />
                  <span className="input-group-text">
                    <i class="fas fa-search text-secondary"></i>
                  </span>
                </div>
                <div className="d-flex">
                  <div
                    className="btn bg-blue text-white me-2"
                    onClick={() => navigate("/add-company")}
                  >
                    <i class="fas fa-plus me-2" style={{ fontSize: 14 }}></i>
                    Add Company
                  </div>
                </div>
              </div>
              <table class="table table-bordered mt-3 rounded rounded-3 overflow-hidden">
                <thead>
                  <tr className="bg-blue text-white text-center">
                    {/* <th className="fw-normal">No.</th> */}
                    <th className="fw-normal">Icon</th>
                    <th className="fw-normal">Name</th>
                    <th className="fw-normal">Action</th>
                  </tr>
                </thead>
                {dataClient.map((item) => (
                  <tbody>
                    <tr>
                      {/* <th scope="row" className="fw-normal text-center" width="5%">
                        1
                      </th> */}
                      <td className="fw-normal" width="15%">
                        <img src={item.image} width={80} />
                      </td>
                      <td className="fw-normal">{item.name}</td>
                      <td className="fw-lighter align-middle" width="17%">
                        <i
                          className="far fa-edit ms-4 pointer text-secondary"
                          onClick={() => navigate(`/update-company/${item.id}`)}
                        ></i>
                        <i
                          className="fas fa-user-edit ms-4 pointer text-secondary"
                          onClick={() =>
                            navigate(`/user-management/${item.id}`)
                          }
                        ></i>
                        <i
                          className="far fa-trash-alt ms-4 pointer text-secondary"
                          onClick={() => {
                            setShow(true);
                            setId(item.id);
                          }}
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <PaginationControl
                page={current}
                total={totalData}
                limit={10}
                changePage={(page, size) => {
                  getData(size, page);
                  setCurrent(page);
                }}
              />
            </div>

            {/* for modal */}
            <Modal show={show}>
              <Modal.Body>
                <p className="fs-4 fw-bold text-center">Konfirmasi</p>
                <p className="text-center">Apakah Anda yakin mau menghapus ini?</p>
                <div className="d-flex justify-content-center">
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={handleDelete}
                  >
                    Ya
                  </div>
                  <div
                    className="btn bg-blue mx-2 text-white px-4"
                    onClick={() => setShow(false)}
                  >
                    Tidak
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </>
      )}
    </>
  );
};

export default Company;
