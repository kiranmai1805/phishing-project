const app = {
    // 1. CONFIG
    images: ['email1.png', 'email2.png', 'email3.png', 'email4.png', 'email5.png', 'email6.png', 'email7.png', 'email8.png', 'email9.png', 'email10.png'],
    currentIdx: 0,
    startTime: 0,
    
    data: {
        participant_id: '',
        role: '',
        age_group: '',
        gender: '',
        answers: []
    },

    // --- INIT ---
    init: () => {
        // 1. Developer Mode Check
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'test') {
            console.log("👨‍💻 Developer Mode: Blocking Disabled");
            return; 
        }

        // 2. Block Check (If blocked, HIDE landing page and SHOW blocked page)
        const hasFinished = localStorage.getItem('phishing_survey_done');
        if (hasFinished === 'true') {
            app.switchScreen('step-landing', 'step-blocked');
            document.getElementById('screen-title').innerText = "Access Denied";
        }
    },

    // 2. Navigation Logic
    
    // [NEW] Moves from Landing Page -> Role Selection
    enterSession: () => {
        document.getElementById('screen-title').innerText = "Identity Verification";
        app.switchScreen('step-landing', 'step-role');
    },

    setRole: (role) => {
        app.data.role = role;

        // Dynamic Labels
        const label = document.getElementById('label-id');
        const input = document.getElementById('input-id');

        if (label && input) {
            if (role === 'Student') {
                label.innerText = "Roll Number";
                input.placeholder = "e.g., 21CSE105";
            } else {
                label.innerText = "Full Name";
                input.placeholder = "e.g., Dr. A. Kumar";
            }
        }
        
        app.switchScreen('step-role', 'step-demo');
    },

    startSurvey: () => {
        const id = document.getElementById('input-id').value.trim();
        const age = document.getElementById('input-age').value.trim();
        const gender = document.getElementById('input-gender').value;

        if (!id || !age || !gender) {
            alert("Please fill in all details: Name/ID, Age, and Gender.");
            return;
        }

        app.data.participant_id = id;
        app.data.age_group = age;
        app.data.gender = gender;
        
        // Expand the box
        const container = document.querySelector('.glass-container');
        if (container) container.classList.add('wide-mode');

        app.switchScreen('step-demo', 'step-test');
        app.loadEmail();
    },

    // 3. The Experiment Loop
    loadEmail: () => {
        if (app.currentIdx >= app.images.length) {
            app.submitData();
            return;
        }

        document.getElementById('progress-text').innerText = `Email ${app.currentIdx + 1} of ${app.images.length}`;
        document.getElementById('screen-title').innerText = "Analyze Email";
        document.getElementById('email-img').src = `images/${app.images[app.currentIdx]}`;
        
        const percent = (app.currentIdx / app.images.length) * 100;
        document.getElementById('progress-fill').style.width = `${percent}%`;

        const inputReason = document.getElementById('input-reason');
        inputReason.value = '';
        inputReason.classList.remove('input-error');
        inputReason.placeholder = "⚠️ Required: Why is this safe or malicious?";
        
        app.startTime = Date.now();
    },

    recordAnswer: (verdict) => {
        const inputReason = document.getElementById('input-reason');
        const reasonText = inputReason.value.trim();

        if (reasonText.length < 3) {
            inputReason.classList.add('input-error');
            inputReason.placeholder = "⚠️ You must explain your reason here!";
            return;
        }

        const timeTaken = Date.now() - app.startTime;

        app.data.answers.push({
            email_id: app.images[app.currentIdx],
            user_verdict: verdict,
            reason: reasonText,
            time_taken_ms: timeTaken
        });

        app.currentIdx++;
        app.loadEmail();
    },

    // 4. Submit
    submitData: async () => {
        app.switchScreen('step-test', 'step-loading');
        document.getElementById('screen-title').innerText = "Saving...";

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(app.data)
            });

            if (response.ok) {
                localStorage.setItem('phishing_survey_done', 'true');
                app.switchScreen('step-loading', 'step-end');
                document.getElementById('screen-title').innerText = "Done";
            } else {
                alert("Server Error. Please try again.");
                app.switchScreen('step-loading', 'step-test');
            }
        } catch (error) {
            console.error(error);
            alert("Network Error.");
        }
    },

    // Helper
    switchScreen: (hideId, showId) => {
        if (document.getElementById(hideId)) document.getElementById(hideId).classList.add('hidden');
        if (document.getElementById(showId)) {
            document.getElementById(showId).classList.remove('hidden');
            document.getElementById(showId).classList.add('fade-in');
        }
    }
};

window.onload = app.init;