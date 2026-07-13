# Responsive Coverage Matrix

This is the working acceptance matrix for the responsive audit. An entry is only
marked `pass` after real-browser verification at the required viewport set (or a
representative set plus continuous resizing), keyboard/focus checks, and console
and network review. `blocked` entries must include a concrete access or data
reason.

## Baseline and constraints

- Branch at baseline: `feat/responsive`
- Required fixed viewport widths: 320, 375, 390, 430, 768, 1024, 1280, 1366,
  1440, and 1920 CSS px.
- Also verify intermediate widths, mobile landscape, 200% zoom, reduced motion,
  keyboard-only use, and mobile safe areas.
- Existing uncommitted files at baseline (preserve; do not overwrite):
  `index.html`, the guest restaurant listing/search component set under
  `src/features/guest/restaurants/components/`, and
  `src/layouts/guest/GuestRestaurantsLayout.tsx`.
- API environment expected by the application: `VITE_API_URL`; no local `.env`
  was present at inventory time.
- Status values: `pending`, `in-progress`, `pass`, `blocked`.

## Shared shells and components

| Scope | Consumers | States and interactions | Access/data | Status |
| --- | --- | --- | --- | --- |
| Global router fallback, toaster, theme provider | Every route | Lazy loading, toast announcements, light/dark theme, session expiry redirect | None for shell; expired-session path needs stored auth state | pass with browser fixtures; live session expiry blocked |
| Home shell and landing header/footer | `/` | Desktop navigation, mobile navigation behavior, anchors, pricing/FAQ/newsletter, authenticated and guest CTA variants | Guest; stored access token for authenticated CTA | pass |
| Auth shell and auth card | All `/auth/*` routes | Narrow/short viewport behavior, step animations, password visibility, validation, OTP method modal, loading/error/disabled | Guest; backend and reachable email/phone for successful OTP states | pass with browser fixtures; live auth/OAuth blocked |
| Settings shell, header, sidebar, account menu | All `/settings/*` routes | Desktop/mobile navigation, account menu, logout, loading identity, active route | Authenticated user/profile | pass with browser fixtures; live session blocked |
| Guest restaurant shell and public header/search | `/public/restaurants`, `/public/restaurants/:slug` | Desktop/mobile search, location selector, account menu, bottom navigation, create FAB, attention modal, safe area | Guest for public data; authenticated profile for user-menu variant | pass with browser fixtures; live/authenticated variant blocked |
| Guest ordering shell/header/cart | Public menu and QR ordering routes | Header menus, category navigation, search, mobile cart, clear-cart dialog, keyboard shortcuts | Valid published restaurant slug or valid table QR; public API data | pass with browser fixtures; live API blocked |
| Dashboard shell, sidebar, header | `/dashboard/:id` and all internal sections | Expanded/collapsed sidebar, navigation, search, notifications, theme toggle, account menu, loading/error | Authenticated user plus accessible restaurant ID | pass with browser fixtures; live authorization blocked |
| POS shell, sidebar, header | `/pos/:slug/*` | Expanded/collapsed sidebar, desktop/mobile navigation, operational switch, notifications/account menus | Authenticated staff/owner plus accessible restaurant slug and POS init data | pass with browser fixtures; live POS session blocked |
| shadcn/Radix overlay primitives | All Dialog, ConfirmationDialog, DropdownMenu, Popover, Select consumers | Focus trap/restore, title/name, Esc/outside close, internal scrolling, touch targets | Route-specific | pass for audited consumers |
| Shared image/icon/button/form primitives | All consumers | Intrinsic image sizing, aspect ratio, names/labels, focus-visible, disabled/loading, long text | Route-specific | pass for audited consumers |

## Public and guest routes

| Route / URL | Views and states | Overlays and interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| `/` | Landing hero, logos, feature sections, testimonials, pricing, FAQ, newsletter, footer; guest/auth CTA variants | Header navigation, pricing anchors, FAQ controls, newsletter form | None; stored token for auth CTA variant | pass |
| `/public/restaurants` | Authenticated/guest; loading, error, empty, populated; feed filters; long restaurant/location text | Desktop/mobile search, location selector, result selection, account menu, create banner/FAB, attention modal, mobile bottom navigation | Public restaurant API; auth profile for authenticated variant | pass for guest UI with browser fixtures; live API and authenticated variant blocked |
| `/public/restaurants/:slug` | Loading, redirect-on-error, populated, no-gallery, unpublished, online-order disabled/enabled, long metadata | Back, share/copy feedback, phone link, menu navigation, public header search | Valid and invalid restaurant slugs; public restaurant detail API | pass with browser fixtures; live API blocked |
| `/public/restaurants/:slug/menu` | Menu loading/error/empty/populated; open/closed restaurant; category/search results; empty/populated cart; dine-in/takeaway | Header menus, category controls, add/update/remove item, mobile cart, clear-cart dialog, order validation/submission | Valid published slug; menu data; tables for dine-in; backend for submit | pass with browser fixtures; live API blocked |
| `/public/tables/:qrCode` | Table lookup loading/error; fixed-table menu; empty/populated cart; open/closed restaurant | Same ordering interactions with locked dine-in table | Valid and invalid QR codes; linked published restaurant/menu | pass with browser fixtures; live API blocked |

## Authentication routes

| Route / URL | Views and states | Overlays and interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| `/auth` | Redirect to login | Redirect behavior | None | pass |
| `/auth/login` | Credentials; empty/invalid/populated; submitting/error; password visible/hidden | Keyboard submit, password toggle, forgot-password and register navigation | Guest; backend for success/error variants | pass with browser fixtures; live backend blocked |
| `/auth/2fa` | Empty/partial/complete OTP; countdown; resend; loading/error/disabled | OTP keyboard input, back, resend, verify | Prior login challenge/session; reachable OTP method | pass with browser fixtures; live OTP blocked |
| `/auth/forgot-password` | Email empty/invalid/populated; loading/error | Back, keyboard submit, send code | Existing account and reachable email | pass with browser fixtures; live email blocked |
| `/auth/reset-password/verify` | OTP empty/partial/complete; countdown/resend/loading | Back, resend, verify | Active reset transaction and OTP | pass with browser fixtures; live OTP blocked |
| `/auth/reset-password` | New/confirm passwords; mismatch; visible/hidden; loading/error; success view | Password toggles, submit, return to login | Verified reset transaction | pass with browser fixtures; live backend blocked |
| `/auth/register` | Info step and password step; validation/loading/error; authenticated redirect behavior | Forward/back, password toggles, OTP method dialog | Guest; unused email/phone; backend | pass with browser fixtures; live backend blocked |
| `/auth/verify-email` | OTP step; partial/complete, countdown/resend/loading/error | OTP input, resend, back, verify | Active registration transaction and reachable OTP method | pass with browser fixtures; live OTP blocked |
| `/oauth/callback` | Loading, success redirect, provider error | OAuth callback handling | Valid provider callback parameters/session | pass with browser fixtures; live provider blocked |

## Settings and onboarding routes

| Route / URL | Views and states | Overlays and interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| `/settings` | Redirect to account profile | Redirect behavior | Authenticated user | pass |
| `/settings/account/profile` | Loading/empty/populated profile; editable cards; save disabled/loading/error/success; long values | Avatar/media, form controls, save actions | Authenticated user/profile API | pass with browser fixtures; live backend blocked |
| `/settings/account/notifications` | Notification preferences and disabled/loading states | Switches and save/update feedback | Authenticated user | pass with browser fixtures; live backend blocked |
| `/settings/account/security` | Password, 2FA, sessions, audit log, danger zone | Confirmation dialogs, password forms, session actions | Authenticated user; security/session data | pass with browser fixtures; live backend blocked |
| `/settings/manage/restaurants` | Loading skeleton, error, empty, populated, long names/addresses, many cards | Open dashboard/POS/public page, create restaurant, share dialog, copy action | Authenticated user with zero and multiple restaurant variants | pass with browser fixtures; live backend blocked |
| `/restaurants` | Redirect to restaurant management | Redirect behavior | Authenticated user | pass |
| `/restaurants/new` | Multi-section registration form; empty/invalid/populated; upload/current location/slug checking; submitting/error | Selects, image upload/preview, privacy dialog, operating-hours controls | Authenticated user; geolocation permission; backend/media service | pass with browser fixtures; live external services blocked |
| `/profile/*` | Redirect to settings profile | Redirect behavior | Authenticated user | pass |

## Dashboard route

All dashboard views share `/dashboard/:id`; section state is currently local rather
than encoded in the URL. Test each section after direct entry and after sidebar
navigation, with both sidebar widths and both themes.

| View | States and content | Overlays and interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| Shell/restaurant load | Loading, forbidden redirect, populated, long restaurant name | Sidebar collapse, theme, search, account/notification controls | Authenticated user plus valid/forbidden restaurant IDs | pass with browser fixtures; live auth blocked |
| Overview | KPI cards, revenue chart, recent deals, top performers; empty/populated data | Chart hover/focus where available | Valid restaurant ID; currently includes existing local presentation data | pass |
| Pipeline | Pipeline columns/cards and totals | Column/card interactions | Valid restaurant ID | pass |
| Deals | Deal list/table/card views; long values | Filters/actions if exposed | Valid restaurant ID | pass |
| Customers | Customer list/table/card views; long values | Filters/actions if exposed | Valid restaurant ID | pass |
| Team | Staff/performance content; empty/populated | Row/card actions if exposed | Valid restaurant ID | pass |
| Forecasting | Header controls, KPI summary, chart, analysis grid, risk card | Select/filter/chart interactions | Valid restaurant ID | pass |
| Reports | Report controls/content; empty/populated | Filters/export controls if exposed | Valid restaurant ID | pass |
| Settings: profile | Restaurant profile form and long values | Form controls and validation | Valid restaurant detail | pass with browser fixtures |
| Settings: status | Publish/online-order switches; loading/error/success | Switches and toast feedback | Valid restaurant detail and update permissions | pass with browser fixtures; live update blocked |
| Settings: integrations | Disconnected/connected-looking cards and long descriptions | Integration actions if exposed | Valid restaurant ID | pass |
| Settings: security | Confirmation phrase disabled/enabled | Destructive action confirmation behavior | Valid restaurant ID | pass |

## POS routes

| Route / view | States and content | Overlays and interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| `/pos` | Reject/return state | Back navigation | None | pass |
| `/pos/:slug` main POS | POS init loading/error/populated; menu empty/populated; cart empty/populated; operational on/off | Categories, search, add/update/remove, mobile cart FAB, clear-cart dialog, create order | Authenticated POS user, valid slug, menu/table data | pass with browser fixtures; live backend blocked |
| `/pos/:slug/tables` | Empty/populated table map/list; all table statuses; dense layout | Drag/drop, quick actions, add-table modal, table controls | Authenticated POS user, valid slug, table data | pass with browser fixtures; live backend blocked |
| `/pos/:slug/payments` | Missing-order/default state | Payment navigation | Authenticated POS user, valid slug | pass with browser fixtures |
| `/pos/:slug/payments/:orderId` | Loading/error/order summary; cash processing/success/disabled; unavailable methods visibly disabled | Method selector, payment forms, success state | Valid unpaid order ID and payment permissions | pass with browser fixtures; live backend blocked |
| `/pos/:slug/orders` | Loading/error/empty/populated; filters; pagination; desktop rows/mobile cards; expanded details | Filters, expansion, status actions | Authenticated POS user, valid slug, order data | pass with browser fixtures; live backend blocked |
| `/pos/:slug/menu` | Loading/error/empty/populated; stats; filters; pagination; desktop table/mobile cards | Category manager, category form, item add/edit/detail dialogs, delete confirmations | Authenticated manager/owner, valid slug, menu/category data | pass with browser fixtures; live backend blocked |
| `/pos/:slug/staff` | Loading/error/empty/populated; stats; filters; desktop table/mobile cards | Staff detail and create/edit forms, permissions/status, confirmation states | Authenticated owner/manager, valid slug, staff data | pass with browser fixtures; live backend blocked |
| Invalid `/pos/:slug/*` suffix | Redirect to main POS | Redirect behavior | Valid slug/session | pass with browser fixtures |

## Fallback routes

| Route / URL | Views and states | Interactions | Access/data required | Status |
| --- | --- | --- | --- | --- |
| `/not-found` and unmatched `*` | Not-found page at all widths | Recovery navigation | None | pass |

## Baseline command results

| Command | Result | Existing/new | Notes |
| --- | --- | --- | --- |
| `npm run typecheck` | pass | baseline | Exit 0; TypeScript emitted no diagnostics. |
| `npm run lint` | pass | baseline | Exit 0; ESLint emitted no diagnostics. |
| `npm run build` | pass | baseline | Exit 0; Vite built successfully. |

## Completed page report: `/public/restaurants`

- Responsive issues reproduced:
  - page-level `overflow-x-clip` masked diagnosis even though the filter owned its
    intended horizontal scrolling;
  - header, post-title/action, location, and search-filter controls were below
    the 44px mobile/tablet target;
  - the desktop three-column layout hid the last filter inside an unmarked
    horizontal scroller;
  - skip-link activation scrolled without moving focus to main content;
  - controlled mobile-search and attention dialogs returned focus to `body`;
  - the location popover's dialog role had no accessible name;
  - the main feed was blank while data loaded on mobile because loading
    placeholders only existed in a desktop-only sidebar.
- Fixes:
  - removed page-level overflow clipping and retained the filter's local
    `overflow-x-auto` behavior;
  - raised interactive targets to at least 44px without changing the visual
    system;
  - compacted filter gaps/padding only at `xl` so all six desktop filters remain
    visible while preserving a one-row, 44px control layout;
  - made the main landmark programmatically focusable for the skip link;
  - restored focus to external triggers on controlled-dialog close;
  - labeled the location popover and added an accessible main-feed spinner state;
  - preserved semantic tokens, Radix Nova composition, existing routing, API,
    state, filters, animation, and user interactions.
- Files adjusted in this page scope:
  - `src/features/guest/restaurants/components/AttentionModal.tsx`
  - `src/features/guest/restaurants/components/FilterTabs.tsx`
  - `src/features/guest/restaurants/components/GuestRestaurantsView.tsx`
  - `src/features/guest/restaurants/components/LocationSelector.tsx`
  - `src/features/guest/restaurants/components/MobilePublicHeaderSearch.tsx`
  - `src/features/guest/restaurants/components/PostCard.tsx`
  - `src/features/guest/restaurants/components/PublicHeader.tsx`
  - `src/features/guest/restaurants/components/PublicHeaderSearch.tsx`
  - `src/features/guest/restaurants/components/PublicHeaderSearchContent.tsx`
  - `src/features/guest/restaurants/components/public-header-search.view-types.ts`
  - `src/layouts/guest/GuestRestaurantsLayout.tsx`
- Browser viewport evidence:
  - fixed widths: 320, 375, 390, 430, 768, 1024, 1280, 1366, 1440, and 1920;
  - intermediate/mobile landscape: 667x375, 744x420, 900, 1152, and 1600;
  - continuous-width assertions confirmed document `scrollWidth === innerWidth`;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- Interactions rechecked:
  - keyboard skip link and visible focus;
  - mobile search focus trap/restore, Escape close, filters, result layout, and
    44px controls;
  - location popover name, keyboard close, and focus restore;
  - attention dialog title, initial focus, Escape close, and FAB focus restore;
  - filter selection, like toggle/count, mobile bottom navigation layout,
    reduced-motion media behavior, loading, empty, error, and populated states.
- Page gate after changes:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass;
  - fixture-backed browser run: no console errors or warnings and no failed
    application requests.
- Blocked coverage:
  - no `.env` or reachable backend is configured (`VITE_API_URL` is only present
    in `.env.example`), so the live request resolves to the Vite HTML fallback
    and produces `Cannot read properties of undefined (reading 'data')`;
  - no authenticated account/session is available, so the profile/account-menu
    variant and live authenticated API behavior remain blocked and are not
    claimed as passed;
  - populated, loading, and empty visual states were verified with browser-only
    network fixtures; the live-data state remains blocked until a backend exists.

## Completed page report: `/public/restaurants/:slug`

- Responsive issues reproduced:
  - back, share, phone, and online-order actions were 36px high at every tested
    width, below the mobile/tablet touch target;
  - long description, address, email, and website values were irreversibly
    clamped or truncated on the detail screen;
  - cover and gallery images lacked intrinsic dimensions;
  - the loading skeleton had no accessible name and did not explicitly honor
    reduced motion;
  - published/online badges used page-specific raw status colors instead of the
    project's semantic status tokens.
- Fixes:
  - raised the four sticky primary actions to a minimum 44px while preserving
    their existing shadcn variants and two-row mobile layout;
  - used the Button icon slot convention (`data-icon`) and existing Radix Nova
    component APIs;
  - allowed detail metadata to wrap naturally without hiding content;
  - added intrinsic cover/gallery dimensions, eager priority for the hero, and
    lazy loading for gallery images;
  - labeled the loading output and disabled its pulse animation under reduced
    motion;
  - replaced raw published/online colors with `success`/`warning` tokens.
- Files adjusted:
  - `src/pages/guest/restaurants/GuestRestaurantDetailsPage.tsx`
  - shared guest shell/header changes are listed in the preceding page report.
- Browser viewport evidence:
  - fixed widths: 320, 375, 390, 430, 768, 1024, 1280, 1366, 1440, and 1920;
  - intermediate/mobile landscape: 667x375 and 900;
  - every final width reported document `scrollWidth === innerWidth`;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- States/interactions rechecked:
  - long populated content, published and unpublished, online enabled/disabled,
    phone present/missing, gallery populated/empty, loading, share/copy feedback,
    shared mobile/desktop search shell, bottom navigation, and invalid-slug
    redirect to `/public/restaurants`;
  - loading pulse computed to effectively zero duration with
    `prefers-reduced-motion: reduce`;
  - a clean browser session produced zero console errors/warnings and only 200
    responses for the fixture-backed detail request.
- Page gate after changes:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass.
- Blocked coverage:
  - the live detail endpoint cannot be exercised without `VITE_API_URL` and a
    reachable backend; valid/invalid states were verified using browser-only
    fixtures and the live-data claim remains blocked.

## Completed page report: public ordering menu and QR routes

- Routes covered:
  - `/public/restaurants/:slug/menu`;
  - `/public/tables/:qrCode`.
- Responsive and accessibility issues reproduced:
  - header notification, account, search, and add-item controls were unnamed or
    below the 44px target;
  - the mobile cart FAB covered the final menu card and remained visible over
    the open cart;
  - the 320px cart compressed quantity controls, notes, and totals into crowded
    rows, while a short mobile landscape left only about 50px for menu scrolling;
  - opening the mobile cart did not move focus, and closing it did not restore
    focus to its trigger;
  - the manual confirmation overlay had no dialog semantics, focus trap,
    Escape handling, or reliable focus restoration;
  - pressing Escape in the clear-cart dialog also closed the underlying mobile
    cart;
  - menu loading rendered as an empty state because the controller did not
    expose fetch progress;
  - images lacked intrinsic dimensions, fields relied on placeholders for
    names, and POS motion helpers used broad transitions without a complete
    reduced-motion path.
- Fixes:
  - added accessible names, form names/autocomplete hints, one logical `h1`,
    intrinsic image dimensions, explicit transition properties, semantic status
    tokens, and minimum 44x44 controls;
  - added a labeled loading output, safe-area-aware shell/header/footer/FAB,
    bottom scroll clearance, a single-column 320px menu, and compact short-height
    landscape rules;
  - added mobile-cart focus entry/return and hid its FAB while the cart is open;
  - rebuilt `ConfirmationDialog` on the existing shadcn/Radix dialog primitive,
    including title/description semantics, focus trap/restore, Escape and outside
    handling, loading protection, and reduced-motion behavior;
  - isolated Escape handling so closing a dialog does not close the underlying
    cart;
  - preserved service calls, controller state, routes, search debounce, category
    behavior, cart math, order validation, and app/QR payload contracts.
- Files adjusted:
  - `src/components/ui/confirmation-dialog.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/features/guest/ordering/components/GuestOrderingScreen.tsx`
  - `src/features/guest/ordering/components/GuestOrderingView.tsx`
  - `src/features/guest/ordering/components/Header.tsx`
  - `src/features/guest/ordering/components/HeaderBrandStatus.tsx`
  - `src/features/guest/ordering/components/HeaderMenus.tsx`
  - `src/features/guest/ordering/components/MenuCategory.tsx`
  - `src/features/guest/ordering/components/MenuGrid.tsx`
  - `src/features/guest/ordering/components/OrderCart.tsx`
  - `src/features/guest/ordering/hooks/useGuestOrderingController.ts`
  - `src/features/pos/ui/Button.tsx`
  - `src/features/pos/ui/Input.tsx`
  - `src/features/pos/ui/Select.tsx`
  - `src/layouts/guest/GuestOrderingLayout.tsx`
  - `src/layouts/pos/pos.css`
- Browser viewport evidence:
  - fixed widths: 320, 375, 390, 430, 768, 1024, 1280, 1366, 1440, and 1920;
  - intermediate/mobile landscape: 360, 667x375, 744x420, 820, 900, 1152, and
    1600;
  - every final width reported document `scrollWidth === clientWidth`, exactly
    one `h1`, and no visible interactive target below 44x44;
  - the short-landscape menu scroller increased from roughly 50px to 126px;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- States and interactions rechecked:
  - populated, loading, empty, API-error redirect, published/open and
    unpublished/closed restaurants;
  - category selection, debounced server search, add/increment/remove, item and
    order notes, order type/table/customer fields, cart clear/cancel, and create
    order;
  - app order payload and QR fixed-table payload, including `source`, order type,
    table ID, customer data, notes, quantities, and item notes;
  - valid QR loading/fixed controls and invalid QR error redirect;
  - header notification/account menus, Escape close, focus trap/restore, keyboard
    cycling, 200% CSS zoom reflow, and `prefers-reduced-motion: reduce` with zero
    running animations.
- Page gate after changes:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass (Vite 7.3.1, 4,201 modules);
  - clean fixture-backed browser session: zero console errors/warnings and only
    200 application responses.
- Blocked coverage:
  - no `.env`, reachable backend, production table QR, or live order endpoint is
    available; live menu/table/order behavior remains blocked;
  - browser-only fixtures were used for visual/state verification and payload
    capture, so no claim is made about live persistence or backend-side effects.

## Completed page report: `/`

- Issues reproduced:
  - the header exposed only the logo below 1024px, leaving no mobile navigation;
  - the desktop “Tính năng” control claimed a collapsed menu but had no action or
    corresponding content;
  - header/footer dark-mode logos used an empty `data:` source;
  - CTA, newsletter, theme, footer, social, and testimonial controls measured
    24–40px;
  - theme controls were static, newsletter submit threw a deliberate runtime
    error, and hash targets landed behind the sticky header;
  - the page had no skip link, and testimonial smooth scrolling did not honor
    reduced motion.
- Fixes:
  - added a Radix dropdown mobile menu with feature, pricing, login, and trial
    paths; replaced the nonfunctional desktop trigger with a real anchor;
  - restored the real brand image in both themes and made header/footer logos
    named home links;
  - raised all interactive targets to at least 44x44, added a keyboard skip link,
    main focus target, sticky-header scroll margins, and accessible social names;
  - connected footer theme controls to the existing ThemeProvider with pressed
    state and storage, prevented the placeholder newsletter from crashing, and
    respected reduced-motion in the testimonial scroller.
- Browser evidence:
  - fixed widths 320, 375, 390, 430, 768, 1024, 1280, 1366, 1440, and 1920;
  - intermediate/landscape widths 360, 640 (200%-zoom equivalent reflow),
    667x375, 744x420, 820, 900, 1152, and 1600;
  - all widths had `scrollWidth === clientWidth`, one `h1`, and no visible
    control below 44x44;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- Interactions rechecked:
  - skip-link focus/activation, mobile menu focus/Escape/return, anchor offset,
    desktop navigation, guest and stored-token trial destinations;
  - light/dark/system selection, newsletter keyboard submit without navigation
    or console failure, testimonial next/previous, and reduced-motion auto scroll
    with zero running animations.
- Page gate:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass (Vite 7.3.1, 4,202 modules);
  - browser console: zero errors/warnings; no application network requests.

## Completed page report: authentication routes

- Routes covered:
  - `/auth` and `/auth/login`;
  - `/auth/register` and `/auth/verify-email`;
  - `/auth/2fa`;
  - `/auth/forgot-password`, `/auth/reset-password/verify`, and
    `/auth/reset-password`;
  - `/oauth/callback`, including loading, provider-error feedback, and redirect handling.
- Issues reproduced:
  - shared inputs, tabs, icon controls, resend actions, and OTP slots were below
    the 44px target, while six 48px OTP cells overflowed the 320px card;
  - password reveal buttons overlapped their fields after target enlargement and
    intercepted pointer input inconsistently;
  - active auth steps used secondary headings, direct routes could lack one
    logical page heading, and password steps were not semantic forms;
  - the phone OTP-method modal was a manual overlay without dialog naming,
    focus trapping/restoration, Escape/outside handling, or reduced-motion
    behavior;
  - auth padding did not account for safe areas, the card was too padded at
    320px, and Framer transitions ignored reduced-motion preferences;
  - social controls lacked specific accessible names, Google navigation could
    target an undefined API URL, and password-manager semantics were incomplete.
- Fixes:
  - raised shared shadcn button/input/tab/input-group/OTP target sizes to 44px,
    expanded the checkbox's effective hit area, and tightened the 320px card
    padding without changing the visual system;
  - rebuilt password fields with the existing InputGroup composition so the
    reveal controls remain separate, named 44px targets;
  - gave every active step one `h1`, converted credential/registration/reset
    steps to forms with keyboard submit, and added hidden username context for
    password managers;
  - rebuilt OTP-method selection with the existing Radix Dialog primitive,
    including title/description, focus trap/return, Escape/outside close, and
    protected loading behavior;
  - added safe-area-aware auth layout padding and disabled Framer/CSS motion when
    reduced motion is requested;
  - preserved routes, auth store behavior, service calls, countdowns, redirects,
    and all login/register/2FA/reset payload contracts; missing OAuth
    configuration now produces a clear toast instead of an invalid navigation.
- Browser viewport evidence:
  - 136 route/viewport combinations across 320, 360, 375, 390, 430, 640,
    667x375, 744x420, 768, 900, 1024, 1152, 1280, 1366, 1440, 1600, and 1920;
  - every check reported no horizontal overflow, exactly one `h1`, and no
    visible interactive target below 44x44;
  - 200% CSS zoom reflowed vertically with no horizontal scrolling.
- States and interactions rechecked:
  - empty validation, email/phone recognition, password reveal, remember-me,
    login success, 2FA OTP send/verify, Google/Apple unavailable feedback;
  - email registration, create-account and verification redirects, phone
    OTP-method dialog, dialog keyboard/focus behavior, forgot-password OTP,
    password reset, completion, and return to login;
  - logical keyboard order, reduced-motion tab/dialog transitions with zero
    running animations, and a clean fixture-backed browser session containing
    only Vite's development React DevTools information message.
- Request contracts captured unchanged:
  - login and remember-me, 2FA temp token/OTP, check-email, register full name,
    verify email OTP, forgot-password session token, reset verification grant,
    and final reset password fields.
- Page gate:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass (Vite 7.3.1, 4,202 modules).
- Blocked coverage:
  - no `.env`, reachable auth backend, OAuth client, or live account is
    configured; backend persistence and third-party OAuth remain blocked;
  - browser-only request fixtures were used to verify UI states and exact client
    payloads, without changing application services or source data paths.

## Completed page report: settings and restaurant management

- Routes covered:
  - `/settings/account/profile`;
  - `/settings/account/notifications`;
  - `/settings/account/security`;
  - `/settings/manage/restaurants`.
- Issues reproduced:
  - the shared header, account trigger, sidebar links, selects, switches, date
    controls, and restaurant actions exposed 20–40px targets;
  - the five-item settings sidebar consumed most of a phone viewport and hid
    destinations in an unlabelled horizontal overflow region;
  - profile email/phone fields emitted controlled-field console errors, an icon
    copy action was unnamed, and several preference controls lacked names;
  - notification/security rows and long session data could not reflow safely at
    320px; password forms lacked autocomplete/username context;
  - restaurant headers/actions compressed long names into unusable columns,
    metadata was irreversibly truncated, skeleton motion ignored reduced motion,
    and share-dialog focus did not reliably return to its external trigger.
- Fixes:
  - raised shared select/items, settings header controls, account-menu items, and
    effective switch targets to at least 44px; added safe-area padding, a working
    skip link, explicit focus styles, and reduced-motion behavior;
  - reshaped mobile navigation into visible three- and two-column icon grids
    while retaining the desktop sticky sidebar;
  - made immutable profile fields explicitly read-only, named copy/select/switch
    controls, added responsive card rows, password-manager semantics, form
    submit behavior, and readable long session/audit data;
  - stacked notification/security actions on phones and preserved all save,
    2FA, password, and revoke service calls;
  - allowed restaurant identity/contact/slug content to wrap, stacked mobile
    card actions, labelled loading/error output, removed debug logging, and added
    explicit share-dialog focus restoration and reduced-motion sliding.
- Browser evidence:
  - 68 route/viewport checks at 320, 360, 375, 390, 430, 640, 667x375,
    744x420, 768, 900, 1024, 1152, 1280, 1366, 1440, 1600, and 1920;
  - all checks reported `scrollWidth === clientWidth`, one `h1`, and no visible
    interactive target under 44px; 200% CSS zoom reflowed vertically with no
    horizontal scroll;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- States and interactions rechecked:
  - populated profile and preferences, profile/preference request payloads,
    notification toggle/save, dark theme, notification feedback, date and select
    popovers, skip-link focus;
  - sessions loading/populated/revocation, password change, 2FA enable, long
    IPv6/device values, and exact security request payloads;
  - restaurant populated, long-content, loading, empty, and API-error states;
    share public/POS tabs, Escape, focus trap/return, and 320px dialog reflow.
- Page gate:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass at the combined final gate; Vite retained the Dashboard
    chunk-size advisory.
- Blocked coverage:
  - no reachable user/security/restaurant backend or live authenticated account
    is configured, so persistence and server authorization remain blocked;
  - browser-only fixtures captured exact requests without replacing source
    services or changing API paths.

## Completed page report: `/restaurants/new`

- Issues reproduced:
  - the page had no `h1`; price choices were 32px, day switches/time fields were
    unnamed, and form/preview motion ignored reduced motion;
  - the fixed two-row phone footer could cover the final operating-hours card;
  - the preview trigger appeared enabled on an untouched form because default
    operating hours counted as user progress;
  - the preview remained stacked in short mobile landscape, clamped restaurant
    and description content, and did not explicitly restore focus to its
    external trigger;
  - user-facing validation, slug, upload, and geolocation strings in four hooks
    were stored as mojibake.
- Fixes:
  - established one `h1`, 44px price controls, named switches/open-close fields,
    screen-reader slug status, live validation messages, explicit transition
    properties, and reduced-motion fallbacks;
  - added safe-area/skip-link support and enough mobile bottom clearance for the
    fixed footer; preview now stays disabled until the user actually begins a
    non-default required field;
  - switched the preview to two columns from 640px upward, preserved stacked
    phone panels, removed destructive text clamps, and added dialog focus return;
  - restored all affected Vietnamese strings without changing validation,
    upload, geolocation, or API behavior.
- Browser evidence:
  - 17 page checks at 320, 360, 375, 390, 430, 640, 667x375, 744x420, 768,
    900, 1024, 1152, 1280, 1366, 1440, 1600, and 1920;
  - 8 populated preview-dialog checks at 320, 375, 667x375, 744x420, 768,
    1024, 1440, and 1920;
  - all page/dialog checks had no horizontal overflow or undersized visible
    control, the final card cleared the fixed footer, and 200% zoom reflowed
    without horizontal scrolling;
  - temporary screenshots were visually inspected during the audit and removed
    during final cleanup; no generated browser evidence is retained in the repository.
- States and interactions rechecked:
  - untouched/started form, available and taken slug, city/district cascading
    selects, price selection, long text, coordinates/contact, closed-day time
    disabling, incomplete validation, cancel/back behavior;
  - preview focus trap/Escape/return, full un-clamped content, short landscape,
    reduced motion with zero running animations, valid creation, success redirect,
    and the exact create-restaurant payload including operating hours.
- Page gate:
  - `npm run typecheck`: pass;
  - `npm run lint`: pass;
  - `npm run build`: pass at the combined final gate; Vite retained the Dashboard
    chunk-size advisory.
- Blocked coverage:
  - live geolocation hardware/permission variants, upload storage, slug service,
    and restaurant persistence require external services not configured here;
  - browser-only request fixtures were used, while production source continues
    to call the original restaurant/upload services.

## Completed page report: Dashboard

- Scope covered:
  - `/dashboard/:id` shell and the Overview, Pipeline, Deals, Customers, Team,
    Forecasting, Reports, and Settings sections;
  - Settings profile, status, integrations, and security states.
- Issues reproduced:
  - the fixed desktop sidebar and header left no usable phone navigation and
    compressed long restaurant and section names;
  - cards, tables, filters, chart legends, and settings rows overflowed or
    truncated content at narrow and intermediate widths;
  - navigation, header, tab, filter, and form controls were below the 44px
    target or lacked complete accessible state;
  - skip navigation, mobile-menu focus restoration, safe-area spacing, and
    reduced-motion behavior were incomplete;
  - the Recharts responsive wrapper caused a maximum-update-depth runtime error;
  - several presentation-only actions appeared enabled without a handler.
- Fixes:
  - added a named Radix mobile navigation dialog with focus trap, Escape close,
    focus return, active-state semantics, and safe-area-aware sizing while
    retaining the collapsible desktop sidebar;
  - added a working skip link, one logical section heading, wrapping/min-width
    containment, responsive card/table layouts, and 44px controls;
  - made settings tabs keyboard navigable, labelled switches and progress
    indicators, preserved destructive confirmation protection, and added
    explicit loading/error/forbidden handling;
  - made chart containers responsive without the recursive wrapper, supplied
    accessible chart summaries, and disabled chart/CSS animation under reduced
    motion;
  - implemented customer search and tier filters, and explicitly disabled
    unavailable forecasting, integration, account, and customer actions;
  - preserved section state, restaurant APIs, status-update endpoints, theme,
    routing, and existing local presentation content.
- Browser evidence:
  - 112 section/viewport checks: eight primary sections across 320, 360, 375,
    390, 430, 667x375, 768, 900, 1024, 1180, 1280, 1366, 1440, and 1920;
  - every check reported no document/main horizontal overflow, exactly one `h1`,
    and no undersized visible mobile/tablet control;
  - the 640px effective viewport verified 1280px-at-200% reflow;
  - reduced-motion inspection found no animation or transition violation;
  - the mobile menu, desktop sidebar, settings arrow-key tabs, publish/online
    switches, theme, notifications, and destructive confirmation phrase were
    rechecked.
- Request and runtime evidence:
  - publish and online-order switches retained their exact PATCH endpoints;
  - populated, loading, error, and forbidden states were exercised with
    browser-only fixtures;
  - fixture-backed runs produced no console errors, warnings, or failed
    application requests.
- Blocked coverage:
  - no reachable authenticated backend or authorized restaurant account is
    configured, so live authorization, persistence, and server-side effects
    remain blocked.

## Completed page report: POS routes

- Routes covered:
  - `/pos/:slug`, `/tables`, `/orders`, `/menu`, `/staff`, `/payments`, and
    `/payments/:orderId`;
  - `/pos`, invalid POS suffix redirect, `/not-found`, and unmatched route
    fallback behavior.
- Issues reproduced:
  - the desktop-first shell, sidebar, headers, dense tables, filters, cart, and
    payment panels overflowed or became unusable on phones and short landscape;
  - many controls were below 44px, mobile navigation/cart behavior lacked robust
    focus entry and restoration, and dialogs could exceed the viewport;
  - loading requests could render blank content, while empty and error states
    were inconsistent across sections;
  - order filters could race, table controls exposed non-real options,
    destructive actions lacked reliable confirmation/focus return, and rapid
    payment/delete activation could duplicate requests;
  - menu, category, staff, table, cart, QR, and confirmation overlays did not all
    provide consistent Radix focus and Escape behavior;
  - global-search and quick-invoice controls were enabled but inert, while
    desktop order-detail actions were unnamed and smaller than 44px.
- Fixes:
  - added responsive POS shell/header/sidebar behavior, named Radix mobile
    navigation, safe-area spacing, 44px controls, narrow card layouts, local
    scrolling, and explicit reduced-motion transitions;
  - rebuilt the mobile cart and management/QR overlays with focus
    trap/entry/return, Escape handling, accessible names, and viewport-bounded
    content;
  - added semantic loading, empty, error, disabled, and processing states for
    sales, tables, orders, menu, staff, and payments;
  - fixed order request races, retained real table identifiers/options,
    protected destructive actions with confirmation, and guarded duplicate
    delete/cash-payment requests;
  - made order and staff tables properly named regions with captions and column
    scopes, and explicitly disabled unavailable global-search/quick-invoice
    actions;
  - preserved original routes, services, API payloads, state management, menu
    and table behavior, and the existing shadcn/Radix Nova visual system.
- Browser evidence:
  - 84 populated route/viewport checks: six main POS views across 320, 360, 375,
    390, 430, 667x375, 768, 900, 1024, 1180, 1280, 1366, 1440, and 1920;
  - every populated check reported no horizontal overflow, no unresolved loading
    output, and no visible interactive target below 44x44;
  - mobile navigation/cart and restaurant-QR focus entry/Escape/return, order
    expansion, order creation, keyboard table movement, add-table flow, table
    deletion confirmation, occupied-table delete disabling, menu/category
    dialogs, staff form/details dialogs, and cash-payment success were rechecked;
  - loading, empty, and API-error states were separately verified for all six
    data-driven sections;
  - `/not-found` and unmatched routes had zero overflow at 320 and 1920, `/pos`
    rejected back to `/`, and an invalid POS suffix redirected to the main view;
  - 640px effective reflow under `prefers-reduced-motion: reduce` had zero
    horizontal overflow and zero running animations.
- Request and interaction evidence:
  - original init, available-table, category/item, table, order, menu-admin,
    staff, order-detail, order-create, and cash-payment endpoints were observed;
  - order creation issued one POST with unchanged `order_type`, `source`,
    `table_id`, and item `menu_item_id`/`quantity` fields, then rendered success;
  - keyboard dragging moved a table from `(90,60)` to `(115,85)`;
  - double activation generated exactly one cash-payment request;
  - cancellation generated no delete request, confirmed table deletion generated
    exactly one request, and focus returned to the invoking control;
  - only cash is currently enabled by the existing payment route; card and wallet
    methods remain visibly disabled and are not claimed as live.
- Blocked coverage:
  - no reachable authenticated POS backend, staff session, real restaurant slug,
    or payment processor is configured, so live persistence and authorization
    remain blocked;
  - populated browser data came only from temporary request fixtures; production
    source remains connected to the original services.

## Final regression and cleanup

- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm run build`: pass; Vite 7.3.1 transformed 4,202 modules and reports the
  Dashboard chunk-size advisory at 503.74 kB after minification.
- Browser-only request fixtures, scripts, screenshots, and Playwright session
  artifacts were removed after verification.
- The temporary POS source mock was deleted, its import was removed, and POS init
  again uses the original `fetchPosInit` service.
- Live backend, OAuth, email/OTP, upload, geolocation, authorized restaurant/POS
  sessions, and payment persistence remain externally blocked and are not
  claimed as passed.
