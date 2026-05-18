@echo off
REM Push do commit local d43c5cd (bussola/home) pra Psiangelo/Psiangelo.
REM O GCM vai abrir o navegador na 1a vez se a conta Psiangelo nao estiver
REM cacheada. Depois disso, rodar o .bat de novo conclui o push.
cd /d "%~dp0"
git push origin main
pause
