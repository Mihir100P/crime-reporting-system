import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Typewriter from "typewriter-effect";


const Home = ({handleSOS}) => {

  return (
    <div>
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>

      <section className="text-white py-5 text-center home-container">
        <Container>
          <h1 className="display-4 fw-bold gradient-text pb-3">
            Report Crime. Stay Safe.
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
                    <h5 className="card-title">Report Crime</h5>
                    <p className="card-text">Report a crime online with detailed information and supporting evidence. Jatayu ensures your report is securely submitted to the authorities for prompt action.</p>
                    <Button
                      as={Link}
                      to="/report/user"
                      size="lg"
                      className="me-md-3 mb-3 mb-md-0 btn-style gradient-text" 
                    >
                      Report Incident
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-sm-0">
                <div className="card h-100 shadow btn-card">
                  <div className="card-body">
                    <h5 className="card-title">Nearest Alerts</h5>
                    <p className="card-text">Stay informed about crimes and emergency situations happening around you. Get real-time alerts based on your location to stay safe and aware.</p>
                    <Button
                      as={Link}
                      to="/alert/user"
                      size="lg"
                      className="me-md-3 mb-3 mb-md-0 btn-style gradient-text"
                    >
                      Nearest Alerts
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-sm-0 mt-4">
                <div className="card h-100 shadow btn-card">
                  <div className="card-body">
                    <h5 className="card-title">Locate Service</h5>
                    <p className="card-text">Find the nearest police stations, hospitals, and emergency services instantly. Jatayu helps you connect with the right support when every second matters.</p>
                    <Button
                    as={Link}
                    to="/map/user"
                    size="lg"
                    className="me-md-3 mb-3 mb-md-0 btn-style gradient-text"
                  >
                    Locate Services
                  </Button>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 mb-3 mb-sm-0 mt-4">
                <div className="card h-100 shadow btn-card">
                  <div className="card-body">
                    <h5 className="card-title">Join as Community Member</h5>
                    <p className="card-text">Be part of a responsible community working towards safety. Share experiences, raise awareness, and collaborate to make neighborhoods safer for everyone.</p>
                    <Button
                      as={Link}
                      to="/join/user"
                      size="lg"
                      className="me-md-3 mb-3 mb-md-0 btn-style gradient-text"
                    >
                      Join Community
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

   {/* Features Section */}
<section className="py-5 bg-light">
  <Container>
    <div className="text-center mb-5">
      <h2 className="fw-bold">Features</h2>
      <p className="text-muted">
        Our platform provides comprehensive tools to ensure your safety
        and quick response.
      </p>
    </div>

    {/* Row with proper spacing (3 cards per row) */}
    <Row className="g-4">
      {[
        {
          img: "../assets/real-time-reporting.png",
          title: "Real-time Reporting",
          text: "Report incidents in real-time with photo and video evidence.",
        },
        {
          img: "../assets/location-tracking.png",
          title: "Location Tracking",
          text: "Find nearest police stations and get directions.",
        },
        {
          img: "../assets/SafetyAlerts.png",
          title: "Safety Alerts",
          text: "Receive real-time alerts about incidents in your area.",
        },
        {
          img: "../assets/privacy.png",
          title: "Privacy",
          text: "Jatayu ensures the security of users data.",
        },
        {
          img: "../assets/EmergencySoS.png",
          title: "Emergency SOS",
          text: "Jatayu provides Emergency Aid in case of danger.",
        },
        {
          img: "../assets/emergency-directory.png",
          title: "Emergency Directory",
          text: "Quick access to emergency services contact information.",
        },
      ].map((feature, index) => (
        <Col key={index} md={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="img-fluid icons"
                />
              </div>
              <h5 className="fw-bold">{feature.title}</h5>
              <p className="text-muted">{feature.text}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>


    </div>
  );
};

export default Home;