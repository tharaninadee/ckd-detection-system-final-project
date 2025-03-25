import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const GeneralInfo = () => {
  const [info, setInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingInfo, setEditingInfo] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    // Filter info based on title or content
    const filtered = info.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInfo(filtered);
  }, [searchQuery, info]);

  const fetchInfo = async () => {
    try {
      const res = await axios.get('/admin/general-info');
      setInfo(res.data);
      setFilteredInfo(res.data); // Initialize filtered info
    } catch (error) {
      setError('Failed to fetch info');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      setError('Title and Content are required.');
      return;
    }

    try {
      if (editingInfo) {
        await axios.put(`/admin/general-info/${editingInfo.id}`, formData);
        setSuccess('Info updated successfully!');
      } else {
        await axios.post('/admin/general-info', formData);
        setSuccess('Info added successfully!');
      }
      fetchInfo();
      setShowModal(false);
      setFormData({ title: '', content: '' });
      setEditingInfo(null);
    } catch (error) {
      setError('An error occurred while saving. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this info?')) {
      try {
        await axios.delete(`/admin/general-info/${id}`);
        setSuccess('Info deleted successfully!');
        fetchInfo();
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
        <h2>General Information Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add New Info
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
          placeholder="Search by title or content"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Info Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInfo.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setEditingInfo(item);
                    setFormData({ title: item.title, content: item.content });
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
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
            {editingInfo ? 'Edit Information' : 'Add New Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
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

export default GeneralInfo;