# Payment Module OpenAPI Documentation

## 1. Data Lineage

## 1.1 Files da truy vet
- DTO input/output:
  - src/modules/payment/dto/create-payment.dto.ts
- Controller entrypoint:
  - src/modules/payment/payment.controller.ts
- Service business logic:
  - src/modules/payment/payment.service.ts
- Repository data access:
  - src/modules/payment/repositories/payment.repository.ts
  - src/modules/order/repositories/order.repository.ts
- Schema database model:
  - src/modules/payment/schemas/payment.schema.ts
  - src/modules/order/schemas/order.schema.xxx.ts
- Guard/Pipe/Interceptor lien quan auth, role, response:
  - src/common/guards/jwt-auth.guard.ts
  - src/common/guards/system-role.guard.ts
  - src/common/guards/restaurant-auth.guard.ts
  - src/common/pipes/parse-id.pipe.ts
  - src/common/interceptors/transform-response.interceptor.ts

Ghi chu pham vi:
- Payment module hỗ trợ multiple payment methods: cash, credit_card, banking_transfer, qr_code, momo, zalopay, vnpay, shopeepay.
- Data lineage của Payment APIs bên dưới chỉ map các DTO đang được import trực tiếp trong PaymentController/PaymentWebhooksController.

## 1.2 Lineage theo tung endpoint

| Endpoint | DTO | Controller | Service | Repository | Schema fields read/write |
|---|---|---|---|---|---|
| POST /restaurants/{id}/orders/{order_id}/payments | CreatePaymentByCashDto, CreatePaymentDto | createPayment | paymentByCash, createNonCashPayment | countByRestaurant, findByRestaurantAndIdempotencyKey, createOne, updateByIdInOrder | write: order_id, restaurant_id, payment_number, amount, method, status (pending/completed), idempotency_key, processed_by, processed_at, notes, cash_tendered, change_amount |
| POST /restaurants/{id}/orders/{order_id}/payments/cash | CreatePaymentByCashDto | createCashPayment | paymentByCash | (tương tự create) | write: status=completed (cash completed ngay) |
| GET /restaurants/{id}/orders/{order_id}/payments | ListPaymentsQuery | listPayments | listPayments | listByOrder, aggregateSettlementByOrder | read: _id, payment_number, amount, method, status, reference_number, cash_tendered, change_amount, refunded_amount, processed_by, processed_at, created_at |
| GET /restaurants/{id}/orders/{order_id}/payments/{payment_id} | Query param includeGatewayResponse | getPayment | getPaymentById | findById, findByIdInOrder | read: full row + gateway_response (owner/admin only) |
| POST /restaurants/{id}/orders/{order_id}/payments/{payment_id}/refund | RefundPaymentDto | refundPayment | refundPayment | updateByIdInOrder, aggregateSettlementByOrder + order update | write: refunded_amount, refund_reason, refunded_at, status (refunded/partially_refunded) |
| POST /webhooks/momo | MoMo IPN payload | momoWebhook | processGatewayCallback | updateByIdInOrder, aggregateSettlementByOrder | write: status (completed/failed), reference_number, processed_at, failed_reason, gateway_response |
| POST /webhooks/vnpay | VNPay IPN payload | vnpayWebhook | processGatewayCallback | (tương tự momo) | write: (tương tự momo) |
| POST /webhooks/zalopay | ZaloPay IPN payload | zalopayWebhook | processGatewayCallback | (tương tự momo) | write: (tương tự momo) |
| POST /webhooks/shopeepay | ShopeePay IPN payload | shopeePayWebhook | processGatewayCallback | (tương tự momo) | write: (tương tự momo) |

## 1.3 Response envelope chuan
Tat ca endpoint (ke ca public) duoc wrap boi TransformResponseInterceptor.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {},
  "correlationId": "string",
  "timestamp": "2026-05-01T08:00:00.000Z"
}
```

## 1.4 Zero-omission inventory

### Payment schema fields goc
- _id: ObjectId
- order_id: ObjectId
- restaurant_id: ObjectId
- payment_number: string (PAY-YYYYMMDD-XXXX)
- amount: Decimal(15,2)
- cash_tendered: Decimal(15,2) | null
- change_amount: Decimal(15,2)
- currency: string (default: VND)
- method: enum(cash, credit_card, banking_transfer, qr_code, momo, zalopay, vnpay, shopeepay)
- status: enum(pending, completed, failed, refunded, partially_refunded)
- reference_number: string | null
- idempotency_key: string (unique per restaurant + key)
- processed_by: ObjectId | null
- processed_at: date-time | null
- expires_at: date-time | null (gateway payments only)
- failed_reason: string | null
- gateway_response: JSON | null
- refunded_amount: Decimal(15,2) (default: 0)
- refunded_at: date-time | null
- refund_reason: string | null
- notes: string | null
- created_at: date-time
- updated_at: date-time
- id: virtual string (tu _id)

### Mapping field theo response endpoint
| Field | Create | Create Cash | List | Detail | Refund | Webhook ACK | Ghi chu |
|---|---|---|---|---|---|---|---|
| _id | khong | khong | khong | co (nested) | khong | khong | list/detail dung id thay vi _id |
| id (virtual) | co | co | co | co | khong | khong | derived tu _id |
| order_id | co | co | khong | khong | khong | khong | response can order details |
| restaurant_id | co | co | khong | khong | khong | khong | context param, khong tra |
| payment_number | co | co | co | co | khong | khong | unique per restaurant per day |
| amount | co | co | co | co | khong | co (nested) | |
| cash_tendered | co | co | co | co | khong | khong | cash payment only |
| change_amount | co | co | co | co | khong | khong | cash payment only |
| currency | co | co | khong | co | khong | khong | snapshot tu order |
| method | co | co | co | co | khong | khong | |
| status | co | co | co | co | co (updated) | co | pending/completed/failed/refunded/partially_refunded |
| reference_number | co | co | co | co | khong | khong | gateway trans ID |
| idempotency_key | co | co | khong | khong | khong | khong | security tuy cap, khong tra |
| processed_by | co | co | co | co | khong | khong | staff ID hoac null |
| processed_at | co | co | co | co | khong | khong | |
| expires_at | co | khong | khong | co (gateway only) | khong | khong | gateway pending only |
| failed_reason | khong | khong | khong | co (failed status) | khong | co (nested) | |
| gateway_response | khong | khong | khong | co (owner/admin only) | khong | khong | raw IPN payload |
| refunded_amount | co | co | co | co | co (updated) | khong | |
| refunded_at | co | co | co | co (if refunded) | co (updated) | khong | |
| refund_reason | khong | khong | co | co | co (input) | khong | |
| notes | co | co | co | co | khong | khong | |
| created_at | co | co | khong | co | khong | khong | |
| updated_at | co | co | khong | co | co (updated) | khong | |
| order_payment_status (derived) | co | co | khong | khong | co (updated) | khong | orders.payment_status sau khi thanh toan/refund |
| payment_url (derived) | khong | khong | khong | co (gateway pending) | khong | khong | gateway redirect URL |
| qr_code_url (derived) | khong | khong | khong | co (gateway pending) | khong | khong | gateway QR URL |

---

## 2. API Specification

## 2.1 POST /restaurants/{id}/orders/{order_id}/payments
### Muc dich
Tao payment moi (cash hoac gateway) cho don hang.

### Du lieu vao (Request)
### Header
- Authorization: Bearer access_token (required)

### Path Param
| Field | Type | Required | Validation |
|---|---|---|---|
| id | string(ObjectId) | true | ParseObjectIdPipe |
| order_id | string(ObjectId) | true | ParseObjectIdPipe |

### Body
| Field | Type | Required | Validation |
|---|---|---|---|
| method | enum(PaymentMethod) | true | IsEnum(PaymentMethod) |
| amount | number | true | Type(Number), IsNumber(maxDecimalPlaces: 2), Min(0.01) |
| idempotency_key | string | true | IsUUID('4') |
| cash_tendered | number | conditional | Type(Number), IsNumber(maxDecimalPlaces: 2), Min(0.01) - bắt buộc khi method=cash |
| reference_number | string | conditional | MaxLength(100) - bắt buộc cho credit_card/banking_transfer |
| return_url | string | optional | MaxLength(500) - dùng cho gateway redirect |
| notes | string | optional | MaxLength(1000) |

Service constraints:
- Kiểm tra rate limit: tối đa 10 payment/phút/order.
- Kiểm tra idempotency_key: nếu đã tồn tại trả lại payment cũ (200), nếu failed trả 409.
- Kiểm tra order.status IN (confirmed, preparing, ready, completed).
- Kiểm tra remaining_amount = total_amount - net_paid - pending_hold > 0.
- Kiểm tra amount ≤ remaining_amount.
- Nếu method=cash: kiểm tra cash_tendered ≥ amount, tính change_amount.
- Cash payment: status = 'completed' ngay lập tức.
- Gateway payment: status = 'pending', expires_at = NOW() + 15 phút.

### Du lieu ra (Response)
HTTP 201

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Request was successful",
  "data": {
    "id": "string",
    "payment_number": "PAY-20260501-0001",
    "order_id": "string",
    "amount": 150000.00,
    "cash_tendered": 200000.00,
    "change_amount": 50000.00,
    "method": "cash",
    "status": "completed",
    "reference_number": "string|null",
    "processed_by": "string|null",
    "processed_at": "date-time",
    "expires_at": "date-time|null",
    "order_payment_status": "paid|partial|unpaid",
    "payment_url": "string|null",
    "qr_code_url": "string|null",
    "created_at": "date-time"
  },
  "correlationId": "string",
  "timestamp": "date-time"
}
```

### Xu ly loi (Exception handling)
- 400 Bad Request
  - path id/order_id không hợp lệ
  - payload validation fail
  - cash_tendered < amount (cash only)
  - amount > remaining_amount
  - reference_number missing (credit_card/banking_transfer)
- 401 Unauthorized
- 403 Forbidden
  - staff không có can_process_payment
- 404 Not Found
  - order không tồn tại
  - restaurant không tồn tại
- 409 Conflict
  - order.status không hợp lệ
  - remaining_amount ≤ 0
  - idempotency_key đã dùng cho payment failed
- 429 Too Many Requests
  - vuot rate limit payment:create:{order_id}
- 502 Bad Gateway
  - gateway API từ chối
- 504 Gateway Timeout
  - gateway timeout (> 10 giây)
- 500 Internal Server Error

---

## 2.2 POST /restaurants/{id}/orders/{order_id}/payments/cash
### Muc dich
Alias endpoint để tạo payment tiền mặt (convenience endpoint).

### Du lieu vao (Request)
### Header
- Authorization: Bearer access_token (required)

### Path Param
| Field | Type | Required | Validation |
|---|---|---|---|
| id | string(ObjectId) | true | ParseObjectIdPipe |
| order_id | string(ObjectId) | true | ParseObjectIdPipe |

### Body
| Field | Type | Required | Validation |
|---|---|---|---|
| amount | number | true | Type(Number), IsNumber(maxDecimalPlaces: 2), Min(0.01) |
| cash_tendered | number | true | Type(Number), IsNumber(maxDecimalPlaces: 2), Min(0.01) |
| idempotency_key | string | true | IsUUID('4') |
| notes | string | optional | MaxLength(1000) |

### Du lieu ra (Response)
HTTP 201 (tương tự POST /payments)

### Xu ly loi (Exception handling)
(tương tự POST /payments)

---

## 2.3 GET /restaurants/{id}/orders/{order_id}/payments
### Muc dich
Lay danh sach toan bo payment cua don hang.

### Du lieu vao (Request)
### Header
- Authorization: Bearer access_token (required)

### Path Param
| Field | Type | Required | Validation |
|---|---|---|---|
| id | string(ObjectId) | true | ParseObjectIdPipe |
| order_id | string(ObjectId) | true | ParseObjectIdPipe |

### Du lieu ra (Response)
HTTP 200

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {
    "payments": [
      {
        "id": "string",
        "payment_number": "PAY-20260501-0001",
        "amount": 150000.00,
        "method": "cash",
        "status": "completed",
        "reference_number": "string|null",
        "cash_tendered": 200000.00,
        "change_amount": 50000.00,
        "refunded_amount": 0,
        "processed_by": "string|null",
        "processed_at": "date-time",
        "expires_at": "date-time|null",
        "created_at": "date-time"
      }
    ],
    "summary": {
      "net_paid": 150000.00,
      "total_refunded": 0,
      "remaining_amount": 0,
      "order_payment_status": "paid"
    }
  },
  "correlationId": "string",
  "timestamp": "date-time"
}
```

### Xu ly loi (Exception handling)
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
  - order không tồn tại
- 500 Internal Server Error

---

## 2.4 GET /restaurants/{id}/orders/{order_id}/payments/{payment_id}
### Muc dich
Lay chi tiet payment (bao gom gateway_response neu owner/admin).

### Du lieu vao (Request)
### Header
- Authorization: Bearer access_token (required)

### Path Param
| Field | Type | Required | Validation |
|---|---|---|---|
| id | string(ObjectId) | true | ParseObjectIdPipe |
| order_id | string(ObjectId) | true | ParseObjectIdPipe |
| payment_id | string(ObjectId) | true | ParseObjectIdPipe |

### Query Param
| Field | Type | Required | Validation |
|---|---|---|---|
| includeGatewayResponse | string | optional | value = '1' or 'true' |

Service constraints:
- Chỉ owner/admin được xem gateway_response.

### Du lieu ra (Response)
HTTP 200

Owner/Admin variant:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {
    "id": "string",
    "payment_number": "PAY-20260501-0001",
    "amount": 150000.00,
    "method": "momo",
    "status": "completed",
    "reference_number": "transId123",
    "processed_by": "string|null",
    "processed_at": "date-time",
    "expires_at": "date-time|null",
    "failed_reason": "string|null",
    "gateway_response": { "raw": "gateway", "response": "object" },
    "refunded_amount": 0,
    "refund_reason": "string|null",
    "refunded_at": null,
    "notes": "string|null",
    "created_at": "date-time",
    "updated_at": "date-time"
  },
  "correlationId": "string",
  "timestamp": "date-time"
}
```

Staff variant (gateway_response omitted):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {
    "id": "string",
    "payment_number": "PAY-20260501-0001",
    "amount": 150000.00,
    "method": "momo",
    "status": "completed",
    "reference_number": "transId123",
    "processed_by": "string|null",
    "processed_at": "date-time",
    "expires_at": "date-time|null",
    "failed_reason": "string|null",
    "refunded_amount": 0,
    "refund_reason": "string|null",
    "refunded_at": null,
    "notes": "string|null",
    "created_at": "date-time",
    "updated_at": "date-time"
  },
  "correlationId": "string",
  "timestamp": "date-time"
}
```

### Xu ly loi (Exception handling)
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
  - payment không thuộc restaurant/order context
- 404 Not Found
  - payment không tồn tại
- 500 Internal Server Error

---

## 2.5 POST /restaurants/{id}/orders/{order_id}/payments/{payment_id}/refund
### Muc dich
Hoan tien (toan phan hoac mot phan) cho payment.

### Du lieu vao (Request)
### Header
- Authorization: Bearer access_token (required)

### Path Param
| Field | Type | Required | Validation |
|---|---|---|---|
| id | string(ObjectId) | true | ParseObjectIdPipe |
| order_id | string(ObjectId) | true | ParseObjectIdPipe |
| payment_id | string(ObjectId) | true | ParseObjectIdPipe |

### Body
| Field | Type | Required | Validation |
|---|---|---|---|
| refund_amount | number | true | Type(Number), IsNumber(maxDecimalPlaces: 2), Min(0.01) |
| refund_reason | string | true | MaxLength(500), IsNotEmpty |

Service constraints:
- Kiểm tra rate limit: tối đa 5 refund/phút/order.
- Kiểm tra payment.status IN (completed, partially_refunded).
- Kiểm tra refund_amount ≤ (payment.amount - payment.refunded_amount).
- Nếu refunded_amount mới = amount -> status = 'refunded'.
- Nếu refunded_amount mới < amount -> status = 'partially_refunded'.
- Cập nhật orders.payment_status theo ràng buộc #7 trong payment.md.

### Du lieu ra (Response)
HTTP 200

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request was successful",
  "data": {
    "payment_id": "string",
    "refunded_amount": 50000.00,
    "payment_status": "partially_refunded",
    "refunded_at": "date-time",
    "order_payment_status": "partially_refunded",
    "order_status": "completed"
  },
  "correlationId": "string",
  "timestamp": "date-time"
}
```

### Xu ly loi (Exception handling)
- 400 Bad Request
  - payload validation fail
  - refund_amount > max_refundable
  - refund_reason missing
- 401 Unauthorized
- 403 Forbidden
  - staff không có can_refund
- 404 Not Found
  - payment không tồn tại
- 409 Conflict
  - payment.status không phù hợp
- 429 Too Many Requests
  - vuot rate limit payment:refund:{order_id}
- 500 Internal Server Error