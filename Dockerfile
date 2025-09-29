# 1. Use official Python image
FROM python:3.13-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy requirements first (for caching)
COPY requirements.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy entire project
COPY . .

# 6. Expose FastAPI port
EXPOSE 8000

# 7. Run FastAPI with Uvicorn
CMD ["uvicorn", "Api.api:app", "--host", "0.0.0.0", "--port", "8000"]
