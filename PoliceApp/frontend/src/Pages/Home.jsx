import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Typewriter from "typewriter-effect";

const Home = () => {
  return (
    <section className="text-white py-5 text-center home-container">
        <Container>
          <h1 className="display-4 fw-bold gradient-text pb-3">
            Protect Community, Resolve Cases.
          </h1>
          <h1
            className="fw-bold text-center"
            style={{
              fontSize: "3rem",
              textShadow: "2px 2px 6px rgba(255, 255, 255, 0.3)",
              marginBottom: "1rem",
              color: "black",
            }}
          >
            <Typewriter
              options={{
                strings: [
                  "Be someone's JATAYU, and there will be JATAYU for you.",
                ],
                autoStart: true,
                loop: true,
                delay: 60,
                deleteSpeed: 30,
              }}
            />
          </h1>
          {/* about jatayu */}
          <div className="text-black">
            <h3>What exactly Jatayu do?</h3>
            <p>
            Jatayu is a platform that enables citizens to report crimes, receive emergency alerts, and access safety resources in a quick, secure, and transparent manner. It addresses the limitations of traditional crime reporting methods by offering a web-based digital solution that is easy to use, accessible from anywhere, and capable of providing real-time updates. The platform not only empowers users with features such as anonymous reporting, SOS alerts with live geolocation, and complaint tracking, but also helps law enforcement agencies with efficient case management and improved response times. By combining accessibility, transparency, and security, Jatayu contributes to building a safer, smarter, and more connected community.</p>
            </div> 

             {/* btn card */}
          <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center">
            <div className="row">
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card h-100 shadow btn-card">
                  <div className="card-body">
                    <h5 className="card-title">Check Reports</h5>
                    <p className="card-text">Access submitted crime reports and monitor incident from citizens with attached evidence and locations for quick response.</p>
                    <Button
                      as={Link}
                      to="/report/police"
                      size="lg"
                      className="me-md-3 mb-3 mb-md-0 btn-style gradient-text" 
                    >
                      Reports
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card h-100 shadow btn-card">
                  <div className="card-body">
                    <h5 className="card-title">Send Alerts</h5>
                    <p className="card-text">Notify citizens about real-time emergencies, crimes, safety updates and warnings with nearby users based on location.</p>
                    <Button
                      as={Link}
                      to="/alert/send"
                      size="lg"
                      className="me-md-3 mb-3 mb-md-0 btn-style gradient-text"
                    >
                      Alerts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
  );
};

export default Home;
