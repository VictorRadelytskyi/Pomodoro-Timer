<template>
    <footer class="footer">
        <div class="footer-content">
            <!-- Add invisible spacer to balance layout -->
            <div class="footer-spacer"></div>
            
            <div class="footer-info">
                <p class="footer-text">
                    Made with focus in mind • Built for productivity
                </p>
            </div>
            
            <div class="footer-links">
                <a href="https://github.com/victorradelytskyi" class="footer-link" target="_blank" rel="noopener">
                    <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
                
                <a href="mailto:v.radelytskyi@gmail.com" class="footer-link">
                    <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                </a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
    .footer {
        background-color: #ffffff;
        border-top: 1px solid #e5e7eb;
        padding: 1.5rem 2rem;
        margin-top: auto;
        margin-left: 72px; /* ✅ Add space for fixed menu */
        transition: margin-left 0.3s ease; /* Smooth transition */
    }

    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .footer-spacer {
        width: 140px; /* ✅ Balance the layout - same width as links */
        visibility: hidden; /* Takes space but invisible */
    }

    .footer-info {
        flex: 1;
        text-align: center; /* ✅ Center the text properly */
    }

    .footer-text {
        margin: 0;
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: 0.025em; /* ✅ Better text spacing */
    }

    .footer-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        min-width: 140px; /* ✅ Consistent width with spacer */
        justify-content: flex-end;
    }

    .footer-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: #6b7280;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
        padding: 0.5rem 0.75rem; /* ✅ Better click area */
        border-radius: 6px;
    }

    .footer-link:hover {
        color: #111827;
        background-color: #f9fafb;
        transform: translateY(-1px); /* ✅ Subtle hover effect */
    }

    .footer-icon {
        width: 16px; /* ✅ Slightly smaller for better proportion */
        height: 16px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .footer {
            padding: 1rem;
            margin-left: 0; /* ✅ No menu offset on mobile */
        }
        
        .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }

        .footer-spacer {
            display: none; /* ✅ Hide spacer on mobile */
        }
        
        .footer-links {
            gap: 1rem;
            justify-content: center;
            min-width: auto;
        }
        
        .footer-link {
            font-size: 0.8125rem;
            padding: 0.375rem 0.625rem;
        }

        .footer-text {
            font-size: 0.8125rem;
        }
    }

    @media (prefers-color-scheme: dark) {
        .footer {
            background-color: #1f2937;
            border-top-color: #374151;
        }

        .footer-text {
            color: #9ca3af;
        }

        .footer-link {
            color: #9ca3af;
        }

        .footer-link:hover {
            color: #f9fafb;
            background-color: #374151;
        }
    }
</style>