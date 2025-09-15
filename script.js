document.addEventListener('DOMContentLoaded', () => {

    const workGrid = document.getElementById('work-grid');
    const modal = document.getElementById('work-modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // Function to render the project cards from the JSON data
    const renderProjects = (projects) => {
        workGrid.innerHTML = ''; // Clear existing content
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'work-card';
            card.dataset.id = project.id;

            card.innerHTML = `
                <img src="${project.thumbnail}" alt="${project.title} Thumbnail">
                <div class="card-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            workGrid.appendChild(card);
        });

        // Add event listeners to the new cards
        addCardEventListeners(projects);
    };

    // Function to add event listeners to the dynamically created cards
    const addCardEventListeners = (projects) => {
        document.querySelectorAll('.work-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.dataset.id;
                const project = projects.find(p => p.id == projectId);

                if (project) {
                    // Populate the modal with the content from the JSON file
                    modalBody.innerHTML = `
                        <div class="modal-body-inner">
                            <h3>${project.title}</h3>
                            <p class="project-description">${project.description}</p>
                            <div class="work-content">${project.content}</div>
                        </div>
                    `;

                    // Show the modal
                    modal.style.display = 'block';

                    // Add to browser history to enable the back button
                    history.pushState({ projectId: projectId }, '', `#sample-${projectId}`);
                }
            });
        });
    };

    // Fetch the project data from the JSON file
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            renderProjects(data);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            workGrid.innerHTML = '<p>Could not load projects. Please try again later.</p>';
        });

    // Close the modal when the user clicks the close button
    closeButton.addEventListener('click', () => {
        closeModal();
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Function to close the modal and update history
    const closeModal = () => {
        modal.style.display = 'none';
        history.pushState({}, '', window.location.pathname);
    };

    // Handle the browser's back button functionality
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.projectId) {
            // Fetch data again to re-render if a user navigates back to a sample URL
            fetch('projects.json')
                .then(response => response.json())
                .then(projects => {
                    const projectId = event.state.projectId;
                    const project = projects.find(p => p.id == projectId);
                    if (project) {
                        modalBody.innerHTML = `
                            <div class="modal-body-inner">
                                <h3>${project.title}</h3>
                                <p class="project-description">${project.description}</p>
                                <div class="work-content">${project.content}</div>
                            </div>
                        `;
                        modal.style.display = 'block';
                    }
                });
        } else {
            closeModal();
        }
    });

    // Handle initial load with a hash in the URL (e.g., direct link to a sample)
    const initialHash = window.location.hash;
    if (initialHash.startsWith('#sample-')) {
        const projectId = initialHash.replace('#sample-', '');
        fetch('F:/content writer portfolio/projects.json')
            .then(response => response.json())
            .then(projects => {
                const project = projects.find(p => p.id == projectId);
                if (project) {
                    modalBody.innerHTML = `
                        <div class="modal-body-inner">
                            <h3>${project.title}</h3>
                            <p class="project-description">${project.description}</p>
                            <div class="work-content">${project.content}</div>
                        </div>
                    `;
                    modal.style.display = 'block';
                    // Ensure history state is set correctly even on direct load
                    history.replaceState({ projectId: projectId }, '', `#sample-${projectId}`);
                }
            });
    }
});