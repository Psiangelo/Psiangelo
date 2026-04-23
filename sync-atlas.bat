@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   Psiangelo Atlas - Sync do Obsidian
echo ========================================
echo.

echo [1/3] Lendo vault e regenerando atlas.json...
call npm run atlas:sync
if errorlevel 1 (
  echo.
  echo ERRO: falha ao ler o vault. Verifique se G:\Meu Drive\Estudos gerais esta acessivel.
  pause
  exit /b 1
)

echo.
echo [2/3] Staging mudancas...
git add src/data/atlas.json public/atlas-media scripts/import-obsidian.mjs

REM verifica se ha algo pra commitar
git diff --cached --quiet
if %errorlevel% equ 0 (
  echo.
  echo Nenhuma mudanca no Atlas. Nada a commitar.
  echo Vault e site ja estao em sincronia.
  pause
  exit /b 0
)

echo.
echo [3/3] Commitando e enviando pro GitHub...
git commit -m "atlas: sync do vault Obsidian"
if errorlevel 1 exit /b 1
git push origin main
if errorlevel 1 exit /b 1

echo.
echo ========================================
echo   Sync completo!
echo ========================================
echo.
echo O deploy vai rodar no GitHub Actions (1-2 min).
echo Acompanhe em: https://github.com/Psiangelo/Psiangelo/actions
echo.
echo Site: https://psiangelo.github.io/Psiangelo/atlas
echo.
pause
