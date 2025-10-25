import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/authContext";
import { Container, Card, Table, Spinner, Alert, Button, Row, Col } from "react-bootstrap";

const Dashboard = ({handleSOS}) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
};

        const { data } = await axios.get(`${api_url}/api/reports`, config);
        setReports(data);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to fetch reports. " + error.message);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
    <Container className="mt-5">
      <Card className="shadow-lg border-0 box">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col>
              <h1 style={{color: "#721a06ff"}} className="text-center">Dashboard</h1>
              <h3 className="text-muted">
                Welcome back, <strong>{user?.name}</strong>
              </h3>
              <Button as={Link} to="/report/user" className="btn-style gradient-text">
               🚨 Report Now
              </Button>
            </Col>
          </Row>

          <div className="mt-4">
            <h2 className="text-secondary text-center">Recent Reports</h2>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : reports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">You haven't submitted any reports yet.</p>
                <Button as={Link} to="/report/user" className="btn btn-style gradient-text mt-3">
                  Submit Your First Report
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover responsive className="text-center">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>Title</th>
                      <th>Incident Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.title}</td>
                        <td>{report.incidentType}</td>
                        <td>
                          <span
                            className={`badge ${
                              report.status === "Resolved" ? "bg-success" :
                              report.status === "Pending" ? "bg-warning" : "bg-info"
                            }`}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button as={Link} to={`/report/${report._id}`} className="btn-style gradient-text" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
      <br /><br />
      <br /><br />
    </Container>
    </div>
  );
};

export default Dashboard;
