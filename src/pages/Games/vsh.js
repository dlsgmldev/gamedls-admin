import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const VSH = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showOpenFile, setShowOpenFile] = useState(false);
  const [openFile, setopenFile] = useState();
  const [dataRoom, setDataRoom] = useState([""]);
  const [dataReport, setDataReport] = useState([""]);
  const [dataRanking, setDataRanking] = useState([""]);
  const [startTime, setStartTime] = useState();
  const [point, setPoint] = useState();
  const [idQuestion, setIdQuestion] = useState();
  const [question, setQuestion] = useState();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { id2 } = useParams();

  useEffect(() => {
    if (role === "1") {
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/get_report_vsh`, {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        })
        .then((res) => {
          setDataReport(res.data);
          setLoading(false);
        });
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/get_ranking_list`, {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        })
        .then((res) => {
          setDataRanking(res.data.data);
        });
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/get_starttime_vsh`, {
          headers: { Authorization: "Bearer " + token },
          params: { id_company: id2 },
        })
        .then((res) => {
          setStartTime(res.data.timestart);
        });
      // const interval = setInterval(() => {
      //   axios
      //     .get(`${process.env.REACT_APP_URL}game/admin/get_report_vsh`, {
      //       headers: { Authorization: "Bearer " + token },
      //       params: { id_company: id2 },
      //     })
      //     .then((res) => {
      //       setDataReport(res.data);
      //     });
      //   axios
      //     .get(`${process.env.REACT_APP_URL}game/admin/get_ranking_list`, {
      //       headers: { Authorization: "Bearer " + token },
      //       params: { id_company: id2 },
      //     })
      //     .then((res) => {
      //       setDataRanking(res.data.data);
      //     });
      // }, 3000);
      // return () => clearInterval(interval);
    } else {
      axios
        .get(`${process.env.REACT_APP_URL}game/admin/room`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setDataRoom(res.data.data);
          setLoading(false);
        });
    }
  }, []);

  const handleStart = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/set_starttime_vsh`,
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

  const handleReset = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/reset_vsh`,
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

  const handleAddPoint = () => {
    axios
      .put(
        `${process.env.REACT_APP_URL}game/admin/update_point_task_vsh`,
        { id_question: idQuestion, point: point },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      });
  };

  return (
    <div>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="card border-0 shadow-lg mx-3 my-3 p-4">
          {role === "1" ? (
            <div>
              <p className="">Started on: {startTime}</p>
              <div className="d-flex mb-3">
                <button
                  className="btn bg-blue p-1 w-25 text-white"
                  onClick={() => setShowStart(true)}
                  disabled={startTime !== "0"}
                >
                  Mulai
                </button>
                <button
                  className="btn bg-blue p-1 w-25 text-white ms-3"
                  onClick={() => setShowReset(true)}
                >
                  Reset Game
                </button>
              </div>
              <p className="fs-4 fw-bold">Completed Task</p>
              <div className="table-responsive">
                <table class="table mt-3">
                  <thead>
                    <tr className="text-center">
                      <th width="5%">No.</th>
                      <th>Task</th>
                      <th>Action</th>
                      {dataReport.room.map((item) => (
                        <th>{item.name}</th>
                      ))}
                    </tr>
                  </thead>
                  {dataReport.data.map((item) => (
                    <tbody>
                      <tr>
                        <td className="text-center">{item.number}</td>
                        <td>
                          {item.task} ({item.point})
                        </td>
                        <td>
                          <div
                            className="bg-info p-1 text-white mx-auto rounded text-center pointer"
                            style={{ width: "33px" }}
                            onClick={() => {
                              setShowAdd(true);
                              setIdQuestion(item.id_question);
                              setQuestion(item.task);
                            }}
                          >
                            <i class="fa-solid fa-circle-plus"></i>
                          </div>
                        </td>
                        {item?.room?.map((item) => (
                          <td className="text-center">
                            {item.finish === "1" ? (
                              <div
                                className="bg-success p-1 text-white mx-auto rounded pointer"
                                style={{ width: "33px" }}
                                onClick={() => {
                                  setShowOpenFile(true);
                                  setopenFile(item.answer);
                                }}
                              >
                                <i class="fa-solid fa-check"></i>
                              </div>
                            ) : item.finish === "2" ? (
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
                    </tbody>
                  ))}
                </table>
              </div>
              <p className="fs-4 fw-bold mt-5">Ranking</p>
              <table class="table mt-1">
                <thead>
                  <tr className="text-center">
                    <th width="5%">No.</th>
                    <th>Room</th>
                    <th>Duration</th>
                    <th>Point</th>
                  </tr>
                </thead>
                {dataRanking.map((item) => (
                  <tbody>
                    <tr className="text-center">
                      <td className="">{item.number}</td>
                      <td>{item.room}</td>
                      <td>{Math.floor(item.seconds / 60)} minutes</td>
                      <td>{item.point}</td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          ) : (
            <div>
              <p className="fs-4 fw-bold">Room</p>
              <table class="table">
                <thead className="text-center">
                  <tr>
                    <th width="5%">No.</th>
                    <th>Room</th>
                    <th>Action</th>
                  </tr>
                </thead>
                {dataRoom.map((item) => (
                  <tbody>
                    <tr>
                      <td className="text-center">{item.number}</td>
                      <td>{item.name}</td>
                      <td className="text-center">
                        <i
                          className="fa fa-circle-info pointer text-secondary"
                          onClick={() =>
                            navigate(`/vsh-room/${item.id}/${id2}`)
                          }
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          )}
        </div>
      )}

      {/* for modal */}
      <Modal show={showStart}>
        <Modal.Body>
          <p className="fs-4 fw-bold text-center mb-2">Konfirmasi</p>
          <p className="text-center">Apakah Anda yakin ingin mulai game?</p>
          <div className="d-flex justify-content-center">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={handleStart}
            >
              Ya
            </div>
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => setShowStart(false)}
            >
              Tidak
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
          <label>Point ({question}):</label>
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

      <Modal show={showOpenFile} onHide={() => setShowOpenFile(false)}>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            {openFile?.slice(((openFile?.lastIndexOf(".") - 1) >>> 0) + 2) ===
              "mp4" ||
            openFile?.slice(((openFile?.lastIndexOf(".") - 1) >>> 0) + 2) ===
              "MOV" ||
            openFile?.slice(((openFile?.lastIndexOf(".") - 1) >>> 0) + 2) ===
              "mov" ? (
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

export default VSH;
