// Variables globales
let users = [];
let messages = [];

// Cargar datos de admin
function loadAdminData() {
    // Cargar usuarios desde localStorage
    users = JSON.parse(localStorage.getItem('ngl_users') || '[]');
    messages = JSON.parse(localStorage.getItem('ngl_messages') || '[]');
    
    // Mostrar usuarios
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = users.length > 0 ? users.map(user => `
        <div class="bg-black bg-opacity-50 p-4 rounded-xl border border-gray-600 hover:border-red-500 transition-colors">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="font-bold text-white text-lg">${user.username}</div>
                    <div class="text-sm text-gray-400">${user.email}</div>
                    <div class="text-xs text-gray-500 mt-1">Creado: ${new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="text-xs text-gray-400">
                    ID: ${user.uid.substring(0, 8)}...
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="text-center py-12 text-gray-400">
            <div class="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-2xl">👥</span>
            </div>
            <p class="text-lg">No hay usuarios registrados</p>
            <p class="text-sm mt-2">La plataforma está esperando usuarios</p>
        </div>
    `;
    
    // Mostrar mensajes
    const allMessagesList = document.getElementById('allMessagesList');
    allMessagesList.innerHTML = messages.length > 0 ? messages.map(msg => `
        <div class="bg-black bg-opacity-50 p-4 rounded-xl border border-gray-600 hover:border-red-500 transition-colors">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <div class="font-bold text-white text-lg">${msg.recipient}</div>
                    <div class="text-sm text-gray-400">De: ${msg.senderName}</div>
                </div>
                <div class="text-sm text-gray-400">
                    ${new Date(msg.createdAt).toLocaleString()}
                </div>
            </div>
            <div class="text-white">${msg.content}</div>
        </div>
    `).join('') : `
        <div class="text-center py-12 text-gray-400">
            <div class="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-2xl">💬</span>
            </div>
            <p class="text-lg">No hay mensajes</p>
            <p class="text-sm mt-2">La plataforma está esperando mensajes</p>
        </div>
    `;
    
    // Actualizar estadísticas
    updateStats();
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalMessages').textContent = messages.length;
    
    // Calcular mensajes de hoy
    const today = new Date().toDateString();
    const todayMessages = messages.filter(msg => 
        new Date(msg.createdAt).toDateString() === today
    );
    document.getElementById('totalToday').textContent = todayMessages.length;
}

// Verificar acceso de admin
function checkAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin');
    
    // Verificar si ya tiene sesión de admin
    const hasAdminSession = localStorage.getItem('adminSession');
    
    if (adminKey === 'ngl2024admin' || hasAdminSession) {
        if (adminKey === 'ngl2024admin') {
            // Pedir clave de administrador
            const adminPassword = prompt('Ingrese la clave de administrador:');
            if (adminPassword === 'Marcoc2010cubaCMG16') {
                // Establecer sesión de admin y cargar datos
                localStorage.setItem('adminSession', 'true');
                loadAdminData();
            } else if (adminPassword !== null) {
                alert('Clave de administrador incorrecta');
            }
        } else {
            // Ya tiene sesión, solo cargar datos
            loadAdminData();
        }
    } else {
        // Redirigir a página principal si no hay clave de admin ni sesión
        window.location.href = '../';
    }
}

// Cerrar sesión de admin
function logoutAdmin() {
    // Limpiar sesión de admin
    localStorage.removeItem('adminSession');
    // Redirigir a página principal
    window.location.href = '../';
}

// Auto-refrescar datos cada 5 segundos
function startAutoRefresh() {
    setInterval(() => {
        loadAdminData();
    }, 5000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    startAutoRefresh();
});
