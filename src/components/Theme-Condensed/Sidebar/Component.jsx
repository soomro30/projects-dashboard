import React from "react";
import { SlideDown } from "react-slidedown";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";

import "react-slidedown/lib/slidedown.css";

import SidebarItem from "./SidebarItem";
import SafeAnchor from "../../shared/SafeAnchor";
import "./style.scss";

class Component extends React.Component {
  state = {
    isVisible: false,
    shouldExpand: false,
    shouldExpandNest: false,
    clickedMenu: null,
    clickedMenuNest: null,
    shouldSideBarPin: false,
    shouldToggleSidebarHeader: false,
    shouldBoxedLayout: false,
  };
  componentDidMount() {}
  handleMouseEnter = () => {
    document.body.classList.add("sidebar-show");
    this.setState({
      isVisible: true,
    });
  };
  handleMouseLeave = () => {
    document.body.classList.remove("sidebar-show");
    this.setState({
      isVisible: false,
    });
  };
  handleMenuExpan = (value) => {
    let customShouldExpan = true;
    if (this.state.clickedMenu === value) {
      customShouldExpan = !this.state.shouldExpand;
    }
    this.setState({
      shouldExpand: customShouldExpan,
      clickedMenu: value,
      clickedMenuNest: null,
    });
  };
  handleMenuExpanNest = (value) => {
    this.setState({
      shouldExpandNest: !this.state.shouldExpandNest,
      clickedMenuNest: value,
    });
  };
  togglePin = () => {
    this.setState(
      {
        shouldSideBarPin: !this.state.shouldSideBarPin,
      },
      () => {
        if (this.state.shouldSideBarPin) {
          document.body.classList.add("menu-pin");
        } else {
          document.body.classList.remove("menu-pin");
        }
      }
    );
  };
  toggleSidebarHeader = () => {
    this.setState({
      shouldToggleSidebarHeader: !this.state.shouldToggleSidebarHeader,
    });
  };

  navBoxedLayout = () => {
    this.setState(
      {
        shouldBoxedLayout: !this.state.shouldBoxedLayout,
      },
      () => {
        if (this.state.shouldBoxedLayout) {
          document.body.classList.add(
            "box-layout menu-pin  mac desktop js-focus-visible"
          );
        } else {
          document.body.classList.remove(
            "box-layout menu-pin  mac desktop js-focus-visible"
          );
        }
      }
    );
  };

  render() {
    const { isVisible } = this.state;
    // TODO if rtl is enabled this value should be a minus one
    const style = {
      transform: `translate3d(${isVisible ? 280 - 70 : 0}px, 0,0)`,
    };

    let toggleHeader = this.state.shouldToggleSidebarHeader
      ? "sidebar-overlay-slide from-top show"
      : "sidebar-overlay-slide from-top";

    let shouldViewHeader =
      window.location.pathname !== "/extra/404" &&
      window.location.pathname !== "/extra/500" &&
      window.location.pathname !== "/extra/login" &&
      window.location.pathname !== "/extra/register" &&
      window.location.pathname !== "/extra/lock_screen"
        ? true
        : false;

    let isBoxedLayout = window.location.pathname.includes("/boxed_layout")
      ? true
      : false;
    if (isBoxedLayout) {
      document.body.classList.remove("dashboard");
      document.body.classList.add(
        "box-layout",
        "menu-pin",
        "mac",
        "desktop",
        "js-focus-visible"
      );
    } else {
      document.body.classList.add("dashboard");
    }
    return (
      <nav
        style={shouldViewHeader ? style : { display: "none" }}
        className={`page-sidebar ${this.props.openState ? "visible" : ""}`}
        data-pages="sidebar"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {/* BEGIN SIDEBAR MENU TOP TRAY CONTENT*/}
        <div className={toggleHeader} id="appMenu">
          <div className="row">
            <div className="col-xs-6 no-padding">
              <SafeAnchor  className="p-l-40">
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/demo/social_app.svg"
                  }
                  alt="socail"
                />
              </SafeAnchor>
            </div>
            <div className="col-xs-6 no-padding">
              <SafeAnchor  className="p-l-10">
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/demo/email_app.svg"
                  }
                  alt="socail"
                />
              </SafeAnchor>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 m-t-20 no-padding">
              <SafeAnchor  className="p-l-40">
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/demo/calendar_app.svg"
                  }
                  alt="socail"
                />
              </SafeAnchor>
            </div>
            <div className="col-xs-6 m-t-20 no-padding">
              <SafeAnchor  className="p-l-10">
                <img
                  src={process.env.PUBLIC_URL + "/assets/img/demo/add_more.svg"}
                  alt="socail"
                />
              </SafeAnchor>
            </div>
          </div>
        </div>
        {/* END SIDEBAR MENU TOP TRAY CONTENT*/}
        {/* BEGIN SIDEBAR MENU HEADER*/}
        <div className="sidebar-header">
          <img
            src="https://azcb.co/wp-content/uploads/2025/02/imkan-properties-logo-white.png"
            alt="IMKAN logo"
            style={this.props.openState ? { marginRight: "0px" } : {}}
            className="brand"
            width="80"
            height="34"
          />
          {this.state.isVisible || this.state.shouldSideBarPin ? (
            <div className="sidebar-header-controls">
              <button
                aria-label="Toggle Drawer"
                onClick={this.toggleSidebarHeader}
                type="button"
                className={`btn btn-icon-link invert sidebar-slide-toggle m-l-20 m-r-10 ${
                  this.state.shouldToggleSidebarHeader ? "active" : ""
                }`}
                data-pages-toggle="#appMenu"
              >
                <i className="pg-icon">chevron_down</i>
              </button>
              <button
                aria-label="Pin Menu"
                type="button"
                onClick={this.togglePin}
                className="btn btn-icon-link invert d-lg-inline-block d-xlg-inline-block d-md-inline-block d-sm-none d-none"
                data-toggle-pin="sidebar"
              >
                <i className="pg-icon"></i>
              </button>
            </div>
          ) : null}
        </div>
        {/* END SIDEBAR MENU HEADER*/}
        {/* START SIDEBAR MENU */}
        <div className="sidebar-menu">
          {/* BEGIN SIDEBAR MENU ITEMS*/}
          <PerfectScrollbar className="menu-items scroll-content scroll-scrolly_visible">
            {/* <ul className="menu-items scroll-content scroll-scrolly_visible"> */}
            <SidebarItem
              url="/condensed/"
              title="Dashboard"
              subTitle="12 New Updates"
              icon={<i className="pg-icon">home</i>}
              topMargin="m-t-20"
            />
            {/* </ul> */}
          </PerfectScrollbar>
          <SafeAnchor
            
            className="search-link d-flex justify-content-between align-items-center d-lg-none"
            data-toggle="horizontal-menu"
            id="headerSearchInputCondensed"
          >
            Tap here to search
            <i className="pg-icon float-right">search</i>
          </SafeAnchor>
          <div className="clearfix"></div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    openState: state.QuickView.openMobileSideBar,
  };
};
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
