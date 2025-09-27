Запуск сервера
1. Установить python версіей 3.12 и выше
2. cd Backend
3. py -m venv .venv
4. .venv\Scripts\activate
5. pip install poetry
6. poetry install
7. cd back
8. py manage.py runserver

Запуск веб-сервера
1. Запустить ещё один терминал
2. Установить node.js
3. cd frontend
4. npm i --legacy-peer-deps
5. npm run dev
6. по ссылке http://localhost:3000 откроется веб сервер  

Для Докера
1. docker load -i full_stack.tar
2. docker compose up -d


сайт фронт: http://64.188.71.22:3000
Сайт бэк: http://64.188.71.22

авторизация:http://64.188.71.22:3000/auth
админ панель:http://64.188.71.22:3000/admin
так же админ панель backend:http://64.188.71.22/admin

Аккаунт с правами суперюзера
login: admin
password: admin

Аккаунт редактора
login: user
password: useruser1


презентация и скринкаст: https://disk.yandex.ru/d/Yo3NSLvza76Zeg