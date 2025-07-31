# Football Statistics Dashboard

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Современная панель для прогнозирования спортивных матчей.
## Особенности

- 🚀 Высокая производительность (Vite)
- 📱 Полностью адаптивный интерфейс
- 🔮 Система прогнозирования результатов
- 🔄 Реальное обновление данных

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/kredo405/excapperScrapper.git
cd excapperscrapper
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Запустите приложение:
```bash
npm run dev
# или
yarn dev
```

4. Откройте в браузере:
```
http://localhost:5173
```

## Производственная сборка
```bash
npm run build
npm run preview
```

## Структура проекта
```
src/
├── components/        # UI-компоненты
├── store/             # Redux хранилище
│   ├── slices/        # Слайсы состояния
│   └── store.ts       # Конфигурация хранилища
├── services/          # API сервисы
├── types/             # Типы TypeScript
├── assets/            # Статические ресурсы
├── utils/             # Вспомогательные функции
├── App.tsx            # Главный компонент
└── main.tsx           # Точка входа
```

## Зависимости

### Основные
| Пакет              | Версия   | Назначение                  |
|--------------------|----------|-----------------------------|
| react              | ^18.3.1  | Библиотека UI               |
| react-dom          | ^18.3.1  | Рендеринг React в DOM       |
| react-redux        | ^9.1.2   | Интеграция Redux с React    |
| react-router-dom   | ^6.28.0  | Маршрутизация               |
| @reduxjs/toolkit   | ^2.3.0   | Утилиты Redux               |
| axios              | ^1.7.7   | HTTP-клиент                 |
| tailwindcss        | ^3.4.14  | CSS-фреймворк               |
| typescript         | ~5.6.2   | Система типов              |

### Вспомогательные
| Пакет              | Версия   | Назначение                  |
|--------------------|----------|-----------------------------|
| @heroicons/react   | ^2.1.5   | Иконки                      |
| antd               | ^5.22.1  | UI компоненты               |
| dotenv             | ^16.4.7  | Переменные окружения        |
| firebase           | ^11.1.0  | Интеграция с Firebase       |

## Скрипты

| Команда       | Действие                              |
|---------------|---------------------------------------|
| `npm run dev` | Запуск dev-сервера                    |
| `npm run build` | Сборка production-версии             |
| `npm run preview` | Просмотр собранной версии           |
| `npm run lint` | Проверка кода линтером               |

