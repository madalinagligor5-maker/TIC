// Catalog360.ro - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'var(--shadow-md)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and module cards
    document.querySelectorAll('.feature-card, .module-card, .competency-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Lesson expansion functionality (for class pages)
    document.querySelectorAll('.lesson-header').forEach(header => {
        header.addEventListener('click', function() {
            const lessonContent = this.nextElementSibling;
            const icon = this.querySelector('.expand-icon');
            
            lessonContent.classList.toggle('active');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });
    });
    
    // Tab switching for modules
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs-container');
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs in group
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            tabGroup.querySelector(`[data-tab-content="${targetTab}"]`).classList.add('active');
        });
    });
    
    // Progress tracking (if implemented)
    function updateProgress() {
        const completedLessons = localStorage.getItem('completedLessons') || '[]';
        const totalLessons = document.querySelectorAll('.lesson-item').length;
        const completedCount = JSON.parse(completedLessons).length;
        
        if (totalLessons > 0) {
            const progressPercentage = (completedCount / totalLessons) * 100;
            const progressBar = document.querySelector('.progress-bar-fill');
            if (progressBar) {
                progressBar.style.width = `${progressPercentage}%`;
            }
        }
    }
    
    // Initialize progress on load
    updateProgress();
    
    // Console welcome message
    console.log('%c👋 Salut! Sunt Bit, mascotă Catalog360!', 'color: #2563eb; font-size: 16px; font-weight: bold;');
    console.log('%cÎnveți informatică? Ai ajuns la locul potrivit! 💻', 'color: #64748b; font-size: 12px;');
    
});

// Utility function for marking lessons as complete
function markLessonComplete(lessonId) {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        
        // Update UI
        const lessonElement = document.querySelector(`[data-lesson-id="${lessonId}"]`);
        if (lessonElement) {
            lessonElement.classList.add('completed');
        }
        
        // Update progress bar
        updateProgress();
        
        // Show success message
        showNotification('Lecție completată! Felicitări! 🎉', 'success');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Print lesson functionality
function printLesson(lessonId) {
    window.print();
}

// Share lesson functionality
function shareLesson(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copiat în clipboard!', 'success');
        });
    }
}
