import React, { useState } from "react";
import { useDispatch } from "react-redux";

import QuickViewAction from "../../../redux/actions";
import SafeAnchor from "../../shared/SafeAnchor";

const Content = ({ location, inboxHeader, setInboxHeader, onLogout }) => {
  let path = location.pathname;
  const customDropdown =
    path.includes("/email") || path.includes("/compose_email") ? (
      <SafeAnchor
        className="toggle-secondary-sidebar"
        onClick={() => setInboxHeader(!inboxHeader)}
      >
        <span className="d-flex align-items-center">
          Inbox <span className="text-info">(12)</span>{" "}
          <span className="pg-icon">drop_down</span>
        </span>
      </SafeAnchor>
    ) : null;

  const emailEdit =
    path.includes("/email") || path.includes("/compose_email") ? (
      <SafeAnchor id="mark-email" className="mark-email m-l-10 btn-icon-link">
        <i className="pg-icon">edit</i>
      </SafeAnchor>
    ) : null;

  const [shouldShowProfile, setShouldShowProfile] = useState(false);
  const dispatch = useDispatch();
  const {
    toggleQuickViewOpen,
    toggleMobileSideBarOpen,
    toggleMobileSideBarClose,
  } = QuickViewAction;

  const [mobileSidebarToggle, setMobileSidebarToggle] = useState(false);

  React.useEffect(() => {
    if (mobileSidebarToggle) {
      dispatch(toggleMobileSideBarOpen());
    } else {
      dispatch(toggleMobileSideBarClose());
    }
  }, [mobileSidebarToggle]);

  if (mobileSidebarToggle) {
    document.body.classList.remove("dashboard");
    document.body.classList.add(
      "mac",
      "desktop",
      "js-focus-visible",
      "sidebar-open",
      "sidebar-visible"
    );
  } else {
    document.body.classList.remove(
      "mac",
      "desktop",
      "js-focus-visible",
      "sidebar-open",
      "sidebar-visible"
    );
    document.body.classList.add("dashboard");
  }

  return (
    <React.Fragment>
      <SafeAnchor
        className="btn-link toggle-sidebar d-lg-none pg-icon btn-icon-link"
        data-toggle="sidebar"
        onClick={() => {
          setMobileSidebarToggle((prevState) => !prevState);
        }}
      >
        menu
      </SafeAnchor>

      <div className="">
        {customDropdown}
        <div className="brand inline ">
          <img
            src="https://www.waleedshah.ae/wp-content/uploads/2018/07/imkan-logo-5922b29939c99-300x129.png"
            alt="IMKAN logo"
			className="header-logo"
            width="80"
            height="34"
			style={{marginLeft:'33px'}}
          />
        </div>

      </div>
      <div className="d-flex align-items-center">
        <div
          className={`dropdown pull-right d-lg-block d-none ${
            shouldShowProfile ? "show" : ""
          }`}
        >
          <button
            className="profile-dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded={shouldShowProfile ? "true" : "false"}
            aria-label="profile dropdown"
          >
            <span className="thumbnail-wrapper d32 circular inline" style={{
              backgroundColor: '#0d6efd',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              <span onClick={() => setShouldShowProfile((prevState) => !prevState)}>
                A
              </span>
            </span>
          </button>
          <div
            style={{ width: "fit-content" }}
            className={`dropdown-menu dropdown-menu-right profile-dropdown ${
              shouldShowProfile ? "show" : ""
            }`}
            role="menu"
          >
            <SafeAnchor className="dropdown-item">
              <span>
                Signed in as <br />
                <b>Admin User</b>
              </span>
            </SafeAnchor>
            <div className="dropdown-divider"></div>
            <SafeAnchor className="dropdown-item">
              Your Profile
            </SafeAnchor>
            <SafeAnchor className="dropdown-item">
              Your Activity
            </SafeAnchor>
            <SafeAnchor className="dropdown-item">
              Your Archive
            </SafeAnchor>
            <div className="dropdown-divider"></div>
            <SafeAnchor className="dropdown-item">
              Features
            </SafeAnchor>
            <SafeAnchor className="dropdown-item">
              Help
            </SafeAnchor>
            <SafeAnchor className="dropdown-item">
              Settings
            </SafeAnchor>
            <a href="javascript:void(0);" className="dropdown-item" onClick={(e) => {
              e.preventDefault();
              console.log('Logout clicked, onLogout:', onLogout);
              setShouldShowProfile(false);
              if (onLogout) {
                console.log('Calling onLogout...');
                onLogout();
              } else {
                console.log('onLogout is not defined');
              }
            }}>
              Logout
            </a>
            <div className="dropdown-divider"></div>
            <span className="dropdown-item fs-12 hint-text">
              Last accessed by Admin
              <br />
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

      </div>
    </React.Fragment>
  );
};

export default Content;
