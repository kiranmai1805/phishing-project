const app = {
    // 1. CONFIG: Image list (Updated to .png)
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

    // --- INIT: Check if user is blocked ---
    init: () => {
        // 1. [NEW] Developer Backdoor
        // Check if URL has ?mode=test
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'test') {
            console.log("👨‍💻 Developer Mode: Blocking Disabled");
            return; // Stop here! Do not check localStorage.
        }

        // 2. Standard Security Check
        const hasFinished = localStorage.getItem('phishing_survey_done');
        if (hasFinished === 'true') {
            app.switchScreen('step-role', 'step-blocked');
            document.getElementById('screen-title').innerText = "Access Denied";
        }
    },

    // 2. Navigation Logic
    setRole: (role) => {
        app.data.role = role;

        // --- DYNAMIC LABELS ---
        // Change text based on role (Student -> Roll No, Faculty -> Name)
        const label = document.getElementById('label-id');
        const input = document.getElementById('input-id');

        if (label && input) {
            if (role === 'Student') {
                label.innerText = "Roll Number";
                input.placeholder = "e.g., (A22/A23/A24/A25)XX";
            } else {
                label.innerText = "Full Name";
                input.placeholder = "e.g.,  A. Kumar";
            }
        }
        
        app.switchScreen('step-role', 'step-demo');
    },

    startSurvey: () => {
        const id = document.getElementById('input-id').value.trim();
        const age = document.getElementById('input-age').value.trim();
        const gender = document.getElementById('input-gender').value;

        // Validation
        if (!id || !age || !gender) {
            alert("Please fill in all details: Name/ID, Age, and Gender.");
            return;
        }

        app.data.participant_id = id;
        app.data.age_group = age;
        app.data.gender = gender;
        
        // [NEW] EXPAND THE BOX (Wide Mode Animation)
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

        // Update Text
        document.getElementById('progress-text').innerText = `Email ${app.currentIdx + 1} of ${app.images.length}`;
        document.getElementById('screen-title').innerText = "Analyze Email";
        
        // Update Image
        document.getElementById('email-img').src = `images/${app.images[app.currentIdx]}`;
        
        // Update Progress Bar
        const percent = (app.currentIdx / app.images.length) * 100;
        document.getElementById('progress-fill').style.width = `${percent}%`;

        // Reset Input
        const inputReason = document.getElementById('input-reason');
        inputReason.value = '';
        inputReason.classList.remove('input-error');
        inputReason.placeholder = "⚠️ Required: Why is this safe or malicious?";
        
        // Start Internal Timer
        app.startTime = Date.now();
    },

    recordAnswer: (verdict) => {
        const inputReason = document.getElementById('input-reason');
        const reasonText = inputReason.value.trim();

        // --- VALIDATION: MANDATORY 'WHY' ---
        if (reasonText.length < 3) {
            inputReason.classList.add('input-error'); // Make it red
            inputReason.placeholder = "⚠️ You must explain your reason here!";
            return; // Stop here. Do not save.
        }

        // Calculate Time
        const timeTaken = Date.now() - app.startTime;

        // Save Answer
        app.data.answers.push({
            email_id: app.images[app.currentIdx],
            user_verdict: verdict,
            reason: reasonText,
            time_taken_ms: timeTaken
        });

        app.currentIdx++;
        app.loadEmail();
    },

    // 4. Submit to Backend
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
                // BLOCK USER FOR FUTURE
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

// Start App
window.onload = app.init;