Запуск сервера
1. Установить python версіей 3.8 и выше
2. cd Backend
3. py -m venv .venv
4. .venv\Scripts\activate
5. pip install poetry
6. poetry install
7. cd texstrelka
8. py manage.py runserver

Запуск веб-сервера
1. Запустить ещё один терминал
2. Установить node.js
3. cd frontend
4. npm i --legacy-peer-deps
5. npm run dev
6. по ссылке http://localhost:3000 откроется веб сервер

Аккаунт с правами суперюзера
login: admin
password: admin

urls
v1/account/login -> None
v1/account/logout -> None
v1/account/info -> None
v1/analytics/penalties/create -> None
v1/analytics/penalties/get -> None
v1/analytics/towTrucks/create -> None
v1/analytics/towTrucks/get -> None
