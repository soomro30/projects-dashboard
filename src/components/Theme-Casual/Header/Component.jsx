import React from "react";
import { useSelector } from "react-redux";

import HeaderContent from "./Content";

import "./style.scss";

const Component = ({ location, inboxHeader, openMobileToggle }) => {
	let shouldViewHeader =
		location.pathname !== "/extra/404" &&
			location.pathname !== "/extra/500" &&
			location.pathname !== "/extra/login" &&
			location.pathname !== "/extra/register" &&
			location.pathname !== "/extra/lock_screen"
			? true
			: false;

	const sideBarStatus = useSelector(
		(state) => state.QuickView.openMobileSideBar
	);

	return (
		// <div
		// 	className={`header  ${
		// 		sideBarStatus && location.pathname !== "/" ? "headerAlign" : ""
		// 	}`}
		// 	style={
		// 		shouldViewHeader
		// 			? location.pathname === "/google_map"
		// 				? { backgroundColor: "transparent" }
		// 				: {}
		// 			: { display: "none" }
		// 	}
		// >
		// 	{location.pathname === "/boxed_layout" ? (
		// 		<div className="container">
		// 			<div className="header-inner">
		// 				<HeaderContent location={location} inboxHeader={inboxHeader} />
		// 			</div>
		// 		</div>
		// 	) : (
		// 		<HeaderContent location={location} inboxHeader={inboxHeader} />
		// 	)}
		// </div>
		<div className="header no-padding no-border" style={{ height: "auto" }}>
			<HeaderContent location={location} inboxHeader={inboxHeader} openMobileToggle={openMobileToggle} />
		</div>
	);
};

export default Component;
