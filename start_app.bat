@echo off

REM 启动个人网页应用

echo ============================================
echo 正在启动个人网页应用...
echo ============================================

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

REM 启动Next.js开发服务器
echo 正在启动开发服务器...
start "Next.js Server" /min npm run dev

REM 等待服务器启动
echo 正在等待服务器启动 (5秒)...
timeout /t 5 /nobreak >nul

REM 打开浏览器访问网页
echo 正在打开浏览器...
start http://localhost:3000

echo ============================================
echo 应用已启动，请在浏览器中访问 http://localhost:3000
echo ============================================

REM 保持窗口打开，方便查看日志
pause