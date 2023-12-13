import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import camera from "../../assets/image.png";
import { Modal, Spinner } from "react-bootstrap";

const RoomVSH = () => {
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dataVSH, setDataVSH] = useState([""]);
  const [idQuestion, setIdQuestion] = useState();
  const [showValid, setShowValid] = useState(false);
  const [showNotValid, setShowNotValid] = useState(false);
  const [showOpenFile, setShowOpenFile] = useState(false);
  const [openFile, setopenFile] = useState();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { id2 } = useParams();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_URL}game/admin/get_report_moderator_vsh/${id}`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        }
      )
      .then((res) => {
        setDataVSH(res.data.data);
        setLoading(false);
      });
    const interval = setInterval(() => {
      axios
        .get(
          `${process.env.REACT_APP_URL}game/admin/get_report_moderator_vsh/${id}`,
          {
            headers: { Authorization: "Bearer " + token },
            params: { id_company: id2 },
          }
        )
        .then((res) => {
          setDataVSH(res.data.data);
          setLoading(false);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleValid = (idAnswer) => {
    setLoadingButton(true);
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/validate_vsh/${idAnswer}/1`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => alert(err));
  };

  const handleNotValid = (idAnswer) => {
    setLoadingButton(true);
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/validate_vsh/${idAnswer}/2`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="card border-0 shadow-lg mx-3 my-3 p-4">
          <p className="fw-bold fs-5">Room {id}</p>
          <table class="table table-bordered">
            <thead>
              <tr className="text-center">
                <th width="5%">No.</th>
                <th>Task</th>
                <th width="30%">Answer</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th width="15%">Action</th>
              </tr>
            </thead>
            {dataVSH.map((item) => (
              <tbody>
                <tr>
                  <td className="text-center">{item.number}</td>
                  <td>{item.task}</td>
                  <td className="text-center">
                    {item.answer === "0" ? (
                      <img src={camera} width="40px" height="auto" />
                    ) : (
                      <button
                        className="btn bg-blue p-2 text-white"
                        onClick={() => {
                          setShowOpenFile(true);
                          setopenFile(item.answer);
                        }}
                      >
                        Open File
                      </button>
                    )}
                  </td>
                  <td>
                    {item.validate === "1"
                      ? "Valid"
                      : item.validate === "2"
                      ? "Tidak Valid"
                      : "Belum Divalidasi"}
                  </td>
                  <td>{item.date}</td>
                  <td className="text-center">
                    <button
                      className="btn bg-success p-1 text-white me-2"
                      style={{ width: "35%" }}
                      onClick={() => {
                        setIdQuestion(item.id_answer);
                        setShowValid(true);
                      }}
                      disabled={item.validate === "1" || item.id_answer === 0}
                    >
                      <i class="fa-solid fa-check"></i>
                    </button>
                    <button
                      className="btn bg-danger p-1 text-white"
                      style={{ width: "35%" }}
                      onClick={() => {
                        setIdQuestion(item.id_answer);
                        setShowNotValid(true);
                      }}
                      disabled={item.validate === "1" || item.id_answer === 0}
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}
      <Modal show={showValid}>
        <Modal.Body>
          <p className="fs-4 fw-bold mb-2 text-center">Confirmation</p>
          <p className="text-center">Are you sure this is valid?</p>
          <div className="d-flex justify-content-center">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => handleValid(idQuestion)}
            >
              {loadingButton === true ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Yes"
              )}
            </div>
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => setShowValid(false)}
            >
              No
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showNotValid}>
        <Modal.Body>
          <p className="fs-4 fw-bold mb-2 text-center">Confirmation</p>
          <p className="text-center">Are you sure this is not valid?</p>
          <div className="d-flex justify-content-center">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => handleNotValid(idQuestion)}
            >
              {loadingButton === true ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Yes"
              )}
            </div>
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => setShowNotValid(false)}
            >
              No
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showOpenFile} onHide={() => setShowOpenFile(false)}>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            {openFile?.slice(((openFile?.lastIndexOf(".") - 1) >>> 0) + 2) ===
            "mp4" ? (
              <video controls width="250px" height="auto">
                <source src={openFile} type="video/mp4" />
              </video>
            ) : (
              <img src={openFile} width="300px" height="auto" />
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RoomVSH;
