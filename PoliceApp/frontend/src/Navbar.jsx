import React, { useContext,useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AuthContext from "./context/authContext";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { police } = useContext(AuthContext);
   const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout(navigate);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="shadow-sm px-3"
      style={{
        backgroundColor:"transparent",
        backdropFilter: "blur(8px)",
        transition: "background-color 0.3s ease, height 0.3s ease",
        height: scrolled ? "4rem" : "5rem",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
      }}
    >
      <Container fluid className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center me-auto"
          style={{ marginLeft: "6.5rem"}}
        >
          <img
            width={scrolled ? "40" : "50"}
            height={scrolled ? "40" : "50"}
            className="me-2 rounded-circle border border-dark p-1"
            src="/assets/logo.png"
            alt="Logo"
            style={{ transition: "all 0.3s ease" }}
          />
          <span
            className="fw-bold"
            style={{
              fontSize: scrolled ? "1.5rem" : "1.8rem",
              color: "#721a06ff",
              transition: "font-size 0.3s ease",
              backgroundColor:"transparent",
            }}
          >
            JATAYU
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

         <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end"
          style={{
          backgroundColor:"transparent",
          backdropFilter: "blur(8px)",
          borderRadius: "0.5rem",
            }}>
          <Nav className="ms-auto text-uppercase fs-5 d-flex align-items-center me-5">
            <div className="d-flex flex-column flex-lg-row me-4">
              <Nav.Link as={Link} to="/" className="fw-semibold px-4 navHover">
                Home
              </Nav.Link>

            {police ? (
              <>
                <Nav.Link as={Link} to="/report/police" className="fw-semibold px-4 navHover">Reports</Nav.Link>

                <Nav.Link as={Link} to="/alert/send" className="fw-semibold px-4 navHover">Alert</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold px-4 navHover">Login</Nav.Link>

                <Nav.Link as={Link} to="/register" className="fw-semibold px-4 navHover">Register</Nav.Link>
              </>
            )}
            </div>

            {police && (
              <NavDropdown
                align="end"
                id="user-nav-dropdown"
                title={
                  <div className="user-profile-trigger d-flex align-items-center px-3 py-2 rounded-pill">
                    <i className="bi bi-person me-2"></i>
                    <span className="fw-bold">{`Hello, ${police?.StationName}`}</span>
                  </div>
                }
              >
                <NavDropdown.Item as={Link} to="/profile/police" className="navHover">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout} className="navHover">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
