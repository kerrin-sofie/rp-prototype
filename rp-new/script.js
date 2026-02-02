// Check-in Guide Steps Data
const checkinSteps = [
    {
        title: "Testing Step Title 1",
        description: "Testing description 1",
        code: ["t", "e", "s", "t", "1", "2", "3"]
    },
    {
        title: "Enter Building Access Code",
        description: "Use this code to enter the main building entrance. The keypad is located to the right of the front door.",
        code: ["A", "B", "C", "4", "5", "6", "7"]
    },
    {
        title: "Find Your Apartment",
        description: "Take the elevator to the 3rd floor and turn left. Your apartment is the second door on the right.",
        code: ["8", "9", "X", "Y", "Z", "0", "1"]
    }
];

let currentStep = 0;

// Accordion Functionality
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');
            
            // Toggle current accordion
            if (!isActive) {
                accordionItem.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            } else {
                accordionItem.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Check-in Overlay Functionality
function initCheckinOverlay() {
    const openBtn = document.getElementById('openCheckinGuide');
    const closeBtn = document.getElementById('closeOverlay');
    const overlay = document.getElementById('checkinOverlay');
    const continueBtn = document.getElementById('continueBtn');
    
    // Open overlay
    openBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        currentStep = 0;
        updateStep();
    });
    
    // Close overlay
    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        currentStep = 0;
        updateStep();
    }
    
    closeBtn.addEventListener('click', closeOverlay);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });
    
    // Continue button - advance to next step
    continueBtn.addEventListener('click', () => {
        if (currentStep < checkinSteps.length - 1) {
            currentStep++;
            updateStep();
        } else {
            // On last step, close the overlay
            closeOverlay();
        }
    });
}

// Update Step Display
function updateStep() {
    const step = checkinSteps[currentStep];
    const stepNumber = currentStep + 1;
    
    // Update step label
    document.getElementById('stepLabel').textContent = `STEP ${stepNumber}`;
    
    // Update step content
    document.getElementById('stepTitle').textContent = step.title;
    document.getElementById('stepDescription').textContent = step.description;
    
    // Update code display
    const codeDisplay = document.getElementById('codeDisplay');
    codeDisplay.innerHTML = '';
    step.code.forEach(char => {
        const span = document.createElement('span');
        span.className = 'code-char';
        span.textContent = char;
        codeDisplay.appendChild(span);
    });
    
    // Update progress bar
    const progressSegments = document.querySelectorAll('.progress-segment');
    progressSegments.forEach((segment, index) => {
        if (index <= currentStep) {
            segment.classList.add('active');
        } else {
            segment.classList.remove('active');
        }
    });
    
    // Update continue button text on last step
    const continueBtn = document.getElementById('continueBtn');
    if (currentStep === checkinSteps.length - 1) {
        continueBtn.textContent = 'Done';
    } else {
        continueBtn.textContent = 'Continue';
    }
}

// Mode Selector Functionality
function initModeSelector() {
    const modeSelectorBtn = document.getElementById('modeSelectorBtn');
    const modeOptions = document.getElementById('modeOptions');
    const modeContainer = document.querySelector('.mode-selector-container');
    const currentModeDisplay = document.getElementById('currentMode');
    const modeOptionButtons = document.querySelectorAll('.mode-option');
    
    let currentMode = 'during-stay'; // Default mode
    
    // Toggle mode options visibility
    modeSelectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        modeContainer.classList.toggle('active');
    });
    
    // Close mode options when clicking outside
    document.addEventListener('click', (e) => {
        if (!modeContainer.contains(e.target)) {
            modeContainer.classList.remove('active');
        }
    });
    
    // Handle mode selection
    modeOptionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const selectedMode = button.getAttribute('data-mode');
            
            // Update active state
            modeOptionButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current mode
            currentMode = selectedMode;
            
            // Update display text
            const modeLabels = {
                'pre-checkin': 'Pre Check-in',
                'during-stay': 'During Stay',
                'post-checkout': 'Post Check-out'
            };
            currentModeDisplay.textContent = modeLabels[selectedMode];
            
            // Close the options
            modeContainer.classList.remove('active');
            
            // Store mode in localStorage for persistence
            localStorage.setItem('reservationMode', selectedMode);
            
            // Dispatch custom event for future use
            document.dispatchEvent(new CustomEvent('modeChanged', {
                detail: { mode: selectedMode }
            }));
            
            // Add/remove body class based on mode for CSS targeting
            document.body.classList.remove('mode-pre-checkin', 'mode-during-stay', 'mode-post-checkout');
            document.body.classList.add(`mode-${selectedMode}`);
            
            // Update Access My Apartment content based on mode
            updateAccessApartmentContent(selectedMode);
            
            // Show/hide pre-checkin modal based on mode
            handleModeChange(selectedMode);
        });
    });
    
    // Update Access My Apartment content based on mode
    function updateAccessApartmentContent(mode) {
        const noInternetLink = document.getElementById('openNoInternetModal');
        const checkinGuideBtn = document.getElementById('openCheckinGuide');
        const preCheckinContent = document.getElementById('accessContentPreCheckin');
        const duringStayContent = document.getElementById('accessContentDuringStay');
        const helpSectionDuringStay = document.getElementById('helpSectionDuringStay');
        const helpSectionDefault = document.getElementById('helpSectionDefault');
        
        if (!noInternetLink) return;
        
        if (mode === 'during-stay') {
            // Show during-stay content (quick access buttons) and hide pre-checkin content
            if (preCheckinContent) preCheckinContent.style.display = 'none';
            if (duringStayContent) duringStayContent.style.display = 'block';
            // Use the "during stay" text
            noInternetLink.textContent = noInternetLink.getAttribute('data-text-during-stay');
            // Update button label for during-stay phase
            if (checkinGuideBtn) checkinGuideBtn.textContent = 'Need help on how to get in?';
            // Show help section after Access My Apartment, hide default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'block';
            if (helpSectionDefault) helpSectionDefault.style.display = 'none';
        } else if (mode === 'pre-checkin') {
            // Show pre-checkin content (bullet points) and hide during-stay content
            if (preCheckinContent) preCheckinContent.style.display = 'block';
            if (duringStayContent) duringStayContent.style.display = 'none';
            // Use the "pre check-in" text
            noInternetLink.textContent = noInternetLink.getAttribute('data-text-pre-checkin');
            // Update button label for pre-checkin phase
            if (checkinGuideBtn) checkinGuideBtn.textContent = 'See how to get in';
            // Hide help section after Access My Apartment, show default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'none';
            if (helpSectionDefault) helpSectionDefault.style.display = 'block';
        } else {
            // For post-checkout or other modes, use pre-checkin content as default
            if (preCheckinContent) preCheckinContent.style.display = 'block';
            if (duringStayContent) duringStayContent.style.display = 'none';
            noInternetLink.textContent = noInternetLink.getAttribute('data-text-pre-checkin');
            // Update button label for post-checkout phase
            if (checkinGuideBtn) checkinGuideBtn.textContent = 'See how to get in';
            // Hide help section after Access My Apartment, show default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'none';
            if (helpSectionDefault) helpSectionDefault.style.display = 'block';
        }
    }
    
    // Handle mode changes
    function handleModeChange(mode) {
        const preCheckinModal = document.getElementById('preCheckinModal');
        
        if (mode === 'pre-checkin') {
            // Always show modal when pre-checkin phase is selected
            preCheckinModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Reset modal to step 1 when showing
            const modalStep1 = document.getElementById('modalStep1');
            const modalStep2 = document.getElementById('modalStep2');
            const modalProgressSegments = document.querySelectorAll('.modal-progress-segment');
            
            if (modalStep1 && modalStep2) {
                modalStep1.style.display = 'block';
                modalStep2.style.display = 'none';
                document.getElementById('modalStepLabel').textContent = 'STEP 1';
                
                // Reset progress bar
                modalProgressSegments.forEach((segment, index) => {
                    if (index === 0) {
                        segment.classList.add('active');
                    } else {
                        segment.classList.remove('active');
                    }
                });
            }
        } else {
            preCheckinModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem('reservationMode');
    if (savedMode) {
        currentMode = savedMode;
        const modeLabels = {
            'pre-checkin': 'Pre Check-in',
            'during-stay': 'During Stay',
            'post-checkout': 'Post Check-out'
        };
        currentModeDisplay.textContent = modeLabels[savedMode];
        
        // Update active button
        modeOptionButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-mode') === savedMode) {
                btn.classList.add('active');
            }
        });
        
        // Add body class based on saved mode
        document.body.classList.remove('mode-pre-checkin', 'mode-during-stay', 'mode-post-checkout');
        document.body.classList.add(`mode-${savedMode}`);
        
        // Update Access My Apartment content based on saved mode
        updateAccessApartmentContent(savedMode);
        
        // Show modal if pre-checkin mode and not completed
        if (savedMode === 'pre-checkin') {
            handleModeChange(savedMode);
        }
    } else {
        // If no saved mode, use default and update content
        document.body.classList.add(`mode-${currentMode}`);
        updateAccessApartmentContent(currentMode);
    }
    
    // Listen for mode changes from other parts of the code
    document.addEventListener('modeChanged', (e) => {
        updateAccessApartmentContent(e.detail.mode);
        handleModeChange(e.detail.mode);
    });
}

// Pre Check-in Modal Functionality
function initPreCheckinModal() {
    const modal = document.getElementById('preCheckinModal');
    const checkinDropdownBtn = document.getElementById('checkinDropdownBtn');
    const checkoutDropdownBtn = document.getElementById('checkoutDropdownBtn');
    const checkinDropdownMenu = document.getElementById('checkinDropdownMenu');
    const checkoutDropdownMenu = document.getElementById('checkoutDropdownMenu');
    const checkinOptions = checkinDropdownMenu.querySelectorAll('.time-option');
    const checkoutOptions = checkoutDropdownMenu.querySelectorAll('.time-option');
    const continueBtn = document.getElementById('modalContinueBtn');
    const backBtn = document.getElementById('modalBackBtn');
    const modalStep1 = document.getElementById('modalStep1');
    const modalStep2 = document.getElementById('modalStep2');
    const modalProgressSegments = document.querySelectorAll('.modal-progress-segment');
    
    let currentModalStep = 1;
    let selectedCheckinTime = null;
    let selectedCheckoutTime = null;
    
    // Check-in dropdown functionality
    checkinDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = checkinDropdownBtn.classList.contains('active');
        
        // Close checkout dropdown if open
        checkoutDropdownBtn.classList.remove('active');
        checkoutDropdownMenu.classList.remove('active');
        
        // Toggle check-in dropdown
        if (isActive) {
            checkinDropdownBtn.classList.remove('active');
            checkinDropdownMenu.classList.remove('active');
        } else {
            checkinDropdownBtn.classList.add('active');
            checkinDropdownMenu.classList.add('active');
        }
    });
    
    // Check-out dropdown functionality
    checkoutDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = checkoutDropdownBtn.classList.contains('active');
        
        // Close check-in dropdown if open
        checkinDropdownBtn.classList.remove('active');
        checkinDropdownMenu.classList.remove('active');
        
        // Toggle check-out dropdown
        if (isActive) {
            checkoutDropdownBtn.classList.remove('active');
            checkoutDropdownMenu.classList.remove('active');
        } else {
            checkoutDropdownBtn.classList.add('active');
            checkoutDropdownMenu.classList.add('active');
        }
    });
    
    // Handle check-in time selection
    checkinOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const time = option.getAttribute('data-time');
            selectedCheckinTime = time;
            
            // Update button text
            const placeholder = checkinDropdownBtn.querySelector('.time-dropdown-placeholder');
            placeholder.textContent = time;
            placeholder.classList.add('selected');
            
            // Close dropdown
            checkinDropdownBtn.classList.remove('active');
            checkinDropdownMenu.classList.remove('active');
            
            // Update continue button state
            updateContinueButton();
        });
    });
    
    // Handle check-out time selection
    checkoutOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const time = option.getAttribute('data-time');
            selectedCheckoutTime = time;
            
            // Update button text
            const placeholder = checkoutDropdownBtn.querySelector('.time-dropdown-placeholder');
            placeholder.textContent = time;
            placeholder.classList.add('selected');
            
            // Close dropdown
            checkoutDropdownBtn.classList.remove('active');
            checkoutDropdownMenu.classList.remove('active');
            
            // Update continue button state
            updateContinueButton();
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!checkinDropdownBtn.contains(e.target) && !checkinDropdownMenu.contains(e.target)) {
            checkinDropdownBtn.classList.remove('active');
            checkinDropdownMenu.classList.remove('active');
        }
        if (!checkoutDropdownBtn.contains(e.target) && !checkoutDropdownMenu.contains(e.target)) {
            checkoutDropdownBtn.classList.remove('active');
            checkoutDropdownMenu.classList.remove('active');
        }
    });
    
    // Update continue button state
    function updateContinueButton() {
        if (selectedCheckinTime && selectedCheckoutTime) {
            continueBtn.disabled = false;
        } else {
            continueBtn.disabled = true;
        }
    }
    
    // Continue button - go to step 2
    continueBtn.addEventListener('click', () => {
        if (selectedCheckinTime && selectedCheckoutTime && currentModalStep === 1) {
            currentModalStep = 2;
            modalStep1.style.display = 'none';
            modalStep2.style.display = 'block';
            document.getElementById('modalStepLabel').textContent = 'STEP 2';
            
            // Update progress bar
            modalProgressSegments.forEach((segment, index) => {
                if (index < currentModalStep) {
                    segment.classList.add('active');
                } else {
                    segment.classList.remove('active');
                }
            });
        }
    });
    
    // Back button - go to step 1
    backBtn.addEventListener('click', () => {
        if (currentModalStep === 2) {
            currentModalStep = 1;
            modalStep1.style.display = 'block';
            modalStep2.style.display = 'none';
            document.getElementById('modalStepLabel').textContent = 'STEP 1';
            
            // Update progress bar
            modalProgressSegments.forEach((segment, index) => {
                if (index < currentModalStep) {
                    segment.classList.add('active');
                } else {
                    segment.classList.remove('active');
                }
            });
        }
    });
    
    // Submit button - close modal and reveal content
    const submitBtn = document.getElementById('modalSubmitBtn');
    submitBtn.addEventListener('click', () => {
        // Store form completion status
        localStorage.setItem('preCheckinCompleted', 'true');
        
        // Close the modal
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset modal state for next time
        currentModalStep = 1;
        modalStep1.style.display = 'block';
        modalStep2.style.display = 'none';
        document.getElementById('modalStepLabel').textContent = 'STEP 1';
        
        // Reset progress bar
        modalProgressSegments.forEach((segment, index) => {
            if (index < currentModalStep) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
        
        // Reset form selections (optional - you may want to keep them)
        // selectedCheckinTime = null;
        // selectedCheckoutTime = null;
        // updateContinueButton();
    });
    
    // Close modal when clicking overlay
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => {
        // Don't close on overlay click - modal should stay open until completed
        // This can be changed if needed
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            // Don't close on Escape - modal should stay open until completed
            // This can be changed if needed
        }
    });
    
    // Initialize continue button state
    updateContinueButton();
}

// No Internet Modal Functionality
function initNoInternetModal() {
    const openBtn = document.getElementById('openNoInternetModal');
    const closeBtn = document.getElementById('closeNoInternetModal');
    const modal = document.getElementById('noInternetModal');
    const form = document.getElementById('noInternetForm');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailAddress');
    const phoneGroup = document.getElementById('phoneNumberGroup');
    const emailGroup = document.getElementById('emailGroup');
    const deliveryMethodRadios = document.querySelectorAll('input[name="deliveryMethod"]');
    const submitBtn = document.getElementById('submitBtn');
    const reassuranceText = document.getElementById('reassuranceText');
    
    // Function to update form based on delivery method
    function updateDeliveryMethod() {
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
        
        if (selectedMethod === 'sms') {
            phoneGroup.style.display = 'flex';
            emailGroup.style.display = 'none';
            phoneInput.required = true;
            emailInput.required = false;
            submitBtn.textContent = 'Send Instructions via SMS';
            reassuranceText.textContent = 'You don\'t need to worry about not having internet. We\'ll make sure you receive everything you need via SMS!';
            
            // Prefill phone number based on phase
            if (currentMode === 'pre-checkin') {
                phoneInput.value = '+49 151 234 5678';
            } else if (currentMode === 'during-stay') {
                phoneInput.value = '+49 151 987 6543';
            } else {
                phoneInput.value = '+49 151 234 5678';
            }
        } else {
            phoneGroup.style.display = 'none';
            emailGroup.style.display = 'flex';
            phoneInput.required = false;
            emailInput.required = true;
            submitBtn.textContent = 'Send Instructions via Email';
            reassuranceText.textContent = 'You don\'t need to worry about not having internet. We\'ll make sure you receive everything you need via email!';
            
            // Prefill email
            emailInput.value = 'kerrin@arbio.com';
        }
    }
    
    // Listen for delivery method changes
    deliveryMethodRadios.forEach(radio => {
        radio.addEventListener('change', updateDeliveryMethod);
    });
    
    // Open modal
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get current mode to determine which example to use
        const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
        const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
        
        // Prefill based on method and phase
        if (selectedMethod === 'sms') {
            if (currentMode === 'pre-checkin') {
                phoneInput.value = '+49 151 234 5678';
            } else if (currentMode === 'during-stay') {
                phoneInput.value = '+49 151 987 6543';
            } else {
                phoneInput.value = '+49 151 234 5678';
            }
        } else {
            // Email is always the same
            emailInput.value = 'kerrin@arbio.com';
        }
        
        updateDeliveryMethod();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        // Reset to SMS default view
        phoneGroup.style.display = 'flex';
        emailGroup.style.display = 'none';
        phoneInput.required = true;
        emailInput.required = false;
        submitBtn.textContent = 'Send Instructions via SMS';
        reassuranceText.textContent = 'You don\'t need to worry about not having internet. We\'ll make sure you receive everything you need via SMS!';
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const deliveryMethod = formData.get('deliveryMethod');
        const reason = formData.get('noInternetReason');
        const phoneNumber = formData.get('phoneNumber');
        const emailAddress = formData.get('emailAddress');
        
        // Here you would typically send this data to your backend
        console.log('No Internet Form Submitted:', {
            deliveryMethod: deliveryMethod,
            reason: reason,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress
        });
        
        // Show success message based on delivery method
        if (deliveryMethod === 'sms') {
            alert('Thank you! We will send your check-in instructions via SMS at 3PM to ' + phoneNumber);
        } else {
            alert('Thank you! We will send your check-in instructions via email at 3PM to ' + emailAddress);
        }
        
        // Close modal
        closeModal();
    });
}

// Unlock Door Confirmation Modal Functionality
function initUnlockConfirmationModal() {
    const modal = document.getElementById('unlockConfirmationModal');
    const closeBtn = document.getElementById('closeUnlockConfirmationModal');
    const cancelBtn = document.getElementById('cancelUnlockBtn');
    const confirmBtn = document.getElementById('confirmUnlockBtn');
    const descriptionText = document.getElementById('unlockConfirmationDescription');
    const unlockButtons = document.querySelectorAll('.quick-access-action-btn');
    
    let currentLocation = '';
    
    // Function to open confirmation modal
    function openConfirmationModal(location) {
        currentLocation = location;
        // Update description text with location
        descriptionText.textContent = `Pressing this button will unlock the ${location}. Make sure you're ready to enter.`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close confirmation modal
    function closeConfirmationModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentLocation = '';
    }
    
    // Attach click handlers to unlock buttons
    unlockButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Only show confirmation if we're in during-stay mode
            const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
            if (currentMode !== 'during-stay') {
                return;
            }
            
            // Get the location from the parent quick-access-item
            const quickAccessItem = button.closest('.quick-access-item');
            const location = quickAccessItem ? quickAccessItem.getAttribute('data-location') : 'door';
            
            openConfirmationModal(location);
        });
    });
    
    // Close modal handlers
    closeBtn.addEventListener('click', closeConfirmationModal);
    cancelBtn.addEventListener('click', closeConfirmationModal);
    
    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeConfirmationModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeConfirmationModal();
        }
    });
    
    // Confirm unlock button handler
    confirmBtn.addEventListener('click', () => {
        // Here you would typically make an API call to unlock the door
        console.log(`Unlocking ${currentLocation}...`);
        
        // Show a brief success message (optional)
        // You could add a toast notification here if desired
        
        // Close the modal
        closeConfirmationModal();
        
        // Optional: You could add visual feedback to the button that was clicked
        // For example, temporarily disable it or show a loading state
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initCheckinOverlay();
    initModeSelector();
    initPreCheckinModal();
    initNoInternetModal();
    initUnlockConfirmationModal();
});



