@echo off
title Vigilante de Orquesta (Cursor + DeepSeek + Antigravity)
cd /d "%~dp0"
echo Iniciando Vigilante de Orquesta...
if exist ".rsc\vigilante_orquesta.js" (
  node .rsc\vigilante_orquesta.js
) else if exist "herramientas\vigilante_orquesta.js" (
  node herramientas\vigilante_orquesta.js
) else (
  echo Error: No se encontro vigilante_orquesta.js en .rsc ni en herramientas.
  pause
)
pause
