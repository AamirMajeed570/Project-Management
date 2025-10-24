import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
    Container,
    Card,
    Button,
    Modal,
    Form,
    Spinner,
    Row,
    Col,
} from "react-bootstrap";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_API_URL!;

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTask, setEditTask] = useState<any>(null);

    const token = localStorage.getItem("token");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // 🧩 Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/task/project/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [id]);

    // ➕ Create Task
    const handleCreateTask = async (data: any) => {
        try {
            await axios.post(`${API_URL}/task/project/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            reset();
            setShowCreateModal(false);
            fetchTasks();
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    // ✏️ Edit Task
    const handleEditClick = (task: any) => {
        setEditTask(task);
        setShowEditModal(true);
    };

    const handleUpdateTask = async (data: any) => {
        try {
            await axios.patch(`${API_URL}/task/${editTask._id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowEditModal(false);
            setEditTask(null);
            reset();
            fetchTasks();
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    // 🗑 Delete Task
    const handleDeleteTask = async (taskId: string) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`${API_URL}/task/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <>
            <Navbar username="user" />
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">Project Tasks</h2>
                    <Button onClick={() => setShowCreateModal(true)}>+ Add Task</Button>
                </div>

                {tasks.length === 0 ? (
                    <p className="text-muted">No tasks available for this project.</p>
                ) : (
                    <Row>
                        {tasks.map((task) => (
                            <Col key={task._id} md={6} lg={4} className="mb-3">
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <Card.Title>{task.title}</Card.Title>
                                                <Card.Subtitle className="text-muted small mb-2">
                                                    {task.status.toUpperCase()} • Due:{" "}
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </Card.Subtitle>
                                                <Card.Text>{task.description}</Card.Text>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleEditClick(task)}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task._id)}
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

                {/* ➕ Create Task Modal */}
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(handleCreateTask)}>
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
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control type="date" {...register("dueDate", { required: true })} />
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
                                    Create Task
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* ✏️ Edit Task Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(handleUpdateTask)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={editTask?.title}
                                    {...register("title")}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    defaultValue={editTask?.description}
                                    {...register("description")}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select defaultValue={editTask?.status} {...register("status")}>
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue={editTask?.dueDate?.split("T")[0]}
                                    {...register("dueDate")}
                                />
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
                                    Update Task
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </>
    );
};

export default ProjectDetails;
