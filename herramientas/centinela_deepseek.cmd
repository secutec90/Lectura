@echo off
rem Centinela de buzon para DeepSeek. Se lanza desde centinela_oculto.vbs
rem (ventana oculta). El registro queda en %TEMP%\st90_centinela_deepseek.log
cd /d "G:\Mi unidad\PROYECTOS\Lectura"
"C:\Program Files\nodejs\node.exe" "herramientas\centinela_buzon.js" deepseek --intervalo=60 --max-ciclos=480 > "%TEMP%\st90_centinela_deepseek.log" 2>&1