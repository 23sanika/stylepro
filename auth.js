// auth.js - Authentication Logic

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if(tabName === 'login') {
        document.querySelector('.tab:nth-child(1)').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.tab:nth-child(2)').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pwd = document.getElementById('loginPwd').value;
            const errEl = document.getElementById('loginError');
            
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, pwd);
                // Redirect based on email
                if (email === 'admin@stylepro.com') {
                    window.location.href = 'admin.html';
                } else if (email === 'tailor@stylepro.com') {
                    window.location.href = 'tailor.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } catch (error) {
                console.error("Login Error: ", error);
                errEl.textContent = error.message;
                errEl.style.display = 'block';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const pwd = document.getElementById('regPwd').value;
            const errEl = document.getElementById('regError');
            
            // Check reserved emails
            if (email === 'admin@stylepro.com' || email === 'tailor@stylepro.com') {
                errEl.textContent = 'This email is reserved for staff. Please use login.';
                errEl.style.display = 'block';
                return;
            }
            
            try {
                // Create user in Firebase Auth
                const userCredential = await auth.createUserWithEmailAndPassword(email, pwd);
                const user = userCredential.user;
                
                // Set user name and data in Firestore
                await db.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    role: 'customer',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Auto login route to profile
                window.location.href = 'profile.html';
            } catch (error) {
                console.error("Registration Error: ", error);
                errEl.textContent = error.message;
                errEl.style.display = 'block';
            }
        });
    }
});
