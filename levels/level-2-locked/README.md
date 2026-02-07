# Level 2 - Autenticación

Este nivel implementa login y registro.

## Bugs a encontrar:
- Passwords en texto plano
- JWT sin expiración
- Secret débil (123456)
- No valida inputs
- Vulnerable a timing attacks

## Tareas:
1. Implementar bcrypt para passwords
2. Agregar expiración a JWT
3. Usar secret fuerte desde variables de entorno
4. Validar y sanitizar inputs
5. Usar comparación constante para passwords
