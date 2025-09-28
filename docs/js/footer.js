// Enhanced Rotating Footer Functionality
document.addEventListener('DOMContentLoaded', function() {
    initRotatingFooter();
    initMatrixRain();
    initSystemStatus();
    initFooterParticles();
    initTimeDisplay();
});

function initRotatingFooter() {
    const sections = document.querySelectorAll('.rotating-section');
    const indicators = document.querySelectorAll('.section-indicator');
    
    // If no sections found, exit
    if (sections.length === 0) return;
    
    let currentSection = 0;
    let isTransitioning = false;
    let rotationInterval;
    const ROTATION_INTERVAL = 7000; // 7 seconds

    // Function to show a specific section
    function showSection(index) {
        if (isTransitioning || index === currentSection) return;
        
        isTransitioning = true;
        
        // Hide current section with enhanced animation
        sections[currentSection].classList.remove('active');
        sections[currentSection].classList.add('exiting');
        indicators[currentSection].classList.remove('active');
        
        // Update current section
        currentSection = index;
        
        // Show new section with smooth transition
        setTimeout(() => {
            sections[currentSection].classList.remove('exiting');
            sections[currentSection].classList.add('active');
            indicators[currentSection].classList.add('active');
            isTransitioning = false;
            
            // Add activation effect
            const activeSection = sections[currentSection];
            activeSection.style.transform = 'translateY(0) rotateX(0) scale(1)';
        }, 600);
    }

    // Auto-rotate sections with pause/resume functionality
    function startRotation() {
        // Clear any existing interval
        if (rotationInterval) {
            clearInterval(rotationInterval);
        }
        
        rotationInterval = setInterval(() => {
            const nextSection = (currentSection + 1) % sections.length;
            showSection(nextSection);
        }, ROTATION_INTERVAL);
    }

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            // Reset rotation timer when manually switching
            startRotation();
            showSection(index);
        });
        
        // Add keyboard accessibility
        indicator.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                startRotation();
                showSection(index);
            }
        });
        
        // Make indicators focusable for accessibility
        indicator.setAttribute('tabindex', '0');
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', `Show section ${index + 1}`);
    });

    // Initialize first section with enhanced activation
    setTimeout(() => {
        sections[0].classList.add('active');
        indicators[0].classList.add('active');
        sections[0].style.transform = 'translateY(0) rotateX(0) scale(1)';
    }, 100);

    // Start rotation
    startRotation();

    // Add hover pause functionality
    const rotatingContainer = document.querySelector('.footer-rotating-sections');
    
    if (rotatingContainer) {
        rotatingContainer.addEventListener('mouseenter', () => {
            if (rotationInterval) {
                clearInterval(rotationInterval);
            }
        });

        rotatingContainer.addEventListener('mouseleave', () => {
            startRotation();
        });
        
        // Touch events for mobile
        rotatingContainer.addEventListener('touchstart', () => {
            if (rotationInterval) {
                clearInterval(rotationInterval);
            }
        });
        
        rotatingContainer.addEventListener('touchend', () => {
            // Restart after a delay on touch devices
            setTimeout(startRotation, 3000);
        });
    }

    // Enhanced indicator animations with better feedback
    indicators.forEach(indicator => {
        indicator.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.4)';
                this.style.background = 'var(--primary)';
                this.style.boxShadow = '0 0 15px var(--primary)';
            }
        });

        indicator.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
                this.style.background = 'var(--glass)';
                this.style.boxShadow = 'none';
            }
        });
        
        // Focus styles for accessibility
        indicator.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });
        
        indicator.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (rotationInterval) {
                clearInterval(rotationInterval);
            }
        } else {
            startRotation();
        }
    });

    // Enhanced resize handling
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Restart rotation after resize
            startRotation();
        }, 250);
    });
}

function initMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    matrixContainer.appendChild(canvas);
    
    let width = matrixContainer.offsetWidth;
    let height = matrixContainer.offsetHeight;
    let animationId;
    
    canvas.width = width;
    canvas.height = height;
    
    // Matrix characters 
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');
    const fontSize = 10;
    const columns = Math.floor(width / fontSize);
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = {
            position: Math.floor(Math.random() * height / fontSize),
            speed: Math.random() * 0.5 + 0.5,
            char: charArray[Math.floor(Math.random() * charArray.length)]
        };
    }
    
    function drawMatrix() {
        // Semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
        ctx.fillStyle = primaryColor;
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const x = i * fontSize;
            const y = drops[i].position * fontSize;
            
            // Draw character
            ctx.fillText(drops[i].char, x, y);
            
            // Update position with individual speed
            drops[i].position += drops[i].speed;
            
            // Randomly change character occasionally
            if (Math.random() > 0.98) {
                drops[i].char = charArray[Math.floor(Math.random() * charArray.length)];
            }
            
            // Reset drop if it reaches bottom or randomly
            if (y > height && Math.random() > 0.975) {
                drops[i].position = 0;
                drops[i].speed = Math.random() * 0.5 + 0.5;
            }
        }
        
        animationId = requestAnimationFrame(drawMatrix);
    }
    
    // Handle resize with debouncing
    let resizeTimeout;
    function handleResize() {
        cancelAnimationFrame(animationId);
        
        width = matrixContainer.offsetWidth;
        height = matrixContainer.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        
        // Reinitialize drops for new width
        const newColumns = Math.floor(width / fontSize);
        if (newColumns !== columns) {
            drops.length = 0;
            for (let i = 0; i < newColumns; i++) {
                drops[i] = {
                    position: Math.floor(Math.random() * height / fontSize),
                    speed: Math.random() * 0.5 + 0.5,
                    char: charArray[Math.floor(Math.random() * charArray.length)]
                };
            }
        }
        
        // Restart animation
        animationId = requestAnimationFrame(drawMatrix);
    }
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });
    
    // Start animation
    animationId = requestAnimationFrame(drawMatrix);
    
    // Cleanup function
    matrixContainer.cleanupMatrix = function() {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    };
}

function initSystemStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (!statusIndicator || !statusText) return;
    
    // Enhanced status messages with more variety
    const statusMessages = [
        { text: 'System Online', type: 'normal' },
        { text: 'Processing Data', type: 'normal' },
        { text: 'All Systems Nominal', type: 'normal' },
        { text: 'Ready for Collaboration', type: 'normal' },
        { text: 'Code Compiling', type: 'normal' },
        { text: 'Deploying Updates', type: 'normal' },
        { text: 'Systems Optimized', type: 'optimized' },
        { text: 'Performance Peak', type: 'optimized' },
        { text: 'Security Active', type: 'secure' },
        { text: 'Backup Complete', type: 'secure' }
    ];
    
    let currentStatus = 0;
    let statusInterval;
    
    function updateStatus() {
        const status = statusMessages[currentStatus];
        statusText.textContent = status.text;
        
        // Apply different colors based on status type
        switch (status.type) {
            case 'optimized':
                statusIndicator.style.background = 'var(--accent)';
                statusIndicator.style.boxShadow = '0 0 10px var(--accent)';
                break;
            case 'secure':
                statusIndicator.style.background = '#00ff00';
                statusIndicator.style.boxShadow = '0 0 10px #00ff00';
                break;
            default:
                statusIndicator.style.background = 'var(--primary)';
                statusIndicator.style.boxShadow = '0 0 8px var(--primary)';
        }
        
        // Enhanced pulse animation
        statusIndicator.style.animation = 'statusPulse 2s infinite';
        
        currentStatus = (currentStatus + 1) % statusMessages.length;
    }
    
    // Start status updates
    statusInterval = setInterval(updateStatus, 3000);
    
    // Initial status
    updateStatus();
    
    // Add status styles if not already present
    if (!document.querySelector('#status-styles')) {
        const styles = document.createElement('style');
        styles.id = 'status-styles';
        styles.textContent = `
            @keyframes statusPulse {
                0%, 100% { 
                    opacity: 1; 
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.7; 
                    transform: scale(1.1);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Cleanup function
    statusText.cleanupStatus = function() {
        if (statusInterval) {
            clearInterval(statusInterval);
        }
    };
}

function initFooterParticles() {
    const footer = document.querySelector('.futuristic-footer');
    if (!footer) return;
    
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    footer.appendChild(particleContainer);
    
    // Create multiple particles
    const particleCount = 12; // Reduced for smaller footer
    for (let i = 0; i < particleCount; i++) {
        createFloatingParticle(particleContainer);
    }
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Remove all particles and recreate
            const particles = particleContainer.querySelectorAll('.floating-particle');
            particles.forEach(particle => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            });
            
            // Create new particles
            for (let i = 0; i < particleCount; i++) {
                createFloatingParticle(particleContainer);
            }
        }, 250);
    });
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    // Random icon from Font Awesome
    const icons = ['fa-code', 'fa-bolt', 'fa-star', 'fa-cog', 'fa-microchip', 'fa-rocket', 'fa-terminal', 'fa-laptop-code'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    particle.innerHTML = `<i class="fas ${randomIcon}"></i>`;
    
    // footer adjusted size and position
    const size = Math.random() * 16 + 8; 
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 15 + 8; 
    const animationDelay = Math.random() * 3;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: -30px;
        color: var(--primary);
        opacity: ${Math.random() * 0.4 + 0.1};
        animation: floatParticle ${animationDuration}s linear infinite;
        animation-delay: ${animationDelay}s;
        pointer-events: none;
        z-index: 1;
        font-size: ${size * 0.5}px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add styles for particle animation if not already present
    if (!document.querySelector('#particle-styles')) {
        const styles = document.createElement('style');
        styles.id = 'particle-styles';
        styles.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) rotate(0deg) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 0.4;
                }
                50% {
                    transform: translateY(50vh) rotate(180deg) scale(1.1);
                }
                90% {
                    opacity: 0.4;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg) scale(1);
                    opacity: 0;
                }
            }
            
            .particle-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            }
        `;
        document.head.appendChild(styles);
    }
    
    container.appendChild(particle);
    
    // Remove particle after animation and create new one
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        // Only create new particle if container still exists
        if (container.parentNode) {
            createFloatingParticle(container);
        }
    }, (animationDuration + animationDelay) * 1000);
}


function initTimeDisplay() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const ampmElement = document.getElementById('ampm');
    const weekdayElement = document.getElementById('weekday');
    const monthElement = document.getElementById('month');
    const dayElement = document.getElementById('day');
    const yearElement = document.getElementById('year');
    const timezoneElement = document.getElementById('timezone');
    const uptimeElement = document.getElementById('uptime');
    const connectivityElement = document.getElementById('connectivity');
    const locationElement = document.getElementById('location');
    const formatButtons = document.querySelectorAll('.format-btn');
    
    if (!hoursElement) return;
    
    let timeFormat = '12h';
    let startTime = Date.now();
    
    // Set time format from buttons
    formatButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            formatButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            timeFormat = this.getAttribute('data-format');
        });
    });
    
    // Update time display
    function updateTime() {
        const now = new Date();
        
        // Update digital clock based on format
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        
        if (timeFormat === '12h') {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            ampmElement.textContent = ampm;
        } else if (timeFormat === '24h') {
            ampmElement.textContent = '';
        } else if (timeFormat === 'military') {
            ampmElement.textContent = '';
            // Military format uses 4-digit time without colon
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = '';
            return; // Skip the rest for military format
        }
        
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Update date
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        weekdayElement.textContent = weekdays[now.getDay()];
        monthElement.textContent = months[now.getMonth()];
        dayElement.textContent = now.getDate();
        yearElement.textContent = now.getFullYear();
        
        // Update uptime
        const uptimeMs = Date.now() - startTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
        const uptimeSecs = uptimeSeconds % 60;
        
        uptimeElement.textContent = `${uptimeHours.toString().padStart(2, '0')}:${uptimeMinutes.toString().padStart(2, '0')}:${uptimeSecs.toString().padStart(2, '0')}`;
        
        // Update connectivity status
        if (navigator.onLine) {
            connectivityElement.textContent = 'Online';
            connectivityElement.className = 'system-value online';
        } else {
            connectivityElement.textContent = 'Offline';
            connectivityElement.className = 'system-value offline';
        }
    }
    
    // Initialize timezone
    function initTimezone() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            timezoneElement.textContent = timezone.replace(/_/g, ' ');
            
            // Try to get approximate location from timezone
            if (timezone.includes('New_York')) {
                locationElement.textContent = 'Eastern Time, US';
            } else if (timezone.includes('Chicago')) {
                locationElement.textContent = 'Central Time, US';
            } else if (timezone.includes('Denver') || timezone.includes('Phoenix')) {
                locationElement.textContent = 'Mountain Time, US';
            } else if (timezone.includes('Los_Angeles')) {
                locationElement.textContent = 'Pacific Time, US';
            } else if (timezone.includes('London')) {
                locationElement.textContent = 'London, UK';
            } else if (timezone.includes('Paris')) {
                locationElement.textContent = 'Paris, France';
            } else if (timezone.includes('Tokyo')) {
                locationElement.textContent = 'Tokyo, Japan';
            } else {
                locationElement.textContent = timezone.replace(/_/g, ' ').split('/').pop();
            }
        } catch (e) {
            timezoneElement.textContent = 'Local Time';
            locationElement.textContent = 'Unknown';
        }
    }
    
    // Initialize and start updates
    initTimezone();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Update connectivity on change
    window.addEventListener('online', () => {
        connectivityElement.textContent = 'Online';
        connectivityElement.className = 'system-value online';
    });
    
    window.addEventListener('offline', () => {
        connectivityElement.textContent = 'Offline';
        connectivityElement.className = 'system-value offline';
    });
}

// Enhanced cleanup function for page transitions
function cleanupFooter() {
    // Clean up matrix rain
    const matrixContainer = document.querySelector('.matrix-rain');
    if (matrixContainer && matrixContainer.cleanupMatrix) {
        matrixContainer.cleanupMatrix();
    }
    
    // Clean up system status
    const statusText = document.querySelector('.status-text');
    if (statusText && statusText.cleanupStatus) {
        statusText.cleanupStatus();
    }
    
    // Clear any intervals
    const intervals = [];
    for (let i = 1; i < 99999; i++) {
        window.clearInterval(i);
    }
    
    // Cancel any animation frames
    const frames = [];
    for (let i = 1; i < 99999; i++) {
        window.cancelAnimationFrame(i);
    }
}

// Export cleanup function for use in SPA scenarios
if (typeof window !== 'undefined') {
    window.cleanupFooter = cleanupFooter;
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Footer component error:', e.error);
});

console.log('🎯 Enhanced footer initialized successfully!');