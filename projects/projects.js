import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
    projectsTitle.textContent = `Projects (${projects.length})`;
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let query = '';
let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => {
        return {value: count, label: year};
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    arcs.forEach((arc, idx) => {
        newSVG
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(idx))
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;

            newSVG
            .selectAll('path')
            .attr('class', (_, i) => i === selectedIndex ? 'selected' : '');

            d3.select('.legend')
            .selectAll('li')
            .attr('class', (_, i) => i === selectedIndex ? 'legend-item selected' : 'legend-item');

            let filtered = projects.filter((p) => {
                let values = Object.values(p).join('\n').toLowerCase();
                let matchesQuery = values.includes(query.toLowerCase());
                let matchesYear = selectedIndex === -1 || p.year === data[selectedIndex].label;
                return matchesQuery && matchesYear;
            });

            renderProjects(filtered, projectsContainer, 'h2');
        });
    });

      
    let legend = d3.select('.legend');
    data.forEach((d, idx) => {
      legend.append('li')
        .attr('class', 'legend-item')
        .attr('style', `--color:${colors(idx)}`) 
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); 
    });
}

renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    selectedIndex = -1;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});