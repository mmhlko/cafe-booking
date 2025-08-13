## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mmhlko/cafe-booking.git
```

### 2. Run Docker Desktop

### 3. Create `.env` file

```
#REDIS
REDIS_PORT=6379
REDIS_HOST=cafe_redis
REDIS_PASSWORD=PASSWORD
#API
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Run the application in Docker

```bash
docker-compose up --build -d
```

The app will start on `http://localhost:3000`.

---