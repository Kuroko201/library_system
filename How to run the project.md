# Docker 常用指令

# 启动全部服务(背景执行)
docker compose up -d

# 停止全部(保留数据)
docker compose down

# 停止全部 + 删除数据
docker compose down -v

# 强制重建 image(如果改了 Dockerfile)
docker compose up -d --build

# 跑所有未执行的 migration
docker compose run --rm migrate

# 回滚一个版本
docker compose run --rm migrate down 1

# 完整啟動流程
| Docker Desktop | 容器 | `docker --version` |
| Node.js 22 | 本機開發（可選） | `node --version` |

## 初次啟動 （Full Container Load Mode）
git clone <repo-url>
cd library_system
cp .env.example .env
docker compose up -d 

## 初次啟動 （Hybrid Mode, i have this because i heard that docker desktop eat a lot of resources and my labtop sucks.）
git clone <repo-url>
cd library_system
cp .env.example .env
npm install
docker compose up -d postgres-db
npm run dev