import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
} from "react-router-dom";
import { auth } from "./firebase-config";
import { AuthProvider } from "./context/AuthContext";
import { LinksProvider } from "./context/LinksContext";
import { ValidationProvider } from "./context/ValidationContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Form from "./components/Form";
import Table from "./components/Table";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Download, InfoCircle, InfoCircleFill } from "react-bootstrap-icons";

function App() {
	const blankInputs = {
		url: "",
		utm_source: "",
		utm_medium: "",
		utm_campaign: "",
		utm_content: "",
		utm_term: "",
		email: "",
		password: "",
	};

	const [links, setLinks] = useState([]);
	const [inputs, setInputs] = useState(blankInputs);
	const [validation, setValidation] = useState([]);
	const [formChanged, setFormChanged] = useState(false);
	const [currentUser, setCurrentUser] = useState({});

	useEffect(() => {
		setCurrentUser(auth.currentUser);
	}, []);

	// handle state of form inputs
	const inputsChange = (e) => {
		const id = e.target.id;
		const value = e.target.value;
		setInputs((values) => ({ ...values, [id]: value }));
		setFormChanged(true);
	};

	const resetForm = (e) => {
		// setSites([]);
		setLinks([]);
		setInputs(blankInputs);
		setFormChanged(false);

		e.target.form.classList.remove("was-validated");
		e.target.form.reset();
	};

	const generateUrl = (formData) => {
		try {
			let url = formData.url,
				params = formData.params,
				selected_sites = formData.selected_sites,
				utms = {},
				// generated_sites = [],
				generated_links = {};

			// make url a URL obj
			url = new URL(url);

			// always ensure https://
			url.protocol = "https:";

			// utm_source is always required
			if ("utm_custom" in params && params.utm_custom.source === "") {
				throw new ReferenceError("custom utm_source is required");
			}

			Object.assign(utms, selected_sites);

			// get each selected_site
			// prettier-ignore
			for (let [selected_sites_key, selected_sites_value] of Object.entries(utms)) {
					// set entered pathname on each selected site
					selected_sites_value.pathname = url.pathname;
					selected_sites_value.hash = url.hash;
					
					// get each selected param
					for (let [params_key, params_value] of Object.entries(params)) {
						// create URLs for each params in each selected site using path from url and base of each selected_sites
						utms[selected_sites_key][params_key] = new URL(
							url.pathname,
							selected_sites_value.origin
					);
					
					// create URLSearchParams of each param
					utms[selected_sites_key][params_key].search =
					new URLSearchParams(params_value);
					utms[selected_sites_key][params_key].hash = url.hash;
				}
			}

			for (let site of Object.values(utms)) {
				// html friendly ID without .
				// pre#tcf_org_pk_utm_facebook
				let site_html_id = site.hostname.replace(/\./g, "_");

				/*
				generated_sites.push({
					"site": site.hostname,
					"link": site.href, 
					"html_id": site_html_id,
				});
				*/

				// ready second level of the object
				// generated_links[tcf.org.pk][utm_facebook]
				generated_links[site.hostname] = { link: site.href };

				for (let [source, values] of Object.entries(params)) {
					// console.log("url", site[source].href);
					// console.log("icon", values.icon);

					// console.group("params");
					// console.log(Object.entries(params));
					// console.groupEnd();

					// @TODO: sort for readability
					site[source].searchParams.delete("icon");
					// site[source].searchParams.sort();

					let newLink = {
						utm_source: values.utm_source,
						utm_url: site[source].href,
						html_id: `${site_html_id}_${source}`,
						icon: values.icon,
						validation: validateUrl(site[source]),
					};

					// console.log(site.hostname[source]);
					// generated_links[site] = newLink;

					generated_links[site.hostname][source] = newLink;
				}
			}

			setLinks(generated_links);
			setFormChanged(false);
		} catch (e) {
			console.log(e);
		}
	};

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

	// @Calumah via https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
	const downloadCsv = (button) => {
		console.log("Download button clicked", button);

		let rows = document.querySelectorAll("table.utm_table tr"),
			csv = [];

		// loop through all tr
		for (var i = 0; i < rows.length; i++) {
			// for each row get source and links inside pre
			let row = [],
				cols = rows[i].querySelectorAll("th, td pre");

			// loop through columns
			for (var j = 0; j < cols.length; j++) {
				// get and clean text of each th, td pre
				// remove multiple spaces and jumpline (break csv)
				// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
				let data = cols[j].innerText
					.replace(/(\r\n|\n|\r)/gm, "")
					.replace(/(\s\s)/gm, " ")
					.replace(/"/g, '""');

				row.push('"' + data + '"');
			}
			csv.push(row.join(","));
		}

		// convert csv to a set and back again to remove duplicate table headers
		let csv_deduped = Array.from(new Set(csv)),
			csv_string = csv_deduped.join("\n"),
			filename = "utms_" + new Date().toLocaleDateString() + ".csv",
			link = document.createElement("a");

		link.style.display = "none";
		link.setAttribute("target", "_blank");
		link.setAttribute(
			"href",
			"data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
		);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const makeShortUrl = async (e) => {
		const button = e.currentTarget,
			// button_icon = e.currentTarget.querySelector("i"),
			button_text = e.currentTarget.querySelector("span"),
			shortlink_for = button.dataset.for,
			url_display = document.querySelector(`pre#${shortlink_for} > code`),
			shorturl_display = document.querySelector(
				`pre#${shortlink_for}_shortlink code`
			),
			options = {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${auth.currentUser.accessToken}`,
					"Content-Type": "application/json",
				},
				url: "/.netlify/functions/shorten",
				data: JSON.stringify({
					url: url_display.textContent,
				}),
			};

		// button_icon.classList.add("spinner-border", "spinner-border-sm");
		// button_icon.classList.remove("bi-lightning-charge-fill");
		button_text.textContent = "Making...";

		await axios(options).then((response) => {
			if (response.status === 200) {
				button_text.textContent = "Make";
				shorturl_display.textContent = response.data;
			} else {
				button_text.textContent = "Retry";
				return Promise.reject(response.status);
			}
		})
		.catch((error) => {
			button_text.textContent = "Retry";
			console.log("error", error);
		});
	};

	const handleLogout = async (e) => {
		setCurrentUser(null);
		await auth.signOut();
		console.log("logging out");
	};

	return (
		<div className="App">
			<Router>
				<AuthProvider>
					<Header />
					<Routes>
						<Route path="/signup" element={<SignUp />} />
						<Route path="/signin" element={<SignIn />} />
						<Route path="/forgot" element={<ForgotPassword />} />
						<Route element={<PrivateRoute />}>
							<Route path="/profile" element={<Profile />} />
						</Route>
						<Route element={<PrivateRoute />}>
							<Route
								exact
								path="/"
								element={
									<>
										<Form
											inputs={inputs}
											onChange={inputsChange}
											onGenerate={generateUrl}
											onReset={resetForm}
											onDownload={downloadCsv}
										/>
										<Container
											fluid="md"
											id="utm_container"
											className="my-md-3"
										>
											<div
												id="utm_display"
												className="display bg-light border my-2 p-md-5 p-3"
											>
												<Row>
													{Object.keys(links).length >
													0 ? (
														<>
															<Col
																md="auto"
																className="me-auto"
															>
																<h2 className="display-6 me-auto">
																	Generated
																	UTM links
																</h2>
															</Col>
															<Col
																md="auto"
																className="d-flex align-items-center"
															>
																<Button
																	type="submit"
																	className="col-md-auto"
																	variant="outline-secondary"
																	id="download_csv"
																	aria-label="Download CSV"
																	onClick={
																		downloadCsv
																	}
																>
																	<Download />{" "}
																	Download CSV
																</Button>
															</Col>
															<hr className="my-4" />
															{formChanged ? (
																<p id="form_edited_notice">
																	<InfoCircle className="me-1" />{" "}
																	Form has
																	changed.
																	Click{" "}
																	<code>
																		Generate
																	</code>{" "}
																	to refresh
																	the table
																	below.
																</p>
															) : null}
														</>
													) : (
														<Row
															id="default_notice"
															className="align-items-center"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="46"
																height="46"
																fill="lightgray"
																className="bi bi-table d-block"
																viewBox="0 0 16 16"
															>
																<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
															</svg>
															<p
																id="default_notice"
																className="text-center text-black-50 mt-md-3"
															>
																Click Generate
																to build some
																URLs.
															</p>
														</Row>
													)}
													<Container id="utm_table_container">
														<LinksProvider>
															<ValidationProvider>
																<Table
																	onShorten={
																		makeShortUrl
																	}
																	validation={
																		validation
																	}
																	links={
																		links
																	}
																/>
															</ValidationProvider>
														</LinksProvider>
													</Container>
												</Row>
											</div>
										</Container>
									</>
								}
							/>
						</Route>
					</Routes>
				</AuthProvider>
			</Router>
		</div>
	);
}

export default App;
