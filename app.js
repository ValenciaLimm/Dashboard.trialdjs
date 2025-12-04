// ========== Sample data ==========
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthlyValues = [400,300,500,450,600,700,650,800,750,900,950,1100];

const traffic = { labels:['Direct','Social','Referral'], values:[40,30,30] };

const products = {
  rows:[
    {id:1, name:'Product A', category:'Electronics', sales:400},
    {id:2, name:'Product B', category:'Household', sales:300},
    {id:3, name:'Product C', category:'Beauty', sales:200},
    {id:4, name:'Product D', category:'Sports', sales:178},
    {id:5, name:'Product E', category:'Food', sales:120},
  ]
};

const customers = [
  { id:1, name:'Customer A', email:'a@example.com', status:'Active', revenue:4200 },
  { id:2, name:'Customer B', email:'b@example.com', status:'Churned', revenue:1200 },
  { id:3, name:'Customer C', email:'c@example.com', status:'Active', revenue:3600 },
  { id:4, name:'Customer D', email:'d@example.com', status:'Trial', revenue:0 },
  { id:5, name:'Customer E', email:'e@example.com', status:'Active', revenue:2400 }
];

// ========== Helper ==========
function formatCurrency(n){ return '$' + n.toLocaleString(); }

// ========== Chart.js defaults ==========
Chart.defaults.font.family = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
Chart.defaults.color = '#0f172a';

// create charts (will exist even if section hidden)
const areaCtx = document.getElementById('areaChart').getContext('2d');
const areaGradient = areaCtx.createLinearGradient(0,0,0,260);
areaGradient.addColorStop(0, 'rgba(99,102,241,0.28)');
areaGradient.addColorStop(1, 'rgba(99,102,241,0)');

const areaChart = new Chart(areaCtx, {
  type:'line',
  data:{ labels: months, datasets:[{ label:'Revenue', data:monthlyValues, fill:true, backgroundColor:areaGradient, borderColor:'rgba(99,102,241,0.95)', tension:0.35, pointRadius:3 }]},
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false }}, y:{ grid:{ color:'rgba(15,23,42,0.06)' }}}}
});

const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
  type:'doughnut',
  data:{ labels:traffic.labels, datasets:[{ data:traffic.values, backgroundColor:['#6366f1','#10b981','#ec4899'], hoverOffset:8, borderWidth:0 }]},
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, cutout:'60%' }
});

const barCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barCtx, {
  type:'bar',
  data:{ labels: products.rows.map(r=>r.name), datasets:[{ label:'Sales', data: products.rows.map(r=>r.sales), backgroundColor:['#6366f1','#ec4899','#f59e0b','#60a5fa','#34d399'], borderRadius:8, maxBarThickness:36 }]},
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ color:'rgba(15,23,42,0.06)' }}, y:{ grid:{ display:false }}}}
});

// Reports area chart (bigger)
const reportsCtx = document.getElementById('reportsArea').getContext('2d');
const reportsChart = new Chart(reportsCtx, {
  type:'line',
  data:{ labels: months, datasets:[{ label:'Revenue', data: monthlyValues.map(v => v*1.1), fill:true, backgroundColor:areaGradient, borderColor:'rgba(99,102,241,0.95)', tension:0.35 }]},
  options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false }}, y:{ grid:{ color:'rgba(15,23,42,0.06)' }}}}
});

// ========== Render tables and KPIs ==========
function renderCustomersTable() {
  const tbody = document.querySelector('#customersTable tbody');
  tbody.innerHTML = '';
  customers.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.status}</td>
      <td class="text-end fw-semibold">${formatCurrency(c.revenue)}</td>
    `;
    tbody.appendChild(tr);
  });

  // customers table in customers section (more columns)
  const tbody2 = document.querySelector('#customersTable2 tbody');
  tbody2.innerHTML = '';
  customers.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.status}</td>
      <td class="text-end fw-semibold">${formatCurrency(c.revenue)}</td>
    `;
    tbody2.appendChild(tr);
  });
}

function renderProductsTable() {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  products.rows.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td class="text-end fw-semibold">${formatCurrency(p.sales)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderKPIs() {
  const totalRevenue = customers.reduce((s,c)=>s+c.revenue,0);
  document.getElementById('kpiRevenue').textContent = formatCurrency(totalRevenue);
  // demo static values
  document.getElementById('kpiUsers').textContent = '1,246';
  document.getElementById('kpiSubs').textContent = '3,402';
  document.getElementById('kpiChurn').textContent = '2.1%';
}

function renderTrafficText() {
  document.getElementById('pctDirect').textContent = traffic.values[0] + '%';
  document.getElementById('pctSocial').textContent = traffic.values[1] + '%';
  document.getElementById('pctReferral').textContent = traffic.values[2] + '%';
}

// ========== Sidebar navigation logic ==========
const navLinks = document.querySelectorAll('.nav-sidebar .nav-link');
const sections = document.querySelectorAll('.section');

function showSection(id) {
  sections.forEach(s => s.classList.add('d-none'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('d-none');
    // if charts exist in that section, resize/update them so they render correctly
    setTimeout(() => {
      try { areaChart.resize(); areaChart.update(); } catch(e){}
      try { pieChart.resize(); pieChart.update(); } catch(e){}
      try { barChart.resize(); barChart.update(); } catch(e){}
      try { reportsChart.resize(); reportsChart.update(); } catch(e){}
    }, 120);
  }
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const sectionId = link.dataset.section;
    showSection(sectionId);
    history.replaceState(null, '', '#' + sectionId);
  });
});

// support initial hash or default to overview
function initFromHash() {
  const hash = (location.hash || '#overview').replace('#','');
  const link = Array.from(navLinks).find(l => l.dataset.section === hash);
  if (link) {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    showSection(hash);
  } else {
    showSection('overview');
  }
}

// ========== Small features: search, export, add product, settings ==========
// global search filters customers table on overview
document.getElementById('globalSearch').addEventListener('input', function(e){
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#customersTable tbody tr').forEach(row=>{
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = name.includes(q) ? '' : 'none';
  });
});

// customers search in customers section
document.getElementById('customerSearch').addEventListener('input', function(e){
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll('#customersTable2 tbody tr').forEach(row=>{
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = name.includes(q) ? '' : 'none';
  });
});

// export CSV of customers (simple)
document.getElementById('exportCSV').addEventListener('click', function(){
  const rows = [['id','name','email','status','revenue']];
  customers.forEach(c => rows.push([c.id, c.name, c.email || '', c.status, c.revenue]));
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customers.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// add product demo (push into products and re-render)
document.getElementById('addProductBtn').addEventListener('click', function(){
  const nextId = products.rows.length + 1;
  products.rows.push({ id: nextId, name: 'Product ' + String.fromCharCode(64+nextId), category:'New', sales: Math.floor(Math.random()*500) });
  renderProductsTable();
  // update bar chart
  barChart.data.labels = products.rows.map(r=>r.name);
  barChart.data.datasets[0].data = products.rows.map(r=>r.sales);
  barChart.update();
  // show a small bootstrap toast-like feedback (simple alert)
  const alert = document.createElement('div');
  alert.className = 'alert alert-success position-fixed';
  alert.style.right = '20px'; alert.style.top = '20px'; alert.style.zIndex = 2000;
  alert.textContent = 'Product added';
  document.body.appendChild(alert);
  setTimeout(()=> alert.remove(), 1400);
});

// settings save
document.getElementById('settingsForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('setName').value;
  const email = document.getElementById('setEmail').value;
  // apply changes on UI
  const displayNameEl = document.getElementById('displayName');
  if (displayNameEl) displayNameEl.textContent = name;
  // small success alert
  const a = document.createElement('div');
  a.className = 'alert alert-success position-fixed';
  a.style.right = '20px'; a.style.top = '20px'; a.style.zIndex = 2000;
  a.textContent = 'Settings saved';
  document.body.appendChild(a);
  setTimeout(() => a.remove(), 1400);
});

// ========== Init on load ==========
document.getElementById('yearSidebar').textContent = new Date().getFullYear();
document.getElementById('yearMain').textContent = new Date().getFullYear();

renderCustomersTable();
renderProductsTable();
renderKPIs();
renderTrafficText();

window.addEventListener('load', () => {
  initFromHash();
  // small timeout to ensure charts render correctly
  setTimeout(()=> {
    areaChart.update(); pieChart.update(); barChart.update(); reportsChart.update();
  }, 150);
});

// expose for debugging
window._dashboard = { areaChart, pieChart, barChart, reportsChart, products, customers };
