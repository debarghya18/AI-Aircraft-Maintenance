# Use an official Python runtime as a base image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy dependencies first for Docker caching
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . /app

# Environment configuration
ENV PYTHONUNBUFFERED=1

# Expose port 8000
EXPOSE 8000

# Execute app via uvicorn / app.py entrypoint
CMD ["python", "app.py"]
