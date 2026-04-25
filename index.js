import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
const githubData = await fetchGitHubData('giorgianicolaou');

renderProjects(latestProjects, projectsContainer, 'h2');