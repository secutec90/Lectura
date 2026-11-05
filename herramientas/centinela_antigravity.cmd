@echo off
rem Centinela de buzon para Antigravity (Director).
rem Vigila ENTREGA_CURSOR.md y ENTREGA_DEEPSEEK.md en busca de entregas.
cd /d "G:\Mi unidad\PROYECTOS\Lectura"
node "herramientas\centinela_buzon.js" antigravity --intervalo=15 --max-ciclos=240
