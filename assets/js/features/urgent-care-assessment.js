/**
 * People First Urgent Care - Urgent Care Assessment Button
 * Header-based button functionality (floating button disabled)
 */

document.addEventListener('DOMContentLoaded', function() {
    initUrgentCareAssessmentButton();
});

/**
 * Initialize the urgent care assessment button functionality
 * Note: Floating button creation is disabled since button is now in header
 */
function initUrgentCareAssessmentButton() {
    // Check if header urgent care button exists and add functionality
    const headerUrgentCareBtn = document.querySelector('.btn-urgent-care');
    if (headerUrgentCareBtn) {
        setupHeaderButtonBehavior(headerUrgentCareBtn);
    }

    // Floating button creation is disabled - button is now in header
    // if (!document.querySelector('.urgent-care-assessment-btn')) {
    //     createUrgentCareAssessmentButton();
    // }
    // setupButtonBehavior();
}

/**
 * Set up header button behavior
 */
function setupHeaderButtonBehavior(button) {
    if (!button) return;

    // Click event to open assessment
    button.addEventListener('click', function(e) {
        console.log('Header urgent care button clicked!');
        e.preventDefault(); // Prevent any default behavior
        openUrgentCareAssessment();
    });
}

/**
 * Create the urgent care assessment button (DISABLED - now in header)
 */
function createUrgentCareAssessmentButton() {
    // This function is disabled since the button is now in the header
    console.log('Floating urgent care button creation disabled - button is now in header');
    return;

    // Original code commented out:
    // const assessmentButton = document.createElement('button');
    // assessmentButton.className = 'urgent-care-assessment-btn';
    // assessmentButton.setAttribute('aria-label', 'Open urgent care assessment tool');
    // assessmentButton.innerHTML = '<i class="fa-solid fa-heartbeat"></i> Do I need to go to urgent care?';
    // document.body.appendChild(assessmentButton);
}

/**
 * Set up button behavior and event listeners (DISABLED - now in header)
 */
function setupButtonBehavior() {
    // This function is disabled since the button is now in the header
    console.log('Floating urgent care button behavior setup disabled - button is now in header');
    return;

    // Original code commented out:
    // const assessmentButton = document.querySelector('.urgent-care-assessment-btn');
    // if (!assessmentButton) return;
    // assessmentButton.addEventListener('click', function(e) {
    //     console.log('Button clicked!');
    //     e.preventDefault();
    //     openUrgentCareAssessment();
    // });
}

/**
 * Open the urgent care assessment tool
 */
function openUrgentCareAssessment() {
    // Add console log for debugging
    console.log('Opening symptom assessment page...');

    // Navigate to the symptom assessment page
    window.location.href = 'symptom_assessment.html';
}
