import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AuthContext from "./context/authContext";
import { useContext, useState, useEffect } from "react";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout(navigate);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeNavbar() {
    const navbar = document.getElementById("basic-navbar-nav");
    if (navbar?.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, { toggle: true });
      bsCollapse.hide();
    }
  }

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="shadow-sm px-3"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
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
          className="fw-bold d-flex align-items-center me-auto ms-5"
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
              backgroundColor: "transparent",
            }}
          >
            JATAYU
          </span>
        </Navbar.Brand>

        {/* Toggle button */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        {/* Collapsible Menu */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
          style={{
            backgroundColor: "transparent",
            backdropFilter: "blur(8px)",
            borderRadius: "0.5rem",
          }}
        >
          <Nav className="ms-auto text-uppercase fs-5 d-flex align-items-center me-5">
            <div className="d-flex flex-column flex-lg-row me-4">
              <Nav.Link as={Link} to="/" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                Home
              </Nav.Link>

              {user ? (
                <>
                  <Nav.Link as={Link} to="/dashboard/user" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/report/user" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Report Crime
                  </Nav.Link>
                  <Nav.Link as={Link} to="/map/user" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Map
                  </Nav.Link>
                  <Nav.Link as={Link} to="/alert/user" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Alert
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="fw-semibold px-3 navHover" onClick={closeNavbar}>
                    Register
                  </Nav.Link>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            {user && (
              <NavDropdown
                align="end"
                id="user-nav-dropdown"
                title={
                  <div className="user-profile-trigger d-flex align-items-center px-3 py-2 rounded-pill">
                    <i className="bi bi-person me-2"></i>
                    <span className="fw-bold">{`Hello, ${user.name}`}</span>
                  </div>
                }
              >
                <NavDropdown.Item as={Link} to="/profile/user" className="navHover" onClick={closeNavbar}>
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
