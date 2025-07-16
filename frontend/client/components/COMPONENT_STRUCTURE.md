# Component Structure Guide

## 🏗 Architecture Overview

This document outlines the component structure for seamless Laravel backend integration.

## 📁 Component Organization

```
client/components/
├── admin/                 # Admin-specific components
│   ├── TrialLessonsManager.tsx     # Trial lesson management
│   ├── UserTable.tsx              # Admin user management
│   └── TeacherApplications.tsx    # Teacher approval workflow
├── auth/                  # Authentication components
│   ├── LoginForm.tsx              # Login form (Laravel ready)
│   ├── SignupForm.tsx             # Registration form
│   └── ProtectedRoute.tsx         # Route protection
├── booking/               # Lesson booking system
│   ├── BookingForm.tsx            # Main booking form
│   ├── BookingModal.tsx           # Booking dialog
│   ├── AvailabilityPicker.tsx     # Time slot selection
│   └── PaymentForm.tsx            # Payment processing
├── common/                # Shared components
│   ├── LoadingSpinner.tsx         # Loading states
│   ├── ErrorBoundary.tsx          # Error handling
│   └── DataTable.tsx              # Reusable table component
├── community/             # Community features
│   ├── PostList.tsx               # Community posts
│   ├── EventList.tsx              # Language events
│   └── ChallengeCard.tsx          # Language challenges
├── layout/                # Layout components
│   ├── Header.tsx                 # Site header
│   ├── Footer.tsx                 # Site footer
│   ├── Sidebar.tsx                # Navigation sidebar
│   └── PageLayout.tsx             # Page wrapper
├── messaging/             # Chat system
│   ├── ConversationList.tsx       # Chat list
│   ├── MessageThread.tsx          # Chat messages
│   ├── MessageInput.tsx           # Message composer
│   └── VideoCall.tsx              # Video chat integration
├── payment/               # Payment components
│   ├── PaymentForm.tsx            # Payment processing
│   ├── WalletBalance.tsx          # Wallet display
│   └── TransactionHistory.tsx     # Payment history
├── reviews/               # Rating system
│   ├── ReviewList.tsx             # Review display
│   ├── ReviewForm.tsx             # Review submission
│   └── RatingStars.tsx            # Star rating component
└── ui/                    # Base UI components
    ├── button.tsx                 # Button variants
    ├── form.tsx                   # Form components
    ├── table.tsx                  # Table components
    └── [other UI components]
```

## 🔗 Backend Integration Standards

### Component Naming Convention

```typescript
// ✅ Good - Semantic and descriptive
<UserProfileForm />
<LessonBookingModal />
<TeacherApprovalTable />

// ❌ Bad - Generic or unclear
<Form />
<Modal />
<Table />
```

### Data Attributes Standard

Every interactive component includes:

```typescript
// Unique identifier
id="component-name-action"

// Component type
data-component="component-type"

// Laravel integration
data-laravel-controller="ControllerName"
data-laravel-action="methodName"
data-api-endpoint="/api/endpoint"

// Model relationships
data-user-id={userId}
data-teacher-id={teacherId}
data-lesson-id={lessonId}
```

## 📋 Component Categories

### **🔴 High Priority - Database Integration Required**

#### **1. Authentication Components**

**LoginForm.tsx**

```typescript
// Laravel Integration: AuthController@login
<form
  id="auth-login-form"
  data-api="/api/auth/login"
  data-validation="email|password"
>
  <input
    name="email"
    data-field="email"
    data-validation="required|email"
  />
  <input
    name="password"
    data-field="password"
    data-validation="required|min:8"
  />
</form>
```

**SignupForm.tsx**

```typescript
// Laravel Integration: AuthController@register
<form
  id="auth-signup-form"
  data-api="/api/auth/register"
>
  // Similar structure with user registration fields
</form>
```

#### **2. User Management Components**

**admin/UserTable.tsx**

```typescript
// Laravel Integration: AdminController@users
<table
  id="admin-users-table"
  data-api="/api/admin/users"
  data-model="User"
>
  <tbody data-table-body="users">
    {users.map(user => (
      <tr data-user-id={user.id} data-user-status={user.status}>
        // User row content
      </tr>
    ))}
  </tbody>
</table>
```

#### **3. Booking Components**

**booking/BookingForm.tsx**

```typescript
// Laravel Integration: LessonController@store
<form
  id="lesson-booking-form"
  data-api="/api/lessons"
  data-teacher-id={teacherId}
>
  <select
    name="lesson_type"
    data-field="lesson_type"
    data-validation="required|in:trial,regular"
  >
  <input
    name="scheduled_at"
    data-field="scheduled_at"
    data-validation="required|date|after:now"
  >
</form>
```

#### **4. Messaging Components**

**messaging/MessageThread.tsx**

```typescript
// Laravel Integration: MessageController + WebSocket
<div
  id="message-thread"
  data-conversation-id={conversationId}
  data-websocket-channel={`conversation.${conversationId}`}
>
  <div data-messages-container>
    {messages.map(message => (
      <div
        data-message-id={message.id}
        data-sender-id={message.senderId}
      >
        // Message content
      </div>
    ))}
  </div>
</div>
```

### **🟡 Medium Priority - Configuration/Static Data**

#### **5. Teacher Profile Components**

**TeacherCard.tsx**

```typescript
// Laravel Integration: TeacherController@show
<div
  id={`teacher-card-${teacher.id}`}
  data-teacher-id={teacher.id}
  data-component="teacher-card"
>
  <div data-teacher-info>
    // Teacher display information
  </div>
  <button
    data-action="view-profile"
    data-teacher-id={teacher.id}
  >
    View Profile
  </button>
</div>
```

#### **6. Payment Components**

**payment/PaymentForm.tsx**

```typescript
// Laravel Integration: PaymentController@process
<form
  id="payment-form"
  data-api="/api/payments"
  data-payment-type="lesson"
>
  <input
    name="amount"
    data-field="amount"
    data-validation="required|numeric|min:1"
  />
  <select
    name="payment_method"
    data-field="payment_method"
    data-validation="required|in:credit_card,paypal,wallet"
  >
</form>
```

### **🟢 Low Priority - UI/Presentation Only**

#### **7. Static Components**

- Header/Footer navigation
- Loading spinners
- Static content pages
- UI components (buttons, cards, etc.)

## 🛠 Component Implementation Standards

### **1. Form Components**

All form components follow this pattern:

```typescript
interface FormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<FormData>;
  validationErrors?: Record<string, string[]>;
}

const FormComponent: React.FC<FormProps> = ({
  onSubmit,
  loading,
  initialData,
  validationErrors
}) => {
  // Form structure with Laravel-compatible validation
  return (
    <form
      id="unique-form-id"
      data-form-type="form-purpose"
      onSubmit={handleSubmit}
    >
      {/* Form fields with proper data attributes */}
    </form>
  );
};
```

### **2. Table Components**

All table components follow this pattern:

```typescript
interface TableProps<T> {
  data: T[];
  loading?: boolean;
  onAction?: (action: string, item: T) => void;
  apiEndpoint: string;
}

const TableComponent = <T extends { id: string }>({
  data,
  loading,
  onAction,
  apiEndpoint
}: TableProps<T>) => {
  return (
    <table
      data-table="table-type"
      data-api={apiEndpoint}
    >
      <tbody>
        {data.map(item => (
          <tr
            key={item.id}
            data-item-id={item.id}
          >
            {/* Table content */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### **3. Modal Components**

All modal components follow this pattern:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <dialog
      id="unique-modal-id"
      data-modal="modal-type"
      open={isOpen}
    >
      <div data-modal-content>
        <header data-modal-header>
          <h2 id="modal-title">{title}</h2>
        </header>
        <main data-modal-body>
          {children}
        </main>
      </div>
    </dialog>
  );
};
```

## 🔄 Data Flow Patterns

### **API Integration Pattern**

```typescript
// Service integration
const ComponentWithAPI: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API call through service layer
    DataService.getData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      data-component="data-component"
      data-api="/api/data-endpoint"
    >
      {loading ? <LoadingSpinner /> : <DataDisplay data={data} />}
    </div>
  );
};
```

### **Form Submission Pattern**

```typescript
const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await APIService.submit(formData);
      // Handle success
    } catch (error) {
      // Handle Laravel validation errors
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
    }
  };

  return (
    <form
      data-form-action="submit-data"
      onSubmit={handleSubmit}
    >
      {/* Form fields with error handling */}
    </form>
  );
};
```

## 📊 Component Priority Matrix

| Component      | Database Integration | Real-time Updates | Admin Access | Priority |
| -------------- | -------------------- | ----------------- | ------------ | -------- |
| LoginForm      | ✅                   | ❌                | ❌           | 🔴 High  |
| UserTable      | ✅                   | ✅                | ✅           | 🔴 High  |
| BookingForm    | ✅                   | ❌                | ❌           | 🔴 High  |
| MessageThread  | ✅                   | ✅                | ❌           | 🔴 High  |
| TeacherCard    | ✅                   | ❌                | ❌           | 🟡 Med   |
| PaymentForm    | ✅                   | ❌                | ❌           | 🟡 Med   |
| ReviewList     | ✅                   | ❌                | ❌           | 🟡 Med   |
| Navigation     | ❌                   | ❌                | ❌           | 🟢 Low   |
| LoadingSpinner | ❌                   | ❌                | ❌           | 🟢 Low   |

## 🚀 Implementation Checklist

### For Backend Developer:

- [ ] Review component data attributes
- [ ] Map components to Laravel controllers
- [ ] Implement API endpoints for each component
- [ ] Set up validation rules matching frontend
- [ ] Configure WebSocket for real-time components
- [ ] Test form submission flows
- [ ] Verify data attribute integration

### Component Quality Standards:

- [ ] Semantic HTML structure
- [ ] Proper ARIA labels for accessibility
- [ ] Consistent naming conventions
- [ ] Data attributes for all interactive elements
- [ ] Error handling for API failures
- [ ] Loading states for async operations
- [ ] TypeScript interfaces matching Laravel models

This structure ensures clean separation of concerns and easy backend integration!
