import React from "react";
import "./Home.css";
import TopBar from "../../components/topbar/index";
import Sidebar from "../../components/SideBar/index";
import ForoCard from "../../components/ForoCard/index";
import SearchBar from "../../components/SearchBar/index";
import ButtonPublicar from "../../components/ButtonPublicar/index";

const Home = () => {
  const foros = [1, 2, 3]; // simulado

  return (
    <div className="home-container">
      <TopBar />
      <div className="home-content">
        <Sidebar />
        <div className="foro-section">
          <div className="foro-header">
            <SearchBar />
            <ButtonPublicar />
          </div>

          <div className="foro-list">
            {foros.map((f, i) => (
              <ForoCard key={i} foro={f} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
