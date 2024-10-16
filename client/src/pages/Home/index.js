import React from 'react';
import Search from '../../components/Search'; // Đảm bảo đường dẫn đúng đến component Search
import News from '../../components/News';
import './Home.scss'

function Home() {
  return (
    <section className="home">
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
            <h4>Hướng dẫn sử dụng thư viện FPT</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
