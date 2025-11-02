// Kosár: id -> {product, qty}
const cart = new Map();

// Segédfüggvények
const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' Ft';

// Termékek megjelenítése (külső forrásból betöltve)
const productsEl = document.getElementById('products');

function renderProducts(products){
  productsEl.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="product-img">📦</div>
      <h3 class="product-name">${p.name}</h3>
      <div class="meta">${p.desc || ''}</div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center">
        <div class="price">${fmt(p.price)}</div>
        <button data-id="${p.id}">Hozzáad</button>
      </div>`;
    productsEl.appendChild(el);
  });
}

// Esemény: hozzáadás
productsEl.addEventListener('click', e => {
  const btn = e.target.closest('button'); if(!btn) return;
  const id = Number(btn.dataset.id); if(!id) return;
  addToCart(id);
});

// Kosár render
const cartListEl = document.getElementById('cartList');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const emptyMsg = document.getElementById('emptyMsg');

let products = [];

function addToCart(id, qty=1){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const entry = cart.get(id) || {product:prod, qty:0};
  entry.qty += qty;
  cart.set(id, entry);
  renderCart();
}

function changeQty(id, delta){
  const entry = cart.get(id); if(!entry) return;
  entry.qty += delta; if(entry.qty <= 0){ cart.delete(id); } else { cart.set(id, entry); }
  renderCart();
}

function removeItem(id){ cart.delete(id); renderCart(); }

function clearCart(){ cart.clear(); renderCart(); }

function renderCart(){
  cartListEl.innerHTML = '';
  let total = 0, count = 0;
  if(cart.size === 0){ cartListEl.appendChild(emptyMsg); }
  else{
    const frag = document.createDocumentFragment();
    cart.forEach(({product,qty}) =>{
      count += qty; total += product.price * qty;
      const wrap = document.createElement('div'); wrap.className='cart-item';
      wrap.innerHTML = `
        <div style="flex:1">
          <div style="font-weight:600">${product.name}</div>
          <div class="small">${fmt(product.price)} × ${qty} = <strong>${fmt(product.price*qty)}</strong></div>
        </div>
        <div class="qty">
          <button data-act="dec" data-id="${product.id}">-</button>
          <div style="min-width:20px;text-align:center">${qty}</div>
          <button data-act="inc" data-id="${product.id}">+</button>
          <button class="remove" data-act="rem" data-id="${product.id}">✕</button>
        </div>`;
      frag.appendChild(wrap);
    });
    cartListEl.appendChild(frag);
  }
  cartCountEl.textContent = count;
  cartTotalEl.textContent = fmt(total);
}

// kezeljük a +/- és törlés gombokat
cartListEl.addEventListener('click', e =>{
  const btn = e.target.closest('button'); if(!btn) return;
  const id = Number(btn.dataset.id); const act = btn.dataset.act;
  if(act === 'inc') changeQty(id,1);
  if(act === 'dec') changeQty(id,-1);
  if(act === 'rem') removeItem(id);
});

// Törlés és pénztár
document.getElementById('clearBtn').addEventListener('click', () => {
  if(confirm('Biztosan törölni szeretnéd a kosarat?')) clearCart();
});

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if(cart.size === 0){ alert('A kosár üres.'); return; }
  let total = 0, lines = [];
  cart.forEach(({product,qty})=>{ total += product.price * qty; lines.push(`${product.name} × ${qty} = ${fmt(product.price*qty)}`); });
  const summary = lines.join('\n');
  alert('Rendelés összegzése:\n\n' + summary + '\n\nÖsszesen: ' + fmt(total) + '\n\n(Valódi fizetés nincs a demóban)');
});

// Dupla kattintás gyors hozzáadáshoz
productsEl.addEventListener('dblclick', e =>{
  const el = e.target.closest('.card'); if(!el) return; const btn = el.querySelector('button'); btn && btn.click();
});

// Terméklista betöltése (példa: külső JSON-ból)
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(()=>{
    productsEl.innerHTML = '<p>Nem sikerült betölteni a termékeket.</p>';
  });

// Inicializálás
renderCart();