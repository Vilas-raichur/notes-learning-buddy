const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const showLoginBtn = document.getElementById("show-login");
const showSignupBtn = document.getElementById("show-signup");
const authMessage = document.getElementById("auth-message");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const userEmailSpan = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const profileToggle = document.getElementById("profile-toggle");
const profilePopover = document.getElementById("profile-popover");
const avatarInitial = document.getElementById("avatar-initial");
const documentsToggle = document.getElementById("documents-toggle");
const changePasswordToggle = document.getElementById("change-password-toggle");
const changePasswordSection = document.getElementById("change-password-section");
const backFromPassword = document.getElementById("back-from-password");
const changePasswordForm = document.getElementById("change-password-form");
const passwordMessage = document.getElementById("password-message");
const aboutToggle = document.getElementById("about-toggle");

const backFromAbout = document.getElementById("back-from-about");

documentsToggle.addEventListener("click", () => {
    documentList.classList.toggle("collapsed");
    documentsToggle.classList.toggle("collapsed");
});

showLoginBtn.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    showLoginBtn.classList.add("active");
    showSignupBtn.classList.remove("active");
});

showSignupBtn.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showSignupBtn.classList.add("active");
    showLoginBtn.classList.remove("active");
});

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        authMessage.textContent = "Account created! Please log in.";
        showLoginBtn.click();
    } else {
        const error = await response.json();
        authMessage.textContent = error.detail || "Signup failed.";
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        showApp(email);
    } else {
        authMessage.textContent = "Incorrect email or password.";
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("access_token");
    location.reload();
});


function getDisplayName(email) {
    const localPart = email.split("@")[0];
    const firstPart = localPart.split(/[._]/)[0].replace(/[0-9]+$/, "");
    const name = firstPart || localPart;
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}


function getAvatarColor(email) {
    const palette = [
        { bg: "#6B6F76", text: "#F3F3EF" },
        { bg: "#5B84A6", text: "#F3F3EF" },
        { bg: "#2E7D4F", text: "#F3F3EF" },
        { bg: "#F2B705", text: "#1B2540" }
    ];

    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % palette.length;
    return palette[index];
}

function showApp(email) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    userEmailSpan.textContent = email;
    avatarInitial.textContent = getDisplayName(email).charAt(0).toUpperCase();

    const color = getAvatarColor(email);
    avatarInitial.style.background = color.bg;
    avatarInitial.style.color = color.text;

    document.getElementById("greeting-text").textContent = `${getGreeting()}, ${getDisplayName(email)}`;
    window.scrollTo(0, 0);
    loadDocuments();
}

window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
        const response = await fetch("/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
            const user = await response.json();
            showApp(user.email);
        } else {
            localStorage.removeItem("access_token");
        }
    }
});


const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const uploadMessage = document.getElementById("upload-message");
const documentList = document.getElementById("document-list");
const askForm = document.getElementById("ask-form");
const questionInput = document.getElementById("question-input");
const chatHistory = document.getElementById("chat-history");

function getToken() {
    return localStorage.getItem("access_token");
}

async function loadDocuments() {
    try {
        const response = await authFetch("/documents");
        if (!response) return;
        if (response.ok) {
            const docs = await response.json();
            document.getElementById("document-count").textContent = docs.length;
            documentList.innerHTML = docs.length
                ? docs.map(doc => `
                    <li>
                        <span class="doc-name">${doc.filename}</span>
                        <button class="delete-btn" data-id="${doc.id}" title="Delete document">
                            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2.5 4h11M6 4V2.5h4V4M3.5 4l.6 9a1 1 0 0 0 1 .9h5.8a1 1 0 0 0 1-.9l.6-9" />
                            </svg>
                        </button>
                    </li>
                `).join("")
                : `<li class="empty-item">No documents yet.</li>`;
        } else {
            console.error("loadDocuments failed:", response.status, await response.text());
        }
    } catch (err) {
        console.error("loadDocuments threw an error:", err);
    }
}

async function authFetch(url, options = {}) {
    const token = getToken();
    options.headers = options.headers || {};
    options.headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, options);

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        alert("Your session has expired. Please log in again.");
        location.reload();
        return null;
    }

    return response;
}


changePasswordToggle.addEventListener("click", () => {
    profilePopover.classList.add("hidden");
    appSection.classList.add("hidden");
    changePasswordSection.classList.remove("hidden");
    window.scrollTo(0, 0);
});

backFromPassword.addEventListener("click", () => {
    changePasswordSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    changePasswordForm.reset();
    passwordMessage.textContent = "";
});

changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    passwordMessage.classList.remove("success");

    if (newPassword !== confirmPassword) {
        passwordMessage.textContent = "New passwords don't match.";
        return;
    }

    const response = await authFetch("/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    if (!response) return;

    if (response.ok) {
        localStorage.removeItem("access_token");
        changePasswordForm.reset();
        document.getElementById("change-password-form-area").classList.add("hidden");
        passwordMessage.classList.add("success");
        passwordMessage.innerHTML = `
        Password updated successfully.<br>
        <button type="button" id="relogin-btn" class="btn-primary" style="margin-top: 10px;">Log in again</button>
        `;
        document.getElementById("relogin-btn").addEventListener("click", () => location.reload());
    }   else {
        const error = await response.json();
        passwordMessage.textContent = error.detail || "Could not update password.";
    }
});


profileToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    profilePopover.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!profilePopover.contains(e.target) && e.target !== profileToggle) {
        profilePopover.classList.add("hidden");
    }
});


const sidebarEl = document.querySelector(".sidebar");
const resizer = document.getElementById("resizer");
let isResizing = false;

resizer.addEventListener("mousedown", () => {
    isResizing = true;
    resizer.classList.add("dragging");
    document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const maxWidth = window.innerWidth * 0.4;
    const minWidth = 220;
    const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth));
    sidebarEl.style.width = `${newWidth}px`;
});

document.addEventListener("mouseup", () => {
    isResizing = false;
    resizer.classList.remove("dragging");
    document.body.style.userSelect = "";
});


uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    uploadMessage.textContent = "Uploading and processing...";

    const response = await authFetch("/documents/upload", {
        method: "POST",
        body: formData
    });
    if (!response) return;

    if (response.ok) {
        uploadMessage.textContent = "Uploaded successfully.";
        fileInput.value = "";
        loadDocuments();
    } else {
        uploadMessage.textContent = "Upload failed.";
    }
});

documentList.addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    const docId = btn.dataset.id;
    if (!confirm("Delete this document? This can't be undone.")) return;

    const response = await authFetch(`/documents/${docId}`, { method: "DELETE" });
    if (!response) return;

    if (response.ok) {
        loadDocuments();
    } else {
        alert("Could not delete the document. Try again.");
    }
});

askForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = questionInput.value;
    questionInput.value = "";

    const emptyState = chatHistory.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    const thinkingId = `thinking-${Date.now()}`;
    chatHistory.insertAdjacentHTML("beforeend", `
        <div class="chat-entry" id="${thinkingId}">
            <div class="chat-question">${question}</div>
            <div class="chat-answer thinking">
                Thinking
                <span class="thinking-dots"><span></span><span></span><span></span></span>
            </div>
        </div>
    `);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    const response = await authFetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });
    if (!response) return;

    const entryDiv = document.getElementById(thinkingId);

    if (response.ok) {
        const data = await response.json();
        const sourcesText = data.sources.map(s => `${s.filename} (chunk ${s.chunk_index})`).join(", ");
        entryDiv.innerHTML = `
            <div class="chat-question">${question}</div>
            <div class="chat-answer fade-in">${data.answer}</div>
            <div class="chat-sources">Source: ${sourcesText}</div>
        `;
    } else {
        entryDiv.innerHTML = `
            <div class="chat-question">${question}</div>
            <div class="chat-answer error">Something went wrong — try asking again.</div>
        `;
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
});


document.getElementById("about-toggle").addEventListener("click", () => {
    document.getElementById("profile-popover").classList.add("hidden");
    document.getElementById("ask-view").classList.add("hidden");
    document.getElementById("about-panel").classList.remove("hidden");
});

document.getElementById("back-from-about").addEventListener("click", () => {
    document.getElementById("about-panel").classList.add("hidden");
    document.getElementById("ask-view").classList.remove("hidden");
});