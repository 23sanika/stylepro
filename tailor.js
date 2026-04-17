document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(async user => {
        if (!user) {
            window.location.href = 'auth.html';
            return;
        }
        
        let userDoc;
        try {
            userDoc = await db.collection('users').doc(user.uid).get();
        } catch(e) {}
        
        const role = userDoc && userDoc.exists ? userDoc.data().role : null;
        if (role !== 'tailor' && user.email !== 'tailor@stylepro.com') {
            window.location.href = 'profile.html';
            return;
        }
        
        const name = userDoc && userDoc.exists ? userDoc.data().name : 'Tailor';
        document.getElementById('tailorName').textContent = 'Welcome, ' + name;
        loadTailorData();
    });
});

function switchView(viewName, element) {
    document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');
    
    document.getElementById('pageTitle').textContent = viewName === 'orders' ? 'Orders & Measurements' : 'Custom Design Requests';
}

function tailorLogout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

async function loadTailorData() {
    let orders = [];
    let requests = [];
    
    try {
        const [ordersSnap, requestsSnap] = await Promise.all([
            db.collection('orders').orderBy('date', 'desc').get().catch(() => db.collection('orders').get()),
            db.collection('requests').orderBy('date', 'desc').get().catch(() => db.collection('requests').get())
        ]);
        
        ordersSnap.forEach(d => orders.push(d.data()));
        requestsSnap.forEach(d => requests.push(d.data()));
        
        const sortDesc = (a, b) => {
            let d1 = a.date ? (typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)) : new Date(0);
            let d2 = b.date ? (typeof b.date.toDate === 'function' ? b.date.toDate() : new Date(b.date)) : new Date(0);
            return d2 - d1;
        };
        orders.sort(sortDesc);
        requests.sort(sortDesc);
    } catch(e) {
        console.error("Error loading tailor data", e);
    }
    
    const oBody = document.getElementById('ordersTableBody');
    oBody.innerHTML = '';
    
    if (orders.length === 0) {
        oBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 40px;">No orders found.</td></tr>`;
    } else {
        orders.forEach(o => {
            const d = o.date && typeof o.date.toDate === 'function' ? o.date.toDate().toLocaleDateString() : new Date(o.date).toLocaleDateString();
            
            // Format items to show size/measurements
            let itemsHTML = '<ul style="margin:0; padding-left:15px; font-size:13px; color:#444;">';
            o.items.forEach(item => {
                let sizeText = item.size || 'Standard';
                if (item.customSize) {
                    sizeText = `Custom Object: ${JSON.stringify(item.customSize)}`;
                } else if (item.measurements) {
                    sizeText = `Measurements: ${item.measurements}`;
                }
                itemsHTML += `<li><strong>${item.name}</strong> - Size: ${sizeText}</li>`;
            });
            itemsHTML += '</ul>';
            
            oBody.innerHTML += `
                <tr>
                    <td style="font-weight:600; color:var(--primary-color);">${o.id}</td>
                    <td>${d}</td>
                    <td>
                        <div style="font-weight: 500;">${o.customerName || 'N/A'}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${o.customerEmail || ''}</div>
                    </td>
                    <td>${itemsHTML}</td>
                    <td><span class="badge badge-processing">${o.status || 'Processing'}</span></td>
                    <td><button class="btn btn-primary" style="font-size:11px; padding:6px 12px;" onclick="alert('Marking as tailored')">Mark Done</button></td>
                </tr>
            `;
        });
    }
    
    const rBody = document.getElementById('requestsTableBody');
    rBody.innerHTML = '';
    
    if (requests.length === 0) {
        rBody.innerHTML = `<tr><td colspan="4" class="text-center" style="padding: 40px;">No custom requests found.</td></tr>`;
    } else {
        requests.forEach(r => {
            rBody.innerHTML += `
                <tr>
                    <td style="font-weight:600; color:var(--primary-color);">${r.id}</td>
                    <td>
                        <div style="font-weight: 500;">${r.user || 'N/A'}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${r.email || ''}</div>
                    </td>
                    <td style="max-width: 400px; font-size: 13px;">${r.description}</td>
                    <td><span class="badge ${r.status === 'Approved' ? 'badge-done' : 'badge-pending'}">${r.status || 'Pending'}</span></td>
                </tr>
            `;
        });
    }
}
