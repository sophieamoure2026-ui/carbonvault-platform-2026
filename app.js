// CarbonVault — App Logic

const CARBON_BUYERS = [
  { name:'Lufthansa Group', sector:'Airlines & Aviation', region:'European Union', mandate:'CORSIA (Aviation)', volume:'450,000 t', score:96, signal:'CORSIA Phase 1 compliance deficit — 450K tonnes needed by Sept 2026' },
  { name:'Shell International', sector:'Oil & Gas Majors', region:'Global', mandate:'Net Zero 2030', volume:'1.2M t', score:93, signal:'Nature-based solutions target announced — $400M carbon budget 2026' },
  { name:'Deutsche Bank AG', sector:'Banking & Finance', region:'European Union', mandate:'EU ETS Regulated', volume:'180,000 t', score:90, signal:'Scope 3 financed emissions disclosure triggering voluntary offset demand' },
  { name:'Emirates Group', sector:'Airlines & Aviation', region:'Middle East & Africa', mandate:'CORSIA (Aviation)', volume:'390,000 t', score:88, signal:'Fleet expansion increases CORSIA obligations 32% YoY' },
  { name:'Qantas Airways', sector:'Airlines & Aviation', region:'Asia Pacific', mandate:'CORSIA (Aviation)', volume:'210,000 t', score:85, signal:'Australian CORSIA Phase 1 participant — procurement cycle open' },
  { name:'TotalEnergies SE', sector:'Oil & Gas Majors', region:'European Union', mandate:'Voluntary ESG Target', volume:'800,000 t', score:83, signal:'Voluntary carbon portfolio restructure — quality upgrade to VCS Gold' },
  { name:'Government of Singapore', sector:'Government / Sovereign', region:'Asia Pacific', mandate:'Net Zero 2040+', volume:'500,000 t', score:81, signal:'Article 6 bilateral deal negotiations underway — Tier 1 credits sought' },
  { name:'Microsoft Corporation', sector:'Tech & Data Centers', region:'North America', mandate:'Net Zero 2030', volume:'2.5M t', score:79, signal:'Carbon negative by 2030 — removal portfolio diversification mandate' },
  { name:'Volkswagen Group', sector:'Manufacturing', region:'European Union', mandate:'EU ETS Regulated', volume:'650,000 t', score:77, signal:'ETS compliance shortfall projected Q3 2026 — urgent procurement' },
  { name:'AustraliaPost / Aus Gov', sector:'Government / Sovereign', region:'Asia Pacific', mandate:'Net Zero 2040+', volume:'120,000 t', score:74, signal:'Commonwealth Carbon Framework procurement — tender open March 2026' },
];

const CARBON_INVENTORY = [
  { id:1, type:'REDD+ Forest Conservation', registry:'VCS', vintage:2023, volume:450000, price:18.50, status:'Available' },
  { id:2, type:'Cookstove Clean Cooking', registry:'Gold Standard', vintage:2022, volume:120000, price:22.00, status:'Reserved' },
  { id:3, type:'Solar / Wind Power', registry:'VCS', vintage:2023, volume:800000, price:11.75, status:'Available' },
  { id:4, type:'Blue Carbon (Mangrove)', registry:'VCS', vintage:2024, volume:60000, price:34.50, status:'Available' },
  { id:5, type:'Biochar Sequestration', registry:'Gold Standard', vintage:2024, volume:25000, price:48.00, status:'Available' },
  { id:6, type:'REDD+ Reduced Deforestation', registry:'ACR', vintage:2022, volume:380000, price:15.25, status:'Sold' },
  { id:7, type:'Improved Forest Management', registry:'CAR', vintage:2023, volume:200000, price:13.00, status:'Available' },
];

const CARBON_PRICES = [
  { name:'EU ETS', price:64.82, chg:+1.24 },
  { name:'CORSIA Eligible', price:18.50, chg:-0.32 },
  { name:'VCS Nature', price:14.20, chg:+0.88 },
  { name:'Gold Standard', price:22.10, chg:+0.45 },
  { name:'Voluntary Avg', price:12.75, chg:-0.15 },
];

const CARBON_DEALS = [
  { id:1, buyer:'Lufthansa Group', type:'CORSIA Eligible', volume:250000, value:4625000, stage:'Due Diligence' },
  { id:2, buyer:'Shell International', type:'REDD+ Forest', volume:400000, value:7400000, stage:'Offer Stage' },
  { id:3, buyer:'Deutsche Bank', type:'Gold Standard Portfolio', volume:80000, value:1760000, stage:'Contacted' },
  { id:4, buyer:'Microsoft Corp', type:'Blue Carbon', volume:30000, value:1035000, stage:'Prospected' },
  { id:5, buyer:'Qantas Airways', type:'CORSIA Eligible', volume:120000, value:2220000, stage:'Closed' },
];

const CARBON_BROKERS = [
  { id:1, name:'Elena Russo', initials:'ER', region:'EU / EMEA', rate:2.5, deals:3, color:'#34d399', ytd:487000, status:'Active' },
  { id:2, name:'Zhang Wei', initials:'ZW', region:'Asia Pacific', rate:2.0, deals:4, color:'#60a5fa', ytd:612000, status:'Active' },
  { id:3, name:'Fatima Al-Hassan', initials:'FA', region:'Middle East & Africa', rate:3.0, deals:2, color:'#a78bfa', ytd:341000, status:'Active' },
  { id:4, name:'Carlos Mendes', initials:'CM', region:'North America', rate:2.0, deals:2, color:'#f59e0b', ytd:289000, status:'Pending' },
];

const STAGES = ['Prospected', 'Contacted', 'Due Diligence', 'Offer Stage', 'Closed'];
const STAGE_COLORS = { 'Prospected':'#60a5fa', 'Contacted':'#a78bfa', 'Due Diligence':'#f59e0b', 'Offer Stage':'#f87171', 'Closed':'#10b981' };

const STATE = {
  inventory: [...CARBON_INVENTORY],
  deals: [...CARBON_DEALS],
  brokers: [...CARBON_BROKERS],
  equityTitan: 100,
  equityOperator: 0,
  revenueGenerated: 1640000,
  revenueTarget: 5000000,
};

// ─── PANEL SWITCHING ───────────────────────────────────────────────────────────
function showPanel(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  const titles = { market:'Market Ticker', inventory:'Credit Inventory', ai:'AI Buyer Finder', pipeline:'Sales Pipeline', brokers:'Broker Network', admin:'Admin & Revenue' };
  const badges = { market:'Live', inventory:'Warehouse', ai:'AI Powered', pipeline:'CRM', brokers:'Commissions', admin:'Titan Control' };
  document.getElementById('page-title').textContent = titles[id] || id;
  document.getElementById('page-badge').textContent = badges[id] || '';
  if (id === 'market') { renderPriceFeed(); renderActivityChart(); renderDemandSignals(); }
  if (id === 'inventory') renderInventory();
  if (id === 'pipeline') renderKanban();
  if (id === 'brokers') renderBrokers();
  if (id === 'admin') renderAdmin();
}

// ─── MARKET ───────────────────────────────────────────────────────────────────
function renderPriceFeed() {
  const el = document.getElementById('price-feed');
  el.innerHTML = CARBON_PRICES.map(p => `
    <div class="price-row">
      <div><div class="price-name">${p.name}</div><div class="price-sub">$/tonne CO₂e</div></div>
      <div style="text-align:right">
        <div class="price-val">$${p.price.toFixed(2)}</div>
        <span class="price-chg ${p.chg >= 0 ? 'up-chg' : 'dn-chg'}">${p.chg >= 0 ? '+' : ''}${p.chg.toFixed(2)}</span>
      </div>
    </div>
  `).join('');
  // Mini ticker
  const mt = document.getElementById('mini-ticker');
  if (mt) mt.innerHTML = CARBON_PRICES.slice(0,3).map(p =>
    `<span style="color:${p.chg>=0?'#10b981':'#f87171'}">${p.name}: $${p.price.toFixed(2)}</span>`
  ).join('');
}

function renderActivityChart() {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const vals = [38, 52, 44, 67, 78, 91];
  const max = Math.max(...vals);
  const el = document.getElementById('activity-chart');
  el.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:6px;height:120px;flex:1;">
      ${months.map((m, i) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
          <div class="act-bar" style="height:${(vals[i]/max)*100}%;min-height:10px;title='${vals[i]}M tonnes'"></div>
          <div class="act-label">${m}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDemandSignals() {
  const el = document.getElementById('demand-signals-table');
  el.innerHTML = CARBON_BUYERS.slice(0,6).map(b => `
    <tr>
      <td>${b.name}</td>
      <td>${b.sector}</td>
      <td>${b.region}</td>
      <td>${b.volume}</td>
      <td><span class="score-badge ${b.score>=90?'score-high':b.score>=75?'score-med':'score-low'}">${b.score}</span></td>
      <td style="font-size:11px;color:#64748b">Q2 2026</td>
    </tr>
  `).join('');
}

// ─── INVENTORY ────────────────────────────────────────────────────────────────
function renderInventory() {
  const el = document.getElementById('inventory-tbody');
  el.innerHTML = STATE.inventory.map(c => `
    <tr>
      <td>${c.type}</td>
      <td>${c.registry}</td>
      <td>${c.vintage}</td>
      <td>${(c.volume).toLocaleString()}</td>
      <td>$${c.price.toFixed(2)}</td>
      <td style="color:#10b981">$${((c.volume * c.price)/1e6).toFixed(2)}M</td>
      <td><span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span></td>
      <td><button class="btn-sm primary" onclick="listCredit(${c.id})">List for Sale</button></td>
    </tr>
  `).join('');
}

function listCredit(id) {
  const c = STATE.inventory.find(x => x.id === id);
  if (c) { c.status = 'Reserved'; renderInventory(); }
}

function addCreditModal() { document.getElementById('credit-modal').style.display = 'flex'; }
function closeCreditModal() { document.getElementById('credit-modal').style.display = 'none'; }
function addCredit() {
  STATE.inventory.push({
    id: STATE.inventory.length + 1,
    type: document.getElementById('new-credit-type').value,
    registry: document.getElementById('new-credit-reg').value.split(' ')[0],
    vintage: parseInt(document.getElementById('new-credit-vintage').value),
    volume: parseInt(document.getElementById('new-credit-volume').value) || 100000,
    price: parseFloat(document.getElementById('new-credit-price').value) || 15.00,
    status: 'Available'
  });
  closeCreditModal();
  renderInventory();
}

// ─── AI SCAN ──────────────────────────────────────────────────────────────────
function runCarbonScan() {
  const btn = document.getElementById('carbon-scan-btn');
  btn.textContent = '◎ Scanning Global Markets...';
  btn.classList.add('scanning');
  setTimeout(() => {
    let results = CARBON_BUYERS.filter(b => {
      const sector = document.getElementById('f-sector').value;
      const region = document.getElementById('f-region').value;
      const conf = parseInt(document.getElementById('f-conf').value);
      if (sector && !b.sector.toLowerCase().includes(sector.toLowerCase().split(' ')[0].substring(0,4))) return false;
      if (region && !b.region.toLowerCase().includes(region.toLowerCase().split(' ')[0].substring(0,3))) return false;
      if (conf && b.score < conf) return false;
      return true;
    });
    if (results.length === 0) results = CARBON_BUYERS.slice(0, 4);
    document.getElementById('carbon-result-count').textContent = results.length + ' matched';
    document.getElementById('carbon-results-list').innerHTML = results.map(b => `
      <div class="buyer-card">
        <div class="buyer-card-top">
          <div class="buyer-name">${b.name}</div>
          <div class="buyer-score ${b.score >= 90 ? 'high' : ''}">AI Score: ${b.score}</div>
        </div>
        <div class="buyer-meta">
          <span class="buyer-tag">${b.sector}</span>
          <span class="buyer-tag">${b.region}</span>
          <span class="buyer-tag">${b.mandate}</span>
          <span class="buyer-tag">${b.volume}</span>
        </div>
        <div style="font-size:12px;color:#94a3b8;margin-top:8px;font-style:italic;">◎ ${b.signal}</div>
        <div class="buyer-actions">
          <button class="btn-sm primary" onclick="addToCarbonPipeline('${b.name}','${b.sector}')">+ Add to Pipeline</button>
          <button class="btn-sm" onclick="alert('AI outreach email drafted for ${b.name}')">Draft AI Email</button>
        </div>
      </div>
    `).join('');
    btn.textContent = '◎ Find Institutional Buyers';
    btn.classList.remove('scanning');
  }, 2000);
}

function addToCarbonPipeline(name, sector) {
  STATE.deals.push({ id: STATE.deals.length+1, buyer: name, type: 'Voluntary Portfolio', volume: 100000, value: 1500000, stage: 'Prospected' });
  alert('Added ' + name + ' to pipeline → Prospected');
}

// ─── KANBAN ───────────────────────────────────────────────────────────────────
function renderKanban() {
  const board = document.getElementById('carbon-kanban');
  board.innerHTML = STAGES.map(stage => {
    const stageDeals = STATE.deals.filter(d => d.stage === stage);
    const color = STAGE_COLORS[stage];
    return `
      <div class="kanban-col">
        <div class="kanban-col-header" style="--col-color:${color}">
          <span class="col-title" style="color:${color}">${stage}</span>
          <span class="col-count">${stageDeals.length}</span>
        </div>
        ${stageDeals.map(d => `
          <div class="deal-card" onclick="advanceDeal(${d.id})">
            <div class="deal-title">${d.buyer}</div>
            <div class="deal-value">$${(d.value/1e6).toFixed(2)}M</div>
            <div class="deal-meta">${(d.volume/1000).toFixed(0)}K tonnes · ${d.type}</div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function advanceDeal(id) {
  const deal = STATE.deals.find(d => d.id === id);
  if (!deal) return;
  const idx = STAGES.indexOf(deal.stage);
  if (idx < STAGES.length - 1) { deal.stage = STAGES[idx+1]; renderKanban(); }
}

function addDealModal() { document.getElementById('deal-modal').style.display = 'flex'; }
function closeDealModal() { document.getElementById('deal-modal').style.display = 'none'; }
function addCarbonDeal() {
  STATE.deals.push({
    id: STATE.deals.length+1,
    buyer: document.getElementById('new-deal-buyer').value || 'New Buyer',
    type: document.getElementById('new-deal-type').value,
    volume: parseInt(document.getElementById('new-deal-vol').value) || 50000,
    value: parseInt(document.getElementById('new-deal-val').value) || 750000,
    stage: 'Prospected'
  });
  closeDealModal();
  renderKanban();
}

// ─── BROKERS ──────────────────────────────────────────────────────────────────
function renderBrokers() {
  const el = document.getElementById('carbon-broker-list');
  el.innerHTML = STATE.brokers.map(b => `
    <div class="broker-card">
      <div class="broker-avatar" style="background:${b.color}22;color:${b.color}">${b.initials}</div>
      <div>
        <div class="broker-name">${b.name}</div>
        <div class="broker-spec">${b.region} · ${b.rate}% fee</div>
      </div>
      <div class="broker-stats">
        <div class="broker-commission">$${(b.ytd/1000).toFixed(0)}K</div>
        <div class="broker-deals">${b.deals} deals · <span class="status-badge ${b.status==='Active'?'status-paid':'status-pending'}">${b.status}</span></div>
      </div>
    </div>
  `).join('');

  const lb = document.getElementById('carbon-leaderboard');
  const sorted = [...STATE.brokers].sort((a,b) => b.ytd - a.ytd);
  lb.innerHTML = sorted.map((b,i) => `
    <div class="leaderboard-item">
      <div class="lb-rank">${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</div>
      <div class="lb-name">${b.name}</div>
      <div class="lb-amount">$${(b.ytd/1000).toFixed(0)}K</div>
    </div>
  `).join('');
}

function calcCarbonComm() {
  const deal = parseFloat(document.getElementById('cc-deal').value) || 0;
  const rate = parseFloat(document.getElementById('cc-platform').value) || 0;
  const total = deal * (rate / 100);
  document.getElementById('cc-total').textContent = total > 0 ? '$' + fmt(total) : '—';
  const sr = document.getElementById('cc-split-result');
  if (total > 0) {
    const titan = total * 0.20;
    const operator = total * 0.30;
    const broker = total * 0.50;
    sr.innerHTML = `
      <div class="split-item"><div class="split-label">Titan (20%)</div><div class="split-val" style="color:#10b981">$${fmt(titan)}</div></div>
      <div class="split-item"><div class="split-label">David (30%)</div><div class="split-val" style="color:#a78bfa">$${fmt(operator)}</div></div>
      <div class="split-item" style="grid-column:span 2"><div class="split-label">Broker (50%)</div><div class="split-val" style="color:#60a5fa">$${fmt(broker)}</div></div>
    `;
  }
}

function addBrokerModal() { document.getElementById('broker-modal').style.display = 'flex'; }
function addCarbonBroker() {
  const colors = ['#34d399','#60a5fa','#a78bfa','#f59e0b','#f87171'];
  const name = document.getElementById('nb-name').value || 'New Broker';
  STATE.brokers.push({
    id: STATE.brokers.length+1, name,
    initials: name.split(' ').map(w=>w[0]).join('').toUpperCase(),
    region: document.getElementById('nb-region').value,
    rate: parseFloat(document.getElementById('nb-rate').value) || 2.5,
    deals: 0, color: colors[STATE.brokers.length % colors.length],
    ytd: 0, status: 'Pending'
  });
  document.getElementById('broker-modal').style.display = 'none';
  renderBrokers();
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function renderAdmin() {
  renderCarbonEquity();
  renderCarbonPayments();
}

function renderCarbonEquity() {
  const el = document.getElementById('carbon-equity-tracker');
  if (!el) return;
  const operatorCount = 4; // wire to DB in production
  let tier, maxBuyback;
  if (operatorCount <= 100)       { tier = 1; maxBuyback = 80; }
  else if (operatorCount <= 300)  { tier = 2; maxBuyback = 70; }
  else if (operatorCount <= 500)  { tier = 3; maxBuyback = 60; }
  else                            { tier = 4; maxBuyback = 50; }

  el.innerHTML = `
    <div class="revshare-banner">
      <div>
        <h3>◆ Titan Operator Equity Program — CarbonVault</h3>
        <p>Titan currently owns <strong style="color:#10b981">100%</strong> of the entity. Future equity buyback options are tiered: 1-100 (<strong style="color:#10b981">80% option</strong>), 101-300 (<strong style="color:#10b981">70%</strong>), 301-500 (<strong style="color:#10b981">60%</strong>), 501+ (<strong style="color:#10b981">50%</strong>).</p>
      </div>
      <div class="revshare-split">
        <div class="rs-item"><div class="rs-pct" style="color:#10b981">100%</div><div class="rs-label">Titan Equity</div></div>
        <div class="rs-item"><div class="rs-pct" style="color:#34d399">0%</div><div class="rs-label">Operator Equity</div></div>
      </div>
    </div>
    <div class="card mt-2">
      <div class="card-header"><h3>Operator Tier Structure</h3><span class="badge-pill" style="background:rgba(16,185,129,0.12);color:#34d399;border-color:rgba(16,185,129,0.25)">Tier ${tier} Active</span></div>
      <div class="calc-split-row" style="margin-bottom:16px">
        <div class="split-item" ${tier === 1 ? 'style="border:1px solid rgba(52,211,153,0.25)"' : ''}>
          <div class="split-label">Tier 1 (1-100)</div>
          <div class="split-val" style="color:#34d399">Up to 80%</div>
        </div>
        <div class="split-item" ${tier === 2 ? 'style="border:1px solid rgba(52,211,153,0.25)"' : ''}>
          <div class="split-label">Tier 2 (101-300)</div>
          <div class="split-val" style="color:#f59e0b">Up to 70%</div>
        </div>
        <div class="split-item" ${tier === 3 ? 'style="border:1px solid rgba(52,211,153,0.25)"' : ''}>
          <div class="split-label">Tier 3 (301-500)</div>
          <div class="split-val" style="color:#a78bfa">Up to 60%</div>
        </div>
        <div class="split-item" ${tier === 4 ? 'style="border:1px solid rgba(52,211,153,0.25)"' : ''}>
          <div class="split-label">Tier 4 (501+)</div>
          <div class="split-val" style="color:#ef4444">Up to 50%</div>
        </div>
      </div>
      <div class="calc-split-row" style="margin-bottom:16px">
        <div class="split-item"><div class="split-label">Titan Platform Fee</div><div class="split-val" style="color:#10b981">20%</div></div>
        <div class="split-item"><div class="split-label">Operator Rev Share</div><div class="split-val" style="color:#a78bfa">30%</div></div>
        <div class="split-item"><div class="split-label">Broker Commission</div><div class="split-val" style="color:#34d399">50%</div></div>
      </div>
      <div style="font-size:13px;color:#94a3b8;background:rgba(255,255,255,0.03);border-radius:8px;padding:12px 16px;">
        <span>Current operator count: <strong style="color:#10b981">${operatorCount}</strong></span>
        <span style="margin-left:12px">Your tier: <strong style="color:#34d399">Tier ${tier} (max ${maxBuyback}%)</strong></span>
      </div>
    </div>
  `;
}

function renderCarbonPayments() {
  const el = document.getElementById('carbon-payments-panel');
  const payments = [
    { id:'CV-001', buyer:'Qantas Airways', vol:'120K t', value:2220000, titan:444000, operator:666000, broker:1110000, status:'Paid' },
    { id:'CV-002', buyer:'Lufthansa Group', vol:'250K t', value:4625000, titan:925000, operator:1387500, broker:2312500, status:'Pending' },
    { id:'CV-003', buyer:'Deutsche Bank', vol:'80K t', value:1760000, titan:352000, operator:528000, broker:880000, status:'Overdue' },
  ];
  el.innerHTML = `
    <div class="card-header"><h3>Payment Ledger — Rev Share: Titan 20% | David 30% | Broker 50%</h3><span class="badge-pill green-badge">Active</span></div>
    <table class="data-table">
      <thead><tr><th>ID</th><th>Buyer</th><th>Volume</th><th>Deal Value</th><th>Titan (20%)</th><th>David (30%)</th><th>Broker (50%)</th><th>Status</th></tr></thead>
      <tbody>${payments.map(p=>`
        <tr>
          <td>${p.id}</td><td>${p.buyer}</td><td>${p.vol}</td>
          <td>$${fmt(p.value)}</td>
          <td style="color:#10b981">$${fmt(p.titan)}</td>
          <td style="color:#a78bfa">$${fmt(p.operator)}</td>
          <td style="color:#60a5fa">$${fmt(p.broker)}</td>
          <td><span class="status-badge status-${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
      `).join('')}</tbody>
    </table>
    <div class="calc-split-row" style="margin-top:16px">
      <div class="split-item"><div class="split-label">Titan Total Collected</div><div class="split-val" style="color:#10b981">$${fmt(payments.reduce((s,p)=>s+p.titan,0))}</div></div>
      <div class="split-item"><div class="split-label">David Total</div><div class="split-val" style="color:#a78bfa">$${fmt(payments.reduce((s,p)=>s+p.operator,0))}</div></div>
    </div>
  `;
}

function fmt(n) {
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(0)+'K';
  return Math.round(n).toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
  showPanel('market');
});

function sendChat() {
  const input = document.getElementById('chat-input');
  if (!input.value.trim()) return;
  const body = document.getElementById('chat-body');
  
  const uMsg = document.createElement('div');
  uMsg.className = 'chat-msg user';
  uMsg.textContent = input.value;
  body.appendChild(uMsg);
  
  input.value = '';
  body.scrollTop = body.scrollHeight;
  
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-msg ai';
    const responses = [
      "I've scanned the live compliance data. Lufthansa's deficit matches your REDD+ inventory perfectly.",
      "The current split is configured to 60% Titan, up to 40% David. Your recruits are paid passively from the gross.",
      "I can help you build an email outreach sequence to the buyer targets on your Pipeline. Shall I draft it?",
      "Your total Carbon Credit volume is up 6% this month. The platform is pacing well metrics-wise."
    ];
    aiMsg.textContent = responses[Math.floor(Math.random() * responses.length)];
    body.appendChild(aiMsg);
    body.scrollTop = body.scrollHeight;
  }, 800);
}
