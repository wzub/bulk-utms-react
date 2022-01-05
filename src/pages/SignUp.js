import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "../firebase-config";
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

function SignUp() {
	const navigate = useNavigate();
	const { signup } = useAuth();

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});

	const { name, email, password } = formData;

	const handleChange = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setFormData((values) => ({ ...values, [id]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setError("");
			setLoading(true);

			/*
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			updateProfile(auth.currentUser, {
				displayName: name,
			});
			*/

			await signup(name, email, password);
			navigate("/");
		} catch (error) {
			setLoading(false);
			setError("Sorry, something went wrong. Please try again.");
			console.log(error);
		}
	};

	return (
		<>
			<Container fluid="md">
				{error && <Alert variant="danger">{error}</Alert>}
				<Row className="d-flex justify-content-center align-items-center w-100 py-3">
					<Col xs="6">
						<h2 className="text-center mb-3">Sign Up</h2>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="name" className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									value={name}
									onChange={handleChange}
									size="lg"
									required
								/>
							</Form.Group>
							<Form.Group controlId="email" className="mb-3">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									value={email}
									onChange={handleChange}
									size="lg"
									required
								/>
							</Form.Group>
							<Form.Group controlId="password" className="mb-3">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={handleChange}
									size="lg"
								/>
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
									disabled={loading}
									type="submit"
									className="my-3 w-100"
									size="lg"
								>
									{loading ? "Signing up..." : "Sign Up"}
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
				<div className="w-100 text-center mt-2">
					<Link to="/signin">Already have an account? Log In</Link>
				</div>
			</Container>
		</>
	);
}

export default SignUp;
