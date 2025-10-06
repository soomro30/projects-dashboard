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
        <ul className="d-lg-inline-block d-none notification-list no-margin d-lg-inline-block b-grey b-l b-r no-style p-l-20 p-r-20">
          <li className="p-r-5 inline">
            <div className="dropdown">
              <SafeAnchor
                id="notification-center"
                className="header-icon btn-icon-link"
                data-toggle="dropdown"
              >
                <i className="pg-icon">world</i>
                <span className="bubble"></span>
              </SafeAnchor>

              <div
                className="dropdown-menu notification-toggle"
                role="menu"
                aria-labelledby="notification-center"
              >
                <div className="notification-panel">
                  <div
                    className="scroll-wrapper notification-body scrollable"
                    style={{ position: "relative" }}
                  >
                    <div
                      className="notification-body scrollable scroll-content"
                      style={{
                        height: "auto",
                        marginBottom: "0px",
                        marginRight: "0px",
                      }}
                    >
                      <div className="notification-item unread clearfix">
                        <div className="heading open">
                          <SafeAnchor
                            className="text-complete pull-left d-flex align-items-center"
                          >
                            <i className="pg-icon m-r-10">map</i>
                            <span className="bold">Carrot Design</span>
                            <span className="fs-12 m-l-10">David Nester</span>
                          </SafeAnchor>
                          <div className="pull-right">
                            <div className="thumbnail-wrapper d16 circular inline m-t-15 m-r-10 toggle-more-details">
                              <div>
                                <i className="pg-icon">chevron_down</i>
                              </div>
                            </div>
                            <span className=" time">few sec ago</span>
                          </div>
                          <div className="more-details">
                            <div className="more-details-inner">
                              <h5 className="semi-bold fs-16">
                                “Apple’s Motivation - Innovation
                                <br />
                                distinguishes between <br />A leader and a
                                follower.”
                              </h5>
                              <p className="small hint-text">
                                Commented on john Smiths wall.
                                <br /> via pages framework.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="option"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="mark as read"
                        >
                          <SafeAnchor className="mark" />
                        </div>
                      </div>
                      <div className="notification-item clearfix">
                        <div className="heading">
                          <SafeAnchor className="text-danger pull-left">
                            <i className="pg-icon m-r-10">alert_warning</i>
                            <span className="bold">98% Server Load</span>
                            <span className="fs-12 m-l-10">Take Action</span>
                          </SafeAnchor>
                          <span className="pull-right time">2 mins ago</span>
                        </div>

                        <div className="option">
                          <SafeAnchor className="mark" />
                        </div>
                      </div>

                      <div className="notification-item clearfix">
                        <div className="heading">
                          <SafeAnchor className="text-warning pull-left">
                            <i className="pg-icon m-r-10">alert_warning</i>
                            <span className="bold">Warning Notification</span>
                            <span className="fs-12 m-l-10">Buy Now</span>
                          </SafeAnchor>
                          <span className="pull-right time">yesterday</span>
                        </div>

                        <div className="option">
                          <SafeAnchor className="mark" />
                        </div>
                      </div>

                      <div className="notification-item unread clearfix">
                        <div className="heading">
                          <div className="thumbnail-wrapper d24 circular b-white m-r-5 b-a b-white m-t-10 m-r-10">
                            <img
                              width="30"
                              height="30"
                              data-src-retina="/assets/img/profiles/1x.jpg"
                              data-src={
                                process.env.PUBLIC_URL +
                                "/assets/img/profiles/1.jpg"
                              }
                              alt=""
                              src={
                                process.env.PUBLIC_URL +
                                "/assets/img/profiles/1.jpg"
                              }
                            />
                          </div>
                          <SafeAnchor className="text-complete pull-left">
                            <span className="bold">Revox Design Labs</span>
                            <span className="fs-12 m-l-10">Owners</span>
                          </SafeAnchor>
                          <span className="pull-right time">11:00pm</span>
                        </div>

                        <div
                          className="option"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="mark as read"
                        >
                          <SafeAnchor className="mark" />
                        </div>
                      </div>
                    </div>
                    <div className="scroll-element scroll-x">
                      <div className="scroll-element_outer">
                        <div className="scroll-element_size"></div>
                        <div className="scroll-element_track"></div>
                        <div className="scroll-bar"></div>
                      </div>
                    </div>
                    <div className="scroll-element scroll-y">
                      <div className="scroll-element_outer">
                        <div className="scroll-element_size"></div>
                        <div className="scroll-element_track"></div>
                        <div className="scroll-bar"></div>
                      </div>
                    </div>
                  </div>

                  <div className="notification-footer text-center">
                    <SafeAnchor className="">
                      Read all notifications
                    </SafeAnchor>
                    <SafeAnchor
                      data-toggle="refresh"
                      className="portlet-refresh text-black pull-right"
                    >
                      <i className="pg-refresh_new"></i>
                    </SafeAnchor>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="p-r-5 inline">
            <SafeAnchor className="header-icon btn-icon-link">
              <i className="pg-icon">link_alt</i>
            </SafeAnchor>
          </li>
          <li className="p-r-5 inline">
            <SafeAnchor className="header-icon btn-icon-link">
              <i className="pg-icon">grid_alt</i>
            </SafeAnchor>
          </li>
          {/* <li className="inline">{emailEdit}</li> */}
        </ul>

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

        <SafeAnchor
          onClick={() => dispatch(toggleQuickViewOpen())}
          className="header-icon m-l-5 sm-no-margin d-inline-block"
          data-toggle="quickview"
          data-toggle-element="#quickview"
        >
          <i className="pg-icon btn-icon-link">menu_add</i>
        </SafeAnchor>
      </div>
    </React.Fragment>
  );
};

export default Content;
