import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import "./style.css";
import Copyright from "../../ui/Footer/Copyright/Component";
import { filterProjectsByRole } from "../../../utils/auth";

const CSV_URL = `${process.env.PUBLIC_URL}/assets/data/projects_data.csv`;

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const percentFormatter = (value) => {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }
  return `${value.toFixed(1)}%`;
};

const formatCurrency = (value) => {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }
  return (
    <>
      <img className="aed" alt="AED" /> {numberFormatter.format(value)}
    </>
  );
};

const formatLargeNumber = (value) => {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) {
    return "—";
  }

  const absValue = Math.abs(value);
  const dirhamSymbol = <img className="aed" alt="AED" />;

  if (absValue >= 1e12) {
    return (
      <>
        {dirhamSymbol} {(value / 1e12).toFixed(1)}T
      </>
    );
  } else if (absValue >= 1e9) {
    return (
      <>
        {dirhamSymbol} {(value / 1e9).toFixed(1)}B
      </>
    );
  } else if (absValue >= 1e6) {
    return (
      <>
        {dirhamSymbol} {(value / 1e6).toFixed(1)}M
      </>
    );
  } else if (absValue >= 1e3) {
    return (
      <>
        {dirhamSymbol} {(value / 1e3).toFixed(1)}K
      </>
    );
  } else {
    return (
      <>
        {dirhamSymbol} {numberFormatter.format(value)}
      </>
    );
  }
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

  normalised.plannedProgress = parseNumeric(normalised.plannedProgress);
  normalised.actualProgress = parseNumeric(normalised.actualProgress);
  normalised.approvedBudget = parseNumeric(normalised.approvedBudget);
  normalised.totalSpent = parseNumeric(normalised.totalSpent);
  normalised.estimatedBudget = parseNumeric(normalised.estimatedBudget);
  normalised.projectDescriptionText = stripHtml(normalised.projectDescription);

  return normalised;
};

const projectTheme = (value) => {
  const score = Number.isFinite(value) ? value : 0;
  if (score >= 80) {
    return { fill: "bg-complete", text: "text-complete" };
  }
  if (score >= 55) {
    return { fill: "bg-primary", text: "text-primary" };
  }
  return { fill: "bg-danger", text: "text-danger" };
};

const CardProgress = ({ planned, actual }) => {
  const plannedWidth = Math.min(Math.max(planned || 0, 0), 100);
  const actualWidth = Math.min(Math.max(actual || 0, 0), 100);
  const theme = projectTheme(actualWidth);

  return (
    <div className="project-progress">
      <div className="project-progress-stack">
        <div className="project-progress-track"></div>
        <div
          className="project-progress-fill planned"
          style={{ width: `${plannedWidth}%` }}
          title={`Planned: ${percentFormatter(planned ?? NaN)}`}
        ></div>
        <div
          className={`project-progress-fill actual ${theme.fill}`}
          style={{ width: `${actualWidth}%` }}
          title={`Actual: ${percentFormatter(actual ?? NaN)}`}
        ></div>
      </div>
      <div className="d-flex justify-content-between font-montserrat bold m-t-10" style={{ fontSize: "13px", fontWeight: "700 !important", fontFamily: "Inter" }}>
        <span className="text-primary">Planned {percentFormatter(planned ?? NaN)}</span>
        <span className={theme.text}>Actual {percentFormatter(actual ?? NaN)}</span>
      </div>
    </div>
  );
};

const PLACEHOLDER_IMAGE = "https://static.vecteezy.com/system/resources/previews/059/736/991/non_2x/illustrative-landing-page-placeholder-for-under-construction-websites-vector.jpg";
const PROJECT_PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=250&fit=crop&auto=format";

const getProjectImage = (projectId) => {
  if (!projectId) {
    return PROJECT_PLACEHOLDER_IMAGE;
  }

  // Try JPG first, fallback will be handled by onError
  return `http://dashboard.imkan.ae:8081/webroot/images/${projectId}_1.jpg`;
};

const getDevelopmentImage = (developmentName) => {
  const imageMap = {
    "Al Jurf": "http://dashboard.imkan.ae:8081/webroot/images/developments/0001.jpg",
    "Al- Amerah ( National Housing )": "http://dashboard.imkan.ae:8081/webroot/images/developments/m0004.jpg",
    "Makers District": "http://dashboard.imkan.ae:8081/webroot/images/developments/0002.jpg",
    "Nudra": "http://dashboard.imkan.ae:8081/webroot/images/developments/0003.jpg",
    "Special Projects": "http://dashboard.imkan.ae:8081/webroot/images/developments/003.jpg",
    "Srilanka": "http://dashboard.imkan.ae:8081/webroot/images/developments/0005.jpg",
    "Le Carrousel – Rabat": "http://dashboard.imkan.ae:8081/webroot/images/developments/m0001.jpg"
  };

  return imageMap[developmentName] || PLACEHOLDER_IMAGE;
};

const DevelopmentCard = ({ developmentName, projects, onClick }) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => (p.projectStage || "").toLowerCase().includes("complete")).length;
  const ongoingProjects = projects.filter(p =>
    (p.projectStage || "").toLowerCase().includes("construction") ||
    (p.projectStage || "").toLowerCase().includes("design")
  ).length;

  const totalBudget = projects.reduce((sum, p) => sum + (parseNumeric(p.approvedBudget) || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (parseNumeric(p.totalSpent) || 0), 0);

  const completionPercentage = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 m-b-30 p-l-10 p-r-10">
      <div
        className="card card-default project-card"
        style={{ cursor: 'pointer' }}
        onClick={() => onClick(developmentName)}
      >
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="development-image-container" style={{ height: '200px', overflow: 'hidden', borderRadius: '8px', marginBottom: '15px' }}>
                <img
                  src={getDevelopmentImage(developmentName)}
                  alt={developmentName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>

              <h4 className="font-montserrat bold text-master m-b-10">{developmentName}</h4>

              <div className="row m-b-15">
                <div className="col-4 text-center">
                  <h5 className="text-complete bold m-b-5">{totalProjects}</h5>
                  <small className="text-muted">Total Projects</small>
                </div>
                <div className="col-4 text-center">
                  <h5 className="text-success bold m-b-5">{completedProjects}</h5>
                  <small className="text-muted">Completed</small>
                </div>
                <div className="col-4 text-center">
                  <h5 className="text-warning bold m-b-5">{ongoingProjects}</h5>
                  <small className="text-muted">Ongoing</small>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const actualProgress = project.actualProgress ?? null;
  const plannedProgress = project.plannedProgress ?? null;

  const theme = projectTheme(actualProgress);

  // Get dynamic project image based on project ID
  const projectImage = getProjectImage(project.projectId);

  return (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 m-b-30 p-l-10 p-r-10 project-card-column">
      <div className="card card-default project-card h-100">
        {/* Construction Image Header - Increased Height */}
        <div className="card-header p-0" style={{ height: "220px", overflow: "hidden", position: "relative" }}>
          <img
            src={projectImage}
            className="img-responsive"
            alt={`${project.projectName || "Project"} Image`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }}
            onError={(e) => {
              // Try PNG format if JPG fails
              if (e.target.src.includes('.jpg')) {
                e.target.src = e.target.src.replace('.jpg', '.png');
              } else {
                // If both JPG and PNG fail, use project placeholder
                e.target.src = PROJECT_PLACEHOLDER_IMAGE;
              }
            }}
          />
          <div style={{
            position: "absolute",
            top: "15px",
            left: "15px",
            right: "15px",
            zIndex: 2
          }}>
            <div className="d-flex justify-content-between align-items-start">
              <span className={`label text-white ${theme.fill} fs-9 text-uppercase project-stage-label`} style={{ fontWeight: "700", padding: "6px 10px", letterSpacing: "0.5px" }}>
                {project.projectStage || "Stage TBD"}
              </span>
              <h3 className={`font-montserrat bold m-b-0 text-white`} style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                fontSize: "22px",
                fontWeight: "700 !important",
                fontFamily: "Inter"
              }}>
                {percentFormatter(actualProgress ?? NaN)}
              </h3>
            </div>
          </div>

          {/* View Project Link Overlay */}
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            padding: "20px 15px 15px 15px"
          }}>
            <a
              href={`/condensed/project/${project.projectId || 'new'}`}
              className="btn btn-white btn-xs pull-right"
              style={{ fontSize: "11px" }}
            >
              View Project
            </a>
            <div className="clearfix"></div>
          </div>
        </div>

        <div className="card-body" style={{ padding: "12px" }}>
          <div className="m-b-10">
            <h5 className="font-montserrat bold m-b-0 text-master project-name" style={{ fontSize: "14px", lineHeight: "1.2", fontWeight: "700 !important", fontFamily: "Inter" }}>
              {project.projectName || "Untitled Project"}
            </h5>
          </div>

          <CardProgress planned={plannedProgress} actual={actualProgress} />

          {/* Compact Dates Section */}
          <div className="widget-date-section m-t-15 m-b-12" style={{
            background: "linear-gradient(45deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: "8px 10px",
            borderRadius: "4px",
            border: "1px solid #dee2e6"
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="date-item">
                <div className="fs-10 text-uppercase text-muted font-montserrat" style={{ fontWeight: "600", fontSize: "9px" }}>Start</div>
                <div className="font-montserrat bold text-primary" style={{ fontSize: "13px", fontWeight: "700 !important", lineHeight: "1.1", fontFamily: "Inter" }}>
                  {project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                  }) : "—"}
                </div>
              </div>
              <div className="date-separator" style={{
                width: "15px",
                height: "2px",
                background: "#007bff",
                margin: "0 8px"
              }}></div>
              <div className="date-item text-right">
                <div className="fs-10 text-uppercase text-muted font-montserrat" style={{ fontWeight: "600", fontSize: "9px" }}>Target</div>
                <div className="font-montserrat bold text-success" style={{ fontSize: "13px", fontWeight: "700 !important", lineHeight: "1.1", fontFamily: "Inter" }}>
                  {project.ActualEndDate ? new Date(project.ActualEndDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short'
                  }) : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Budget & Team Section */}
          <div style={{
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #e9ecef"
          }}>
            <div className="row no-gutters">
              <div className="col-4">
                <div className="fs-9  text-muted font-montserrat" style={{ fontWeight: "600" }}>Budget</div>
                <div className="font-montserrat bold text-master" style={{ fontSize: "12px", lineHeight: "1.2", fontWeight: "700", fontFamily: "Inter" }}>
                  {formatCurrency(project.approvedBudget)}
                </div>
              </div>
              <div className="col-4">
                <div className="fs-9 text-muted font-montserrat" style={{ fontWeight: "600" }}>Spent</div>
                <div className="font-montserrat bold text-danger" style={{ fontSize: "12px", lineHeight: "1.2", fontWeight: "700", fontFamily: "Inter" }}>
                  {formatCurrency(project.totalSpent)}
                </div>
              </div>
              <div className="col-4">
                <div className="fs-9 text-muted font-montserrat" style={{ fontWeight: "600" }}>Manager</div>
                <div className="bold text-dark text-ellipsis" style={{ fontSize: "11px", lineHeight: "1.2", fontWeight: "600", fontFamily: "Inter" }} title={project.projectManager}>
                  {project.projectManager || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Content = ({ userRole }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("developments"); // "developments" or "projects"
  const [selectedDevelopment, setSelectedDevelopment] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(CSV_URL);
        if (!response.ok) {
          throw new Error(`Failed to load project data (${response.status})`);
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (!isMounted) {
              return;
            }
            const constructionProjects = (result.data || [])
              .map(normaliseRow)
              .filter((row) => {
                const projectName = row.projectName || "";
                const projectCategory = row.projectCategory || "";

                // Filter out projects with Arabic text (allow common punctuation like em-dash)
                const normalizedName = projectName.replace(/[–—]/g, '-'); // Replace em-dash and em-dash with regular dash
                const isEnglish = /^[\x00-\x7F]*$/.test(normalizedName) && projectName.trim() !== "";

                // Filter out Private Projects
                const isNotPrivate = !projectCategory.toLowerCase().includes("private projects");

                return isEnglish && isNotPrivate;
              });

            const filteredProjects = filterProjectsByRole(constructionProjects, userRole);
            setProjects(filteredProjects);
            setError(null);
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

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [userRole]);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) {
      return projects;
    }
    return projects.filter(project =>
      (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.projectManager || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.projectStage || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // Extract development name from development column
  const extractDevelopmentName = (project) => {
    const development = project.development || "";

    // Use development column directly, handle NULL and empty values
    if (!development || development === "NULL" || development.trim() === "") {
      return "Others";
    }

    return development.trim();
  };

  // Group projects by development
  const developmentGroups = useMemo(() => {
    if (!projects.length) return {};

    return projects.reduce((groups, project) => {
      const devName = extractDevelopmentName(project);
      if (!groups[devName]) {
        groups[devName] = [];
      }
      groups[devName].push(project);
      return groups;
    }, {});
  }, [projects]);

  // Get filtered projects based on view mode
  const displayProjects = useMemo(() => {
    if (viewMode === "developments") {
      return []; // We'll show development cards instead
    }

    if (selectedDevelopment && developmentGroups[selectedDevelopment]) {
      // Filter projects within the selected development based on search term
      return developmentGroups[selectedDevelopment].filter(project =>
        (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.projectManager || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.projectStage || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredProjects;
  }, [viewMode, selectedDevelopment, developmentGroups, filteredProjects, searchTerm]);

  const portfolioStats = useMemo(() => {
    if (!projects.length) {
      return {
        totalApproved: 0,
        totalSpent: 0,
        totalDevelopmentCost: 0,
        averageProgress: 0,
        stageStats: {},
        totalProjects: 0,
      };
    }

    const totals = projects.reduce(
      (acc, project) => {
        const approvedBudget = parseNumeric(project.approvedBudget) || 0;
        const totalSpent = parseNumeric(project.totalSpent) || 0;
        const developmentBudget = parseNumeric(project.developmentBudget) || 0;

        acc.totalApproved += approvedBudget;
        acc.totalSpent += totalSpent;
        // Only add valid development budget values
        if (Number.isFinite(developmentBudget) && developmentBudget > 0 && developmentBudget < 1e15) {
          acc.totalDevelopmentCost += developmentBudget;
        }
        acc.progressSum += project.actualProgress || 0;

        // Count projects by stage
        const stage = project.projectStage || "Unknown";
        acc.stageStats[stage] = (acc.stageStats[stage] || 0) + 1;

        return acc;
      },
      {
        totalApproved: 0,
        totalSpent: 0,
        totalDevelopmentCost: 0,
        progressSum: 0,
        stageStats: {}
      }
    );

    return {
      totalApproved: totals.totalApproved,
      totalSpent: totals.totalSpent,
      totalDevelopmentCost: totals.totalDevelopmentCost,
      averageProgress: totals.progressSum / projects.length || null,
      stageStats: totals.stageStats,
      totalProjects: projects.length,
    };
  }, [projects]);

  return (
    <div className="page-content-wrapper">
      <div className="content sm-gutter">
        <div className="container-fluid padding-25 sm-padding-10">
          {/* Overview Heading */}
          <div className="row">
            <div className="col-12">
              <h2 className="font-montserrat bold m-b-20 text-master">Overview</h2>
            </div>
          </div>

          <div className="row m-b-40 metric-cards-row">
            {/* Blue Card - Total Developments */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-primary no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Total Developments
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : Object.keys(developmentGroups).length}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Active Developments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Card - Total Projects */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-success no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Total Projects
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : portfolioStats.totalProjects}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Portfolio Size
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orange Card - Development Cost */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-warning no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-dark">
                            Development Cost
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh text-dark"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h3 className="no-margin text-dark font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : formatLargeNumber(portfolioStats.totalDevelopmentCost)}</h3>
                        <p className="small m-t-5 text-dark opacity-75">
                          Total Development
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teal Card - Total Expenditure */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-complete no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Total Expenditure
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h3 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : formatLargeNumber(portfolioStats.totalSpent)}</h3>
                        <p className="small m-t-5 text-white opacity-75">
                          Actual Spend
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purple Card - Construction Projects */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-primary no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Construction
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh text-white"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : (portfolioStats.stageStats["Construction"] || 0)}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Active Projects
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Card - Design Projects */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-complete no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Design
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh text-white"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : (portfolioStats.stageStats["Design"] || 0)}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          In Design Phase
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Card - Design Tender */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-info no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Design Tender
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : (portfolioStats.stageStats["Design Tender"] || 0)}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Tender Stage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Card - Construction Tender */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-success no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            Construction Tender
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : (portfolioStats.stageStats["Construction Tender"] || 0)}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Tender Stage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Red Card - DLP */}
            <div className="col-xl-1 col-lg-1 col-md-3 col-sm-4 col-6 m-b-10 metric-card-full-width">
              <div className="widget-8 card bg-danger no-margin widget-loader-bar">
                <div className="container-xs-height full-height">
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top">
                      <div className="card-header top-left top-right">
                        <div className="card-title">
                          <span className="font-montserrat fs-11 all-caps text-white">
                            DLP
                          </span>
                        </div>
                        <div className="card-controls">
                          <ul>
                            <li>
                              <a data-toggle="refresh" className="card-refresh" href="javascript:void(0);">
                                <i className="card-icon card-icon-refresh"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row-xs-height">
                    <div className="col-xs-height col-top relative">
                      <div className="p-l-20 full-height d-flex flex-column justify-content-center">
                        <h2 className="no-margin text-white font-montserrat bold" style={{ fontFamily: "Inter", fontWeight: "700" }} style={{ fontFamily: "Inter", fontWeight: "700" }}>{loading ? "…" : (portfolioStats.stageStats["DLP"] || 0)}</h2>
                        <p className="small m-t-5 text-white opacity-75">
                          Defects Liability
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          {/* Navigation Header */}
          <div className="row">
            <div className="col-md-8 col-12">
              {viewMode === "developments" ? (
                <h2 className="font-montserrat bold m-b-20 text-master">
                  {loading ? "…" : Object.keys(developmentGroups).length} Developments
                </h2>
              ) : (
                <div>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setViewMode("developments");
                            setSelectedDevelopment(null);
                          }}
                          className="text-master"
                        >
                          Developments
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        {selectedDevelopment}
                      </li>
                    </ol>
                  </nav>
                  <h2 className="font-montserrat bold m-b-20 text-master">
                    {loading ? "…" : displayProjects.length} Projects in {selectedDevelopment}
                  </h2>
                </div>
              )}
            </div>
            <div className="col-md-4 col-12">
              {viewMode === "projects" && (
                <div className="form-group input-group m-b-20">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="input-group-text input-group-append">
                    <i className="pg-icon">search</i>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            {loading && !projects.length ? (
              <div className="col-12">
                <div className="card card-default project-card loading-card">
                  <div className="card-body text-center p-t-40 p-b-40">
                    <div className="progress-circle-indeterminate progress-circle-small m-b-15"></div>
                    <p className="text-muted">Loading construction projects…</p>
                  </div>
                </div>
              </div>
            ) : null}
            {!loading && projects.length === 0 && !error ? (
              <div className="col-12">
                <div className="card card-default project-card">
                  <div className="card-body text-center p-t-40 p-b-40">
                    <h5 className="font-montserrat bold">No construction projects found</h5>
                    <p className="text-muted m-b-0">
                      Update the portfolio data to see construction activity here.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            {viewMode === "developments" ? (
              // Show development cards sorted by project count (descending)
              Object.entries(developmentGroups)
                .sort(([,a], [,b]) => b.length - a.length)
                .map(([developmentName, developmentProjects]) => (
                <DevelopmentCard
                  key={developmentName}
                  developmentName={developmentName}
                  projects={developmentProjects}
                  onClick={(devName) => {
                    setSelectedDevelopment(devName);
                    setViewMode("projects");
                    setSearchTerm(""); // Clear search when switching to projects
                  }}
                />
              ))
            ) : (
              // Show project cards
              displayProjects.map((project) => (
                <ProjectCard key={project.projectId || project.projectName} project={project} />
              ))
            )}
          </div>
        </div>
      </div>
      <Copyright
        year={"2024"}
        brand={"IMKAN"}
        reserved={"All rights reserved."}
        terms={"Terms of use"}
        policy={"Privacy Policy"}
      />
    </div>
  );
};

export default Content;
