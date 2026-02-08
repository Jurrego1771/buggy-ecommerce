const express = require('express');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const PORT = 3000;

// BUG INTENCIONAL: CORS permite cualquier origen (*)
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// BUG INTENCIONAL: Secret JWT débil y hardcodeado
const JWT_SECRET = '123456';

// BUG INTENCIONAL: Sin rate limiting
let requestCount = 0;

// BUG INTENCIONAL: Multer sin límites de tamaño
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        // BUG INTENCIONAL: No sanitiza nombres de archivo
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// BUG INTENCIONAL: Lectura síncrona de archivos
function readData(filename) {
    const data = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
}

// BUG INTENCIONAL: Escritura síncrona sin manejo de errores
function writeData(filename, data) {
    fs.writeFileSync(path.join(__dirname, 'data', filename), JSON.stringify(data, null, 2));
}

// Middleware de autenticación (buggeado)
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    // BUG INTENCIONAL: No verifica formato Bearer
    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }

    try {
        // BUG INTENCIONAL: No verifica expiración correctamente
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // BUG INTENCIONAL: Traga el error sin logging
        res.status(401).json({ error: 'Invalid token' });
    }
}

// GET /api/products
app.get('/api/products', (req, res) => {
    requestCount++;
    const products = readData('products.json');

    // BUG INTENCIONAL: No maneja errores de lectura
    const { search, category } = req.query;

    let filtered = products;

    if (search) {
        // BUG INTENCIONAL: Búsqueda case-sensitive (ya esta solucionado)
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    res.json(filtered);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    const products = readData('products.json');
    const product = products.find(p => p.id === req.params.id);

    // BUG INTENCIONAL: No verifica si existe
    res.json(product);
});

// POST /api/register
app.post('/api/register', (req, res) => {
    const { username, password, email } = req.body;

    // BUG INTENCIONAL: No valida inputs
    const users = readData('users.json');

    // BUG INTENCIONAL: Passwords en texto plano
    const newUser = {
        id: String(users.length + 1),
        username,
        password,
        email,
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData('users.json', users);

    // BUG INTENCIONAL: Devuelve password en respuesta
    res.json({ success: true, user: newUser });
});

// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData('users.json');

    // BUG INTENCIONAL: Vulnerable a timing attacks
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // BUG INTENCIONAL: Token sin expiración
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// POST /api/orders
app.post('/api/orders', authMiddleware, (req, res) => {
    const { items, total } = req.body;
    const orders = readData('orders.json');
    const products = readData('products.json');

    // BUG INTENCIONAL: Race condition - no bloquea stock
    const newOrder = {
        id: String(Date.now()),
        userId: req.user.id,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // BUG INTENCIONAL: No verifica stock antes de crear orden
    orders.push(newOrder);
    writeData('orders.json', orders);

    // BUG INTENCIONAL: Actualiza stock sin verificar disponibilidad
    items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
            // BUG INTENCIONAL: Stock puede ser negativo
        }
    });

    writeData('products.json', products);

    res.json({ success: true, order: newOrder });
});

// GET /api/orders
app.get('/api/orders', authMiddleware, (req, res) => {
    const orders = readData('orders.json');

    // BUG INTENCIONAL: No filtra por usuario
    res.json(orders);
});

// POST /api/upload
app.post('/api/upload', authMiddleware, upload.single('video'), (req, res) => {
    // BUG INTENCIONAL: No verifica rol de admin

    if (!req.file) {
        return res.status(400).json({ error: 'No file' });
    }

    const videoPath = req.file.path;
    const thumbnailName = req.file.filename.replace(/\.[^/.]+$/, '.jpg');
    const thumbnailPath = path.join('uploads', 'thumbnails', thumbnailName);

    // BUG INTENCIONAL: No verifica si FFmpeg está instalado
    // BUG INTENCIONAL: Path traversal posible
    ffmpeg(videoPath)
        .screenshots({
            timestamps: ['2'],
            filename: thumbnailName,
            folder: 'uploads/thumbnails/',
            size: '320x240'
        })
        .on('end', () => {
            // BUG INTENCIONAL: No limpia archivos temporales
            res.json({
                success: true,
                video: req.file.filename,
                thumbnail: thumbnailName
            });
        })
        .on('error', (err) => {
            // BUG INTENCIONAL: Expone stack trace
            res.status(500).json({ error: err.message, stack: err.stack });
        });
});

// POST /api/webhook/stripe
app.post('/api/webhook/stripe', (req, res) => {
    // BUG INTENCIONAL: No verifica firma de Stripe
    // BUG INTENCIONAL: Vulnerable a CSRF

    const { orderId, status } = req.body;
    const orders = readData('orders.json');

    const order = orders.find(o => o.id === orderId);

    if (order) {
        order.status = status;
        writeData('orders.json', orders);
    }

    res.json({ received: true });
});

// BUG INTENCIONAL: Endpoint que expone información sensible
app.get('/api/debug', (req, res) => {
    res.json({
        requestCount,
        secret: JWT_SECRET,
        env: process.env,
        users: readData('users.json')
    });
});

// BUG INTENCIONAL: No maneja errores globales
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('TODO: Agregar HTTPS');
    console.log('TODO: Implementar rate limiting');
    console.log('FIXME: Passwords en texto plano');
});
