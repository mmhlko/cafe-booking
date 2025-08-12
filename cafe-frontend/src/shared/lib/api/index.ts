// Экспорт базовых классов и утилит
export { ApiBase } from './apiBase';
export { apiRoutes } from './apiRoutes';

// Экспорт модуля API столиков
export { 
  TablesApiModule, 
  tablesApiModule,
  ICreateReservationData,
  ITableResponse 
} from './modules/tablesApi';

// Экспорт сервиса столиков
export { 
  TablesService, 
  tablesService,
  ITablesState,
  ITablesStats 
} from './services/tablesService';

// Экспорт контроллера столиков
export { 
  TablesController, 
  tablesController,
  ITablesController 
} from './controllers/tablesController';

// Экспорт типов
export type { ITable, TTableStatus } from '@/widgets/tables/types';
