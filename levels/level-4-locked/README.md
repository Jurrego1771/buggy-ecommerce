# Level 4 - Panel Admin + FFmpeg

Este nivel implementa upload de videos y generación de thumbnails.

## Bugs a encontrar:
- No verifica rol de admin
- Multer sin límites de tamaño
- Path traversal en FFmpeg
- No verifica si FFmpeg está instalado
- Leak de streams
- No limpia archivos temporales
- No valida MIME type

## Tareas:
1. Verificar rol admin en upload
2. Configurar límites en Multer
3. Sanitizar paths de archivo
4. Verificar instalación de FFmpeg al inicio
5. Cerrar streams correctamente
6. Implementar limpieza de archivos temp
7. Validar MIME type de archivos
