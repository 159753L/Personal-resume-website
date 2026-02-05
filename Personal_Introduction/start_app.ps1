#!/usr/bin/env powershell

# 启动个人网页应用

Write-Host "正在启动个人网页应用..."
Write-Host "==========================================="

# 检查Node.js是否安装
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未安装Node.js，请先安装Node.js"
    Read-Host "按任意键退出..."
    exit 1
}

# 检查npm是否安装
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未安装npm，请先安装npm"
    Read-Host "按任意键退出..."
    exit 1
}

# 检查是否已安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安装依赖包..."
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 依赖安装失败"
        Read-Host "按任意键退出..."
        exit 1
    }
}

# 启动Next.js开发服务器
Write-Host "正在启动开发服务器..."
Write-Host "==========================================="
Write-Host "服务器启动后，将自动打开浏览器访问: http://localhost:3000"
Write-Host "==========================================="

# 启动服务器
Start-Process powershell -ArgumentList "npm run dev" -WorkingDirectory $PSScriptRoot

# 等待服务器启动
Write-Host "正在等待服务器启动 (8秒)..."
Start-Sleep -Seconds 8

# 打开浏览器
Write-Host "正在打开浏览器..."
Start-Process "http://localhost:3000"

Write-Host "==========================================="
Write-Host "应用已启动！"
Write-Host "==========================================="
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")