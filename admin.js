document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const visitCountEl = document.getElementById('visit-count');
    const themeTogglesEl = document.getElementById('theme-toggles');
    const resumeDownloadsEl = document.getElementById('resume-downloads');
    const messageCountEl = document.getElementById('message-count');
    const messagesContainer = document.getElementById('messages-container');
    const clearDataBtn = document.getElementById('clear-data-btn');

    // --- FUNCTION TO LOAD AND DISPLAY DATA ---
    const loadDashboardData = () => {
        try {
            // 1. Load Stats
            const visitCount = localStorage.getItem('visitCount') || '0';
            const toggleCount = localStorage.getItem('toggleCount') || '0';
            const downloadCount = localStorage.getItem('downloadCount') || '0';
            
            if(visitCountEl) visitCountEl.textContent = visitCount;
            if(themeTogglesEl) themeTogglesEl.textContent = toggleCount;
            if(resumeDownloadsEl) resumeDownloadsEl.textContent = downloadCount;

            // 2. Load Messages
            const allMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            if(messageCountEl) messageCountEl.textContent = allMessages.length;
            if(messagesContainer) {
                messagesContainer.innerHTML = ''; // Clear previous messages

                if (allMessages.length === 0) {
                    messagesContainer.innerHTML = '<p class="no-messages">No messages have been received yet.</p>';
                } else {
                    // Display messages, newest first
                    allMessages.slice().reverse().forEach(msg => {
                        const messageCard = document.createElement('div');
                        messageCard.className = 'message-card';

                        // Format the date to be more readable
                        const date = new Date(msg.timestamp);
                        const formattedDate = date.toLocaleString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });

                        messageCard.innerHTML = `
                            <div class="message-header">
                                <div class="message-sender">
                                    <strong>From:</strong> ${sanitize(msg.name)} 
                                    <em>(&lt;${sanitize(msg.email)}&gt;)</em>
                                </div>
                                <div class="message-date">${formattedDate}</div>
                            </div>
                            <div class="message-subject"><strong>Subject:</strong> ${sanitize(msg.subject)}</div>
                            <p class="message-body">${sanitize(msg.message)}</p>
                        `;
                        messagesContainer.appendChild(messageCard);
                    });
                }
            }
        } catch(error) {
            console.error("Error loading dashboard data from localStorage:", error);
            if(messagesContainer) messagesContainer.innerHTML = '<p class="no-messages">Could not load dashboard data. It might be corrupted.</p>';
        }
    };

    // --- HELPER FUNCTION TO SANITIZE TEXT ---
    const sanitize = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str || "";
        return temp.innerHTML;
    };
    
    // --- EVENT LISTENER FOR CLEAR BUTTON ---
    if(clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all stats and messages? This action cannot be undone.')) {
                try {
                    localStorage.removeItem('visitCount');
                    localStorage.removeItem('toggleCount');
                    localStorage.removeItem('downloadCount');
                    localStorage.removeItem('contactMessages');
                    // Reload the dashboard to show cleared state
                    loadDashboardData();
                } catch (error) {
                    console.error("Error clearing localStorage:", error);
                    alert("Could not clear data. Please check browser permissions.");
                }
            }
        });
    }

    // --- INITIAL LOAD ---
    loadDashboardData();
});