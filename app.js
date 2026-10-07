// ===== STATE =====
const STORAGE_KEY = 'membresiapro_user';
let currentUser = null;
let billingCycle = 'monthly';
let authMode = 'login'; // 'login' | 'register'
let pendingPlan = null;

const PRICES = {
  monthly: { pro: 12, business: 29 },
  yearly: { pro: 10, business: 23 } // ~20% off
};

const LIBRARY_ITEMS = [
  { id: 1, title: 'Plantilla de Contrato Freelance', desc: 'Contrato profesional listo para usar (PDF + DOCX)', free: true },
  { id: 2, title: 'Propuesta Comercial', desc: 'Estructura de propuesta que cierra clientes', free: true },
  { id: 3, title: 'Email de Follow-up', desc: 'Secuencia de 5 emails de seguimiento', free: false },
  { id: 4, title: 'Checklist de Lanzamiento', desc: 'Lista completa para lanzar un producto digital', free: false },
  { id: 5, title: 'Script de Ventas', desc: 'Guión para llamadas de discovery y cierre', free: false },
  { id: 6, title: 'Plantilla de Factura', desc: 'Factura profesional editable', free: true },
  { id: 7, title: 'Calendario de Contenido 30 días', desc: 'Plan de contenido listo para redes', free: false },
  { id: 8, title: 'Kit de Onboarding Cliente', desc: 'Emails + formularios de bienvenida', free: false },
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadUser();
  updateUI();
  renderLibrary();
  // close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dd = document.getElementById('userDropdown');
    const btn = document.getElementById('userBtn');
    if (dd && !dd.contains(e.target) && btn && !btn.contains(e.target)) {
      dd.classList.remove('open');
    }
  });
});

// ===== USER / AUTH =====
function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) currentUser = JSON.parse(raw);
  } catch (e) {
    currentUser = null;
  }
}

function saveUser() {
  if (currentUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function openAuthModal(mode) {
  authMode = mode;
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authTitle');
  const sub = document.getElementById('authSub');
  const nameGroup = document.getElementById('nameGroup');
  const submit = document.getElementById('authSubmit');
  const switchText = document.getElementById('authSwitchText');
  const switchLink = document.getElementById('authSwitchLink');

  if (mode === 'register') {
    title.textContent = 'Crear cuenta';
    sub.textContent = 'Empieza gratis. Sin tarjeta de crédito.';
    nameGroup.style.display = 'block';
    submit.textContent = 'Crear cuenta gratis';
    switchText.textContent = '¿Ya tienes cuenta?';
    switchLink.textContent = 'Inicia sesión';
  } else {
    title.textContent = 'Iniciar sesión';
    sub.textContent = 'Accede a tu cuenta de MembresíaPro';
    nameGroup.style.display = 'none';
    submit.textContent = 'Iniciar sesión';
    switchText.textContent = '¿No tienes cuenta?';
    switchLink.textContent = 'Regístrate';
  }
  modal.style.display = 'flex';
  document.getElementById('authEmail').focus();
}

function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('authForm').reset();
  pendingPlan = null;
}

function toggleAuthMode(e) {
  e.preventDefault();
  openAuthModal(authMode === 'login' ? 'register' : 'login');
}

function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value.trim().toLowerCase();
  const password = document.getElementById('authPassword').value;
  const name = document.getElementById('authName').value.trim();

  if (!email || !password) {
    showToast('Completa todos los campos', 'error');
    return;
  }

  if (authMode === 'register') {
    if (!name) {
      showToast('Ingresa tu nombre', 'error');
      return;
    }
    // Simulate registration
    currentUser = {
      id: Date.now().toString(),
      name,
      email,
      plan: pendingPlan || 'free',
      createdAt: new Date().toISOString(),
      usage: { prompts: 0, ideas: 0, calc: 0, lastReset: new Date().toDateString() },
      daily: { prompts: 0, ideas: 0, date: new Date().toDateString() }
    };
    saveUser();
    closeAuthModal();
    showToast('¡Cuenta creada! Bienvenido a MembresíaPro 🎉', 'success');
    updateUI();
    showView('dashboard');
  } else {
    // Simulate login (accept any email/password for demo)
    if (currentUser && currentUser.email === email) {
      // already have user
    } else {
      currentUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        plan: 'free',
        createdAt: new Date().toISOString(),
        usage: { prompts: 0, ideas: 0, calc: 0, lastReset: new Date().toDateString() },
        daily: { prompts: 0, ideas: 0, date: new Date().toDateString() }
      };
    }
    saveUser();
    closeAuthModal();
    showToast('Sesión iniciada correctamente', 'success');
    updateUI();
    showView('dashboard');
  }
}

function logout() {
  currentUser = null;
  saveUser();
  updateUI();
  showView('landing');
  showToast('Sesión cerrada', 'success');
}

// ===== PLANS =====
function selectPlan(plan) {
  pendingPlan = plan;
  if (currentUser) {
    changePlan(plan);
  } else {
    openAuthModal('register');
  }
}

function changePlan(plan) {
  if (!currentUser) {
    pendingPlan = plan;
    openAuthModal('register');
    return;
  }
  currentUser.plan = plan;
  saveUser();
  updateUI();
  showToast(`¡Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)} activado!`, 'success');
  showView('dashboard');
}

function cancelSubscription() {
  if (!currentUser) return;
  currentUser.plan = 'free';
  saveUser();
  updateUI();
  showToast('Suscripción cancelada. Ahora estás en el plan Free.', 'success');
}

// ===== UI UPDATES =====
function updateUI() {
  const btnLogin = document.getElementById('btnLogin');
  const btnSignup = document.getElementById('btnSignup');
  const userMenu = document.getElementById('userMenu');
  const navDashboard = document.getElementById('navDashboard');

  if (currentUser) {
    btnLogin.style.display = 'none';
    btnSignup.style.display = 'none';
    userMenu.style.display = 'block';
    navDashboard.style.display = 'inline';
    document.getElementById('userNameDisplay').textContent = currentUser.name.split(' ')[0];
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('planBadge').textContent = currentUser.plan;
    // account page
    document.getElementById('accName').value = currentUser.name;
    document.getElementById('accEmail').value = currentUser.email;
    document.getElementById('accPlanName').textContent = currentUser.plan.charAt(0).toUpperCase() + currentUser.plan.slice(1);
    const price = currentUser.plan === 'free' ? 0 : (PRICES.monthly[currentUser.plan] || 0);
    document.getElementById('accPlanPrice').textContent = price === 0 ? '$0 / siempre' : `$${price} / mes`;
    document.getElementById('accPlanDesc').textContent = planDescription(currentUser.plan);
    document.getElementById('btnCancelSub').style.display = currentUser.plan !== 'free' ? 'inline-flex' : 'none';
    // stats
    ensureDailyReset();
    document.getElementById('statPrompts').textContent = currentUser.usage.prompts || 0;
    document.getElementById('statIdeas').textContent = currentUser.usage.ideas || 0;
    document.getElementById('statCalc').textContent = currentUser.usage.calc || 0;
    updateUsageBadge();
    updatePricingButtons();
  } else {
    btnLogin.style.display = 'inline-flex';
    btnSignup.style.display = 'inline-flex';
    userMenu.style.display = 'none';
    navDashboard.style.display = 'none';
  }
}

function planDescription(plan) {
  const map = {
    free: 'Acceso básico con límites diarios.',
    pro: 'Generaciones ilimitadas + biblioteca premium.',
    business: 'Todo Pro + equipos y soporte prioritario.'
  };
  return map[plan] || map.free;
}

function updatePricingButtons() {
  if (!currentUser) return;
  const plan = currentUser.plan;
  const freeBtn = document.getElementById('btnSelectFree');
  const proBtn = document.getElementById('btnSelectPro');
  const busBtn = document.getElementById('btnSelectBusiness');
  if (freeBtn) {
    freeBtn.textContent = plan === 'free' ? 'Plan actual' : 'Bajar a Free';
    freeBtn.disabled = plan === 'free';
  }
  if (proBtn) {
    proBtn.textContent = plan === 'pro' ? 'Plan actual' : 'Activar Pro';
    proBtn.className = plan === 'pro' ? 'btn btn-outline btn-block' : 'btn btn-primary btn-block';
  }
  if (busBtn) {
    busBtn.textContent = plan === 'business' ? 'Plan actual' : 'Activar Business';
    busBtn.className = plan === 'business' ? 'btn btn-outline btn-block' : 'btn btn-outline btn-block';
  }
}

function ensureDailyReset() {
  if (!currentUser) return;
  const today = new Date().toDateString();
  if (currentUser.daily.date !== today) {
    currentUser.daily = { prompts: 0, ideas: 0, date: today };
    saveUser();
  }
}

function updateUsageBadge() {
  if (!currentUser) return;
  ensureDailyReset();
  const el = document.getElementById('usageText');
  const plan = currentUser.plan;
  if (plan === 'free') {
    const left = Math.max(0, 5 - currentUser.daily.prompts);
    el.textContent = `${left} / 5 prompts restantes hoy`;
  } else {
    el.textContent = 'Ilimitado ✓';
  }
}

// ===== VIEWS =====
function showView(view) {
  ['landing', 'dashboard', 'account', 'pricing'].forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.style.display = v === view ? 'block' : 'none';
  });
  // special for pricing from nav
  if (view === 'pricing' && !currentUser) {
    document.getElementById('view-landing').style.display = 'block';
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (view === 'dashboard' && !currentUser) {
    openAuthModal('login');
    return;
  }
  if (view === 'dashboard') {
    setTool('prompts');
  }
  if (view === 'account') {
    updateUI();
  }
  // close mobile nav
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleMobileNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

function toggleUserDropdown() {
  document.getElementById('userDropdown').classList.toggle('open');
}

// ===== BILLING TOGGLE =====
function setBilling(cycle) {
  billingCycle = cycle;
  const prices = PRICES[cycle];
  ['pricePro', 'pricePro2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '$' + prices.pro;
  });
  ['priceBusiness', 'priceBusiness2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '$' + prices.business;
  });
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  if (cycle === 'monthly') {
    document.getElementById('toggleMonthly')?.classList.add('active');
    document.getElementById('toggleMonthly2')?.classList.add('active');
  } else {
    document.getElementById('toggleYearly')?.classList.add('active');
    document.getElementById('toggleYearly2')?.classList.add('active');
  }
}

// ===== TOOLS =====
function setTool(tool) {
  document.querySelectorAll('.tool-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  const panel = document.getElementById('tool-' + tool);
  if (panel) panel.style.display = 'block';
  const btn = document.querySelector(`.sidebar-item[data-tool="${tool}"]`);
  if (btn) btn.classList.add('active');

  const titles = {
    prompts: { title: 'Generador de Prompts', desc: 'Crea prompts profesionales optimizados para cualquier modelo de IA.' },
    ideas: { title: 'Ideas de Contenido', desc: 'Genera ideas virales para tus redes y canales de contenido.' },
    calculator: { title: 'Calculadora de Precios', desc: 'Calcula el precio justo para tus proyectos freelance.' },
    library: { title: 'Biblioteca de Recursos', desc: 'Plantillas y recursos listos para descargar y usar.' }
  };
  const t = titles[tool] || titles.prompts;
  document.getElementById('toolTitle').textContent = t.title;
  document.getElementById('toolDesc').textContent = t.desc;
  updateUsageBadge();
}

function canUse(tool) {
  if (!currentUser) {
    openAuthModal('login');
    return false;
  }
  ensureDailyReset();
  if (currentUser.plan !== 'free') return true;
  if (tool === 'prompts' && currentUser.daily.prompts >= 5) {
    showToast('Límite diario alcanzado. Mejora a Pro para uso ilimitado.', 'error');
    return false;
  }
  if (tool === 'ideas' && currentUser.daily.ideas >= 3) {
    showToast('Límite diario alcanzado. Mejora a Pro para uso ilimitado.', 'error');
    return false;
  }
  return true;
}

function generatePrompt() {
  if (!canUse('prompts')) return;
  const type = document.getElementById('promptType').value;
  const input = document.getElementById('promptInput').value.trim();
  const tone = document.getElementById('promptTone').value;
  const length = document.getElementById('promptLength').value;

  if (!input) {
    showToast('Describe el tema del prompt', 'error');
    return;
  }

  const templates = {
    chatgpt: `Actúa como un experto en ${input}.\n\nEscribe un contenido con tono ${tone}, de longitud ${length}.\n\nIncluye:\n- Introducción atractiva\n- Puntos clave claros\n- Llamado a la acción\n- Formato fácil de leer\n\nContexto adicional: ${input}`,
    midjourney: `A highly detailed, professional image of ${input}, cinematic lighting, 8k resolution, sharp focus, --ar 16:9 --v 6 --style raw\n\nVariations:\n1. ${input} in a minimalist style\n2. ${input} with dramatic atmosphere\n3. ${input} product photography style`,
    video: `Crea un script de video corto (30-60s) sobre: ${input}\n\nTono: ${tone}\nEstructura:\n1. Hook (primeros 3 segundos)\n2. Problema / contexto\n3. Solución / valor\n4. Call to action\n\nIncluye sugerencias de texto en pantalla y ritmo de edición.`,
    email: `Escribe un email de ${tone} sobre: ${input}\n\nLongitud: ${length}\n\nIncluye:\n- Asunto atractivo (3 opciones)\n- Apertura personalizada\n- Cuerpo con valor claro\n- CTA único y fuerte\n- PS opcional`,
    code: `Eres un senior software engineer. Ayúdame con: ${input}\n\nProporciona:\n- Código limpio y comentado\n- Explicación de la lógica\n- Mejores prácticas\n- Posibles edge cases\n- Ejemplo de uso`
  };

  const result = templates[type] || templates.chatgpt;
  document.getElementById('promptResultText').textContent = result;
  document.getElementById('promptResult').style.display = 'block';

  currentUser.daily.prompts++;
  currentUser.usage.prompts = (currentUser.usage.prompts || 0) + 1;
  saveUser();
  updateUsageBadge();
  updateUI();
  showToast('Prompt generado ✓', 'success');
}

function generateIdeas() {
  if (!canUse('ideas')) return;
  const topic = document.getElementById('ideasTopic').value.trim();
  const platform = document.getElementById('ideasPlatform').value;
  const count = parseInt(document.getElementById('ideasCount').value, 10) || 10;

  if (!topic) {
    showToast('Ingresa un nicho o tema', 'error');
    return;
  }

  const hooks = [
    'Cómo lograr X en 7 días',
    'El error #1 que cometen los principiantes en',
    'Lo que nadie te dice sobre',
    'Mi sistema de X que triplicó mis resultados',
    'Por qué dejé de hacer X (y qué hago ahora)',
    '3 herramientas gratuitas para',
    'La verdad incómoda sobre',
    'De 0 a X: mi proceso paso a paso',
    'Lo que aprendí después de 100 días de',
    'Si solo pudiera dar un consejo sobre',
    'El framework que uso para',
    'Antes vs Después: transformación en',
    '5 mitos sobre X que debes dejar de creer',
    'La estrategia de X que me generó Y',
    'Cómo cobrar más por tus servicios de'
  ];

  const platformTips = {
    instagram: ' (carrusel o Reels)',
    tiktok: ' (hook en 3s + tendencia)',
    youtube: ' (título SEO + thumbnail idea)',
    blog: ' (artículo largo SEO)',
    linkedin: ' (post profesional + historia)',
    newsletter: ' (asunto + valor semanal)'
  };

  const tip = platformTips[platform] || '';
  let html = '';
  for (let i = 0; i < count; i++) {
    const hook = hooks[i % hooks.length];
    const idea = hook.replace('X', topic).replace('Y', 'resultados reales') + tip;
    html += `<div class="idea-item"><span class="idea-num">${i + 1}.</span><span>${idea}</span></div>`;
  }
  document.getElementById('ideasResultText').innerHTML = html;
  document.getElementById('ideasResult').style.display = 'block';

  currentUser.daily.ideas++;
  currentUser.usage.ideas = (currentUser.usage.ideas || 0) + 1;
  saveUser();
  updateUsageBadge();
  updateUI();
  showToast(`${count} ideas generadas ✓`, 'success');
}

function calculatePrice() {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  const hours = parseFloat(document.getElementById('calcHours').value) || 0;
  const rate = parseFloat(document.getElementById('calcRate').value) || 0;
  const exp = parseFloat(document.getElementById('calcExperience').value) || 1;
  const margin = parseFloat(document.getElementById('calcMargin').value) || 0;
  const extras = parseFloat(document.getElementById('calcExtras').value) || 0;

  if (hours <= 0 || rate <= 0) {
    showToast('Ingresa horas y tarifa válidas', 'error');
    return;
  }

  const base = hours * rate;
  const withExp = base * exp;
  const withMargin = withExp * (1 + margin / 100);
  const final = Math.round(withMargin + extras);

  document.getElementById('calcBase').textContent = '$' + Math.round(base).toLocaleString();
  document.getElementById('calcExp').textContent = '$' + Math.round(withExp).toLocaleString();
  document.getElementById('calcWithMargin').textContent = '$' + Math.round(withMargin).toLocaleString();
  document.getElementById('calcFinal').textContent = '$' + final.toLocaleString();

  let tip = '';
  if (final < 500) tip = '💡 Tip: Para proyectos pequeños considera un mínimo de $500-800 para proteger tu tiempo.';
  else if (final > 5000) tip = '💡 Tip: Proyectos grandes justifican un anticipo del 40-50% y entregas por hitos.';
  else tip = '💡 Tip: Presenta este precio con confianza. Incluye el valor y el resultado, no solo las horas.';
  document.getElementById('calcTip').textContent = tip;
  document.getElementById('calcResult').style.display = 'block';

  currentUser.usage.calc = (currentUser.usage.calc || 0) + 1;
  saveUser();
  updateUI();
  showToast('Cálculo listo ✓', 'success');
}

function renderLibrary() {
  const grid = document.getElementById('libraryGrid');
  if (!grid) return;
  const isPremium = currentUser && (currentUser.plan === 'pro' || currentUser.plan === 'business');
  grid.innerHTML = LIBRARY_ITEMS.map(item => {
    const locked = !item.free && !isPremium;
    return `
      <div class="library-card ${locked ? 'locked' : ''}">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
        ${locked
          ? '<span class="lock-badge">🔒 Solo Pro / Business</span>'
          : '<button class="btn btn-ghost btn-sm" onclick="downloadResource(\'' + item.title + '\')">Descargar</button>'
        }
      </div>
    `;
  }).join('');
}

function downloadResource(title) {
  showToast(`"${title}" descargado (demo)`, 'success');
}

// ===== PROFILE =====
function saveProfile() {
  if (!currentUser) return;
  const name = document.getElementById('accName').value.trim();
  if (!name) {
    showToast('El nombre no puede estar vacío', 'error');
    return;
  }
  currentUser.name = name;
  saveUser();
  updateUI();
  showToast('Perfil actualizado', 'success');
}

// ===== UTILS =====
function copyResult(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado al portapapeles ✓', 'success');
  }).catch(() => {
    showToast('No se pudo copiar', 'error');
  });
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Re-render library when plan changes
const originalChangePlan = changePlan;
changePlan = function(plan) {
  originalChangePlan(plan);
  renderLibrary();
};
