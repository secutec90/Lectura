Option Explicit
' Lanza el centinela de DeepSeek SIN ventana visible (estilo 0).
' Doble clic sobre este archivo, o:
'   wscript "G:\Mi unidad\PROYECTOS\Lectura\herramientas\centinela_oculto.vbs"
' El registro se escribe en %TEMP%\st90_centinela_deepseek.log
Dim sh, ruta
Set sh = CreateObject("WScript.Shell")
ruta = "G:\Mi unidad\PROYECTOS\Lectura\herramientas\centinela_deepseek.cmd"
sh.Run """" & ruta & """", 0, False