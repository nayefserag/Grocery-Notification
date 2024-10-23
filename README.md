## Part Of Grocery Microservices App

# Notification Service

This service is responsible for sending email notifications as part of a microservices-based architecture. It listens for events (such as email verification, password resets, order confirmations) via RabbitMQ queues and communicates with other services through HTTP calls and RabbitMQ.

## Key Features

- **Email Notifications**: Sends emails for user-related events like password reset, registration confirmation, and more.
- **RabbitMQ Integration**: Consumes messages from RabbitMQ queues for event-driven email sending.
- **Inter-Service Communication**: This service communicates with other microservices via:
  1. **RabbitMQ** for asynchronous message exchange.
  2. **HTTP calls** for synchronous requests and responses between services.
- **Template-Based Emails**: Utilizes HTML templates for emails, making the content customizable and dynamic.
- **Microservice Architecture**: The service is independently scalable and interacts with other services in the ecosystem.
- **Logging and Error Tracking**: Uses **Winston** for structured logging and **Sentry** for tracking errors in production environments.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [File Structure](#file-structure)
3. [Message Queue Integration](#message-queue-integration)
4. [HTTP Communication](#http-communication)
5. [Email Templates](#email-templates)
6. [Running the Service](#running-the-service)
7. [Endpoints](#endpoints)
8. [Development](#development)

---

### Technologies Used

- **NestJS**: Framework for building efficient, scalable server-side applications.
- **RabbitMQ**: For message queueing and asynchronous event handling.
- **Nodemailer**: A popular module for sending emails.
- **MySQL**: Database for storing user-related information.
- **TypeORM**: ORM for database operations.
- **TypeScript**: For static typing and better developer experience.
- **Winston**: A logging library for structured logs.
- **Sentry**: Error tracking to monitor the service's health.

### File Structure

```plaintext
src/
├── app/
│   ├── api/
│   │   ├── user-emails/                 # Controller for handling user-related email requests
│   ├── application/
│   │   ├── user-emails/
│   │   │   ├── model/                   # DTOs for user email actions
│   │   │   ├── services/                # Business logic for email sending
│   ├── rabbitMQ/                        # RabbitMQ consumers and connectors
│   ├── shared/
│   │   ├── mailer/                      # Nodemailer configuration and email templates
├── config/                              # Environment-specific configurations
├── templates/                           # HTML templates for email notifications
├── main.ts                              # Application entry point
```

### Message Queue Integration

The service uses **RabbitMQ** to consume messages from different queues and process the events accordingly. It listens to queues such as:

- `EMAIL_VERIFICATION_QUEUE`: Handles sending email verification messages.
- `ORDER_QUEUE`: Handles order-related notifications.

When a message is received on these queues, the service processes it and sends an email through **Nodemailer** based on the type of event.

#### RabbitMQ Consumers
The consumers for the RabbitMQ queues are defined in `src/app/rabbitMQ/consumers/`. Each consumer listens to a specific queue and delegates email-sending tasks to the service.

### HTTP Communication

In addition to RabbitMQ, this service can also communicate with other services through **HTTP calls**. This synchronous communication is useful for scenarios that require immediate confirmation or response between services.

For example:
- Triggering specific actions in another service after sending an email.
- Requesting information from another service to customize the email content.

This dual communication strategy provides flexibility, allowing both asynchronous and synchronous inter-service interactions.

### Email Templates

The email content is dynamically generated using pre-defined HTML templates stored in `src/templates/`. These templates are used for:

- Registration confirmation.
- Password reset requests.
- Order confirmation, etc.

Example template files:

- `complete-registration.template.html`: Used for registration confirmation emails.
- `forgot-password.template.html`: Used for password reset emails.
- `order-created.template.html`: Used for notifying users about order creation.

### Running the Service

#### Prerequisites

- **Node.js**
- **RabbitMQ**
- **MySQL**
- **Docker** (optional)

#### Steps:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Set up environment variables (e.g., `.env`):
    ```plaintext
    DATABASE_URL=mysql://user:password@localhost:3306/notification_service
    RABBITMQ_URL=amqp://localhost
    EMAIL_VERIFICATION_QUEUE=email_verification_queue
    ORDER_QUEUE=order_queue
    SMTP_HOST=smtp.yourprovider.com
    SMTP_PORT=587
    SMTP_USER=your_email@example.com
    SMTP_PASS=your_password
    ```

3. Run the service:
    ```bash
    npm start
    ```

4. To run the service in development mode with file watching:
    ```bash
    npm run start:dev
    ```

### Endpoints

The service provides a REST API to send different types of emails:

#### User Emails:

- **POST** `/user-emails/send-email`
    - Sends an email based on the type (`forgotPassword` or `completeRegistration`).
    - **Body Parameters:**
      - `emailType`: The type of email to send (`forgotPassword` or `completeRegistration`).
      - `dto`: The DTO containing user details and email content.

### Development

- **Testing**: Unit tests and e2e tests are written using Jest.
    ```bash
    npm run test
    ```

- **Linting**: Ensure code quality with ESLint.
    ```bash
    npm run lint
    ```

- **Docker**: If you are using Docker for local development, you can create a `Dockerfile` and build the service as a Docker image.

    ```bash
    docker build -t notification-service .
    ```

---
