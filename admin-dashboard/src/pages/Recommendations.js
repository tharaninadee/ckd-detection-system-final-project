import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    stage: '',
    egfr_range_low: '',
    egfr_range_high: '',
    lifestyle_advice: '',
    food_advice: '',
    medical_advice: ''
  });
  const [editingRec, setEditingRec] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  useEffect(() => {
    // Filter recommendations based on stage or advice
    const filtered = recommendations.filter(
      (rec) =>
        rec.stage.toString().includes(searchQuery) ||
        rec.lifestyle_advice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.food_advice.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.medical_advice.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecommendations(filtered);
  }, [searchQuery, recommendations]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get('/admin/recommendations');
      setRecommendations(res.data);
      setFilteredRecommendations(res.data); // Initialize filtered recommendations
    } catch (error) {
      setError('Failed to fetch recommendations');
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.stage ||
      !formData.egfr_range_low ||
      !formData.egfr_range_high ||
      !formData.lifestyle_advice ||
      !formData.food_advice ||
      !formData.medical_advice
    ) {
      setError('All fields are required.');
      return;
    }

    try {
      if (editingRec) {
        await axios.put(`/admin/recommendations/${editingRec.id}`, formData);
        setSuccess('Recommendation updated successfully!');
      } else {
        await axios.post('/admin/recommendations', formData);
        setSuccess('Recommendation added successfully!');
      }
      fetchRecommendations();
      setShowModal(false);
      setFormData({
        stage: '',
        egfr_range_low: '',
        egfr_range_high: '',
        lifestyle_advice: '',
        food_advice: '',
        medical_advice: ''
      });
      setEditingRec(null);
    } catch (error) {
      setError('An error occurred while saving. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      try {
        await axios.delete(`/admin/recommendations/${id}`);
        setSuccess('Recommendation deleted successfully!');
        fetchRecommendations();
      } catch (error) {
        setError('An error occurred while deleting. Please try again.');
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mt-4" style={{ marginLeft: '250px', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recommendation Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Recommendation
        </Button>
      </div>

      {/* Alerts for success and error messages */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      {/* Search Filter */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by stage or advice"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Recommendations Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Stage</th>
            <th>eGFR Range</th>
            <th>Lifestyle Advice</th>
            <th>Food Advice</th>
            <th>Medical Advice</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecommendations.map((rec) => (
            <tr key={rec.id}>
              <td>{rec.stage}</td>
              <td>
                {rec.egfr_range_low} - {rec.egfr_range_high}
              </td>
              <td>{rec.lifestyle_advice}</td>
              <td>{rec.food_advice}</td>
              <td>{rec.medical_advice}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditingRec(rec);
                    setFormData({
                      stage: rec.stage,
                      egfr_range_low: rec.egfr_range_low,
                      egfr_range_high: rec.egfr_range_high,
                      lifestyle_advice: rec.lifestyle_advice,
                      food_advice: rec.food_advice,
                      medical_advice: rec.medical_advice
                    });
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(rec.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingRec ? 'Edit Recommendation' : 'Add New Recommendation'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Stage</Form.Label>
              <Form.Control
                type="number"
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>eGFR Range Low</Form.Label>
              <Form.Control
                type="number"
                value={formData.egfr_range_low}
                onChange={(e) =>
                  setFormData({ ...formData, egfr_range_low: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>eGFR Range High</Form.Label>
              <Form.Control
                type="number"
                value={formData.egfr_range_high}
                onChange={(e) =>
                  setFormData({ ...formData, egfr_range_high: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lifestyle Advice</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.lifestyle_advice}
                onChange={(e) =>
                  setFormData({ ...formData, lifestyle_advice: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Food Advice</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.food_advice}
                onChange={(e) =>
                  setFormData({ ...formData, food_advice: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medical Advice</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.medical_advice}
                onChange={(e) =>
                  setFormData({ ...formData, medical_advice: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Recommendations;