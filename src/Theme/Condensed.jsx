import React, { useState, useEffect } from "react";
import "../pages/scss/themes/condensed/condensed.scss";

import Dashboard from "../components/Theme-Condensed/Dashboard";
import ProjectDashboard from "../components/Theme-Condensed/ProjectDashboard";
import Social from "../components/Social";
import Email from "../components/Email";
import ComposeEmail from "../components/ComposeEmail";
import Cards from "../components/Card";
import Views from "../components/View";
import Chart from "../components/Chart";

import Builder from "../components/Builder";

import LayoutsBox from "../components/Layouts/Box";
import LayoutsDefault from "../components/Layouts/Default";
import LayoutsRtl from "../components/Layouts/Rtl";
import LayoutsSecondary from "../components/Layouts/Secondary";

import UIElementsColor from "../components/UIElements/Color";
import UIElementstypography from "../components/UIElements/Typography";
import UIElementsIcons from "../components/UIElements/Icons";
import UIElementsButtons from "../components/UIElements/Buttons";
import UIElementsNotify from "../components/UIElements/Notification";
import UIElementsModal from "../components/UIElements/Modals";
import UIElementsProgressActivity from "../components/UIElements/ProgressAndActivity";
import UIElementsTabsAccordion from "../components/UIElements/TabsAndAccordion";
import UIElementsSliders from "../components/UIElements/Sliders";
import UIElementsTreeView from "../components/UIElements/TreeView";
import UIElementsNestables from "../components/UIElements/Nestables";

import FormElement from "../components/Forms/Elements";
import FormLayout from "../components/Forms/FormLayouts";
import FormWizard from "../components/Forms/Wizard";

import TableBasic from "../components/Tables/Basic";
import TableData from "../components/Tables/Data";

import MapGoogle from "../components/Maps/GoogleMap";
import MapVector from "../components/Maps/VectorMap";

import ExtraInvoice from "../components/Extra/Invoice";
import Extra400 from "../components/Extra/404Page";
import Extra500 from "../components/Extra/500Page";
import ExtraBlank from "../components/Extra/BlankPage";
import ExtraLogin from "../components/Extra/Login";
import ExtraRegister from "../components/Extra/register";
import ExtraLockScreen from "../components/Extra/LockScreen";
import ExtraGallery from "../components/Extra/Gallery";
import ExtraTimeLine from "../components/Extra/TimeLine";

import MenuLevelOne from "../components/MenuLevel/LevelOne";
import Submenu from "../components/MenuLevel/LevelTwo/Submenu";

import Header from "../components/Theme-Condensed/Header";
import Sidebar from "../components/Theme-Condensed/Sidebar";
import Search from "../components/Theme-Condensed/Search";
import { useLocation, useNavigate, useParams, useMatch, Routes, Route } from "react-router-dom";
function withRouter(Component) {
	function ComponentWithRouterProp(props) {
		let location = useLocation();
		let navigate = useNavigate();
		let params = useParams();
		return (
			<Component
				{...props}
				router={{ location, navigate, params }}
			/>
		);
	}

	return ComponentWithRouterProp;
}


const Condensed = ({ onLogout, onLogin, isLoginOnly, userRole }) => {
	const location = useLocation();
	let path = location.pathname;
	const [toggleInboxHeader, setToggleInboxHeader] = useState(false);

	useEffect(() => {
		window.addEventListener("resize", (e) => {
			setToggleInboxHeader(false);
		});

		return () => window.removeEventListener("resize", null);
	});

	if (path.includes("/cards")) {
		document.body.classList.add("cards-view-page");
	}
	else {
		document.body.classList.remove("cards-view-page");
	}

	const shouldShowHeaderAndSidebar = !isLoginOnly &&
		!path.includes("boxed_layout") &&
		!path.includes("/login") &&
		!path.includes("/register") &&
		!path.includes("/lock_screen") &&
		!path.includes("/404") &&
		!path.includes("/500");

	return (
		<div className="h-100">
			<div>
				<Header
					location={location}
					inboxHeader={toggleInboxHeader}
					setInboxHeader={(value) => setToggleInboxHeader(value)}
					onLogout={onLogout}
				/>
				<Sidebar location={location} />
			</div>

			<Routes>
				{isLoginOnly ? (
					<Route path="*" element={<ExtraLogin onLogin={onLogin} />} />
				) : (
					<>
				<Route path="/" element={<Dashboard userRole={userRole} />} />
				<Route path="/condensed" element={<Dashboard userRole={userRole} />} />
				<Route path="dashboard" element={<Dashboard userRole={userRole} />} />
				<Route path="project/:projectId" element={<ProjectDashboard userRole={userRole} />} />
				<Route path="social" element={<Social />} />
				<Route
					path="email"
					element={<Email inboxHeader={toggleInboxHeader} location={location} />}
				/>
				<Route
					path="compose_email"
					element={<ComposeEmail inboxHeader={toggleInboxHeader} location={location} />}
				/>

				{/* START Builder route */}
				<Route path="builder" element={<Builder />} />
				{/* END builder route */}

				{/* START Layouts group routes */}
				<Route path="default_layout" element={<LayoutsDefault />} />
				<Route path="secondary_layout" element={<LayoutsSecondary />} />
				<Route path="boxed_layout" element={<LayoutsBox />} />
				<Route path="rtl_layout" element={<LayoutsRtl />} />
				{/* END Layouts routes */}

				{/* START UIElements group routes */}
				<Route path="color" element={<UIElementsColor />} />
				<Route path="typography" element={<UIElementstypography />} />
				<Route path="icons" element={<UIElementsIcons />} />
				<Route path="buttons" element={<UIElementsButtons />} />
				<Route path="notifications" element={<UIElementsNotify />} />
				<Route path="modals" element={<UIElementsModal />} />
				<Route
					path="progress"
					element={<UIElementsProgressActivity />}
				/>
				<Route
					path="tabs_accordian"
					element={<UIElementsTabsAccordion />}
				/>
				<Route path="sliders" element={<UIElementsSliders />} />
				<Route path="tree_view" element={<UIElementsTreeView />} />
				<Route path="nestables" element={<UIElementsNestables />} />
				{/* END UIElements routes */}

				{/* START Forms group routes */}
				<Route path="form_elements" element={<FormElement />} />
				<Route path="form_layouts" element={<FormLayout />} />
				<Route path="form_wizard" element={<FormWizard />} />
				{/* END Forms routes */}

				<Route path="cards" element={<Cards />} />
				<Route path="views" element={<Views />} />

				{/* START Tables group routes */}
				<Route path="basic_tables" element={<TableBasic />} />
				<Route path="data_tables" element={<TableData />} />
				{/* END Tables routes */}

				{/* START Maps group routes */}
				<Route path="google_map" element={<MapGoogle />} />
				<Route path="vector_map" element={<MapVector />} />
				{/* END Maps routes */}

				<Route path="charts" element={<Chart />} />

				{/* START Extra group routes */}
				<Route path="extra/invoice" element={<ExtraInvoice />} />
				<Route path="extra/404" element={<Extra400 />} />
				<Route path="extra/500" element={<Extra500 />} />
				<Route path="extra/blank_template" element={<ExtraBlank />} />
				<Route path="extra/login" element={<ExtraLogin onLogin={onLogin} />} />
				<Route path="extra/register" element={<ExtraRegister />} />
				<Route path="extra/lock_screen" element={<ExtraLockScreen />} />
				<Route path="extra/gallery" element={<ExtraGallery />} />
				<Route path="extra/timeline" element={<ExtraTimeLine />} />
				{/* END Extra routes */}

				{/* START Menu Levels group routes */}
				<Route path="levelOne" element={<MenuLevelOne />} />
				<Route path="submenu" element={<Submenu />} />
				{/* END Menu Levels routes */}
				</>
				)}
			</Routes>
			
			{(path.includes("/condensed") || path === "/") && <Search />}
		</div>
	);
};

export default withRouter(Condensed);
