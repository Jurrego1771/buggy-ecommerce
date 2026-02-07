const request = require('supertest');

// BUG INTENCIONAL: Test vacío que siempre pasa
describe('Products API', () => {
    test('should return products', async () => {
        // TODO: Implementar test
        expect(true).toBe(true);
    });

    // BUG INTENCIONAL: Test con datos hardcodeados
    test('should find product by id', async () => {
        const productId = '1';
        expect(productId).toBe('1');
    });

    // BUG INTENCIONAL: No hace request real
    test('should filter by category', () => {
        const category = 'electronics';
        expect(category).toBeTruthy();
    });
});

describe('Auth API', () => {
    // BUG INTENCIONAL: Test que no verifica nada importante
    test('login should work', () => {
        const username = 'admin';
        const password = 'admin123';
        expect(username).toBe('admin');
    });

    // BUG INTENCIONAL: False positive
    test('should hash passwords', () => {
        const password = 'password123';
        // No verifica que realmente se hashee
        expect(password.length).toBeGreaterThan(0);
    });
});

describe('Orders API', () => {
    // BUG INTENCIONAL: No verifica race conditions
    test('should create order', () => {
        expect(1 + 1).toBe(2);
    });

    // BUG INTENCIONAL: No verifica stock
    test('should update stock', () => {
        const stock = 10;
        expect(stock).toBeGreaterThan(0);
    });
});

// BUG INTENCIONAL: Test comentado
// describe('FFmpeg', () => {
//   test('should generate thumbnail', () => {
//     // Implementar
//   });
// });
