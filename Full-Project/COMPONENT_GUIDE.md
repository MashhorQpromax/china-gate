# CHINA GATE UI Components - Quick Reference Guide

## Overview
Complete set of 20 production-ready UI and layout components for the CHINA GATE Next.js application. All components are dark-themed, RTL-aware, and professionally styled using Tailwind CSS.

## Color Palette
- **Primary Red**: `#c41e3a` - Main actions and important elements
- **Gold**: `#d4a843` - Accents and hover states
- **Black**: `#0c0f14` - Background
- **Dark**: `#1a1d23` - Cards and containers
- **Dark Light**: `#242830` - Borders and dividers

## Typography
- **English**: DM Sans (LTR)
- **Arabic**: IBM Plex Arabic (RTL)

---

## UI Components (`src/components/ui/`)

### Button
```tsx
import Button from '@/components/ui/Button';

// Primary button
<Button variant="primary" size="md">Click me</Button>

// With icon
<Button icon={<IconComponent />} iconPosition="left">Action</Button>

// Loading state
<Button isLoading>Processing...</Button>
```
**Variants**: `primary` | `secondary` | `ghost` | `danger` | `success`
**Sizes**: `sm` | `md` | `lg`

### Input
```tsx
import Input from '@/components/ui/Input';

// Basic input
<Input label="Email" type="email" placeholder="user@example.com" />

// With error
<Input error="Invalid email" />

// Password with toggle
<Input type="password" showPasswordToggle />

// RTL (Arabic)
<Input isRTL label="البريد الإلكتروني" />
```

### Badge
```tsx
import Badge from '@/components/ui/Badge';

<Badge variant="success" showDot>Active</Badge>
<Badge variant="danger" size="sm">Urgent</Badge>
<Badge variant="gold">Featured</Badge>
```
**Variants**: `default` | `success` | `warning` | `danger` | `info` | `gold`

### Card
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

<Card variant="elevated">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>Content here</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>
```
**Variants**: `default` | `elevated` | `bordered` | `glass`

### Modal
```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose} size="lg">
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={handleClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```
**Sizes**: `sm` | `md` | `lg` | `xl` | `full`

### Select
```tsx
import Select from '@/components/ui/Select';

<Select
  options={[
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' }
  ]}
  placeholder="Select..."
  isSearchable
  isMulti
/>
```

### Tabs
```tsx
import { Tabs, TabsContent } from '@/components/ui/Tabs';

<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1' },
    { id: 'tab2', label: 'Tab 2' }
  ]}
  defaultTab="tab1"
>
  <TabsContent tabId="tab1" isActive={activeTab === 'tab1'}>
    Content 1
  </TabsContent>
</Tabs>
```

### ProgressBar
```tsx
import ProgressBar from '@/components/ui/ProgressBar';

<ProgressBar percentage={65} color="gold" showLabel />
```
**Colors**: `primary` | `success` | `warning` | `danger` | `gold`

### StatusBadge
```tsx
import StatusBadge from '@/components/ui/StatusBadge';

<StatusBadge status="completed" type="deal" bilingual />
<StatusBadge status="in_transit" type="shipment" />
<StatusBadge status="issued" type="lclg" />
```

### Avatar
```tsx
import Avatar from '@/components/ui/Avatar';

<Avatar initials="JD" size="md" isOnline />
<Avatar src="/user.jpg" alt="User" size="lg" />
```
**Sizes**: `xs` | `sm` | `md` | `lg`

### DataTable
```tsx
import DataTable from '@/components/ui/DataTable';

<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' }
  ]}
  data={tableData}
  searchable
  pagination={{ pageSize: 10, currentPage: 1, onPageChange: setPage }}
/>
```

### Timeline
```tsx
import Timeline from '@/components/ui/Timeline';

<Timeline
  steps={[
    { id: '1', label: 'Ordered', status: 'completed' },
    { id: '2', label: 'Processing', status: 'active' },
    { id: '3', label: 'Shipped', status: 'pending' }
  ]}
  orientation="vertical"
/>
```

### StatCard
```tsx
import StatCard from '@/components/ui/StatCard';

<StatCard
  label="Total Sales"
  value={45230}
  icon={<SalesIcon />}
  trend={{ type: 'up', percentage: 12 }}
/>
```

---

## Layout Components (`src/components/layout/`)

### Header
```tsx
import Header from '@/components/layout/Header';

<Header
  isAuthenticated={true}
  user={{ name: 'John Doe', initials: 'JD' }}
  notificationCount={5}
  currentLanguage="en"
  onLanguageChange={handleLanguageChange}
/>
```

### Sidebar
```tsx
import Sidebar from '@/components/layout/Sidebar';

<Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  userRole="buyer"
  isRTL={isArabic}
/>
```

### Footer
```tsx
import Footer from '@/components/layout/Footer';

<Footer onLanguageChange={handleLanguageChange} isRTL={isArabic} />
```

### MobileNav
```tsx
import MobileNav from '@/components/layout/MobileNav';

<MobileNav isRTL={isArabic} />
```

### DashboardLayout
```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

<DashboardLayout
  isAuthenticated={true}
  user={userData}
  userRole="buyer"
  isRTL={isArabic}
  onLanguageChange={handleLanguageChange}
>
  {children}
</DashboardLayout>
```

---

## Root Layout

### app/layout.tsx
Main Next.js layout that sets up:
- Global fonts (IBM Plex Arabic, DM Sans)
- Dark theme
- RTL support
- Metadata

### app/page.tsx
Landing page with hero section, features, and CTA buttons.

---

## Global Styles (src/app/globals.css)

### Utility Classes
```css
.glass /* Glassmorphism effect */
.gradient-text /* Red to gold gradient text */
.spinner /* Loading spinner animation */
.animate-in /* Slide up animation */
.fade-in /* Fade in animation */
```

### Custom Animations
- `slideInUp` - Elements slide up with fade
- `slideInDown` - Elements slide down with fade
- `fadeIn` - Simple fade animation
- `pulse` - Pulsing opacity effect

---

## Usage Examples

### Complete Page Layout
```tsx
'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <DashboardLayout isAuthenticated userRole="buyer">
      <div className="space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
          </CardHeader>
          <CardBody>
            <p>Your dashboard content here</p>
            <Button variant="primary" className="mt-4">
              Get Started
            </Button>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

### Form with Validation
```tsx
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function FormExample() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-4">
      <Input
        label="Company Name"
        value={formData.company}
        error={errors.company}
        onChange={e => setFormData({...formData, company: e.target.value})}
      />
      <Select
        label="Country"
        options={[
          { value: 'sa', label: 'Saudi Arabia' },
          { value: 'ae', label: 'UAE' }
        ]}
        onChange={value => setFormData({...formData, country: value})}
      />
      <Button variant="primary" type="submit">Submit</Button>
    </form>
  );
}
```

### RTL Layout
```tsx
<div dir="rtl" className="rtl">
  <Header isRTL />
  <Sidebar isRTL />
  <Footer isRTL />
</div>
```

---

## TypeScript Interfaces

All components have proper TypeScript support:
```tsx
// Button types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// Input types
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  isRTL?: boolean;
  showPasswordToggle?: boolean;
}
```

---

## Best Practices

1. **Always use `cn()` for class merging**
   ```tsx
   className={cn('base-classes', conditionalClass, props.className)}
   ```

2. **Support RTL layouts**
   ```tsx
   className={cn('flex gap-4', isRTL && 'flex-row-reverse')}
   ```

3. **Use dark theme colors consistently**
   - Backgrounds: `#0c0f14`, `#1a1d23`
   - Borders: `#242830`
   - Text: `text-white`, `text-gray-300`, `text-gray-400`

4. **Implement proper error handling**
   ```tsx
   <Input error={error} helperText={helperText} />
   ```

5. **Make components accessible**
   - Add labels to inputs
   - Use semantic HTML
   - Implement focus states

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies
- React 18+
- Next.js 14+
- Tailwind CSS 3.4+
- IBM Plex Arabic (Google Fonts)
- DM Sans (Google Fonts)

---

## Component File Sizes
Most components are under 5KB when minified, ensuring fast load times.

## Performance Considerations
- Components use React.memo where appropriate
- Proper event handling prevents unnecessary re-renders
- CSS-in-JS via Tailwind ensures no runtime overhead
- Portal rendering for Modals prevents layout shift

---

## Support & Documentation
For detailed component specifications, check individual component files in:
- `/src/components/ui/`
- `/src/components/layout/`

Each component includes JSDoc comments and TypeScript interfaces for full IDE support.
