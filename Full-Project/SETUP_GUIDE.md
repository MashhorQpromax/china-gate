# China Gate Authentication System - Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone/Setup Project**
```bash
cd /sessions/affectionate-funny-fermi/china-gate
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Page Routes

### Authentication Routes
- **Login**: `/login` - User login page
- **Register**: `/register` - Multi-step registration with account type selection

### Protected Routes (To be implemented)
- `/dashboard` - User dashboard (after login)
- `/profile` - User profile settings
- `/account` - Account management

## Folder Structure

```
src/
├── app/
│   ├── (auth)/               # Auth layout group
│   │   ├── layout.tsx
│   │   ├── login/
│   │   └── register/
│   └── (dashboard)/          # Main app layout (future)
├── components/
│   ├── ui/                   # Reusable UI components
│   └── layout/               # Layout components
├── constants/
│   └── auth.ts              # Auth constants
├── lib/
│   └── validation.ts        # Validation utilities
└── types/
    └── index.ts             # TypeScript types
```

## Component Usage Examples

### Login Page
```tsx
'use client'

import { useState } from 'react'
import { validateEmail } from '@/lib/validation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateEmail(email)) {
      // Submit to API
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### Registration Form
```tsx
'use client'

import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { FileUpload } from '@/components/ui/FileUpload'

export default function RegistrationForm() {
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  
  return (
    <form>
      <PasswordStrength
        value={password}
        onChange={setPassword}
        dir="rtl"
      />
      <PhoneInput
        value={phone}
        onChange={setPhone}
        dir="rtl"
      />
    </form>
  )
}
```

## Styling Guide

### Dark Theme Colors
```css
/* Primary Colors */
--color-dark: #0c0f14;
--color-red: #c41e3a;
--color-gold: #d4a843;

/* Tailwind Gray Scale */
--tw-gray-900: #111827;    /* Darkest */
--tw-gray-800: #1f2937;    /* Card background */
--tw-gray-700: #374151;    /* Borders */
--tw-gray-600: #4b5563;
--tw-gray-500: #6b7280;
--tw-gray-400: #9ca3af;
--tw-gray-300: #d1d5db;
--tw-gray-200: #e5e7eb;
--tw-gray-100: #f3f4f6;
--tw-white:   #ffffff;     /* Lightest */
```

### Responsive Breakpoints
```
xs: 0px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Form Validation

### Built-in Validators
```typescript
import { 
  validateEmail,
  validatePhone,
  validatePassword,
  isPasswordStrong,
  getPasswordStrength,
  validateCommercialRegistration,
  validateChineseBusinessLicense,
  validateIndustrialLicense,
} from '@/lib/validation'

// Email validation
if (validateEmail('user@example.com')) {
  // Valid email
}

// Password strength
const strength = getPasswordStrength('MyP@ssw0rd')
// Returns: 'weak' | 'medium' | 'strong' | 'very-strong'

// Phone validation
if (validatePhone('+966501234567')) {
  // Valid phone
}
```

## State Management

Currently using React's built-in `useState`. For larger app:

### Future Integration (Recommended)
```typescript
// Option 1: React Context + useContext
import { createContext, useContext } from 'react'

const AuthContext = createContext(null)

// Option 2: Zustand (lightweight store)
import create from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  login: (data) => set({ user: data }),
}))

// Option 3: Redux Toolkit (for complex state)
import { configureStore, createSlice } from '@reduxjs/toolkit'
```

## API Integration

### Login Endpoint
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const data = await response.json()
// Store token: localStorage.setItem('token', data.token)
```

### Registration Endpoints
```typescript
// Gulf Buyer
POST /api/auth/register/gulf-buyer
Content-Type: multipart/form-data

// Chinese Supplier
POST /api/auth/register/chinese-supplier
Content-Type: multipart/form-data

// Gulf Manufacturer
POST /api/auth/register/gulf-manufacturer
Content-Type: multipart/form-data
```

## Testing

### Manual Testing Checklist
- [ ] Login page loads correctly
- [ ] Email/phone validation works
- [ ] Password visibility toggle works
- [ ] Form submission with valid data
- [ ] Error messages display correctly
- [ ] Registration step indicator works
- [ ] All three account type forms work
- [ ] File upload and preview works
- [ ] RTL layout for Arabic works correctly
- [ ] Responsive design on mobile

### Unit Testing (Future)
```typescript
import { render, screen } from '@testing-library/react'
import { PasswordStrength } from '@/components/ui/PasswordStrength'

describe('PasswordStrength', () => {
  it('should show weak strength for short password', () => {
    render(
      <PasswordStrength value="short" onChange={() => {}} />
    )
    expect(screen.getByText('Weak')).toBeInTheDocument()
  })
})
```

## Customization

### Change Colors
Edit Tailwind config or update CSS classes:
```tsx
// Change button color from red-600 to blue-600
<button className="bg-blue-600 hover:bg-blue-700">Submit</button>
```

### Add New Account Type
1. Add to `ACCOUNT_TYPES` in `constants/auth.ts`
2. Create new form component
3. Update registration logic

### Add New Certification
Update `CERTIFICATIONS` array in `constants/auth.ts`:
```typescript
CERTIFICATIONS.push({
  value: 'new-cert',
  label: 'New Certification',
  category: 'Custom'
})
```

## Troubleshooting

### Password strength not updating
- Ensure `onChange` handler is connected
- Check console for errors
- Verify component is marked with 'use client'

### Phone input not accepting numbers
- Check country code selection
- Verify regex pattern in validation.ts
- Test with different formats

### File upload not working
- Check max file size (default 5MB)
- Verify file type is image/*
- Check browser console for errors

### RTL layout not working
- Ensure `dir="rtl"` prop is passed
- Check CSS for hardcoded left/right
- Use Tailwind directional utilities

## Performance Optimization

### Code Splitting
- Auth pages already use dynamic imports
- Use `React.lazy()` for heavy components

### Image Optimization
- Use Next.js `<Image>` component
- Optimize logo files (< 100KB)
- Use WebP format when possible

### Bundle Size
- Monitor with `npm run analyze`
- Remove unused dependencies
- Tree-shake unused code

## Security Best Practices

1. **Password Handling**
   - Never log passwords
   - Use HTTPS in production
   - Hash passwords server-side

2. **Form Submission**
   - Validate both client and server
   - Implement CSRF protection
   - Rate limit authentication endpoints

3. **File Upload**
   - Validate file type on server
   - Scan for malware
   - Store in secure location

4. **Data Storage**
   - Use httpOnly cookies for tokens
   - Never store sensitive data in localStorage
   - Implement proper session timeout

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables in Production
- Set environment variables in deployment platform
- Never commit .env.local
- Use secret management service

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- TypeScript Handbook: https://www.typescriptlang.org/docs/

## License

This authentication system is part of the CHINA GATE project.
