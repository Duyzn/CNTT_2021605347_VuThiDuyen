# Build và chạy tất cả containers
docker-compose up --build

# Chỉ chạy database
docker-compose up mysql-db phpmyadmin

# Kiểm tra logs
docker-compose logs

# Dừng tất cả
docker-compose down