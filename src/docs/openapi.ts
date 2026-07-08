const openapiSpec = {
  openapi: "3.0.0",
  info: {
    title: "FixItNow API",
    version: "1.0.0",
    description: "Your Trusted Home Service Platform - Backend API",
  },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
  security: [{ cookieAuth: [] }],
  tags: [
    { name: "Auth" },
    { name: "Categories" },
    { name: "Services & Technicians" },
    { name: "Bookings" },
    { name: "Payments" },
    { name: "Technician Management" },
    { name: "Reviews" },
    { name: "Admin" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user (customer/technician)",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password", "role"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  role: { type: "string", enum: ["CUSTOMER", "TECHNICIAN"] },
                },
              },
              examples: {
                customer: {
                  summary: "Register as Customer",
                  value: {
                    name: "Test Customer",
                    email: "testcustomer@gmail.com",
                    password: "Customer@123",
                    role: "CUSTOMER",
                  },
                },
                technician: {
                  summary: "Register as Technician",
                  value: {
                    name: "Test Technician",
                    email: "testtechnician@gmail.com",
                    password: "Tech@123456",
                    role: "TECHNICIAN",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created successfully" },
          "400": { description: "Validation error" },
          "409": { description: "Email already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user, return JWT",
        security: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
              examples: {
                customer: {
                  summary: "Login as Customer (Sarah)",
                  value: {
                    email: "sarah.customer@gmail.com",
                    password: "Customer@123456",
                  },
                },
                technician: {
                  summary: "Login as Technician (John)",
                  value: {
                    email: "john.technician@gmail.com",
                    password: "Tech@123456",
                  },
                },
                admin: {
                  summary: "Login as Admin",
                  value: {
                    email: "admin@gmail.com",
                    password: "Admin@123456",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description:
              "Login successful, sets accessToken/refreshToken cookies",
          },
          "400": { description: "Invalid credentials" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Get a new access token using the refresh token cookie",
        responses: { "200": { description: "Token refreshed" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        responses: { "200": { description: "Current user profile" } },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all service categories",
        security: [],
        responses: { "200": { description: "List of categories" } },
      },
    },
    "/services": {
      get: {
        tags: ["Services & Technicians"],
        summary: "Get all services with filters",
        security: [],
        parameters: [
          {
            name: "categoryId",
            in: "query",
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_CATEGORY_ID",
          },
          {
            name: "location",
            in: "query",
            schema: { type: "string" },
            example: "Dhaka",
          },
          {
            name: "minPrice",
            in: "query",
            schema: { type: "number" },
            example: 20,
          },
          {
            name: "maxPrice",
            in: "query",
            schema: { type: "number" },
            example: 100,
          },
          {
            name: "minRating",
            in: "query",
            schema: { type: "number" },
            example: 0,
          },
        ],
        responses: { "200": { description: "List of services" } },
      },
    },
    "/technicians": {
      get: {
        tags: ["Services & Technicians"],
        summary: "Get all technicians with filters",
        security: [],
        parameters: [
          {
            name: "location",
            in: "query",
            schema: { type: "string" },
            example: "Dhaka",
          },
          {
            name: "minRating",
            in: "query",
            schema: { type: "number" },
            example: 4,
          },
          {
            name: "isAvailable",
            in: "query",
            schema: { type: "boolean" },
            example: true,
          },
          {
            name: "categoryId",
            in: "query",
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_CATEGORY_ID",
          },
        ],
        responses: { "200": { description: "List of technicians" } },
      },
    },
    "/technicians/{id}": {
      get: {
        tags: ["Services & Technicians"],
        summary: "Get technician profile with reviews",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_TECHNICIAN_PROFILE_ID",
          },
        ],
        responses: { "200": { description: "Technician profile" } },
      },
    },
    "/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create new booking (customer)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["serviceId", "scheduleTime", "address"],
                properties: {
                  serviceId: { type: "string" },
                  scheduleTime: { type: "string", format: "date-time" },
                  address: { type: "string" },
                },
              },
              example: {
                serviceId: "REPLACE_WITH_REAL_SERVICE_ID",
                scheduleTime: "2026-08-01T10:00:00.000Z",
                address: "House 12, Road 5, Dhanmondi, Dhaka",
              },
            },
          },
        },
        responses: {
          "201": { description: "Booking created" },
          "400": { description: "Validation error" },
        },
      },
      get: {
        tags: ["Bookings"],
        summary: "Get user's bookings",
        responses: { "200": { description: "List of bookings" } },
      },
    },
    "/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get booking details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_BOOKING_ID",
          },
        ],
        responses: { "200": { description: "Booking details" } },
      },
    },
    "/bookings/{id}/cancel": {
      patch: {
        tags: ["Bookings"],
        summary: "Cancel a booking (customer)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_BOOKING_ID",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { cancelReason: { type: "string" } },
              },
              example: { cancelReason: "Changed my mind" },
            },
          },
        },
        responses: { "200": { description: "Booking cancelled" } },
      },
    },
    "/payments/create": {
      post: {
        tags: ["Payments"],
        summary: "Create a Stripe payment session for an accepted booking",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["bookingId"],
                properties: { bookingId: { type: "string" } },
              },
              example: { bookingId: "REPLACE_WITH_REAL_BOOKING_ID" },
            },
          },
        },
        responses: { "201": { description: "Payment session created" } },
      },
    },
    "/payments/confirm": {
      post: {
        tags: ["Payments"],
        summary: "Confirm/verify a Stripe payment session",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["sessionId"],
                properties: { sessionId: { type: "string" } },
              },
              example: { sessionId: "REPLACE_WITH_STRIPE_SESSION_ID" },
            },
          },
        },
        responses: { "200": { description: "Payment confirmed" } },
      },
    },
    "/payments": {
      get: {
        tags: ["Payments"],
        summary: "Get user's payment history",
        responses: { "200": { description: "List of payments" } },
      },
    },
    "/payments/{id}": {
      get: {
        tags: ["Payments"],
        summary: "Get payment details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_PAYMENT_ID",
          },
        ],
        responses: { "200": { description: "Payment details" } },
      },
    },
    "/technicians/services": {
      post: {
        tags: ["Technician Management"],
        summary: "Create a new service (technician only)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["categoryId", "title", "price"],
                properties: {
                  categoryId: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                },
              },
              example: {
                categoryId: "REPLACE_WITH_REAL_CATEGORY_ID",
                title: "AC Repair",
                description: "Air conditioner servicing and repair",
                price: 55,
              },
            },
          },
        },
        responses: { "201": { description: "Service created" } },
      },
    },
    "/technician/profile": {
      put: {
        tags: ["Technician Management"],
        summary: "Update technician profile",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bio: { type: "string" },
                  experience: { type: "number" },
                  location: { type: "string" },
                  hourlyRate: { type: "number" },
                  isAvailable: { type: "boolean" },
                },
              },
              example: {
                bio: "Updated bio",
                experience: 9,
                location: "Dhaka",
                hourlyRate: 18,
                isAvailable: true,
              },
            },
          },
        },
        responses: { "200": { description: "Profile updated" } },
      },
    },
    "/technician/availability": {
      put: {
        tags: ["Technician Management"],
        summary: "Update availability slots",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  slots: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                      },
                    },
                  },
                },
              },
              example: {
                slots: [
                  { day: "SATURDAY", startTime: "09:00", endTime: "17:00" },
                  { day: "SUNDAY", startTime: "09:00", endTime: "17:00" },
                ],
              },
            },
          },
        },
        responses: { "200": { description: "Availability updated" } },
      },
    },
    "/technician/bookings": {
      get: {
        tags: ["Technician Management"],
        summary: "Get technician's bookings",
        responses: { "200": { description: "List of bookings" } },
      },
    },
    "/technician/bookings/{id}": {
      patch: {
        tags: ["Technician Management"],
        summary: "Update booking status (accept/decline/complete)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_BOOKING_ID",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"],
                  },
                },
              },
              examples: {
                accept: {
                  summary: "Accept booking",
                  value: { status: "ACCEPTED" },
                },
                decline: {
                  summary: "Decline booking",
                  value: { status: "DECLINED" },
                },
                inProgress: {
                  summary: "Mark as in progress",
                  value: { status: "IN_PROGRESS" },
                },
                complete: {
                  summary: "Mark as completed",
                  value: { status: "COMPLETED" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Booking status updated" } },
      },
    },
    "/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create review (after job completion)",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["bookingId", "rating"],
                properties: {
                  bookingId: { type: "string" },
                  rating: { type: "number", minimum: 1, maximum: 5 },
                  comment: { type: "string" },
                },
              },
              example: {
                bookingId: "REPLACE_WITH_COMPLETED_BOOKING_ID",
                rating: 5,
                comment: "Excellent work, very professional!",
              },
            },
          },
        },
        responses: { "201": { description: "Review created" } },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",
        responses: { "200": { description: "List of users" } },
      },
    },
    "/admin/users/{id}": {
      patch: {
        tags: ["Admin"],
        summary: "Update user status (ban/unban)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "REPLACE_WITH_REAL_USER_ID",
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", enum: ["ACTIVE", "BLOCKED"] },
                },
              },
              examples: {
                ban: { summary: "Ban user", value: { status: "BLOCKED" } },
                unban: { summary: "Unban user", value: { status: "ACTIVE" } },
              },
            },
          },
        },
        responses: { "200": { description: "User status updated" } },
      },
    },
    "/admin/bookings": {
      get: {
        tags: ["Admin"],
        summary: "Get all bookings",
        responses: { "200": { description: "List of bookings" } },
      },
    },
    "/admin/categories": {
      get: {
        tags: ["Admin"],
        summary: "Get all categories",
        responses: { "200": { description: "List of categories" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Create new service category",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  description: { type: "string" },
                  isActive: { type: "boolean" },
                },
              },
              example: {
                name: "Carpentry",
                slug: "carpentry",
                description: "Furniture and woodwork repairs",
                isActive: true,
              },
            },
          },
        },
        responses: { "201": { description: "Category created" } },
      },
    },
  },
};

export default openapiSpec;
