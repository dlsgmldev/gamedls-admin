import axios from "axios";
import React, { useEffect, useState } from "react";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useNavigate } from "react-router-dom";

const ListCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataClient, setDataClient] = useState([""]);
  const [totalData, setTotalData] = useState(0);
  const [current, setCurrent] = useState(1);
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

  return (
    <div>
      <div className="card border-0 shadow-lg m-3 p-4">
        <p className="text-blue fw-bold fs-4">Select Company</p>
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
                <td className="fw-lighter align-middle" width="8%">
                  <i class="fa-solid fa-arrow-right pointer text-secondary ms-4" onClick={()=>navigate(`/list-game/${item.id}`)}></i>
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
  );
};

export default ListCompany;
