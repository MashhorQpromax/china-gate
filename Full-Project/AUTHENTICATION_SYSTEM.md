# China Gate Authentication System

Complete bilingual (Arabic/English) authentication and registration system for the CHINA GATE platform.

## Overview

The authentication system includes:
- **Login Page**: Email/Phone + Password with validation
- **Three-Account Registration**: Gulf Buyer, Chinese Supplier, Gulf Manufacturer
- **Step-Based Registration**: Account type selection followed by form completion
- **Custom UI Components**: Password strength, phone input, tag input, file upload
- **Bilingual Support**: Full RTL/LTR support for Arabic and English
- **Dark Theme**: Dark blue (#0c0f14), red (#c41e3a), gold (#d4a843)
- **Form Validation**: Client-side validation with comprehensive error handling

## File Structure

```
src/
├── app/(auth)/
│   ├── layout.tsx                          # Auth layout wrapper
│   ├── login/
│   │   └── page.tsx                        # Login page
│   └── register/
│       ├── page.tsx                        # Registration main page
│       └── forms/
│           ├── GulfBuyerForm.tsx           # Gulf buyer registration form
│           ├── ChineseSupplierForm.tsx     # Chinese supplier registration form
│           └── GulfManufacturerForm.tsx    # Gulf manufacturer registration form
├── components/ui/
│   ├── PasswordStrength.tsx                # Password input with strength meter
│   ├── PhoneInput.tsx                      # Phone number with country codes
│   ├── TagInput.tsx                        # Tag input with autocomplete
│   ├── FileUpload.tsx                      # Drag & drop file upload
│   └── StepIndicator.tsx                   # Multi-step form indicator
├── constants/
│   └── auth.ts                             # Constants and enums
└── lib/
    └── validation.ts                       # Validation utilities
```

## Components

### PasswordStrength.tsx
Password input component with:
- Password visibility toggle
- Strength meter with color coding (red/orange/yellow/green)
- Requirements checklist:
  - 8+ characters
  - Uppercase letter
  - Number
  - Special character

**Usage:**
```tsx
<PasswordStrength
  value={password}
  onChange={setPassword}
  label="Password"
  label_ar="كلمة المرور"
  dir="rtl"
  required
/>
```

### PhoneInput.tsx
International phone input with:
- Country code selector with flags
- Gulf countries (SA, AE, KW, BH, QA, OM) + China
- Formatted display
- Phone validation

**Usage:**
```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  countryCode={countryCode}
  onCountryChange={setCountryCode}
  label="Phone"
  label_ar="رقم الجوال"
  dir="rtl"
  allowChinese
/>
```

### TagInput.tsx
Multi-tag input with:
- Autocomplete suggestions
- Add/remove tags
- Max tags limit
- Tag badges

**Usage:**
```tsx
<TagInput
  value={tags}
  onChange={setTags}
  suggestions={suggestions}
  maxTags={8}
  dir="rtl"
/>
```

### FileUpload.tsx
File upload with:
- Drag and drop support
- Click to browse
- Image preview
- File size validation
- Progress placeholder

**Usage:**
```tsx
<FileUpload
  onFile={handleFile}
  label="Company Logo"
  label_ar="شعار الشركة"
  accept="image/*"
  maxSize={5}
  dir="rtl"
/>
```

### StepIndicator.tsx
Multi-step form indicator with:
- Step circles with numbers
- Completed/Current/Upcoming states
- Connector lines
- RTL support

**Usage:**
```tsx
<StepIndicator
  steps={[
    { id: '1', label: 'Step 1', label_ar: 'الخطوة 1' },
    { id: '2', label: 'Step 2', label_ar: 'الخطوة 2' },
  ]}
  current={0}
  dir="rtl"
/>
```

## Pages

### Login Page (`/login`)

Features:
- Email or phone number input
- Password input with visibility toggle
- Form validation
- Forgot password link
- Google sign-in button
- WeChat sign-in button
- Link to registration

**Form Data:**
- `emailOrPhone`: Email or phone number
- `password`: User password

### Registration Pages

#### Step 1: Account Type Selection
Three account type cards:
1. **Gulf Buyer/Merchant** (🏢)
   - "Looking for Chinese suppliers"
   - For businesses importing from China

2. **Chinese Supplier** (🏭)
   - "Want to sell to Gulf market"
   - For Chinese manufacturers/traders

3. **Gulf Manufacturer** (🏗️)
   - "Looking for manufacturing partnerships"
   - For Saudi/Gulf industrial companies

#### Step 2: Detailed Registration Form

##### Gulf Buyer Form Fields:
```
- Full Name (Arabic/English) *
- Company Name *
- Country (Dropdown: SA, AE, KW, BH, QA, OM) *
- City *
- Commercial Registration Number *
- Sector (Dropdown) *
- Phone Number (with country code) *
- Email *
- Password (with strength meter) *
- Company Logo (File upload)
- Terms & Conditions Checkbox *
```

Sectors:
- Automotive & Motors
- Electrical & Electronics
- Metals & Mining
- Textiles & Clothing
- Machinery & Engineering
- Chemicals & Raw Materials
- Construction Equipment
- Furniture & Decor
- Food & Beverages
- Other

##### Chinese Supplier Form Fields:
```
- Company Name (English) *
- Company Name (Chinese) *
- Contact Person *
- Province/City *
- Business License Number (18 digits) *
- Factory Type (Manufacturer/Trading/Both) *
- Main Products (Tags) *
- Phone (+86) *
- Email *
- WeChat ID
- Alibaba Store URL (Optional)
- Production Capacity
- Certifications (Multi-select)
- Company Logo (File upload)
- Password *
- Terms & Conditions Checkbox *
```

##### Gulf Manufacturer Form Fields:
```
- Factory Name (Arabic/English) *
- Industrial License Number *
- MODON Industrial City *
- Industrial Sector *
- Current Production Capacity *
- Max Production Capacity *
- Workforce Size *
- Manufactured Products (Tags) *
- Certifications (Multi-select)
- Phone Number *
- Email *
- Password *
- Factory Logo (File upload)
- Terms & Conditions Checkbox *
```

## Constants

### File: `src/constants/auth.ts`

**GULF_COUNTRIES**
- Saudi Arabia (SA)
- UAE (AE)
- Kuwait (KW)
- Bahrain (BH)
- Qatar (QA)
- Oman (OM)

**GULF_SECTORS** (14 sectors for Gulf buyers)

**FACTORY_TYPES** (Manufacturer, Trading Company, Both)

**CERTIFICATIONS** (ISO 9001, ISO 14001, CE, SASO, FDA, REACH, etc.)

**MODON_CITIES** (6 major Saudi industrial cities)

**INDUSTRIAL_SECTORS** (12 industrial sectors)

**ACCOUNT_TYPES** (3 account types with emojis and descriptions)

**PASSWORD_REQUIREMENTS** (4 requirements for password strength)

## Validation Utilities

### File: `src/lib/validation.ts`

Functions:
- `validateEmail(email)` - Email format validation
- `validatePhone(phone)` - International phone validation
- `validatePassword(password)` - Returns object with requirement checks
- `isPasswordStrong(password)` - Returns boolean
- `getPasswordStrength(password)` - Returns 'weak' | 'medium' | 'strong' | 'very-strong'
- `validateCommercialRegistration(cr)` - Saudi CR validation (10 digits)
- `validateChineseBusinessLicense(license)` - Chinese license validation (18 digits)
- `validateIndustrialLicense(license)` - Industrial license validation
- `validateCompanyName(name)` - Company name validation
- `validateURL(url)` - URL format validation
- `formatPhoneNumber(phone, countryCode)` - Phone number formatting
- `getCountryCodePrefix(countryCode)` - Get country code prefix

## Styling

### Colors
- **Primary**: Dark blue (#0c0f14)
- **Accent**: Red (#c41e3a)
- **Secondary**: Gold (#d4a843)
- **Dark bg**: Gray-900 (#111827)
- **Card bg**: Gray-800 (#1f2937)
- **Border**: Gray-700 (#374151)

### Tailwind Classes
- `bg-gray-900` - Main background
- `bg-gray-800` - Card background
- `text-red-600` - Primary accent
- `border-gray-700` - Borders
- `focus:border-red-500` - Focus state
- `focus:ring-1 focus:ring-red-500` - Focus ring

## RTL Support

All components include `dir` prop:
- `dir="rtl"` - Right-to-left for Arabic
- `dir="ltr"` - Left-to-right for English

Layout automatically reverses based on direction:
- Flex direction
- Text alignment
- Padding/margin sides
- Input directions

## Form Validation

### Client-Side Validation
- Required field checks
- Email format validation
- Phone number format validation
- Password strength validation
- File size validation
- URL validation
- Business document validation
- Terms acceptance requirement

### Error Display
- Field-level error messages
- General form error alerts
- Inline error styling (red borders)
- Bilingual error messages

## Authentication Flow

### Login Flow
1. User enters email or phone
2. User enters password
3. Form validation
4. Submit to API endpoint
5. Redirect on success or display error

### Registration Flow
1. **Step 1**: Select account type
2. **Step 2**: Fill account-specific form
3. Form validation for all fields
4. Submit to API endpoint
5. Account creation confirmation
6. Redirect to dashboard/login

## Integration Notes

### API Endpoints Required
- `POST /auth/login` - Login
- `POST /auth/register/gulf-buyer` - Register Gulf buyer
- `POST /auth/register/chinese-supplier` - Register Chinese supplier
- `POST /auth/register/gulf-manufacturer` - Register Gulf manufacturer

### Form Data Format
All forms use FormData for file uploads:
```typescript
const formData = new FormData();
formData.append('email', data.email);
formData.append('logo', logoFile);
```

### Session Management
After successful authentication:
- Store JWT in secure httpOnly cookie
- Store user data in state/context
- Redirect to dashboard
- Implement session refresh logic

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Focus states for keyboard navigation
- Color contrast compliance
- Form labels properly associated

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting by page
- Client components only where needed
- Optimized re-renders with useState
- Lazy loaded images/icons
- Minimal external dependencies

## Security Considerations

- Password strength validation
- No password transmission logging
- Form validation before submission
- CSRF token integration (implement on backend)
- Rate limiting on form submission (implement on backend)
- Secure file upload handling
- Input sanitization (implement on backend)
