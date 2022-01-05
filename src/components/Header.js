import { Link, useNavigate } from "react-router-dom";
// import { auth } from '../firebase-config'
// import { useAuthStatus } from "../hooks/useAuthStatus";
import { useAuth } from "../context/AuthContext";
import { Row, Col, Button } from "react-bootstrap";
import { PersonFill } from 'react-bootstrap-icons';

const Header = () => {

	const {currentUser, logout, loggedIn} = useAuth();

	// const { loggedIn, currentUser } = useAuthStatus();
	const navigate = useNavigate();

	const onLogout = async () => {
		logout();
		navigate('/signin');
	}

	return (
		<header className="container-md pt-3">
			<div className="pt-md-5">
				<h1 className="display-1">TCF's UTM Builder</h1>
				<p className="lead">
					A simple utility to generate UTM links en masse.
				</p> 

				<span id="name_container">
					{loggedIn && currentUser ? (
						<Row className="align-items-center">
							<Col md="auto">
								<PersonFill className="me-1"></PersonFill>
								<Link to="/profile">{`Hello, ${currentUser.displayName}!`}</Link>
							</Col>
							<Col md="auto" className="ms-md-auto">
								<Button type="submit" variant="link" size="md" className="mx-2" onClick={onLogout}>
									Logout
								</Button>
							</Col>
						</Row>
					) : (
						<Link to="/signin">Sign in</Link>
					)}
				</span>
			</div>
			<hr className="my-2" />
		</header>	
	);
};

export default Header;
