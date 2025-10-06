import React from "react";

import DefaultLayout from "../../shared/Layouts/Default";
import MapVectorWrapperComponent from "./Content";

const Component = ({ }) => {
	let path = location.pathname;
	return (
		//<DefaultLayout location={location}>
		<div
			className={
				path.includes("/executive") || path.includes("/casual")
					? "no-padding page-container"
					: "page-container"
			}
		>
			{/* START PAGE CONTENT WRAPPER */}
			<MapVectorWrapperComponent path={path} />
			{/* END PAGE CONTENT WRAPPER */}
		</div>
		//</DefaultLayout>
	);
};

export default Component;
