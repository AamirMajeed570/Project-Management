import React, { useEffect, useState } from "react";
import { Pagination, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { Card, Button, Container, Modal, Form, Spinner, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState<any>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; variant: "success" | "danger" }>({
    show: false,
    message: "",
    variant: "success",
  });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const showToast = (message: string, variant: "success" | "danger" = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ ...toast, show: false }), 3000); // auto-hide after 3s
  };
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? p.status === statusFilter : true)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Calculate displayed projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 🧩 Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/project`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusFilter,
          search: searchTerm,
          page: currentPage,
          limit: projectsPerPage,
        },
      });
      setProjects(res.data.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, currentPage]);

  // ➕ Create Project
  const handleCreateProject = async (data: any) => {
    try {
      await axios.post(`${API_URL}/project/create`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      reset();
      setShowCreateModal(false);
      fetchProjects();
      showToast("Project created successfully!", "success");
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  // ✏️ Edit Project
  const handleEditClick = (project: any) => {
    setEditProject(project);
    setShowEditModal(true);
    showToast("Project updated successfully!", "success");
  };

  const handleUpdateProject = async (data: any) => {
    try {
      await axios.patch(`${API_URL}/project/${editProject._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false);
      setEditProject(null);
      reset();
      fetchProjects();
      showToast("Project updated successfully!", "success");
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  // 🗑 Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_URL}/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
      showToast("Project Deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };
  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/project`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm,  // backend will filter by title
          page: 1,             // start from first page
          limit: projectsPerPage,
        },
      });
      setProjects(res.data.data || []);
      // setTotalPages(res.data.totalPages || 1);
      setCurrentPage(1); // reset pagination
    } catch (err) {
      console.error("Error searching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );

  return (
    <>
      <Navbar username={user?.name || "User"} />
      <Container fluid className="py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Welcome, {user?.name || "User"} 👋</h2>
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => setShowCreateModal(true)}
            >
              + New Project
            </Button>
            {/* <Button
              variant="outline-danger"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </Button> */}
          </div>
        </div>
        <div className="py-4 d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div className="d-flex gap-2 flex-column flex-sm-row">
            <Form.Control
              type="text"
              placeholder="Search by project title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </div>
          <Button
            variant="outline-light"
            onClick={() => setShowCreateModal(true)}
          >
            + New Project
          </Button>
        </div>
        {/* Projects List */}
        {projects.length === 0 ? (
          <p className="text-muted">No projects found. Create one to get started!</p>
        ) : (
          <Row>
            {projects.map((project) => (
              <Col md={6} lg={4} key={project._id} className="mb-3">
                <Card
                  className="shadow-sm h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{project.title}</Card.Title>
                        <Card.Subtitle className="text-muted small mb-2">
                          {project.status?.toUpperCase()} •{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </Card.Subtitle>
                        <Card.Text>{project.description}</Card.Text>
                      </div>
                      <div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(project);
                          }}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project._id);
                          }}
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* ➕ Create Project Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(handleCreateProject)}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title?.message as string}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register("description", { required: "Description is required" })}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message as string}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select {...register("status", { required: true })}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Create Project
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* ✏️ Edit Project Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit(handleUpdateProject)}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={editProject?.title}
                  {...register("title")}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={editProject?.description}
                  {...register("description")}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select defaultValue={editProject?.status} {...register("status")}>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                  className="me-2"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Project
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <ToastContainer position="top-end" className="p-3">
          <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide>
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={currentPage === idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>

      </Container>
    </>
  );
};

export default Dashboard;
