// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    enhanceThemeTransitions();
    initParticleNetwork();
});

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeSelector = document.querySelector('.theme-selector');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Create theme toggle if it doesn't exist
    if (!themeToggle) {
        createThemeToggle();
        return;
    }
    
    // Toggle theme selector visibility
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        themeSelector.classList.toggle('active');
    });
    
    // Handle theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Update active state
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Close selector
            themeSelector.classList.remove('active');
        });
    });
    
    // Close theme selector when clicking outside
    document.addEventListener('click', function() {
        themeSelector.classList.remove('active');
    });
    
    // Prevent closing when clicking inside selector
    themeSelector.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Load saved theme
    loadSavedTheme();
}

function createThemeToggle() {
    const themeToggleHTML = `
        <div class="theme-toggle">
            <i class="fas fa-palette"></i>
        </div>
        <div class="theme-selector">
            <button class="theme-option active" data-theme="default">Cyber Default</button>
            <button class="theme-option" data-theme="light-contrast">Light High Contrast</button>
            <button class="theme-option" data-theme="dark-contrast">Dark High Contrast</button>
            <button class="theme-option" data-theme="water-glass">Water Glass</button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', themeToggleHTML);
    initThemeToggle();
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Update theme in all pages
    updateAllPagesTheme(theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
    setTheme(savedTheme);
    
    // Update active button
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function updateAllPagesTheme(theme) {
    
    console.log(`Theme updated to: ${theme}`);
}

// Enhanced theme transitions
function enhanceThemeTransitions() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
        
        .navbar,
        .stat-card,
        .project-card,
        .interest-card,
        .contact-method {
            transition: all 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// Add particle network effect
function initParticleNetwork() {
    const container = document.getElementById('particleNetwork');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    container.appendChild(canvas);
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    
    canvas.width = width;
    canvas.height = height;
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            ctx.globalAlpha = 0.5;
            ctx.fill();
        });
        
        // Draw connections
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', function() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });
}