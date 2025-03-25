// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    ckd_cases: 0, 
    non_ckd_cases: 0,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get('/admin/statistics');
        const usersRes = await axios.get('/admin/users');
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Pie Chart Data
  const pieData = [
    { name: 'Predicted CKD', value: stats.ckd_cases },
    { name: 'Predicted Non-CKD', value: stats.non_ckd_cases },
  ];

  // Pie Chart Colors
  const COLORS = ['#8884d8', '#82ca9d'];

  return (
    <div className="mt-4" style={{ marginLeft: '250px', padding: '20px' }}>
      <h2>Dashboard</h2>

      {/* Summary Boxes */}
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Predicted CKD</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.ckd_cases}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Predicted Non-CKD</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats.non_ckd_cases}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {users.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Case Distribution Chart */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Case Distribution</Card.Title>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart width={600} height={400}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;