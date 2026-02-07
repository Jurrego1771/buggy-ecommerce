# Level 3 - Checkout y Pagos

Este nivel implementa el proceso de pago.

## Bugs a encontrar:
- Race condition en checkout (doble compra)
- Stock puede ser negativo
- No verifica autenticación
- Webhook sin verificar firma
- Vulnerable a CSRF

## Tareas:
1. Implementar locks para prevenir race conditions
2. Validar stock atómicamente
3. Verificar token antes de crear orden
4. Validar firma de Stripe en webhook
5. Implementar protección CSRF
