# China Gate Authentication System - Quick Reference

## File Locations

### Pages
- **Login**: `src/app/(auth)/login/page.tsx`
- **Registration Main**: `src/app/(auth)/register/page.tsx`
- **Gulf Buyer Form**: `src/app/(auth)/register/forms/GulfBuyerForm.tsx`
- **Chinese Supplier Form**: `src/app/(auth)/register/forms/ChineseSupplierForm.tsx`
- **Gulf Manufacturer Form**: `src/app/(auth)/register/forms/GulfManufacturerForm.tsx`
- **Auth Layout**: `src/app/(auth)/layout.tsx`

### Components
- **PasswordStrength**: `src/components/ui/PasswordStrength.tsx`
- **PhoneInput**: `src/components/ui/PhoneInput.tsx`
- **TagInput**: `src/components/ui/TagInput.tsx`
- **FileUpload**: `src/components/ui/FileUpload.tsx`
- **StepIndicator**: `src/components/ui/StepIndicator.tsx`

### Utilities
- **Constants**: `src/constants/auth.ts`
- **Validation**: `src/lib/validation.ts`

### Documentation
- **System Docs**: `AUTHENTICATION_SYSTEM.md`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Summary**: `AUTH_SUMMARY.md`
- **Component Guide**: `COMPONENT_GUIDE.md`
- **Files Created**: `FILES_CREATED.md`
- **Env Template**: `.env.example`

## Import Paths

### Constants
```typescript
import { 
  GULF_COUNTRIES, 
  GULF_SECTORS,
  FACTORY_TYPES,
  CERTIFICATIONS,
  MODON_CITIES,
  INDUSTRIAL_SECTORS,
  ACCOUNT_TYPES,
  PASSWORD_REQUIREMENTS
} from '@/constants/auth'
```

### Validation
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
  validateCompanyName,
  validateURL,
  formatPhoneNumber,
  getCountryCodePrefix
} from '@/lib/validation'
```

### Components
```typescript
import { PasswordStrength } from '@/components/ui/PasswordStrength'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { TagInput } from '@/components/ui/TagInput'
import { FileUpload } from '@/components/ui/FileUpload'
import { StepIndicator } from '@/components/ui/StepIndicator'
```

## Component Props

### PasswordStrength
```typescript
<PasswordStrength
  value={string}
  onChange={(value: string) => void}
  label?: string // Default: "Password"
  label_ar?: string // Default: "كلمة المرور"
  placeholder?: string
  error?: string
  required?: boolean
  dir?: 'ltr' | 'rtl' // Default: 'rtl'
/>
```

### PhoneInput
```typescript
<PhoneInput
  value={string}
  onChange={(value: string) => void}
  countryCode={string}
  onCountryChange={(code: string) => void}
  label?: string // Default: "Phone"
  label_ar?: string // Default: "رقم الجوال"
  placeholder?: string
  error?: string
  required?: boolean
  dir?: 'ltr' | 'rtl'
  allowChinese?: boolean // Default: false
/>
```

### TagInput
```typescript
<TagInput
  value={string[]}
  onChange={(tags: string[]) => void}
  label?: string // Default: "Tags"
  label_ar?: string // Default: "الوسوم"
  placeholder?: string
  suggestions?: string[]
  maxTags?: number // Default: 10
  error?: string
  required?: boolean
  dir?: 'ltr' | 'rtl'
/>
```

### FileUpload
```typescript
<FileUpload
  onFile={(file: File) => void}
  label?: string // Default: "Upload File"
  label_ar?: string // Default: "رفع ملف"
  accept?: string // Default: "image/*"
  maxSize?: number // Default: 5 (MB)
  preview?: string // Preview URL
  error?: string
  required?: boolean
  dir?: 'ltr' | 'rtl'
/>
```

### StepIndicator
```typescript
<StepIndicator
  steps={Array<{
    id: string
    label: string
    label_ar: string
  }>}
  current={number} // 0-indexed
  dir?: 'ltr' | 'rtl' // Default: 'rtl'
/>
```

## Validation Functions

### Email
```typescript
validateEmail('user@example.com') // true
```

### Phone
```typescript
validatePhone('+966501234567') // true
```

### Password
```typescript
const requirements = validatePassword('MyP@ssw0rd')
// { length: true, uppercase: true, number: true, special: true }

isPasswordStrong('MyP@ssw0rd') // true

getPasswordStrength('MyP@ssw0rd') // 'very-strong'
```

### Commercial Registration (Saudi)
```typescript
validateCommercialRegistration('1234567890') // true
```

### Business License (Chinese)
```typescript
validateChineseBusinessLicense('123456789012345678') // true
```

## Color Scheme

### Primary Colors
- Dark: `#0c0f14` or `bg-gray-900`
- Red: `#c41e3a` or `bg-red-600`
- Gold: `#d4a843` or `bg-yellow-600`

### Utility Colors
- Success: `bg-green-600`
- Warning: `bg-orange-500`
- Error: `bg-red-600`
- Info: `bg-blue-600`

### Text Colors
- Primary: `text-white`
- Secondary: `text-gray-300`
- Muted: `text-gray-500`
- Accent: `text-red-500`

## Routes

### Authentication Routes
- `GET /login` - Login page
- `GET /register` - Registration (step 1: account type)
- `POST /api/auth/login` - Login submission (to implement)
- `POST /api/auth/register/gulf-buyer` - Gulf buyer registration (to implement)
- `POST /api/auth/register/chinese-supplier` - Chinese supplier registration (to implement)
- `POST /api/auth/register/gulf-manufacturer` - Gulf manufacturer registration (to implement)

## Common Tasks

### Add New Field to Form
1. Add state: `const [field, setField] = useState('')`
2. Add to form: `<input value={field} onChange={(e) => setField(e.target.value)} />`
3. Add validation: Create validation function in `lib/validation.ts`
4. Add error handling: Add to errors state and display

### Add New Country
1. Update `GULF_COUNTRIES` in `constants/auth.ts`
2. Add country code prefix to `getCountryCodePrefix()` in `lib/validation.ts`
3. Update phone input if needed

### Add New Certification
1. Add to `CERTIFICATIONS` array in `constants/auth.ts`
2. Update forms that use certifications

### Change Theme Color
1. Replace all instances of `bg-red-600` with new color
2. Replace `text-red-500` with new text color
3. Update `focus:border-red-500` if needed

## Tailwind Classes Used

### Backgrounds
- `bg-gray-900` - Dark background
- `bg-gray-800` - Card background
- `bg-gray-700` - Input background
- `bg-red-600` - Primary button
- `bg-green-600` - Success
- `bg-orange-500` - Warning

### Text
- `text-white` - Primary text
- `text-gray-300` - Secondary text
- `text-gray-500` - Muted text
- `text-red-500` - Accent text
- `text-red-400` - Error text
- `text-green-500` - Success text

### Borders
- `border-gray-700` - Default border
- `border-red-500` - Active/error border
- `border-dashed` - Upload zone
- `rounded-lg` - Standard radius
- `rounded-full` - Pills/badges

### Spacing
- `p-4` - Padding
- `m-2` - Margin
- `gap-2` - Gap between items
- `space-y-4` - Vertical spacing

### Effects
- `shadow-lg` - Box shadow
- `backdrop-blur-sm` - Blur effect
- `opacity-50` - Opacity
- `transition` - Smooth transition

## Testing Checklist

### Login Page
- [ ] Email validation works
- [ ] Phone validation works
- [ ] Password toggle works
- [ ] Form submission works
- [ ] Error messages display

### Registration Page
- [ ] Account type selection works
- [ ] Step indicator updates
- [ ] Back button works
- [ ] All forms render correctly

### PasswordStrength
- [ ] Shows strength meter
- [ ] Updates on input
- [ ] Shows requirements
- [ ] Color changes correctly

### PhoneInput
- [ ] Country selector works
- [ ] Formats phone correctly
- [ ] Accepts valid numbers
- [ ] Rejects invalid numbers

### TagInput
- [ ] Can add tags
- [ ] Can remove tags
- [ ] Shows suggestions
- [ ] Respects max tags

### FileUpload
- [ ] Drag & drop works
- [ ] Click to browse works
- [ ] Shows preview
- [ ] Validates file size

## Deployment Notes

### Environment Variables
```
NEXT_PUBLIC_API_URL=http://api.chinagate.com
NEXT_PUBLIC_APP_URL=http://chinagate.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
WECHAT_APP_ID=...
EMAIL_FROM=noreply@chinagate.com
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

### Development Command
```bash
npm run dev
```

## Troubleshooting

### Issue: Component not found
**Solution**: Check import path in constants/auth.ts or lib/validation.ts

### Issue: Validation not working
**Solution**: Ensure validation function is imported and called correctly

### Issue: Styling looks wrong
**Solution**: Check Tailwind classes, ensure dir="rtl" is set for RTL content

### Issue: Form doesn't submit
**Solution**: Check form validation, ensure all required fields are filled

### Issue: File upload not working
**Solution**: Check max file size, verify accept attribute, check browser console

## Performance Tips

1. Use `React.lazy()` for heavy components
2. Implement form submission debouncing
3. Use `memo()` for expensive components
4. Minimize re-renders with `useCallback()`
5. Optimize images with Next.js Image component

## Security Reminders

1. Never log passwords
2. Validate on server side too
3. Use HTTPS in production
4. Implement CSRF protection
5. Rate limit login attempts
6. Sanitize user inputs
7. Use httpOnly cookies
8. Implement proper error messages (don't reveal if email exists)

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Complete and Ready for Integration
