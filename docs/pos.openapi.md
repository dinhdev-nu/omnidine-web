# POS API

## 1) Muc dich API

API khoi tao context cho man hinh POS theo restaurant slug.

API nay tra ve:
- Thong tin user dang dang nhap (tu JWT payload)
- Vai tro nghiep vu trong nha hang (business_role)
- Staff profile trong nha hang (chi co khi business_role = staff)
- Thong tin restaurant can thiet cho POS

## 2) Endpoint

- Method: GET
- Path: /restaurants/{slug}/pos/init
- Auth: Bearer JWT (bat buoc)

## 3) Dau vao

### 3.1 Path params

- slug: string
  - Rule: slug format pipe (SlugValidationPipe)
  - Vi du: bep-nha-viet

### 3.2 Header

- Authorization: Bearer <access_token>

### 3.3 Du lieu noi bo tu guard/decorator

- CurrentUser() -> AccessTokenPayload
  - sub: ObjectId user
  - system_role: user | admin
  - jti: string
  - iat: number
  - exp: number

## 4) Luong xu ly va truy vet du lieu

### 4.1 Service va repository duoc su dung

- PosService.init(slug, user)
- restaurantRepository.getBySlug(slug)
- staffRepository.findByUserInRestaurant(restaurant._id, user.sub)

Luu y:
- tableRepository khong duoc su dung trong response init hien tai.

### 4.2 Rule phan quyen

- Cho phep neu:
  - user la owner cua restaurant
  - hoac user co system_role = admin
  - hoac user co record staff active trong restaurant
- Tu choi 403 neu khong thoa 1 trong 3 dieu kien tren

## 5) Dau ra (response data)

Luu y: Toan bo response bi wrap boi TransformResponseInterceptor theo format chung:
- success: boolean
- statusCode: number
- message: string
- data: object
- correlationId: string
- timestamp: string (ISO datetime)

### 5.1 Cau truc data

- user: object
- business_role: "owner" | "admin" | "staff"
- current_staff: object | null
- restaurant: object

## 6) Truy vet field chi tiet

### 6.1 user

Nguon:
- Schema: khong query DB cho object user output
- Repo: khong su dung cho object user output
- Service: PosService.init

Fields:
- user.id: ObjectId (string serialize)
  - Nguon: user.sub
- user.system_role: "user" | "admin"
  - Nguon: user.system_role

### 6.2 business_role

Nguon:
- Service: PosService.init

Rule mapping:
- "owner" neu restaurant.owner_id == user.sub
- "admin" neu user.system_role == "admin" va khong phai owner
- "staff" trong cac truong hop con lai (da qua check staff active)

### 6.3 current_staff

Nguon:
- Schema: Staff (src/modules/restaurant/schemas/staff.schema.xxx.ts)
- Repo: staffRepository.findByUserInRestaurant
- Service: ObjectUtil.pick(staffRecord, ["_id", "employee_code", "full_name", "phone", "email", "permissions", "position"])

Kieu tong:
- current_staff: null | object

Khi current_staff khac null, fields:
- current_staff._id: ObjectId (string serialize)
- current_staff.employee_code: string
- current_staff.full_name: string
- current_staff.phone: string | null
- current_staff.email: string | null
- current_staff.position: "manager" | "cashier" | "waiter" | "kitchen" | "delivery"
- current_staff.permissions: object
  - can_discount: boolean
  - can_cancel_order: boolean
  - can_process_payment: boolean
  - can_refund: boolean
  - can_view_reports: boolean
  - can_manage_tables: boolean
  - can_manage_menu: boolean

### 6.4 restaurant

Nguon:
- Schema: Restaurant (src/modules/restaurant/schemas/restaurant.schema.xxx.ts)
- Repo: restaurantRepository.getBySlug(slug)
- Service: ObjectUtil.pick(restaurant, ["_id", "name", "logo_url", "slug", "address", "phone", "timezone", "currency", "tax_rate", "service_charge_rate", "accepts_online_orders"])

Fields:
- restaurant._id: ObjectId (string serialize)
- restaurant.name: string
- restaurant.logo_url: string | null
- restaurant.slug: string
- restaurant.address: string
- restaurant.phone: string | null
- restaurant.timezone: string
- restaurant.currency: string
- restaurant.tax_rate: number
- restaurant.service_charge_rate: number
- restaurant.accepts_online_orders: boolean

## 7) Chi tiet loi trong qua trinh API

### 7.1 Loi validation slug

- HTTP Status: 400 Bad Request
- Error Code: VALIDATION_007 (INVALID_SLUG_FORMAT)
- Message: "Slug khong hop le format"
- Nguyen nhan: Slug param khong match pattern regex (SlugValidationPipe)

### 7.2 Loi xac thuc (Missing/Invalid Bearer Token)

- HTTP Status: 401 Unauthorized
- Error Code: AUTH_001 (UNAUTHORIZED)
- Message: "Vui long dang nhap de tiep tuc"
- Nguyen nhan:
  - Khong gui Authorization header
  - Token invalid/expired/malformed

### 7.3 Loi: Khong tim thay nha hang theo slug

- HTTP Status: 404 Not Found
- Error Code: RESTAURANT_NOT_FOUND (NOTFOUND_004)
- Message: "Khong tim thay nha hang"
- Nguon loi: PosService.init() -> restaurantRepository.getBySlug(slug)
- Nguyen nhan:
  - Slug khong ton tai
  - Nha hang da bi soft delete (deleted_at != null)

### 7.4 Loi: User khong co quyen truy cap POS

- HTTP Status: 403 Forbidden
- Error Code: FORBIDDEN (AUTH_002)
- Message: "Ban khong co quyen truy cap POS cua nha hang nay"
- Nguon loi: PosService.init() -> check owner/admin/staff active

## 8) Vi du response day du

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {
    "user": {
      "id": "6650aa42b12c3d4e5f678900",
      "system_role": "user"
    },
    "business_role": "staff",
    "current_staff": {
      "_id": "6650aa42b12c3d4e5f678911",
      "employee_code": "EMP001",
      "full_name": "Nguyen Van B",
      "phone": "0901234567",
      "email": "staff@example.com",
      "position": "cashier",
      "permissions": {
        "can_discount": true,
        "can_cancel_order": true,
        "can_process_payment": true,
        "can_refund": false,
        "can_view_reports": false,
        "can_manage_tables": true,
        "can_manage_menu": false
      }
    },
    "restaurant": {
      "_id": "664f1a2b3c4d5e6f7a8b9001",
      "name": "Bep Nha Viet",
      "logo_url": "https://cdn.example.com/logos/restaurant.png",
      "slug": "bep-nha-viet",
      "address": "123 Tran Hung Dao",
      "phone": "02812345678",
      "timezone": "Asia/Ho_Chi_Minh",
      "currency": "VND",
      "tax_rate": 0.1,
      "service_charge_rate": 0.01,
      "accepts_online_orders": true
    }
  },
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2026-04-25T10:00:00.000Z"
}
```

## 9) Interface TypeScript tham khao

```ts
type SystemRole = "user" | "admin";
type BusinessRole = "owner" | "admin" | "staff";
type StaffPosition = "manager" | "cashier" | "waiter" | "kitchen" | "delivery";

interface StaffPermissions {
  can_discount: boolean;
  can_cancel_order: boolean;
  can_process_payment: boolean;
  can_refund: boolean;
  can_view_reports: boolean;
  can_manage_tables: boolean;
  can_manage_menu: boolean;
}

interface PosUser {
  id: string;
  system_role: SystemRole;
}

interface PosStaff {
  _id: string;
  employee_code: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  position: StaffPosition;
  permissions: StaffPermissions;
}

interface PosRestaurant {
  _id: string;
  name: string;
  logo_url: string | null;
  slug: string;
  address: string;
  phone: string | null;
  timezone: string;
  currency: string;
  tax_rate: number;
  service_charge_rate: number;
  accepts_online_orders: boolean;
}

interface PosInitData {
  user: PosUser;
  business_role: BusinessRole;
  current_staff: PosStaff | null;
  restaurant: PosRestaurant;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  correlationId: string;
  timestamp: string;
}

type PosInitResponse = ApiResponse<PosInitData>;
```
