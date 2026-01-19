# Itqan Academy Frontend

## 🌟 Overview

Itqan Academy Frontend is a modern, responsive web application built with Next.js that provides an intuitive interface for the multi-tenant Quran learning management system. It offers seamless experiences for students, teachers, and administrators across multiple Islamic academies, featuring live video sessions, progress tracking, and comprehensive academy management.

## 🎯 Core Concept

The frontend serves as the user interface for a **multi-tenant Quran academy platform** where:
- **Students** can join multiple academies and participate in Halaqas (study circles)
- **Teachers** manage their classes and conduct live Quran sessions
- **Academy Admins** oversee their institution's operations
- **Platform Admins** manage the entire Itqan ecosystem

## 🏗️ Application Architecture

### Multi-Tenant Interface Structure
```
Itqan Platform Interface
├── Public Pages (Landing, Login, Register)
├── Student Dashboard
│   ├── Academy Browser
│   ├── Halaqa Management
│   ├── Live Sessions
│   └── Progress Tracking
├── Teacher Dashboard
│   ├── Halaqa Management
│   ├── Session Conductor
│   ├── Student Progress
│   └── Join Request Management
├── Academy Admin Panel
│   ├── Academy Profile
│   ├── User Management
│   ├── Analytics Dashboard
│   └── Settings
└── Platform Admin Panel
    ├── Academy Management
    ├── System Analytics
    ├── User Administration
    └── Platform Settings
```

## 👥 User Interfaces & Roles

### 🎓 Student Interface
- **Academy Browser**: Discover and join available academies
- **Halaqa Dashboard**: View enrolled study circles and schedules
- **Live Session Participant**: Join video sessions with integrated Quran viewer
- **Progress Tracker**: Monitor memorization progress with visual charts
- **Join Request System**: Request to join specific teachers or halaqas
- **Digital Mushaf**: Integrated Quran reader with audio playback

### 👨‍🏫 Teacher Interface
- **Halaqa Management**: Create and manage study circles
- **Session Conductor**: Host live video sessions with screen sharing
- **Student Progress Dashboard**: Track individual and group progress
- **Join Request Management**: Approve, reject, or reassign student requests
- **Session Scheduler**: Plan recurring and one-time sessions
- **Attendance Tracking**: Monitor student participation

### 🏛️ Academy Admin Interface
- **Academy Profile Management**: Customize branding and settings
- **User Administration**: Manage teachers and students
- **Analytics Dashboard**: Academy-wide progress and engagement metrics
- **Session Overview**: Monitor all academy sessions and activities
- **Reports Generation**: Export progress and attendance reports

### ⚙️ Platform Admin Interface
- **Academy Management**: Oversee all academies on the platform
- **System Analytics**: Platform-wide usage and performance metrics
- **User Administration**: Manage users across all academies
- **Content Management**: Manage Quran content and resources

## 🚀 Core Features

### 📚 Academy Management
- **Multi-Academy Support**: Users can participate in multiple academies
- **Custom Academy Branding**: Personalized themes and logos
- **Academy Discovery**: Browse and join available academies
- **Role-Based Dashboards**: Tailored interfaces for each user type

### 🎓 Learning Experience
- **Interactive Halaqas**: Virtual study circles with video conferencing
- **Live Session Integration**: Jitsi Meet embedded for seamless video calls
- **Digital Quran Viewer**: Integrated Mushaf with Arabic text and audio
- **Progress Visualization**: Charts and graphs showing memorization progress
- **Session Recording**: Playback capabilities for missed sessions

### 📊 Progress Tracking & Analytics
- **Individual Progress**: Personal memorization tracking by Juz, Surah, and page
- **Group Analytics**: Class-wide progress and performance metrics
- **Visual Reports**: Interactive charts and progress indicators
- **Achievement System**: Milestones and completion badges
- **Weakness Identification**: Areas needing improvement highlighted

### 🔐 Authentication & Security
- **Secure Login System**: JWT-based authentication
- **Role-Based Access**: Different interfaces based on user roles
- **Multi-Academy Sessions**: Seamless switching between academies
- **Protected Routes**: Secure access to sensitive areas

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all device sizes
- **Touch-Friendly Interface**: Intuitive mobile interactions
- **Offline Capabilities**: Basic functionality without internet
- **Progressive Web App**: App-like experience on mobile devices

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 16**: React framework with server-side rendering and app router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience
- **App Router**: Modern Next.js routing with layouts and nested routes

### UI/UX Libraries
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Radix UI**: Accessible, unstyled UI components
- **Lucide React**: Beautiful, customizable icons
- **Class Variance Authority**: Type-safe component variants
- **Sonner**: Beautiful toast notifications

### Video Conferencing
- **Jitsi Meet React SDK**: Embedded video conferencing solution
- **WebRTC**: Real-time communication for live sessions
- **Screen Sharing**: Share Quran pages during sessions
- **Audio/Video Controls**: Mute, camera, and quality settings

### Data Visualization
- **Recharts**: Composable charting library for React
- **Progress Indicators**: Visual progress bars and completion meters
- **Interactive Charts**: Clickable and filterable data visualizations
- **Real-time Updates**: Live progress tracking during sessions

### State Management & API
- **React Context**: Global state management for authentication
- **Custom Hooks**: Reusable logic for API calls and state
- **Axios Integration**: HTTP client for backend communication
- **Real-time Updates**: WebSocket integration for live features

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Static type checking
- **Hot Reload**: Instant development feedback

## 📁 Project Structure

```
app/
├── (admin)/              # Platform admin routes
│   ├── admin/           # Admin dashboard
│   ├── reports/         # System reports
│   ├── tenants/         # Academy management
│   └── users/           # User administration
├── (student)/           # Student interface routes
│   ├── student/         # Student dashboard
│   ├── notes/           # Personal notes
│   └── profile/         # Student profile
├── (teacher)/           # Teacher interface routes
│   └── teacher/         # Teacher dashboard
├── globals.css          # Global styles
├── layout.tsx          # Root layout
├── login/              # Authentication pages
├── register/           # User registration
└── page.tsx            # Landing page

components/
├── ui/                 # Reusable UI components
├── app-sidebar.tsx     # Navigation sidebar
├── floating-mushaf.tsx # Quran viewer widget
├── live-halaqa.tsx     # Live session component
├── quran-viewer.tsx    # Digital Quran reader
└── session-tracker.tsx # Progress tracking

lib/
├── api.ts              # API client configuration
├── auth-context.tsx    # Authentication context
├── design-system.ts    # Design tokens and themes
└── utils.ts            # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Islamic green tones for branding
- **Secondary**: Warm gold accents for highlights
- **Neutral**: Clean grays for text and backgrounds
- **Success/Error**: Standard feedback colors

### Typography
- **Arabic Text**: Optimized fonts for Quran display
- **Interface Text**: Clean, readable fonts for UI
- **Responsive Sizing**: Scalable text across devices

### Components
- **Consistent Spacing**: 8px grid system
- **Accessible Colors**: WCAG compliant contrast ratios
- **Interactive States**: Hover, focus, and active states
- **Loading States**: Skeleton loaders and spinners

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Itqan-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JITSI_DOMAIN=meet.jit.si
NEXT_PUBLIC_QURAN_API_URL=https://api.quran.com
NEXT_PUBLIC_APP_NAME=Itqan Academy
```

## 🎯 User Flows

### Student Journey
1. **Registration**: Sign up as student and select academies
2. **Academy Discovery**: Browse available academies and halaqas
3. **Join Requests**: Request to join specific teachers or halaqas
4. **Session Participation**: Attend live Quran learning sessions
5. **Progress Tracking**: Monitor memorization advancement
6. **Achievement**: Earn badges and complete milestones

### Teacher Journey
1. **Registration**: Sign up as teacher and join academies
2. **Halaqa Creation**: Set up study circles and schedules
3. **Student Management**: Review and approve join requests
4. **Session Conducting**: Host live video sessions with Quran sharing
5. **Progress Monitoring**: Track student advancement and attendance
6. **Reporting**: Generate progress reports for students and admins

### Academy Admin Journey
1. **Academy Setup**: Create academy profile with custom branding
2. **User Management**: Invite and manage teachers and students
3. **Analytics Review**: Monitor academy-wide progress and engagement
4. **Content Management**: Customize academy-specific content
5. **Reporting**: Generate comprehensive academy reports

## 📱 Responsive Features

### Mobile Optimization
- **Touch-Friendly Navigation**: Large tap targets and gestures
- **Swipe Interactions**: Navigate between pages with swipes
- **Mobile Video**: Optimized video conferencing for mobile
- **Offline Reading**: Download Quran pages for offline access

### Tablet Experience
- **Split-Screen Layout**: Quran viewer alongside video sessions
- **Enhanced Touch**: Tablet-optimized interactions
- **Landscape Mode**: Optimized layouts for landscape viewing

### Desktop Features
- **Multi-Panel Layout**: Side-by-side content viewing
- **Keyboard Shortcuts**: Quick navigation and actions
- **Advanced Analytics**: Detailed charts and data visualization
- **Multi-Window Support**: Open multiple sessions simultaneously

## 🧪 Testing

### Development Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

### User Testing
- **Accessibility Testing**: Screen reader and keyboard navigation
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Mobile, tablet, and desktop layouts
- **Performance Testing**: Load times and responsiveness

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker Deployment
```bash
# Build image
docker build -t itqan-frontend .

# Run container
docker run -p 3000:3000 itqan-frontend
```

### Environment Configuration
- Configure API endpoints for production
- Set up proper domain and SSL
- Configure Jitsi Meet domain
- Set up analytics and monitoring

## 🔧 Development

### Code Style
- ESLint configuration for React and Next.js
- Prettier for consistent formatting
- TypeScript strict mode enabled
- Component-based architecture

### Performance Optimization
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient API response caching

### Accessibility
- **ARIA Labels**: Proper accessibility attributes
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Compatible with assistive technologies
- **Color Contrast**: WCAG AA compliant colors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards and add tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### Development Guidelines
- Follow React best practices
- Write TypeScript interfaces for all props
- Add proper error handling
- Test on multiple devices and browsers
- Document complex components

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the component documentation
- Contact the development team
- Review the user guide

## 🔮 Roadmap

### Upcoming Features
- **Mobile App**: React Native mobile application
- **Offline Mode**: Full offline functionality with sync
- **Advanced Analytics**: AI-powered learning insights
- **Gamification**: Achievement system and leaderboards
- **Multi-language**: Arabic and English interface
- **Voice Recognition**: Quran recitation assessment
- **AR/VR Integration**: Immersive learning experiences
- **Social Features**: Student interaction and collaboration

### Performance Improvements
- **PWA Enhancement**: Better offline capabilities
- **Real-time Sync**: Instant updates across devices
- **Advanced Caching**: Smarter content caching strategies
- **Bundle Optimization**: Smaller bundle sizes and faster loads

---

**Built with ❤️ for the Islamic education community**

*"And We have certainly made the Quran easy for remembrance, so is there any who will remember?" - Quran 54:17*