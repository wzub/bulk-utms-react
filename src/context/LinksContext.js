import { createContext, useState } from "react";

const LinksContext = createContext();

export const LinksProvider = ({ children }) => {
	const [links, setLinks] = useState({});

	return (
		<LinksContext.Provider value={{ links }}>
			{children}
		</LinksContext.Provider>
	);
};

export default LinksContext;
