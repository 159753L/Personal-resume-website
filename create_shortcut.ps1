#!/usr/bin/env powershell

# 创建个人网页应用的桌面快捷方式

Write-Host "正在创建桌面快捷方式..."

# 定义快捷方式参数
$ShortcutPath = "$env:USERPROFILE\Desktop\个人网页.lnk"
$TargetPath = "$PSScriptRoot\start_app.bat"
$WorkingDirectory = "$PSScriptRoot"
$Description = "启动个人网页应用"

# 创建WScript Shell对象
$WScriptShell = New-Object -ComObject WScript.Shell

# 创建快捷方式
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetPath
$Shortcut.WorkingDirectory = $WorkingDirectory
$Shortcut.Description = $Description

# 设置图标（可选）
# 如果有.ico文件，可以设置 $Shortcut.IconLocation = "$PSScriptRoot\icon.ico"

# 保存快捷方式
$Shortcut.Save()

Write-Host "快捷方式已创建：$ShortcutPath"
Write-Host "双击快捷方式即可启动个人网页应用"

# 提示用户
echo ""
echo "==========================================="
echo "桌面快捷方式创建成功！"
echo "==========================================="
echo "双击桌面上的'个人网页'图标即可启动应用"
echo ""
echo "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")