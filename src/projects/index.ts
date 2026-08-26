const queryParams = new URLSearchParams(location.search);
const requiredTags = queryParams.getAll("tag");
const projectElements = document.querySelectorAll(".project");
projectElements.forEach(projectElement => {
	const hasAllRequiredTags = requiredTags.find(tag => {
		return projectElement.querySelector(`.tag[data-tag-name="${tag}"]`) === null;
	}) === undefined;
	if (!hasAllRequiredTags) {
		projectElement.hidden = true;
	}
});

// Since the year headings are pre computed in the jinja2 layout we need to hide them too if all
document.querySelectorAll(".year-heading").forEach(yearHeadingElement => {
	const year = yearHeadingElement.innerText;
	const hasProjectThisYear = document.querySelector(`.project[data-year="${year}"]:not([hidden])`) !== null;
	if (!hasProjectThisYear) {
		yearHeadingElement.hidden = true;
	}
});

