// Variables globales
let users = [];
let messages = [];
let isLoggedIn = false;

// Función para verificar acceso y mostrar login
function checkAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin');
    const hasSession = localStorage.getItem('adminSession');
    
    // Siempre mostrar login en /admin/
    if (window.location.pathname.includes('/admin/')) {
        if (adminKey === 'ngl2024admin' || hasSession) {
            if (adminKey === 'ngl2024admin') {
                // Pedir clave
                const password = prompt('Ingrese la clave de administrador:');
                if (password === 'Marcoc2010cubaCMG16') {
                    loginSuccess();
                } else if (password !== null) {
                    alert('Clave incorrecta');
                }
            } else if (hasSession) {
                loginSuccess();
            }
        } else {
            // Pedir clave directamente
            const password = prompt('Ingrese la clave de administrador:');
            if (password === 'Marcoc2010cubaCMG16') {
                loginSuccess();
            } else if (password !== null) {
                alert('Clave incorrecta');
            }
        }
    }
}

// Función de login exitoso
function loginSuccess() {
    localStorage.setItem('adminSession', 'true');
    isLoggedIn = true;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadData();
}

// Función para cargar datos desde localStorage (MISMO SISTEMA QUE EL PROYECTO)
function loadData() {
    try {
        // Cargar desde localStorage usando las MISMAS claves que el proyecto principal
        users = JSON.parse(localStorage.getItem('ngl_users') || '[]');
        messages = JSON.parse(localStorage.getItem('ngl_messages') || '[]');
        
        console.log('Datos cargados del MISMO sistema:', { 
            users: users.length, 
            messages: messages.length 
        });
        
        displayUsers();
        displayMessages();
        updateStats();
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        showError('Error al cargar los datos del localStorage');
    }
}

// Función para mostrar usuarios (MISMA ESTRUCTURA QUE EL PROYECTO)
function displayUsers() {
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <div class="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl">👥</span>
                </div>
                <p class="text-lg">No hay usuarios registrados</p>
                <p class="text-sm mt-2">La plataforma está esperando usuarios</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = users.map(user => `
        <div class="admin-card p-4 hover-scale">
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
    `).join('');
}

// Función para mostrar mensajes (MISMA ESTRUCTURA QUE EL PROYECTO)
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        messagesList.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <div class="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-2xl">💬</span>
                </div>
                <p class="text-lg">No hay mensajes</p>
                <p class="text-sm mt-2">La plataforma está esperando mensajes</p>
            </div>
        `;
        return;
    }
    
    messagesList.innerHTML = messages.map(msg => `
        <div class="admin-card p-4 hover-scale">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <div class="font-bold text-white text-lg">${msg.recipientUsername || msg.recipient}</div>
                    <div class="text-sm text-gray-400">De: ${msg.senderName || 'Anónimo'}</div>
                </div>
                <div class="text-sm text-gray-400">
                    ${new Date(msg.createdAt).toLocaleString()}
                </div>
            </div>
            <div class="text-white">${msg.content}</div>
        </div>
    `).join('');
}

// Función para actualizar estadísticas
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

// Función para refrescar datos
function refreshData() {
    console.log('Refrescando datos...');
    loadData();
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('adminSession');
    isLoggedIn = false;
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

// Función para mostrar error
function showError(message) {
    const usersList = document.getElementById('usersList');
    const messagesList = document.getElementById('messagesList');
    
    const errorHTML = `
        <div class="text-center py-12 text-red-400">
            <div class="w-16 h-16 bg-red-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span class="text-2xl">❌</span>
            </div>
            <p class="text-lg">${message}</p>
            <p class="text-sm mt-2">Intenta recargar la página</p>
        </div>
    `;
    
    usersList.innerHTML = errorHTML;
    messagesList.innerHTML = errorHTML;
}

// Auto-refresco cada 30 segundos
setInterval(() => {
    if (isLoggedIn) {
        refreshData();
    }
}, 30000);

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    console.log('Panel de administrador cargado');
    checkAccess();
});
