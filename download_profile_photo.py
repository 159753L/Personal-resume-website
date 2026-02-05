#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
import os

def download_photo():
    """下载用户照片"""
    # 照片URL
    photo_url = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    
    # 设置保存路径
    save_path = os.path.join(os.getcwd(), "public", "profile_photo.jpg")
    
    # 创建public文件夹（如果不存在）
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    print(f"正在下载照片到: {save_path}")
    
    try:
        # 下载照片
        response = requests.get(photo_url, stream=True)
        response.raise_for_status()
        
        # 保存照片
        with open(save_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print("照片下载成功！")
        return save_path
        
    except Exception as e:
        print(f"下载失败: {e}")
        return None

if __name__ == "__main__":
    download_photo()