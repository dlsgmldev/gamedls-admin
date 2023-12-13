import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

const NHIE = () => {
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [dataQuestion, setDataQuestion] = useState([""]);
  const [questions, setQuestions] = useState([""]);
  const [dataReport, setDataReport] = useState([""]);
  const [page, setPage] = useState(1);
  const [lastQuestion, setLastQuestion] = useState(false);
  const [point, setPoint] = useState();
  const [idUser, setIdUser] = useState();
  const [user, setUser] = useState();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { id2 } = useParams();

  const handleNext = () => {
    setPage(page + 1);
    axios
      .get(
        `${process.env.REACT_APP_URL}game/admin/question/${id}/${id2}/1/${
          page + 1
        }`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        setDataQuestion(res.data.data[0]);
        axios
          .get(
            `${process.env.REACT_APP_URL}game/admin/set_current_question/${
              res.data.data[0].id
            }/${page + 1}`,
            {
              headers: { Authorization: "Bearer " + token },
              params: { id_company: id2 },
            }
          )
          .then((res) => {});
      });
  };

  const handleReset = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/reset_nhie`,
        {},
        {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}game/admin/get_current_question`, {
        headers: { Authorization: "Bearer " + token },
        params: { id_company: id2 },
      })
      .then((res) => {
        setPage(res.data.lastpage);
        setLastQuestion(res.data.lastquestion);
        axios
          .get(
            `${process.env.REACT_APP_URL}game/admin/question/${id}/${id2}/1/${res.data.lastpage}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          )
          .then((res) => {
            setDataQuestion(res.data.data[0]);
            axios
              .get(
                `${process.env.REACT_APP_URL}game/admin/question/${id}/${id2}/${res.data.totaldata}/1`,
                {
                  headers: { Authorization: "Bearer " + token },
                }
              )
              .then((res) => {
                setQuestions(res.data.data);
              });
          });
      });

    axios
      .get(`${process.env.REACT_APP_URL}game/admin/get_report/${id}`, {
        headers: { Authorization: "Bearer " + token },
        params: { id_company: id2 },
      })
      .then((res) => {
        setDataReport(res.data.data);
        setLoading(false);
      });
    const interval = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/get_report/${id}`, {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        })
        .then((res) => {
          setDataReport(res.data.data);
        });
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/get_current_question`, {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        })
        .then((res) => {
          setPage(res.data.lastpage);
          setLastQuestion(res.data.lastquestion);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddPoint = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/add_point_nhie`,
        { id_user: idUser, point: point },
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
        <div>
          <div className="card border-0 shadow-lg mx-3 my-3 p-4">
            <p className="fs-4 fw-bold">Participants' questions</p>
            <p className="text-center fs-5">
              {page}. {dataQuestion?.question}
            </p>
            <button
              className="btn bg-blue p-1 w-25 text-white mx-auto"
              onClick={handleNext}
              disabled={lastQuestion === true}
            >
              Next
            </button>
          </div>
          <div className="card border-0 shadow-lg mx-3 my-3 p-4">
            <button
              className="btn bg-blue p-1 w-25 text-white mb-2"
              onClick={() => setShowReset(true)}
            >
              Reset Game
            </button>
            <p className="fs-4 fw-bold">Participants' answers</p>
            <div className="table-responsive">
              <table class="table">
                <thead className="text-center">
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Action</th>
                    {questions.map((item) => (
                      <th>
                        <span
                          className="d-inline-block default-cursor"
                          title={item.question}
                        >
                          <span className="">{item.alias}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataReport.map((item) => (
                    <tr>
                      <td className="text-center">{item.number}</td>
                      <td>
                        {item.name} ({item.point})
                      </td>
                      <td>
                        <div
                          className="bg-info p-1 text-white mx-auto rounded text-center pointer"
                          style={{ width: "33px" }}
                          onClick={() => {
                            setShowAdd(true);
                            setIdUser(item.id_user);
                            setUser(item.name);
                          }}
                        >
                          <i class="fa-solid fa-circle-plus"></i>
                        </div>
                      </td>
                      {item?.answer?.map((item) => (
                        <td className="text-center">
                          {item === "1" ? (
                            <div
                              className="bg-success p-1 text-white mx-auto rounded"
                              style={{ width: "33px" }}
                            >
                              <i class="fa-solid fa-check"></i>
                            </div>
                          ) : item === "2" ? (
                            <div
                              className="bg-danger p-1 text-white mx-auto rounded"
                              style={{ width: "33px" }}
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </div>
                          ) : (
                            <div
                              className="bg-warning p-1 text-white mx-auto rounded"
                              style={{ width: "33px" }}
                            >
                              <i class="fa-solid fa-arrows-rotate"></i>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* for modal */}
      <Modal show={showReset}>
        <Modal.Body>
          <p className="fs-4 fw-bold text-center mb-2">Konfirmasi</p>
          <p className="text-center">Apakah Anda yakin ingin reset game?</p>
          <div className="d-flex justify-content-center">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={handleReset}
            >
              Ya
            </div>
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => setShowReset(false)}
            >
              Tidak
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAdd}>
        <Modal.Body>
          <p className="fs-4 fw-bold text-center mb-3">Update Point</p>
          <label>Point ({user}):</label>
          <input
            type="text"
            name="point"
            placeholder="point"
            className="w-100 mt-1 rounded-3 p-2 border form-control"
            value={point}
            onChange={(e) => setPoint(e.target.value)}
          />
          <div className="d-flex justify-content-center mt-3">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={handleAddPoint}
            >
              Submit
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
    </div>
  );
};

export default NHIE;
