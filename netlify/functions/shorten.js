const axios = require("axios");

exports.handler = async (event, context) => {
	// console.log("event", JSON.stringify(event));
	// console.log("context", JSON.stringify(context));
	console.log("context", JSON.stringify(context));

	// @TODO: only proceed if valid firebase accessToken
	//user = context.clientContext.user,
		
	const body = JSON.parse(event.body),
		{ url } = body.params,
		config = {
			token: process.env.BITLY_TOKEN,
			group_guid: "",
		},
		options = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.token}`,
				"Content-Type": "application/json",
			},
			url: "https://api-ssl.bitly.com/v4/shorten",
			data: JSON.stringify({
				long_url: url,
				domain: "bit.ly",
				tags: ["bulk-utm-builder", "api"],
				group_guid: config.group_guid,
			}),
		};

	return await axios(options)
		.then((response) => {
			return {
				statusCode: 200,
				body: JSON.stringify(response.data.link),
				headers: {
					"Content-Type": "application/json",
				},
			};
		})
		.catch((error) => {
			// console.log(error);
			return {
				statusCode: error.response.status,
				body: `Error ${error.response.status}: ${error.response.statusText}`,
				headers: {
					"Content-Type": "application/json",
				},
			};
		});
};
