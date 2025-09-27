FROM python:3.12-slim

RUN mkdir -p /app
WORKDIR /app

# Копируем зависимости
COPY pyproject.toml poetry.lock* ./

RUN pip install --upgrade pip

RUN pip install poetry

RUN     poetry config virtualenvs.create false && \
    poetry install --no-root --no-interaction --no-ansi
COPY ./entrypoint.sh .
# Копируем ВСЕ файлы из текущей директории (включая entrypoint.sh)
COPY . .

# Явно указываем путь к entrypoint.sh и даем права
RUN chmod +x /app/entrypoint.sh


ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]


