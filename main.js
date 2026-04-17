// main.js - Shared utilities

const CATALOG = [
    // KURTIS
    { id: '1', name: 'Embroidered Silk Kurti', price: 3499, image: 'images/kurti.png', category: 'kurti', desc: 'A stunning traditional silk kurti featuring delicate embroidery.' },
    { id: '2', name: 'Floral Georgette Anarkali', price: 4299, image: 'images/floral_anarkali.png', category: 'kurti', desc: 'Flowing Anarkali with intricate floral patterns. Perfect for festive occasions.' },
    { id: '3', name: 'Minimalist Cotton Tunic', price: 1899, image: 'images/cotton_tunic.png', category: 'kurti', desc: 'Clean lines and premium breathable cotton for everyday elegance.' },
    { id: '4', name: 'Zari Work Festive Kurti', price: 5999, image: 'images/zari_kurti.png', category: 'kurti', desc: 'Heavy Zari work highlighting classic Indian craftsmanship.' },
    
    // DRESSES
    { id: '5', name: 'Elegant Evening Gown', price: 8999, image: 'images/gown.png', category: 'dress', desc: 'Turn heads in this breathtaking evening dress. Make it completely yours.' },
    { id: '6', name: 'Midnight Blue Velvet Shift', price: 5499, image: 'images/blue_velvet_shift.png', category: 'dress', desc: 'Luxurious velvet with a modern silhouette.' },
    { id: '7', name: 'Spring Floral Maxi', price: 3999, image: 'images/spring_maxi.png', category: 'dress', desc: 'Lightweight chiffon maxi perfect for spring brunches.' },
    { id: '8', name: 'Chic Crepe Midi Dress', price: 4599, image: 'images/crepe_midi.png', category: 'dress', desc: 'Structure meets fluidity in this designer midi.' },
    
    // TOPS
    { id: '9', name: 'Chic Crop Top', price: 1899, image: 'images/Chic Crop Top.jpg', category: 'top', desc: 'A stylish and highly versatile crop top perfect for casual outings.' },
    { id: '10', name: 'Silk Halter Blouse', price: 2499, image: 'images/Silk Halter Blouse.jpg', category: 'top', desc: 'Pure silk halter neck for elegant evening pairings.' },
    { id: '11', name: 'Classic White Shirt', price: 1999, image: 'images/Classic White Shirt.jpg', category: 'top', desc: 'A wardrobe staple, tailored to perfection.' },
    { id: '12', name: 'Off-Shoulder Ruffle Top', price: 2199, image: 'images/Off-Shoulder Ruffle Top.jpg', category: 'top', desc: 'Feminine ruffles with a flattering off-shoulder cut.' },
    
    // BOTTOMS
    { id: '13', name: 'High-Waisted Women\'s Jeans', price: 2799, image: 'images/High-Waisted Women\'s Jeans.jpg', category: 'bottom', desc: 'Premium denim crafted for the perfect fit.' },
    { id: '14', name: 'Tailored Wide Leg Trousers', price: 3299, image: 'images/Tailored Wide Leg Trousers.jpg', category: 'bottom', desc: 'Professional, elegant, and perfectly fitted wide leg pants.' },
    { id: '15', name: 'Pleated Midi Skirt', price: 2599, image: 'images/Pleated Midi Skirt.jpg', category: 'bottom', desc: 'Metallic pleated skirt that catches the light beautifully.' },
    { id: '16', name: 'Linen Summer Palazzos', price: 2199, image: 'images/Linen Summer Palazzos.jpg', category: 'bottom', desc: 'Breathable pure linen pants for ultimate comfort and style.' },
    
    // MENS
    { id: '17', name: 'Men\'s Classic Suit', price: 8999, image: 'images/Men\'s Classic Suit.jpg', category: 'mens', desc: 'A perfectly tailored classic suit for formal occasions.' },
    { id: '18', name: 'Casual Denim Jacket', price: 2499, image: 'images/Casual Denim Jacket.jpg', category: 'mens', desc: 'A rugged and stylish denim jacket for everyday wear.' },
    { id: '19', name: 'Formal Oxford Shirt', price: 1899, image: 'images/Formal Oxford Shirt.jpg', category: 'mens', desc: 'Premium cotton oxford shirt for a sharp look.' },
    { id: '20', name: 'Chino Shorts', price: 1499, image: 'images/Chino Shorts.jpg', category: 'mens', desc: 'Comfortable and versatile chino shorts.' }
];

function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

document.addEventListener('DOMContentLoaded', () => {
    // Rely on onAuthStateChanged for user-dependent counts
    auth.onAuthStateChanged(user => {
        updateNav(user);
        if (user) {
            updateCartCount();
            updateWishlistCount();
        } else {
            const wlCountEl = document.getElementById('wishlist-count');
            if (wlCountEl) wlCountEl.textContent = '0';
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) cartCountEl.textContent = '0';
        }
    });

    initChatWidget();
    initNewsletter();
    initFeedbackWidget();
});

// Chat Widget Logic
function initChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if (!chatToggle || !chatWindow) return;

    chatToggle.addEventListener('click', () => {
        chatWindow.classList.add('active');
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-message user';
            userMsg.innerHTML = `<p>${text}</p>`;
            chatBody.appendChild(userMsg);
            
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;

            setTimeout(() => {
                const t = text.toLowerCase();
                let reply = "Thanks for your message! Our style experts will get back to you shortly.";
                
                if (t.includes('shipping') || t.includes('delivery')) {
                    reply = "Standard shipping takes 3-5 business days. Express delivery is available within 24 hours!";
                } else if (t.includes('size') || t.includes('fit') || t.includes('measurements')) {
                    reply = "We offer a precise 'Custom Fit' option on all products! Simply hit Custom Fit and enter your specific measurements before adding an item to your bag.";
                } else if (t.includes('return') || t.includes('refund')) {
                    reply = "We maintain a 7-day no-questions-asked return policy for standard sizes! Please note custom-fitted items are strictly non-refundable.";
                } else if (t.includes('hi') || t.includes('hello') || t.includes('hey')) {
                    reply = "Hello there! How can I assist you with styling or tailoring your perfect outfit today?";
                } else if (t.includes('price') || t.includes('cost') || t.includes('expensive')) {
                    reply = "Our collection ranges from ₹1,499 to ₹8,999. Fully custom designs depend heavily on the selected fabric and the dress complexity.";
                } else if (t.includes('track') || t.includes('order')) {
                    reply = "You can easily track your order directly from your Profile page by logging into your account!";
                } else if (t === 'yes' || t === 'yeah' || t === 'yep' || t === 'sure' || t.includes('help')) {
                    reply = "Great! You can either browse 'The Collection' above, or if you need sizing help specifically, just type 'size' or 'fit'.";
                } else if (t.includes('wedding') || t.includes('party') || t.includes('festive') || t.includes('occasion')) {
                    reply = "For festive occasions and parties, we highly recommend our 'Embroidered Silk Kurti' or the stunning 'Midnight Blue Velvet Shift'!";
                } else if (t.includes('casual') || t.includes('everyday') || t.includes('daily')) {
                    reply = "For a relaxed everyday look, you can't go wrong with our 'Chic Crop Top' paired beautifully with 'High-Waisted Jeans'!";
                } else if (t.includes('office') || t.includes('formal') || t.includes('work') || t.includes('interview')) {
                    reply = "For a sharp professional appearance, our 'Tailored Wide Leg Trousers' matched with the 'Classic White Shirt' is a perfect power-outfit.";
                } else if (t.includes('summer') || t.includes('beach') || t.includes('hot')) {
                    reply = "Stay breezy! Our 'Linen Summer Palazzos' and the flowy 'Spring Floral Maxi' are absolutely perfect for warm weather.";
                } else if (t.includes('men') || t.includes('boy')) {
                    reply = "For men, our 'Classic Suit' is great for formal events, while the 'Casual Denim Jacket' is a fantastic everyday staple!";
                }

                const botMsg = document.createElement('div');
                botMsg.className = 'chat-message bot';
                botMsg.innerHTML = `<p>${reply}</p>`;
                chatBody.appendChild(botMsg);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 1000);
        }
    }

    if (chatSend) chatSend.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Global Feedback Widget Initialization
function initFeedbackWidget() {
    // Only inject if it doesn't exist and not on admin page
    if (document.getElementById('feedback-toggle') || window.location.pathname.includes('admin.html')) return;

    const feedbackHTML = `
    <div class="feedback-widget">
        <button id="feedback-toggle" class="feedback-toggle" title="Leave Feedback">
            <span class="feedback-icon" style="font-size: 14px; font-weight: 600;">Feedback</span>
        </button>
        <div id="feedback-window" class="chat-window" style="bottom: 70px; left: 20px; right: auto;">
            <div class="chat-header">
                <h3>Send Feedback</h3>
                <button id="feedback-close" class="chat-close">&times;</button>
            </div>
            <div class="chat-body" id="feedback-body" style="padding: 15px;">
                <p style="font-size: 13px; margin-bottom: 10px; color: var(--text-muted);">How can we improve your experience?</p>
                <textarea id="feedback-text" class="form-control" rows="4" placeholder="Your feedback..." style="width:100%; box-sizing:border-box; padding:10px; border:1px solid #ddd;"></textarea>
                <button id="submit-feedback" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Submit</button>
                <p id="feedback-success" style="display:none; color: var(--primary-color); font-size: 13px; margin-top: 10px; text-align:center; font-weight:600;">Thanks for your feedback!</p>
            </div>
        </div>
    </div>
    <style>
        .feedback-widget { position: fixed; bottom: 20px; left: 20px; z-index: 1000; }
        .feedback-toggle { background: var(--text-color); color: white; border: none; padding: 10px 15px; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .feedback-toggle:hover { background: var(--accent-color); }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', feedbackHTML);

    const toggle = document.getElementById('feedback-toggle');
    const fWindow = document.getElementById('feedback-window');
    const close = document.getElementById('feedback-close');
    const submitBtn = document.getElementById('submit-feedback');

    toggle.addEventListener('click', () => {
        fWindow.classList.toggle('active');
    });

    close.addEventListener('click', () => {
        fWindow.classList.remove('active');
    });

    submitBtn.addEventListener('click', () => {
        const text = document.getElementById('feedback-text').value.trim();
        if (!text) return;
        
        db.collection('feedbacks').add({
            date: firebase.firestore.FieldValue.serverTimestamp(),
            message: text
        }).catch(err => console.error("Feedback error", err));
        
        document.getElementById('feedback-text').style.display = 'none';
        submitBtn.style.display = 'none';
        document.getElementById('feedback-success').style.display = 'block';
        
        setTimeout(() => {
            fWindow.classList.remove('active');
            document.getElementById('feedback-text').value = '';
            document.getElementById('feedback-text').style.display = 'block';
            submitBtn.style.display = 'block';
            document.getElementById('feedback-success').style.display = 'none';
        }, 2000);
    });
}

// Newsletter Logic
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const msg = document.getElementById('newsletter-message');
    if (form && msg) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input');
            if (input.value) {
                msg.style.display = 'block';
                input.value = '';
                setTimeout(() => {
                    msg.style.display = 'none';
                }, 3000);
            }
        });
    }
}

function updateNav(user) {
    const authLink = document.getElementById('auth-link');
    
    // Convert all product.html links to shop.html if they exist in Nav (global patch)
    document.querySelectorAll('a[href="product.html"]').forEach(a => {
        if (!a.classList.contains('do-not-change')) {
            a.href = 'shop.html';
        }
    });
    
    if (authLink) {
        if (user) {
            authLink.textContent = "Profile";
            authLink.href = 'profile.html';
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'auth.html';
        }
    }
    
    // Inject Wishlist globally if not present
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer && !document.getElementById('wishlist-nav-link')) {
        const bagLink = document.querySelector('.nav-links a[href="cart.html"]');
        if (bagLink) {
            bagLink.insertAdjacentHTML('beforebegin', '<a href="wishlist.html" id="wishlist-nav-link" style="color: var(--text-color);">Wishlist (<span id="wishlist-count">0</span>)</a>');
            updateWishlistCount();
        }
    }
}

async function updateWishlistCount() {
    const wlCountEl = document.getElementById('wishlist-count');
    if (wlCountEl && auth.currentUser) {
        const doc = await db.collection('wishlists').doc(auth.currentUser.uid).get();
        if (doc.exists) {
            const wl = doc.data().items || [];
            wlCountEl.textContent = wl.length;
        } else {
            wlCountEl.textContent = '0';
        }
    }
}

async function toggleWishlist(productId, btnElement) {
    if (!auth.currentUser) {
        alert("Please login to manage wishlist");
        return;
    }
    const ref = db.collection('wishlists').doc(auth.currentUser.uid);
    const doc = await ref.get();
    let wl = doc.exists ? (doc.data().items || []) : [];
    
    let removed = false;
    if (wl.includes(productId)) {
        wl = wl.filter(id => id !== productId);
        removed = true;
        if (btnElement) {
            btnElement.classList.remove('active');
            btnElement.style.color = '#333';
        }
    } else {
        wl.push(productId);
        if (btnElement) {
            btnElement.classList.add('active');
            btnElement.style.color = 'var(--primary-color)';
        }
    }
    await ref.set({ items: wl });
    updateWishlistCount();
    
    // Notification
    const msg = removed ? 'Removed from Wishlist' : 'Added to Wishlist';
    if (!document.getElementById('wl-toast')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="wl-toast" style="position:fixed; bottom:20px; right:20px; background:#333; color:white; padding:10px 20px; border-radius:30px; display:none; z-index:9999; font-size:13px;"></div>`);
    }
    const toast = document.getElementById('wl-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2000);
}

async function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl && auth.currentUser) {
        const doc = await db.collection('carts').doc(auth.currentUser.uid).get();
        if (doc.exists) {
            const cart = doc.data().items || [];
            cartCountEl.textContent = cart.length;
        } else {
            cartCountEl.textContent = '0';
        }
    }
}

async function addToCart(product) {
    if (!auth.currentUser) {
        alert("Please login to add to cart");
        return;
    }
    const ref = db.collection('carts').doc(auth.currentUser.uid);
    const doc = await ref.get();
    let cart = doc.exists ? (doc.data().items || []) : [];
    
    cart.push(product);
    await ref.set({ items: cart });
    updateCartCount();
    
    alert('Added ' + product.name + ' to cart!');
}

function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

