<template>
    <header class="header">
        <div class="header-content">
            <h1 class="header-title">Pomodoro Timer</h1>
            <p class="header-subtitle">Focus • Work • Achieve</p>
        </div>
    </header>
</template>

<style scoped>
    .header {
        background-color: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        padding: 1.5rem 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
    }

    .header-title {
        font-size: 2rem;
        font-weight: 600;
        color: #111827;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.025em;
    }

    .header-subtitle {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 500;
    }

    @media (max-width: 768px) {
        .header {
            padding: 1rem;
        }
        
        .header-title {
            font-size: 1.5rem;
        }
        
        .header-subtitle {
            font-size: 0.75rem;
        }
    }
</style>