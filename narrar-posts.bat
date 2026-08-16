@echo off
chcp 65001 >nul
title Narrar posts do blog com a voz clonada
cd /d "%~dp0"

echo.
echo  ==========================================================
echo   NARRAR OS POSTS DO BLOG
echo  ==========================================================
echo.
echo   Narra os posts publicados que ainda nao tem audio.
echo   O que ja foi narrado e nao mudou, ele pula sozinho.
echo.
echo   Pode demorar: cerca de 2 a 3 minutos de maquina para
echo   cada minuto de audio. Deixe rodando.
echo.

"C:\Users\gabri\Desktop\reels_vida\.venv_pocket\Scripts\python.exe" "scripts\narrar_posts.py" %*

echo.
echo  ==========================================================
echo   Terminou. Os mp3 estao em public\audio\
echo   Agora e so publicar o site como voce ja faz.
echo  ==========================================================
echo.
pause
