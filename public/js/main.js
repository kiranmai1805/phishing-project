const app = {
    // 1. CONFIG: Image list
    images: ['email1.jpg', 'email2.jpg', 'email3.jpg', 'email4.jpg', 'email5.jpg', 'email6.jpg', 'email7.jpg', 'email8.jpg', 'email9.jpg', 'email10.jpg'],
    
    currentIdx: 0,
    startTime: 0,
    
    data: {
        role: '',
        age: '',
        gender: '', // New Field
        answers: []
    },

    // 2. Navigation Logic
    setRole: (role) => {
        app.data.role = role;
        app.switchScreen('step-role', 'step-demo');
    },

    startSurvey: () => {
        const age = document.getElementById('input-age').value;
        const gender = document.getElementById('input-gender').value;

        if (!age || !gender) {
            alert("Please select both Age and Gender to proceed.");
            return;
        }

        app.data.age = age;
        app.data.gender = gender;
        
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
        inputReason.classList.remove('input-error'); // Remove red border if it was there
        
        // Start Internal Timer (This is the invisible clock!)
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
        document.getElementById(hideId).classList.add('hidden');
        document.getElementById(showId).classList.remove('hidden');
        document.getElementById(showId).classList.add('fade-in');
    }
};