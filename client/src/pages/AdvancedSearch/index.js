import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdvancedSearch.scss";
import SearchResults from "../../components/SearchResult";

function AdvancedSearch() {
  return (
    <div className="advanced">
      <div className="container advanced-search">
        <div className="advanced-search__container bg-light p-4">
          <form className="container">
            {/* Row 1 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label>Tất cả:</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="từ khóa tìm kiếm"
                />
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option value="and">VÀ</option>
                  <option value="or">HOẶC</option>
                  <option value="not">KHÔNG</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label>Nhan đề:</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="từ khóa tìm kiếm"
                />
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option value="and">VÀ</option>
                  <option value="or">HOẶC</option>
                  <option value="not">KHÔNG</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label>Tác giả:</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="từ khóa tìm kiếm"
                />
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option value="and">VÀ</option>
                  <option value="or">HOẶC</option>
                  <option value="not">KHÔNG</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="row mb-3 align-items-center">
              <div className="col-md-2">
                <label>Môn học:</label>
              </div>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="từ khóa tìm kiếm"
                />
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option value="and">VÀ</option>
                  <option value="or">HOẶC</option>
                  <option value="not">KHÔNG</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="row">
              <div className="col text-center">
                <button className="btn btn-primary px-5">Search</button>
              </div>
            </div>
          </form>
        </div>
        <hr />

        <SearchResults />
      </div>
    </div>
  );
}

export default AdvancedSearch;
