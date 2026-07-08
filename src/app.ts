import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import { categoryRoutes } from "./modules/categories/category.routes";
import { technicianRoutes } from "./modules/technicians/technician.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { reviewRoutes } from "./modules/reviews/review.routes";
import openapiSpec from "./docs/openapi";

const app: Application = express();

app.use(cors({ origin: config.app_url, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Fix It Now Server Running");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("Fix It Now API is Running");
});

app.get("/api-docs.json", (req: Request, res: Response) => {
  res.json(openapiSpec);
});

app.get("/api-docs", (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>FixItNow API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: "/api-docs.json",
          dom_id: "#swagger-ui",
          presets: [SwaggerUIBundle.presets.apis],
          requestInterceptor: (req) => {
            req.credentials = "include";
            return req;
          },
        });
      };
    </script>
  </body>
</html>`);
});

app.get("/payment-success", (req: Request, res: Response) => {
  const { session_id } = req.query;
  res.send(`
    <h2>Payment completed</h2>
    <p>Copy this session ID into <code>POST /api/payments/confirm</code>:</p>
    <pre>${session_id}</pre>
  `);
});

app.get("/payment-cancel", (req: Request, res: Response) => {
  res.send("<h2>Payment was cancelled.</h2>");
});

app.use("/api", categoryRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", technicianRoutes);
app.use("/api", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
