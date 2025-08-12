# API Module для столиков

Этот модуль предоставляет полную архитектуру для работы с API столиков на фронтенде, включая кеширование, управление состоянием и валидацию.

## Структура модуля

```
src/shared/lib/api/
├── modules/
│   └── tablesApi.ts          # Основной API модуль для работы с сервером
├── services/
│   └── tablesService.ts      # Сервис с кешированием и управлением состоянием
├── controllers/
│   └── tablesController.ts   # Контроллер с валидацией и бизнес-логикой
├── apiBase.ts               # Базовый класс для HTTP запросов
├── apiRoutes.ts             # Конфигурация маршрутов API
├── index.ts                 # Экспорт всех модулей
└── README.md               # Документация
```

## Компоненты

### 1. TablesApiModule (`modules/tablesApi.ts`)

Основной класс для HTTP запросов к API столиков.

**Основные методы:**
- `getAllTables()` - получить все столы
- `getTableById(id)` - получить стол по ID
- `updateTableStatus(id, status)` - обновить статус стола
- `createReservation(id, data)` - создать бронь
- `cancelReservation(id)` - отменить бронь
- `quickSeatTable(id)` - быстрая посадка гостей
- `freeTable(id)` - освободить стол
- `getTablesStats()` - получить статистику

### 2. TablesService (`services/tablesService.ts`)

Сервис с кешированием и управлением состоянием.

**Особенности:**
- Автоматическое кеширование данных (5 минут)
- Подписка на изменения состояния
- Управление состоянием загрузки и ошибок
- Методы для фильтрации столиков

**Основные методы:**
- `getAllTables(forceRefresh?)` - получить все столы с кешированием
- `subscribe(callback)` - подписка на изменения состояния
- `clearCache()` - очистить кеш
- `getTablesByStatus(status)` - получить столы по статусу

### 3. TablesController (`controllers/tablesController.ts`)

Контроллер с валидацией и бизнес-логикой.

**Особенности:**
- Валидация входных данных
- Обработка ошибок
- Дополнительные методы для фильтрации
- Логирование операций

**Основные методы:**
- Все методы из API модуля с валидацией
- `validateTableId(id)` - валидация ID стола
- `validateReservationData(data)` - валидация данных бронирования
- `getTablesByCapacity(min, max?)` - получить столы по вместимости

## Использование

### Базовое использование

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

### Использование с React Context

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
  const { 
    tables, 
    loading, 
    error, 
    updateTableStatus,
    createReservation 
  } = useTables();

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

### Подписка на изменения состояния

```typescript
import { tablesService } from '@/shared/lib/api';

const unsubscribe = tablesService.subscribe((state) => {
  console.log('Состояние изменилось:', state);
  // Обновить UI или выполнить другие действия
});

// Отписаться от изменений
unsubscribe();
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

### ITablesState
```typescript
interface ITablesState {
  tables: ITable[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
```

## Конфигурация

### API маршруты (`apiRoutes.ts`)
```typescript
export const apiRoutes = {
  table: {
    serverRoute: 'table',
    baseRoute: 'api/table',
  },
};
```

### Настройка базового URL
В `apiBase.ts` можно настроить базовый URL и другие параметры HTTP клиента.

## Обработка ошибок

Все методы API возвращают структурированные ответы с полем `success`:

```typescript
// Успешный ответ
{
  success: true,
  data: table,
  timestamp: '2024-01-15T10:30:00.000Z'
}

// Ошибка
{
  success: false,
  error: 'Table not found',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

## Кеширование

Модуль автоматически кеширует данные на 5 минут. Кеш можно:
- Очистить: `tablesController.clearCache()`
- Принудительно обновить: `tablesController.getAllTables(true)`
- Проверить актуальность: `tablesService.getState().lastUpdated`

## Валидация

Контроллер автоматически валидирует:
- ID стола (должен быть положительным целым числом)
- Данные бронирования (имя, телефон, количество гостей, время)
- Статусы столов (AVAILABLE, OCCUPIED, RESERVED)
