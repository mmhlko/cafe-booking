# Cafe Management System - API Architecture

Система управления кафе с модульной архитектурой API для работы со столиками и кешированием.

## Архитектура проекта

```
cafe/
├── cafe-frontend/          # Next.js фронтенд
│   └── src/
│       ├── shared/lib/api/ # API модули фронтенда
│       │   ├── modules/    # API модули
│       │   ├── services/   # Сервисы с кешированием
│       │   ├── controllers/ # Контроллеры с валидацией
│       │   └── index.ts    # Экспорт всех модулей
│       └── app/_contexts/  # React контексты
└── cafe-backend/           # NestJS бэкенд
    └── src/modules/
        ├── redis/          # Redis модуль для кеширования
        └── api/tables/     # API модуль для столиков
```

## Основные компоненты

### 🎯 Фронтенд API Architecture

#### 1. TablesApiModule
- **Назначение**: HTTP запросы к серверу
- **Особенности**: 
  - Наследует от ApiBase
  - Обработка ошибок
  - Типизированные ответы
- **Методы**: getAllTables, getTableById, updateTableStatus, createReservation, etc.

#### 2. TablesService
- **Назначение**: Управление состоянием и кеширование
- **Особенности**:
  - In-memory кеширование (5 минут)
  - Подписка на изменения состояния
  - Автоматическое обновление кеша
- **Методы**: subscribe, getAllTables, clearCache, getTablesByStatus

#### 3. TablesController
- **Назначение**: Бизнес-логика и валидация
- **Особенности**:
  - Валидация входных данных
  - Обработка ошибок
  - Дополнительные методы фильтрации
- **Методы**: validateTableId, validateReservationData, getTablesByCapacity

### 🔄 Бэкенд API Architecture

#### 1. Redis Module
- **Назначение**: Кеширование данных о столиках
- **Особенности**:
  - In-memory хранилище с TTL
  - Автоматическая очистка устаревших записей
  - REST API для управления кешем
- **Компоненты**: RedisService, RedisController

#### 2. Tables API Module
- **Назначение**: API для работы со столиками
- **Особенности**:
  - Интеграция с Redis кешем
  - Моковые данные для демонстрации
  - Полный CRUD функционал
- **Компоненты**: TablesService, TablesController

## API Endpoints

### Frontend API Routes
```
/api/table                    # GET - получить все столы
/api/table/:id               # GET - получить стол по ID
/api/table/:id/status        # PATCH - обновить статус стола
/api/table/:id/reserve       # POST - создать бронь
/api/table/:id/cancel        # POST - отменить бронь
/api/table/stats/overview    # GET - статистика столиков
```

### Backend API Routes
```
/api/table/*                 # Все эндпоинты для столиков
/redis/health               # GET - здоровье кеша
/redis/stats                # GET - статистика кеша
/redis/tables               # GET/POST/DELETE - управление кешем столиков
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

### ICreateReservationData
```typescript
interface ICreateReservationData {
  customerName: string;
  phone: string;
  guests?: number;
  time: string;
}
```

## Использование

### Frontend - Базовое использование

```typescript
import { tablesController } from '@/shared/lib/api';

// Получить все столы
const tables = await tablesController.getAllTables();

// Обновить статус стола
await tablesController.updateTableStatus(1, 'OCCUPIED');

// Создать бронь
const reservation = await tablesController.createReservation(1, {
  customerName: 'Иван Иванов',
  phone: '+7 999 123-45-67',
  guests: 4,
  time: '2024-01-15T19:00:00'
});
```

### Frontend - React Context

```typescript
import { TablesProvider, useTables } from '@/app/_contexts/TablesContext';

function App() {
  return (
    <TablesProvider>
      <TablesComponent />
    </TablesProvider>
  );
}

function TablesComponent() {
  const { tables, loading, error, updateTableStatus } = useTables();
  
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      {tables.map(table => (
        <div key={table.id}>{table.name}</div>
      ))}
    </div>
  );
}
```

### Backend - Использование Redis

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
}
```

## Кеширование

### Frontend Cache
- **Тип**: In-memory с подпиской на изменения
- **TTL**: 5 минут
- **Управление**: Автоматическое обновление при изменениях
- **Очистка**: `tablesController.clearCache()`

### Backend Cache
- **Тип**: In-memory с TTL (готов к миграции на Redis)
- **TTL**: 5 минут для всех столиков, 10 минут для отдельных
- **Префикс**: `cafe:tables:`
- **Управление**: REST API для мониторинга и управления

## Валидация

### Frontend Validation
- ID стола: положительное целое число
- Данные бронирования: имя (мин. 2 символа), телефон, гости (1-20), время
- Статусы столов: AVAILABLE, OCCUPIED, RESERVED

### Backend Validation
- Валидация входных параметров
- Проверка существования столов
- Валидация бизнес-правил (статус стола для бронирования)

## Обработка ошибок

### Структура ответов
```typescript
// Успешный ответ
{
  success: true,
  data: result,
  timestamp: "2024-01-15T10:30:00.000Z"
}

// Ошибка
{
  success: false,
  error: "Error message",
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

### Логирование
- Frontend: console.error для ошибок API
- Backend: NestJS Logger для всех операций
- Redis: Логирование операций кеша

## Производительность

### Frontend
- Кеширование данных на 5 минут
- Подписка на изменения состояния
- Ленивая загрузка данных
- Валидация на клиенте

### Backend
- In-memory кеширование
- Автоматическая очистка устаревших записей
- Эффективные запросы к API
- Оптимизированная структура данных

## Мониторинг

### Frontend
- Состояние загрузки и ошибок
- Время последнего обновления кеша
- Статистика использования API

### Backend
- Здоровье кеша: `/redis/health`
- Статистика кеша: `/redis/stats`
- Логирование всех операций

## Безопасность

### Frontend
- Валидация входных данных
- Типизация TypeScript
- Обработка ошибок сети

### Backend
- Валидация параметров запросов
- Префикс для изоляции данных кеша
- Логирование подозрительных операций

## Расширение

### Добавление новых API модулей
1. Создать модуль в `src/shared/lib/api/modules/`
2. Создать сервис в `src/shared/lib/api/services/`
3. Создать контроллер в `src/shared/lib/api/controllers/`
4. Добавить экспорт в `src/shared/lib/api/index.ts`

### Миграция на реальный Redis
1. Установить зависимости Redis
2. Заменить in-memory хранилище на Redis клиент
3. Обновить конфигурацию подключения
4. Протестировать производительность

## Запуск проекта

### Frontend
```bash
cd cafe-frontend
npm install
npm run dev
```

### Backend
```bash
cd cafe-backend
npm install
npm run start:dev
```

## Тестирование

### Frontend API
- Модульные тесты для каждого компонента
- Интеграционные тесты для API модулей
- E2E тесты для пользовательских сценариев

### Backend API
- Unit тесты для сервисов
- Integration тесты для контроллеров
- E2E тесты для API эндпоинтов

## Документация

- [Frontend API Documentation](./cafe-frontend/src/shared/lib/api/README.md)
- [Backend Redis Documentation](./cafe-backend/src/modules/redis/README.md)
- [API Endpoints Documentation](./docs/api-endpoints.md)
