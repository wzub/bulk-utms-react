import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";

function ForgotPassword() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

    const { currentUser, updateprofile, updatepassword } = useAuth();
	const [formData, setFormData] = useState({ email: '' });

	const { email } = formData;

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

			await sendPasswordResetEmail(auth, email);

			setError({
				type: "success",
				message:
					"Great, check your email for the link to reset your password",
			});
		} catch (error) {
			setLoading(false);
			setError({
				type: "danger",
				message: "Sorry, something went wrong. Please try again.",
			});
			console.log(error);
		}

		setLoading(false);
	};

	return (
		<>
			<Container>
				{error && <Alert variant={error.type}>{error.message}</Alert>}
				<Row className="d-flex justify-content-center align-items-center w-100 py-3">
					<Col xs="6">
						<h2 className="text-center mb-3">Forgot Password</h2>
						<p className="text-center">
							Enter your email address below to receive a link to
							reset your password.
						</p>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="email">
								<Form.Label>Email</Form.Label>
								<Form.Control
									type="email"
									value={email}
									onChange={handleChange}
									size="lg"
									required
								/>
							</Form.Group>
							<div className="align-items-center">
								<Button
									disabled={loading}
									type="submit"
									className="my-3 w-100"
									size="lg"
								>
									{loading
										? "Sending..."
										: "Send reset email"}
								</Button>
							</div>
						</Form>
					</Col>
				</Row>
				<div className="w-100 text-center mt-2">
					<Link to="/signin">Already have an account? Log In</Link>
				</div>
				<div className="w-100 text-center mt-2">
					<Link to="/signup">Don't have an account? Sign up</Link>
				</div>
			</Container>
		</>
	);
}

export default ForgotPassword;
