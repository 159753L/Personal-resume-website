#!/usr/bin/env powershell

# 更新桌面快捷方式，使用PowerShell脚本

Write-Host "正在更新桌面快捷方式..."

# 定义快捷方式参数
$ShortcutPath = "$env:USERPROFILE\Desktop\个人网页.lnk"
$TargetPath = "$PSScriptRoot\start_app.ps1"
$WorkingDirectory = "$PSScriptRoot"
$Description = "启动个人网页应用"

# 创建WScript Shell对象
$WScriptShell = New-Object -ComObject WScript.Shell

# 创建快捷方式
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $WorkingDirectory
$Shortcut.Description = $Description

# 保存快捷方式
$Shortcut.Save()

Write-Host "快捷方式已更新：$ShortcutPath"
Write-Host "现在将使用PowerShell脚本启动应用"

# 提示用户
Write-Host ""
Write-Host "==========================================="
Write-Host "桌面快捷方式已更新！"
Write-Host "==========================================="
Write-Host "双击桌面上的'个人网页'图标即可启动应用"
Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")