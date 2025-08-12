# Redis Module для кеширования столиков

Модуль Redis предоставляет функциональность для кеширования информации о столиках с использованием in-memory хранилища (с возможностью легкой миграции на реальный Redis).

## Структура модуля

```
src/modules/redis/
├── redis.module.ts          # Основной модуль Redis
├── redis.service.ts         # Сервис для работы с кешем
├── redis.controller.ts      # Контроллер для управления кешем
└── README.md               # Документация
```

## Компоненты

### 1. RedisService (`redis.service.ts`)

Основной сервис для работы с кешем столиков.

**Особенности:**
- In-memory хранилище с TTL (время жизни)
- Автоматическая очистка устаревших записей
- Префикс для ключей (`cafe:tables:`)
- Логирование операций
- Методы для работы со столиками

**Основные методы:**

#### Базовые операции с кешем
- `set(key, value, ttl?)` - установить значение
- `get<T>(key)` - получить значение
- `del(key)` - удалить значение
- `exists(key)` - проверить существование
- `expire(key, ttl)` - установить время жизни

#### Специализированные методы для столиков
- `cacheTables(tables)` - кешировать все столы
- `getCachedTables()` - получить все столы из кеша
- `cacheTable(table)` - кешировать отдельный стол
- `getCachedTable(tableId)` - получить стол из кеша
- `updateCachedTable(table)` - обновить стол в кеше
- `removeCachedTable(tableId)` - удалить стол из кеша
- `clearTablesCache()` - очистить весь кеш столиков

#### Утилиты
- `getCacheStats()` - получить статистику кеша
- `healthCheck()` - проверить здоровье кеша

### 2. RedisController (`redis.controller.ts`)

REST API контроллер для управления кешем.

**Эндпоинты:**

#### Здоровье и статистика
- `GET /redis/health` - проверить здоровье кеша
- `GET /redis/stats` - получить статистику кеша

#### Операции со столиками
- `GET /redis/tables` - получить все столики из кеша
- `GET /redis/tables/:id` - получить стол из кеша по ID
- `POST /redis/tables` - кешировать все столики
- `POST /redis/tables/:id` - кешировать отдельный стол
- `POST /redis/tables/:id/update` - обновить стол в кеше
- `DELETE /redis/tables/:id` - удалить стол из кеша
- `DELETE /redis/tables` - очистить весь кеш столиков

#### Общие операции с кешем
- `POST /redis/set` - установить значение в кеш
- `GET /redis/get/:key` - получить значение из кеша
- `DELETE /redis/del/:key` - удалить значение из кеша
- `GET /redis/exists/:key` - проверить существование ключа

## Использование

### В сервисах

```typescript
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TablesService {
  constructor(private readonly redisService: RedisService) {}

  async getAllTables(): Promise<ITable[]> {
    // Сначала пытаемся получить из кеша
    let tables = await this.redisService.getCachedTables();
    
    if (!tables) {
      // Если кеш пуст, загружаем из БД и кешируем
      tables = await this.loadTablesFromDatabase();
      await this.redisService.cacheTables(tables);
    }

    return tables;
  }

  async updateTable(table: ITable): Promise<void> {
    // Обновляем в БД
    await this.updateTableInDatabase(table);
    
    // Обновляем кеш
    await this.redisService.updateCachedTable(table);
  }
}
```

### Прямое использование контроллера

```bash
# Проверить здоровье кеша
curl http://localhost:3000/redis/health

# Получить статистику
curl http://localhost:3000/redis/stats

# Получить все столики из кеша
curl http://localhost:3000/redis/tables

# Кешировать столики
curl -X POST http://localhost:3000/redis/tables \
  -H "Content-Type: application/json" \
  -d '{"tables": [...]}'

# Очистить кеш
curl -X DELETE http://localhost:3000/redis/tables
```

## Типы данных

### ITable
```typescript
interface ITable {
  id: number;
  name: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  reservation?: {
    id: number;
    name: string;
    phoneNumber: string;
    date: string;
  };
}
```

### ITablesCache
```typescript
interface ITablesCache {
  tables: ITable[];
  lastUpdated: string;
  version: string;
}
```

## Конфигурация

### Настройки по умолчанию
- Префикс ключей: `cafe:tables:`
- TTL по умолчанию: 300 секунд (5 минут)
- TTL для отдельных столиков: 600 секунд (10 минут)
- TTL для всех столиков: 300 секунд (5 минут)

### Изменение настроек

```typescript
// В redis.service.ts
private readonly CACHE_PREFIX = 'cafe:tables:';
private readonly DEFAULT_TTL = 300; // 5 минут
```

## Миграция на реальный Redis

Для использования реального Redis замените in-memory хранилище:

```typescript
// Установите зависимости
npm install @nestjs/cache-manager cache-manager cache-manager-redis-store redis

// В redis.service.ts замените Map на Redis клиент
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.redisClient.connect();
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    const fullKey = `${this.CACHE_PREFIX}${key}`;
    await this.redisClient.setEx(fullKey, ttl, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = `${this.CACHE_PREFIX}${key}`;
    const value = await this.redisClient.get(fullKey);
    return value ? JSON.parse(value) : null;
  }

  // ... остальные методы
}
```

## Мониторинг и отладка

### Логирование
Сервис автоматически логирует все операции:
- Установка значений: `Cache set: cafe:tables:key`
- Получение значений: `Cache hit: cafe:tables:key`
- Удаление значений: `Cache deleted: cafe:tables:key`

### Статистика
```typescript
const stats = await redisService.getCacheStats();
console.log(stats);
// {
//   totalEntries: 15,
//   tablesEntries: 12,
//   memoryUsage: "2.45 KB"
// }
```

### Проверка здоровья
```typescript
const health = await redisService.healthCheck();
console.log(health);
// {
//   status: "healthy",
//   message: "Cache is working properly"
// }
```

## Обработка ошибок

Все методы возвращают структурированные ответы:

```typescript
// Успешный ответ
{
  success: true,
  data: tables,
  cached: true,
  timestamp: "2024-01-15T10:30:00.000Z"
}

// Ошибка
{
  success: false,
  error: "Cache operation failed",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

## Производительность

- In-memory операции: ~1ms
- Автоматическая очистка устаревших записей
- Эффективное использование памяти
- Поддержка больших объемов данных

## Безопасность

- Префикс для изоляции данных
- Валидация входных данных
- Ограничение размера значений
- Логирование подозрительных операций
