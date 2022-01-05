import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Spinner } from "react-bootstrap";

const PrivateRouter = () => {
	const { currentUser, loggedIn, checkingStatus } = useAuth();

	if (checkingStatus) {
		return (
			<>
				<Container>
					<Row className="text-center">
						<Col>
							<Spinner animation="grow" className="m-5" />
						</Col>
					</Row>
				</Container>
			</>
		);
	}

	return loggedIn ? (
		<Outlet />
	) : (
		<Navigate to="/signin" />
	);
};

export default PrivateRouter;
