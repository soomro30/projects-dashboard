import React, { Component } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Casual from "./Theme/Casual";
import Corporate from "./Theme/Corporate";
import Condensed from "./Theme/Condensed";
import Simple from "./Theme/simple";
import Executive from "./Theme/Executive";
import LoginComponent from "./components/Extra/Login/Component";

import Quickview from "./components/Quickview";
import { authenticateUser, saveAuthToken, getAuthToken, clearAuthToken } from "./utils/auth";

class App extends Component {
	constructor(props) {
		super(props);
		const authUser = getAuthToken();
		this.state = {
			isAuthenticated: authUser !== null,
			userRole: authUser ? authUser.role : null,
			userName: authUser ? authUser.name : null
		};
	}

	handleLogin = (username, password) => {
		const result = authenticateUser(username, password);

		if (result.success) {
			const userData = {
				username: result.username,
				role: result.role,
				name: result.name
			};
			saveAuthToken(userData);
			this.setState({
				isAuthenticated: true,
				userRole: result.role,
				userName: result.name
			});
			return true;
		}
		return false;
	};

	handleLogout = () => {
		clearAuthToken();
		this.setState({
			isAuthenticated: false,
			userRole: null,
			userName: null
		});
	};

	render() {
		if (!this.state.isAuthenticated) {
			return (
				<BrowserRouter
					future={{
						v7_startTransition: true,
						v7_relativeSplatPath: true
					}}
				>
					<div className="App h-100">
						<Routes>
							<Route path="/*" element={<Condensed onLogin={this.handleLogin} isLoginOnly={true} />} />
						</Routes>
					</div>
				</BrowserRouter>
			);
		}

		return (
			<BrowserRouter
				future={{
					v7_startTransition: true,
					v7_relativeSplatPath: true
				}}
			>
				<div className="App h-100">
					<Routes>
						{/* Default route redirects to condensed theme */}
						<Route path="/" element={<Condensed onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/casual/*" element={<Casual onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/corporate/*" element={<Corporate onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/condensed/*" element={<Condensed onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/simple/*" element={<Simple onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/executive/*" element={<Executive onLogout={this.handleLogout} userRole={this.state.userRole} />} />
						<Route path="/login" element={<Navigate to="/" replace />} />
					</Routes>
					<Quickview />
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
