import { useRef, useEffect } from "react";
import { Magic, X } from "react-bootstrap-icons";

const Form = ({onGenerate: generateUrl, onChange: inputsChange, onReset: resetForm, inputs}) => {

	// trim and lowercase utm parameters
	// more complex serialization is handled by URL API
	const cleanParam = (param) => param.toLowerCase().trim();

	const handleChange = (e) => inputsChange(e);

	const handleReset = (e) => resetForm(e);

	// @TODO: use state to manage checkboxes
	const selectedSites = () => {
		let selected_sites = {};

		// build array URLs from selected sites
		document.querySelectorAll(".selected_sites input:checked").forEach(element => {
			let u = new URL(element.value);
			selected_sites[u.hostname] = u;
		});

		return selected_sites;
	};

	const utm_custom_params = useRef(),
		utm_custom_params_utm_source = useRef(),
		utm_custom_params_utm_medium = useRef();

	// @TODO: get input from state or from inputs?
	const selectedParams = () => {
		let selected_sources = {},
			// utm_campaign = cleanParam(document.getElementById("utm_campaign")),
			// utm_content = cleanParam(document.getElementById("utm_content")),
			// utm_term = cleanParam(document.getElementById("utm_term"));
			utm_campaign = inputs.utm_campaign && cleanParam(inputs.utm_campaign),
			utm_content = inputs.utm_content && cleanParam(inputs.utm_content),
			utm_term = inputs.utm_term && cleanParam(inputs.utm_term);

		// build array of selected params from nodeList
		document.querySelectorAll(".selected_sources input:checked").forEach(element => {
			selected_sources[element.value] = {};

			if (utm_campaign !== "")
				selected_sources[element.value]["utm_campaign"] = utm_campaign;
			if (utm_content !== "")
				selected_sources[element.value]["utm_content"] = utm_content;
			if (utm_term !== "")
				selected_sources[element.value]["utm_term"] = utm_term;
		});

		if ("utm_facebook" in selected_sources) {
			// selected_sources["utm_facebook"]["utm_medium"] = "social";
			// selected_sources["utm_facebook"]["utm_source"] = "facebook";
			// selected_sources["utm_facebook"]["icon"] = "bi-facebook";

			// add source/medium to beginning
			selected_sources["utm_facebook"] = {
				utm_medium: 'social',
				utm_source: 'facebook',
				icon: '<bi-facebook>',
				...selected_sources["utm_facebook"]
			};
		}

		if ("utm_instagram" in selected_sources) {
			// selected_sources["utm_instagram"]["utm_medium"] = "social";
			// selected_sources["utm_instagram"]["utm_source"] = "instagram";
			// selected_sources["utm_instagram"]["icon"] = "bi-instagram";

			// add source/medium to beginning
			selected_sources["utm_instagram"] = {
				utm_medium: 'social',
				utm_source: 'instagram',
				icon: 'bi-instagram',
				...selected_sources["utm_instagram"]
			};
		}

		if ("utm_twitter" in selected_sources) {
			// selected_sources["utm_twitter"]["utm_medium"] = "social";
			// selected_sources["utm_twitter"]["utm_source"] = "twitter";
			// selected_sources["utm_twitter"]["icon"] = "bi-twitter";

			// add source/medium to beginning
			selected_sources["utm_twitter"] = {
				utm_medium: 'social',
				utm_source: 'twitter',
				icon: 'bi-twitter',
				...selected_sources["utm_twitter"]
			};
		}

		if ("utm_linkedin" in selected_sources) {
			// selected_sources["utm_linkedin"]["utm_medium"] = "social";
			// selected_sources["utm_linkedin"]["utm_source"] = "linkedin";
			// selected_sources["utm_linkedin"]["icon"] = "bi-linkedin";

			// add source/medium to beginning
			selected_sources["utm_linkedin"] = {
				utm_medium: 'social',
				utm_source: 'linkedin',
				icon: 'bi-linkedin',
				...selected_sources["utm_linkedin"]
			};
		}

		if ("utm_email" in selected_sources) {
			// selected_sources["utm_email"]["utm_medium"] = "newsletter";
			// selected_sources["utm_email"]["utm_source"] = "email";
			// selected_sources["utm_email"]["icon"] = "bi-envelope";

			// add source/medium to beginning
			selected_sources["utm_email"] = {
				utm_medium: 'newsletter',
				utm_source: 'email',
				icon: 'bi-envelope',
				...selected_sources["utm_email"]
			};
		}

		if ("utm_whatsapp" in selected_sources) {
			// selected_sources["utm_whatsapp"]["utm_medium"] = "referral";
			// selected_sources["utm_whatsapp"]["utm_source"] = "whatsapp";
			// selected_sources["utm_whatsapp"]["icon"] = "bi-whatsapp";

			// add source/medium to beginning
			selected_sources["utm_whatsapp"] = {
				utm_medium: 'referral',
				utm_source: 'whatsapp',
				icon: 'bi-whatsapp',
				...selected_sources["utm_whatsapp"]
			};
		}

		// if also building custom params
		if ("utm_custom" in selected_sources) {
			let utm_medium = cleanParam(utm_custom_params_utm_medium.current.value),
				utm_source = cleanParam(utm_custom_params_utm_source.current.value);
				
			if (utm_medium !== "")
				selected_sources["utm_custom"]["utm_medium"] = utm_medium;
			if (utm_source !== "")
				selected_sources["utm_custom"]["utm_source"] = utm_source;
			selected_sources["utm_custom"]["icon"] = "bi-pencil-square";
		}

		return selected_sources;
	}

	const handleSubmit = (e) => {
		e.preventDefault();

		// validate form
		if (!e.target.reportValidity()) {
			e.stopPropagation();
			throw new TypeError("invalid input");
		}
		e.target.classList.add("was-validated");

		let url = inputs.url,
			params = selectedParams(),
			selected_sites = selectedSites();

		// select site based on entered url
		// document.querySelector(`input.sites[value="${url.origin}"]`).checked = 'checked';

		generateUrl({ url, params, selected_sites });
	};
		
	useEffect(() => {
		utm_custom_params.current.addEventListener("shown.bs.collapse", function () {
			utm_custom_params_utm_source.current.setAttribute("required", true);
		});
		utm_custom_params.current.addEventListener("hidden.bs.collapse", function () {
			utm_custom_params_utm_source.current.setAttribute("required", false);
		});

	}, []);
	
	
	// @TODO: use react-bootstrap components
	return (
		<div id="utm_container" className="container-md my-md-3">
			<form id="utm_form" className="needs-validation" onSubmit={handleSubmit}>
				<h3>URL details</h3>
				<div className="row mb-3 url form-section">
					<div className="row mb-3">
						<label
							htmlFor="url"
							className="col-md-3 col-form-label-lg"
						>
							URL <small className="text-muted form-text">(required)</small>
						</label>
						<div className="col-md-9 mb-3">
							<input
								id="url"
								type="url"
								list="tcf_urls"
								pattern="https://.*"
								className="form-control form-control-lg utm_param"
								aria-required="true"
								title="Please enter a valid URL, e.g. https://tcf.org.pk/donate"
								required
								autoFocus
								value={inputs.url}
								onChange={handleChange}
							/>
							<small className="text-muted form-text">
								Enter the full URL (e.g. <code>https://tcf.org.pk/donate/</code>)
							</small>
							<datalist id="tcf_urls">
								<option value="https://tcf.org.pk"></option>
								<option value="https://tcf-uk.org"></option>
								<option value="https://tcfusa.org"></option>
								<option value="https://tcfcanada.org"></option>
								<option value="https://tcfaustralia.org"></option>
								<option value="https://tcfnorway.org"></option>
							</datalist>
						</div>
					</div>
					<div className="row">
						<div
							className="selected_sites col-md-9 offset-md-3"
							role="group"
							aria-label="Sites"
						>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_pk"
								value="https://tcf.org.pk"
								defaultChecked
							/>
							<label className="btn btn-outline-primary" htmlFor="site_pk">
								tcf.org.pk
							</label>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_uk"
								value="https://tcf-uk.org"
							/>
							<label className="btn btn-outline-primary" htmlFor="site_uk">
								tcf-uk.org
							</label>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_us"
								value="https://tcfusa.org"
							/>
							<label className="btn btn-outline-primary" htmlFor="site_us">
								tcfusa.org
							</label>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_ca"
								value="https://tcfcanada.org"
							/>
							<label className="btn btn-outline-primary" htmlFor="site_ca">
								tcfcanada.org
							</label>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_au"
								value="https://tcfaustralia.org"
							/>
							<label className="btn btn-outline-primary" htmlFor="site_au">
								tcfaustralia.org
							</label>
							<input
								type="checkbox"
								className="btn-check sites"
								id="site_no"
								value="https://tcfnorway.org"
							/>
							<label className="btn btn-outline-primary" htmlFor="site_no">
								tcfnorway.org
							</label>
							<div className="row">
								<small className="text-muted form-text">
									Select the sites for which you want to generate
									UTM parameters
								</small>
							</div>
						</div>
					</div>
				</div>
				<hr className="my-4" />
				<div className="row mb-3 utm_parameters form-section">
					<h3>UTM Parameters</h3>
					<div className="row mb-3">
						<label htmlFor="utm_campaign" className="col-md-3 col-form-label">
							utm_campaign
						</label>
						<div className="col-md-9">
							<input
								id="utm_campaign"
								type="text"
								className="form-control form-control utm_param"
								pattern="[a-z][A-z-\d\s]+"
								value={inputs.utm_campaign}
								onChange={handleChange}
							/>
							<small className="text-muted form-text">
								A cross-channel description of the campaign or
								marketing initiative: (e.g. <code>ramzan2021</code>, <code>members</code>, <code>expiry</code>)
							</small>
						</div>
					</div>
					<div className="row mb-3">
						<label htmlFor="utm_content" className="col-md-3 col-form-label">
							utm_content
						</label>
						<div className="col-md-9">
							<input
								id="utm_content"
								type="text"
								className="form-control form-control utm_param"
								pattern="[a-z][A-z-\d\s]+"
								value={inputs.utm_content}
								onChange={handleChange}
							/>
							<small className="text-muted form-text">
								To differentiate ads or posts (e.g. <code>membership-launch</code>, <code>dvc30s</code>)
							</small>
						</div>
					</div>
					<div className="row mb-3">
						<label htmlFor="utm_term" className="col-md-3 col-form-label">
							utm_term <span className="text-muted">(optional)</span>
						</label>
						<div className="col-md-9">
							<input
								id="utm_term"
								type="text"
								className="form-control form-control utm_param"
								pattern="[a-z][A-z-\d\s]+"
								value={inputs.utm_term}
								onChange={handleChange}
							/>
							<small className="text-muted form-text">
								Used for paid search, to identify the keywords for
								this ad. (e.g. <code>donate for education</code>, <code>zakat calculator</code>)
							</small>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3">
							<label htmlFor="utm_content" className="col-form-label">
								Common presets
							</label>
						</div>
						<div className="col-md-9">
							<div
								className="selected_sources"
								role="group"
								aria-label="Sites"
							>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_facebook"
									value="utm_facebook"
									defaultChecked
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_facebook"
								>
									Facebook
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_twitter"
									value="utm_twitter"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_twitter"
								>
									Twitter
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_linkedin"
									value="utm_linkedin"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_linkedin"
								>
									LinkedIn
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_instagram"
									value="utm_instagram"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_instagram"
								>
									Instagram
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_email"
									value="utm_email"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_email"
								>
									Email
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_whatsapp"
									value="utm_whatsapp"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_whatsapp"
								>
									WhatsApp
								</label>
								<input
									type="checkbox"
									className="btn-check sources"
									id="utm_custom"
									value="utm_custom"
									data-bs-toggle="collapse"
									data-bs-target="#utm_custom_params"
									aria-expanded="false"
									aria-controls="utm_custom_params"
								/>
								<label
									className="btn btn-outline-primary"
									htmlFor="utm_custom"
								>
									Custom
								</label>
							</div>
						</div>
					</div>
					<div
						className="row collapse mt-3 p-3 bg-light border"
						id="utm_custom_params"
						ref={utm_custom_params}
					>
						<div className="row mb-3">
							<label htmlFor="utm_source" className="col-md-3 col-form-label">
								utm_source <span className="text-muted">(required)</span>
							</label>
							<div className="col-md-9">
								<input
									className="form-control utm_param"
									list="utm_sourceOptions"
									id="utm_source"
									type="text"
									placeholder="Type to search suggested sources..."
									aria-required="true"
									pattern="[a-z]+"
									value={inputs.utm_source}
									onChange={handleChange}
									ref={utm_custom_params_utm_source}
								/>
								<small className="text-muted form-text">
									The source of traffic: (e.g. <code>google</code>
									, <code>facebook</code>, <code>newsletter</code>
									, <code>whatsapp</code>)
								</small>
								<datalist id="utm_sourceOptions">
									<option value="facebook"></option>
									<option value="twitter"></option>
									<option value="instagram"></option>
									<option value="linkedin"></option>
									<option value="youtube"></option>
									<option value="newsletter"></option>
									<option value="whatsapp"></option>
								</datalist>
							</div>
						</div>
						<div className="row mb-3">
							<label htmlFor="utm_medium" className="col-md-3 col-form-label">
								utm_medium
							</label>
							<div className="col-md-9">
								<input
									className="form-control utm_param"
									list="utm_mediumOptions"
									id="utm_medium"
									type="text"
									placeholder="Type to search suggested media..."
									pattern="[a-z]+"
									value={inputs.utm_medium}
									onChange={handleChange}
									ref={utm_custom_params_utm_medium}
								/>
								<small className="text-muted form-text">
									Marketing medium or channels: (e.g. 
									<code>cpc</code>, <code>social</code>, <code>email</code>, <code>referral</code>)
								</small>
								<datalist id="utm_mediumOptions">
									<option value="social"></option>
									<option value="email"></option>
									<option value="referral"></option>
									<option value="pr"></option>
									<option value="display"></option>
									<option value="cpc"></option>
								</datalist>
							</div>
						</div>
					</div>
				</div>
				<hr className="my-4" />
				<div className="row submit form-section">
					<div className="row">
						<div className="col-auto offset-md-3">
							<button
								type="submit"
								className="btn btn-primary btn-lg"
								id="generate_url"
								aria-label="Generate URL"
							>
								<Magic /> Generate
							</button>
						</div>
						<div className="col-auto ms-md-auto">
							<button
								type="button"
								className="btn btn-link"
								id="clear_form"
								aria-label="Clear form"
								onClick={handleReset}
							>
								<X /> Reset
							</button>
						</div>
					</div>
				</div>
				<hr className="my-4" />
			</form>
		</div>
	);
};

export default Form;
