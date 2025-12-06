
// Firebase collections
const COLLECTIONS = {
    USERS: 'users',
    PATIENTS: 'patients',
    MEDICATIONS: 'medications',
    PRESCRIPTIONS: 'prescriptions'
};

// Authentication (Firebase)
async function login(email, password) {
    console.log('Login attempt for email:', email.replace(/(.{2}).*(@.*)/, '$1***$2'));
    console.log('window.auth defined:', !!window.auth);
    try {
        console.log('Calling signInWithEmailAndPassword...');
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        console.log('Login successful for user:', userCredential.user.email);
        return userCredential.user;
    } catch (error) {
        console.error('Login error details:', {
            code: error.code,
            message: error.message,
            email: email
        });
        throw error;
    }
}

function logout() {
    window.signOut(window.auth).then(() => {
        showLogin();
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

function getCurrentUser() {
    return window.auth.currentUser;
}

function isLoggedIn() {
    return window.auth.currentUser !== null;
}

// Initialize demo data in Firebase
async function initializeData() {
    try {
        // Check if data already exists
        const users = await getData(COLLECTIONS.USERS);
        if (users.length > 0) return; // Data already initialized

        // Create demo users in Firestore (Note: Firebase Auth users need to be created manually or via admin SDK)
        // For demo purposes, we'll store user profiles that correspond to manually created Firebase Auth users
        const demoUsers = [
            {
                email: 'pharmacist@nawe.com',
                role: 'pharmacist',
                name: 'John Pharmacist',
                createdAt: new Date()
            },
            {
                email: 'charles@nawe.com',
                role: 'pharmacist',
                name: 'Charles User',
                createdAt: new Date()
            }
        ];

        for (const userData of demoUsers) {
            // Store user profile in Firestore with a known ID
            const userId = userData.email.split('@')[0] + '_user';
            await window.setDoc(window.doc(window.db, COLLECTIONS.USERS, userId), {
                email: userData.email,
                role: userData.role,
                name: userData.name,
                createdAt: userData.createdAt
            });
        }

        // Add medications
        const sampleMedications = [
            {
                name: 'Amoxicillin 500mg',
                description: 'Antibiotic for bacterial infections',
                category: 'Antibiotics',
                stock: 150,
                expiration: '2025-06-15'
            },
            {
                name: 'Lisinopril 10mg',
                description: 'ACE inhibitor for hypertension',
                category: 'Cardiovascular',
                stock: 75,
                expiration: '2025-08-20'
            },
            {
                name: 'Metformin 500mg',
                description: 'Oral diabetes medicine',
                category: 'Endocrine',
                stock: 200,
                expiration: '2025-12-01'
            },
            {
                name: 'Ibuprofen 200mg',
                description: 'NSAID for pain and inflammation',
                category: 'Pain Relief',
                stock: 8,
                expiration: '2025-03-10'
            },
            {
                name: 'Omeprazole 20mg',
                description: 'Proton pump inhibitor for acid reflux',
                category: 'Gastrointestinal',
                stock: 45,
                expiration: '2025-09-15'
            },
            {
                name: 'Atorvastatin 20mg',
                description: 'Statin for cholesterol management',
                category: 'Cardiovascular',
                stock: 60,
                expiration: '2025-11-30'
            }
        ];

        for (const med of sampleMedications) {
            await addData(COLLECTIONS.MEDICATIONS, med);
        }

        // Create demo patients
        const samplePatients = [
            {
                name: 'Sarah Johnson',
                dob: '1985-03-15',
                address: '32 Aberdeen Road, Freetown',
                phone: '+232 76 123 456',
                email: 'sarah.j@email.com'
            },
            {
                name: 'Michael Chen',
                dob: '1992-07-22',
                address: '15 Kissy Street, Freetown',
                phone: '+232 77 234 567',
                email: 'm.chen@email.com'
            },
            {
                name: 'Emily Davis',
                dob: '1978-11-08',
                address: '8 Wilkinson Road, Freetown',
                phone: '+232 78 345 678',
                email: 'emily.davis@email.com'
            }
        ];

        for (const patient of samplePatients) {
            await addData(COLLECTIONS.PATIENTS, patient);
        }

        console.log('Demo data initialized successfully');

    } catch (error) {
        console.error('Error initializing data:', error);
    }
}



// Data management functions (Firebase)
async function getData(collectionName) {
    try {
        const querySnapshot = await window.getDocs(window.collection(window.db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error('Error getting data:', error);
        return [];
    }
}

async function addData(collectionName, item) {
    try {
        const docRef = await window.addDoc(window.collection(window.db, collectionName), item);
        return { id: docRef.id, ...item };
    } catch (error) {
        console.error('Error adding data:', error);
        throw error;
    }
}

async function updateData(collectionName, id, updates) {
    try {
        const docRef = window.doc(window.db, collectionName, id);
        await window.updateDoc(docRef, updates);
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
}

async function deleteData(collectionName, id) {
    try {
        await window.deleteDoc(window.doc(window.db, collectionName, id));
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
}

// UI functions
function showSection(sectionName) {
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.style.display = 'block';
    }

    // Render content based on section
    if (sectionName === 'inventory') {
        renderInventory();
    }
    if (sectionName === 'prescriptions') {
        renderPrescriptions();
    }
    if (sectionName === 'patients') {
        renderPatients();
    }
    if (sectionName === 'reports') {
        generateInventoryReport();
        generatePrescriptionReport();
    }
}


async function showMain() {
    console.log('showMain called');
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    console.log('UI visibility updated');

    const user = getCurrentUser();
    console.log('Current user in showMain:', user ? user.email : 'none');
    if (!user) return;

    // Get user data from Firestore
    let userData = null;
    try {
        console.log('Fetching user data for:', user.email);
        if (user.email === 'pharmacist@nawe.com') {
            const userDoc = await window.getDoc(window.doc(window.db, COLLECTIONS.USERS, 'pharmacist_user'));
            userData = userDoc.data();
            console.log('User data retrieved:', userData);
        } else {
            // For patients, find by email
            const users = await getData(COLLECTIONS.USERS);
            userData = users.find(u => u.email === user.email);
            console.log('User data from patients:', userData);
        }
    } catch (error) {
        console.error('Error getting user data in showPatientDashboard:', error);
        userData = null;
    }

    console.log('User role:', userData ? userData.role : 'unknown');
    if (userData && userData.role === 'patient') {
        console.log('Showing patient dashboard');
        showPatientDashboard();
    } else {
        console.log('Showing pharmacist dashboard');
        showSection('dashboard');
        await updateDashboard();
    }
    await updateNavigation();
    console.log('showMain completed');
}

function showLogin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
    closeMobileMenu(); // Close mobile menu when logging out
}

function showModal(content) {
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.style.display = 'none';
}

// Role-based navigation
async function updateNavigation() {
    const user = getCurrentUser();
    const navLinks = document.getElementById('nav-links');
    const mobileMenu = document.getElementById('mobile-menu');

    if (user) {
        // Get user data from Firestore
        let userData = null;
        try {
            if (user.email === 'pharmacist@nawe.com') {
                const userDoc = await window.getDoc(window.doc(window.db, COLLECTIONS.USERS, 'pharmacist_user'));
                userData = userDoc.data();
            } else {
                // For patients, find by email
                const users = await getData(COLLECTIONS.USERS);
                userData = users.find(u => u.email === user.email);
            }
        } catch (error) {
            console.error('Error getting user data in updateNavigation:', error);
            userData = null;
        }

        if (userData && userData.role === 'patient') {
            navLinks.innerHTML = `
                <a href="#" onclick="showPatientDashboard()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">My Records</a>
                <a href="#" onclick="logout()" class="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition duration-200">Logout</a>
            `;
            mobileMenu.innerHTML = `
                <div class="flex flex-col space-y-2 px-4">
                    <a href="#" onclick="showPatientDashboard(); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">My Records</a>
                    <a href="#" onclick="logout(); closeMobileMenu()" class="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition duration-200">Logout</a>
                </div>
            `;
        } else {
            // Admin/Pharmacist navigation
            navLinks.innerHTML = `
                <a href="#" onclick="showSection('dashboard')" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Dashboard</a>
                <a href="#" onclick="showSection('inventory')" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Inventory</a>
                <a href="#" onclick="showSection('prescriptions')" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Prescriptions</a>
                <a href="#" onclick="showSection('patients')" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Patients</a>
                <a href="#" onclick="showSection('reports')" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Reports</a>
                <a href="#" onclick="logout()" class="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition duration-200">Logout</a>
            `;
            mobileMenu.innerHTML = `
                <div class="flex flex-col space-y-2 px-4">
                    <a href="#" onclick="showSection('dashboard'); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Dashboard</a>
                    <a href="#" onclick="showSection('inventory'); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Inventory</a>
                    <a href="#" onclick="showSection('prescriptions'); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Prescriptions</a>
                    <a href="#" onclick="showSection('patients'); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Patients</a>
                    <a href="#" onclick="showSection('reports'); closeMobileMenu()" class="hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded transition duration-200">Reports</a>
                    <a href="#" onclick="logout(); closeMobileMenu()" class="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition duration-200">Logout</a>
                </div>
            `;
        }
    }
}

// Dashboard
async function updateDashboard() {
    const meds = await getData(COLLECTIONS.MEDICATIONS);
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const patients = await getData(COLLECTIONS.PATIENTS);
    const lowStock = meds.filter(m => m.stock < 10).length;

    document.getElementById('total-meds').textContent = meds.length;
    document.getElementById('active-prescriptions').textContent = prescriptions.filter(p => p.status === 'active').length;
    document.getElementById('low-stock').textContent = lowStock;
    document.getElementById('total-patients').textContent = patients.length;
}

// Rendering functions
async function renderInventory() {
    const meds = await getData(COLLECTIONS.MEDICATIONS);
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
                    <button onclick="editMedication('${med.id}')" class="text-blue-600 mr-2">Edit</button>
                    <button onclick="deleteMedication('${med.id}')" class="text-red-600">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

async function renderPrescriptions() {
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
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

    const patients = await getData(COLLECTIONS.PATIENTS);
    prescriptions.forEach(prescription => {
        const patient = patients.find(p => p.id == prescription.patientId);
        const patientName = patient ? patient.name : 'Unknown';
        html += `
            <tr class="border-b">
                <td class="px-4 py-2">${patientName}</td>
                <td class="px-4 py-2">${prescription.date}</td>
                <td class="px-4 py-2">${prescription.status}</td>
                <td class="px-4 py-2">
                    <button onclick="viewPrescription('${prescription.id}')" class="text-blue-600 mr-2">View</button>
                    <button onclick="editPrescription('${prescription.id}')" class="text-green-600 mr-2">Edit</button>
                    ${prescription.status === 'active' ? `<button onclick="fillPrescription('${prescription.id}')" class="text-purple-600">Fill</button>` : ''}
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

async function renderPatients() {
    const patients = await getData(COLLECTIONS.PATIENTS);
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
                    <button onclick="editPatient('${patient.id}')" class="text-blue-600 mr-2">Edit</button>
                    <button onclick="deletePatient('${patient.id}')" class="text-red-600">Delete</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Action functions
async function editMedication(id) {
    const meds = await getData(COLLECTIONS.MEDICATIONS);
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

    document.getElementById('edit-med-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            expiration: formData.get('expiration')
        };
        await updateData(COLLECTIONS.MEDICATIONS, id, updates);
        hideModal();
        await updateDashboard();
        await renderInventory();
    });
}

async function deleteMedication(id) {
    if (confirm('Are you sure you want to delete this medication?')) {
        await deleteData(COLLECTIONS.MEDICATIONS, id);
        await renderInventory();
        await updateDashboard();
    }
}

// Patient dashboard
async function showPatientDashboard() {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    const user = getCurrentUser();
    if (!user) return;

    // Get user data from Firestore
    const users = await getData(COLLECTIONS.USERS);
    const userData = users.find(u => u.email === user.email);

    // Check if user has patientId
    if (!userData || !userData.patientId) {
        alert('Your account is not properly configured as a patient. Please contact the administrator.');
        logout();
        return;
    }

    const patients = await getData(COLLECTIONS.PATIENTS);
    const patient = patients.find(p => p.id == userData.patientId);

    // Check if patient record exists
    if (!patient) {
        alert('Your patient record was not found. Please contact the administrator.');
        logout();
        return;
    }

    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const userPrescriptions = prescriptions.filter(pr => pr.patientId == userData.patientId);

    const container = document.getElementById('main-content');

    let html = `
        <div class="container mx-auto p-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">My Health Records</h2>
                <p class="text-gray-600">View your personal information and prescription history</p>
            </div>

            <!-- Patient Info -->
            <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Name:</strong> ${patient ? patient.name : 'N/A'}</div>
                    <div><strong>Date of Birth:</strong> ${patient ? patient.dob : 'N/A'}</div>
                    <div><strong>Phone:</strong> ${patient ? patient.phone : 'N/A'}</div>
                    <div><strong>Email:</strong> ${patient ? patient.email : 'N/A'}</div>
                    <div class="md:col-span-2"><strong>Address:</strong> ${patient ? patient.address : 'N/A'}</div>
                </div>
            </div>

            <!-- Prescriptions -->
            <div class="bg-white p-6 rounded-xl shadow-lg">
                <h3 class="text-xl font-bold text-gray-800 mb-4">My Prescriptions</h3>
    `;

    if (userPrescriptions.length === 0) {
        html += '<p class="text-gray-500">No prescriptions found.</p>';
    } else {
        html += `
            <div class="space-y-4">
        `;
        const medications = await getData(COLLECTIONS.MEDICATIONS);
        userPrescriptions.forEach(prescription => {
            const itemsHtml = prescription.items.map(item => {
                const med = medications.find(m => m.id == item.medicationId);
                return med ? `${med.name} (${item.quantity})` : 'Unknown medication';
            }).join(', ');

            html += `
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-medium">Date: ${prescription.date}</span>
                        <span class="px-2 py-1 rounded text-sm ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                            ${prescription.status}
                        </span>
                    </div>
                    <div class="mb-2"><strong>Medications:</strong> ${itemsHtml}</div>
                    <div><strong>Instructions:</strong> ${prescription.instructions || 'No instructions provided'}</div>
                </div>
            `;
        });
        html += '</div>';
    }

    html += `
            </div>
        </div>
    `;

    // Insert the patient dashboard content
    const dashboardSection = document.getElementById('dashboard-section');
    dashboardSection.innerHTML = html;
    dashboardSection.style.display = 'block';
}

async function viewPrescription(id) {
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const prescription = prescriptions.find(p => p.id == id);
    if (!prescription) return;

    const patients = await getData(COLLECTIONS.PATIENTS);
    const patient = patients.find(p => p.id == prescription.patientId);
    const patientName = patient ? patient.name : 'Unknown';

    const medications = await getData(COLLECTIONS.MEDICATIONS);
    let itemsHtml = prescription.items.map(item => {
        const med = medications.find(m => m.id == item.medicationId);
        return med ? `<li class="mb-2 p-2 bg-gray-50 rounded">${med.name} - Quantity: ${item.quantity}</li>` : '<li>Unknown medication</li>';
    }).join('');

    const modalContent = `
        <h3 class="text-xl font-bold mb-4">Prescription Details</h3>
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><strong>Patient:</strong> ${patientName}</div>
                <div><strong>Date:</strong> ${prescription.date}</div>
                <div><strong>Status:</strong> <span class="px-2 py-1 rounded text-sm ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">${prescription.status}</span></div>
            </div>
            <div>
                <strong>Medications:</strong>
                <ul class="mt-2">${itemsHtml}</ul>
            </div>
            ${prescription.instructions ? `<div><strong>Instructions:</strong> ${prescription.instructions}</div>` : ''}
        </div>
        <div class="flex justify-end mt-6">
            <button onclick="hideModal()" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Close</button>
        </div>
    `;

    showModal(modalContent);
}

async function editPrescription(id) {
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const prescription = prescriptions.find(p => p.id == id);
    if (!prescription) return;

    const patients = await getData(COLLECTIONS.PATIENTS);
    const medications = await getData(COLLECTIONS.MEDICATIONS);

    let patientOptions = patients.map(p => `<option value="${p.id}" ${p.id == prescription.patientId ? 'selected' : ''}>${p.name}</option>`).join('');

    let medOptions = medications.map(m => {
        const existingItem = prescription.items.find(item => item.medicationId == m.id);
        const checked = existingItem ? 'checked' : '';
        const quantity = existingItem ? existingItem.quantity : '';
        return `<div class="flex items-center mb-2">
            <input type="checkbox" name="medications" value="${m.id}" ${checked} class="mr-2">
            <label>${m.name} (Stock: ${m.stock})</label>
            <input type="number" name="quantity_${m.id}" value="${quantity}" placeholder="Qty" class="ml-2 w-16 p-1 border rounded" min="1">
        </div>`;
    }).join('');

    const form = `
        <h3 class="text-xl mb-4">Edit Prescription</h3>
        <form id="edit-prescription-form">
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
                <textarea name="instructions" class="w-full p-2 border rounded">${prescription.instructions || ''}</textarea>
            </div>
            <div class="mb-4">
                <label class="block">Status</label>
                <select name="status" class="w-full p-2 border rounded">
                    <option value="active" ${prescription.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="filled" ${prescription.status === 'filled' ? 'selected' : ''}>Filled</option>
                    <option value="cancelled" ${prescription.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update Prescription</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('edit-prescription-form').addEventListener('submit', async function(e) {
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

        const updates = {
            patientId: formData.get('patientId'),
            items: selectedMeds,
            instructions: formData.get('instructions'),
            status: formData.get('status')
        };
        await updateData(COLLECTIONS.PRESCRIPTIONS, id, updates);
        hideModal();
        await updateDashboard();
        await renderPrescriptions();
    });
}

async function fillPrescription(id) {
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const prescription = prescriptions.find(p => p.id == id);
    if (!prescription || prescription.status !== 'active') return;

    const medications = await getData(COLLECTIONS.MEDICATIONS);
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
    for (const item of prescription.items) {
        const med = medications.find(m => m.id == item.medicationId);
        if (med) {
            await updateData(COLLECTIONS.MEDICATIONS, med.id, { stock: med.stock - item.quantity });
        }
    }

    // Update prescription status
    await updateData(COLLECTIONS.PRESCRIPTIONS, id, { status: 'filled' });

    // Re-render
    await renderPrescriptions();
    await updateDashboard();
    alert('Prescription filled successfully!');
}

async function editPatient(id) {
    const patients = await getData(COLLECTIONS.PATIENTS);
    const patient = patients.find(p => p.id == id);
    if (!patient) return;

    const form = `
        <h3 class="text-xl mb-4">Edit Patient</h3>
        <form id="edit-patient-form">
            <div class="mb-4">
                <label class="block">Name</label>
                <input type="text" name="name" value="${patient.name}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Date of Birth</label>
                <input type="date" name="dob" value="${patient.dob}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Address</label>
                <textarea name="address" class="w-full p-2 border rounded" required>${patient.address}</textarea>
            </div>
            <div class="mb-4">
                <label class="block">Phone</label>
                <input type="tel" name="phone" value="${patient.phone}" class="w-full p-2 border rounded" required>
            </div>
            <div class="mb-4">
                <label class="block">Email</label>
                <input type="email" name="email" value="${patient.email || ''}" class="w-full p-2 border rounded">
            </div>
            <div class="flex justify-end">
                <button type="button" onclick="hideModal()" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Update Patient</button>
            </div>
        </form>
    `;
    showModal(form);

    document.getElementById('edit-patient-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };
        await updateData(COLLECTIONS.PATIENTS, id, updates);
        hideModal();
        await renderPatients();
    });
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        await deleteData(COLLECTIONS.PATIENTS, id);
        await renderPatients();
    }
}

// Reset demo data
async function resetData() {
    try {
        // Clear all collections and re-initialize
        const collections = [COLLECTIONS.MEDICATIONS, COLLECTIONS.PATIENTS, COLLECTIONS.PRESCRIPTIONS];

        for (const collectionName of collections) {
            const data = await getData(collectionName);
            for (const item of data) {
                await deleteData(collectionName, item.id);
            }
        }

        // Re-initialize demo data
        await initializeData();
        alert('Demo data has been reset. You can now login with the demo credentials.');
    } catch (error) {
        console.error('Error resetting data:', error);
        alert('Error resetting data: ' + error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Firebase auth state listener
    window.onAuthStateChanged(window.auth, async (user) => {
        console.log('Auth state changed:', user ? 'signed in as ' + user.email : 'signed out');
        if (user) {
            // User is signed in
            console.log('Initializing data...');
            initializeData().catch(error => console.error('Error initializing data:', error));
            console.log('Calling showMain...');
            showMain();
        } else {
            // User is signed out
            console.log('Calling showLogin...');
            showLogin();
        }
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Login form submitted with email:', email.replace(/(.{2}).*(@.*)/, '$1***$2'));

        try {
            await login(email, password);
            // Auth state change will trigger showMain()
        } catch (error) {
            console.error('Login form error:', error.message);
            alert('Login failed: ' + error.message);
        }
    });

    // Hamburger menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
    }

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

    document.getElementById('add-med-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const med = {
            name: formData.get('name'),
            description: formData.get('description'),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            expiration: formData.get('expiration')
        };
        await addData(COLLECTIONS.MEDICATIONS, med);
        hideModal();
        await updateDashboard();
        await renderInventory();
    });
}

async function showAddPrescriptionForm() {
    const patients = await getData(COLLECTIONS.PATIENTS);
    const medications = await getData(COLLECTIONS.MEDICATIONS);

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

    document.getElementById('add-prescription-form').addEventListener('submit', async function(e) {
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
            patientId: formData.get('patientId'),
            items: selectedMeds,
            instructions: formData.get('instructions'),
            date: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        await addData(COLLECTIONS.PRESCRIPTIONS, prescription);
        hideModal();
        await updateDashboard();
        await renderPrescriptions();
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

    document.getElementById('add-patient-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const patient = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };
        const newPatient = await addData(COLLECTIONS.PATIENTS, patient);

        // Generate login credentials (user needs to manually create in Firebase Auth)
        const nameParts = patient.name.toLowerCase().split(' ');
        const lastName = nameParts[nameParts.length - 1];
        const password = '123' + lastName;

        // Store user profile in Firestore (will be linked when user logs in)
        const userId = patient.email.replace('@', '_').replace('.', '_');
        await window.setDoc(window.doc(window.db, COLLECTIONS.USERS, userId), {
            email: patient.email,
            role: 'patient',
            name: patient.name,
            patientId: newPatient.id,
            createdAt: new Date()
        });

        hideModal();
        await renderPatients();
        alert(`Patient added successfully!\n\nTo enable login, manually create user in Firebase Auth:\nEmail: ${patient.email}\nPassword: ${password}\n\nThen the patient can login with these credentials.`);
    });
}

// Reports functions
function renderReports() {
    // Clear previous reports
    document.getElementById('inventory-report').innerHTML = '';
    document.getElementById('prescription-report').innerHTML = '';
}

async function generateInventoryReport() {
    const meds = await getData(COLLECTIONS.MEDICATIONS);
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

async function generatePrescriptionReport() {
    const prescriptions = await getData(COLLECTIONS.PRESCRIPTIONS);
    const activePrescriptions = prescriptions.filter(p => p.status === 'active');
    const filledPrescriptions = prescriptions.filter(p => p.status === 'filled');

    // Most prescribed medications
    const medications = await getData(COLLECTIONS.MEDICATIONS);
    const medCounts = {};
    prescriptions.forEach(p => {
        p.items.forEach(item => {
            const med = medications.find(m => m.id == item.medicationId);
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