import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
import Content from "./Content";

const CSV_URL = `${process.env.PUBLIC_URL}/assets/data/projects_data.csv`;

// Utility functions from Dashboard Content
const parseNumeric = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.toLowerCase() === "null" || trimmed === "-") {
    return null;
  }
  const numeric = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const stripHtml = (value) => {
  if (!value) {
    return "";
  }
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const normaliseRow = (row) => {
  const normalised = {};
  Object.keys(row).forEach((key) => {
    const rawValue = row[key];
    if (rawValue === undefined || rawValue === null) {
      normalised[key] = null;
      return;
    }
    const trimmed = String(rawValue).trim();
    if (!trimmed || trimmed.toLowerCase() === "null") {
      normalised[key] = null;
      return;
    }
    normalised[key] = trimmed;
  });

  const numericFields = [
    "plannedProgress",
    "actualProgress",
    "stagePlanProgress",
    "stageActualProgress",
    "approvedBudget",
    "estimatedBudget",
    "totalSpent",
    "designBudget",
    "contractorBudget",
    "supervisionBudget",
    "developmentBudget",
    "contingencyBudget",
    "total_area",
    "gfa",
  ];

  numericFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(normalised, field)) {
      normalised[field] = parseNumeric(normalised[field]);
    }
  });

  if (normalised.approvedBudget == null) {
    normalised.approvedBudget = normalised.estimatedBudget;
  }

  if (normalised.stagePlanProgress != null) {
    normalised.scheduleProgress = normalised.stagePlanProgress;
    normalised.plannedProgress = normalised.stagePlanProgress;
  } else {
    normalised.scheduleProgress = normalised.plannedProgress;
  }

  if (normalised.stageActualProgress != null) {
    normalised.actualProgress = normalised.stageActualProgress;
  }

  normalised.totalArea = normalised.total_area;
  normalised.totalGFA = normalised.gfa;
  normalised.actualSpent = normalised.totalSpent;

  normalised.startDate = normalised.projectStartDate || normalised.stageStartDate;
  normalised.targetCompletionDate =
    normalised.stageEndDate || normalised.CompletionDate || normalised.ActualEndDate;
  normalised.forecastFinishDate =
    normalised.stageForecastCompletion || normalised.ActualEndDate || normalised.CompletionDate;

  normalised.currentStatus =
    normalised.dev_status || normalised.cons_status || normalised.projectSchedule || normalised.projectStage;

  normalised.projectDescriptionText = stripHtml(normalised.projectDescription);

  return normalised;
};

const Component = () => {
	const { projectId } = useParams();
	const [projectData, setProjectData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		const loadProjectData = async () => {
			try {
				setLoading(true);
				console.log('Loading CSV from:', CSV_URL);
				const response = await fetch(CSV_URL);
				if (!response.ok) {
					throw new Error(`Failed to load project data (${response.status})`);
				}
				const csvText = await response.text();
				console.log('CSV loaded, length:', csvText.length);

				Papa.parse(csvText, {
					header: true,
					skipEmptyLines: true,
					complete: (result) => {
						if (!isMounted) {
							return;
						}

						const projects = (result.data || []).map(normaliseRow);
						console.log('Looking for project ID:', projectId);
						console.log('Available project IDs:', projects.slice(0, 10).map(p => p.projectId));
						console.log('Total projects found:', projects.length);

						const project = projects.find(p => p.projectId === projectId);

						if (project) {
							console.log('Found project:', project.projectName);
							setProjectData(project);
							setError(null);
						} else {
							console.log(`Project with ID "${projectId}" not found`);
							const availableIds = projects.map(p => p.projectId).slice(0, 10);
							setError(`Project with ID "${projectId}" not found.\n\nFirst 10 available project IDs:\n• ${availableIds.join('\n• ')}\n\nPlease navigate from the main dashboard or use a valid project ID.`);
						}
						setLoading(false);
					},
					error: (parseError) => {
						if (!isMounted) {
							return;
						}
						setError(parseError.message || "Unable to parse project data");
						setLoading(false);
					},
				});
			} catch (err) {
				if (!isMounted) {
					return;
				}
				setError(err.message || "Unable to load project data");
				setLoading(false);
			}
		};

		if (projectId) {
			loadProjectData();
		}

		return () => {
			isMounted = false;
		};
	}, [projectId]);

	if (loading) {
		return (
			<div className="container-fluid padding-25">
				<div className="row">
					<div className="col-lg-12 text-center">
						<div className="card no-margin">
							<div className="card-body p-40">
								<h4>Loading Project Data...</h4>
								<div className="progress progress-small m-t-20">
									<div className="progress-bar progress-bar-primary" style={{ width: "60%" }}></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container-fluid padding-25">
				<div className="row">
					<div className="col-lg-12 text-center">
						<div className="card no-margin">
							<div className="card-body p-40">
								<h4 className="text-danger">Error Loading Project</h4>
								<p>{error}</p>
								<a href="/condensed/dashboard" className="btn btn-primary">
									Back to Dashboard
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="header">
				<div style={{ display: 'flex', alignItems: 'center', height: '70px', width: '100%', padding: '0', margin: '0' }}>
					{/* Left: IMKAN Logo - Extreme Left */}
					<div style={{ position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, padding: '0 10px' }}>
						<a href="/condensed/dashboard" className="brand inline" style={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0 }}>
							<img
								src="https://www.waleedshah.ae/wp-content/uploads/2018/07/imkan-logo-5922b29939c99-300x129.png"
								alt="IMKAN"
								height={50}
								style={{ objectFit: 'contain' }}
							/>
						</a>
					</div>

					{/* Center: Back to Dashboard Button */}
					<div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 5 }}>
						<a
							href="/condensed/dashboard"
							className="btn btn-primary"
							style={{
								backgroundColor: '#0d6efd',
								borderColor: '#0d6efd',
								color: '#ffffff',
								padding: '8px 16px',
								borderRadius: '6px',
								fontSize: '14px',
								fontWeight: '500',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								boxShadow: '0 2px 4px rgba(13, 110, 253, 0.2)'
							}}
						>
							← Back to Dashboard
						</a>
					</div>
				</div>
			</div>
			<Content projectData={projectData} />
		</>
	);
};

export default Component;
