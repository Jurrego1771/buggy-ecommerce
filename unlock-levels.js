const fs = require('fs');
const path = require('path');

// Sistema de desbloqueo de niveles
const levels = [
    {
        level: 0,
        name: 'Catálogo Básico',
        folder: 'level-0-locked',
        requirements: 'Ninguno',
        features: ['Ver productos', 'Búsqueda básica']
    },
    {
        level: 1,
        name: 'Sistema de Carrito',
        folder: 'level-1-locked',
        requirements: 'Completar nivel 0',
        features: ['Agregar al carrito', 'Persistencia localStorage']
    },
    {
        level: 2,
        name: 'Autenticación',
        folder: 'level-2-locked',
        requirements: 'Completar nivel 1',
        features: ['Login', 'Register', 'JWT']
    },
    {
        level: 3,
        name: 'Checkout y Pagos',
        folder: 'level-3-locked',
        requirements: 'Completar nivel 2',
        features: ['Proceso de pago', 'Historial de órdenes']
    },
    {
        level: 4,
        name: 'Panel Admin + FFmpeg',
        folder: 'level-4-locked',
        requirements: 'Completar nivel 3',
        features: ['Upload videos', 'Generación thumbnails', 'Gestión productos']
    }
];

function unlockLevel(levelNumber) {
    if (levelNumber < 0 || levelNumber >= levels.length) {
        console.error('Nivel inválido');
        return;
    }

    const level = levels[levelNumber];
    const folderPath = path.join(__dirname, 'levels', level.folder);

    // BUG INTENCIONAL: No verifica si la carpeta existe
    const newFolderName = level.folder.replace('-locked', '-unlocked');
    const newFolderPath = path.join(__dirname, 'levels', newFolderName);

    // BUG INTENCIONAL: Usa rename síncrono
    try {
        fs.renameSync(folderPath, newFolderPath);
        console.log(`✅ Nivel ${levelNumber} desbloqueado: ${level.name}`);
        console.log(`   Features: ${level.features.join(', ')}`);
    } catch (err) {
        console.error(`❌ Error desbloqueando nivel ${levelNumber}:`, err.message);
    }
}

function lockLevel(levelNumber) {
    if (levelNumber < 0 || levelNumber >= levels.length) {
        console.error('Nivel inválido');
        return;
    }

    const level = levels[levelNumber];
    const unlockedFolderName = level.folder.replace('-locked', '-unlocked');
    const unlockedFolderPath = path.join(__dirname, 'levels', unlockedFolderName);
    const lockedFolderPath = path.join(__dirname, 'levels', level.folder);

    try {
        fs.renameSync(unlockedFolderPath, lockedFolderPath);
        console.log(`🔒 Nivel ${levelNumber} bloqueado: ${level.name}`);
    } catch (err) {
        console.error(`❌ Error bloqueando nivel ${levelNumber}:`, err.message);
    }
}

function showLevels() {
    console.log('\n📊 SISTEMA DE NIVELES\n');
    levels.forEach((level, index) => {
        const folderPath = path.join(__dirname, 'levels', level.folder);
        const unlockedPath = path.join(__dirname, 'levels', level.folder.replace('-locked', '-unlocked'));

        const isUnlocked = fs.existsSync(unlockedPath);
        const status = isUnlocked ? '✅ DESBLOQUEADO' : '🔒 BLOQUEADO';

        console.log(`Nivel ${index}: ${level.name} - ${status}`);
        console.log(`  Requisitos: ${level.requirements}`);
        console.log(`  Features: ${level.features.join(', ')}\n`);
    });
}

// CLI
const args = process.argv.slice(2);
const command = args[0];
const levelNumber = parseInt(args[1]);

if (command === 'unlock') {
    unlockLevel(levelNumber);
} else if (command === 'lock') {
    lockLevel(levelNumber);
} else if (command === 'status') {
    showLevels();
} else {
    console.log('Uso:');
    console.log('  node unlock-levels.js unlock <nivel>');
    console.log('  node unlock-levels.js lock <nivel>');
    console.log('  node unlock-levels.js status');
}
