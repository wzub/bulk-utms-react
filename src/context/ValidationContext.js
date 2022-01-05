import { createContext, useState } from "react";

const ValidationContext = createContext();

export const ValidationProvider = ({ children }) => {
	const [validation, setValidation] = useState({
        type: 'danger',
        message: ["Context", "From"]
    });

    const validateUrl = (url) => {
		// reset before checking again
		setValidation([]);

		let validation = { type: "warning", message: [] },
			utm_source = url.searchParams.get("utm_source"),
			utm_medium = url.searchParams.get("utm_medium"),
			utm_campaign = url.searchParams.get("utm_campaign"),
			utm_content = url.searchParams.get("utm_content");

		if (utm_source === null) {
			validation.type = "danger";
			validation.message.push("utm_source");
		}

		utm_medium === null && validation.message.push("utm_medium");
		utm_campaign === null && validation.message.push("utm_campaign");
		utm_content === null && validation.message.push("utm_content");

		// setValidation(validation.message.join(", "));
		validation.message.length && setValidation(validation);
	};

	return (
		<ValidationContext.Provider value={{ validation, validateUrl }}>
			{children}
		</ValidationContext.Provider>
	);
};

export default ValidationContext;