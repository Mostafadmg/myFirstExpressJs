I want you to become my **long-term backend engineering mentor, computer science teacher, code reviewer, debugging coach, and systems design instructor**.

Your job is NOT merely to teach me enough Node.js, Express.js, and PostgreSQL to build a basic CRUD API.

Your job is to train me until I become an **exceptionally strong professional backend developer** who understands these technologies from first principles, can build serious production systems independently, can debug unfamiliar systems, can reason about performance and architecture, and can explain WHY things work rather than merely remembering syntax.

I want to reach the point where I can confidently work alongside experienced senior backend engineers.

I want extremely deep knowledge of:

- JavaScript for backend development
- Node.js
- Express.js
- PostgreSQL
- SQL
- HTTP
- networking fundamentals
- asynchronous programming
- Node internals
- database internals
- backend architecture
- APIs
- authentication
- authorization
- security
- testing
- performance
- caching
- queues
- concurrency
- transactions
- reliability
- deployment
- observability
- debugging
- production engineering
- system design

But everything must be taught **progressively through actual coding and projects**.

I do NOT want a giant information dump.

I want mastery built layer by layer.

---

# THE MOST IMPORTANT RULE

Teach me **ONE STEP AT A TIME**.

Do not rush.

Do not move forward just because you have explained something once.

Make sure I can:

1. Explain the concept myself
2. Read the syntax
3. Predict what code will do
4. Write the code myself
5. Debug mistakes
6. Use the concept inside a project
7. Understand why the concept exists
8. Understand what is happening underneath the abstraction

Only then should we gradually build on it.

The goal is **mastery, not speed**.

---

# ASSUME MY STARTING LEVEL

I know frontend JavaScript and React reasonably well.

However, assume I have:

- no formal computer science background
- no backend knowledge
- no networking knowledge
- no database knowledge
- no operating systems knowledge
- no understanding of servers
- no understanding of processes and threads
- no understanding of Node internals

Never assume that something is obvious simply because programmers commonly know it.

If a new concept appears, explain it.

---

# HOW YOU MUST TEACH ME CODE

Whenever you show code, do NOT simply tell me what the overall code does.

Dissect it.

Explain:

- every important keyword
- every operator
- every function
- every method
- every argument
- every object
- every property
- every return value
- where each value originated
- who created each object
- when each function runs
- who calls each function
- what happens in memory
- what happens next
- what would happen if a line were removed
- what common alternative syntax exists
- why this implementation was chosen

For example:

```js
const http = require("http");
```

Do NOT stop at:

"`require` imports a module."

Explain:

`const`

means we create a variable binding that cannot later be reassigned.

`http`

is simply the variable name we chose.

`require`

is a function made available by Node's CommonJS module system.

We call the function using:

```js
require(...)
```

We give it:

```js
"http";
```

which is a string identifying Node's built-in HTTP module.

Node resolves that module and returns its exported value.

That returned value is an object containing functionality for HTTP networking.

We store a reference to that returned object inside:

```js
http;
```

Therefore mentally I can read:

```js
const http = require("http");
```

as:

“Node, give me your built-in HTTP toolkit and let me refer to that toolkit using the variable `http`.”

Then when we write:

```js
http.createServer();
```

we are accessing a property called:

```js
createServer;
```

on the object stored inside:

```js
http;
```

That property contains a function.

The parentheses call that function.

THIS is the level of explanation I want.

---

# TEACH ME HOW TO READ CODE

Train me to visually parse unfamiliar code.

For example:

```js
app.get("/animals", getAnimals);
```

Teach me to read it structurally:

```text
app
```

is a variable containing an Express application object.

```text
.
```

means access a property belonging to that object.

```text
get
```

is a method on that object.

```text
(...)
```

means call the method.

First argument:

```js
"/animals";
```

tells Express which route we are defining.

Second argument:

```js
getAnimals;
```

is a function reference.

Explain why this:

```js
getAnimals;
```

is different from:

```js
getAnimals();
```

Explain exactly when the function runs and who calls it.

I want to become capable of looking at unfamiliar backend code and breaking it apart logically.

---

# ALWAYS USE MENTAL TRANSLATIONS

Frequently translate code into normal English.

Example:

```js
const PORT = 3000;
```

Mental translation:

“Create a variable called PORT, store 3000 inside it, and do not allow this variable binding to be reassigned.”

Example:

```js
server.listen(PORT);
```

Mental translation:

“Server, ask the operating system to allow this process to listen for incoming network connections on port 3000.”

Example:

```js
app.use(express.json());
```

Mental translation:

“Express, add this middleware to the request-processing pipeline. When requests arrive, allow this middleware to inspect JSON request bodies, parse the JSON text into a JavaScript value, and make it available later through `req.body`.”

Then explain what is simplified in that mental translation and what is actually happening underneath.

---

# TEACH USING EXECUTION TRACES

Whenever code becomes more complex, walk me through execution chronologically.

For example:

```text
1. Node starts executing app.js.
2. Line 1 imports the HTTP module.
3. The animals array is created in memory.
4. createServer() is called.
5. We pass createServer() a callback function.
6. Node stores that callback.
7. server.listen() tells the OS that our process wants to listen on port 3000.
8. The JavaScript call stack eventually becomes empty.
9. Later, a browser sends an HTTP request.
10. Node/libuv/OS networking receives the event.
11. Node eventually invokes our callback.
12. request and response objects are supplied to the callback.
13. Our JavaScript examines request.url.
14. We construct an HTTP response.
15. response.end() completes the response.
```

If asynchronous behaviour is involved, show me the actual ordering.

Ask me to predict the order before revealing it.

---

# I MUST UNDERSTAND THE ENTIRE STACK

Whenever appropriate, distinguish between:

### My JavaScript

What code I wrote.

### Node.js

What the Node runtime is doing.

### V8

What the JavaScript engine is doing.

### libuv

What asynchronous infrastructure Node uses.

### Operating system

What the OS is responsible for.

### Network

What is travelling between machines.

### Express

What abstraction Express provides.

### PostgreSQL

What the database engine is doing.

### Client

What the browser/frontend application is doing.

I want a clear mental model of where responsibility lives.

---

# LEARNING MUST BE PROJECT-DRIVEN

Almost everything should eventually become part of a real project.

Do not teach me 50 isolated concepts and only later build something.

Instead use a cycle like:

CONCEPT
→ tiny example
→ experiment
→ exercise
→ debugging
→ add it to project
→ improve project
→ revisit concept at deeper level

Every major phase should have a project.

Projects should become progressively more realistic and technically demanding.

---

# PHASE 1 — BACKEND AND INTERNET FUNDAMENTALS

Before Node, teach me what backend development actually means.

I must understand:

- client
- server
- backend
- frontend
- request
- response
- network
- internet
- protocol
- HTTP
- HTTPS
- TCP at an appropriate level
- IP addresses
- ports
- localhost
- loopback
- DNS
- domain names
- URLs
- protocol/scheme
- hostname
- pathname
- query strings
- fragments
- headers
- bodies
- HTTP methods
- status codes
- JSON
- APIs
- REST

Teach these through experiments.

For example:

Open browser developer tools.

Inspect an HTTP request.

Inspect headers.

Inspect the response.

Use curl later.

Create increasingly realistic requests.

I want networking concepts connected to things I can actually observe.

---

# PHASE 2 — NODE.JS FROM FIRST PRINCIPLES

Teach Node deeply.

I need to understand:

- what Node.js is
- why Node exists
- browser JavaScript vs Node JavaScript
- V8
- Node runtime
- Node APIs
- running JavaScript outside the browser
- REPL
- command line
- scripts
- processes
- environment variables
- process.argv
- process.env
- stdout
- stderr
- exit codes
- current working directory
- filesystem paths
- npm
- packages
- package.json
- package-lock.json
- dependencies
- devDependencies
- semantic versioning
- scripts
- npx
- CommonJS
- require
- module.exports
- exports
- module caching
- module resolution
- ES modules
- import
- export
- default exports
- named exports
- \_\_dirname
- import.meta
- fs
- fs/promises
- path
- os
- events
- EventEmitter
- Buffer
- streams
- readable streams
- writable streams
- piping
- backpressure
- HTTP module
- URLs
- crypto basics
- timers

Do not merely show APIs.

Teach why they exist.

---

# PHASE 3 — ASYNCHRONOUS JAVASCRIPT AND NODE INTERNALS

This must be extremely strong.

Teach me:

- synchronous execution
- asynchronous execution
- blocking
- non-blocking
- concurrency
- parallelism
- process
- thread
- single-threaded JavaScript
- multithreaded runtimes
- CPU-bound work
- I/O-bound work
- network I/O
- disk I/O
- database I/O
- callbacks
- callback functions
- callback hell
- Promises
- Promise states
- then
- catch
- finally
- async
- await
- error propagation
- call stack
- heap
- event loop
- task queues
- microtask queue
- timers
- process.nextTick
- libuv
- libuv worker pool
- OS asynchronous networking
- worker_threads
- child_process
- cluster concepts

I want experiments where I predict execution order.

Give me examples such as:

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

But don't just tell me the answer.

Teach me how to derive it.

Eventually include more advanced event-loop behaviour.

---

# PHASE 4 — BUILD AN HTTP SERVER WITHOUT EXPRESS

Before Express, make me experience the problems Express solves.

We should manually build an API using Node's HTTP module.

Teach:

```js
http.createServer();
```

request objects

response objects

request.url

request.method

request.headers

response.statusCode

response.setHeader()

response.write()

response.end()

JSON.stringify()

receiving request bodies

streams

routing manually

query strings

URL parsing

status codes

404s

error handling

POST

PUT/PATCH

DELETE

CRUD

Build an entire small API WITHOUT Express.

Example project:

ANIMAL SHELTER API

Features might gradually include:

- GET /
- GET /animals
- GET /animals/:id
- POST /animals
- PATCH /animals/:id
- DELETE /animals/:id
- query filters
- JSON bodies
- validation
- proper status codes
- errors

I want to feel how tedious manual routing becomes.

Then Express will make intuitive sense.

---

# PHASE 5 — EXPRESS.JS DEEPLY

Now introduce Express.

Explain exactly what abstraction it adds over Node.

Teach:

- installing Express
- Express application object
- app.listen
- routing
- app.get
- app.post
- app.put
- app.patch
- app.delete
- req
- res
- next
- req.params
- req.query
- req.body
- req.headers
- res.send
- res.json
- res.status
- res.end
- middleware
- application middleware
- router middleware
- error middleware
- middleware order
- next()
- routers
- controllers
- services
- repositories
- project structure
- separation of concerns
- async handlers
- validation
- error propagation
- custom errors
- centralized error handling
- configuration
- environment variables
- logging
- CORS
- compression
- rate limiting
- security headers

Do not let Express become magic.

Whenever Express does something, explain what equivalent raw Node behaviour lies underneath it.

---

# PHASE 6 — DATABASE FUNDAMENTALS BEFORE POSTGRESQL

Before SQL syntax, teach me why databases exist.

Start from something simple:

```js
const users = [];
```

Then ask:

What happens when the server restarts?

Why doesn't this scale?

What happens with millions of users?

What happens when multiple servers need the same data?

Then develop the need for databases naturally.

Teach:

- persistence
- DBMS
- relational databases
- non-relational databases
- relational model
- tables
- rows
- columns
- schemas
- data types
- NULL
- primary keys
- candidate keys
- foreign keys
- constraints
- uniqueness
- relationships
- one-to-one
- one-to-many
- many-to-many
- junction tables
- normalization
- denormalization
- indexes
- queries

I want to understand the relational model rather than memorising SQL commands.

---

# PHASE 7 — POSTGRESQL AND SQL TO AN ADVANCED LEVEL

Teach PostgreSQL properly.

I want increasingly deep SQL.

Start with:

CREATE DATABASE

CREATE TABLE

INSERT

SELECT

UPDATE

DELETE

WHERE

AND / OR

ORDER BY

LIMIT

OFFSET

DISTINCT

LIKE

IN

BETWEEN

NULL

aggregates

COUNT

SUM

AVG

MIN

MAX

GROUP BY

HAVING

Then:

JOIN

INNER JOIN

LEFT JOIN

RIGHT JOIN

FULL JOIN

self joins

subqueries

correlated subqueries

CTEs

recursive CTEs

CASE

UNION

window functions

transactions

BEGIN

COMMIT

ROLLBACK

SAVEPOINT

constraints

indexes

composite indexes

partial indexes

unique indexes

EXPLAIN

EXPLAIN ANALYZE

query planner

sequential scans

index scans

sorting

cardinality

statistics

vacuum

MVCC

locks

deadlocks

transaction isolation

dirty reads

non-repeatable reads

phantom reads

optimistic concurrency

pessimistic locking

connection limits

connection pooling

PostgreSQL processes

WAL

durability

ACID

I eventually want to understand not just how to write a query, but why one query is fast and another is slow.

---

# DATABASE DESIGN MUST BE PROJECT BASED

Give me realistic modelling problems.

For example:

Animal shelter:

Animal
Species
Owner
Appointment
Vaccination

Then:

E-commerce:

User
Product
Order
OrderItem
Payment
Inventory

Then something much more sophisticated.

Ask ME to design the schema first.

Challenge my design.

Ask:

“Could this produce duplicate data?”

“What relationship is this?”

“Where should the foreign key live?”

“What happens if this row is deleted?”

“Should this column allow NULL?”

“Would an index help here?”

Do not immediately provide the ideal answer.

Train my database reasoning.

---

# PHASE 8 — NODE + POSTGRESQL

Connect everything together.

Teach me:

- PostgreSQL client
- connection
- query
- parameterized queries
- SQL injection
- connection pooling
- Pool
- pool.query
- client.query
- transactions from Node
- error handling
- mapping database results
- repository patterns
- migrations
- seeds
- configuration
- environment variables

Explain the complete request flow:

```text
React/browser
↓
HTTP request
↓
Node process
↓
Express
↓
middleware
↓
router
↓
controller
↓
service
↓
repository/data-access layer
↓
PostgreSQL client
↓
network/socket
↓
PostgreSQL
↓
query parser/planner/executor
↓
result
↓
Node
↓
controller
↓
JSON serialization
↓
HTTP response
↓
browser
```

I want to be able to explain every arrow.

---

# PHASE 9 — ORM, BUT ONLY AFTER RAW SQL

Only after I understand SQL properly should we introduce an ORM/query builder.

Potential tools:

- Prisma
- Drizzle
- Knex

Explain what problem an ORM solves.

Also explain what an ORM hides.

Show ORM-generated SQL where useful.

Teach me when raw SQL may be preferable.

I should never become dependent on an ORM to understand my database.

---

# PHASE 10 — PROFESSIONAL API DESIGN

Teach:

- REST principles
- resources
- nouns vs verbs
- HTTP semantics
- GET
- POST
- PUT
- PATCH
- DELETE
- idempotency
- safe methods
- status codes
- pagination
- filtering
- sorting
- searching
- API versioning
- error response design
- validation
- OpenAPI
- Swagger
- documentation

Challenge bad API designs and make me improve them.

---

# PHASE 11 — AUTHENTICATION AND AUTHORIZATION

Teach from first principles.

Authentication:

“Who are you?”

Authorization:

“What are you allowed to do?”

Then teach:

- password hashing
- salts
- bcrypt/argon2
- sessions
- cookies
- secure cookies
- HTTP-only cookies
- SameSite
- JWT
- access tokens
- refresh tokens
- token expiration
- token rotation
- OAuth concepts
- RBAC
- permissions
- ownership rules

Explain security trade-offs.

Do not teach JWT as if it is automatically the best solution.

---

# PHASE 12 — WEB SECURITY

Teach me how backend systems get attacked.

Include:

- SQL injection
- XSS
- CSRF
- authentication attacks
- authorization bugs
- IDOR
- brute force attacks
- credential stuffing
- session fixation
- insecure cookies
- token theft
- CORS misconceptions
- SSRF concepts
- path traversal
- command injection
- prototype pollution concepts
- denial of service
- rate limiting
- secrets management
- password storage
- secure headers
- dependency vulnerabilities

Use safe demonstration projects where appropriate.

For each vulnerability explain:

1. What the developer did wrong
2. How an attacker might exploit the weakness conceptually
3. Why the vulnerability exists
4. How we prevent it
5. How to test that our protection works

---

# PHASE 13 — TESTING

Teach:

- unit tests
- integration tests
- API tests
- end-to-end tests
- test pyramid concepts
- mocks
- stubs
- spies
- fixtures
- test databases
- transaction rollback strategies
- Jest/Vitest if appropriate
- Supertest
- testing Express endpoints
- testing database code
- testing authentication
- testing errors
- coverage
- what NOT to test

Teach me how professional developers design testable code.

---

# PHASE 14 — DEBUGGING LIKE A PROFESSIONAL

I want strong debugging skills.

Whenever something breaks, do NOT just fix it.

Teach me to investigate.

Use:

- console logging appropriately
- Node inspector
- breakpoints
- VS Code debugger
- stack traces
- error messages
- network tab
- curl
- Postman/Bruno
- database logs
- EXPLAIN ANALYZE
- process inspection
- memory inspection concepts

Train me to ask:

“What do I know?”

“What do I expect?”

“What actually happened?”

“Where did those two states diverge?”

---

# PHASE 15 — PERFORMANCE

Teach me how to reason about performance.

Include:

- latency
- throughput
- requests per second
- CPU
- memory
- I/O
- database latency
- N+1 queries
- connection pooling
- indexes
- caching
- application cache
- Redis concepts
- cache invalidation
- HTTP caching
- compression
- streaming
- pagination
- batching
- async work
- background jobs
- worker threads
- load testing
- profiling
- memory leaks
- garbage collection basics
- event-loop blocking

Give me deliberately slow applications and make me diagnose them.

---

# PHASE 16 — CONCURRENCY AND DATABASE CORRECTNESS

Teach difficult real-world problems.

Example:

Two users try to purchase the last product simultaneously.

Teach:

- race conditions
- lost updates
- transactions
- isolation
- row locking
- SELECT ... FOR UPDATE
- optimistic concurrency
- atomic updates
- unique constraints
- idempotency
- distributed-system concerns

I need to understand how systems remain correct when many requests happen simultaneously.

---

# PHASE 17 — BACKGROUND JOBS AND QUEUES

Teach:

- request-response limitations
- background processing
- job queues
- producers
- consumers
- workers
- retries
- exponential backoff
- dead-letter queues
- idempotent jobs
- scheduled jobs
- Redis-backed queue concepts
- BullMQ if appropriate

Build examples such as:

- email queue
- image-processing queue
- report-generation queue

Explain why we should not keep an HTTP request open for certain workloads.

---

# PHASE 18 — ARCHITECTURE AND SYSTEM DESIGN

Once I have sufficient foundations, teach:

- monoliths
- modular monoliths
- microservices
- layered architecture
- MVC
- controller/service/repository
- dependency injection concepts
- clean architecture
- domain-driven design concepts
- event-driven systems
- message queues
- horizontal scaling
- vertical scaling
- stateless servers
- load balancers
- reverse proxies
- caching
- replication
- database scaling
- read replicas
- partitioning
- sharding concepts
- eventual consistency
- CAP theorem at the appropriate stage

Do not turn these into buzzwords.

Always show WHY we might need them.

---

# PHASE 19 — PRODUCTION ENGINEERING

Teach what happens after:

```bash
npm start
```

I want to understand:

- development vs production
- environment variables
- configuration
- secrets
- build/deployment
- Linux basics
- processes
- signals
- graceful shutdown
- SIGTERM
- Docker
- containers
- Dockerfiles
- ports
- networking
- volumes
- reverse proxies
- Nginx concepts
- TLS
- HTTPS
- domains
- DNS
- cloud deployment
- CI/CD
- migrations during deployment
- health checks
- readiness checks
- zero-downtime concepts

Deploy our projects for real when appropriate.

---

# PHASE 20 — OBSERVABILITY

Teach:

- logs
- structured logging
- log levels
- correlation/request IDs
- metrics
- latency
- throughput
- error rate
- traces
- distributed tracing concepts
- monitoring
- alerting
- dashboards
- incident debugging

Teach me the difference between:

“The server is running.”

and:

“The system is healthy.”

---

# PHASE 21 — ADVANCED NODE

Eventually teach deeper Node knowledge including:

- EventEmitter internals conceptually
- streams deeply
- backpressure
- buffers
- binary data
- worker_threads
- child_process
- cluster
- event-loop delays
- memory management
- garbage collection
- V8 concepts
- CPU profiling
- heap snapshots
- AsyncLocalStorage
- AbortController
- signals
- graceful shutdown
- process lifecycle
- package publishing
- library design

I want to understand when these are useful rather than learning them as trivia.

---

# COMPUTER SCIENCE FOUNDATIONS

Whenever they become relevant, teach me enough computer science to become a strong engineer.

Include progressively:

- variables and memory
- stack vs heap
- references
- value vs reference
- data structures
- arrays
- hash maps
- sets
- queues
- stacks
- linked lists conceptually
- trees
- graphs
- time complexity
- Big O
- space complexity
- searching
- sorting
- recursion
- hashing
- networking
- processes
- threads
- concurrency
- operating systems
- filesystem concepts

Do not suddenly turn this into a university algorithms course.

Connect computer science concepts to backend problems.

For example:

Explain hash tables when discussing JavaScript objects, Maps, caching, indexes, or lookup complexity.

---

# PROFESSIONAL SOFTWARE ENGINEERING HABITS

Train me to write maintainable software.

Teach:

- naming
- functions
- abstraction
- cohesion
- coupling
- separation of concerns
- DRY
- when NOT to use DRY
- YAGNI
- KISS
- SOLID at the appropriate stage
- refactoring
- code smells
- technical debt
- comments
- documentation
- code reviews
- Git
- branches
- commits
- pull requests
- reading other people's code

Show me poor implementations and make me improve them.

---

# TYPESCRIPT

Once my JavaScript/backend foundations are sufficiently strong, introduce TypeScript.

Teach:

- why TypeScript exists
- inference
- explicit types
- interfaces
- type aliases
- unions
- narrowing
- generics
- utility types
- typing Express
- database result types
- runtime validation vs compile-time types

Do not use TypeScript to hide JavaScript concepts before I understand them.

Eventually our serious production projects should use TypeScript.

---

# PROJECT ROADMAP

The learning journey should include increasingly difficult projects such as:

### Project 1

Basic Node scripts

### Project 2

File-based notes application

### Project 3

Raw Node HTTP server

### Project 4

Animal Shelter API without Express

### Project 5

Animal Shelter Express API

### Project 6

PostgreSQL-backed Animal Shelter system

### Project 7

Todo/project-management API

Include:

- users
- projects
- tasks
- relationships
- filtering
- pagination

### Project 8

Authentication system

Include:

- registration
- login
- password hashing
- authorization
- roles
- sessions/JWT depending on architecture

### Project 9

E-commerce backend

Include:

- users
- products
- inventory
- basket
- orders
- payments model
- transactions
- concurrent stock updates
- idempotency

### Project 10

Production-grade healthcare/pharmacy-style backend

Include appropriate fictional/non-sensitive data.

Possible concepts:

- users
- professionals
- patients
- consultations
- prescriptions
- audit logs
- roles
- permissions
- validation
- transactional integrity
- secure architecture
- immutable audit events
- pagination
- search
- background tasks

### Project 11

High-traffic backend

Introduce:

- Redis
- caching
- queues
- workers
- rate limiting
- performance testing
- observability

### Project 12

Capstone production system

I should design much of this myself.

It should include:

- architecture
- database schema
- API design
- authentication
- authorization
- background jobs
- caching
- PostgreSQL
- transactions
- testing
- logging
- Docker
- deployment
- monitoring
- performance analysis
- security review
- documentation

By the capstone, do NOT spoon-feed me.

Act more like a senior engineer reviewing my work.

---

# MAKE THE PROJECTS EVOLVE

Whenever possible, don't constantly throw projects away.

For example:

Start with:

```js
const animals = [];
```

Then save them to a JSON file.

Then explain why file persistence becomes problematic.

Then migrate to PostgreSQL.

Then add relationships.

Then authentication.

Then authorization.

Then caching.

Then tests.

Then Docker.

Then deployment.

Then monitoring.

This allows me to see WHY new technologies become necessary.

---

# ACTIVE RECALL

After teaching me something, test me.

Ask questions such as:

“What does `request.url` actually contain?”

“Who creates the request object?”

“Why does Node pass it into our callback?”

“What does the dot mean in `request.url`?”

“Why do we serialize an object before transmitting it as JSON?”

“What is the difference between concurrency and parallelism?”

“What would happen if this database query ran twice concurrently?”

Do not immediately tell me the answers.

Let me reason.

---

# CODE PREDICTION

Frequently show code and ask:

“What will happen?”

“What gets logged first?”

“What does this variable contain?”

“What HTTP response will the browser receive?”

“What SQL rows will be returned?”

“Will this transaction be safe?”

I want to learn to execute code mentally.

---

# CODE WRITING

Do NOT always write code for me.

Frequently give me tasks like:

“Write the route yourself.”

“Write the SQL query.”

“Create the table.”

“Implement this middleware.”

“Fix this bug.”

“Refactor this controller.”

Then review what I produce.

---

# CODE REVIEW MODE

When reviewing my code, act like a strong senior engineer.

Evaluate:

- correctness
- readability
- naming
- maintainability
- architecture
- security
- performance
- error handling
- edge cases
- database correctness

But explain every criticism.

Do not just tell me:

“This is bad practice.”

Tell me WHY.

---

# DEBUGGING MODE

When I give you an error, don't immediately reveal the fix.

First help me read the error.

Walk through:

1. What operation were we trying to perform?
2. What did we expect?
3. What actually happened?
4. Which line does the stack trace point toward?
5. What values do we need to inspect?
6. What hypothesis can we test?

Teach me the debugging process.

If I am completely stuck, gradually give stronger hints.

---

# SPACED REPETITION

Regularly bring previous concepts back.

For example, months after teaching `module.exports`, occasionally ask me to explain it again when modules appear in a larger application.

Connect new material to old material.

I want concepts to become permanent knowledge rather than temporary understanding.

---

# PERIODIC MASTERY CHECKS

After each major phase, give me a mastery assessment containing a mixture of:

- explanation questions
- code reading
- code prediction
- debugging
- coding
- architecture questions
- database design
- SQL
- practical project tasks

Identify weaknesses.

Then revise those weaknesses before proceeding.

Do NOT pass me simply for encouragement.

Be rigorous but constructive.

---

# NEVER ALLOW “MAGIC”

If we write:

```js
express.json();
```

I should understand what problem it solves.

If we write:

```js
pool.query();
```

I should understand what the pool is.

If we write:

```js
await
```

I should understand what it does and does NOT do.

If we use middleware, I should understand execution order.

If we use an ORM, I should understand the SQL underneath.

If we deploy with Docker, I should understand what the container actually is.

If we use Redis, I should understand why memory access changes performance characteristics.

Never let frameworks replace understanding.

---

# WHEN USING ANALOGIES

Analogies are useful, but always give me BOTH:

1. The analogy
2. The technically accurate explanation

For example:

You can explain the event loop using a restaurant.

But afterwards explain:

- JavaScript call stack
- Node APIs
- libuv
- callback queues
- Promise microtasks
- operating-system I/O

I should never leave only knowing the analogy.

---

# DISTINGUISH BEGINNER EXPLANATION FROM REALITY

If you intentionally simplify something, tell me.

For example:

“At beginner level, think of Node as doing X. Technically, there is another layer underneath, which we'll examine later.”

Then revisit the simplified concept later and replace it with the deeper model.

I want progressively more accurate mental models.

---

# TEACH ME TO USE DOCUMENTATION

Do not make me permanently dependent on you.

Teach me how to read:

- Node.js documentation
- Express documentation
- PostgreSQL documentation
- npm package documentation
- MDN
- error messages
- GitHub repositories

Occasionally give me small documentation-reading exercises.

Professional developers need to know how to discover information they don't already know.

---

# TEACH ME HOW TO THINK

The final goal is not:

“I know Node syntax.”

The final goal is:

“I can encounter a backend problem I have never seen before, break it down, research it, reason about it, design a solution, implement it, debug it, test it, secure it, optimize it, and explain my decisions.”

Train that ability deliberately.

---

# MY REQUIRED END STATE

By the end of this journey, I want to be capable of independently:

- explaining how a web request travels through a backend
- creating Node applications from scratch
- understanding Node's architecture
- understanding the event loop
- understanding asynchronous I/O
- building raw Node HTTP servers
- building sophisticated Express applications
- designing REST APIs
- writing advanced PostgreSQL SQL
- designing relational schemas
- creating and optimizing indexes
- reading EXPLAIN ANALYZE output
- understanding transactions and isolation
- preventing race conditions
- designing authentication systems
- implementing authorization
- securing web applications
- writing high-quality automated tests
- debugging production problems
- measuring performance
- identifying bottlenecks
- using caches appropriately
- creating background workers
- using queues
- containerizing applications
- deploying backend systems
- setting up logging and monitoring
- designing scalable architecture
- reading unfamiliar codebases
- reviewing backend code professionally
- reasoning about architectural trade-offs
- building production-quality backend software without relying blindly on AI

I want real engineering competence.

---

# VERY IMPORTANT: DO NOT TRY TO TEACH ALL OF THIS NOW

This document describes the destination.

We begin from absolute fundamentals.

Your first response should contain **Lesson 1 only**.

Lesson 1:

# What actually happens when I type a URL into my browser?

Start from:

```text
https://example.com/animals
```

Teach me gradually:

Browser
→ URL
→ network
→ server
→ backend
→ request
→ response
→ browser

Explain enough networking to build the first correct mental model, but don't overwhelm me with TCP internals yet.

Explain where Node.js will eventually fit.

Use diagrams with text/arrows where helpful.

Connect concepts to React where useful.

Give me a few tiny examples.

Then give me approximately 5 questions to check my understanding.

Ask me to answer them in my own words.

**STOP THERE.**

Do not start Lesson 2 until I answer.

Remember:

I am not trying to complete a Node.js course.

I am trying to become an **exceptionally capable backend engineer**, and I am willing to learn slowly and deeply to achieve it.
