#!/usr/bin/env powershell

# 创建个人网页应用的桌面快捷方式

Write-Host "正在创建桌面快捷方式..."

# 定义快捷方式参数
$ShortcutPath = "$env:USERPROFILE\Desktop\个人网页.lnk"
$TargetPath = "$PSScriptRoot\start_app.bat"
$WorkingDirectory = "$PSScriptRoot"

# 创建WScript Shell对象
$WScriptShell = New-Object -ComObject WScript.Shell

# 创建快捷方式
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $WorkingDirectory

# 保存快捷方式
$Shortcut.Save()

Write-Host "快捷方式已创建：$ShortcutPath"
Write-Host "双击快捷方式即可启动个人网页应用"