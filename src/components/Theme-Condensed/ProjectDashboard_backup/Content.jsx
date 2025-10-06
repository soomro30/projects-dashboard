import React, { useEffect, useMemo, useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { ReactSkycon } from 'react-skycons-extended';
import { AgCharts } from "ag-charts-react";
import "ag-charts-enterprise";

// import component
import Copyright from "../../ui/Footer/Copyright/Component";

//import ui widgets component
import GraphWidget from "../../ui/widget/GraphWidget/Component";
import GraphTitleWidget from "../../ui/widget/GraphTitleWidget/Component";
import PlainLiveWidget from "../../ui/widget/PlainLiveWidget/Component";
import GraphLiveWidget from "../../ui/widget/GraphLiveWidget/Component";
import BarDoubleWidget from "../../ui/widget/BarDoubleStackWidget/Component";
import LineAreaGraphWidget from "../../ui/widget/LineAreaGraphWidget/Component";
import ServerLoadWidget from "../../ui/widget/ServerLoadWidget/Component";
import SaleStackBar from "../../ui/widget/SaleStackBarWidget/Component";
import MapWidget from "../../ui/widget/MapWidget/Component";
import LineChartArea from "../../ui/widget/LineChartAreaWidget/Component";
import StackedBarChart from "../../ui/widget/BarDoubleStackWidget/Component";

import "./style.css";

//import images
import profileImage from '../../../assets/img/profiles/3x.jpg';
import SocialPostImage from '../../../assets/img/social-post-image.png';

const Content = ({ projectData }) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [showImageModal, setShowImageModal] = useState(false);
	const dashboardRef = useRef(null);

	const handleImageClick = (imageUrl, title) => {
		setSelectedImage({ url: imageUrl, title });
		setShowImageModal(true);
	};

	const closeImageModal = () => {
		setShowImageModal(false);
		setSelectedImage(null);
	};

	const handleDownloadPDF = async () => {
		if (!dashboardRef.current) return;

		const originalButton = document.querySelector('button[data-pdf-export]');

		try {
			const element = dashboardRef.current;
			const projectName = projectData?.name || 'Project';

			if (originalButton) {
				originalButton.disabled = true;
				originalButton.textContent = 'Generating PDF...';
			}

			await new Promise(resolve => setTimeout(resolve, 2000));

			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: false,
				allowTaint: true,
				backgroundColor: '#f4f4f4',
				logging: false,
				scrollY: -window.scrollY,
				scrollX: -window.scrollX,
				windowWidth: element.scrollWidth,
				windowHeight: element.scrollHeight,
				ignoreElements: (el) => {
					if (el.tagName === 'CANVAS' && (el.width === 0 || el.height === 0)) {
						return true;
					}
					if (el.tagName === 'IMG') {
						const src = el.getAttribute('src');
						if (src && src.includes('dashboard.imkan.ae')) {
							return true;
						}
					}
					return false;
				},
				onclone: (clonedDoc) => {
					const allElements = clonedDoc.querySelectorAll('*');
					allElements.forEach(el => {
						const styles = clonedDoc.defaultView.getComputedStyle(el);
						const bgImage = styles.backgroundImage;

						if (bgImage && bgImage !== 'none' && bgImage.includes('dashboard.imkan.ae')) {
							el.style.backgroundImage = 'none';
						}
					});

					const canvases = clonedDoc.querySelectorAll('canvas');
					canvases.forEach(c => {
						if (c.width === 0 || c.height === 0) {
							c.remove();
						}
					});

					const images = clonedDoc.querySelectorAll('img');
					images.forEach(img => {
						const src = img.getAttribute('src');
						if (src && src.includes('dashboard.imkan.ae')) {
							img.remove();
						}
					});
				}
			});

			const imgData = canvas.toDataURL('image/jpeg', 0.95);

			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'mm',
				format: 'a4',
				compress: true
			});

			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();

			const imgWidth = canvas.width;
			const imgHeight = canvas.height;
			const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

			const imgX = (pdfWidth - imgWidth * ratio) / 2;
			const imgY = 10;

			pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

			const filename = `${projectName}_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
			pdf.save(filename);

			if (originalButton) {
				originalButton.disabled = false;
				originalButton.innerHTML = '<span style="font-size: 14px">📄</span> Download PDF';
			}

		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Failed to generate PDF. Please try again.');

			if (originalButton) {
				originalButton.disabled = false;
				originalButton.innerHTML = '<span style="font-size: 14px">📄</span> Download PDF';
			}
		}
	};
	const formatCurrency = (value) => {
		if (!value) return (
			<>
				<img className="aed" alt="AED" /> 0
			</>
		);
		const numValue = typeof value === 'string' ?
			parseFloat(value.replace(/[^\d.-]/g, '')) : value;
		if (isNaN(numValue)) return (
			<>
				<img className="aed" alt="AED" /> 0
			</>
		);
		return (
			<>
				<img className="aed" alt="AED" /> {numValue.toLocaleString()}
			</>
		);
	};

	const formatCurrencyShort = (value) => {
		if (!value) return (
			<>
				<img className="aed" alt="AED" /> 0
			</>
		);
		const numValue = typeof value === 'string' ?
			parseFloat(value.replace(/[^\d.-]/g, '')) : value;
		if (isNaN(numValue)) return (
			<>
				<img className="aed" alt="AED" /> 0
			</>
		);

		if (numValue >= 1000000000) {
			return (
				<>
					<img className="aed" alt="AED" /> {(numValue / 1000000000).toFixed(1)}B
				</>
			);
		} else if (numValue >= 1000000) {
			return (
				<>
					<img className="aed" alt="AED" /> {(numValue / 1000000).toFixed(1)}M
				</>
			);
		} else {
			return (
				<>
					<img className="aed" alt="AED" /> {numValue.toLocaleString()}
				</>
			);
		}
	};

	const formatNumberShort = (value) => {
		if (!value) return "0";
		const numValue = typeof value === 'string' ?
			parseFloat(value.replace(/[^\d.-]/g, '')) : value;
		if (isNaN(numValue)) return "0";

		if (numValue >= 1000000000) {
			return `${(numValue / 1000000000).toFixed(1)}B`;
		} else if (numValue >= 1000000) {
			return `${(numValue / 1000000).toFixed(1)}M`;
		} else if (numValue >= 1000) {
			return `${(numValue / 1000).toFixed(1)}K`;
		} else {
			return numValue.toLocaleString();
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		try {
			const date = new Date(dateString);
			if (Number.isNaN(date.getTime())) {
				return dateString;
			}
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return dateString;
		}
	};

	const formatPercentage = (value) => {
		if (value === null || value === undefined) return "0%";
		const numValue = typeof value === 'string' ?
			parseFloat(value.replace(/[^\d.-]/g, '')) : value;
		if (isNaN(numValue)) return "0%";
		return `${numValue.toFixed(1)}%`;
	};

	const safeParseFloat = (value) => {
		if (!value) return 0;
		const numValue = typeof value === 'string' ?
			parseFloat(value.replace(/[^\d.-]/g, '')) : parseFloat(value);
		return isNaN(numValue) ? 0 : numValue;
	};

	const extractCoordinateComponent = (value, axis) => {
		if (value === null || value === undefined) return null;
		if (typeof value === 'number') {
			return Number.isNaN(value) ? null : value;
		}
		if (typeof value === 'string') {
			const matches = value.match(/-?\d+(?:\.\d+)?/g);
			if (matches && matches.length > 0) {
				const index = axis === 'lat' ? 0 : Math.min(1, matches.length - 1);
				const parsed = parseFloat(matches[index]);
				return Number.isNaN(parsed) ? null : parsed;
			}
			return null;
		}
		if (Array.isArray(value)) {
			const index = axis === 'lat' ? 0 : 1;
			if (value.length > index) {
				return extractCoordinateComponent(value[index], axis);
			}
			return null;
		}
		if (typeof value === 'object') {
			const axisKeys = axis === 'lat'
				? ['lat', 'latitude', 'y']
				: ['lng', 'long', 'longitude', 'x'];
			for (const key of axisKeys) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					const extracted = extractCoordinateComponent(value[key], axis);
					if (extracted !== null) {
						return extracted;
					}
				}
			}
			const numericKeys = axis === 'lat' ? ['0'] : ['1'];
			for (const key of numericKeys) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					const extracted = extractCoordinateComponent(value[key], axis);
					if (extracted !== null) {
						return extracted;
					}
				}
			}
		}
		return null;
	};

	const toPercentageValue = (value) => {
		if (value === null || value === undefined) return null;
		const numeric = safeParseFloat(value);
		if (Number.isNaN(numeric)) return null;
		return Math.min(100, Math.max(0, numeric));
	};

	const parseDateValue = (value) => {
		if (!value) return null;
		if (value instanceof Date) {
			return Number.isNaN(value.getTime()) ? null : value;
		}
		if (typeof value === 'number') {
			const fromNumeric = new Date(value);
			return Number.isNaN(fromNumeric.getTime()) ? null : fromNumeric;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) return null;
			const parsed = new Date(trimmed);
			if (!Number.isNaN(parsed.getTime())) {
				return parsed;
			}
			const asNumber = Number(trimmed);
			if (!Number.isNaN(asNumber)) {
				const fromNumber = new Date(asNumber);
				return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
			}
		}
		return null;
	};

	const addDays = (date, days) => {
		const clone = new Date(date.getTime());
		clone.setDate(clone.getDate() + days);
		return clone;
	};

	const ensureFutureDate = (candidate, reference, fallbackDays = 180) => {
		if (!reference) return candidate || null;
		if (!candidate || candidate <= reference) {
			return addDays(reference, fallbackDays);
		}
		return candidate;
	};

	const buildCurvePoints = (points) => {
		return points
			.filter((point) => point && point.date instanceof Date && !Number.isNaN(point.date.getTime()) && typeof point.value === 'number')
			.sort((a, b) => a.date - b.date);
	};

	const interpolateValue = (date, points) => {
		if (!points.length) return 0;
		if (date <= points[0].date) {
			return points[0].value;
		}
		const lastPoint = points[points.length - 1];
		if (date >= lastPoint.date) {
			return lastPoint.value;
		}
		for (let index = 0; index < points.length - 1; index += 1) {
			const current = points[index];
			const next = points[index + 1];
			if (date >= current.date && date <= next.date) {
				const span = next.date.getTime() - current.date.getTime();
				if (span === 0) {
					return next.value;
				}
				const elapsed = date.getTime() - current.date.getTime();
				const ratio = elapsed / span;
				return current.value + (next.value - current.value) * ratio;
			}
		}
		return lastPoint.value;
	};

	const generateCurveDataset = (startDate, endDate, plannedPoints, actualPoints, segments = 16) => {
		if (!(startDate instanceof Date) || !(endDate instanceof Date)) return [];
		if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return [];
		if (endDate <= startDate) return [];
		const totalDuration = endDate.getTime() - startDate.getTime();
		const plannedCurve = buildCurvePoints(plannedPoints);
		const actualCurve = buildCurvePoints(actualPoints);
		const data = [];
		let lastPlanned = 0;
		let lastActual = 0;
		for (let step = 0; step <= segments; step += 1) {
			const ratio = step / segments;
			const timestamp = startDate.getTime() + totalDuration * ratio;
			const currentDate = new Date(timestamp);
			let plannedValue = interpolateValue(currentDate, plannedCurve);
			let actualValue = interpolateValue(currentDate, actualCurve);
			plannedValue = Math.min(100, Math.max(lastPlanned, plannedValue));
			actualValue = Math.min(100, Math.max(lastActual, actualValue));
			lastPlanned = plannedValue;
			lastActual = actualValue;
			data.push({
				date: currentDate,
				planned: Math.round(plannedValue * 10) / 10,
				actual: Math.round(actualValue * 10) / 10
			});
		}
		return data;
	};

	const getProjectValue = (...keys) => {
		if (!projectData) return null;
		for (const key of keys) {
			if (!Object.prototype.hasOwnProperty.call(projectData, key)) {
				continue;
			}
			const rawValue = projectData[key];
			if (rawValue === null || rawValue === undefined) {
				continue;
			}
			if (typeof rawValue === 'string') {
				const trimmed = rawValue.trim();
				if (!trimmed || trimmed.toLowerCase() === 'null') {
					continue;
				}
			}
			return rawValue;
		}
		return null;
	};

	const calculateBudgetUtilization = () => {
		const spent = safeParseFloat(getProjectValue(
			'totalSpent',
			'total_spent',
			'actualSpent',
			'actual_spent',
			'spent',
			'expenditure'
		));
		const budget = safeParseFloat(getProjectValue(
			'approvedBudget',
			'approved_budget',
			'totalBudget',
			'total_budget',
			'budget',
			'estimatedBudget',
			'developmentBudget',
			'development_budget',
			'contractValue',
			'contract_value'
		));
		if (budget === 0) return 0;
		return (spent / budget * 100);
	};

	const getBudgetColor = () => {
		const utilization = calculateBudgetUtilization();
		if (utilization > 90) return '#dc3545'; // Red
		if (utilization > 75) return '#ffc107'; // Yellow
		return '#28a745'; // Green
	};

	if (!projectData) {
		return (
			<div className="page-content-wrapper ">
				<div className="content sm-gutter">
					<div className="container-fluid padding-25 sm-padding-10">
						<div className="row">
							<div className="col-lg-12 text-center">
								<h4>No project data available</h4>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const approvedBudgetValue = getProjectValue(
		'approvedBudget',
		'approved_budget',
		'totalBudget',
		'total_budget',
		'budget',
		'estimatedBudget',
		'developmentBudget',
		'development_budget',
		'contractValue',
		'contract_value'
	);

	const totalSpentValue = getProjectValue(
		'totalSpent',
		'total_spent',
		'actualSpent',
		'actual_spent',
		'spent',
		'expenditure'
	);

	const variationValue = getProjectValue(
		'variations',
		'variation',
		'variationAmount',
		'variation_amount',
		'changeOrders',
		'change_orders'
	);

	const designBudgetValue = getProjectValue(
		'designBudget',
		'design_budget',
		'designCost',
		'design_cost'
	);

	const contractorBudgetValue = getProjectValue(
		'contractorBudget',
		'contractor_budget',
		'contractorCost',
		'contractor_cost'
	);

	const supervisionBudgetValue = getProjectValue(
		'supervisionBudget',
		'supervision_budget',
		'supervisionCost',
		'supervision_cost'
	);

	const developmentBudgetValue = getProjectValue(
		'developmentBudget',
		'development_budget',
		'developmentCost',
		'development_cost'
	);

	const contingencyBudgetValue = getProjectValue(
		'contingencyBudget',
		'contingency_budget',
		'contingencyCost',
		'contingency_cost'
	);

	const developmentAreaValue = getProjectValue(
		'totalArea',
		'total_area',
		'developmentArea',
		'development_area'
	);

	const developmentGFAValue = getProjectValue(
		'totalGFA',
		'total_gfa',
		'gfa'
	);

	const remainingBudgetValue = safeParseFloat(approvedBudgetValue) - safeParseFloat(totalSpentValue);
	const approvedBudgetNumeric = safeParseFloat(approvedBudgetValue);
	const spentNumeric = safeParseFloat(totalSpentValue);
	const variationNumeric = safeParseFloat(variationValue);
	const remainingNumeric = remainingBudgetValue;
	const budgetUtilizationPercent = approvedBudgetNumeric > 0
		? Math.min(100, Math.max(0, (spentNumeric / approvedBudgetNumeric) * 100))
		: 0;
	const variationPercent = approvedBudgetNumeric > 0 ? (variationNumeric / approvedBudgetNumeric) * 100 : null;
	const isOverBudget = remainingNumeric < 0;

	const budgetBreakdown = useMemo(() => {
		const items = [
			{ label: 'Design Budget', value: designBudgetValue },
			{ label: 'Contractor Budget', value: contractorBudgetValue },
			{ label: 'Supervision Budget', value: supervisionBudgetValue },
			{ label: 'Development Budget', value: developmentBudgetValue },
			{ label: 'Contingency Budget', value: contingencyBudgetValue }
		];

		return items
			.filter((item) => item.value !== null && item.value !== undefined && item.value !== '')
			.map((item) => {
				const numericValue = safeParseFloat(item.value);
				return {
					...item,
					numericValue,
					share: approvedBudgetNumeric > 0 ? (numericValue / approvedBudgetNumeric) * 100 : 0
				};
			});
	}, [approvedBudgetNumeric, designBudgetValue, contractorBudgetValue, supervisionBudgetValue, developmentBudgetValue, contingencyBudgetValue]);



	const progress = (
		<React.Fragment>
			<div
				className="card-progress"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", display: "block" }}
			></div>
		</React.Fragment>
	);

	const [refreshOne, setRefreshOne] = useState(false);
	const [refreshTwo, setRefreshTwo] = useState(false);
	const [refreshThree, setRefreshThree] = useState(false);
	const [refreshFour, setRefreshFour] = useState(false);
	const [refreshFive, setRefreshFive] = useState(false);

	const PROJECT_WEBROOT_URL = 'http://dashboard.imkan.ae:8081/webroot/';
	const PROJECT_IMAGE_BASE_URL = `${PROJECT_WEBROOT_URL}images/`;
	const PROJECT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
	const PROJECT_IMAGE_FALLBACK_MODAL = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';

	const projectIdentifierRaw = getProjectValue(
		'projectId',
		'project_id',
		'ProjectId',
		'ProjectID',
		'projectID',
		'id',
		'Id',
		'projectCode',
		'project_code',
		'ProjectCode'
	);

	const projectIdentifier = useMemo(() => {
		if (projectIdentifierRaw === null || projectIdentifierRaw === undefined) {
			return '';
		}
		if (typeof projectIdentifierRaw === 'number') {
			return String(projectIdentifierRaw);
		}
		if (typeof projectIdentifierRaw === 'string') {
			const trimmed = projectIdentifierRaw.trim();
			return trimmed;
		}
		return '';
	}, [projectIdentifierRaw]);

	const directProjectImageCandidates = useMemo(() => {
		if (!projectData) {
			return [];
		}
		const potentialSources = [
			projectData.imageOneURL,
			projectData.projectProgressImage1,
			projectData.projectProgressImage2,
			projectData.projectProgressImage3,
			projectData.image1Name,
			projectData.image2Name,
			projectData.image3Name,
			projectData.image4Name,
			projectData.image5Name,
			projectData.image6Name,
			projectData.image7Name,
			projectData.image8Name
		];
		const unique = [];
		for (const rawValue of potentialSources) {
			if (!rawValue) {
				continue;
			}
			const value = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue);
			if (!value || value.toLowerCase() === 'null' || value === '-') {
				continue;
			}
			const isAbsolute = /^https?:/i.test(value);
			const normalizedPath = isAbsolute
				? value
				: (() => {
					const withoutLeadingSlash = value.replace(/^\/+/, '');
					const withoutDuplicateWebroot = withoutLeadingSlash.startsWith('webroot/')
						? withoutLeadingSlash.substring('webroot/'.length)
						: withoutLeadingSlash;
					return `${PROJECT_WEBROOT_URL}${encodeURI(withoutDuplicateWebroot)}`;
				})();
			if (!unique.includes(normalizedPath)) {
				unique.push(normalizedPath);
			}
		}
		return unique;
	}, [projectData]);

	const projectImageCandidates = useMemo(() => {
		if (!projectIdentifier) {
			return directProjectImageCandidates;
		}
		const safeIdentifier = encodeURIComponent(projectIdentifier);
		const extensions = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
		const generated = extensions.map((extension) => `${PROJECT_IMAGE_BASE_URL}${safeIdentifier}_1.${extension}`);
		const combined = [...directProjectImageCandidates];
		for (const candidate of generated) {
			if (!combined.includes(candidate)) {
				combined.push(candidate);
			}
		}
		return combined;
	}, [directProjectImageCandidates, projectIdentifier]);

	const [projectImageCandidateIndex, setProjectImageCandidateIndex] = useState(0);

	useEffect(() => {
		setProjectImageCandidateIndex(0);
	}, [projectImageCandidates.length, projectIdentifier]);

	const isUsingFallbackProjectImage = projectImageCandidateIndex >= projectImageCandidates.length || !projectImageCandidates.length;
	const currentProjectImageUrl = isUsingFallbackProjectImage
		? PROJECT_IMAGE_FALLBACK
		: projectImageCandidates[projectImageCandidateIndex];
	const modalProjectImageUrl = isUsingFallbackProjectImage
		? PROJECT_IMAGE_FALLBACK_MODAL
		: projectImageCandidates[projectImageCandidateIndex];

	const projectImageTitle = projectData?.projectName
		? `${projectData.projectName} Image`
		: 'Project Image';

	const handleProjectImageError = () => {
		if (!projectImageCandidates.length) {
			return;
		}
		setProjectImageCandidateIndex((previousIndex) => {
			const nextIndex = previousIndex + 1;
			if (nextIndex < projectImageCandidates.length) {
				return nextIndex;
			}
			if (previousIndex >= projectImageCandidates.length) {
				return previousIndex;
			}
			return projectImageCandidates.length;
		});
	};

	// Dummy data for testing
	const dummyUpdates = [
		{ date: '2023-10-01', description: 'Initial project kickoff meeting held.' },
		{ date: '2023-11-15', description: 'Design phase completed successfully.' },
		{ date: '2023-12-20', description: 'Construction started on site.' }
	];
	const dummyRisks = [
		{ category: 'Budget', description: 'Potential cost overrun due to material price increase.' },
		{ category: 'Timeline', description: 'Delay risk due to weather conditions.' },
		{ category: 'Resource', description: 'Shortage of skilled labor for critical tasks.' }
	];

	const timelineStartDate = getProjectValue(
		'projectStartDate',
		'project_start_date',
		'startDate',
		'StartDate',
		'stageStartDate',
		'stage_start_date'
	);
	const timelinePlannedFinish = getProjectValue(
		'CompletionDate',
		'completionDate',
		'completion_date',
		'targetCompletionDate',
		'target_completion_date',
		'stageEndDate',
		'stage_end_date',
		'ActualEndDate',
		'actualEndDate',
		'actual_end_date'
	);
	const timelineForecastFinish = getProjectValue(
		'ActualEndDate',
		'actualEndDate',
		'actual_end_date',
		'forecastFinishDate',
		'forecast_finish_date',
		'stageForecastCompletion',
		'stage_forecast_completion',
		'CompletionDate',
		'completionDate',
		'completion_date'
	);

	const latitudeSource = getProjectValue('latitude', 'Latitude', 'lat', 'Lat');
	const longitudeSource = getProjectValue('longitude', 'Longitude', 'lng', 'Lon', 'long');

	const derivedLatitude = [latitudeSource, longitudeSource].reduce((result, source) => {
		if (result !== null) return result;
		return extractCoordinateComponent(source, 'lat');
	}, null);
	const derivedLongitude = [longitudeSource, latitudeSource].reduce((result, source) => {
		if (result !== null) return result;
		return extractCoordinateComponent(source, 'lon');
	}, null);

	const parsedStartDate = parseDateValue(timelineStartDate) || new Date();
	const progressUpdateDateRaw = getProjectValue(
		'progressUpdateDate',
		'progress_update_date',
		'lastProgressDate',
		'last_progress_date',
		'updateDate',
		'update_date',
		'lastUpdate',
		'last_update'
	);
	let progressAsOfDate = parseDateValue(progressUpdateDateRaw) || new Date();
	if (progressAsOfDate < parsedStartDate) {
		progressAsOfDate = parsedStartDate;
	}

	const plannedFinishCandidate = parseDateValue(timelinePlannedFinish);
	const plannedFinishDate = ensureFutureDate(plannedFinishCandidate, parsedStartDate, 150) || addDays(parsedStartDate, 150);

	const rawPlannedProgress = getProjectValue(
		'plannedProgress',
		'planned_progress',
		'stagePlanProgress',
		'stage_plan_progress'
	);
	const rawActualProgress = getProjectValue(
		'actualProgress',
		'actual_progress',
		'stageActualProgress',
		'stage_actual_progress'
	);

	const fallbackPlannedProgress = (() => {
		if (!(plannedFinishDate instanceof Date) || !(parsedStartDate instanceof Date)) return 0;
		const totalDuration = plannedFinishDate.getTime() - parsedStartDate.getTime();
		if (totalDuration <= 0) return 0;
		const elapsed = Math.max(0, Math.min(totalDuration, progressAsOfDate.getTime() - parsedStartDate.getTime()));
		return (elapsed / totalDuration) * 100;
	})();

	const plannedProgress = toPercentageValue(rawPlannedProgress) ?? Math.round(fallbackPlannedProgress * 10) / 10;
	const actualProgress = toPercentageValue(rawActualProgress) ?? 0;

	const forecastFinishCandidate = parseDateValue(timelineForecastFinish);
	let actualCompletionDate = actualProgress >= 100
		? progressAsOfDate
		: ensureFutureDate(forecastFinishCandidate, progressAsOfDate, 120) || plannedFinishDate;
	if (actualCompletionDate < progressAsOfDate) {
		actualCompletionDate = progressAsOfDate;
	}

	const overallEndDate = plannedFinishDate && actualCompletionDate
		? new Date(Math.max(plannedFinishDate.getTime(), actualCompletionDate.getTime()))
		: plannedFinishDate || actualCompletionDate;

	const scurveData = useMemo(() => {
		if (!(parsedStartDate instanceof Date) || !(overallEndDate instanceof Date)) return [];
		const plannedPoints = [
			parsedStartDate && { date: parsedStartDate, value: 0 },
			progressAsOfDate && { date: progressAsOfDate, value: plannedProgress },
			plannedFinishDate && { date: plannedFinishDate, value: 100 }
		];
		const actualPoints = [
			parsedStartDate && { date: parsedStartDate, value: 0 },
			progressAsOfDate && { date: progressAsOfDate, value: actualProgress },
			actualCompletionDate && { date: actualCompletionDate, value: 100 }
		];
		return generateCurveDataset(parsedStartDate, overallEndDate, plannedPoints, actualPoints);
	}, [
		parsedStartDate ? parsedStartDate.getTime() : null,
		overallEndDate ? overallEndDate.getTime() : null,
		plannedProgress,
		actualProgress,
		progressAsOfDate ? progressAsOfDate.getTime() : null,
		plannedFinishDate ? plannedFinishDate.getTime() : null,
		actualCompletionDate ? actualCompletionDate.getTime() : null
	]);

	const scurveOptions = useMemo(() => {
		if (!scurveData.length) return null;
		const crossLines = [];
		const chartWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
		const isCompact = chartWidth < 1200;
		const plannedLabelText = plannedFinishDate && isCompact
			? 'Planned Finish'
			: `Planned Finish (${formatDate(plannedFinishDate)})`;
		const forecastLabelText = actualCompletionDate && isCompact
			? 'Forecast Finish'
			: `Forecast Finish (${formatDate(actualCompletionDate)})`;
		const seenCrossLineTimes = new Set();
		const addCrossLine = (date, config) => {
			if (!(date instanceof Date)) return;
			const time = date.getTime();
			if (Number.isNaN(time) || seenCrossLineTimes.has(time)) return;
			seenCrossLineTimes.add(time);
			crossLines.push(config);
		};
		addCrossLine(plannedFinishDate, {
				type: 'line',
				value: plannedFinishDate,
				stroke: '#0d6efd',
				strokeOpacity: 0.6,
				lineDash: [6, 4],
				label: {
					text: plannedLabelText,
					fontSize: 12,
					padding: isCompact ? 4 : 6,
					color: '#0d6efd',
					position: isCompact ? 'top' : 'top'
				}
			});
		addCrossLine(actualCompletionDate, {
				type: 'line',
				value: actualCompletionDate,
				stroke: '#198754',
				strokeOpacity: 0.6,
				lineDash: [4, 4],
				label: {
					text: forecastLabelText,
					fontSize: 12,
					padding: isCompact ? 4 : 6,
					color: '#198754',
					position: isCompact ? 'bottom' : 'topRight'
				}
			});
		addCrossLine(progressAsOfDate, {
				type: 'line',
				value: progressAsOfDate,
				stroke: '#6c757d',
				strokeOpacity: 0.4,
				lineDash: [2, 4],
				label: {
					text: `Reporting (${formatDate(progressAsOfDate)})`,
					fontSize: 12,
					padding: 6,
					color: '#6c757d',
					position: 'bottom'
				}
		});
		return {
			autoSize: true,
			background: { fill: 'transparent' },
			data: scurveData,
			axes: [
				{
					type: 'time',
					position: 'bottom',
						label: {
							fontSize: 12,
							color: '#495057',
							formatter: ({ value }) => `${new Date(value).getFullYear()}`
						},
					title: {
						text: 'Timeline',
						fontSize: 13,
						color: '#495057'
					},
					tick: {
						interval: { count: 6 }
					},
					crossLines
				},
				{
					type: 'number',
					position: 'left',
					min: 0,
					max: 105,
					title: {
						text: 'Progress (%)',
						fontSize: 13,
						color: '#495057'
					},
					label: {
						fontSize: 12,
						color: '#495057',
						formatter: ({ value }) => `${value}%`
					},
					nice: false,
					gridLine: {
						style: [{ stroke: '#e9ecef', lineDash: [4, 4] }]
					}
				}
			],
			series: [
				{
					type: 'area',
					xKey: 'date',
					yKey: 'planned',
					yName: 'Planned',
					fill: 'rgba(13,110,253,0.15)',
					stroke: '#0d6efd',
					strokeWidth: 3,
					marker: {
						size: 6,
						strokeWidth: 2,
						fill: '#0d6efd',
						stroke: '#ffffff'
					},
					tooltip: {
						renderer: ({ datum, yKey, yName }) => ({
							title: formatDate(datum.date),
							content: `${yName}: ${datum[yKey].toFixed(1)}%`
						})
					}
				},
				{
					type: 'line',
					xKey: 'date',
					yKey: 'actual',
					yName: 'Actual',
					stroke: '#198754',
					strokeWidth: 4,
					marker: {
						size: 7,
						strokeWidth: 2,
						fill: '#198754',
						stroke: '#ffffff'
					},
					tooltip: {
						renderer: ({ datum, yKey, yName }) => ({
							title: formatDate(datum.date),
							content: `${yName}: ${datum[yKey].toFixed(1)}%`
						})
					}
				}
			],
			legend: {
				enabled: false
			},
			highlightStyle: {
				series: {
					dimOpacity: 0.1,
					strokeWidth: 4
				}
			},
			padding: {
				top: 15,
				right: 24,
				bottom: 25,
				left: 60
			}
		};
	}, [
		scurveData,
		plannedFinishDate ? plannedFinishDate.getTime() : null,
		actualCompletionDate ? actualCompletionDate.getTime() : null,
		progressAsOfDate ? progressAsOfDate.getTime() : null
	]);

	const varianceBaseline = Number.isFinite(actualProgress) && Number.isFinite(plannedProgress)
		? actualProgress - plannedProgress
		: 0;
	const progressVariance = Math.round(varianceBaseline * 10) / 10;
	const varianceIsPositive = progressVariance >= 0;
	const varianceColor = varianceIsPositive ? '#198754' : '#dc3545';
	const varianceBackground = varianceIsPositive ? 'rgba(25,135,84,0.12)' : 'rgba(220,53,69,0.12)';
	const varianceLabel = `${varianceIsPositive ? '+' : ''}${progressVariance.toFixed(1)}%`;

	const DAY_IN_MS = 1000 * 60 * 60 * 24;
	const scheduleDeltaDays = (plannedFinishDate instanceof Date && actualCompletionDate instanceof Date)
		? Math.round((actualCompletionDate.getTime() - plannedFinishDate.getTime()) / DAY_IN_MS)
		: 0;
	const scheduleIsDelayed = scheduleDeltaDays > 0;
	const scheduleIsAhead = scheduleDeltaDays < 0;
	const scheduleBadgeColor = scheduleIsDelayed ? '#dc3545' : (scheduleIsAhead ? '#198754' : '#0d6efd');
	const scheduleBadgeBackground = scheduleIsDelayed
		? 'rgba(220,53,69,0.12)'
		: (scheduleIsAhead ? 'rgba(25,135,84,0.12)' : 'rgba(13,110,253,0.12)');
	const scheduleBadgeText = scheduleIsDelayed
		? `+${scheduleDeltaDays} days delay`
		: (scheduleIsAhead ? `${Math.abs(scheduleDeltaDays)} days ahead` : 'On schedule');

	const isValidCoordinate = (value) => typeof value === 'number' && !Number.isNaN(value);
	const hasValidCoordinates = isValidCoordinate(derivedLatitude) && isValidCoordinate(derivedLongitude);
	const mapLatitude = hasValidCoordinates ? derivedLatitude : 25.2048;
	const mapLongitude = hasValidCoordinates ? derivedLongitude : 55.2708;
	const mapSrc = `https://maps.google.com/maps?q=${mapLatitude},${mapLongitude}&hl=en&z=12&output=embed`;

	return (
		<div className="page-content-wrapper">
			<div className="content sm-gutter">
				<div className="container-fluid padding-25 sm-padding-10" style={{ paddingBottom: '40px' }} ref={dashboardRef}>

					{/* Project Title with Reporting Info - Right Aligned */}
					<div className="row">
						<div className="col-12 m-b-20">
							<div className="d-flex justify-content-between align-items-center">
								<div className="d-flex align-items-center justify-content-between" style={{ width: '100%' }}>
									<div className="d-flex align-items-center">
										<h2 className="text-dark m-b-0 m-r-20">Project: {projectData.projectName || 'Project Dashboard'}</h2>
									</div>
									<div style={{
										fontSize: '16px',
										color: '#495057',
										fontWeight: '600',
										textAlign: 'right',
										minWidth: '200px',
										marginRight: '20px'
									}}>
										Reporting: {new Date().toLocaleDateString('en-US', {
											day: 'numeric',
											month: 'long',
											year: 'numeric'
										})}
									</div>
								</div>
								<div className="d-flex align-items-center">
									<button
										className="btn btn-outline-secondary btn-sm"
										data-pdf-export
										style={{
											border: '1px solid #6c757d',
											color: '#6c757d',
											backgroundColor: 'transparent',
											padding: '6px 12px',
											borderRadius: '4px',
											fontSize: '12px',
											display: 'flex',
											alignItems: 'center',
											gap: '6px',
											cursor: 'pointer'
										}}
										onClick={handleDownloadPDF}
									>
										<span style={{fontSize: '14px' }}>📄</span>
										Download PDF
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Top 6 KPI Cards Row */}
					<div className="row m-b-20">
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-primary no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-20 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-white m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>💰</span>
										<div className="hint-text font-montserrat text-white all-caps fs-10">
											TOTAL DEVELOPMENT COST
										</div>
									</div>
									<h2 className="text-white m-b-0" style={{fontSize: '30px', fontWeight: '500' }}>
										{(() => {
											const total = (contractorBudgetValue || 240400000) +
													     (designBudgetValue || 20000000) +
													     (supervisionBudgetValue || 5100000) +
													     (developmentBudgetValue || 0) +
													     (contingencyBudgetValue || 0);
											return (total / 1000000000).toFixed(1) + 'B';
										})()}
									</h2>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-success no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-20 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-white m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>💳</span>
										<div className="hint-text font-montserrat text-white all-caps fs-10">
											TOTAL SPENT
										</div>
									</div>
									<h2 className="text-white m-b-0" style={{fontSize: '30px', fontWeight: '500' }}>
										{formatCurrencyShort(totalSpentValue)}
									</h2>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-warning no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-20 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-dark m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>🏗️</span>
										<div className="hint-text font-montserrat text-dark all-caps fs-10">
											PROJECT STATUS
										</div>
									</div>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<div className="text-dark" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>STAGE</div>
											<div className="text-dark" style={{fontSize: '20px', fontWeight: '500' }}>
												{projectData.projectStage || 'Construction'}
											</div>
										</div>
										<div>
											<div className="text-dark" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>STATUS</div>
											<div className="text-dark" style={{fontSize: '20px', fontWeight: '500' }}>
												{projectData.currentStatus || 'On-Going'}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-info no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-20 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-white m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>📐</span>
										<div className="hint-text font-montserrat text-white all-caps fs-10">
											PROJECT DEVELOPMENT AREA
										</div>
									</div>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<div className="text-white" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>TOTAL AREA</div>
											<div className="text-white" style={{fontSize: '20px', fontWeight: '500' }}>
												{formatNumberShort(developmentAreaValue)} sqm
											</div>
										</div>
										<div>
											<div className="text-white" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>TOTAL GFA</div>
											<div className="text-white" style={{fontSize: '20px', fontWeight: '500' }}>
												{formatNumberShort(developmentGFAValue)} sqm
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-danger no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-15 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-white m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>📅</span>
										<div className="hint-text font-montserrat text-white all-caps fs-10">
											STAGE PROJECT TIMELINE
										</div>
									</div>
									<div style={{ color: 'white' }}>
										<div className="d-flex justify-content-between align-items-center m-b-2">
											<span style={{fontSize: '11px', fontWeight: 'bold' }}>Start:</span>
											<span style={{fontSize: '14px', fontWeight: '500' }}>
												{timelineStartDate ? formatDate(timelineStartDate) : '24 Apr 2024'}
											</span>
										</div>
										<div className="d-flex justify-content-between align-items-center m-b-2">
											<span style={{fontSize: '11px', fontWeight: 'bold' }}>Planned:</span>
											<span style={{fontSize: '14px', fontWeight: '500' }}>
												{timelinePlannedFinish ? formatDate(timelinePlannedFinish) : '23 Oct 2024'}
											</span>
										</div>
										<div className="d-flex justify-content-between align-items-center">
											<span style={{fontSize: '11px', fontWeight: 'bold' }}>Forecast:</span>
											<span style={{fontSize: '14px', fontWeight: '500' }}>
												{timelineForecastFinish ? formatDate(timelineForecastFinish) : '03 Sep 2025'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-2 col-md-4 col-sm-6 m-b-5">
							<div className="card bg-complete no-margin" style={{ height: '130px' }}>
								<div className="card-body padding-20 d-flex flex-column justify-content-center">
									<div className="d-flex align-items-center m-b-15">
										<span className="text-white m-r-5" style={{fontSize: '16px', fontWeight: 'bold' }}>📊</span>
										<div className="hint-text font-montserrat text-white all-caps fs-10">
											PROJECT PROGRESS
										</div>
									</div>
									<div className="d-flex justify-content-between align-items-center">
										<div>
											<div className="text-white" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>PLANNED</div>
											<div className="text-white" style={{fontSize: '20px', fontWeight: '500' }}>
												{formatPercentage(projectData.plannedProgress) || '65.0%'}
											</div>
										</div>
										<div>
											<div className="text-white" style={{fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>ACTUAL</div>
											<div className="text-white" style={{fontSize: '20px', fontWeight: '500' }}>
												{formatPercentage(projectData.actualProgress) || '40.8%'}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Main 5-Column Layout */}
					<div className="row m-b-20" style={{ marginBottom: '0px' }}>
						{/* Column 1: Project Images */}
						<div className="col-lg-2 col-md-6 m-b-0">
							<div className="row">
								<div className="col-md-12 m-b-10">
									<div style={{ height: '350px' }}>
										<div
											className="card no-margin card-dark-outline"
											style={{
												cursor: 'pointer',
												height: '100%',
												overflow: 'hidden',
												position: 'relative'
											}}
											onClick={() => handleImageClick(modalProjectImageUrl, projectImageTitle)}
										>
											<img
												src={currentProjectImageUrl}
												alt={projectImageTitle}
												onError={handleProjectImageError}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover',
													display: 'block'
												}}
											/>
										</div>
									</div>
								</div>
							</div>

						</div>

						{/* Column 2: Project Details */}
						<div className="col-lg-2 col-md-6 m-b-0" style={{ overflow: 'hidden' }}>
							<div className="card card-dark-outline" style={{ height: '350px', overflow: 'hidden' }}>
								<div className="card-header" style={{ padding: '8px 12px', overflow: 'hidden', maxHeight: '80px' }}>
									<div className="card-title" style={{fontSize: '12px', marginBottom: '5px' }}>Project Details</div>
									<div
										className="hint-text small m-b-0 m-t-2"
										style={{
											wordWrap: 'break-word',
											wordBreak: 'break-all',
											overflowWrap: 'anywhere',
											whiteSpace: 'normal',
											lineHeight: '1.2em',
											maxHeight: '6em',
											overflow: 'hidden',
											display: 'block',
											width: '100%',
											boxSizing: 'border-box',
											fontSize: '12px',
											textOverflow: 'ellipsis'
										}}
										dangerouslySetInnerHTML={{
											__html: (projectData.projectDescription || 'A comprehensive mixed-use development project featuring residential, commercial, and retail spaces with modern infrastructure and sustainable design elements.')
												.replace(/(<strong>|<b>)/g, '<strong style="font-weight: bold; color: #333;">')
												.replace(/(<\/strong>|<\/b>)/g, '</strong>')
										}}
									/>
								</div>
								<div className="card-body" style={{ padding: '15px' }}>
									<div className="project-details-list">
										<div className="detail-item" style={{ marginBottom: '15px' }}>
											<div className="detail-label" style={{ 
												fontWeight: 'bold', 
												fontSize: '10px',
												color: '#666',
												marginBottom: '5px',
												textTransform: 'uppercase'
											}}>
												Project Manager
											</div>
											<div className="detail-value" style={{ 
												fontSize: '14px',
												fontWeight: '500',
												wordWrap: 'break-word',
												wordBreak: 'break-word',
												overflowWrap: 'break-word',
												whiteSpace: 'normal',
												lineHeight: '1.3em',
												color: '#000'
											}}>
												{projectData.projectManager || 'John Doe'}
											</div>
										</div>
										
										<div className="detail-item" style={{ marginBottom: '15px' }}>
											<div className="detail-label" style={{ 
												fontWeight: 'bold', 
												fontSize: '10px',
												color: '#666',
												marginBottom: '5px',
												textTransform: 'uppercase'
											}}>
												Design Consultant
											</div>
											<div className="detail-value" style={{ 
												fontSize: '14px',
												fontWeight: '500',
												wordWrap: 'break-word',
												wordBreak: 'break-word',
												overflowWrap: 'break-word',
												whiteSpace: 'normal',
												lineHeight: '1.3em',
												color: '#000'
											}}>
												{projectData.projectConsultant || 'N/A'}
											</div>
										</div>
										
										<div className="detail-item" style={{ marginBottom: '15px' }}>
											<div className="detail-label" style={{ 
												fontWeight: 'bold', 
												fontSize: '10px',
												color: '#666',
												marginBottom: '5px',
												textTransform: 'uppercase'
											}}>
												Supervision Consultant
											</div>
											<div className="detail-value" style={{ 
												fontSize: '14px',
												fontWeight: '500',
												wordWrap: 'break-word',
												wordBreak: 'break-word',
												overflowWrap: 'break-word',
												whiteSpace: 'normal',
												lineHeight: '1.3em',
												color: '#000'
											}}>
												{projectData.ProjectSupervision || 'N/A'}
											</div>
										</div>
										
										<div className="detail-item">
											<div className="detail-label" style={{ 
												fontWeight: 'bold', 
												fontSize: '10px',
												color: '#666',
												marginBottom: '5px',
												textTransform: 'uppercase'
											}}>
												Main Contractor
											</div>
											<div className="detail-value" style={{ 
												fontSize: '14px',
												fontWeight: '500',
												wordWrap: 'break-word',
												wordBreak: 'break-word',
												overflowWrap: 'break-word',
												whiteSpace: 'normal',
												lineHeight: '1.3em',
												color: '#000'
											}}>
												{projectData.projectContractor || 'N/A'}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Column 3: Project Location */}
						<div className="col-lg-2 col-md-6 m-b-0">
							<div className="card card-dark-outline" style={{ height: '350px', overflow: 'hidden', position: 'relative', padding: 0 }}>
								<div className="card-header" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e9ecef' }}>
									<div className="card-title">Project Location</div>
								</div>
								<div style={{ height: '100%', paddingTop: '50px' }}>
									<iframe
										src={mapSrc}
										style={{
											width: '100%',
											height: '100%',
											border: 'none'
										}}
										title="Project Location Map"
									></iframe>
								</div>
							</div>
						</div>

						{/* Column 4: Financial Status */}
						<div className="col-lg-3 col-md-6 m-b-0">
							<div className="card card-dark-outline" style={{ height: '350px', marginBottom: '20px' }}>
								<div className="card-header" style={{
									backgroundColor: '#f8f9fa',
									color: '#495057',
									borderBottom: '1px solid #dee2e6',
									padding: '8px 12px',
									minHeight: '48px'
								}}>
									<div className="d-flex align-items-center">
										<div style={{
											marginRight: '10px',
											fontSize: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '24px',
											height: '24px',
											backgroundColor: '#28a745',
											borderRadius: '50%',
											color: 'white'
										}}>
											<span style={{fontSize: '12px', fontWeight: 'bold' }}>₪</span>
										</div>
										<div style={{ flex: 1, minWidth: 0 }}>
											<div className="card-title" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>Financial Status</div>
											<div style={{fontSize: '10px', opacity: 0.9, marginTop: '1px' }}>Budget Overview</div>
										</div>
									</div>
								</div>
								<div className="card-body" style={{ padding: '15px', height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column' }}>
									{/* Total Budget at Top */}
									<div style={{ textAlign: 'center', marginBottom: '15px' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<div style={{ flex: 1 }}>
												<div style={{
													fontSize: '28px',
													fontWeight: 'bold',
													color: '#333',
													margin: 0
												}}>
													{(() => {
														const total = (contractorBudgetValue || 240400000) +
																     (designBudgetValue || 20000000) +
																     (supervisionBudgetValue || 5100000) +
																     (developmentBudgetValue || 0) +
																     (contingencyBudgetValue || 0);
														return `AED ${(total / 1000000000).toFixed(1)}B`;
													})()}
												</div>
												<div style={{
													fontSize: '10px',
													color: '#666',
													marginTop: '2px'
												}}>
													Total Project Budget
												</div>
											</div>
											<div style={{ flex: 1 }}>
												<div style={{
													fontSize: '28px',
													fontWeight: 'bold',
													color: '#e74c3c',
													margin: 0
												}}>
													AED 15.2M
												</div>
												<div style={{
													fontSize: '10px',
													color: '#666',
													marginTop: '2px'
												}}>
													Total Variations
												</div>
											</div>
										</div>
									</div>

									{/* Enhanced Bar Chart */}
									<div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '-10px' }}>
										{(() => {
											const budgetData = [
												{ name: 'Contractor', value: contractorBudgetValue || 240400000, color: '#2E86AB' },
												{ name: 'Design', value: designBudgetValue || 20000000, color: '#A23B72' },
												{ name: 'Supervision', value: supervisionBudgetValue || 5100000, color: '#F18F01' },
												{ name: 'Development', value: developmentBudgetValue || 0, color: '#C73E1D' },
												{ name: 'Contingency', value: contingencyBudgetValue || 0, color: '#7209B7' }
											];

											const maxValue = Math.max(...budgetData.map(item => item.value));

											return (
												<div style={{ height: '160px', display: 'flex', alignItems: 'end', justifyContent: 'space-around', paddingTop: '8px', paddingBottom: '25px', paddingLeft: '5px', paddingRight: '5px' }}>
													{budgetData.map((item, index) => {
														const heightPercent = item.value > 0 ? (item.value / maxValue) * 100 : 0;
														const barHeight = Math.max(heightPercent * 1.0, item.value > 0 ? 25 : 0);

														return (
															<div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '35px' }}>
																{/* Value Label */}
																{item.value > 0 && (
																	<div style={{
																		fontSize: '11px',
																		fontWeight: 'bold',
																		color: '#333',
																		textAlign: 'center'
																	}}>
																		AED {(item.value / 1000000).toFixed(0)}M
																	</div>
																)}

																{/* Bar */}
																{item.value > 0 ? (
																	<div style={{
																		width: '40px',
																		height: `${barHeight}px`,
																		backgroundColor: item.color,
																		border: '1px solid #ddd'
																	}}>
																	</div>
																) : (
																	<div style={{
																		width: '40px',
																		height: '20px',
																		backgroundColor: '#f5f5f5',
																		border: '1px solid #ddd',
																		display: 'flex',
																		alignItems: 'center',
																		justifyContent: 'center'
																	}}>
																		<span style={{ fontSize: '8px', color: '#999' }}>N/A</span>
																	</div>
																)}

																{/* Category Name */}
																<div style={{
																	fontSize: '10px',
																	color: '#666',
																	textAlign: 'center',
																	fontWeight: '600',
																	lineHeight: '1.2',
																	maxWidth: '50px'
																}}>
																	{item.name}
																</div>
															</div>
														);
													})}
												</div>
											);
										})()}

										{/* Legend */}
										<div style={{
											display: 'flex',
											justifyContent: 'center',
											gap: '12px',
											marginTop: '10px',
											flexWrap: 'wrap',
											paddingTop: '8px',
											borderTop: '1px solid #eee'
										}}>
											{[
												{ name: 'Contractor', color: '#2E86AB' },
												{ name: 'Design', color: '#A23B72' },
												{ name: 'Supervision', color: '#F18F01' },
												{ name: 'Development', color: '#C73E1D' },
												{ name: 'Contingency', color: '#7209B7' }
											].map((item, index) => (
												<div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
													<div style={{
														width: '10px',
														height: '10px',
														backgroundColor: item.color,
														border: '1px solid #ddd'
													}}></div>
													<span style={{ fontSize: '9px', color: '#666' }}>
														{item.name}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Column 5: Overall Schedule Performance */}
						<div className="col-lg-3 col-md-12 m-b-0">
							<div className="card no-margin card-dark-outline" style={{
								minHeight: '350px',
								backgroundColor: '#ffffff',
								border: '1px solid #e9ecef',
								boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
								overflow: 'hidden'
							}}>
								<div className="card-header" style={{
									backgroundColor: '#f8f9fa',
									color: '#495057',
									borderBottom: '1px solid #dee2e6',
									padding: '8px 12px'
								}}>
									<div className="d-flex align-items-center">
										<div style={{ marginRight: '8px', fontSize: '16px' }}>📊</div>
										<div>
											<div className="card-title" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>Schedule Performance</div>
											<div style={{fontSize: '10px', opacity: 0.9, marginTop: '1px' }}>Progress Analysis & Metrics</div>
								</div>
									</div>
								</div>

								<div className="card-body" style={{ padding: '15px' }}>
									{/* Progress Comparison */}
									<div style={{ marginBottom: '10px' }}>
										<div style={{ marginBottom: '10px' }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<span style={{fontSize: '11px', fontWeight: '600', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
													Planned Progress
												</span>
												<span style={{fontSize: '10px', fontWeight: '500', color: '#6c757d' }}>
													{formatPercentage(
												projectData.scheduleProgress || 
												projectData.schedule_progress || 
												projectData.plannedProgress ||
												projectData.planned_progress ||
												projectData.targetProgress ||
														0
													)}
												</span>
										</div>
												<div style={{ 
												width: '100%',
												height: '14px',
												backgroundColor: '#e9ecef',
												borderRadius: '2px',
												overflow: 'hidden'
												}}>
													<div style={{ 
														width: `${Math.min(100, parseFloat(
															projectData.scheduleProgress || 
															projectData.schedule_progress || 
															projectData.plannedProgress ||
															projectData.planned_progress ||
															projectData.targetProgress ||
															0
														) || 0)}%`, 
														height: '100%', 
													background: 'linear-gradient(90deg, #3498db 0%, #2980b9 100%)',
													borderRadius: '2px',
														transition: 'width 0.3s ease'
													}}></div>
												</div>
										</div>

										<div style={{ marginBottom: '10px' }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
												<span style={{fontSize: '11px', fontWeight: '600', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
													Actual Progress
												</span>
												<span style={{fontSize: '10px', fontWeight: '500', color: '#6c757d' }}>
													{formatPercentage(
														projectData.actualProgress ||
														projectData.actual_progress ||
														projectData.actualProgressValue ||
														projectData.progress ||
														projectData.currentProgress ||
														0
													)}
												</span>
											</div>
												<div style={{ 
												width: '100%',
												height: '14px',
												backgroundColor: '#e9ecef',
												borderRadius: '2px',
												overflow: 'hidden'
												}}>
													<div style={{ 
														width: `${Math.min(100, parseFloat(
															projectData.actualProgress || 
															projectData.actual_progress || 
															projectData.actualProgressValue ||
															projectData.progress ||
															projectData.currentProgress ||
															0
														) || 0)}%`, 
														height: '100%', 
													background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
													borderRadius: '2px',
														transition: 'width 0.3s ease'
													}}></div>
												</div>
											</div>
										</div>

									{/* Chart and SPI Container */}
									<div style={{
										height: '160px',
										width: '100%',
										display: 'flex',
										alignItems: 'center',
										gap: '10px'
									}}>
										{/* Performance Chart */}
										<div style={{
											flex: 1,
											height: '100%',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #e9ecef',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											padding: '6px',
											boxSizing: 'border-box'
										}}>
										{(() => {
											const actualProgress = parseFloat(
												projectData.actualProgress || 
												projectData.actual_progress || 
												projectData.actualProgressValue ||
												projectData.progress ||
												projectData.currentProgress ||
												0
											);
											const scheduleProgress = parseFloat(
												projectData.scheduleProgress || 
												projectData.schedule_progress || 
												projectData.plannedProgress ||
												projectData.planned_progress ||
												projectData.targetProgress ||
												1
											);
											
											const spi = scheduleProgress > 0 ? actualProgress / scheduleProgress : 0;

											const pieData = [
												{
														category: 'On Schedule',
														amount: Math.max(0, spi),
														color: '#28a745'
													},
													{
														category: 'Behind Schedule',
														amount: Math.abs(Math.min(0, spi - 1)),
														color: '#dc3545'
												}
											];
											
											const options = {
												data: pieData,
												series: [
													{
														type: 'pie',
														angleKey: 'amount',
														legendItemKey: 'category',
														sectorLabelKey: 'amount',
														sectorLabel: {
															color: 'white',
															fontWeight: 'bold',
																fontSize: 11,
																formatter: ({ datum }) => `${(datum.amount * 100).toFixed(0)}%`
														},
														calloutLabel: {
																enabled: false
															},
															fills: ['#28a745', '#dc3545'],
															strokes: ['#ffffff', '#ffffff'],
														strokeWidth: 2
													}
												],
												legend: {
														enabled: false
												},
												background: {
													fill: 'transparent'
												},
												padding: {
														top: 2,
														right: 2,
														bottom: 2,
														left: 2
													},
													width: 150,
													height: 150
											};
											
											return (
													<div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
														<AgCharts options={options} />
													</div>
												);
											})()}
										</div>

										{/* SPI Indicator */}
												<div style={{ 
											width: '90px',
											height: '100%',
													display: 'flex',
											flexDirection: 'column',
													justifyContent: 'center',
											alignItems: 'center',
											padding: '6px',
											backgroundColor: '#f8f9fa',
											borderRadius: '4px',
											border: '1px solid #e9ecef'
										}}>
											<div style={{fontSize: '8px', color: '#6c757d', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.5px', textAlign: 'center', lineHeight: '1.1' }}>
												Schedule<br/>Performance<br/>Index
											</div>
											{(() => {
												const actualProgress = parseFloat(
													projectData.actualProgress ||
													projectData.actual_progress ||
													projectData.actualProgressValue ||
													projectData.progress ||
													projectData.currentProgress ||
													0
												);
												const scheduleProgress = parseFloat(
													projectData.scheduleProgress ||
													projectData.schedule_progress ||
													projectData.plannedProgress ||
													projectData.planned_progress ||
													projectData.targetProgress ||
													1
												);
												const spi = scheduleProgress > 0 ? actualProgress / scheduleProgress : 0;

												return (
													<div style={{fontSize: '22px', fontWeight: '700', color: '#000000' }}>
														{spi.toFixed(2)}
													</div>
											);
										})()}
									</div>
								</div>
								</div>
							</div>
						</div>
					</div>

					{/* Third Row: Project Updates, Critical Risks, Timeline, and Feasibility Analysis */}
					<div className="row m-b-30">
						<div className="col-lg-2 col-md-2 col-sm-12 m-b-0">
							<div className="card no-margin card-dark-outline" style={{
								height: '450px',
								backgroundColor: '#ffffff',
								border: '1px solid #e9ecef',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
							}}>
								<div className="card-header" style={{
									backgroundColor: '#f8f9fa',
									color: '#495057',
									borderBottom: '1px solid #dee2e6',
									padding: '8px 12px',
									minHeight: '48px'
								}}>
									<div className="d-flex align-items-center" style={{ height: '100%' }}>
										<div style={{
											marginRight: '10px',
											fontSize: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '24px',
											height: '24px'
										}}>📋</div>
										<div style={{ flex: 1 }}>
											<div className="card-title" style={{
												margin: 0,
												fontSize: '14px',
												fontWeight: 'bold',
												lineHeight: '1.2',
												color: '#495057'
											}}>Project Updates</div>
											<div style={{
												fontSize: '10px',
												opacity: 0.9,
												marginTop: '2px',
												lineHeight: '1.1'
											}}>Latest Developments</div>
								</div>
									</div>
								</div>

								<div className="card-body" style={{ padding: '15px', overflowY: 'auto', height: 'calc(100% - 48px)' }}>
									{/* Project Updates Content */}
									{Array.isArray(projectData.developmentUpdate) && projectData.developmentUpdate.length > 0 ? (
										<div>
											{projectData.developmentUpdate.slice(0, 5).map((update, index) => (
												<div key={index} style={{
													display: 'flex',
													alignItems: 'flex-start',
													marginBottom: '12px',
													padding: '8px',
													backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
													borderRadius: '6px',
													borderLeft: '3px solid #17a2b8'
												}}>
													<div style={{
														width: '8px',
														height: '8px',
														borderRadius: '50%',
														backgroundColor: '#17a2b8',
														marginTop: '4px',
														marginRight: '8px',
														flexShrink: 0
													}}></div>
													<div style={{ flex: 1 }}>
														<div style={{fontSize: '11px', fontWeight: '600', color: '#495057', marginBottom: '2px' }}>
															{update.date || 'N/A'}
														</div>
														<div style={{fontSize: '10px', color: '#6c757d', lineHeight: '1.3' }}>
															{update.description || 'No update details available'}
														</div>
													</div>
												</div>
											))}
											{projectData.developmentUpdate.length > 5 && (
												<div style={{ textAlign: 'center', marginTop: '8px' }}>
													<span style={{fontSize: '10px', color: '#6c757d' }}>
														+{projectData.developmentUpdate.length - 5} more updates
													</span>
												</div>
											)}
										</div>
									) : typeof projectData.developmentUpdate === 'string' && projectData.developmentUpdate ? (
										<div style={{
											fontSize: '11px',
											lineHeight: '1.4',
											color: '#495057',
											fontFamily: 'inherit'
										}} dangerouslySetInnerHTML={{ __html: projectData.developmentUpdate }} />
									) : (
										Array.isArray(dummyUpdates) && dummyUpdates.length > 0 ? (
											<div>
												{dummyUpdates.slice(0, 5).map((update, index) => (
													<div key={index} style={{
														display: 'flex',
														alignItems: 'flex-start',
														marginBottom: '12px',
														padding: '8px',
														backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
														borderRadius: '6px',
														borderLeft: '3px solid #17a2b8'
													}}>
														<div style={{
															width: '8px',
															height: '8px',
															borderRadius: '50%',
															backgroundColor: '#17a2b8',
															marginTop: '4px',
															marginRight: '8px',
															flexShrink: 0
														}}></div>
														<div style={{ flex: 1 }}>
															<div style={{fontSize: '11px', fontWeight: '600', color: '#495057', marginBottom: '2px' }}>
																{update.date}
															</div>
															<div style={{fontSize: '10px', color: '#6c757d', lineHeight: '1.3' }}>
																{update.description}
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<div style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
												height: '200px',
												color: '#6c757d'
											}}>
												<div style={{fontSize: '24px', marginBottom: '8px', fontFamily: 'inherit' }}>📝</div>
												<div style={{fontSize: '12px', textAlign: 'center', fontFamily: 'inherit' }}>No updates available</div>
											</div>
										)
									)}
								</div>
								</div>
							</div>
						<div className="col-lg-2 col-md-2 col-sm-12 m-b-0">
							<div className="card no-margin card-dark-outline" style={{
								height: '450px',
								backgroundColor: '#ffffff',
								border: '1px solid #e9ecef',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
							}}>
								<div className="card-header" style={{
									backgroundColor: '#f8f9fa',
									color: '#495057',
									borderBottom: '1px solid #dee2e6',
									padding: '8px 12px',
									minHeight: '48px'
								}}>
									<div className="d-flex align-items-center" style={{ height: '100%' }}>
										<div style={{
											marginRight: '10px',
											fontSize: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '24px',
											height: '24px'
										}}>⚠️</div>
										<div style={{ flex: 1 }}>
											<div className="card-title" style={{
												margin: 0,
												fontSize: '14px',
												fontWeight: 'bold',
												lineHeight: '1.2',
												color: '#495057'
											}}>Critical Risks</div>
											<div style={{
												fontSize: '10px',
												opacity: 0.9,
												marginTop: '2px',
												lineHeight: '1.1'
											}}>Risk Assessment</div>
						</div>
								</div>
								</div>

								<div className="card-body" style={{ padding: '15px', overflowY: 'auto', height: 'calc(100% - 48px)' }}>
									{/* Critical Risks Content */}
									{Array.isArray(projectData.criticalRisks) && projectData.criticalRisks.length > 0 ? (
										<div>
											{projectData.criticalRisks.slice(0, 5).map((risk, index) => {
												const riskLevel = risk.severity || 'Medium';
												const riskColors = {
													'High': '#dc3545',
													'Medium': '#ffc107',
													'Low': '#28a745'
												};
												const riskColor = riskColors[riskLevel] || '#6c757d';

												return (
													<div key={index} style={{
														display: 'flex',
														alignItems: 'flex-start',
														marginBottom: '12px',
														padding: '8px',
														backgroundColor: index % 2 === 0 ? '#fff5f5' : '#ffffff',
														borderRadius: '6px',
														borderLeft: `3px solid ${riskColor}`
													}}>
														<div style={{
															width: '8px',
															height: '8px',
															borderRadius: '50%',
															backgroundColor: riskColor,
															marginTop: '4px',
															marginRight: '8px',
															flexShrink: 0
														}}></div>
														<div style={{ flex: 1 }}>
															<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
																<div style={{fontSize: '11px', fontWeight: '600', color: '#495057' }}>
																	{risk.category || 'N/A'}
								</div>
																<span style={{
																	fontSize: '9px',
																	padding: '2px 6px',
																	borderRadius: '10px',
																	backgroundColor: riskColor,
																	color: 'white',
																	fontWeight: '500'
																}}>
																	{riskLevel}
										</span>
								</div>
															<div style={{fontSize: '10px', color: '#6c757d', lineHeight: '1.3' }}>
																{risk.description || 'No risk details available'}
							</div>
						</div>
								</div>
												);
											})}
											{projectData.criticalRisks.length > 5 && (
												<div style={{ textAlign: 'center', marginTop: '8px' }}>
													<span style={{fontSize: '10px', color: '#6c757d' }}>
														+{projectData.criticalRisks.length - 5} more risks
													</span>
								</div>
											)}
							</div>
									) : typeof projectData.criticalRisks === 'string' && projectData.criticalRisks ? (
										<div style={{
											fontSize: '11px',
											lineHeight: '1.4',
											color: '#495057',
											fontFamily: 'inherit'
										}} dangerouslySetInnerHTML={{ __html: projectData.criticalRisks }} />
									) : (
										Array.isArray(dummyRisks) && dummyRisks.length > 0 ? (
											<div>
												{dummyRisks.slice(0, 5).map((risk, index) => {
													const riskLevel = index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low';
													const riskColors = {
														'High': '#dc3545',
														'Medium': '#ffc107',
														'Low': '#28a745'
													};
													const riskColor = riskColors[riskLevel];

													return (
														<div key={index} style={{
															display: 'flex',
															alignItems: 'flex-start',
															marginBottom: '12px',
															padding: '8px',
															backgroundColor: index % 2 === 0 ? '#fff5f5' : '#ffffff',
															borderRadius: '6px',
															borderLeft: `3px solid ${riskColor}`
														}}>
                        <div style={{ 
																width: '8px',
																height: '8px',
																borderRadius: '50%',
																backgroundColor: riskColor,
																marginTop: '4px',
																marginRight: '8px',
																flexShrink: 0
															}}></div>
															<div style={{ flex: 1 }}>
																<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
																	<div style={{fontSize: '11px', fontWeight: '600', color: '#495057' }}>
																		{risk.category}
																	</div>
																	<span style={{
                            fontSize: '9px', 
																		padding: '2px 6px',
																		borderRadius: '10px',
																		backgroundColor: riskColor,
																		color: 'white',
																		fontWeight: '500'
																	}}>
																		{riskLevel}
																	</span>
                        </div>
																<div style={{fontSize: '10px', color: '#6c757d', lineHeight: '1.3' }}>
																	{risk.description}
                    </div>
                </div>
														</div>
													);
												})}
											</div>
										) : (
                                    <div style={{ 
                                        display: 'flex',
												flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
												height: '200px',
												color: '#6c757d'
											}}>
												<div style={{fontSize: '24px', marginBottom: '8px', fontFamily: 'inherit' }}>✅</div>
												<div style={{fontSize: '12px', textAlign: 'center', fontFamily: 'inherit' }}>No critical risks identified</div>
                                </div>
										)
									)}
								</div>
							</div>
                            </div>
                            
				{/* Project Timeline and Progress Card */}
				<div className="col-lg-6 col-md-6 col-sm-12 m-b-0">
					<div className="card no-margin card-dark-outline" style={{ height: '450px', backgroundColor: '#ffffff', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
						<div className="card-header" style={{ backgroundColor: '#f8f9fa', color: '#495057', borderBottom: '1px solid #dee2e6', padding: '8px 12px', minHeight: '48px' }}>
							<div className="d-flex align-items-center" style={{ height: '100%' }}>
								<div style={{ marginRight: '10px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>📈</div>
								<div style={{ flex: 1 }}>
									<div className="card-title" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2', color: '#495057' }}>Project Progress Analysis</div>
									<div style={{ fontSize: '10px', opacity: 0.9, marginTop: '2px', lineHeight: '1.1' }}>S-Curve Progress Tracking</div>
								</div>
							</div>
						</div>

						<div className="card-body" style={{ padding: '15px', height: 'calc(100% - 48px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-end' }}>
									<div style={{ minWidth: '140px' }}>
										<div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0d6efd', fontWeight: 600 }}>Planned</div>
										<div style={{ fontSize: '24px', fontWeight: 600, color: '#0b5ed7', lineHeight: 1.1 }}>{formatPercentage(plannedProgress)}</div>
										<div style={{ fontSize: '11px', color: '#6c757d' }}>as of {formatDate(progressAsOfDate)}</div>
									</div>
									<div style={{ minWidth: '140px' }}>
										<div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#198754', fontWeight: 600 }}>Actual</div>
										<div style={{ fontSize: '24px', fontWeight: 600, color: '#146c43', lineHeight: 1.1 }}>{formatPercentage(actualProgress)}</div>
										<div style={{ fontSize: '11px', color: '#6c757d' }}>reported on {formatDate(progressAsOfDate)}</div>
									</div>
									<div style={{ minWidth: '140px' }}>
										<div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: varianceColor, fontWeight: 600 }}>Variance</div>
										<div style={{ fontSize: '24px', fontWeight: 600, color: varianceColor, lineHeight: 1.1 }}>{varianceLabel}</div>
										<div style={{ fontSize: '11px', color: '#6c757d' }}>{varianceIsPositive ? 'Ahead of plan' : 'Behind plan'}</div>
									</div>
								</div>

								<div style={{ textAlign: 'right', minWidth: '200px' }}>
									<div style={{ marginBottom: '8px' }}>
										<span style={{ backgroundColor: scheduleBadgeBackground, color: scheduleBadgeColor, padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>{scheduleBadgeText}</span>
										<div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>Schedule outlook</div>
									</div>
									<div style={{ display: 'flex', gap: '16px', fontSize: '10px', color: '#495057' }}>
										<div>
											<div style={{ textTransform: 'uppercase', fontWeight: 600, color: '#6c757d', marginBottom: '2px' }}>Start</div>
											<div style={{ fontWeight: 600 }}>{formatDate(parsedStartDate)}</div>
										</div>
										<div>
											<div style={{ textTransform: 'uppercase', fontWeight: 600, color: '#6c757d', marginBottom: '2px' }}>Planned</div>
											<div style={{ fontWeight: 600 }}>{formatDate(plannedFinishDate)}</div>
										</div>
										<div>
											<div style={{ textTransform: 'uppercase', fontWeight: 600, color: '#6c757d', marginBottom: '2px' }}>Forecast</div>
											<div style={{ fontWeight: 600 }}>{formatDate(actualCompletionDate)}</div>
										</div>
									</div>
								</div>
							</div>

				<div style={{ flex: 1, minHeight: 0 }}>
					<div className="scurve-chart-container" style={{ height: '100%', border: '1px solid rgba(13,110,253,0.12)', borderRadius: '10px', padding: '8px', background: '#ffffff', overflow: 'hidden', position: 'relative' }}>
							{scurveOptions ? (
								<>
									<div style={{ width: '100%', height: '100%' }}>
										<AgCharts options={scurveOptions} />
									</div>
									<div className="scurve-chart-legend">
										<div className="scurve-chart-legend__item">
											<span className="scurve-chart-legend__swatch planned"></span>
											<span>Planned</span>
										</div>
										<div className="scurve-chart-legend__item">
											<span className="scurve-chart-legend__swatch actual"></span>
											<span>Actual</span>
										</div>
									</div>
								</>
							) : (
							<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontSize: '12px', fontWeight: 500 }}>
								No timeline data available for S-curve
							</div>
						)}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Feasibility Analysis Card */}
						<div className="col-lg-2 col-md-2 col-sm-12 m-b-0">
							<div className="card no-margin" style={{
								height: '450px',
								backgroundColor: '#ffffff',
								border: '1px solid #e9ecef',
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
							}}>
								<div className="card-header" style={{
									backgroundColor: '#f8f9fa',
									color: '#495057',
									borderBottom: '1px solid #dee2e6',
									padding: '8px 12px',
									minHeight: '48px'
								}}>
									<div className="d-flex align-items-center" style={{ height: '100%' }}>
										<div style={{
											marginRight: '10px',
											fontSize: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											width: '24px',
											height: '24px',
											backgroundColor: '#28a745',
											borderRadius: '50%',
											color: 'white'
										}}>
											<span style={{fontSize: '12px', fontWeight: 'bold' }}>₪</span>
										</div>
										<div style={{ flex: 1 }}>
											<div className="card-title" style={{
												margin: 0,
												fontSize: '14px',
												fontWeight: 'bold',
												lineHeight: '1.2',
												color: '#495057'
											}}>Feasibility Analysis</div>
											<div style={{
												fontSize: '10px',
												opacity: 0.9,
												marginTop: '2px',
												lineHeight: '1.1'
											}}>{projectData.projectName || 'Jurf 1.3 – 96 Villas'} (Excl. Land)</div>
										</div>
									</div>
								</div>
								
								<div className="card-body" style={{ padding: '15px', height: 'calc(100% - 48px)' }}>
									{/* Feasibility Chart */}
									<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
										{/* Chart Title */}
										<div style={{ textAlign: 'center', marginBottom: '15px' }}>
											<div style={{ 
												fontSize: '11px', 
												fontWeight: 'bold',
												padding: '4px 8px',
												display: 'inline-block',
												backgroundColor: '#f8f9fa',
												borderRadius: '4px',
												border: '1px solid #e9ecef'
											}}>
												ROE (Excl. Land) Over 3 yrs
											</div>
										</div>
										
										{/* Chart Area */}
										<div style={{
											flex: 1,
											display: 'flex',
											justifyContent: 'space-around',
											alignItems: 'end',
											paddingBottom: '15px',
											position: 'relative',
											minHeight: '240px'
										}}>
											{/* Original Feasibility */}
											<div style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												position: 'relative'
											}}>
												{/* Percentage Label */}
												<div style={{
													fontSize: '16px',
													fontWeight: 'bold',
													color: '#28a745',
													marginBottom: '12px'
												}}>45%</div>

												{/* Bars Container */}
												<div style={{
													display: 'flex',
													alignItems: 'end',
													gap: '6px',
													marginBottom: '12px'
												}}>
													{/* Black Bar - Equity */}
													<div style={{
														width: '30px',
														height: '65px',
														backgroundColor: '#000',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '3px'
													}}>
														<span style={{
															color: 'white',
															fontSize: '12px',
															fontWeight: 'bold'
														}}>82</span>
													</div>

													{/* Red Bar - Net Profit */}
													<div style={{
														width: '30px',
														height: '90px',
														backgroundColor: '#dc3545',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '3px'
													}}>
														<span style={{ 
															color: 'white',
															fontSize: '10px',
															fontWeight: 'bold'
														}}>110</span>
													</div>
												</div>
												
												{/* Label */}
												<div style={{ 
													fontSize: '9px',
													color: '#666',
													textAlign: 'center',
													lineHeight: '1.2'
												}}>Original<br/>Feasibility</div>
											</div>
											
											{/* Adjusted Feasibility */}
											<div style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												position: 'relative'
											}}>
												{/* Percentage Label */}
												<div style={{
													fontSize: '16px',
													fontWeight: 'bold',
													color: '#dc3545',
													marginBottom: '12px'
												}}>145%</div>

												{/* Bars Container */}
												<div style={{
													display: 'flex',
													alignItems: 'end',
													gap: '6px',
													marginBottom: '12px'
												}}>
													{/* Black Bar - Equity */}
													<div style={{
														width: '30px',
														height: '35px',
														backgroundColor: '#000',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '3px'
													}}>
														<span style={{
															color: 'white',
															fontSize: '12px',
															fontWeight: 'bold'
														}}>28</span>
													</div>

													{/* Red Bar - Net Profit */}
													<div style={{
														width: '30px',
														height: '105px',
														backgroundColor: '#dc3545',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														borderRadius: '3px'
													}}>
														<span style={{
															color: 'white',
															fontSize: '12px',
															fontWeight: 'bold'
														}}>122</span>
													</div>
												</div>
												
												{/* Label */}
												<div style={{ 
													fontSize: '9px',
													color: '#666',
													textAlign: 'center',
													lineHeight: '1.2'
												}}>Adjusted<br/>Feasibility</div>
											</div>
										</div>
										
										{/* Legend */}
										<div style={{ 
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											gap: '12px',
											paddingTop: '8px',
											borderTop: '1px solid #f0f0f0',
											marginTop: '8px'
										}}>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<div style={{ 
													width: '10px', 
													height: '10px', 
													backgroundColor: '#000', 
													marginRight: '4px',
													borderRadius: '2px'
												}}></div>
												<span style={{fontSize: '9px', color: '#666' }}>Equity</span>
											</div>
											<div style={{ display: 'flex', alignItems: 'center' }}>
												<div style={{ 
													width: '10px', 
													height: '10px', 
													backgroundColor: '#dc3545', 
													marginRight: '4px',
													borderRadius: '2px'
												}}></div>
												<span style={{fontSize: '9px', color: '#666' }}>Net Profit</span>
											</div>
										</div>
										
										{/* Land Cost Info */}
										<div style={{ 
											marginTop: '8px',
											borderTop: '1px solid #f0f0f0',
											paddingTop: '8px'
										}}>
											<div style={{ 
												backgroundColor: '#f8d7da', 
												padding: '3px 6px', 
												borderRadius: '3px',
												marginBottom: '6px',
												textAlign: 'center',
												fontSize: '10px',
												fontWeight: 'bold',
												color: '#721c24'
											}}>
												Land Cost
											</div>
											<div style={{ display: 'flex', justifyContent: 'space-between' }}>
												<div style={{ textAlign: 'center', flex: 1 }}>
													<div style={{fontSize: '11px', fontWeight: 'bold' }}>AED 36M</div>
													<div style={{fontSize: '8px', color: '#666' }}>(AED 1,220/Sq m GFA)</div>
												</div>
												<div style={{ textAlign: 'center', flex: 1 }}>
													<div style={{fontSize: '11px', fontWeight: 'bold' }}>AED 28M</div>
													<div style={{fontSize: '8px', color: '#666' }}>(AED 949/Sq m GFA)</div>
												</div>
											</div>
										</div>
										</div>
								</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	{/* Image Viewer Modal */}
			{showImageModal && selectedImage && (
				<div
					className="modal fade show d-block"
					style={{
						backgroundColor: 'rgba(0,0,0,0.8)',
						zIndex: 9999
					}}
					onClick={closeImageModal}
				>
					<div className="modal-dialog modal-xl modal-dialog-centered">
						<div className="modal-content bg-transparent border-0">
							<div className="modal-header border-0 pb-0">
								<h5 className="modal-title text-white">{selectedImage.title}</h5>
								<button
									type="button"
									className="btn-close btn-close-white"
									onClick={closeImageModal}
									style={{
										backgroundColor: 'rgba(255,255,255,0.2)',
										borderRadius: '50%',
										padding: '8px',
										fontSize: '24px',
										color: 'white'
									}}
								>
									×
								</button>
							</div>
							<div className="modal-body text-center p-2">
								<img
									src={selectedImage.url}
									alt={selectedImage.title}
									className="img-fluid"
									style={{
										maxHeight: '80vh',
										borderRadius: '8px',
										boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
									}}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* END PAGE CONTENT */}
			{/* START COPYRIGHT */}
			<Copyright
				year={"2025"}
				brand={"IMKAN"}
				reserved={"All rights reserved."}
				terms={"Terms of use"}
				policy={"Privacy Policy"}
			/>
		{/* END COPYRIGHT */}
	</div>
	);
};

export default Content;
