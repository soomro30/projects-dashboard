import React from "react";

const NotificationList = (props) => {
	return (
		<ul className="notification-list no-margin hidden-sm hidden-xs b-grey b-l b-r no-style p-l-30 p-r-20">
			<li className="p-r-15 inline">
				<div className="dropdown">
					<a
						href="javascript:;"
						id="notification-center"
						className="icon-set globe-fill"
						data-toggle="dropdown"
					>
						<span className="bubble"></span>
					</a>
					{/* START Notification Dropdown */}
					<div
						className="dropdown-menu notification-toggle"
						role="menu"
						aria-labelledby="notification-center"
					>
						{/* START Notification */}
						<div className="notification-panel">
							{/* START Notification Body*/}
							<div className="notification-body scrollable">
								{/* START Notification Item*/}
								<div className="notification-item unread clearfix">
									{/* START Notification Item*/}
									<div className="heading open">
										<a href="javascript:void(0);" className="text-complete pull-left">
											<i className="pg-map fs-16 m-r-10"></i>
											<span className="bold">Carrot Design</span>
											<span className="fs-12 m-l-10">David Nester</span>
										</a>
										<div className="pull-right">
											<div className="thumbnail-wrapper d16 circular inline m-t-15 m-r-10 toggle-more-details">
												<div>
													<i className="fa fa-angle-left"></i>
												</div>
											</div>
											<span className=" time">few sec ago</span>
										</div>
										<div className="more-details">
											<div className="more-details-inner">
												<h5 className="semi-bold fs-16">
													“Apple’s Motivation - Innovation <br />
													distinguishes between <br />A leader and a follower.”
												</h5>
												<p className="small hint-text">
													Commented on john Smiths wall.
													<br /> via pages framework.
												</p>
											</div>
										</div>
									</div>
									{/* END Notification Item*/}
									{/* START Notification Item Right Side*/}
									<div
										className="option"
										data-toggle="tooltip"
										data-placement="left"
										title="mark as read"
									>
										<a href="javascript:void(0);" className="mark"></a>
									</div>
									{/* END Notification Item Right Side*/}
								</div>
								{/* START Notification Body*/}
								{/* START Notification Item*/}
								<div className="notification-item  clearfix">
									<div className="heading">
										<a href="javascript:void(0);" className="text-danger pull-left">
											<i className="fa fa-exclamation-triangle m-r-10"></i>
											<span className="bold">98% Server Load</span>
											<span className="fs-12 m-l-10">Take Action</span>
										</a>
										<span className="pull-right time">2 mins ago</span>
									</div>
									{/* START Notification Item Right Side*/}
									<div className="option">
										<a href="javascript:void(0);" className="mark"></a>
									</div>
									{/* END Notification Item Right Side*/}
								</div>
								{/* END Notification Item*/}
								{/* START Notification Item*/}
								<div className="notification-item  clearfix">
									<div className="heading">
										<a href="javascript:void(0);" className="text-warning-dark pull-left">
											<i className="fa fa-exclamation-triangle m-r-10"></i>
											<span className="bold">Warning Notification</span>
											<span className="fs-12 m-l-10">Buy Now</span>
										</a>
										<span className="pull-right time">yesterday</span>
									</div>
									{/* START Notification Item Right Side*/}
									<div className="option">
										<a href="javascript:void(0);" className="mark"></a>
									</div>
									{/* END Notification Item Right Side*/}
								</div>
								{/* END Notification Item*/}
								{/* START Notification Item*/}
								<div className="notification-item unread clearfix">
									<div className="heading">
										<div className="thumbnail-wrapper d24 circular b-white m-r-5 b-a b-white m-t-10 m-r-10">
											<img
												width="30"
												height="30"
												data-src-retina="assets/img/profiles/1x.jpg"
												data-src="../assets/img/profiles/1.jpg"
												alt=""
												src="../assets/img/profiles/1.jpg"
											/>
										</div>
										<a href="javascript:void(0);" className="text-complete pull-left">
											<span className="bold">Revox Design Labs</span>
											<span className="fs-12 m-l-10">Owners</span>
										</a>
										<span className="pull-right time">11:00pm</span>
									</div>
									{/* START Notification Item Right Side*/}
									<div
										className="option"
										data-toggle="tooltip"
										data-placement="left"
										title="mark as read"
									>
										<a href="javascript:void(0);" className="mark"></a>
									</div>
									{/* END Notification Item Right Side*/}
								</div>
								{/* END Notification Item*/}
							</div>
							{/* END Notification Body*/}
							{/* START Notification Footer*/}
							<div className="notification-footer text-center">
								<a href="javascript:void(0);" className="">
									Read all notifications
								</a>
								<a
									data-toggle="refresh"
									className="portlet-refresh text-black pull-right"
									href="javascript:void(0);"
								>
									<i className="pg-refresh_new"></i>
								</a>
							</div>
							{/* START Notification Footer*/}
						</div>
						{/* END Notification */}
					</div>
					{/* END Notification Dropdown */}
				</div>
			</li>
			<li className="p-r-15 inline">
				<a href="javascript:void(0);" className="icon-set clip "></a>
			</li>
			<li className="p-r-15 inline">
				<a href="javascript:void(0);" className="icon-set grid-box"></a>
			</li>
		</ul>
	);
};

export default NotificationList;
