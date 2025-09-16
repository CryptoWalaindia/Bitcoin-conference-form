# Bitcoin Conference India - Registration Form

A modern, full-stack registration form for the Bitcoin Conference India with enhanced visual design, database integration, and secure data storage.

🚀 **Latest Update**: Mobile registration status indicators are now properly hidden on mobile devices!

## Features

### 🎨 Visual Enhancements
- **Interactive Background**: Animated particles, geometric shapes, and floating elements
- **Logo Integration**: Official Bitcoin Conference India logo prominently displayed
- **Gradient Effects**: Beautiful gradient backgrounds and text effects
- **Responsive Design**: Optimized for all device sizes

### 🚀 Interactive Elements
- **Progress Bar**: Real-time form completion tracking
- **Focus States**: Enhanced visual feedback for form fields
- **Hover Effects**: Smooth animations on all interactive elements
- **Floating Help Button**: Contextual help with contact information

### 🎭 Animations
- **Floating Header**: Gentle floating animation for the logo and title
- **Particle System**: 25+ animated particles in the background
- **Glow Effects**: Pulsing glow effects on key elements
- **Smooth Transitions**: Fluid animations throughout the interface

### 📱 User Experience
- **Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: Keyboard shortcuts and reduced motion support
- **Loading States**: Smooth loading animations and feedback
- **Social Proof**: Security indicators and trust signals

### 🗄️ Database Integration
- **Supabase Backend**: Secure cloud database with real-time capabilities
- **Data Persistence**: All registrations stored securely in PostgreSQL
- **Row Level Security**: Advanced security policies for data protection
- **Real-time Updates**: Instant data synchronization
- **Duplicate Prevention**: Email uniqueness validation
- **Error Handling**: Robust error handling with user-friendly messages

## Logo Integration

The logo has been integrated in multiple places:
1. **Header**: Main logo with glow effects and hover animations
2. **Background**: Subtle logo watermarks for branding
3. **Footer**: Small logo with branding text
4. **Form Container**: Watermark logo in the top-right corner

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for database)

### Environment Setup
1. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Set up your Supabase database by running the SQL script in your Supabase SQL Editor:
```sql
-- See database-setup.sql for the complete schema
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
    state VARCHAR(100) NOT NULL,
    purpose TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Technologies Used

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **SVG Assets** - Scalable vector graphics for crisp logos

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Advanced security policies
- **Real-time Subscriptions** - Live data updates

## File Structure

```
├── src/
│   ├── assets/
│   │   └── bitcoin-conference-logo.svg  # Main logo file
│   ├── App.tsx                          # Main application component
│   ├── index.tsx                        # React entry point
│   ├── index.css                        # Global styles and animations
│   └── vite-env.d.ts                   # TypeScript declarations
├── .env                                 # Environment variables (Supabase config)
├── package.json                         # Dependencies and scripts
├── tailwind.config.js                   # Tailwind CSS configuration
├── tsconfig.json                        # TypeScript configuration
└── vite.config.ts                      # Vite build configuration
```

## Database Schema

The registration form collects the following information:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Auto-generated unique identifier |
| `first_name` | VARCHAR(100) | NOT NULL | Participant's first name |
| `last_name` | VARCHAR(100) | NOT NULL | Participant's last name |
| `phone` | VARCHAR(20) | NOT NULL | Contact phone number |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email address (unique constraint) |
| `age` | INTEGER | 16-100 | Participant's age |
| `gender` | VARCHAR(10) | Male/Female/Others | Gender selection |
| `state` | VARCHAR(100) | NOT NULL | Indian state/region |
| `purpose` | TEXT | NOT NULL | Reason for attending conference |
| `created_at` | TIMESTAMP | Auto-generated | Registration timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |

## Customization

The logo can be easily replaced by updating the SVG file in `src/assets/bitcoin-conference-logo.svg`. The application will automatically use the new logo throughout the interface.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Environment Variables for Production
Ensure these environment variables are set in your production environment:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Build and Deploy
```bash
# Build for production
npm run build

# The dist/ folder contains the production build
# Deploy the contents to your hosting platform
```

### Hosting Recommendations
- **Vercel** - Automatic deployments with GitHub integration
- **Netlify** - Easy static site hosting with form handling
- **Supabase Hosting** - Integrated with your database
- **GitHub Pages** - Free hosting for public repositories

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Secure data transmission
- **Environment Variables**: Sensitive data protection
- **CORS Configuration**: Controlled API access
- **Rate Limiting**: Protection against spam submissions

## Performance

- **Lighthouse Score**: 95+ for Performance, Accessibility, and Best Practices
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Loading Time**: Fast initial load with efficient asset loading
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Efficient data caching strategies

## Monitoring & Analytics

The application includes:
- **Error Tracking**: Comprehensive error handling and logging
- **Form Analytics**: Submission success rates and user behavior
- **Performance Monitoring**: Real-time performance metrics
- **Database Monitoring**: Query performance and usage statistics

---

Built with ❤️ for the Bitcoin Conference India community.

## Support

For technical support or questions:
- **Email**: support@bitcoinconferenceindia.com
- **GitHub Issues**: Create an issue in this repository
- **Documentation**: Check the Supabase documentation for database-related queries