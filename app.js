
const STORAGE_KEYS = {
    USERS: 'pharma_users',
    PATIENTS: 'pharma_patients',
    MEDICATIONS: 'pharma_medications',
    PRESCRIPTIONS: 'pharma_prescriptions',
    CURRENT_USER: 'pharma_current_user'
};

// Initialize data if not exists
function initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: hashPassword('admin123'),
                role: 'admin',
                name: 'Administrator',
                email: 'admin@pharma.com'
            },
            {
                id: 2,
                username: 'pharmacist',
                password: hashPassword('pharm123'),
                role: 'pharmacist',
                name: 'John Pharmacist',
                email: 'john@pharma.com'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
        const samplePatients = [
            {
                id: 1,
                name: 'Sarah Johnson',
                dob: '1985-03-15',
                address: '32 Aberdeen Road, Freetown',
                phone: '+232 76 123 456',
                email: 'sarah.j@email.com'
            },
            {
                id: 2,
                name: 'Michael Chen',
                dob: '1992-07-22',
                address: '15 Kissy Street, Freetown',
                phone: '+232 77 234 567',
                email: 'm.chen@email.com'
            },
            {
                id: 3,
                name: 'Emily Davis',
                dob: '1978-11-08',
                address: '8 Wilkinson Road, Freetown',
                phone: '+232 78 345 678',
                email: 'emily.davis@email.com'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(samplePatients));
    }

    if (!localStorage.getItem(STORAGE_KEYS.MEDICATIONS)) {
        const sampleMedications = [
            {
                id: 1,
                name: 'Amoxicillin 500mg',
                description: 'Antibiotic for bacterial infections',
                category: 'Antibiotics',
                stock: 150,
                expiration: '2025-06-15'
            },
            {
                id: 2,
                name: 'Lisinopril 10mg',
                description: 'ACE inhibitor for hypertension',
                category: 'Cardiovascular',
                stock: 75,
                expiration: '2025-08-20'
            },
            {
                id: 3,
                name: 'Metformin 500mg',
                description: 'Oral diabetes medicine',
                category: 'Endocrine',
                stock: 200,
                expiration: '2025-12-01'
            },
            {
                id: 4,
                name: 'Ibuprofen 200mg',
                description: 'NSAID for pain and inflammation',
                category: 'Pain Relief',
                stock: 8,
                expiration: '2025-03-10'
            },
            {
                id: 5,
                name: 'Omeprazole 20mg',
                description: 'Proton pump inhibitor for acid reflux',
                category: 'Gastrointestinal',
                stock: 45,
                expiration: '2025-09-15'
            },
            {
                id: 6,
                name: 'Atorvastatin 20mg',
                description: 'Statin for cholesterol management',
                category: 'Cardiovascular',
                stock: 60,
                expiration: '2025-11-30'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(sampleMedications));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS)) {
        const samplePrescriptions = [
            {
                id: 1,
                patientId: 1,
                items: [
                    { medicationId: 1, quantity: 30 },
                    { medicationId: 5, quantity: 14 }
                ],
                instructions: 'Take Amoxicillin 3 times daily with food. Take Omeprazole once daily.',
                date: '2024-12-01',
                status: 'filled'
            },
            {
                id: 2,
                patientId: 2,
                items: [
                    { medicationId: 2, quantity: 30 },
                    { medicationId: 6, quantity: 30 }
                ],
                instructions: 'Take once daily in the morning.',
                date: '2024-12-02',
                status: 'active'
            },
            {
                id: 3,
                patientId: 3,
                items: [
                    { medicationId: 3, quantity: 60 }
                ],
                instructions: 'Take twice daily with meals.',
                date: '2024-12-03',
                status: 'active'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(samplePrescriptions));
    }
}

// Simple password hashing (not secure for production)
function hashPassword(password) {
    return btoa(password); // Base64 encoding for demo
}

// Authentication
function login(username, password) {
    const users = getData(STORAGE_KEYS.USERS);
    const user = users.find(u => u.username === username && u.password === hashPassword(password));
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    showLogin();
}

function getCurrentUser() {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Data management functions
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function addData(key, item) {
    const data = getData(key);
    item.id = Date.now(); // Simple ID generation
    data.push(item);
    saveData(key, data);
    return item;
}

function updateData(key, id, updates) {
    const data = getData(key);
    const index = data.findIndex(item => item.id == id);
    if (index !== -1) {
        data[index] = { ...data[index], ...updates };
        saveData(key, data);
    }
}

function deleteData(key, id) {
    const data = getData(key);
    const filtered = data.filter(item => item.id != id);
    saveData(key, filtered);
}

// UI functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.classList.remove('hidden');
    }

    // Render content based on section
    if (sectionName === 'inventory') renderInventory();
    if (sectionName === 'prescriptions') renderPrescriptions();
    if (sectionName === 'patients') renderPatients();
}

function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('main-content').classList.add('hidden');
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.add('hidden');
    navLinks.classList.remove('flex');
}

function showMain() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('hidden');
    navLinks.classList.add('flex');
    showSection('dashboard');
    updateDashboard();
}

function showModal(content) {
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal').classList.remove('hidden');
}

function hideModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Dashboard
function updateDashboard() {
    const meds = getData(STORAGE_KEYS.MEDICATIONS);
    const prescriptions = getData(STORAGE_KEYS.PRESCRIPTIONS);
    const patients = getData(STORAGE_KEYS.PATIENTS);
    const lowStock = meds.filter(m => m.stock < 10).length;

    document.getElementById('total-meds').textContent = meds.length;
    document.getElementById('active-prescriptions').textContent = prescriptions.filter(p => p.status === 'active').length;
    document.getElementById('low-stock').textContent = lowStock;
    document.getElementById('total-patients').textContent = patients.length;
}

// Rendering functions
function renderInventory() {
    const meds = getData(STORAGE_KEYS.MEDICATIONS);
    const container = document.getElementById('inventory-list');

    if (meds.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No medications in inventory.</p>';
        return;
    }

    let html = `
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-gray-200">
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">Category</th>
                    <th class="px-4 py-2 text-left">Stock</th>
                    <th class="px-4 py-2 text-left">Expiration</th>
                    <th class="px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    meds.forEach(med => {
        const stockClass = med.stock < 10 ? 'text-red-600 font-bold' : 'text-green-600';
        html += `
            <tr class="border-b">
                <td class="px-4 py-2">${med.name}</td>
                <td class="px-4 py-2">${med.category}</td>
                <td class="px-4 py-2 ${stockClass}">${med.stock}</td>
                <td class="px-4 py-2">${med.expiration}</td>
                <td class="px-4 py-2">
                    <button onclick="editMedication(${med.id})" class="text-blue-600 mr-2">Edit</button>
                    <button onclick="deleteMedication(${med.id})" class="text-red-600">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderPrescriptions() {
    const prescriptions = getData(STORAGE_KEYS.PRESCRIPTIONS);
    const container = document.getElementById('prescriptions-list');

    if (prescriptions.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No prescriptions found.</p>';
        return;
    }

    let html = `
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-gray-200">
                    <th class="px-4 py-2 text-left">Patient</th>
                    <th class="px-4 py-2 text-left">Date</th>
                    <th class="px-4 py-2 text-left">Status</th>
                    <th class="px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    prescriptions.forEach(prescription => {
        const patient = getData(STORAGE_KEYS.PATIENTS).find(p => p.id == prescription.patientId);
        const patientName = patient ? patient.name : 'Unknown';
        html += `
            <tr class="border-b">
                <td class="px-4 py-2">${patientName}</td>
                <td class="px-4 py-2">${prescription.date}</td>
                <td class="px-4 py-2">${prescription.status}</td>
                <td class="px-4 py-2">
                    <button onclick="viewPrescription(${prescription.id})" class="text-blue-600 mr-2">View</button>
                    <button onclick="editPrescription(${prescription.id})" class="text-green-600 mr-2">Edit</button>
                    ${prescription.status === 'active' ? `<button onclick="fillPrescription(${prescription.id})" class="text-purple-600">Fill</button>` : ''}
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderPatients() {
    const patients = getData(STORAGE_KEYS.PATIENTS);
    const container = document.getElementById('patients-list');

    if (patients.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No patients registered.</p>';
        return;
    }

    let html = `
        <table class="w-full table-auto">
            <thead>
                <tr class="bg-gray-200">
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">DOB</th>
                    <th class="px-4 py-2 text-left">Phone</th>
                    <th class="px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    patients.forEach(patient => {
        html += `
            <tr class="border-b">
                <td class="px-4 py-2">${patient.name}</td>
                <td class="px-4 py-2">${patient.dob}</td>
                <td class="px-4 py-2">${patient.phone}</td>
                <td class="px-4 py-2">
                    <button onclick="editPatient(${patient.id})" class="text-blue-600 mr-2">Edit</button>
                    <button onclick="deletePatient(${patient.id})" class="text-red-600">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Action functions
function editMedication(id) {
    const meds = getData(STORAGE_KEYS.MEDICATIONS);
    const med = meds.find(m => m.id == id);
    if (!med) return;

    const form = `
        <h3 class="text-xl mb-4">Edit Medication</h3>
        <form id="edit-med-form">
            <div class="mb-4">
                <label class="block">Name</label>
                <input type="text" name="name" value="${med.name}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Description</label>
                <textarea name="description" class="w-full p-2 border rounded" required>${med.description}</textarea>
            </div>
            <div class="mb-4">
                <label class="block">Category</label>
                <input type="text" name="category" value="${med.category}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Stock</label>
                <input type="number" name="stock" value="${med.stock}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Expiration Date</label>
                <input type="date" name="expiration" value="${med.expiration}" class="w-full p-2 border rounded" required>
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('edit-med-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            expiration: formData.get('expiration')
        };
        updateData(STORAGE_KEYS.MEDICATIONS, id, updates);
        hideModal();
        updateDashboard();
        renderInventory();
    });
}

function deleteMedication(id) {
    if (confirm('Are you sure you want to delete this medication?')) {
        deleteData(STORAGE_KEYS.MEDICATIONS, id);
        renderInventory();
        updateDashboard();
    }
}

function viewPrescription(id) {
    // TODO: Implement view prescription details
    alert('View prescription - to be implemented');
}

function editPrescription(id) {
    // TODO: Implement edit prescription
    alert('Edit prescription - to be implemented');
}

function fillPrescription(id) {
    const prescriptions = getData(STORAGE_KEYS.PRESCRIPTIONS);
    const prescription = prescriptions.find(p => p.id == id);
    if (!prescription || prescription.status !== 'active') return;

    const medications = getData(STORAGE_KEYS.MEDICATIONS);
    let canFill = true;
    let insufficientStock = [];

    // Check if all medications have sufficient stock
    prescription.items.forEach(item => {
        const med = medications.find(m => m.id == item.medicationId);
        if (med && med.stock < item.quantity) {
            canFill = false;
            insufficientStock.push(`${med.name} (available: ${med.stock}, needed: ${item.quantity})`);
        }
    });

    if (!canFill) {
        alert(`Cannot fill prescription. Insufficient stock:\n${insufficientStock.join('\n')}`);
        return;
    }

    // Update stock levels
    prescription.items.forEach(item => {
        const med = medications.find(m => m.id == item.medicationId);
        if (med) {
            updateData(STORAGE_KEYS.MEDICATIONS, med.id, { stock: med.stock - item.quantity });
        }
    });

    // Update prescription status
    updateData(STORAGE_KEYS.PRESCRIPTIONS, id, { status: 'filled' });

    // Re-render
    renderPrescriptions();
    updateDashboard();
    alert('Prescription filled successfully!');
}

function editPatient(id) {
    // TODO: Implement edit patient
    alert('Edit patient - to be implemented');
}

function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        deleteData(STORAGE_KEYS.PATIENTS, id);
        renderPatients();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeData();

    if (isLoggedIn()) {
        showMain();
    } else {
        showLogin();
    }

    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (login(username, password)) {
            showMain();
        } else {
            alert('Invalid credentials');
        }
    });

});

// Placeholder functions for forms (to be implemented)
function showAddMedForm() {
    const form = `
        <h3 class="text-xl mb-4">Add Medication</h3>
        <form id="add-med-form">
            <div class="mb-4">
                <label class="block">Name</label>
                <input type="text" name="name" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Description</label>
                <textarea name="description" class="w-full p-2 border rounded" required></textarea>
            </div>
            <div class="mb-4">
                <label class="block">Category</label>
                <input type="text" name="category" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Stock</label>
                <input type="number" name="stock" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Expiration Date</label>
                <input type="date" name="expiration" class="w-full p-2 border rounded" required>
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('add-med-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const med = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            expiration: formData.get('expiration')
        };
        addData(STORAGE_KEYS.MEDICATIONS, med);
        hideModal();
        updateDashboard();
        renderInventory();
    });
}

function showAddPrescriptionForm() {
    const patients = getData(STORAGE_KEYS.PATIENTS);
    const medications = getData(STORAGE_KEYS.MEDICATIONS);

    if (patients.length === 0) {
        alert('Please add patients first');
        return;
    }

    if (medications.length === 0) {
        alert('Please add medications first');
        return;
    }

    let patientOptions = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    let medOptions = medications.map(m => `<div class="flex items-center mb-2">
        <input type="checkbox" name="medications" value="${m.id}" class="mr-2">
        <label>${m.name} (Stock: ${m.stock})</label>
        <input type="number" name="quantity_${m.id}" placeholder="Qty" class="ml-2 w-16 p-1 border rounded" min="1">
    </div>`).join('');

    const form = `
        <h3 class="text-xl mb-4">Add Prescription</h3>
        <form id="add-prescription-form">
            <div class="mb-4">
                <label class="block">Patient</label>
                <select name="patientId" class="w-full p-2 border rounded" required>
                    <option value="">Select Patient</option>
                    ${patientOptions}
                </select>
            </div>
            <div class="mb-4">
                <label class="block">Medications</label>
                ${medOptions}
            </div>
            <div class="mb-4">
                <label class="block">Instructions</label>
                <textarea name="instructions" class="w-full p-2 border rounded"></textarea>
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Add Prescription</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('add-prescription-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedMeds = [];
        medications.forEach(m => {
            const checkbox = document.querySelector(`input[name="medications"][value="${m.id}"]`);
            if (checkbox && checkbox.checked) {
                const qty = parseInt(document.querySelector(`input[name="quantity_${m.id}"]`).value) || 1;
                selectedMeds.push({ medicationId: m.id, quantity: qty });
            }
        });

        if (selectedMeds.length === 0) {
            alert('Please select at least one medication');
            return;
        }

        const prescription = {
            patientId: parseInt(formData.get('patientId')),
            items: selectedMeds,
            instructions: formData.get('instructions'),
            date: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        addData(STORAGE_KEYS.PRESCRIPTIONS, prescription);
        hideModal();
        updateDashboard();
        renderPrescriptions();
    });
}

function showAddPatientForm() {
    const form = `
        <h3 class="text-xl mb-4">Add Patient</h3>
        <form id="add-patient-form">
            <div class="mb-4">
                <label class="block">Name</label>
                <input type="text" name="name" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Date of Birth</label>
                <input type="date" name="dob" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Address</label>
                <textarea name="address" class="w-full p-2 border rounded" required></textarea>
            </div>
            <div class="mb-4">
                <label class="block">Phone</label>
                <input type="tel" name="phone" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Email</label>
                <input type="email" name="email" class="w-full p-2 border rounded">
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Add Patient</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('add-patient-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const patient = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };
        addData(STORAGE_KEYS.PATIENTS, patient);
        hideModal();
        renderPatients();
    });
}

// Reports functions
function renderReports() {
    // Clear previous reports
    document.getElementById('inventory-report').innerHTML = '';
    document.getElementById('prescription-report').innerHTML = '';
}

function generateInventoryReport() {
    const meds = getData(STORAGE_KEYS.MEDICATIONS);
    const lowStock = meds.filter(m => m.stock < 10);
    const expiringSoon = meds.filter(m => {
        const expDate = new Date(m.expiration);
        const now = new Date();
        const daysDiff = (expDate - now) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30 && daysDiff > 0;
    });

    const totalValue = meds.reduce((sum, m) => sum + m.stock, 0);
    const categories = [...new Set(meds.map(m => m.category))];

    const report = `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div class="text-2xl font-bold text-blue-600">${meds.length}</div>
                <div class="text-sm text-blue-700">Total Medications</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <div class="text-2xl font-bold text-green-600">${totalValue}</div>
                <div class="text-sm text-green-700">Total Stock Units</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <div class="text-2xl font-bold text-yellow-600">${lowStock.length}</div>
                <div class="text-sm text-yellow-700">Low Stock Items</div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <div class="text-2xl font-bold text-red-600">${expiringSoon.length}</div>
                <div class="text-sm text-red-700">Expiring Soon</div>
            </div>
        </div>

        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">📂 Categories (${categories.length})</h4>
                <div class="flex flex-wrap gap-2">
                    ${categories.map(cat => `<span class="bg-gray-100 px-3 py-1 rounded-full text-sm">${cat}</span>`).join('')}
                </div>
            </div>

            ${lowStock.length > 0 ? `
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2 text-yellow-700">⚠️ Low Stock Alert</h4>
                    <div class="bg-yellow-50 p-3 rounded-lg">
                        ${lowStock.map(m => `<div class="text-sm">• ${m.name} (${m.stock} units)</div>`).join('')}
                    </div>
                </div>
            ` : ''}

            ${expiringSoon.length > 0 ? `
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2 text-red-700">⏰ Expiration Alert</h4>
                    <div class="bg-red-50 p-3 rounded-lg">
                        ${expiringSoon.map(m => `<div class="text-sm">• ${m.name} (${m.expiration})</div>`).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('inventory-report').innerHTML = report;
}

function generatePrescriptionReport() {
    const prescriptions = getData(STORAGE_KEYS.PRESCRIPTIONS);
    const activePrescriptions = prescriptions.filter(p => p.status === 'active');
    const filledPrescriptions = prescriptions.filter(p => p.status === 'filled');

    // Most prescribed medications
    const medCounts = {};
    prescriptions.forEach(p => {
        p.items.forEach(item => {
            const med = getData(STORAGE_KEYS.MEDICATIONS).find(m => m.id == item.medicationId);
            if (med) {
                medCounts[med.name] = (medCounts[med.name] || 0) + item.quantity;
            }
        });
    });

    const topMeds = Object.entries(medCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    const report = `
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div class="text-2xl font-bold text-blue-600">${prescriptions.length}</div>
                <div class="text-sm text-blue-700">Total Prescriptions</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <div class="text-2xl font-bold text-green-600">${activePrescriptions.length}</div>
                <div class="text-sm text-green-700">Active Prescriptions</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <div class="text-2xl font-bold text-purple-600">${filledPrescriptions.length}</div>
                <div class="text-sm text-purple-700">Filled Prescriptions</div>
            </div>
        </div>

        <div class="space-y-4">
            <div>
                <h4 class="font-semibold text-gray-800 mb-3">🏆 Top 5 Most Prescribed Medications</h4>
                ${topMeds.length > 0 ? `
                    <div class="space-y-2">
                        ${topMeds.map(([name, count], index) => `
                            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div class="flex items-center">
                                    <span class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        ${index + 1}
                                    </span>
                                    <span class="font-medium">${name}</span>
                                </div>
                                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    ${count} units
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="text-gray-500 italic">No prescription data available</p>'}
            </div>

            <div>
                <h4 class="font-semibold text-gray-800 mb-3">📈 Recent Activity</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div class="text-lg font-bold text-green-600">${filledPrescriptions.filter(p => {
                                const daysSince = (new Date() - new Date(p.date)) / (1000 * 60 * 60 * 24);
                                return daysSince <= 7;
                            }).length}</div>
                            <div class="text-sm text-gray-600">Filled this week</div>
                        </div>
                        <div>
                            <div class="text-lg font-bold text-blue-600">${activePrescriptions.length}</div>
                            <div class="text-sm text-gray-600">Pending fulfillment</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('prescription-report').innerHTML = report;
}