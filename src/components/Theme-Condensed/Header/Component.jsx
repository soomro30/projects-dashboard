import React from 'react';
import { useSelector } from 'react-redux';

import HeaderContent from './Content';

import './style.css';

const Component = ({ location, inboxHeader, setInboxHeader, onLogout }) => {

  const sideBarStatus = useSelector(state => state.QuickView.openMobileSideBar)

  return (
    <div
      className={`header ${sideBarStatus && (location.pathname !== '/') ? 'headerAlign' : ''}`}
      style={location.pathname === "/google_map" ? { backgroundColor: 'transparent' } : {}}
    >
      {location.pathname.includes("boxed_layout") ?
        <div className="container">
          <div className="header-inner">
            <HeaderContent location={location} inboxHeader={inboxHeader} setInboxHeader={setInboxHeader} onLogout={onLogout}/>
          </div>
        </div>
        :
        <HeaderContent location={location} inboxHeader={inboxHeader} setInboxHeader={setInboxHeader} onLogout={onLogout}/>
      }
    </div>
  )
}

export default Component;