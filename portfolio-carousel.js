const projects = [
  {
    id: 'arbor-cove',
    name: 'Arbor Cove Funding',
    category: 'Financial Services',
    desktop: 'assets/arbor-cove-desktop.png',
    mobile: 'assets/arbor-cove-mobile.png'
  },
  {
    id: 'sylvester-jaime',
    name: 'Law Office of Sylvester R. Jaime',
    category: 'Legal Services',
    desktop: 'assets/sylvester-desktop.png',
    mobile: 'assets/sylvester-mobile.png'
  },
  {
    id: 'angels-churros',
    name: 'Angels Churros N Chocolate',
    category: 'Restaurant',
    desktop: 'assets/angels-desktop.png',
    mobile: 'assets/angels-mobile.png'
  },
  {
    id: 'mex-taco',
    name: 'Mex Taco House',
    category: 'Restaurant',
    desktop: 'assets/mex-taco-desktop.png',
    mobile: 'assets/mex-taco-desktop.png'
  }
];

let currentProject = 0;
const carouselPositions = [0, 1, 2, 3];

function initCarousel(track) {
  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.projectId = project.id;
    item.dataset.position = carouselPositions[index];
    item.innerHTML = `
      <div class="mini-laptop">
        <img src="${project.desktop}" alt="${project.name} desktop preview">
      </div>
      <div class="mini-phone">
        <img src="${project.mobile}" alt="${project.name} mobile preview">
      </div>
    `;

    item.addEventListener('click', () => selectProject(index));
    track.appendChild(item);
  });
}

function initProjectTitles(list) {
  projects.forEach((project, index) => {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.dataset.projectId = project.id;
    if (index === 0) item.classList.add('active');

    item.innerHTML = `
      <div class="project-name">${project.name}</div>
      <div class="project-category">${project.category}</div>
    `;

    item.addEventListener('click', () => selectProject(index));
    list.appendChild(item);
  });
}

function selectProject(index) {
  currentProject = index;

  const laptopFrame = document.getElementById('laptopFrame');
  const phoneFrame = document.getElementById('phoneFrame');
  const featuredDesktop = document.getElementById('featuredDesktop');
  const featuredMobile = document.getElementById('featuredMobile');
  const projectItems = document.querySelectorAll('.project-item');

  if (!laptopFrame || !phoneFrame || !featuredDesktop || !featuredMobile) {
    return;
  }

  laptopFrame.classList.add('spin-in');
  phoneFrame.classList.add('spin-in');

  setTimeout(() => {
    featuredDesktop.src = projects[index].desktop;
    featuredDesktop.alt = `${projects[index].name} desktop screenshot`;
    featuredMobile.src = projects[index].mobile;
    featuredMobile.alt = `${projects[index].name} mobile screenshot`;
  }, 200);

  setTimeout(() => {
    laptopFrame.classList.remove('spin-in');
    phoneFrame.classList.remove('spin-in');
  }, 800);

  projectItems.forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });

  updateCarouselHighlight();
}

function updateCarouselHighlight() {
  const targetPosition = carouselPositions.indexOf(currentProject);
  if (targetPosition === -1) return;

  const stepsToRotate = (2 - targetPosition + carouselPositions.length) % carouselPositions.length;

  for (let i = 0; i < stepsToRotate; i += 1) {
    carouselPositions.push(carouselPositions.shift());
  }

  updateCarouselPositions();
}

function updateCarouselPositions() {
  const items = document.querySelectorAll('.carousel-item');

  items.forEach((item) => {
    const projectIndex = projects.findIndex((project) => project.id === item.dataset.projectId);
    if (projectIndex === -1) return;
    const position = carouselPositions.indexOf(projectIndex);
    item.dataset.position = position;
  });
}

function autoRotateCarousel() {
  carouselPositions.push(carouselPositions.shift());
  updateCarouselPositions();

  const centerProject = carouselPositions[2];
  if (centerProject !== currentProject) {
    selectProject(centerProject);
  }
}

function initPortfolioCarousel() {
  const track = document.getElementById('carouselTrack');
  const list = document.getElementById('projectList');

  if (!track || !list) {
    return;
  }

  initCarousel(track);
  initProjectTitles(list);
  selectProject(0);

  setInterval(autoRotateCarousel, 3000);
}

document.addEventListener('DOMContentLoaded', initPortfolioCarousel);

