import React from 'react'
import SafeAnchor from '../../../shared/SafeAnchor'

const UserSettings = () => {
    return (
        <ul className="dropdown-menu profile-dropdown" role="menu">
            <li>
                <SafeAnchor><i className="pg-settings_small"></i> Settings</SafeAnchor>
            </li>
            <li>
                <SafeAnchor><i className="pg-outdent"></i> Feedback</SafeAnchor>
            </li>
            <li>
                <SafeAnchor><i className="pg-signals"></i> Help</SafeAnchor>
            </li>
            <li className="bg-master-lighter">
                <SafeAnchor className="clearfix">
                    <span className="pull-left">Logout</span>
                    <span className="pull-right"><i className="pg-power"></i></span>
                </SafeAnchor>
            </li>
        </ul>
    )
}

export default UserSettings
