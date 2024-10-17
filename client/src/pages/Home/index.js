import React from "react";
import Search from "../../components/Search"; 
import News from "../../components/News";
import "./Home.scss";
import Button from '../../components/Button/Button'

function Home() {
  return (
    <div className="home">
      <Search />
      <News />
      {/* Các phần khác của trang chủ */}
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h4>Video giới thiệu</h4>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/gDG3lA2XVuE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col-md-6">
            <div class="library-guide">
              <h2>Hướng dẫn sử dụng thư viện FPT</h2>
              <p>
                Chào mừng bạn đến với thư viện Đại học FPT! Dưới đây là hướng
                dẫn chi tiết về cách sử dụng các dịch vụ của thư viện.
              </p>
              {/* <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </p> */}
               <Button text="Xem thêm" link="/rules"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
