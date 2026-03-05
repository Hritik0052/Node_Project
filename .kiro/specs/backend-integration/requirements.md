# Backend Integration - Requirements

## Feature Overview

Replace static frontend data files with a dynamic database-backed backend API that preserves all existing data structures and field names to ensure seamless integration with the existing Next.js frontend.

## Glossary

- **System**: The backend API server and database layer
- **Property**: Real estate listing entity with details like price, location, beds, baths
- **Agent**: Real estate agent entity with profile information
- **Agency**: Real estate agency entity with contact and branding information
- **Blog**: Blog post entity with content and metadata
- **Category**: Property category entity for classification
- **Location**: Geographic location entity with property counts
- **Project**: Real estate project entity with development details
- **Service**: Service offering entity with descriptions
- **Testimonial**: Customer testimonial entity with ratings
- **Gallery**: Image gallery item entity
- **HelpCenter**: Help center article entity
- **Job**: Job posting entity with employment details
- **Fact**: Statistical fact/counter entity for display
- **Prisma**: TypeScript ORM for type-safe database access
- **PostgreSQL**: Relational database management system

## Requirements

### Requirement 1

**User Story:** As a developer, I want to migrate static data files to a database, so that the application can support dynamic content management.

#### Acceptance Criteria

1. WHEN the backend starts, THE System SHALL connect to PostgreSQL database successfully
2. WHEN Prisma migrations run, THE System SHALL create all required database tables matching the frontend data structure
3. WHEN querying any entity, THE System SHALL return data with the same field names as the frontend static files
4. WHEN the database is empty, THE System SHALL provide seed data matching the original static files

### Requirement 2

**User Story:** As a frontend developer, I want RESTful API endpoints for all entities, so that I can fetch data dynamically instead of using static imports.

#### Acceptance Criteria

1. WHEN making a GET request to `/api/{entity}`, THE System SHALL return a list of all entities with pagination support
2. WHEN making a GET request to `/api/{entity}/:id`, THE System SHALL return a single entity or 404 if not found
3. WHEN making a POST request to `/api/{entity}` with valid data, THE System SHALL create a new entity and return it with a 201 status
4. WHEN making a PUT request to `/api/{entity}/:id` with valid data, THE System SHALL update the entity and return the updated version
5. WHEN making a DELETE request to `/api/{entity}/:id`, THE System SHALL delete the entity and return 204 status
6. WHEN making requests with invalid data, THE System SHALL return appropriate error messages with 400 status

### Requirement 3

**User Story:** As a content manager, I want to upload images for properties, agents, and other entities, so that I can manage media assets dynamically.

#### Acceptance Criteria

1. WHEN uploading a single image file, THE System SHALL store it in the appropriate directory and return the file URL
2. WHEN uploading multiple image files, THE System SHALL store all files and return an array of URLs
3. WHEN uploading a file larger than 5MB, THE System SHALL reject it with an appropriate error message
4. WHEN uploading a non-image file, THE System SHALL reject it with an appropriate error message
5. WHEN deleting an uploaded file, THE System SHALL remove it from storage and return success confirmation
6. WHEN storing images, THE System SHALL organize them by entity type (properties/, agents/, agencies/, blogs/, projects/, services/, testimonials/, gallery/, help-center/)
7. WHEN entities have multiple image fields, THE System SHALL support uploading to each field independently (imageSrc, bgImageSrc, logoSrc, avatarSrc, etc.)

### Requirement 4

**User Story:** As a developer, I want comprehensive data validation, so that only valid data is stored in the database.

#### Acceptance Criteria

1. WHEN creating or updating an entity with missing required fields, THE System SHALL return a validation error
2. WHEN creating or updating an entity with invalid field types, THE System SHALL return a validation error
3. WHEN creating or updating an entity with invalid email format, THE System SHALL return a validation error
4. WHEN creating or updating an entity with negative price values, THE System SHALL return a validation error
5. WHEN validation fails, THE System SHALL return detailed error messages indicating which fields are invalid

### Requirement 5

**User Story:** As a frontend developer, I want to filter and search entities, so that I can display relevant data to users.

#### Acceptance Criteria

1. WHEN querying properties with category filter, THE System SHALL return only properties matching that category
2. WHEN querying properties with price range, THE System SHALL return only properties within that range
3. WHEN querying properties with location filter, THE System SHALL return only properties in that location
4. WHEN querying blogs with tag filter, THE System SHALL return only blogs with that tag
5. WHEN querying agents with name search, THE System SHALL return agents whose names contain the search term
6. WHEN applying multiple filters, THE System SHALL return results matching all filter criteria

### Requirement 6

**User Story:** As a developer, I want proper error handling, so that the API provides meaningful feedback when operations fail.

#### Acceptance Criteria

1. WHEN a database connection fails, THE System SHALL return a 503 error with a descriptive message
2. WHEN a requested entity is not found, THE System SHALL return a 404 error with entity details
3. WHEN a validation error occurs, THE System SHALL return a 400 error with field-specific messages
4. WHEN an internal server error occurs, THE System SHALL return a 500 error and log the error details
5. WHEN an error response is sent, THE System SHALL include a consistent error format with status, message, and details

### Requirement 7

**User Story:** As a developer, I want pagination support for list endpoints, so that large datasets can be efficiently retrieved.

#### Acceptance Criteria

1. WHEN querying a list endpoint without pagination params, THE System SHALL return the first page with a default page size of 20
2. WHEN querying with page and limit parameters, THE System SHALL return the specified page with the specified number of items
3. WHEN pagination is applied, THE System SHALL include metadata with total count, current page, and total pages
4. WHEN requesting a page beyond the available data, THE System SHALL return an empty array with appropriate metadata

### Requirement 8

**User Story:** As a developer, I want the Prisma schema to preserve all frontend field names, so that frontend code requires minimal changes.

#### Acceptance Criteria

1. WHEN the Property model is defined, THE System SHALL include fields: id, imageSrc, title, location, beds, baths, sqft, price, long, lat, categories, cities, featured, forSale, category, agentAvatar, agentName, postingDate, expiryDate, rooms, views, imageWidth, imageHeight, garage, delay
2. WHEN the Agent model is defined, THE System SHALL include fields: id, imageSrc, image, name, description, role, delay, wowClass
3. WHEN the Agency model is defined, THE System SHALL include fields: id, bgImageSrc, logoSrc, name, location, listing, hotline, phone, email
4. WHEN the Blog model is defined, THE System SHALL include fields: id, imageSrc, imgSrc, tag, date, title, description, alt
5. WHEN the Category model is defined, THE System SHALL include fields: name, icon, isActive, title, listings
6. WHEN the Location model is defined, THE System SHALL include fields: id, imageSrc, alt, city, title, propertiesCount, properties, width, height
7. WHEN the Project model is defined, THE System SHALL include fields: id, imageSrc, width, height, type, title, location, bedrooms, bathrooms, sqft, price
8. WHEN the Service model is defined, THE System SHALL include fields: id, icon, imageSrc, title, description, delay, wowDelay
9. WHEN the Testimonial model is defined, THE System SHALL include fields: id, avatarSrc, avatar, description, name, role, location, rating, width, height
10. WHEN the Gallery model is defined, THE System SHALL include fields: id, src, alt, width, height
11. WHEN the HelpCenter model is defined, THE System SHALL include fields: id, imageSrc, title, description, delay
12. WHEN the Job model is defined, THE System SHALL include fields: title, department, location, salary, animation
13. WHEN the Fact model is defined, THE System SHALL include fields: id, value, suffix, text, class, icon, number, subText, label, hasSubNumber, subNumber, className, additionalText
14. WHEN any model is defined, THE System SHALL use the exact field names from the frontend without renaming or transformation
15. WHEN entities have multiple image field variations, THE System SHALL preserve all variations (imageSrc, imgSrc, image, avatarSrc, avatar, bgImageSrc, logoSrc, src)

### Requirement 9

**User Story:** As a system administrator, I want database migrations to be version controlled, so that schema changes can be tracked and rolled back if needed.

#### Acceptance Criteria

1. WHEN a schema change is made, THE System SHALL generate a new migration file with a timestamp
2. WHEN migrations are applied, THE System SHALL execute them in chronological order
3. WHEN a migration fails, THE System SHALL rollback the transaction and report the error
4. WHEN checking migration status, THE System SHALL show which migrations have been applied

### Requirement 10

**User Story:** As a developer, I want consistent API response formats, so that frontend code can reliably parse responses.

#### Acceptance Criteria

1. WHEN a successful GET request returns data, THE System SHALL return the format `{ success: true, data: [...] }`
2. WHEN a successful POST/PUT request returns data, THE System SHALL return the format `{ success: true, data: {...} }`
3. WHEN a successful DELETE request completes, THE System SHALL return the format `{ success: true, message: "..." }`
4. WHEN an error occurs, THE System SHALL return the format `{ success: false, error: { status: number, message: string, details?: any } }`
5. WHEN pagination is included, THE System SHALL include `{ success: true, data: [...], pagination: { total, page, limit, totalPages } }`

### Requirement 11

**User Story:** As a developer, I want to migrate existing static data to the database, so that the application starts with the same content as the static files.

#### Acceptance Criteria

1. WHEN running the seed command, THE System SHALL import all properties from properties.js into the database
2. WHEN running the seed command, THE System SHALL import all agents from agents.js into the database
3. WHEN running the seed command, THE System SHALL import all agencies from agency.js into the database
4. WHEN running the seed command, THE System SHALL import all blogs from blogs.js into the database
5. WHEN running the seed command, THE System SHALL import all categories from categories.js into the database
6. WHEN running the seed command, THE System SHALL import all locations from locations.js into the database
7. WHEN running the seed command, THE System SHALL import all projects from projects.js into the database
8. WHEN running the seed command, THE System SHALL import all services from services.js into the database
9. WHEN running the seed command, THE System SHALL import all testimonials from testimonials.js into the database
10. WHEN running the seed command, THE System SHALL import all gallery items from gallery.js into the database
11. WHEN running the seed command, THE System SHALL import all help center items from helpCenter.js into the database
12. WHEN running the seed command, THE System SHALL import all jobs from jobs.js into the database
13. WHEN running the seed command, THE System SHALL import all facts from facts.js into the database
14. WHEN seed data already exists, THE System SHALL skip duplicate entries based on unique identifiers
15. WHEN importing data, THE System SHALL preserve all field values exactly as they appear in the static files

### Requirement 12

**User Story:** As a frontend developer, I want API endpoints for all entity types, so that I can replace all static imports with dynamic API calls.

#### Acceptance Criteria

1. WHEN the API is deployed, THE System SHALL provide endpoints for properties at `/api/properties`
2. WHEN the API is deployed, THE System SHALL provide endpoints for agents at `/api/agents`
3. WHEN the API is deployed, THE System SHALL provide endpoints for agencies at `/api/agencies`
4. WHEN the API is deployed, THE System SHALL provide endpoints for blogs at `/api/blogs`
5. WHEN the API is deployed, THE System SHALL provide endpoints for categories at `/api/categories`
6. WHEN the API is deployed, THE System SHALL provide endpoints for locations at `/api/locations`
7. WHEN the API is deployed, THE System SHALL provide endpoints for projects at `/api/projects`
8. WHEN the API is deployed, THE System SHALL provide endpoints for services at `/api/services`
9. WHEN the API is deployed, THE System SHALL provide endpoints for testimonials at `/api/testimonials`
10. WHEN the API is deployed, THE System SHALL provide endpoints for gallery items at `/api/gallery`
11. WHEN the API is deployed, THE System SHALL provide endpoints for help center items at `/api/help-center`
12. WHEN the API is deployed, THE System SHALL provide endpoints for jobs at `/api/jobs`
13. WHEN the API is deployed, THE System SHALL provide endpoints for facts at `/api/facts`
14. WHEN querying any endpoint, THE System SHALL return responses in a format matching the structure of the original static data arrays

### Requirement 13

**User Story:** As a developer, I want the backend to use PostgreSQL with Prisma ORM, so that we have a robust, type-safe database layer.

#### Acceptance Criteria

1. WHEN the backend is configured, THE System SHALL use PostgreSQL as the database engine
2. WHEN the backend is configured, THE System SHALL use Prisma ORM for database access
3. WHEN Prisma Client is generated, THE System SHALL provide type-safe query methods for all models
4. WHEN database queries are executed, THE System SHALL use Prisma Client instead of raw SQL
5. WHEN the application starts, THE System SHALL verify the database connection using Prisma
6. WHEN environment variables are configured, THE System SHALL include DATABASE_URL for PostgreSQL connection
