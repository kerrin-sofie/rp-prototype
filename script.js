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
            
            // Check if this is Access My Apartment section in during-stay mode
            const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
            const isAccessSection = accordionItem.id === 'accessMyApartmentSection';
            const isPaymentSection = accordionItem.id === 'paymentDetailsSection';
            
            // Prevent closing Access My Apartment in during-stay phase
            if (isAccessSection && currentMode === 'during-stay' && isActive) {
                return; // Don't allow closing
            }
            
            // Prevent opening/closing Access My Apartment in post-checkout phase
            if (isAccessSection && currentMode === 'post-checkout') {
                return; // Don't allow any interaction
            }
            
            // Prevent closing Payment Details in post-checkout phase
            if (isPaymentSection && currentMode === 'post-checkout' && isActive) {
                return; // Don't allow closing
            }
            
            // Toggle current accordion
            if (!isActive) {
                accordionItem.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            } else {
                accordionItem.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            }
            
            // Ensure price breakdown and invoice button are visible when Payment Details is expanded
            if (accordionItem.id === 'paymentDetailsSection') {
                const invoiceDetailsBtn = document.getElementById('invoiceDetailsBtn');
                const invoiceDisclaimer = document.getElementById('invoiceDisclaimer');
                
                if (currentMode === 'during-stay') {
                    const paymentBreakdown = document.getElementById('paymentBreakdownDuringStay');
                    if (paymentBreakdown) {
                        if (accordionItem.classList.contains('active')) {
                            paymentBreakdown.style.display = 'block';
                        } else {
                            paymentBreakdown.style.display = 'none';
                        }
                    }
                    // Invoice button and disclaimer should always be visible in during-stay phase
                    if (invoiceDetailsBtn) {
                        invoiceDetailsBtn.style.display = 'block';
                    }
                    if (invoiceDisclaimer) {
                        invoiceDisclaimer.style.display = 'block';
                    }
                } else if (currentMode === 'pre-checkin') {
                    const paymentBreakdown = document.getElementById('paymentBreakdownPreCheckin');
                    if (paymentBreakdown) {
                        if (accordionItem.classList.contains('active')) {
                            paymentBreakdown.style.display = 'block';
                        } else {
                            paymentBreakdown.style.display = 'none';
                        }
                    }
                    // Invoice button and disclaimer should always be visible in pre-checkin phase
                    if (invoiceDetailsBtn) {
                        invoiceDetailsBtn.style.display = 'block';
                    }
                    if (invoiceDisclaimer) {
                        invoiceDisclaimer.style.display = 'block';
                    }
                } else if (currentMode === 'post-checkout') {
                    const paymentBreakdown = document.getElementById('paymentBreakdownDuringStay');
                    const requestInvoiceBtn = document.getElementById('requestInvoiceBtn');
                    const requestInvoiceDisclaimer = document.getElementById('requestInvoiceDisclaimer');
                    if (paymentBreakdown) {
                        if (accordionItem.classList.contains('active')) {
                            paymentBreakdown.style.display = 'block';
                        } else {
                            paymentBreakdown.style.display = 'none';
                        }
                    }
                    // Request invoice button and disclaimer should always be visible in post-checkout phase
                    if (requestInvoiceBtn) {
                        requestInvoiceBtn.style.display = 'block';
                    }
                    if (requestInvoiceDisclaimer) {
                        requestInvoiceDisclaimer.style.display = 'block';
                    }
                }
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
    const backBtn = document.getElementById('backBtn');
    
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
    
    // Back button - go to previous step
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        });
    }
    
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
    
    // Help link - open Access Trouble modal on step 2, default behavior otherwise
    const helpLink = document.querySelector('.help-link');
    if (helpLink) {
        helpLink.addEventListener('click', (e) => {
            // Only open Access Trouble modal on step 2 (currentStep === 1, since it's 0-indexed)
            if (currentStep === 1) {
                e.preventDefault();
                const accessTroubleModal = document.getElementById('accessTroubleModal');
                if (accessTroubleModal) {
                    accessTroubleModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
            // For other steps, allow default behavior (could be a link to external help)
        });
    }
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
    
    // Show/hide back button (show on step 2 and 3, hide on step 1)
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        if (currentStep > 0) {
            backBtn.style.display = 'block';
        } else {
            backBtn.style.display = 'none';
        }
    }
    
    // Show troubleshooting guide link only in during-stay phase for step 1
    const troubleshootingGuideLink = document.getElementById('troubleshootingGuideLink');
    if (troubleshootingGuideLink) {
        const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
        if (currentMode === 'during-stay' && currentStep === 0) {
            troubleshootingGuideLink.style.display = 'block';
        } else {
            troubleshootingGuideLink.style.display = 'none';
        }
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
                'unpaid': 'Unpaid',
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
            document.body.classList.remove('mode-unpaid', 'mode-pre-checkin', 'mode-during-stay', 'mode-post-checkout');
            document.body.classList.add(`mode-${selectedMode}`);
            
            // Update payment status badge based on mode
            updatePaymentStatus(selectedMode);
            
            // Update Access My Apartment content based on mode
            updateAccessApartmentContent(selectedMode);
            
            // Update Payment Details section state
            updatePaymentDetailsState(selectedMode);
            
            // Show/hide pre-checkin modal based on mode
            handleModeChange(selectedMode);
        });
    });
    
    // Update payment status badge based on mode
    function updatePaymentStatus(mode) {
        const paymentBadge = document.getElementById('paymentStatusBadge');
        const paymentBadgeInPayment = document.getElementById('paymentStatusBadgeInPayment');
        const paymentStatusInPaymentSection = document.getElementById('paymentStatusInPaymentSection');
        const totalPriceRow = document.getElementById('totalPriceRow');
        const paymentStatusInReservationDetails = document.getElementById('paymentStatusInReservationDetails');
        const unpaidReservationAlert = document.getElementById('unpaidReservationAlert');
        const discountCodeSection = document.getElementById('discountCodeSection');
        const totalPaidRow = document.getElementById('totalPaidRow');
        const totalToPayRow = document.getElementById('totalToPayRow');
        const paymentSection = document.getElementById('paymentDetailsSection');
        const paymentChevron = paymentSection ? paymentSection.querySelector('.accordion-chevron') : null;
        
        if (mode === 'unpaid') {
            // Hide chevron in unpaid phase
            if (paymentChevron) paymentChevron.style.display = 'none';
            // Show payment status in Payment Details section
            if (paymentStatusInPaymentSection) paymentStatusInPaymentSection.style.display = 'flex';
            // Show total price row
            if (totalPriceRow) totalPriceRow.style.display = 'flex';
            if (paymentBadgeInPayment) {
                paymentBadgeInPayment.textContent = 'UNPAID';
                paymentBadgeInPayment.className = 'payment-badge unpaid-badge';
            }
            // Show unpaid reservation alert (discount code section is inside it)
            if (unpaidReservationAlert) unpaidReservationAlert.style.display = 'block';
            // Expand discount code section by default
            const discountCodeHeader = document.getElementById('discountCodeHeader');
            const discountCodeContent = document.getElementById('discountCodeContent');
            if (discountCodeHeader && discountCodeContent) {
                discountCodeHeader.setAttribute('aria-expanded', 'true');
                discountCodeContent.style.display = 'block';
                const chevron = discountCodeHeader.querySelector('.discount-chevron');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
            // Show total paid and total to pay rows
            if (totalPaidRow) totalPaidRow.style.display = 'flex';
            if (totalToPayRow) totalToPayRow.style.display = 'flex';
            // Also show total cost row
            const totalCostRow = document.querySelector('.payment-breakdown .payment-row:first-child');
            if (totalCostRow) totalCostRow.style.display = 'flex';
            // Hide payment status from Reservation Details section
            if (paymentStatusInReservationDetails) paymentStatusInReservationDetails.style.display = 'none';
            // Also update the original badge (for other phases)
            if (paymentBadge) {
                paymentBadge.textContent = 'UNPAID';
                paymentBadge.className = 'payment-badge unpaid-badge';
            }
        } else {
            // Show chevron in other phases
            if (paymentChevron) paymentChevron.style.display = 'block';
            // Hide payment status from Payment Details section
            if (paymentStatusInPaymentSection) paymentStatusInPaymentSection.style.display = 'none';
            // Hide total price row
            if (totalPriceRow) totalPriceRow.style.display = 'none';
            // Hide unpaid reservation alert (discount code section is inside it)
            if (unpaidReservationAlert) unpaidReservationAlert.style.display = 'none';
            // Hide total paid and total to pay rows
            if (totalPaidRow) totalPaidRow.style.display = 'none';
            if (totalToPayRow) totalToPayRow.style.display = 'none';
            // Show only total cost in other phases
            const totalCostRow = document.querySelector('.payment-breakdown .payment-row:first-child');
            if (totalCostRow) totalCostRow.style.display = 'flex';
            // Show payment status in Reservation Details section
            if (paymentStatusInReservationDetails) paymentStatusInReservationDetails.style.display = 'flex';
            // Update badges
            if (paymentBadge) {
                paymentBadge.textContent = 'PAID';
                paymentBadge.className = 'payment-badge';
            }
            if (paymentBadgeInPayment) {
                paymentBadgeInPayment.textContent = 'PAID';
                paymentBadgeInPayment.className = 'payment-badge';
            }
        }
    }
    
    // Update Access My Apartment content based on mode
    function updateAccessApartmentContent(mode) {
        const noInternetLink = document.getElementById('openNoInternetModal');
        const checkinGuideBtn = document.getElementById('openCheckinGuide');
        const unpaidContent = document.getElementById('accessContentUnpaid');
        const preCheckinContent = document.getElementById('accessContentPreCheckin');
        const duringStayContent = document.getElementById('accessContentDuringStay');
        const helpSectionDuringStay = document.getElementById('helpSectionDuringStay');
        const helpSectionDefault = document.getElementById('helpSectionDefault');
        const accessSection = document.getElementById('accessMyApartmentSection');
        const accessHeader = accessSection ? accessSection.querySelector('.accordion-header') : null;
        const accessChevron = accessHeader ? accessHeader.querySelector('.accordion-chevron') : null;
        const accessDescription = document.getElementById('accessDescription');
        const upgradeSection = document.getElementById('upgradeYourStaySection');
        const upgradeHeader = upgradeSection ? upgradeSection.querySelector('.accordion-header') : null;
        const upgradeChevron = upgradeHeader ? upgradeHeader.querySelector('.accordion-chevron') : null;
        
        if (!noInternetLink) return;
        
        if (mode === 'unpaid') {
            // For unpaid phase, show locked state
            if (unpaidContent) unpaidContent.style.display = 'block';
            if (preCheckinContent) preCheckinContent.style.display = 'none';
            if (duringStayContent) duringStayContent.style.display = 'none';
            // Hide buttons and links in unpaid phase
            if (checkinGuideBtn) checkinGuideBtn.style.display = 'none';
            if (noInternetLink) noInternetLink.style.display = 'none';
            // Update description text for unpaid phase
            if (accessDescription) accessDescription.textContent = 'Everything you need to know about check-in will be unlocked once full payment is received.';
            // Hide chevron and add locked class for Access My Apartment
            if (accessChevron) accessChevron.style.display = 'none';
            if (accessSection) accessSection.classList.add('locked-section');
            // Prevent expansion in unpaid phase for Access My Apartment
            if (accessHeader) {
                accessHeader.setAttribute('aria-expanded', 'false');
                accessHeader.style.pointerEvents = 'none';
            }
            // Close the section if it's open
            if (accessSection) {
                accessSection.classList.remove('active');
                const content = accessSection.querySelector('.accordion-content');
                if (content) {
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    content.style.padding = '0 20px';
                }
            }
            // Hide chevron and add locked class for Upgrade Your Stay
            if (upgradeChevron) upgradeChevron.style.display = 'none';
            if (upgradeSection) upgradeSection.classList.add('locked-section');
            // Prevent expansion in unpaid phase for Upgrade Your Stay
            if (upgradeHeader) {
                upgradeHeader.setAttribute('aria-expanded', 'false');
                upgradeHeader.style.pointerEvents = 'none';
            }
            // Close the upgrade section if it's open
            if (upgradeSection) {
                upgradeSection.classList.remove('active');
                const upgradeContent = upgradeSection.querySelector('.accordion-content');
                if (upgradeContent) {
                    upgradeContent.style.maxHeight = '0';
                    upgradeContent.style.opacity = '0';
                    upgradeContent.style.padding = '0 20px';
                }
            }
            // Hide help section after Access My Apartment, show default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'none';
            if (helpSectionDefault) helpSectionDefault.style.display = 'block';
            
            // Restore original order: Move Payment Details back to the top (before Access My Apartment)
            const paymentSection = document.getElementById('paymentDetailsSection');
            const accessSectionForOrder = document.getElementById('accessMyApartmentSection');
            if (paymentSection && accessSectionForOrder) {
                // Check if Payment Details is not already before Access My Apartment
                const container = paymentSection.parentNode;
                const paymentIndex = Array.from(container.children).indexOf(paymentSection);
                const accessIndex = Array.from(container.children).indexOf(accessSectionForOrder);
                if (paymentIndex > accessIndex) {
                    // Move Payment Details before Access My Apartment
                    container.insertBefore(paymentSection, accessSectionForOrder);
                }
            }
        } else if (mode === 'during-stay') {
            // Show during-stay content (quick access buttons) and hide pre-checkin content
            if (unpaidContent) unpaidContent.style.display = 'none';
            if (preCheckinContent) preCheckinContent.style.display = 'none';
            if (duringStayContent) duringStayContent.style.display = 'block';
            // Restore original description text
            if (accessDescription) accessDescription.textContent = 'Everything you need to know about check-in.';
            // Hide chevron and keep Access My Apartment always expanded in during-stay
            if (accessChevron) accessChevron.style.display = 'none';
            if (accessSection) {
                accessSection.classList.remove('locked-section');
                // Keep section expanded and always visible
                accessSection.classList.add('active');
                const accessContent = accessSection.querySelector('.accordion-content');
                if (accessContent) {
                    accessContent.style.maxHeight = '1000px';
                    accessContent.style.opacity = '1';
                    accessContent.style.padding = '0 20px 20px 20px';
                }
            }
            if (accessHeader) {
                // Disable pointer events to prevent closing
                accessHeader.style.pointerEvents = 'none';
                accessHeader.style.cursor = 'default';
                accessHeader.setAttribute('aria-expanded', 'true');
            }
            // Show chevron and remove locked class for Upgrade Your Stay
            if (upgradeChevron) upgradeChevron.style.display = 'block';
            if (upgradeSection) upgradeSection.classList.remove('locked-section');
            if (upgradeHeader) {
                upgradeHeader.style.pointerEvents = '';
                upgradeHeader.style.cursor = '';
            }
            // Show during-stay upgrade content and hide pre-checkin content
            const upgradeServicesPreCheckin = document.getElementById('upgradeServicesListPreCheckin');
            const upgradeServicesDuringStay = document.getElementById('upgradeServicesList');
            const upgradeParkingPreCheckin = document.getElementById('upgradeParkingDisclaimerPreCheckin');
            const upgradeParkingDuringStay = document.getElementById('upgradeParkingDisclaimer');
            const upgradeDiscountPreCheckin = document.getElementById('upgradeDiscountSectionPreCheckin');
            const upgradeDiscountDuringStay = document.getElementById('upgradeDiscountSection');
            const upgradeBookNowPreCheckin = document.getElementById('upgradeBookNowBtnPreCheckin');
            const upgradeBookNowDuringStay = document.getElementById('upgradeBookNowBtn');
            
            if (upgradeServicesPreCheckin) upgradeServicesPreCheckin.style.display = 'none';
            if (upgradeServicesDuringStay) upgradeServicesDuringStay.style.display = 'block';
            if (upgradeParkingPreCheckin) upgradeParkingPreCheckin.style.display = 'none';
            if (upgradeParkingDuringStay) upgradeParkingDuringStay.style.display = 'block';
            if (upgradeDiscountPreCheckin) upgradeDiscountPreCheckin.style.display = 'none';
            if (upgradeDiscountDuringStay) upgradeDiscountDuringStay.style.display = 'block';
            if (upgradeBookNowPreCheckin) upgradeBookNowPreCheckin.style.display = 'none';
            if (upgradeBookNowDuringStay) upgradeBookNowDuringStay.style.display = 'block';
            // Use the "during stay" text
            noInternetLink.textContent = noInternetLink.getAttribute('data-text-during-stay');
            // Update button label for during-stay phase
            if (checkinGuideBtn) {
                checkinGuideBtn.textContent = 'Need help on how to get in?';
                checkinGuideBtn.style.display = 'block';
            }
            if (noInternetLink) noInternetLink.style.display = 'block';
            // Show help section after Access My Apartment, hide default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'block';
            if (helpSectionDefault) helpSectionDefault.style.display = 'none';
            
            // Move Payment Details to the very bottom in during-stay phase
            const paymentSection = document.getElementById('paymentDetailsSection');
            const container = paymentSection ? paymentSection.parentNode : null;
            if (paymentSection && container) {
                // Move Payment Details to the end of the container (very bottom)
                container.appendChild(paymentSection);
            }
        } else if (mode === 'pre-checkin') {
            // Show pre-checkin content (bullet points) and hide during-stay content
            if (unpaidContent) unpaidContent.style.display = 'none';
            if (preCheckinContent) preCheckinContent.style.display = 'block';
            if (duringStayContent) duringStayContent.style.display = 'none';
            // Restore original description text
            if (accessDescription) accessDescription.textContent = 'Everything you need to know about check-in.';
            // Show chevron and remove locked class for Access My Apartment
            if (accessChevron) accessChevron.style.display = 'block';
            if (accessSection) {
                accessSection.classList.remove('locked-section');
                // Expand the section by default in pre-checkin mode
                accessSection.classList.add('active');
                const accessContent = accessSection.querySelector('.accordion-content');
                if (accessContent) {
                    // Remove any restrictions on the content
                    accessContent.style.pointerEvents = '';
                    // Expand the content to show it by default
                    accessContent.style.maxHeight = '1000px';
                    accessContent.style.opacity = '1';
                    accessContent.style.padding = '0 20px 20px 20px';
                }
            }
            if (accessHeader) {
                accessHeader.style.pointerEvents = '';
                accessHeader.style.cursor = 'pointer';
                // Set aria-expanded to true to indicate it's open
                accessHeader.setAttribute('aria-expanded', 'true');
                // Ensure aria attributes allow interaction
                accessHeader.removeAttribute('disabled');
            }
            // Show chevron and remove locked class for Upgrade Your Stay
            if (upgradeChevron) upgradeChevron.style.display = 'block';
            if (upgradeSection) upgradeSection.classList.remove('locked-section');
            if (upgradeHeader) {
                upgradeHeader.style.pointerEvents = '';
                upgradeHeader.style.cursor = 'pointer';
                upgradeHeader.removeAttribute('disabled');
            }
            // Show pre-checkin upgrade content and hide during-stay content
            const upgradeServicesPreCheckin = document.getElementById('upgradeServicesListPreCheckin');
            const upgradeServicesDuringStay = document.getElementById('upgradeServicesList');
            const upgradeParkingPreCheckin = document.getElementById('upgradeParkingDisclaimerPreCheckin');
            const upgradeParkingDuringStay = document.getElementById('upgradeParkingDisclaimer');
            const upgradeDiscountPreCheckin = document.getElementById('upgradeDiscountSectionPreCheckin');
            const upgradeDiscountDuringStay = document.getElementById('upgradeDiscountSection');
            const upgradeBookNowPreCheckin = document.getElementById('upgradeBookNowBtnPreCheckin');
            const upgradeBookNowDuringStay = document.getElementById('upgradeBookNowBtn');
            
            if (upgradeServicesPreCheckin) upgradeServicesPreCheckin.style.display = 'block';
            if (upgradeServicesDuringStay) upgradeServicesDuringStay.style.display = 'none';
            if (upgradeParkingPreCheckin) upgradeParkingPreCheckin.style.display = 'block';
            if (upgradeParkingDuringStay) upgradeParkingDuringStay.style.display = 'none';
            if (upgradeDiscountPreCheckin) upgradeDiscountPreCheckin.style.display = 'block';
            if (upgradeDiscountDuringStay) upgradeDiscountDuringStay.style.display = 'none';
            if (upgradeBookNowPreCheckin) upgradeBookNowPreCheckin.style.display = 'block';
            if (upgradeBookNowDuringStay) upgradeBookNowDuringStay.style.display = 'none';
            // Use the "pre check-in" text
            noInternetLink.textContent = noInternetLink.getAttribute('data-text-pre-checkin');
            // Update button label for pre-checkin phase
            if (checkinGuideBtn) {
                checkinGuideBtn.textContent = 'See how to get in';
                checkinGuideBtn.style.display = 'block';
            }
            if (noInternetLink) noInternetLink.style.display = 'block';
            // Hide help section after Access My Apartment, show default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'none';
            if (helpSectionDefault) helpSectionDefault.style.display = 'block';
            
            // Reorder sections: Move Payment Details below Reservation Details in pre-checkin mode
            const paymentSection = document.getElementById('paymentDetailsSection');
            const reservationSection = document.getElementById('reservationDetailsSection');
            if (paymentSection && reservationSection) {
                // Check if Payment Details is not already after Reservation Details
                const container = paymentSection.parentNode;
                const paymentIndex = Array.from(container.children).indexOf(paymentSection);
                const reservationIndex = Array.from(container.children).indexOf(reservationSection);
                if (paymentIndex < reservationIndex) {
                    // Move Payment Details after Reservation Details
                    container.insertBefore(paymentSection, reservationSection.nextSibling);
                }
            }
        } else {
            // For post-checkout phase
            if (mode === 'post-checkout') {
                // Show pre-checkin content but keep section closed and locked
                if (unpaidContent) unpaidContent.style.display = 'none';
                if (preCheckinContent) preCheckinContent.style.display = 'block';
                if (duringStayContent) duringStayContent.style.display = 'none';
                // Restore original description text
                if (accessDescription) accessDescription.textContent = 'Everything you need to know about check-in.';
                // Hide chevron and prevent expansion for Access My Apartment in post-checkout
                // Note: Don't add 'locked-section' class to avoid red border and "Payment Required" tag
                if (accessChevron) accessChevron.style.display = 'none';
                if (accessSection) {
                    accessSection.classList.remove('locked-section'); // Ensure locked-section is removed
                    // Keep section closed
                    accessSection.classList.remove('active');
                    const accessContent = accessSection.querySelector('.accordion-content');
                    if (accessContent) {
                        accessContent.style.maxHeight = '0';
                        accessContent.style.opacity = '0';
                        accessContent.style.padding = '0 20px';
                    }
                }
                if (accessHeader) {
                    // Disable pointer events to prevent opening
                    accessHeader.style.pointerEvents = 'none';
                    accessHeader.style.cursor = 'default';
                    accessHeader.setAttribute('aria-expanded', 'false');
                }
                // Hide buttons and links in post-checkout phase
                if (checkinGuideBtn) checkinGuideBtn.style.display = 'none';
                if (noInternetLink) noInternetLink.style.display = 'none';
            } else {
                // For other modes (fallback), use pre-checkin content as default
                if (unpaidContent) unpaidContent.style.display = 'none';
                if (preCheckinContent) preCheckinContent.style.display = 'block';
                if (duringStayContent) duringStayContent.style.display = 'none';
                // Restore original description text
                if (accessDescription) accessDescription.textContent = 'Everything you need to know about check-in.';
                // Show chevron and remove locked class for Access My Apartment
                if (accessChevron) accessChevron.style.display = 'block';
                if (accessSection) {
                    accessSection.classList.remove('locked-section');
                    // Reset any inline styles that might have been set in pre-checkin
                    const accessContent = accessSection.querySelector('.accordion-content');
                    if (accessContent) {
                        accessContent.style.maxHeight = '';
                        accessContent.style.opacity = '';
                        accessContent.style.padding = '';
                    }
                }
                if (accessHeader) {
                    accessHeader.style.pointerEvents = '';
                    accessHeader.style.cursor = '';
                }
                noInternetLink.textContent = noInternetLink.getAttribute('data-text-pre-checkin');
                // Update button label
                if (checkinGuideBtn) {
                    checkinGuideBtn.textContent = 'See how to get in';
                    checkinGuideBtn.style.display = 'block';
                }
                if (noInternetLink) noInternetLink.style.display = 'block';
            }
            // Show chevron and remove locked class for Upgrade Your Stay
            if (upgradeChevron) upgradeChevron.style.display = 'block';
            if (upgradeSection) upgradeSection.classList.remove('locked-section');
            if (upgradeHeader) {
                upgradeHeader.style.pointerEvents = '';
                upgradeHeader.style.cursor = '';
            }
            // Hide help section after Access My Apartment, show default one
            if (helpSectionDuringStay) helpSectionDuringStay.style.display = 'none';
            if (helpSectionDefault) helpSectionDefault.style.display = 'block';
            
            // Restore original order: Move Payment Details back to the top (before Access My Apartment)
            const paymentSection = document.getElementById('paymentDetailsSection');
            const accessSectionForOrder = document.getElementById('accessMyApartmentSection');
            if (paymentSection && accessSectionForOrder) {
                // Check if Payment Details is not already before Access My Apartment
                const container = paymentSection.parentNode;
                const paymentIndex = Array.from(container.children).indexOf(paymentSection);
                const accessIndex = Array.from(container.children).indexOf(accessSectionForOrder);
                if (paymentIndex > accessIndex) {
                    // Move Payment Details before Access My Apartment
                    container.insertBefore(paymentSection, accessSectionForOrder);
                }
            }
        }
    }
    
    // Update Payment Details section state based on mode
    function updatePaymentDetailsState(mode) {
        const paymentSection = document.getElementById('paymentDetailsSection');
        if (!paymentSection) return;
        
        const paymentHeader = paymentSection.querySelector('.accordion-header');
        const paymentContent = paymentSection.querySelector('.accordion-content');
        const paymentBreakdownPreCheckin = document.getElementById('paymentBreakdownPreCheckin');
        const paymentBreakdownDuringStay = document.getElementById('paymentBreakdownDuringStay');
        const invoiceDetailsBtn = document.getElementById('invoiceDetailsBtn');
        const invoiceDisclaimer = document.getElementById('invoiceDisclaimer');
        const requestInvoiceBtn = document.getElementById('requestInvoiceBtn');
        const requestInvoiceDisclaimer = document.getElementById('requestInvoiceDisclaimer');
        
        if (mode === 'unpaid') {
            // Open Payment Details by default in unpaid phase
            paymentSection.classList.add('active');
            if (paymentHeader) paymentHeader.setAttribute('aria-expanded', 'true');
            if (paymentContent) {
                paymentContent.style.maxHeight = '1000px';
                paymentContent.style.opacity = '1';
                paymentContent.style.padding = '0 20px 20px 20px';
            }
            // Hide price breakdown in unpaid phase
            if (paymentBreakdownPreCheckin) paymentBreakdownPreCheckin.style.display = 'none';
            if (paymentBreakdownDuringStay) paymentBreakdownDuringStay.style.display = 'none';
            // Reset security hold badge to "Hold Success" in unpaid phase (if visible)
            const securityHoldBadge = document.querySelector('.security-hold-badge');
            if (securityHoldBadge) {
                securityHoldBadge.textContent = 'Hold Success';
            }
            // Hide invoice details button and disclaimer in unpaid phase
            if (invoiceDetailsBtn) invoiceDetailsBtn.style.display = 'none';
            if (invoiceDisclaimer) invoiceDisclaimer.style.display = 'none';
            // Hide request invoice button and disclaimer in unpaid phase
            if (requestInvoiceBtn) requestInvoiceBtn.style.display = 'none';
            if (requestInvoiceDisclaimer) requestInvoiceDisclaimer.style.display = 'none';
        } else if (mode === 'during-stay') {
            // Show price breakdown in during-stay phase (will be visible when section is expanded)
            if (paymentBreakdownDuringStay) {
                // Only show if section is active, otherwise CSS will handle it when expanded
                if (paymentSection.classList.contains('active')) {
                    paymentBreakdownDuringStay.style.display = 'block';
                } else {
                    paymentBreakdownDuringStay.style.display = 'none';
                }
            }
            // Hide pre-checkin breakdown in during-stay phase
            if (paymentBreakdownPreCheckin) paymentBreakdownPreCheckin.style.display = 'none';
            // Reset security hold badge to "Hold Success" in during-stay phase
            const securityHoldBadge = document.querySelector('.security-hold-badge');
            if (securityHoldBadge) {
                securityHoldBadge.textContent = 'Hold Success';
            }
            // Show invoice details button and disclaimer in during-stay phase
            if (invoiceDetailsBtn) invoiceDetailsBtn.style.display = 'block';
            if (invoiceDisclaimer) invoiceDisclaimer.style.display = 'block';
            // Hide request invoice button and disclaimer in during-stay phase
            if (requestInvoiceBtn) requestInvoiceBtn.style.display = 'none';
            if (requestInvoiceDisclaimer) requestInvoiceDisclaimer.style.display = 'none';
            // Allow Payment Details to be expandable in during-stay - let CSS handle the expansion
            if (paymentHeader) paymentHeader.setAttribute('aria-expanded', 'false');
            // Remove inline styles to let CSS handle accordion expansion
            if (paymentContent) {
                paymentContent.style.maxHeight = '';
                paymentContent.style.opacity = '';
                paymentContent.style.padding = '';
            }
            // Ensure section starts collapsed
            paymentSection.classList.remove('active');
        } else if (mode === 'pre-checkin') {
            // Show invoice details button and disclaimer in pre-checkin phase
            if (invoiceDetailsBtn) invoiceDetailsBtn.style.display = 'block';
            if (invoiceDisclaimer) invoiceDisclaimer.style.display = 'block';
            // Hide request invoice button and disclaimer in pre-checkin phase
            if (requestInvoiceBtn) requestInvoiceBtn.style.display = 'none';
            if (requestInvoiceDisclaimer) requestInvoiceDisclaimer.style.display = 'none';
            // Show price breakdown in pre-checkin phase (will be visible when section is expanded)
            if (paymentBreakdownPreCheckin) {
                // Only show if section is active, otherwise CSS will handle it when expanded
                if (paymentSection.classList.contains('active')) {
                    paymentBreakdownPreCheckin.style.display = 'block';
                } else {
                    paymentBreakdownPreCheckin.style.display = 'none';
                }
            }
            // Hide during-stay breakdown in pre-checkin phase
            if (paymentBreakdownDuringStay) paymentBreakdownDuringStay.style.display = 'none';
            // Reset security hold badge to "Hold Success" in pre-checkin phase (if visible)
            const securityHoldBadge = document.querySelector('.security-hold-badge');
            if (securityHoldBadge) {
                securityHoldBadge.textContent = 'Hold Success';
            }
            // Allow Payment Details to be expandable in pre-checkin - let CSS handle the expansion
            if (paymentHeader) paymentHeader.setAttribute('aria-expanded', 'false');
            // Remove inline styles to let CSS handle accordion expansion
            if (paymentContent) {
                paymentContent.style.maxHeight = '';
                paymentContent.style.opacity = '';
                paymentContent.style.padding = '';
            }
            // Ensure section starts collapsed
            paymentSection.classList.remove('active');
        } else {
            // Post-checkout phase
            // Keep Payment Details section expanded and prevent closing
            paymentSection.classList.add('active');
            if (paymentHeader) {
                paymentHeader.setAttribute('aria-expanded', 'true');
                // Disable pointer events to prevent closing
                paymentHeader.style.pointerEvents = 'none';
                paymentHeader.style.cursor = 'default';
            }
            // Hide chevron icon in post-checkout phase
            const paymentChevron = paymentHeader ? paymentHeader.querySelector('.accordion-chevron') : null;
            if (paymentChevron) paymentChevron.style.display = 'none';
            // Expand content
            if (paymentContent) {
                paymentContent.style.maxHeight = '1000px';
                paymentContent.style.opacity = '1';
                paymentContent.style.padding = '0 20px 20px 20px';
            }
            // Show price breakdown (same as during-stay) in post-checkout phase
            if (paymentBreakdownDuringStay) {
                paymentBreakdownDuringStay.style.display = 'block';
            }
            // Hide other price breakdowns
            if (paymentBreakdownPreCheckin) paymentBreakdownPreCheckin.style.display = 'none';
            // Update security hold badge to "Released" in post-checkout phase
            const securityHoldBadge = document.querySelector('.security-hold-badge');
            if (securityHoldBadge) {
                securityHoldBadge.textContent = 'Released';
            }
            // Hide invoice details button and disclaimer in post-checkout phase
            if (invoiceDetailsBtn) invoiceDetailsBtn.style.display = 'none';
            if (invoiceDisclaimer) invoiceDisclaimer.style.display = 'none';
            // Show request invoice button and disclaimer in post-checkout phase
            if (requestInvoiceBtn) requestInvoiceBtn.style.display = 'block';
            if (requestInvoiceDisclaimer) requestInvoiceDisclaimer.style.display = 'block';
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
            'unpaid': 'Unpaid',
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
        document.body.classList.remove('mode-unpaid', 'mode-pre-checkin', 'mode-during-stay', 'mode-post-checkout');
        document.body.classList.add(`mode-${savedMode}`);
        
        // Update payment status badge based on saved mode
        updatePaymentStatus(savedMode);
        
        // Update Access My Apartment content based on saved mode
        updateAccessApartmentContent(savedMode);
        
        // Update Payment Details section state
        updatePaymentDetailsState(savedMode);
        
        // Show modal if pre-checkin mode and not completed
        if (savedMode === 'pre-checkin') {
            handleModeChange(savedMode);
        }
    } else {
        // If no saved mode, use default and update content
        document.body.classList.add(`mode-${currentMode}`);
        updatePaymentStatus(currentMode);
        updateAccessApartmentContent(currentMode);
        updatePaymentDetailsState(currentMode);
    }
    
    // Listen for mode changes from other parts of the code
    document.addEventListener('modeChanged', (e) => {
        updatePaymentStatus(e.detail.mode);
        updateAccessApartmentContent(e.detail.mode);
        updatePaymentDetailsState(e.detail.mode);
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

// Discount Code Functionality
function initDiscountCode() {
    const discountCodeHeader = document.getElementById('discountCodeHeader');
    const discountCodeContent = document.getElementById('discountCodeContent');
    const couponAddBtn = document.getElementById('couponAddBtn');
    const couponInput = document.getElementById('couponInput');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    const totalCost = document.getElementById('totalCost');
    const totalToPay = document.getElementById('totalToPay');
    const outstandingAmount = document.getElementById('outstandingAmount');
    
    let appliedDiscount = 0;
    const baseTotal = 83;
    
    // Function to update outstanding amount
    function updateOutstandingAmount() {
        const total = Math.round((baseTotal - appliedDiscount) * 100) / 100;
        if (totalToPay) totalToPay.textContent = `${total}€`;
        if (outstandingAmount) outstandingAmount.textContent = `${total}€`;
        if (totalCost) totalCost.textContent = `${baseTotal}€`;
    }
    
    // Initialize outstanding amount
    updateOutstandingAmount();
    
    // Toggle discount code section
    if (discountCodeHeader && discountCodeContent) {
        discountCodeHeader.addEventListener('click', () => {
            const isExpanded = discountCodeHeader.getAttribute('aria-expanded') === 'true';
            discountCodeHeader.setAttribute('aria-expanded', !isExpanded);
            discountCodeContent.style.display = isExpanded ? 'none' : 'block';
            
            // Rotate chevron
            const chevron = discountCodeHeader.querySelector('.discount-chevron');
            if (chevron) {
                chevron.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    }
    
    // Apply coupon code
    if (couponAddBtn && couponInput) {
        couponAddBtn.addEventListener('click', () => {
            const couponCode = couponInput.value.trim();
            
            if (!couponCode) {
                alert('Please enter a coupon code');
                return;
            }
            
            // Simulate coupon validation (replace with actual API call)
            // Example: 10% discount
            if (couponCode.toLowerCase() === 'save10' || couponCode.toLowerCase() === 'test') {
                appliedDiscount = baseTotal * 0.1; // 10% discount
                
                // Update UI
                updateOutstandingAmount();
                
                // Disable input and button
                couponInput.disabled = true;
                couponAddBtn.disabled = true;
                couponAddBtn.textContent = 'Applied';
                
                // Show success message
                alert(`Coupon "${couponCode}" applied successfully!`);
            } else {
                alert('Invalid coupon code. Please try again.');
            }
        });
        
        // Allow Enter key to submit
        couponInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                couponAddBtn.click();
            }
        });
    }
}

// Upgrade Discount Code Functionality
function initUpgradeDiscountCode() {
    // During Stay version
    const upgradeDiscountHeader = document.getElementById('upgradeDiscountHeader');
    const upgradeDiscountContent = document.getElementById('upgradeDiscountContent');
    const upgradeCouponAddBtn = document.getElementById('upgradeCouponAddBtn');
    const upgradeCouponInput = document.getElementById('upgradeCouponInput');
    
    // Pre-checkin version
    const upgradeDiscountHeaderPreCheckin = document.getElementById('upgradeDiscountHeaderPreCheckin');
    const upgradeDiscountContentPreCheckin = document.getElementById('upgradeDiscountContentPreCheckin');
    const upgradeCouponAddBtnPreCheckin = document.getElementById('upgradeCouponAddBtnPreCheckin');
    const upgradeCouponInputPreCheckin = document.getElementById('upgradeCouponInputPreCheckin');
    
    // Helper function to initialize discount code for a specific set of elements
    function initDiscountCodeForElements(header, content, addBtn, input) {
        if (!header || !content || !addBtn || !input) return;
        
        // Toggle discount code section
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Apply coupon code
        addBtn.addEventListener('click', () => {
            const couponCode = input.value.trim();
            
            if (!couponCode) {
                alert('Please enter a coupon code');
                return;
            }
            
            // Simulate coupon validation (replace with actual API call)
            if (couponCode.toLowerCase() === 'save10' || couponCode.toLowerCase() === 'test') {
                // Disable input and button
                input.disabled = true;
                addBtn.disabled = true;
                addBtn.textContent = 'Applied';
                
                // Show success message
                alert(`Coupon "${couponCode}" applied successfully!`);
            } else {
                alert('Invalid coupon code. Please try again.');
            }
        });
        
        // Allow Enter key to submit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }
    
    // Initialize both versions
    initDiscountCodeForElements(upgradeDiscountHeader, upgradeDiscountContent, upgradeCouponAddBtn, upgradeCouponInput);
    initDiscountCodeForElements(upgradeDiscountHeaderPreCheckin, upgradeDiscountContentPreCheckin, upgradeCouponAddBtnPreCheckin, upgradeCouponInputPreCheckin);
}

    // Payment Button Functionality
    function initPaymentButton() {
        const payNowBtn = document.getElementById('payNowBtn');
        
        if (payNowBtn) {
            payNowBtn.addEventListener('click', () => {
                // Get the outstanding amount
                const outstandingAmount = document.getElementById('outstandingAmount');
                const amount = outstandingAmount ? outstandingAmount.textContent : '83€';
                
                // In a real application, this would redirect to a checkout page
                // For now, we'll simulate it with a confirmation
                const proceed = confirm(`You will be redirected to the checkout page to pay ${amount}. Continue?`);
                
                if (proceed) {
                    // Replace this with actual checkout URL
                    // window.location.href = '/checkout';
                    console.log('Redirecting to checkout page...');
                    alert(`Redirecting to checkout page to pay ${amount}...`);
                }
            });
        }
    }

// Troubleshooting Guide Functionality
function initTroubleshootingGuide() {
    const troubleshootingGuideLink = document.getElementById('troubleshootingGuideLink');
    
    if (troubleshootingGuideLink) {
        troubleshootingGuideLink.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real application, this would open a troubleshooting guide modal or navigate to a troubleshooting page
            // For now, we'll show an alert as a placeholder
            // You can replace this with actual troubleshooting guide content/modal
            alert('Troubleshooting guide for Step 1:\n\n• Make sure you are at the correct location\n• Check that the code is entered correctly\n• Ensure the keypad is responsive\n• Try pressing each button firmly\n• If issues persist, contact support');
            
            // Example: Could open a modal here instead
            // openTroubleshootingModal();
        });
    }
}

// Access Trouble Modal Functionality
function initAccessTroubleModal() {
    const modal = document.getElementById('accessTroubleModal');
    const closeBtn = document.getElementById('closeAccessTroubleModal');
    const form = document.getElementById('accessTroubleForm');
    const getBackupAccessBtn = document.getElementById('getBackupAccessBtn');
    const troubleshootingGuideModalLink = document.getElementById('troubleshootingGuideModalLink');
    
    if (!modal) return;
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form
        if (form) {
            form.reset();
        }
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Troubleshooting guide link in modal - opens in new tab
    // The link will open in a new tab due to target="_blank" attribute
    // Update the href in HTML to point to the actual troubleshooting guide URL
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const accessIssue = formData.get('accessIssue');
            
            if (!accessIssue) {
                alert('Please select a reason for the access issue.');
                return;
            }
            
            // In a real application, this would send the data to the backend
            console.log('Access issue reported:', accessIssue);
            
            // Show success message and close modal
            alert('Thank you for reporting the issue. Backup access information will be sent to you shortly.');
            closeModal();
        });
    }
    
    // Get Backup Access button (also handles form submission)
    if (getBackupAccessBtn) {
        getBackupAccessBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        });
    }
}

// Security Hold Popover Functionality
function initSecurityHoldPopover() {
    const infoIcon = document.getElementById('securityHoldInfoIcon');
    const popover = document.getElementById('securityHoldPopover');
    
    if (!infoIcon || !popover) return;
    
    // Toggle popover on icon click
    infoIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = popover.classList.contains('visible');
        
        if (isVisible) {
            popover.classList.remove('visible');
        } else {
            // Calculate position relative to icon
            const iconRect = infoIcon.getBoundingClientRect();
            const popoverWidth = 280; // min-width
            const spacing = 12; // space between icon and popover
            
            // Position above the icon
            const topPosition = iconRect.top - (popover.offsetHeight || 120) - spacing;
            
            // Center horizontally relative to icon, but keep within viewport
            let leftPosition = iconRect.left - (popoverWidth / 2) + (iconRect.width / 2);
            leftPosition = Math.max(20, Math.min(leftPosition, window.innerWidth - popoverWidth - 20));
            
            popover.style.top = `${Math.max(20, topPosition)}px`;
            popover.style.left = `${leftPosition}px`;
            
            popover.classList.add('visible');
        }
    });
    
    // Close popover when clicking outside
    document.addEventListener('click', (e) => {
        if (!infoIcon.contains(e.target) && !popover.contains(e.target)) {
            popover.classList.remove('visible');
        }
    });
    
    // Close popover on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popover.classList.contains('visible')) {
            popover.classList.remove('visible');
        }
    });
}

// Invoice Details Button Functionality
function initInvoiceDetailsButton() {
    const invoiceDetailsBtn = document.getElementById('invoiceDetailsBtn');
    
    if (invoiceDetailsBtn) {
        invoiceDetailsBtn.addEventListener('click', () => {
            // In a real application, this would open a modal or navigate to an invoice details page
            // For now, we'll show an alert as a placeholder
            // You can replace this with actual invoice details modal/page
            const currentMode = localStorage.getItem('reservationMode') || 'during-stay';
            const modeText = currentMode === 'pre-checkin' ? 'pre-check-in' : 'during-stay';
            
            alert(`Invoice details preview for ${modeText} phase.\n\nNote: The actual invoice can only be issued post check-out. This is a preview of the invoice details before issuance.`);
            
            // Example: Could open a modal here instead
            // openInvoiceDetailsModal();
        });
    }
}

// Request Invoice Button Functionality
function initRequestInvoiceButton() {
    const requestInvoiceBtn = document.getElementById('requestInvoiceBtn');
    
    if (requestInvoiceBtn) {
        requestInvoiceBtn.addEventListener('click', () => {
            // In a real application, this would request the invoice from the backend
            // For now, we'll show an alert as a placeholder
            // You can replace this with actual invoice request API call
            alert('Invoice request submitted successfully. Your invoice will be sent to your email address shortly.');
            
            // Example: Could make an API call here instead
            // requestInvoice();
        });
    }
}

// WiFi Copy to Clipboard Functionality
function initWiFiCopy() {
    const wifiName = document.getElementById('wifiName');
    const wifiPassword = document.getElementById('wifiPassword');
    
    function copyToClipboard(element, text) {
        // Use the Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback(element);
            }).catch(err => {
                console.error('Failed to copy:', err);
                fallbackCopyToClipboard(text, element);
            });
        } else {
            // Fallback for older browsers
            fallbackCopyToClipboard(text, element);
        }
    }
    
    function fallbackCopyToClipboard(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyFeedback(element);
            } else {
                console.error('Fallback copy failed');
            }
        } catch (err) {
            console.error('Fallback copy error:', err);
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    function showCopyFeedback(element) {
        // Add copied class for visual feedback
        element.classList.add('copied');
        
        // Change icon to checkmark temporarily
        const copyIcon = element.querySelector('.copy-icon');
        if (copyIcon) {
            const originalHTML = copyIcon.innerHTML;
            copyIcon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
            copyIcon.setAttribute('viewBox', '0 0 24 24');
            
            // Reset after 2 seconds
            setTimeout(() => {
                element.classList.remove('copied');
                copyIcon.innerHTML = originalHTML;
                copyIcon.setAttribute('viewBox', '0 0 24 24');
            }, 2000);
        }
    }
    
    function getTextToCopy(element) {
        // First try to get from data attribute
        const dataText = element.getAttribute('data-copy-text');
        if (dataText) {
            return dataText;
        }
        
        // Otherwise, extract text content excluding the icon
        const clone = element.cloneNode(true);
        const icon = clone.querySelector('.copy-icon');
        if (icon) {
            icon.remove();
        }
        return clone.textContent.trim();
    }
    
    // Add click handler for WiFi name
    if (wifiName) {
        wifiName.addEventListener('click', () => {
            const textToCopy = getTextToCopy(wifiName);
            copyToClipboard(wifiName, textToCopy);
        });
        
        // Add keyboard support
        wifiName.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const textToCopy = getTextToCopy(wifiName);
                copyToClipboard(wifiName, textToCopy);
            }
        });
    }
    
    // Add click handler for WiFi password
    if (wifiPassword) {
        wifiPassword.addEventListener('click', () => {
            const textToCopy = getTextToCopy(wifiPassword);
            copyToClipboard(wifiPassword, textToCopy);
        });
        
        // Add keyboard support
        wifiPassword.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const textToCopy = getTextToCopy(wifiPassword);
                copyToClipboard(wifiPassword, textToCopy);
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initCheckinOverlay();
    initModeSelector();
    initPreCheckinModal();
    initNoInternetModal();
    initUnlockConfirmationModal();
    initDiscountCode();
    initUpgradeDiscountCode();
    initPaymentButton();
    initTroubleshootingGuide();
    initAccessTroubleModal();
    initSecurityHoldPopover();
    initInvoiceDetailsButton();
    initRequestInvoiceButton();
    initWiFiCopy();
});



