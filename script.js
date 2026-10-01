document.addEventListener("DOMContentLoaded", function () {
    sortCardsByDeadline();
    renderCardBadges();

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterCards);
    }

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    });
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
            closeDeptModal();
        }
    });
});

function sortCardsByDeadline() {
    const grid = document.getElementById("societiesGrid");
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.soc'));
    cards.sort((a, b) => {
        const deadlineA = a.getAttribute('data-deadline');
        const deadlineB = b.getAttribute('data-deadline');
        const isClosedA = a.getAttribute('data-closed') === 'true';
        const isClosedB = b.getAttribute('data-closed') === 'true';
        
        if (isClosedA && !isClosedB) return -1;
        if (!isClosedA && isClosedB) return 1;
        
        if (deadlineA && deadlineB) {
            return new Date(deadlineA) - new Date(deadlineB);
        }
        
        if (deadlineA && !deadlineB) return -1;
        if (!deadlineA && deadlineB) return 1;
        return 0;
    });
    
    cards.forEach(card => grid.appendChild(card));
}

function renderCardBadges() {
    const cards = document.querySelectorAll('.soc');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    cards.forEach(card => {
        let badgeContainer = card.querySelector('.card-status-badge');
        if (!badgeContainer) {
            badgeContainer = document.createElement('div');
            badgeContainer.className = 'card-status-badge';
            card.prepend(badgeContainer);
        }
        const isClosed = card.getAttribute('data-closed') === 'true';
        const deadlineStr = card.getAttribute('data-deadline');
        let dotClass = '';
        let labelText = '';

        if (isClosed) {
            dotClass = 'red';
            labelText = 'Registration closed';
        } else if (deadlineStr) {
            const deadline = new Date(deadlineStr);
            deadline.setHours(0, 0, 0, 0);
            const diffTime = deadline - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) {
                dotClass = 'red';
                labelText = 'Registration closed';
            } else if (diffDays <= 2) {
                dotClass = 'orange';
                labelText = `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
            } else {
                dotClass = 'yellow';
                labelText = `${diffDays} days left`;
            }
        } else {
            dotClass = 'yellow';
            labelText = 'Open';
        }
        badgeContainer.innerHTML = `<span class="status-dot ${dotClass}"></span> <span>${labelText}</span>`;
    });
}

function filterCards() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.querySelectorAll(".soc");

    cards.forEach(card => {
        const title = card.getAttribute("data-title") ? card.getAttribute("data-title").toLowerCase() : "";
        const dept = card.getAttribute("data-dept") ? card.getAttribute("data-dept").toLowerCase() : "";
        const cardText = card.innerText.toLowerCase();


        if (title.includes(query) || dept.includes(query) || cardText.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Add this function to handle team member display
function populateTeamMembers(card) {
    const teamSection = document.getElementById("societyTeamSection");
    const teamList = document.getElementById("societyTeamList");
    const teamStr = card.getAttribute("data-team") || "";
    
    if (!teamStr) {
        teamSection.style.display = "none";
        return;
    }

    teamList.innerHTML = "";
    const teamItems = teamStr.split("|");
    
    for (let i = 0; i < teamItems.length; i += 2) {
        const position = teamItems[i];
        const names = teamItems[i + 1];
        
        if (position && names) {
            teamList.innerHTML += `
                <div class="team-member-item">
                    <div class="team-member-position">${position}</div>
                    <div class="team-member-names">${names}</div>
                </div>
            `;
        }
    }
    
    teamSection.style.display = "block";
}
// Update openModal function to include team members
function openModal(card) {
    const modal = document.getElementById("infoModal");
    const modalContent = document.getElementById("modalContent");

    const title = card.getAttribute("data-title") || "SOCIETY NAME";
    const slogan = card.getAttribute("data-slogan") || "";
    const dept = card.getAttribute("data-dept") || "DEPARTMENT";
    const formUrl = card.getAttribute("data-form") || "#";
    const about = card.getAttribute("data-about") || "Information coming soon.";
    const why = card.getAttribute("data-why") || "Information coming soon.";
    const event = card.getAttribute("data-event") || "N/A";
    const faculty = card.getAttribute("data-faculty") || "N/A";
    const poc = card.getAttribute("data-poc") || "N/A";
    const website = card.getAttribute("data-website") || "";
    const whatsapp = card.getAttribute("data-whatsapp") || "";
    const imagesStr = card.getAttribute("data-images") || "";
    const isGDG = card.getAttribute("data-is-gdg") === "true";
    const whoWeAreText = card.getAttribute("data-who-we-are") || "";
    const recentWorkStr = card.getAttribute("data-recent-work") || "";
    const whatWeHostStr = card.getAttribute("data-what-we-host") || "";

    document.getElementById("modalDept").innerText = dept;
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalSlogan").innerText = slogan;
    
    const applyBtn = document.getElementById("modalApplyBtn");
    const bottomBtn = document.getElementById("modalLink");
    applyBtn.href = formUrl;
    bottomBtn.href = formUrl;
    
    applyBtn.setAttribute("data-form-url", formUrl);
    bottomBtn.setAttribute("data-form-url", formUrl);

    document.getElementById("modalAbout").innerText = about;
    document.getElementById("modalWhy").innerText = why;
    document.getElementById("modalEvent").innerText = event;
    document.getElementById("modalFaculty").innerText = faculty;
    document.getElementById("modalPoc").innerText = poc;

    const gdgSection = document.getElementById("gdgContentSection");
    const gdgEventsSection = document.getElementById("gdgWhatWeHostSection");
    const crosslinkSection = document.getElementById("crosslinkWhoWeAreSection");
    const crosslinkWhatWeHostSection = document.getElementById("crosslinkWhatWeHostSection");
    const allianceSection = document.getElementById("allianceRecentWorkSection");
    const teamSection = document.getElementById("societyTeamSection");
    
    gdgSection.style.display = "none";
    gdgEventsSection.style.display = "none";
    crosslinkSection.style.display = "none";
    crosslinkWhatWeHostSection.style.display = "none";
    allianceSection.style.display = "none";
    teamSection.style.display = "none";
    
    if (isGDG) {
        gdgSection.style.display = "block";
        
        // Show GDG Events section
        if (whatWeHostStr) {
            const gdgEventsContainer = document.getElementById("gdgWhatWeHostList");
            gdgEventsContainer.innerHTML = "";
            
            const hostItems = whatWeHostStr.split("|");
            for (let i = 0; i < hostItems.length; i += 3) {
                const eventName = hostItems[i];
                const eventDesc = hostItems[i + 1];
                const eventImg = hostItems[i + 2];
                
                if (eventName && eventDesc) {
                    const imgHTML = eventImg ? `<img src="${eventImg}" alt="${eventName}" style="width: 100%; max-width: 400px; height: auto; border-radius: 10px; border: 1px solid rgba(69, 234, 252, 0.4); box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); margin-bottom: 12px; display: block;">` : '';
                    
                    gdgEventsContainer.innerHTML += `
                        <div style="margin-bottom: 25px; clear: both;">
                            ${imgHTML ? `<div style="float: right; width: 45%; max-width: 400px; margin-left: 20px; margin-bottom: 15px;">${imgHTML}</div>` : ''}
                            <h3 style="color: #45eafc; margin-bottom: 8px; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.5px;">${eventName}</h3>
                            <p style="color: #e0e0e0; line-height: 1.6; font-size: 1.05rem;">${eventDesc}</p>
                            ${imgHTML ? '<div style="clear: both;"></div>' : ''}
                        </div>
                    `;
                }
            }
            
            gdgEventsSection.style.display = "block";
        }
    }
    
    if (whoWeAreText) {
        document.getElementById("crosslinkWhoWeAreText").innerText = whoWeAreText;
        crosslinkSection.style.display = "block";
    }
    
    if (whatWeHostStr && !isGDG) {
        const whatWeHostContainer = document.getElementById("crosslinkWhatWeHostList");
        whatWeHostContainer.innerHTML = "";
        
        const hostItems = whatWeHostStr.split("|");
        for (let i = 0; i < hostItems.length; i += 3) {
            const eventName = hostItems[i];
            const eventDesc = hostItems[i + 1];
            const eventImg = hostItems[i + 2];
            
            if (eventName && eventDesc) {
                const imgHTML = eventImg ? `<img src="${eventImg}" alt="${eventName}" style="width: 100%; max-width: 400px; height: auto; border-radius: 10px; border: 1px solid rgba(69, 234, 252, 0.4); box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5); margin-bottom: 12px; display: block;">` : '';
                
                whatWeHostContainer.innerHTML += `
                    <div style="margin-bottom: 25px; clear: both;">
                        ${imgHTML ? `<div style="float: right; width: 45%; max-width: 400px; margin-left: 20px; margin-bottom: 15px;">${imgHTML}</div>` : ''}
                        <h3 style="color: #45eafc; margin-bottom: 8px; font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.5px;">${eventName}</h3>
                        <p style="color: #e0e0e0; line-height: 1.6; font-size: 1.05rem;">${eventDesc}</p>
                        ${imgHTML ? '<div style="clear: both;"></div>' : ''}
                    </div>
                `;
            }
        }
        
        crosslinkWhatWeHostSection.style.display = "block";
    }
    
    if (recentWorkStr) {
        const recentWorkContainer = document.getElementById("allianceRecentWorkLinks");
        recentWorkContainer.innerHTML = "";
        
        const workItems = recentWorkStr.split("|");
        for (let i = 0; i < workItems.length; i += 2) {
            const workName = workItems[i];
            const workUrl = workItems[i + 1];
            if (workName && workUrl) {
                recentWorkContainer.innerHTML += `
                    <div style="margin-bottom: 12px;">
                        <a href="${workUrl}" target="_blank" class="modal-link" style="font-size: 1.05rem; color: #45eafc; text-decoration: none; font-weight: 500;">
                            → ${workName}
                        </a>
                    </div>
                `;
            }
        }
        
        allianceSection.style.display = "block";
    }
    
    // Populate team members
    populateTeamMembers(card);

    const websiteBox = document.getElementById("modalWebsiteBox");
    const websiteLink = document.getElementById("modalWebsite");
    if (website && website !== "") {
        websiteLink.href = website;
        websiteLink.innerText = website;
        websiteBox.style.display = "block";
    } else {
        websiteBox.style.display = "none";
    }


    const whatsappBox = document.getElementById("modalWhatsappBox");
    const whatsappLink = document.getElementById("modalWhatsapp");
    if (whatsapp && whatsapp !== "") {
        whatsappLink.href = whatsapp;
        whatsappLink.innerText = "Join WhatsApp Group / Community";
        whatsappBox.style.display = "block";
    } else {
        whatsappBox.style.display = "none";
    }

    populateSocialPills(card);
    populateModalImages(imagesStr);


    modalContent.scrollTop = 0;
    modal.style.display = "flex";
}

function closeModal() {
    const modal = document.getElementById("infoModal");
    if (modal) {
        modal.style.display = "none";
    }
}
function openDeptModal(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const deptModal = document.getElementById("deptModal");
    const deptModalTitle = document.getElementById("deptModalTitle");
    const deptModalList = document.getElementById("deptModalList");
    const deptApplyBtn = document.getElementById("deptApplyBtn");
    
    const clickedBtn = event.currentTarget;
    const formUrl = clickedBtn.getAttribute("data-form-url") || "#";
    
    deptApplyBtn.href = formUrl;
    
    const mainTitle = document.getElementById("modalTitle").innerText;
    deptModalTitle.innerText = `Departments in ${mainTitle}`;
    
    const modal = document.getElementById("infoModal");
    const activeCard = modal.activeCard;
    
    if (activeCard) {
        const departmentsStr = activeCard.getAttribute("data-departments") || "";
        
        if (departmentsStr) {
            const departments = departmentsStr.split("|");
            deptModalList.innerHTML = "";
            
            departments.forEach(dept => {
                if (dept.trim()) {
                    deptModalList.innerHTML += `<li>${dept.trim()}</li>`;
                }
            });
        } else {
            deptModalList.innerHTML = `<li style="color: #e0e0e0; list-style: none;">No specific departments listed</li>`;
        }
    }
    
    deptModal.style.display = "flex";
}

function closeDeptModal() {
    const deptModal = document.getElementById("deptModal");
    if (deptModal) {
        deptModal.style.display = "none";
    }
}

function populateSocialPills(card) {
    const container = document.getElementById("modalSocialPills");
    const socialsBox = document.getElementById("modalSocialsBox");
    container.innerHTML = "";

    const instagram = card.getAttribute("data-instagram");
    const linkedin = card.getAttribute("data-linkedin");
    const facebook = card.getAttribute("data-facebook");
    const unstop = card.getAttribute("data-unstop");

    let hasSocial = false;

    if (instagram) {
        container.innerHTML += `<a href="https://instagram.com/${instagram.replace('@','')}" target="_blank" class="social-pill insta">Instagram</a>`;
        hasSocial = true;
    }
    if (linkedin) {
        container.innerHTML += `<a href="${linkedin}" target="_blank" class="social-pill linkedin">LinkedIn</a>`;
        hasSocial = true;
    }
    if (facebook) {
        container.innerHTML += `<a href="${facebook}" target="_blank" class="social-pill facebook">Facebook</a>`;
        hasSocial = true;
    }
    if (unstop) {
        container.innerHTML += `<a href="${unstop}" target="_blank" class="social-pill unstop">Unstop</a>`;
        hasSocial = true;
    }

    socialsBox.style.display = hasSocial ? "block" : "none";
}

function populateModalImages(imagesStr) {
    const slot1 = document.getElementById("modalImgSlot1");
    const slot2 = document.getElementById("modalImgSlot2");
    const slot3 = document.getElementById("modalImgSlot3");

    if (slot1) slot1.innerHTML = "";
    if (slot2) slot2.innerHTML = "";
    if (slot3) slot3.innerHTML = "";

    if (!imagesStr) return;

    const images = imagesStr.split("|");

    if (images[0] && slot1) {
        slot1.innerHTML = `<img src="${images[0]}" class="inline-modal-img" alt="Society Image 1">`;
    }
    if (images[1] && slot2) {
        slot2.innerHTML = `<img src="${images[1]}" class="inline-modal-img" alt="Society Image 2">`;
    }
    if (images[2] && slot3) {
        slot3.innerHTML = `<img src="${images[2]}" class="inline-modal-img" alt="Society Image 3">`;
    }
}
function handleModalScroll() {
    const modalContent = document.getElementById("modalContent");
    const modalScrollBtn = document.getElementById("modalScrollTopBtn");


    if (modalContent.scrollTop > 150) {
        modalScrollBtn.style.display = "block";
    } else {
        modalScrollBtn.style.display = "none";
    }
}
function scrollModalToTop() {
    const modalContent = document.getElementById("modalContent");
    modalContent.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function filterSocieties() {
    filterCards();
}

const originalOpenModal = openModal;
openModal = function(card) {
    const modal = document.getElementById("infoModal");
    modal.activeCard = card;
    originalOpenModal(card);
}