import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	Container,
	Row,
	Col,
	Form,
	Button,
	Alert,
	InputGroup,
} from "react-bootstrap";
import { ArrowLeft, PencilSquare } from "react-bootstrap-icons";

function Profile() {
	const navigate = useNavigate();
	const { currentUser, updateprofile, updatepassword } = useAuth();

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState(null);
	const [editingName, setEditingName] = useState(false);
	const [editingPassword, setEditingPassword] = useState(false);

	const [formData, setFormData] = useState({
		name: currentUser.displayName,
		email: currentUser.email,
		password: "",
	});

	const { name, email, password } = formData;

	const handleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError(null);
			setEditingName(false);
			setEditingPassword(false);

			if (editingName && name !== currentUser.displayName) {
				await updateprofile(name, email, password);
				setError({
					type: "success",
					message: "Great, your name has been saved.",
				});
			}

			if (editingPassword && password) {
				await updatepassword(password);
				setError({
					type: "success",
					message: "Great, your password has been saved.",
				});
				setFormData({ password: "" });
			}

			setLoading(false);
		} catch (error) {
			setLoading(false);
			setError({
				type: "danger",
				message: error.message,
			});
			console.log(error);
		}
	};

	return (
		<>
			<Container fluid="md">
				{error && <Alert variant={error.type}>{error.message}</Alert>}
				<Row className="d-flex justify-content-center align-items-center w-100 py-3">
					<Col xs="6">
						<Row>
							<h2 className="text-center mb-3">
								Hello {currentUser && currentUser.displayName}
							</h2>
							<hr className="mb-3" />
						</Row>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="email" className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									value={email}
									onChange={handleChange}
									size="lg"
									readOnly
								/>
							</Form.Group>
							<Form.Group controlId="name" className="mb-3">
								<Form.Label>Name</Form.Label>
								<InputGroup>
									<Form.Control
										type="text"
										value={name}
										onChange={handleChange}
										size="lg"
										readOnly={!editingName}
									/>
									<InputGroup.Text>
										<Button
											variant="link"
											onClick={() => setEditingName(
													(prevState) => !prevState
												)}
											title="Change name"
										>
											<PencilSquare color="#000" />
										</Button>
									</InputGroup.Text>
								</InputGroup>
							</Form.Group>
							<Form.Group controlId="password" className="mb-3">
								<Form.Label>Password</Form.Label>
								<InputGroup>
									<Form.Control
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={handleChange}
										size="lg"
										readOnly={!editingPassword}
									/>
									<InputGroup.Text>
										<Button
											variant="link"
											onClick={() =>
												setEditingPassword(
													(prevState) => !prevState
												)
											}
											title="Change password"
										>
											<PencilSquare color="#000" />
										</Button>
									</InputGroup.Text>
								</InputGroup>
								<Form.Text>
									<Form.Check
										type="checkbox"
										id="togglePassword"
										label="Show password"
										onClick={() =>
											setShowPassword(
												(prevState) => !prevState
											)
										}
									/>
								</Form.Text>
							</Form.Group>
							<div className="align-items-center">
								<Button
									disabled={
										(loading || !(editingName || editingPassword))
									}
									type="submit"
									className="my-3 w-100"
									size="lg"
								>
									{loading ? "Saving..." : "Save Details"}
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
				<div className="w-100 text-center mt-2">
					<Link to="/">
						<ArrowLeft />Back to Main
					</Link>
				</div>
			</Container>
		</>
	);
}

export default Profile;
