import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useParams } from "react-router-dom";

const WOF = () => {
  const [loading, setLoading] = useState(true);
  const [dataReport, setDataReport] = useState([""]);
  const [totalData, setTotalData] = useState(0);
  const [current, setCurrent] = useState(1);
  const [showReset, setShowReset] = useState(false);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const { id2 } = useParams();

  const getData = (pageSize, pageIndex, searchIndex) => {
    axios
      .get(
        `${process.env.REACT_APP_URL}game/admin/report_wof/${pageSize ?? 20}/${
          pageIndex ?? 1
        }/${id2}`,
        {
          headers: { Authorization: "Bearer " + token },
          params: { search: searchIndex },
        }
      )
      .then((res) => {
        setDataReport(res.data.data);
        setTotalData(res.data.totaldata);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    axios
      .post(
        `${process.env.REACT_APP_URL}game/admin/reset_wof`,
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

  return (
    <div>
      {loading === true ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <div className="card border-0 shadow-lg mx-3 my-3 p-4">
            <p className="fs-4 fw-bold mb-2">Watchout Forest</p>
            <button
              className="btn bg-blue p-1 w-25 text-white"
              onClick={() => setShowReset(true)}
            >
              Reset Game
            </button>
            <table class="table mt-3">
              <thead>
                <tr>
                  <th className="text-center">No.</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Duration</th>
                  <th>Time Submitted</th>
                </tr>
              </thead>
              <tbody>
                {dataReport.map((item) => (
                  <tr>
                    <td className="text-center" width="8%">
                      {item.number}
                    </td>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                    <td>{item.duration}</td>
                    <td>{item.timecreated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <PaginationControl
              page={current}
              total={totalData}
              limit={10}
              changePage={(page, size) => {
                getData(size, page);
                setCurrent(page);
              }}
            /> */}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default WOF;
