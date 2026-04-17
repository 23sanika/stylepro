document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if(!user) {
            window.location.href = 'auth.html';
            return;
        }
        loadDashboardData();
    });
});

function adminLogout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

function switchView(viewName, element) {
    document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.getElementById(viewName + 'View').classList.add('active');
    
    document.getElementById('pageTitle').textContent = viewName === 'orders' ? 'Orders' : 'Custom Design Requests';
}

async function loadDashboardData() {
    let orders = [];
    let requests = [];
    let feedbacks = [];

    try {
        const [ordersSnap, requestsSnap, feedbackSnap] = await Promise.all([
            db.collection('orders').orderBy('date', 'desc').get().catch(() => db.collection('orders').get()),
            db.collection('requests').orderBy('date', 'desc').get().catch(() => db.collection('requests').get()),
            db.collection('feedbacks').orderBy('date', 'desc').get().catch(() => db.collection('feedbacks').get())
        ]);
        
        ordersSnap.forEach(d => orders.push(d.data()));
        requestsSnap.forEach(d => requests.push(d.data()));
        feedbackSnap.forEach(d => feedbacks.push(d.data()));
        
        // Sorting in case no index was present and fallback triggered
        const sortDesc = (a, b) => {
            let d1 = a.date ? (typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)) : new Date(0);
            let d2 = b.date ? (typeof b.date.toDate === 'function' ? b.date.toDate() : new Date(b.date)) : new Date(0);
            return d2 - d1;
        };
        orders.sort(sortDesc);
        requests.sort(sortDesc);
        feedbacks.sort(sortDesc);

    } catch (e) {
        console.error("Error fetching dashboard data", e);
    }
    
    // Stats
    let revenue = 0;
    orders.forEach(o => { revenue += o.total; });
    
    // Ensure formatINR is loaded globally, otherwise default
    const formattedRevenue = typeof formatINR !== 'undefined' ? formatINR(revenue) : '₹' + revenue;
    
    document.getElementById('statRev').textContent = formattedRevenue;
    document.getElementById('statOrd').textContent = orders.length;
    document.getElementById('statReq').textContent = requests.length;
    
    const feedStat = document.getElementById('statFeed');
    if(feedStat) feedStat.textContent = feedbacks.length;
    
    // Render Orders
    const oBody = document.getElementById('ordersTableBody');
    oBody.innerHTML = '';
    
    if (orders.length === 0) {
        oBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 40px;">No orders found.</td></tr>`;
    } else {
        orders.forEach(o => {
            const d = o.date && typeof o.date.toDate === 'function' ? o.date.toDate().toLocaleDateString() : new Date(o.date).toLocaleDateString();
            const famount = typeof formatINR !== 'undefined' ? formatINR(o.total) : '₹' + o.total;
            oBody.innerHTML += `
                <tr>
                    <td style="font-weight:600; color:var(--primary-color);">${o.id}</td>
                    <td>${d}</td>
                    <td>
                        <div style="font-weight: 500;">${o.customerName || 'N/A'}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${o.customerEmail || ''}</div>
                    </td>
                    <td style="font-weight:600;">${famount}</td>
                    <td><span style="padding: 4px 8px; border:1px solid #ddd; font-size: 11px; border-radius: 4px; font-weight: 600;">${o.paymentMethod || 'Unknown'}</span></td>
                    <td><span class="badge ${o.status === 'Delivered' ? 'badge-processing' : 'badge-processing'}">${o.status || 'Processing'}</span></td>
                </tr>
            `;
        });
    }

    // Render Requests
    const rBody = document.getElementById('requestsTableBody');
    rBody.innerHTML = '';
    
    if (requests.length === 0) {
        rBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 40px;">No custom requests found.</td></tr>`;
    } else {
        requests.forEach(r => {
            const d = r.date && typeof r.date.toDate === 'function' ? r.date.toDate().toLocaleDateString() : new Date(r.date).toLocaleDateString();
            rBody.innerHTML += `
                <tr>
                    <td style="font-weight:600; color:var(--primary-color);">${r.id}</td>
                    <td>${d}</td>
                    <td>
                        <div style="font-weight: 500;">${r.user || 'N/A'}</div>
                        <div style="font-size:12px; color:var(--text-muted);">${r.email || ''}</div>
                    </td>
                    <td style="max-width: 300px; font-size: 13px;">${r.description.substring(0,80)}${r.description.length>80?'...':''}</td>
                    <td style="font-weight:600;">₹${r.budget || 'TBD'}</td>
                    <td><span class="badge badge-pending">${r.status || 'Pending Review'}</span></td>
                </tr>
            `;
        });
    }

    // Render Feedback
    const fBody = document.getElementById('feedbackTableBody');
    if (fBody) {
        fBody.innerHTML = '';
        if (feedbacks.length === 0) {
            fBody.innerHTML = `<tr><td colspan="3" class="text-center" style="padding: 40px;">No feedback received yet.</td></tr>`;
        } else {
            feedbacks.forEach(fb => {
                const d = fb.date && typeof fb.date.toDate === 'function' ? fb.date.toDate().toLocaleDateString() : new Date(fb.date).toLocaleDateString();
                fBody.innerHTML += `
                    <tr>
                        <td style="white-space: nowrap;">${d}</td>
                        <td style="max-width: 400px; line-height: 1.5;">${fb.message}</td>
                        <td><span class="badge badge-processing">Received</span></td>
                    </tr>
                `;
            });
        }
    }
}
