import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
if (projectsTitle) {
    projectsTitle.textContent = `Projects (${projects.length})`;
}

renderProjects(projects, projectsContainer, 'h2');