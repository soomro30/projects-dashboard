import React from "react";

import DefaultLayout from "../../shared/Layouts/Default";
import LayoutsDefaultWrapperComponent from "./Content";

const Component = ({ }) => {
	let path = location.pathname;
	return (
		<div
			className={
				path.includes("/executive") || path.includes("/casual")
					? "no-padding page-container"
					: "page-container"
			}
		>
			{/* START PAGE CONTENT WRAPPER */}
			<LayoutsDefaultWrapperComponent path={path} />
			{/* END PAGE CONTENT WRAPPER */}
		</div>
	);
};

export default Component;
