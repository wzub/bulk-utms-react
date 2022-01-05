import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
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
import { PersonFill } from "react-bootstrap-icons";

function SignIn() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const { email, password } = formData;

	const navigate = useNavigate();
	const { login } = useAuth();

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
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			*/

			const userCredential = await login(email, password);
			if (userCredential.user) navigate("/");
		} catch (error) {
			setError(
				"Incorrect username or password. Please try again or reset your password."
			);
			setLoading(false);
			console.log(error);
		}

		// setLoading(false);
	};

	return (
		<Container fluid="md">
			{error && <Alert variant="danger">{error}</Alert>}
			<Row className="d-flex justify-content-center align-items-center w-100 py-3">
				<Col xs="6">
					<h2 className="text-center mb-3">Welcome Back!</h2>
					<p className="text-center">
						Enter your email address and password to continue
					</p>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="email" className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								size="lg"
								type="email"
								value={email}
								onChange={handleChange}
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
								<PersonFill />
								{loading ? "Logging in..." : "Log in"}
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
			<div className="w-100 text-center mt-2">
				<Link to="/forgot">Forgot password?</Link>
			</div>
			<div className="w-100 text-center mt-2">
				<Link to="/signup">Don't have an account? Sign up</Link>
			</div>
		</Container>
	);
}

export default SignIn;
