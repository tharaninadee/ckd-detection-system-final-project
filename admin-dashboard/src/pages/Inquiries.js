// src/pages/Inquiries.js
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    // Filter inquiries based on user_id
    const filtered = inquiries.filter(inquiry =>
      inquiry.user_id.toString().includes(searchQuery)
    );
    setFilteredInquiries(filtered);
  }, [searchQuery, inquiries]);

  const fetchInquiries = async () => {
    try {
      const res = await axios.get('/admin/inquiries');
      setInquiries(res.data);
      setFilteredInquiries(res.data); // Initialize filtered inquiries
    } catch (error) {
      setError('Failed to fetch inquiries');
    }
  };

  const handleReply = async () => {
    try {
      await axios.post(`/admin/reply-inquiry/${selectedInquiry.id}`, { response });
      setSuccess('Reply sent successfully');
      fetchInquiries();
      setShowReplyModal(false);
      setResponse('');
    } catch (error) {
      setError('Failed to send reply');
    }
  };

  const handleDelete = async (inquiryId) => {
    try {
      await axios.delete(`/admin/inquiries/${inquiryId}`);
      setSuccess('Inquiry deleted successfully');
      fetchInquiries();
    } catch (error) {
      setError('Failed to delete inquiry');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mt-4" style={{ marginLeft: '250px', padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inquiry Management</h2>
      </div>

      {/* Alerts for success and error messages */}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Search Filter */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by User ID"
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      {/* Inquiries Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Message</th>
            <th>Response</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInquiries.map(inquiry => (
            <tr key={inquiry.id}>
              <td>{inquiry.user_id}</td>
              <td>{inquiry.message}</td>
              <td>{inquiry.response || 'No response yet'}</td>
              <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setShowReplyModal(true);
                  }}
                >
                  {inquiry.response ? 'Edit Response' : 'Reply'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(inquiry.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Inquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Original Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={selectedInquiry?.message || ''}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Your Response</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Send Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Inquiries;