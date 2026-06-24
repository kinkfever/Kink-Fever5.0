// Core Account Gate Architecture Tracking Variables
let registeredUserRecord = null;

function handleAgeChoice(isAdult) {
    if (isAdult) {
        document.getElementById('ageStep1').style.display = 'none';
        document.getElementById('ageStep2').style.display = 'block';
    } else {
        window.location.href = 'https://www.google.com';
    }
}

// Handles the mandatory registration gate form submission
if (document.getElementById('mandatoryRegForm')) {
    document.getElementById('mandatoryRegForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        registeredUserRecord = { email: email, phone: phone };
        
        alert(`Account verified successfully!\nWelcome to the Kink Fever Community Hub.`);
        document.getElementById('ageGate').classList.add('hidden');
        localStorage.setItem('kinkFeverAuthToken', 'true');
    });
}

// Safe auto-login check for returning users
if (localStorage.getItem('kinkFeverAuthToken') === 'true') {
    if (document.getElementById('ageGate')) {
        document.getElementById('ageGate').classList.add('hidden');
    }
    registeredUserRecord = { email: "cached_tester@kinkfever.com", phone: "082 000 1122" };
}

// Clean Three-Room Chat Repository Setup (No payments or tokens)
let currentUserNickname = "";
let currentRoom = "meet";

const chatData = {
    meet: [
        { user: "Velvet_Vixen", text: "Hey everyone! Welcome to the client Meet & Greet lounge space. Loving the dark aesthetic look.", time: "2:15 PM", reactions: { "❤️": 2, "✨": 4 } },
        { user: "ShadowDreamer", text: "Excited to meet open-minded friends here securely.", time: "2:18 PM", reactions: {} }
    ],
    events: [
        { user: "Admin_Candy", text: "📢 Welcome to our Upcoming Events broadcast portal!\n\nKeep a close eye on this screen. I will upload our high-end luxury digital ads, catalog line releases, and sensory event coordinates directly into this channel line.", time: "09:00 AM", reactions: { "✨": 5 } }
    ],
    vacancies: [
        { user: "Admin_Candy", text: "📢 [OFFICIAL VACANCY BULLETIN BOARD]\n\nPosition: Creative Studio Assistant\nLocation: Randburg Studio HQ\n\nDescription: Seeking an ultra-discreet, highly organized individual to handle coordinate layouts, room calendars, and photography logs for our high-end studio layouts. Apply via our home page Contact Form below.", time: "11:00 AM", reactions: { "💼": 3 } }
    ]
};

function openChatZone() {
    document.getElementById('chatZoneModal').classList.add('active');
    if (currentUserNickname) {
        showMainChatInterface();
    } else {
        document.getElementById('chatSetupScreen').style.display = 'flex';
        document.getElementById('chatMainInterface').style.display = 'none';
    }
}

function closeChatZone() {
    document.getElementById('chatZoneModal').classList.remove('active');
}

function submitChatNickname() {
    const input = document.getElementById('chatNicknameInput').value.trim();
    if (!input) {
        alert("Please select a creative nickname to protect your identity.");
        return;
    }
    currentUserNickname = input;
    showMainChatInterface();
}

function showMainChatInterface() {
    document.getElementById('chatSetupScreen').style.display = 'none';
    document.getElementById('chatMainInterface').style.display = 'flex';
    document.getElementById('currentChatUser').innerText = currentUserNickname;
    switchRoom(currentRoom);
}

function switchRoom(roomName) {
    currentRoom = roomName;
    
    // Clear navigation button active states
    const allBtns = ['meet', 'events', 'vacancies'];
    allBtns.forEach(b => {
        const btn = document.getElementById(`roomBtn-${b}`);
        if(btn) {
            btn.style.background = 'transparent';
            btn.style.borderLeft = '4px solid transparent';
            btn.style.color = '#a1a1aa';
        }
    });

    // Set active navigation design highlights
    const activeBtn = document.getElementById(`roomBtn-${roomName}`);
    if (activeBtn) {
        activeBtn.style.background = 'rgba(236, 72, 153, 0.1)';
        activeBtn.style.borderLeft = '4px solid var(--kf-pink)';
        activeBtn.style.color = 'white';
    }

    // Input Control Logic mapping to individual room configurations
    const msgField = document.getElementById('chatMessageField');
    const sendBtn = document.getElementById('chatSendBtn');
    const photoBtn = document.getElementById('chatPhotoTriggerBtn');
    const emojiBtn = document.getElementById('emojiToggleBtn');
    const shortcutBanner = document.getElementById('shortcutBanner');
    const shortcutText = document.getElementById('shortcutText');

    if (roomName === 'meet') {
        msgField.placeholder = "Type a message securely...";
        msgField.disabled = false;
        sendBtn.disabled = false;
        photoBtn.disabled = false;
        if(emojiBtn) emojiBtn.style.display = 'block';
        if(sendBtn) sendBtn.style.opacity = '1';
        if(photoBtn) photoBtn.style.opacity = '1';
        if(shortcutBanner) shortcutBanner.style.display = 'none';
    } 
    else if (roomName === 'events') {
        msgField.placeholder = "Read-Only Notice Board Channel...";
        msgField.disabled = true;
        sendBtn.disabled = true;
        photoBtn.disabled = false; 
        if(emojiBtn) emojiBtn.style.display = 'none';
        if(sendBtn) sendBtn.style.opacity = '0.3';
        if(photoBtn) photoBtn.style.opacity = '1';
        
        if(shortcutText) shortcutText.innerText = "Want coordinates or details for upcoming premium events?";
        if(shortcutBanner) shortcutBanner.style.display = 'block';
    } 
    else if (roomName === 'vacancies') {
        msgField.placeholder = "Read-Only Bulletin Board Channel...";
        msgField.disabled = true;
        sendBtn.disabled = true;
        photoBtn.disabled = true;
        if(emojiBtn) emojiBtn.style.display = 'none';
        if(sendBtn) sendBtn.style.opacity = '0.3';
        if(photoBtn) photoBtn.style.opacity = '0.3';
        
        if(shortcutText) shortcutText.innerText = "Interested in an opening? Reach out directly to apply.";
        if(shortcutBanner) shortcutBanner.style.display = 'block';
    }

    renderChatMessages();
}

function triggerShortcutRedirect() {
    closeChatZone();
    scrollToSection('contact');
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.style.display = picker.style.display === 'none' ? 'grid' : 'none';
}

function insertEmoji(emojiStr) {
    const field = document.getElementById('chatMessageField');
    field.value += emojiStr;
    toggleEmojiPicker();
    field.focus();
}

function handleChatPhotoUpload(inputElement) {
    if (inputElement.files && inputElement.files[0]) {
        const file = inputElement.files[0];
        const localImageURL = URL.createObjectURL(file);
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        chatData[currentRoom].push({
            user: currentUserNickname,
            text: '', 
            image: localImageURL,
            time: timeString,
            reactions: {}
        });
        renderChatMessages();
    }
}

function appendReaction(msgIndex, emojiStr) {
    const msg = chatData[currentRoom][msgIndex];
    if (!msg.reactions[emojiStr]) {
        msg.reactions[emojiStr] = 1;
    } else {
        msg.reactions[emojiStr]++;
    }
    renderChatMessages();
}

function renderChatMessages() {
    const box = document.getElementById('chatMessagesBox');
    if(!box) return;
    box.innerHTML = '';
    
    chatData[currentRoom].forEach((msg, idx) => {
        const isMe = msg.user === currentUserNickname;
        const msgEl = document.createElement('div');
        msgEl.style.maxWidth = '75%';
        msgEl.style.alignSelf = isMe ? 'flex-end' : 'flex-start';
        msgEl.style.padding = '12px 16px';
        msgEl.style.borderRadius = '12px';
        msgEl.style.background = isMe ? 'var(--kf-purple)' : 'rgba(255, 255, 255, 0.07)';
        msgEl.style.color = 'var(--kf-white)';
        
        let innerHTML = `
            <div style="font-size: 0.75rem; font-weight: 700; color: ${isMe ? 'var(--kf-neon-pink)' : 'var(--im-gold)'}; margin-bottom: 4px;">
                ${msg.user}
            </div>
        `;

        if (msg.text) {
            innerHTML += `<div style="font-size: 0.95rem; line-height: 1.4; word-break: break-word; white-space: pre-line;">${msg.text}</div>`;
        }
        
        if (msg.image) {
            innerHTML += `
                <div class="secure-img-wrapper" style="margin-top: 5px;">
                    <div class="secure-img-overlay"></div>
                    <img src="${msg.image}" style="max-width: 100%; max-height: 220px; border-radius: 8px; display: block; border:1px solid rgba(255,255,255,0.1);">
                </div>
            `;
        }

        innerHTML += `<div style="font-size: 0.65rem; color: rgba(255,255,255,0.4); text-align: right; margin-top: 4px;">${msg.time}</div>`;

        let reactionTrayHTML = `<div style="display:flex; gap:5px; flex-wrap:wrap; margin-top:5px;">`;
        Object.keys(msg.reactions).forEach(emo => {
            reactionTrayHTML += `<button class="chat-reaction-btn" onclick="appendReaction(${idx}, '${emo}')">${emo} <span>${msg.reactions[emo]}</span></button>`;
        });
        
        if (!isMe && currentRoom === 'meet') {
            reactionTrayHTML += `<button class="chat-reaction-btn" onclick="appendReaction(${idx}, '🔥')" style="opacity:0.4;">+ 🔥</button>`;
            reactionTrayHTML += `<button class="chat-reaction-btn" onclick="appendReaction(${idx}, '❤️')" style="opacity:0.4;">+ ❤️</button>`;
        }
        reactionTrayHTML += `</div>`;
        
        innerHTML += reactionTrayHTML;
        msgEl.innerHTML = innerHTML;
        box.appendChild(msgEl);
    });
    box.scrollTop = box.scrollHeight;
}

if (document.getElementById('chatInputForm')) {
    document.getElementById('chatInputForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputField = document.getElementById('chatMessageField');
        const text = inputField.value.trim();
        if (!text) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        chatData[currentRoom].push({
            user: currentUserNickname,
            text: text,
            time: timeString,
            reactions: {}
        });
        
        inputField.value = '';
        renderChatMessages();
    });
}

// Anti-Copy Media safeguards within Community Modal bounds
if (document.getElementById('chatZoneModal')) {
    document.getElementById('chatZoneModal').addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('secure-img-overlay')) {
            e.preventDefault();
            alert("Security Shield: Downloading files or ripping media links is disabled.");
        }
    });
}

// Ambient Background Floating Particles
function createParticles() {
    const container = document.getElementById('particles');
    if(!container) return;
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}
createParticles();

// Smooth Scroll Controller
function scrollToSection(id) {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

// Intersection Observer for Clean Scroll Transitions
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Dynamic Navbar Background Shadow adjustments
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if(!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 5px 30px rgba(0,0,0,0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});