import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate, useParams } from "react-router-dom";

const ListGame = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [dataGame, setDataGame] = useState([""]);
  const [dataLeaderboard, setDataLeaderboard] = useState([""]);
  const [dataGroupLeaderboard, setDataGroupLeaderboard] = useState([""]);
  const [totalData, setTotalData] = useState(0);
  const [current, setCurrent] = useState(1);
  const [file, setFile] = useState(1);
  const token = localStorage.getItem("token");
  const { id } = useParams();

  const getData = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}game/admin/list/${pageSize ?? 10}/${
          pageIndex ?? 1
        }`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { search: searchIndex },
        }
      )
      .then((res) => {
        setDataGame(res.data.data);
        setTotalData(res.data.totaldata);
      });
  };

  useEffect(() => {
    getData();
    axios
      .get(`${process.env.REACT_APP_URL}game/admin/leaderboard/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setDataLeaderboard(res.data.data);
        setLoading(false);
      });
    axios
      .get(
        `${process.env.REACT_APP_URL}game/admin/leaderboard_by_group/${id}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        setDataGroupLeaderboard(res.data.data);
        setLoading(false);
      });
  }, []);

  const handleChangeSwitch = (e, idGame) => {
    axios
      .put(
        `${process.env.REACT_APP_URL}game/admin/active_game`,
        { id_game: idGame, is_active: e.target.checked === true ? 1 : 0 },
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => alert(err));
  };

  const handleUploadPoint = () => {
    const PPData = new FormData();
    PPData.append("excelFile", file);
    axios
      .post(`${process.env.REACT_APP_URL}game/admin/upload_points`, PPData, {
        headers: { Authorization: "Bearer " + token },
      })
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
          <button
            className="btn bg-blue p-1 px-3 text-white mt-3 ms-3"
            onClick={() => setShowUpload(true)}
          >
            Upload Point
          </button>
          <div className="card border-0 shadow-lg m-3 p-4">
            <p className="text-blue fw-bold fs-4">Group Leaderboard</p>
            <table class="table table-bordered rounded rounded-3">
              <thead>
                <tr className="text-center">
                  <th>No.</th>
                  <th>Group</th>
                  <th>Point</th>
                </tr>
              </thead>
              {dataGroupLeaderboard.map((item) => (
                <tbody>
                  <tr>
                    <td className="text-center" width="8%">
                      {item.number}
                    </td>
                    <td>{item.group}</td>
                    <td width="15%">{item.points}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          <div className="card border-0 shadow-lg m-3 p-4">
            <p className="text-blue fw-bold fs-4">Individual Leaderboard</p>
            <table class="table table-bordered rounded rounded-3">
              <thead>
                <tr className="text-center">
                  <th>No.</th>
                  <th>Name</th>
                  <th>Point</th>
                </tr>
              </thead>
              {dataLeaderboard.map((item) => (
                <tbody>
                  <tr>
                    <td className="text-center" width="8%">
                      {item.number}
                    </td>
                    <td>{item.fullname}</td>
                    <td width="15%">{item.points}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          <div className="card border-0 shadow-lg m-3 p-4">
            <p className="text-blue fw-bold fs-4">Select Game</p>
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
            <table class="table table-bordered mt-3 rounded rounded-3">
              <thead>
                <tr className="text-center">
                  <th>No.</th>
                  <th>Name</th>
                  <th>On/Off</th>
                  <th>Action</th>
                </tr>
              </thead>
              {dataGame.map((item) => (
                <tbody>
                  <tr>
                    <td className="text-center" width="8%">
                      {item.number}
                    </td>
                    <td>{item.name}</td>
                    <td className="text-center" width="15%">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        defaultChecked={item.active === 1}
                        onChange={(e) => handleChangeSwitch(e, item.id)}
                      />
                    </td>
                    <td className="fw-lighter text-center" width="15%">
                      <i
                        className="fa fa-circle-info pointer text-secondary"
                        onClick={() =>
                          navigate(`/${item.slug}/${item.id}/${id}`)
                        }
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
        </div>
      )}
      <Modal show={showUpload}>
        <Modal.Body>
          <p className="fs-4 fw-bold text-center mb-3">Upload Point</p>
          <button
            className="btn bg-blue text-white p-1 w-100"
            onClick={() =>
              window.open(`/template_upload_points.xlsx`, "Download")
            }
          >
            Download Template
          </button>
          <input
            type="file"
            name="point"
            className="w-100 mt-2 rounded-3 p-2 border form-control"
            onChange={(e) => {
              e.preventDefault();
              setFile(e.target.files[0]);
            }}
          />
          <div className="d-flex justify-content-center mt-3">
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={handleUploadPoint}
            >
              Submit
            </div>
            <div
              className="btn bg-blue mx-2 text-white px-4"
              onClick={() => setShowUpload(false)}
            >
              Cancel
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ListGame;
