# 🍅 Pomodoro Timer

A modern, feature-rich Pomodoro Timer application built with Vue.js and TypeScript, designed to boost productivity through the proven Pomodoro Technique.

## ✨ Features

### 🎯 Core Functionality
- **Visual Timer**: Interactive SVG-based timer with smooth animations and progress visualization
- **25-Minute Sessions**: Classic Pomodoro technique with 25-minute focused work sessions
- **Sound Notifications**: Audio alerts when sessions complete
- **Pause & Resume**: Full control over timer sessions with pause/resume functionality
- **Custom Time Adjustment**: Real-time timer adjustment during sessions

### 📋 Task Management
- **Task Creation**: Add and organize tasks with intuitive interface
- **Task-Timer Binding**: Link specific tasks to timer sessions for accurate time tracking
- **Deadline Management**: Set and track task deadlines with calendar integration
- **Work Time Tracking**: Automatic tracking of time spent on each task
- **Task Completion**: Mark tasks as complete with visual feedback
- **Persistent Storage**: All tasks saved locally using browser localStorage

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, colorful interface with smooth transitions
- **Navigation Menu**: Collapsible sidebar navigation with multiple app sections
- **Visual Feedback**: Hover effects, animations, and status indicators

## 🛠️ Technology Stack

### Frontend Framework
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development for better code quality and maintainability

### Build Tools & Development
- **Vite** - Next-generation frontend build tool for fast development
- **vue-tsc** - TypeScript compiler for Vue single-file components
- **ESM** - Modern ES module system

### Libraries & Dependencies
- **UUID** - Unique identifier generation for tasks
- **CSS3** - Advanced styling with gradients, animations, and responsive design
- **SVG** - Vector graphics for the timer visualization

### Development Practices
- **Component-Based Architecture** - Modular Vue components for maintainability
- **Composition API** - Modern Vue 3 reactive programming
- **TypeScript Interfaces** - Strong typing for data structures
- **Local State Management** - Efficient state handling with Vue reactivity
- **Browser APIs** - Integration with localStorage and Audio APIs

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VictorRadelytskyi/Pomodoro-Timer.git
   cd Pomodoro-Timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Getting Started
1. **Create Tasks**: Navigate to the Tasks section and add your work items
2. **Set Deadlines**: Use the calendar feature to set task deadlines
3. **Bind to Timer**: From the Home page, select a task to bind with the timer
4. **Start Session**: Click "Start Session" to begin a 25-minute Pomodoro
5. **Track Progress**: Watch your progress in real-time and see time tracked per task

### Navigation
- **Home**: Main timer interface and task binding
- **Tasks**: Comprehensive task management and organization
- **Goals**: Goal setting and tracking (future enhancement)
- **Stats**: Analytics and productivity statistics (future enhancement)
- **Settings**: Application configuration options

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── App.vue         # Main application component
│   ├── home/           # Timer and main interface
│   │   ├── Home.vue
│   │   ├── Timer.vue
│   │   └── BindToTask.vue
│   ├── tasks/          # Task management
│   │   └── Tasks.vue
│   ├── menu/           # Navigation
│   │   └── Menu.vue
│   ├── header/         # App header
│   ├── footer/         # App footer
│   └── [other sections]/
├── composables/        # Vue composition functions
│   ├── useTasks.ts     # Task management logic
│   └── settings.ts     # Application settings
├── assets/             # Static assets and icons
└── main.ts            # Application entry point
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Architecture Highlights
- **Reactive State Management**: Leverages Vue 3's Composition API for efficient state handling
- **Type Safety**: Full TypeScript integration for better development experience
- **Component Composition**: Reusable components with clear separation of concerns
- **Modern SVG Graphics**: Custom SVG timer implementation with mathematical precision
- **Local Persistence**: Browser localStorage integration for data persistence

## 👨‍💻 Author

**Victor Radelytskyi**
- GitHub: [@VictorRadelytskyi](https://github.com/VictorRadelytskyi)
- Email: v.radelytskyi@gmail.com

## 📄 License

This project is licensed under CC0 1.0 Universal - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using modern web technologies to help developers stay focused and productive.*