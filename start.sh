#!/bin/bash

# 激活虚拟环境
source venv/bin/activate

# 安装依赖（使用简化版的 requirements.txt）
pip install Django==5.1.3 django-cors-headers==4.6.0 djangorestframework==3.15.2 social-auth-app-django==5.4.2 social-auth-core==4.5.4

# 运行数据库迁移
python petpal/manage.py migrate

# 启动 Django 开发服务器
python petpal/manage.py runserver