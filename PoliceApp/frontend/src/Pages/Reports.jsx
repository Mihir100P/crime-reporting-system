import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/authContext";
import { Container, Card, Table, Spinner, Alert, Button, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { police } = useContext(AuthContext);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
};

        const { data } = await axios.get("http://localhost:5001/api/reports", config);
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
    <Container className="mt-5">
      <Card className="shadow-lg border-0 box">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col>
              <h1 style={{color: "#721a06ff"}} className="text-center">Reports</h1>
              <h3 className="text-muted">
                Welcome back, <strong>{police?.StationName}</strong>
              </h3>
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
                <p className="text-muted">No reports found!</p>
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
                      <th>Locate user</th>
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
