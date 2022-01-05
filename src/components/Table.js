import { BoxArrowUpRight } from "react-bootstrap-icons";
import Link from "./Link";

const Table = ({onShorten: makeShortUrl, links, validation}) => { 
	return (
		<>
			{Object.entries(links).map(([site, details]) =>
				<div key={site}>
					<h3>{site}</h3>
					<table className="table table-responsive table-hover caption-top align-top mb-4 mw-100 utm_table">
						<caption>
							Links for <a href={`${details.link}`} target="_blank" rel="noreferrer">{details.link} <BoxArrowUpRight /></a>
						</caption>
						<thead className="table-dark">
							<tr>
								<th scope="col" className="col-md-2">
									Source
								</th>
								<th scope="col" className="col-md-7">
									UTM link
								</th>
								<th scope="col" className="col-md-3">
									Short link
								</th>
							</tr>
						</thead>
						<tbody>
							{Object.values(details).map((link, index) =>
								// skip first entry in details because it is just meta
								index > 0 ?
									<Link key={link.html_id} link={link} onShorten={makeShortUrl} validation={validation} />
								: null
							)}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default Table;
