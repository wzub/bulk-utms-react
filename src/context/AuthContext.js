import { createContext, useContext, useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile,
	updatePassword,
} from "firebase/auth";
import { auth } from "../firebase-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);
	const [checkingStatus, setCheckingStatus] = useState(true);

	const signup = async (name, email, password) => {
		const newUser = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		updateProfile(auth.currentUser, {
			displayName: name,
		});

		setCurrentUser(auth.currentUser);
		return newUser;
	};

	const login = async (email, password) => {
		return await signInWithEmailAndPassword(auth, email, password);
	};

	const logout = async () => {
		setCurrentUser(null);
		setLoggedIn(false);
		return await signOut(auth);
	};


	const updateprofile = async (name) => {
		return await updateProfile(auth.currentUser, {
			displayName: name,
		});
	};

	const updatepassword = async (newPassword) => {
		return await updatePassword(auth.currentUser, newPassword)
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				setCurrentUser(currentUser);
				setLoggedIn(true);
			}
			setCheckingStatus(false);
		});
		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				signup,
				login,
				logout,
				updateprofile,
				updatepassword,
				loggedIn,
				checkingStatus,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthContext;
