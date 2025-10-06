import React, { useState } from "react";
import { ValidatorForm } from "react-form-validator-core";

import "./blank_page_style.css";

import LoginFieldValidate from "./LoginFieldValidate";

const content = ({ onLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let handleFormSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(userName, password);
    if (!success) {
      setError("Invalid username or password. Use admin/admin to login.");
    } else {
      setError("");
    }
  };

  return (
    <div className="login-wrapper ">
      <div className="bg-pic">
        <img
          src="https://www.imkan.ae/sites/default/files/2022-09/masterplan-camera-03-d4.jpg"
          alt="IMKAN Properties"
          style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
        />
      </div>
      <div className="bg-caption">
        <h1>IMKAN Properties</h1>
      </div>
      <div className="login-container bg-white">
        <div className="p-l-50 p-r-50 p-t-50 m-t-30 sm-p-l-15 sm-p-r-15 sm-p-t-40">
          <img
            src="https://www.waleedshah.ae/wp-content/uploads/2018/07/imkan-logo-5922b29939c99-300x129.png"
            alt="IMKAN Logo"
            width="120"
            height="52"
          />
          <p className="p-t-35">Welcome to IMKAN Project Dashboard</p>
          <p className="p-b-20">Sign in to access the dashboard</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <ValidatorForm
            instantValidate={true}
            onSubmit={handleFormSubmit}
            className="p-t-15"
          >
            <LoginFieldValidate
              onChange={(e) => setUserName(e.target.value)}
              name="username"
              type="text"
              value={userName}
              className="form-control"
              label="Login"
              placeholder="User Name"
              require="true"
            />

            <LoginFieldValidate
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              value={password}
              className="form-control"
              label="Password"
              placeholder="Credentials"
              require="true"
            />

            <div className="row">
              <div className="col-md-6 no-padding sm-p-l-10">
                <div className="form-check">
                  <input type="checkbox" value="1" id="checkbox1" />
                  <label htmlFor="checkbox1">Remember me</label>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center justify-content-end">
                <button
                  aria-label=""
                  className="btn btn-primary btn-cons m-t-10"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </div>
            <a href="javascript:void(0);" className="text-info small">
              Lost your password?
            </a>
            <br />
            <a href="javascript:void(0);" className="text-info small">
              Not a member yet? Signup now.
            </a>
          </ValidatorForm>

          <div className="pull-bottom sm-pull-bottom" style={{textAlign: 'center'}}>
            <div className="m-b-30 sm-m-t-20 sm-p-b-20">
              <p className="small-text normal hint-text" style={{margin: 0}}>
                ©2025 IMKAN Properties. All Rights Reserved.{" "}
                <a href="javascript:void(0);">Privacy Policy</a> |{" "}
                <a href="javascript:void(0);">Terms of Service</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default content;
