// ============================================================================
// DECIFRADORES DE MISTÉRIOS - CONTROLADOR PRINCIPAL DA APLICAÇÃO (APP.JS)
// ============================================================================

// Estado Global da Aplicação
const AppState = {
    activeStudent: null,
    isTeacher: false,
    currentSubjectKey: null,
    currentLessonId: null,
    currentLessonData: null,
    currentActivityIndex: 0,
    currentLessonScores: {},
    soundEnabled: true,
    currentTheme: 'light',
    teacherPassword: 'prof123',
    cachedStudents: [],
    // JOGAR JUNTO (Live Multiplayer)
    isLiveSessionActive: false,
    currentLiveSession: null,
    currentLiveEnigmaIndex: -1,
    liveTimerInterval: null,
    hasAnsweredCurrentLiveEnigma: false
};

// Sincroniza o visual do cabeçalho conforme o estado de autenticação (Aluno, Professor ou Visitante)
function updateHeaderAuthUI() {
    const studentProfile = document.getElementById('header-student-badge');
    const teacherBadge = document.getElementById('header-teacher-badge');
    const btnTeacherDash = document.getElementById('btn-header-teacher-dash');
    const btnLogout = document.getElementById('btn-logout');
    const btnTeacherAccess = document.getElementById('btn-open-teacher-auth');

    if (AppState.isTeacher) {
        if (studentProfile) studentProfile.style.display = 'none';
        if (teacherBadge) teacherBadge.style.display = 'inline-flex';
        if (btnTeacherDash) btnTeacherDash.style.display = 'inline-flex';
        if (btnLogout) {
            btnLogout.style.display = 'inline-flex';
            btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> <span>Sair do Professor</span>';
        }
        if (btnTeacherAccess) btnTeacherAccess.style.display = 'none';
    } else if (AppState.activeStudent) {
        const student = AppState.activeStudent;
        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === student.avatar) || AVATARES_DISPONIVEIS[0];
        if (document.getElementById('header-student-avatar')) {
            document.getElementById('header-student-avatar').textContent = avatarObj.icone;
        }
        if (document.getElementById('header-student-name')) {
            document.getElementById('header-student-name').textContent = student.codinome;
        }
        if (document.getElementById('header-student-xp')) {
            document.getElementById('header-student-xp').textContent = `${student.totalXp || 0} XP`;
        }
        if (studentProfile) studentProfile.style.display = 'flex';
        if (teacherBadge) teacherBadge.style.display = 'none';
        if (btnTeacherDash) btnTeacherDash.style.display = 'none';
        if (btnLogout) {
            btnLogout.style.display = 'inline-flex';
            btnLogout.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> <span>Sair</span>';
        }
        if (btnTeacherAccess) btnTeacherAccess.style.display = 'flex';
    } else {
        if (studentProfile) studentProfile.style.display = 'none';
        if (teacherBadge) teacherBadge.style.display = 'none';
        if (btnTeacherDash) btnTeacherDash.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnTeacherAccess) btnTeacherAccess.style.display = 'flex';
    }
}

// ============================================================================
// SINTETIZADOR DE EFEITOS SONOROS (WEB AUDIO API)
// ============================================================================
class SoundFX {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (!AppState.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        } catch (e) {}
    }

    playSuccess() {
        if (!AppState.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            freqs.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, now + (i * 0.08));
                gain.gain.setValueAtTime(0.15, now + (i * 0.08));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.08) + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + (i * 0.08));
                osc.stop(now + (i * 0.08) + 0.25);
            });
        } catch (e) {}
    }

    playFanfare() {
        if (!AppState.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const notes = [440, 554.37, 659.25, 880, 1108.73];
            const now = this.ctx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.1));
                gain.gain.setValueAtTime(0.1, now + (idx * 0.1));
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.1) + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now + (idx * 0.1));
                osc.stop(now + (idx * 0.1) + 0.4);
            });
        } catch (e) {}
    }

    playError() {
        if (!AppState.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }
}

const soundManager = new SoundFX();

// ============================================================================
// SISTEMA DE NOTIFICAÇÕES (TOAST)
// ============================================================================
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================================================
// GERENCIADOR DE TELAS (ROUTER SPA)
// ============================================================================
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Gerencia visibilidade da barra de reingresso na sessão ao vivo
    const rejoinBanner = document.getElementById('student-live-banner-rejoin');
    if (rejoinBanner) {
        const isLiveOngoing = AppState.currentLiveSession && ['lobby', 'playing', 'enigma_ranking'].includes(AppState.currentLiveSession.status);
        if (AppState.activeStudent && isLiveOngoing && viewId !== 'view-student-live-session' && viewId !== 'view-welcome') {
            rejoinBanner.style.display = 'flex';
            const bannerLessonInfo = document.getElementById('live-banner-lesson-info');
            if (bannerLessonInfo && AppState.currentLiveSession) {
                bannerLessonInfo.textContent = `${AppState.currentLiveSession.lessonTitle} • Investigação ao vivo com a turma`;
            }
        } else {
            rejoinBanner.style.display = 'none';
        }
    }

    updateHeaderUI();
}

function updateHeaderUI() {
    const studentBadge = document.getElementById('header-student-badge');
    const btnLogout = document.getElementById('btn-logout');
    const studentAvatar = document.getElementById('header-student-avatar');
    const studentName = document.getElementById('header-student-name');
    const studentXp = document.getElementById('header-student-xp');

    if (AppState.activeStudent) {
        studentBadge.style.display = 'flex';
        btnLogout.style.display = 'flex';

        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === AppState.activeStudent.avatar) || AVATARES_DISPONIVEIS[0];
        studentAvatar.textContent = avatarObj.icone;
        studentName.textContent = AppState.activeStudent.codinome;

        const totalXp = AppState.activeStudent.totalXp || 0;
        studentXp.textContent = `${totalXp} XP`;
    } else {
        studentBadge.style.display = 'none';
        btnLogout.style.display = 'none';
    }
}

// ============================================================================
// GERENCIADOR DE TEMA (MODO CLARO / MODO ESCURO)
// ============================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('decifradores_theme') || 'light';
    applyTheme(savedTheme, false);
}

function applyTheme(theme, notify = true) {
    AppState.currentTheme = theme;
    localStorage.setItem('decifradores_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const btnTheme = document.getElementById('btn-toggle-theme');
    if (btnTheme) {
        if (theme === 'light') {
            btnTheme.innerHTML = '<i class="fa-solid fa-sun" style="color: var(--neon-amber);"></i>';
            btnTheme.title = 'Alternar para Modo Escuro';
        } else {
            btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
            btnTheme.title = 'Alternar para Modo Claro';
        }
    }

    if (notify) {
        showToast(theme === 'light' ? 'Modo Claro ativado ☀️' : 'Modo Escuro ativado 🌙', 'info', 2000);
    }
}

function toggleTheme() {
    const next = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
}

// ============================================================================
// MODAL DE CONFIRMAÇÃO PERSONALIZADO DO DETETIVE
// ============================================================================
function showCustomConfirm(options = {}) {
    return new Promise((resolve) => {
        const modal = document.getElementById('modal-custom-confirm');
        if (!modal) {
            resolve(true);
            return;
        }

        document.getElementById('confirm-modal-title').textContent = options.title || 'Atenção, Detetive!';
        document.getElementById('confirm-modal-message').innerHTML = options.message || 'Deseja prosseguir?';
        
        const iconEl = document.getElementById('confirm-modal-icon');
        if (iconEl) {
            iconEl.innerHTML = options.iconHtml || '<i class="fa-solid fa-triangle-exclamation"></i>';
        }

        const btnOk = document.getElementById('btn-confirm-modal-ok');
        const btnCancel = document.getElementById('btn-confirm-modal-cancel');
        const btnClose = document.getElementById('btn-close-confirm-modal');

        if (btnOk) {
            btnOk.textContent = options.confirmText || 'Avançar Mesmo Assim';
        }
        if (btnCancel) {
            btnCancel.textContent = options.cancelText || 'Continuar Tentando';
        }

        const cleanup = () => {
            modal.classList.remove('active');
            if (btnOk) btnOk.onclick = null;
            if (btnCancel) btnCancel.onclick = null;
            if (btnClose) btnClose.onclick = null;
        };

        if (btnOk) {
            btnOk.onclick = () => {
                soundManager.playClick();
                cleanup();
                resolve(true);
            };
        }

        if (btnCancel) {
            btnCancel.onclick = () => {
                soundManager.playClick();
                cleanup();
                resolve(false);
            };
        }

        if (btnClose) {
            btnClose.onclick = () => {
                soundManager.playClick();
                cleanup();
                resolve(false);
            };
        }

        modal.classList.add('active');
    });
}

// ============================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializa tema salvo
    initTheme();

    // Inicializa sons ao primeiro clique
    document.body.addEventListener('click', () => soundManager.init(), { once: true });

    // Preenche seleção de avatares no cadastro
    renderAvatarPicker();

    // Configura Listeners de Botões
    setupNavigationListeners();
    setupAuthListeners();
    setupStudentHubListeners();
    setupLessonsViewListeners();
    setupTeacherDashboardListeners();
    setupLiveSessionListeners();

    // Carrega sessão salva se houver
    const savedStudent = dbService.getActiveStudent();
    if (savedStudent) {
        AppState.activeStudent = savedStudent;
        AppState.isTeacher = false;
        updateHeaderAuthUI();
        renderStudentHub();
        showView('view-student-hub');
    } else {
        AppState.isTeacher = false;
        updateHeaderAuthUI();
        showView('view-welcome');
    }

    // Inicializa dados de exemplo se o banco estiver vazio
    seedSampleStudentsIfEmpty();
});

// Seed inicial opcional para testes do professor
async function seedSampleStudentsIfEmpty() {
    const students = await dbService.getAllStudents();
    if (students.length === 0) {
        const demoStudent1 = {
            codinome: 'AgenteFalcão',
            senha: '123',
            avatar: 'lupa_dourada',
            totalXp: 50,
            progress: {
                matematica: {
                    completedLessons: {},
                    lastLesson: null,
                    lastActivity: null,
                    totalScore: 0
                },
                portugues: {
                    completedLessons: {},
                    lastLesson: null,
                    lastActivity: null,
                    totalScore: 0
                }
            },
            currentActivityStatus: 'Matemática - Aula 1: Senso Numérico e Contagem'
        };
        await dbService.saveStudent(demoStudent1);
    }
}

// ============================================================================
// 1. RENDERIZADOR DE AVATARES NO CADASTRO
// ============================================================================
function renderAvatarPicker() {
    const grid = document.getElementById('create-avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    AVATARES_DISPONIVEIS.forEach((avatar, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `avatar-option-btn ${index === 0 ? 'selected' : ''}`;
        btn.dataset.avatarId = avatar.id;
        btn.innerHTML = `
            <span class="avatar-option-emoji">${avatar.icone}</span>
            <span class="avatar-option-name">${avatar.nome}</span>
        `;

        btn.addEventListener('click', () => {
            soundManager.playClick();
            document.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('input-create-avatar').value = avatar.id;
        });

        grid.appendChild(btn);
    });
}

function renderEditAvatarPicker(selectedAvatarId) {
    const grid = document.getElementById('edit-avatar-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentId = selectedAvatarId || AVATARES_DISPONIVEIS[0].id;
    const hiddenInput = document.getElementById('input-edit-avatar');
    if (hiddenInput) {
        hiddenInput.value = currentId;
    }

    AVATARES_DISPONIVEIS.forEach((avatar) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `avatar-option-btn ${avatar.id === currentId ? 'selected' : ''}`;
        btn.dataset.avatarId = avatar.id;
        btn.innerHTML = `
            <span class="avatar-option-emoji">${avatar.icone}</span>
            <span class="avatar-option-name">${avatar.nome}</span>
        `;

        btn.addEventListener('click', () => {
            soundManager.playClick();
            grid.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            if (hiddenInput) {
                hiddenInput.value = avatar.id;
            }
        });

        grid.appendChild(btn);
    });
}

// ============================================================================
// 2. LISTENERS DE NAVEGAÇÃO
// ============================================================================
function setupNavigationListeners() {
    // Logo clica para voltar para Home ou Hub
    document.getElementById('btn-brand-home')?.addEventListener('click', (e) => {
        e.preventDefault();
        soundManager.playClick();
        if (AppState.isTeacher) {
            renderStudentHub();
            showView('view-student-hub');
        } else if (AppState.activeStudent) {
            renderStudentHub();
            showView('view-student-hub');
        } else {
            showView('view-welcome');
        }
    });

    // Alternar Tema (Modo Claro / Modo Escuro)
    const btnTheme = document.getElementById('btn-toggle-theme');
    btnTheme?.addEventListener('click', () => {
        soundManager.playClick();
        toggleTheme();
    });

    // Alternar Som
    const btnSound = document.getElementById('btn-toggle-sound');
    btnSound?.addEventListener('click', () => {
        AppState.soundEnabled = !AppState.soundEnabled;
        btnSound.innerHTML = AppState.soundEnabled 
            ? '<i class="fa-solid fa-volume-high"></i>' 
            : '<i class="fa-solid fa-volume-xmark" style="color: var(--neon-rose);"></i>';
        showToast(AppState.soundEnabled ? 'Efeitos sonoros ativados 🔊' : 'Efeitos sonoros desativados 🔇', 'info', 2000);
    });

    // Atalho Header: Painel da Turma (quando em Modo Professor)
    document.getElementById('btn-header-teacher-dash')?.addEventListener('click', () => {
        soundManager.playClick();
        openTeacherDashboard();
    });

    // Botão Sair (Aluno ou Professor)
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        soundManager.playClick();
        dbService.clearActiveStudent();
        AppState.activeStudent = null;
        AppState.isTeacher = false;
        updateHeaderAuthUI();
        showToast('Você saiu com segurança.', 'info');
        showView('view-welcome');
    });

    // Landing -> Criar Perfil
    document.getElementById('btn-go-create-profile')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('form-create-profile')?.reset();
        showView('view-create-profile');
    });

    // Landing -> Acessar Perfil (Login)
    document.getElementById('btn-go-login-profile')?.addEventListener('click', () => {
        soundManager.playClick();
        openLoginView();
    });

    // Botões Voltar nos forms de auth
    document.querySelectorAll('.btn-go-welcome').forEach(btn => {
        btn.addEventListener('click', () => {
            soundManager.playClick();
            showView('view-welcome');
        });
    });

    // Trocar de Login para Cadastro e vice-versa
    document.getElementById('btn-switch-to-login')?.addEventListener('click', () => {
        soundManager.playClick();
        openLoginView();
    });

    document.getElementById('btn-switch-to-create')?.addEventListener('click', () => {
        soundManager.playClick();
        showView('view-create-profile');
    });
}

// ============================================================================
// 3. AUTENTICAÇÃO E PERFIS (CADASTRO E LOGIN)
// ============================================================================
function setupAuthListeners() {
    // Botão de Acesso do Professor na Landing Page
    document.getElementById('btn-welcome-teacher-login')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('modal-teacher-auth')?.classList.add('active');
        const passInput = document.getElementById('input-teacher-master-password');
        if (passInput) {
            passInput.value = '';
            passInput.focus();
        }
    });

    // FORMULÁRIO DE CRIAR PERFIL
    const formCreate = document.getElementById('form-create-profile');
    formCreate?.addEventListener('submit', async (e) => {
        e.preventDefault();
        soundManager.playClick();

        const fullname = document.getElementById('input-create-fullname')?.value.trim() || '';
        const codename = document.getElementById('input-create-codename').value.trim();
        const avatar = document.getElementById('input-create-avatar').value;
        const password = document.getElementById('input-create-password').value;
        const passwordConfirm = document.getElementById('input-create-password-confirm').value;

        if (!fullname) {
            showToast('Por favor, informe seu Nome Real para identificação do professor!', 'error');
            return;
        }

        if (!codename) {
            showToast('Por favor, informe seu Codinome de detetive!', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            soundManager.playError();
            showToast('As senhas digitadas não coincidem! Verifique e tente novamente.', 'error');
            return;
        }

        // Verifica se codinome já existe
        const existing = await dbService.getStudentByCodename(codename);
        if (existing) {
            soundManager.playError();
            showToast(`O codinome "${codename}" já está em uso por outro agente! Escolha outro.`, 'error');
            return;
        }

        const newStudent = {
            nomeReal: fullname,
            codinome: codename,
            avatar: avatar,
            senha: password, // Mantida para consulta do professor
            createdAt: new Date().toISOString(),
            totalXp: 0,
            progress: {
                matematica: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 },
                portugues: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 }
            }
        };

        const saved = await dbService.saveStudent(newStudent);
        dbService.setActiveStudent(saved);
        AppState.activeStudent = saved;
        AppState.isTeacher = false;

        updateHeaderAuthUI();
        soundManager.playSuccess();
        confettiCelebration();
        showToast(`Bem-vindo à agência, ${fullname} (Detetive ${codename})! 🕵️‍♂️`, 'success');

        renderStudentHub();
        showView('view-student-hub');
    });

    // FORMULÁRIO DE LOGIN DE ALUNO
    const formLogin = document.getElementById('form-login-profile');
    formLogin?.addEventListener('submit', async (e) => {
        e.preventDefault();
        soundManager.playClick();

        const selectedCodename = document.getElementById('input-login-selected-codename').value;
        const password = document.getElementById('input-login-password').value;

        if (!selectedCodename) {
            soundManager.playError();
            showToast('Por favor, selecione seu codinome na lista acima!', 'error');
            return;
        }

        const student = await dbService.getStudentByCodename(selectedCodename);
        if (!student) {
            soundManager.playError();
            showToast('Perfil de detetive não encontrado.', 'error');
            return;
        }

        if (student.senha !== password) {
            soundManager.playError();
            showToast('Senha incorreta! Peça ajuda ao seu professor se esqueceu.', 'error');
            return;
        }

        dbService.setActiveStudent(student);
        AppState.activeStudent = student;
        AppState.isTeacher = false;

        updateHeaderAuthUI();
        soundManager.playSuccess();
        showToast(`Acesso autorizado! Olá, ${student.codinome}.`, 'success');

        renderStudentHub();
        showView('view-student-hub');
    });

    // Busca de Codinomes no Login
    const searchCodenames = document.getElementById('input-search-codenames');
    searchCodenames?.addEventListener('input', (e) => {
        filterLoginCodenames(e.target.value);
    });
}

// Abrir e Carregar Lista da Tela de Login
async function openLoginView() {
    showView('view-login-profile');
    const container = document.getElementById('login-codename-grid');
    container.innerHTML = '<div class="codename-empty-state"><i class="fa-solid fa-spinner fa-spin"></i> Carregando agentes...</div>';

    const students = await dbService.getAllStudents();
    AppState.cachedStudents = students;

    renderLoginCodenameList(students);
}

function renderLoginCodenameList(students) {
    const container = document.getElementById('login-codename-grid');
    if (!container) return;
    container.innerHTML = '';

    if (students.length === 0) {
        container.innerHTML = `
            <div class="codename-empty-state">
                <i class="fa-solid fa-user-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                Nenhum detetive cadastrado ainda.<br>
                <button type="button" class="link-btn" id="btn-empty-create" style="margin-top: 0.5rem; color: var(--neon-cyan);">
                    Clique aqui para criar o primeiro perfil!
                </button>
            </div>
        `;
        document.getElementById('btn-empty-create')?.addEventListener('click', () => {
            showView('view-create-profile');
        });
        return;
    }

    students.forEach((s, idx) => {
        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === s.avatar) || AVATARES_DISPONIVEIS[0];
        const item = document.createElement('div');
        item.className = `codename-card-item ${idx === 0 ? 'selected' : ''}`;
        item.dataset.codename = s.codinome;
        item.innerHTML = `
            <div class="codename-item-avatar">${avatarObj.icone}</div>
            <div class="codename-item-name">${s.codinome}</div>
        `;

        item.addEventListener('click', () => {
            soundManager.playClick();
            document.querySelectorAll('.codename-card-item').forEach(c => c.classList.remove('selected'));
            item.classList.add('selected');
            document.getElementById('input-login-selected-codename').value = s.codinome;
            document.getElementById('input-login-password').focus();
        });

        container.appendChild(item);
    });

    if (students.length > 0) {
        document.getElementById('input-login-selected-codename').value = students[0].codinome;
    }
}

function filterLoginCodenames(query) {
    const clean = query.toLowerCase().trim();
    const filtered = AppState.cachedStudents.filter(s => s.codinome.toLowerCase().includes(clean));
    renderLoginCodenameList(filtered);
}

// ============================================================================
// 4. HUB DO ALUNO (ÁREA PRINCIPAL APÓS LOGIN)
// ============================================================================
function renderStudentHub() {
    const studentStatsGroup = document.getElementById('hub-student-stats-group');
    const teacherActionsGroup = document.getElementById('hub-teacher-actions-group');
    const btnEditProfile = document.getElementById('btn-open-edit-codename');

    if (AppState.isTeacher) {
        document.getElementById('hub-agent-avatar').textContent = '👨‍🏫';
        document.getElementById('hub-agent-name').textContent = 'Professor(a)';

        const fullnameEl = document.getElementById('hub-agent-fullname-text');
        if (fullnameEl) {
            fullnameEl.textContent = 'Quartel-General do Professor • Gestão de Turma';
        }

        document.getElementById('hub-agent-rank-badge').textContent = '🎓 Modo Professor';
        
        if (studentStatsGroup) studentStatsGroup.style.display = 'none';
        if (teacherActionsGroup) teacherActionsGroup.style.display = 'flex';
        if (btnEditProfile) btnEditProfile.style.display = 'none';

        const mathTotalLessons = CURRICULO_INVESTIGACAO.matematica.aulas.length;
        document.getElementById('badge-math-count').textContent = `${mathTotalLessons} Aula(s)`;
        document.getElementById('label-math-percent').textContent = `100%`;
        document.getElementById('bar-math-fill').style.width = `100%`;

        const portTotalLessons = CURRICULO_INVESTIGACAO.portugues.aulas.length;
        document.getElementById('badge-port-count').textContent = portTotalLessons > 0 ? `${portTotalLessons} Aula(s)` : 'Em Breve';
        document.getElementById('label-port-percent').textContent = `0%`;
        document.getElementById('bar-port-fill').style.width = `0%`;

        updateHeaderAuthUI();
        return;
    }

    if (studentStatsGroup) studentStatsGroup.style.display = 'flex';
    if (teacherActionsGroup) teacherActionsGroup.style.display = 'none';
    if (btnEditProfile) btnEditProfile.style.display = 'inline-flex';

    const student = AppState.activeStudent;
    if (!student) return;

    // Atualiza Dossiê do Banner
    const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === student.avatar) || AVATARES_DISPONIVEIS[0];
    document.getElementById('hub-agent-avatar').textContent = avatarObj.icone;
    document.getElementById('hub-agent-name').textContent = student.codinome;

    // Exibe Nome Real do Aluno
    const fullnameEl = document.getElementById('hub-agent-fullname-text');
    if (fullnameEl) {
        fullnameEl.textContent = student.nomeReal || student.nome || 'Não informado';
    }

    const totalXp = student.totalXp || 0;
    const rank = getPatenteAluno(totalXp);
    document.getElementById('hub-agent-rank-badge').textContent = `${rank.insígnia} ${rank.titulo} (Nível ${rank.nivel})`;
    document.getElementById('hub-stat-xp').textContent = `${totalXp} XP`;

    // Calcula total de casos solucionados
    const mathCompleted = Object.values(student.progress?.matematica?.completedLessons || {}).filter(l => l.completed).length;
    const portCompleted = Object.values(student.progress?.portugues?.completedLessons || {}).filter(l => l.completed).length;
    const totalCompleted = mathCompleted + portCompleted;
    const totalAvailableLessons = CURRICULO_INVESTIGACAO.matematica.aulas.length + CURRICULO_INVESTIGACAO.portugues.aulas.length;
    document.getElementById('hub-stat-cases').textContent = `${totalCompleted} / ${totalAvailableLessons}`;

    // Atualiza Cartões das Disciplinas
    const mathTotalLessons = CURRICULO_INVESTIGACAO.matematica.aulas.length;
    const mathPercent = mathTotalLessons > 0 ? Math.round((mathCompleted / mathTotalLessons) * 100) : 0;
    document.getElementById('badge-math-count').textContent = mathTotalLessons > 0 ? `${mathCompleted} / ${mathTotalLessons} Aulas` : 'Em Breve';
    document.getElementById('label-math-percent').textContent = `${mathPercent}%`;
    document.getElementById('bar-math-fill').style.width = `${mathPercent}%`;

    const portTotalLessons = CURRICULO_INVESTIGACAO.portugues.aulas.length;
    const portPercent = portTotalLessons > 0 ? Math.round((portCompleted / portTotalLessons) * 100) : 0;
    document.getElementById('badge-port-count').textContent = portTotalLessons > 0 ? `${portCompleted} / ${portTotalLessons} Aulas` : 'Em Breve';
    document.getElementById('label-port-percent').textContent = `${portPercent}%`;
    document.getElementById('bar-port-fill').style.width = `${portPercent}%`;

    updateHeaderAuthUI();
}

function setupStudentHubListeners() {
    // Ações do Professor no Hub
    document.getElementById('btn-hub-teacher-open-dash')?.addEventListener('click', () => {
        soundManager.playClick();
        openTeacherDashboard();
    });

    document.getElementById('btn-hub-teacher-exit-mode')?.addEventListener('click', () => {
        soundManager.playClick();
        AppState.isTeacher = false;
        AppState.activeStudent = null;
        dbService.clearActiveStudent();
        updateHeaderAuthUI();
        showToast('Você saiu do Modo Professor com sucesso.', 'info');
        showView('view-welcome');
    });

    // Clicar em Matemática
    document.getElementById('card-subject-math')?.addEventListener('click', () => {
        soundManager.playClick();
        openSubjectLessons('matematica');
    });

    // Clicar em Língua Portuguesa
    document.getElementById('card-subject-portuguese')?.addEventListener('click', () => {
        soundManager.playClick();
        openSubjectLessons('portugues');
    });

    // Função para abrir o Modal de Edição de Perfil (Codinome e Avatar)
    const openEditProfileModal = () => {
        soundManager.playClick();
        if (!AppState.activeStudent) return;

        const fullnameStatic = document.getElementById('input-edit-fullname-static');
        if (fullnameStatic) {
            fullnameStatic.value = AppState.activeStudent.nomeReal || AppState.activeStudent.nome || 'Não cadastrado';
        }

        const newCodenameInput = document.getElementById('input-edit-new-codename');
        if (newCodenameInput) {
            newCodenameInput.value = AppState.activeStudent.codinome;
        }

        // Renderiza e seleciona o avatar atual
        renderEditAvatarPicker(AppState.activeStudent.avatar);

        document.getElementById('modal-edit-codename')?.classList.add('active');
        newCodenameInput?.focus();
    };

    // Abrir Modal de Edição de Perfil pelo botão ou pelo clique no avatar
    document.getElementById('btn-open-edit-codename')?.addEventListener('click', openEditProfileModal);
    document.getElementById('hub-agent-avatar')?.addEventListener('click', openEditProfileModal);

    // Fechar Modal de Edição de Perfil
    document.getElementById('btn-close-edit-codename')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('modal-edit-codename')?.classList.remove('active');
    });

    // Salvar Alterações do Perfil (Novo Codinome e Novo Avatar)
    document.getElementById('form-edit-codename')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        soundManager.playClick();

        if (!AppState.activeStudent) return;

        const oldCodename = AppState.activeStudent.codinome;
        const oldAvatar = AppState.activeStudent.avatar;
        const newCodename = document.getElementById('input-edit-new-codename').value.trim();
        const newAvatar = document.getElementById('input-edit-avatar').value || oldAvatar;

        if (!newCodename) {
            showToast('Por favor, digite seu novo codinome!', 'error');
            return;
        }

        if (newCodename === oldCodename && newAvatar === oldAvatar) {
            document.getElementById('modal-edit-codename')?.classList.remove('active');
            return;
        }

        const result = await dbService.updateStudentProfile(oldCodename, newCodename, newAvatar);
        if (!result.success) {
            soundManager.playError();
            showToast(result.message, 'error');
            return;
        }

        AppState.activeStudent = result.student;
        renderStudentHub();
        updateHeaderUI();

        document.getElementById('modal-edit-codename')?.classList.remove('active');
        soundManager.playSuccess();
        confettiCelebration();
        showToast(`Perfil atualizado com sucesso! 🕵️‍♂️✨`, 'success');
    });
}

// ============================================================================
// 5. TELA DE AULAS DA DISCIPLINA (STATUS E LISTA DE DOSSIÊS)
// ============================================================================
function openSubjectLessons(subjectKey) {
    AppState.currentSubjectKey = subjectKey;
    const subject = getDisciplina(subjectKey);
    if (!subject) return;
    if (!AppState.activeStudent && !AppState.isTeacher) return;

    // Atualiza Título e Estilo do Cabeçalho da Disciplina
    document.getElementById('subject-view-title').textContent = subject.nome;
    document.getElementById('subject-view-subtitle').textContent = subject.subtitulo;
    document.getElementById('subject-view-stamp').textContent = `DIVISÃO DE ${subject.nome.toUpperCase()}`;

    const studentSubjProgress = AppState.activeStudent?.progress?.[subjectKey] || { completedLessons: {} };
    const completedLessons = studentSubjProgress.completedLessons || {};

    // 1. ATUALIZA DESTAQUE: ÚLTIMA ATIVIDADE REALIZADA (CLICÁVEL SE HOUVER)
    const lastCard = document.getElementById('tracker-card-last');
    const lastArrow = document.getElementById('tracker-last-arrow');
    const lastLesson = studentSubjProgress.lastLesson;
    const lastActivity = studentSubjProgress.lastActivity;

    const lastLessonObj = lastLesson ? subject.aulas.find(a => a.id === lastLesson.id || a.numero === lastLesson.number || a.titulo === lastLesson.title) : null;

    if (lastLessonObj) {
        document.getElementById('tracker-last-title').textContent = `Aula ${lastLessonObj.numero} - ${lastLessonObj.titulo}`;
        document.getElementById('tracker-last-subtext').textContent = lastActivity 
            ? `👉 Clique para revisar • Atividade: ${lastActivity.title}` 
            : '👉 Clique para revisar esta aula';
        
        if (lastCard) {
            lastCard.classList.add('clickable');
            lastCard.title = `Clique para revisar a Aula ${lastLessonObj.numero}: ${lastLessonObj.titulo}`;
            lastCard.onclick = () => {
                soundManager.playClick();
                openLessonDetail(subjectKey, lastLessonObj.id);
            };
        }
        if (lastArrow) lastArrow.style.display = 'flex';
    } else if (AppState.isTeacher) {
        document.getElementById('tracker-last-title').textContent = '🎓 Gestão de Aulas do Professor';
        document.getElementById('tracker-last-subtext').textContent = 'Clique em qualquer aula abaixo para explorar ou abrir o JOGAR JUNTO';
        if (lastCard) {
            lastCard.classList.remove('clickable');
            lastCard.title = '';
            lastCard.onclick = null;
        }
        if (lastArrow) lastArrow.style.display = 'none';
    } else {
        document.getElementById('tracker-last-title').textContent = 'Nenhuma aula concluída ainda';
        document.getElementById('tracker-last-subtext').textContent = 'Inicie sua primeira investigação ao lado';
        if (lastCard) {
            lastCard.classList.remove('clickable');
            lastCard.title = '';
            lastCard.onclick = null;
        }
        if (lastArrow) lastArrow.style.display = 'none';
    }

    // 2. ATUALIZA DESTAQUE: PRÓXIMA AULA A REALIZAR (CLICÁVEL PARA INICIAR)
    const nextCard = document.getElementById('tracker-card-next');
    const nextArrow = document.getElementById('tracker-next-arrow');
    const nextLesson = getProximaAula(subjectKey, completedLessons) || (AppState.isTeacher && subject.aulas.length > 0 ? subject.aulas[0] : null);

    if (nextLesson) {
        document.getElementById('tracker-next-title').textContent = `Aula ${nextLesson.numero} - ${nextLesson.titulo}`;
        document.getElementById('tracker-next-subtext').textContent = AppState.isTeacher 
            ? `👉 Clique aqui para abrir a Aula ${nextLesson.numero} no Modo Professor` 
            : `👉 Clique aqui para abrir • ${nextLesson.tempoEstimado} (+${nextLesson.xpRecompensa} XP)`;
        
        if (nextCard) {
            nextCard.classList.add('clickable');
            nextCard.title = `Clique para abrir a Aula ${nextLesson.numero}: ${nextLesson.titulo}`;
            nextCard.onclick = () => {
                soundManager.playClick();
                openLessonDetail(subjectKey, nextLesson.id);
            };
        }
        if (nextArrow) nextArrow.style.display = 'flex';
    } else if (subject.aulas.length === 0) {
        document.getElementById('tracker-next-title').textContent = 'Aguardando Investigações';
        document.getElementById('tracker-next-subtext').textContent = 'Em breve novos casos forenses serão liberados!';
        if (nextCard) {
            nextCard.classList.remove('clickable');
            nextCard.title = '';
            nextCard.onclick = null;
        }
        if (nextArrow) nextArrow.style.display = 'none';
    } else {
        document.getElementById('tracker-next-title').textContent = '🎉 Todos os Casos Solucionados!';
        document.getElementById('tracker-next-subtext').textContent = 'Você dominou todas as investigações desta disciplina!';
        if (nextCard) {
            nextCard.classList.remove('clickable');
            nextCard.title = '';
            nextCard.onclick = null;
        }
        if (nextArrow) nextArrow.style.display = 'none';
    }

    // 3. RENDERIZA A LISTA DE AULAS
    const container = document.getElementById('lessons-dossier-list-container');
    container.innerHTML = '';

    // Botão JOGAR JUNTO no cabeçalho da disciplina (Apenas visível para Professor)
    const btnJogarJuntoHeader = document.getElementById('btn-jogar-junto-subject-header');
    if (btnJogarJuntoHeader) {
        btnJogarJuntoHeader.style.display = AppState.isTeacher ? 'inline-flex' : 'none';
    }

    if (subject.aulas.length === 0) {
        container.innerHTML = `
            <div class="empty-dossier-msg" style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1.5px dashed rgba(255,255,255,0.15); margin-top: 1rem;">
                <div style="font-size: 3rem; margin-bottom: 0.75rem;">📂</div>
                <h3 style="color: var(--text-primary); font-family: var(--font-heading); margin-bottom: 0.5rem; font-size: 1.3rem;">Nenhuma Investigação Cadastrada</h3>
                <p style="color: var(--text-muted); max-width: 460px; margin: 0 auto; line-height: 1.5;">Novas missões e casos forenses para esta disciplina serão adicionados em breve pelo Perito Chefe!</p>
            </div>
        `;
    } else {
        subject.aulas.forEach((aula) => {
        const isCompleted = completedLessons[aula.id]?.completed;
        const scoreInfo = completedLessons[aula.id];

        const item = document.createElement('div');
        item.className = `lesson-dossier-item ${isCompleted ? 'completed' : ''}`;
        
        let statusBadgeHtml = '';
        if (isCompleted) {
            statusBadgeHtml = `
                <span class="lesson-status-pill status-completed">
                    <i class="fa-solid fa-circle-check"></i> Concluída (${scoreInfo.score}/${scoreInfo.maxScore} XP)
                </span>
            `;
        } else if (nextLesson && nextLesson.id === aula.id) {
            statusBadgeHtml = `
                <span class="lesson-status-pill status-in-progress">
                    <i class="fa-solid fa-magnifying-glass"></i> Próxima Missão
                </span>
            `;
        } else {
            statusBadgeHtml = `
                <span class="lesson-status-pill status-available">
                    <i class="fa-solid fa-lock-open"></i> Disponível
                </span>
            `;
        }

        let jogarJuntoBtnHtml = '';
        if (AppState.isTeacher) {
            jogarJuntoBtnHtml = `
                <button type="button" class="btn-jogar-junto btn-jogar-junto-card" data-lesson-id="${aula.id}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
                    <i class="fa-solid fa-gamepad"></i> <span>Jogar Junto</span>
                </button>
            `;
        }

        item.innerHTML = `
            <div class="lesson-left-content">
                <div class="lesson-number-badge">
                    ${isCompleted ? '<i class="fa-solid fa-check"></i>' : `#0${aula.numero}`}
                </div>
                <div class="lesson-text-info">
                    <h4 class="lesson-title-h3">Aula ${aula.numero} - ${aula.titulo}</h4>
                    <p class="lesson-desc-p">${aula.descricao}</p>
                    <div class="lesson-meta-tags">
                        <span><i class="fa-regular fa-clock"></i> ${aula.tempoEstimado}</span>
                        <span><i class="fa-solid fa-award"></i> +${aula.xpRecompensa} XP</span>
                        <span><i class="fa-solid fa-layer-group"></i> ${aula.atividades.length} Enigmas</span>
                    </div>
                </div>
            </div>
            <div class="lesson-right-status">
                ${statusBadgeHtml}
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end; width: 100%;">
                    ${jogarJuntoBtnHtml}
                    <button type="button" class="btn-open-lesson">
                        <span>${isCompleted ? 'Revisar Caso' : 'Investigar'}</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        if (AppState.isTeacher) {
            const btnJogarJunto = item.querySelector('.btn-jogar-junto-card');
            btnJogarJunto?.addEventListener('click', async (e) => {
                e.stopPropagation();
                soundManager.playClick();
                await startTeacherLiveSession(subjectKey, aula.id);
            });
        }

        item.addEventListener('click', () => {
            soundManager.playClick();
            openLessonDetail(subjectKey, aula.id);
        });

        container.appendChild(item);
    });
    }

    showView('view-subject-lessons');
}

function setupLessonsViewListeners() {
    // Voltar da tela de aulas para o Hub de Disciplinas
    document.getElementById('btn-back-to-hub')?.addEventListener('click', () => {
        soundManager.playClick();
        renderStudentHub();
        showView('view-student-hub');
    });

    // Voltar do detalhe da aula para a lista de aulas
    document.getElementById('btn-back-to-lessons')?.addEventListener('click', () => {
        soundManager.playClick();
        openSubjectLessons(AppState.currentSubjectKey);
    });

    // Finalizar Aula
    document.getElementById('btn-complete-lesson')?.addEventListener('click', async () => {
        soundManager.playClick();
        await finalizeCurrentLesson();
    });
}

// ============================================================================
// 6. TELA DA AULA & ATIVIDADES / ENIGMAS
// ============================================================================
function openLessonDetail(subjectKey, lessonId) {
    AppState.currentSubjectKey = subjectKey;
    AppState.currentLessonId = lessonId;
    AppState.currentActivityIndex = 0;
    AppState.currentLessonScores = {};

    const subject = getDisciplina(subjectKey);
    const lesson = getAula(subjectKey, lessonId);
    if (!subject || !lesson) return;

    AppState.currentLessonData = lesson;

    // Header da Aula
    document.getElementById('lesson-detail-subject-pill').textContent = subject.nome.toUpperCase();
    document.getElementById('lesson-detail-case-num').textContent = `CASO #${lesson.numero < 10 ? '0' + lesson.numero : lesson.numero}`;
    document.getElementById('lesson-detail-title').textContent = `Aula ${lesson.numero}: ${lesson.titulo}`;
    document.getElementById('lesson-detail-desc').textContent = lesson.descricao;

    // Botão JOGAR JUNTO no cabeçalho da aula (Apenas visível para Professor)
    const btnJogarJuntoLesson = document.getElementById('btn-jogar-junto-lesson-header');
    if (btnJogarJuntoLesson) {
        btnJogarJuntoLesson.style.display = AppState.isTeacher ? 'inline-flex' : 'none';
    }

    const studentSubjProgress = AppState.activeStudent?.progress?.[subjectKey] || {};
    const isCompleted = studentSubjProgress.completedLessons?.[lessonId]?.completed;
    const statusPill = document.getElementById('lesson-detail-status-pill');

    if (isCompleted) {
        statusPill.className = 'lesson-status-pill status-completed';
        statusPill.innerHTML = '<i class="fa-solid fa-circle-check"></i> Caso Já Solucionado';
    } else {
        statusPill.className = 'lesson-status-pill status-in-progress';
        statusPill.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Investigação em Aberto';
    }

    renderLessonWizard();
    showView('view-lesson-detail');
}

// Renderiza o Wizard de Atividades (Apresenta 1 enigma por vez)
function renderLessonWizard() {
    const lesson = AppState.currentLessonData;
    if (!lesson || !lesson.atividades || lesson.atividades.length === 0) return;

    const total = lesson.atividades.length;
    const currentIdx = AppState.currentActivityIndex;
    const currentAtv = lesson.atividades[currentIdx];

    // 1. Atualiza Indicador de Texto e Porcentagem
    const percent = Math.round(((currentIdx + 1) / total) * 100);
    document.getElementById('lesson-wizard-step-label').textContent = `Enigma ${currentIdx + 1} de ${total}`;
    document.getElementById('lesson-wizard-percent-label').textContent = `${percent}% Concluído`;
    document.getElementById('lesson-wizard-progress-bar').style.width = `${percent}%`;

    // 2. Renderiza os Botões / Indicadores de Passos
    const dotsContainer = document.getElementById('lesson-wizard-step-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        lesson.atividades.forEach((atv, idx) => {
            const isSolved = (AppState.currentLessonScores[atv.id] === 50);
            const isActive = (idx === currentIdx);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `wizard-dot-btn ${isActive ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
            
            let iconHtml = '<i class="fa-solid fa-puzzle-piece"></i>';
            if (isSolved) {
                iconHtml = '<i class="fa-solid fa-circle-check"></i>';
            } else if (isActive) {
                iconHtml = '<i class="fa-solid fa-magnifying-glass"></i>';
            }

            btn.innerHTML = `${iconHtml} <span>Enigma #${idx + 1}</span>`;
            btn.title = `Ir para o Enigma #${idx + 1}: ${atv.titulo}`;
            btn.addEventListener('click', async () => {
                soundManager.playClick();
                if (idx > currentIdx) {
                    const isCurrentSolved = (AppState.currentLessonScores[currentAtv.id] === 50);
                    if (!isCurrentSolved) {
                        const confirmAdvance = await showCustomConfirm({
                            title: 'Enigma Ainda Não Decifrado!',
                            message: `Você ainda não solucionou o <strong>Enigma #${currentIdx + 1} (${currentAtv.titulo})</strong>.<br><br>Deseja pular para o Enigma #${idx + 1} mesmo sem responder agora? (Você poderá voltar para tentar depois)`,
                            confirmText: 'Pular Enigma',
                            cancelText: 'Continuar no Enigma'
                        });
                        if (!confirmAdvance) return;
                    }
                }
                goToActivityIndex(idx);
            });

            dotsContainer.appendChild(btn);
        });
    }

    // 3. Renderiza o Card do Enigma Atual (Apenas 1 por vez!)
    const container = document.getElementById('activities-stream-container');
    if (container) {
        container.innerHTML = '';
        const atvCard = renderActivityCard(currentAtv, currentIdx + 1);
        container.appendChild(atvCard);
    }

    // 4. Atualiza Botões de Navegação (Anterior / Próximo / Finalizar)
    const btnPrev = document.getElementById('btn-prev-activity');
    const btnNext = document.getElementById('btn-next-activity');

    if (btnPrev) {
        btnPrev.disabled = (currentIdx === 0);
        btnPrev.onclick = () => {
            soundManager.playClick();
            goToActivityIndex(currentIdx - 1);
        };
    }

    if (btnNext) {
        if (currentIdx < total - 1) {
            btnNext.className = 'btn-wizard-nav btn-wizard-next';
            btnNext.innerHTML = `<span>Próximo Enigma</span> <i class="fa-solid fa-chevron-right"></i>`;
            btnNext.onclick = async () => {
                soundManager.playClick();
                const isCurrentSolved = (AppState.currentLessonScores[currentAtv.id] === 50);
                if (!isCurrentSolved) {
                    const confirmAdvance = await showCustomConfirm({
                        title: 'Enigma Não Solucionado!',
                        message: `Você ainda não decifrou o <strong>Enigma #${currentIdx + 1}: ${currentAtv.titulo}</strong>.<br><br>Deseja avançar para o próximo enigma mesmo sem responder agora? (Você poderá voltar para tentar depois)`,
                        confirmText: 'Avançar Mesmo Assim',
                        cancelText: 'Continuar Tentando'
                    });
                    if (!confirmAdvance) return;
                }
                goToActivityIndex(currentIdx + 1);
            };
        } else {
            btnNext.className = 'btn-wizard-nav btn-wizard-finish';
            btnNext.innerHTML = `<i class="fa-solid fa-stamp"></i> <span>Concluir Investigação</span>`;
            btnNext.onclick = async () => {
                soundManager.playClick();
                const isCurrentSolved = (AppState.currentLessonScores[currentAtv.id] === 50);
                if (!isCurrentSolved) {
                    const confirmFinish = await showCustomConfirm({
                        title: 'Último Enigma Não Solucionado!',
                        message: `Você ainda não decifrou o <strong>Enigma #${currentIdx + 1}: ${currentAtv.titulo}</strong>.<br><br>Deseja realmente concluir e encerrar a investigação da aula agora?`,
                        confirmText: 'Concluir Caso',
                        cancelText: 'Continuar Tentando'
                    });
                    if (!confirmFinish) return;
                }
                await finalizeCurrentLesson();
            };
        }
    }

    updateAccumulatedScoreUI();
}

function goToActivityIndex(newIndex) {
    const total = AppState.currentLessonData?.atividades?.length || 0;
    if (newIndex >= 0 && newIndex < total) {
        AppState.currentActivityIndex = newIndex;
        renderLessonWizard();
        
        // Rolagem suave para o topo do enigma
        const container = document.getElementById('activities-stream-container') || document.querySelector('.lesson-banner-hero');
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function renderActivityCard(atv, num) {
    const card = document.createElement('div');
    const isAlreadySolved = (AppState.currentLessonScores[atv.id] === 50);
    card.className = `activity-challenge-card ${isAlreadySolved ? 'solved' : ''}`;
    card.id = `card-activity-${atv.id}`;

    let inputSectionHtml = '';

    // TIPO 1: MÚLTIPLA ESCOLHA
    if (atv.tipo === 'multipla_escolha' && atv.alternativas) {
        let optionsHtml = '';
        atv.alternativas.forEach(alt => {
            const isCorrectOption = (alt.id.toLowerCase() === atv.respostaCorreta.toLowerCase());
            let optClass = 'option-btn';
            if (isAlreadySolved && isCorrectOption) {
                optClass = 'option-btn selected-correct';
            }
            optionsHtml += `
                <button type="button" class="${optClass}" data-activity-id="${atv.id}" data-option-id="${alt.id}" ${isAlreadySolved ? 'disabled' : ''}>
                    <span class="option-letter-badge">${alt.id.toUpperCase()}</span>
                    <span>${alt.texto}</span>
                </button>
            `;
        });
        inputSectionHtml = `<div class="activity-options-grid">${optionsHtml}</div>`;
    }

    // TIPO 2: DECIFRADOR DE CÓDIGO (INPUT TEXTUAL)
    if (atv.tipo === 'decifrador') {
        inputSectionHtml = `
            <div class="cipher-input-row">
                <input type="text" class="cipher-text-input" id="input-cipher-${atv.id}" placeholder="Digite a resposta do enigma..." value="${isAlreadySolved ? atv.respostaCorreta : ''}" ${isAlreadySolved ? 'disabled' : ''}>
                <button type="button" class="btn-decode-action" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                    <i class="fa-solid fa-key"></i> ${isAlreadySolved ? 'Decifrado' : 'Decifrar'}
                </button>
            </div>
        `;
    }

    // TIPO 3: QUADRO NUMÉRICO DE 1 A 100 (SENSO NUMÉRICO & CONTAGEM)
    if (atv.tipo === 'quadro_numerico') {
        const total = atv.total || 100;
        const hiddenSet = new Set(atv.numerosOcultos || []);
        let gridCellsHtml = '';

        for (let i = 1; i <= total; i++) {
            if (hiddenSet.has(i)) {
                gridCellsHtml += `
                    <div class="num-cell input-cell">
                        <input type="number" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="num-cell-input" 
                               data-expected="${i}" 
                               id="cell-input-${atv.id}-${i}"
                               value="${isAlreadySolved ? i : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''} 
                               maxlength="3" 
                               placeholder="?"
                               aria-label="Número ${i}">
                    </div>
                `;
            } else {
                gridCellsHtml += `
                    <div class="num-cell fixed">${i}</div>
                `;
            }
        }

        inputSectionHtml = `
            <div class="hundred-chart-container">
                <div class="hundred-chart-legend">
                    <span><i class="fa-solid fa-pen-to-square" style="color: var(--neon-amber);"></i> Complete os números destacados em âmbar</span>
                    <span><i class="fa-solid fa-mobile-screen-button" style="color: var(--neon-cyan);"></i> Teclado numérico no celular/tablet</span>
                </div>
                <div class="hundred-chart-grid">
                    ${gridCellsHtml}
                </div>
                <div class="hundred-chart-actions">
                    <button type="button" class="btn-decode-action btn-verify-hundred-grid" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Quadro Verificado com Sucesso ✅' : 'Verificar Quadro Numérico'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 4: ANTECESSOR E SUCESSOR (VIZINHOS NUMÉRICOS)
    if (atv.tipo === 'antecessor_sucessor' && atv.itens) {
        let rowsHtml = '';
        atv.itens.forEach((item, idx) => {
            rowsHtml += `
                <div class="neighbor-row-card" id="neighbor-row-${atv.id}-${idx}">
                    <div class="neighbor-col neighbor-left">
                        <label class="neighbor-col-label"><i class="fa-solid fa-arrow-left"></i> Antecessor (-1)</label>
                        <input type="number" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="neighbor-input antecessor-input" 
                               data-row-idx="${idx}" 
                               data-type="antecessor" 
                               data-expected="${item.antecessor}" 
                               placeholder="?" 
                               value="${isAlreadySolved ? item.antecessor : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               aria-label="Antecessor de ${item.numero}">
                    </div>

                    <div class="neighbor-col neighbor-center">
                        <span class="neighbor-badge-tag">Pista Central</span>
                        <div class="neighbor-number-display">${item.numero}</div>
                    </div>

                    <div class="neighbor-col neighbor-right">
                        <label class="neighbor-col-label">Sucessor (+1) <i class="fa-solid fa-arrow-right"></i></label>
                        <input type="number" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="neighbor-input sucessor-input" 
                               data-row-idx="${idx}" 
                               data-type="sucessor" 
                               data-expected="${item.sucessor}" 
                               placeholder="?" 
                               value="${isAlreadySolved ? item.sucessor : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               aria-label="Sucessor de ${item.numero}">
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="neighbors-container">
                <div class="neighbors-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.35rem;">
                    <button type="button" class="btn-decode-action btn-verify-neighbors" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-arrows-left-right"></i> ${isAlreadySolved ? 'Vizinhos Verificados com Sucesso ✅' : 'Verificar Antecessores e Sucessores'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 5: PARES E ÍMPARES (RADAR DE 1 A 100)
    if (atv.tipo === 'pares_impares_100') {
        const total = atv.total || 100;
        let cellsHtml = '';

        for (let i = 1; i <= total; i++) {
            const isEven = (i % 2 === 0);
            let state = 'none';
            let extraClass = '';
            if (isAlreadySolved) {
                state = isEven ? 'par' : 'impar';
                extraClass = isEven ? 'is-par parity-correct' : 'is-impar parity-correct';
            }

            cellsHtml += `
                <button type="button" 
                        class="parity-cell ${extraClass}" 
                        data-num="${i}" 
                        data-state="${state}"
                        ${isAlreadySolved ? 'disabled' : ''}
                        aria-label="Número ${i}">
                    ${i}
                </button>
            `;
        }

        inputSectionHtml = `
            <div class="parity-activity-container" id="parity-container-${atv.id}">
                <div class="parity-toolbar">
                    <div class="parity-tool-buttons">
                        <button type="button" class="btn-parity-tool btn-parity-par active" data-tool="par" ${isAlreadySolved ? 'disabled' : ''}>
                            <span style="font-size: 1.35rem;">🟦</span>
                            <div class="parity-tool-text">
                                <strong>PARES</strong>
                                <small>Clique nos números pares</small>
                            </div>
                        </button>
                        <button type="button" class="btn-parity-tool btn-parity-impar" data-tool="impar" ${isAlreadySolved ? 'disabled' : ''}>
                            <span style="font-size: 1.35rem;">🟪</span>
                            <div class="parity-tool-text">
                                <strong>ÍMPARES</strong>
                                <small>Clique nos números ímpares</small>
                            </div>
                        </button>
                    </div>

                    <div class="parity-counter-badges">
                        <div class="parity-badge-stat stat-par">
                            <span>🟦 Pares Marcados:</span>
                            <strong id="counter-par-${atv.id}">${isAlreadySolved ? '50 / 50' : '0 / 50'}</strong>
                        </div>
                        <div class="parity-badge-stat stat-impar">
                            <span>🟪 Ímpares Marcados:</span>
                            <strong id="counter-impar-${atv.id}">${isAlreadySolved ? '50 / 50' : '0 / 50'}</strong>
                        </div>
                    </div>
                </div>

                <div class="parity-grid-100" id="parity-grid-${atv.id}">
                    ${cellsHtml}
                </div>

                <div class="hundred-chart-actions">
                    <button type="button" class="btn-decode-action btn-verify-parity" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${isAlreadySolved ? 'Classificação Verificada com Sucesso ✅' : 'Verificar Classificação (Pares e Ímpares)'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 6: CLASSIFICAR PAR OU ÍMPAR EM LISTA
    if (atv.tipo === 'classificar_par_impar_lista' && atv.itens) {
        let rowsHtml = '';
        atv.itens.forEach((item, idx) => {
            const isExpectedPar = (item.paridade === 'par' || item.numero % 2 === 0);
            let selectedChoice = isAlreadySolved ? (isExpectedPar ? 'par' : 'impar') : '';

            rowsHtml += `
                <div class="parity-list-row ${isAlreadySolved ? 'choice-correct' : ''}" id="parity-list-row-${atv.id}-${idx}">
                    <div class="parity-item-number">
                        <i class="fa-solid fa-hashtag"></i>
                        <span>${item.numero}</span>
                    </div>

                    <div class="parity-row-actions">
                        <button type="button" 
                                class="btn-parity-choice btn-choice-par ${selectedChoice === 'par' ? 'selected' : ''}" 
                                data-row-idx="${idx}" 
                                data-choice="par" 
                                ${isAlreadySolved ? 'disabled' : ''}>
                            🟦 PAR
                        </button>
                        <button type="button" 
                                class="btn-parity-choice btn-choice-impar ${selectedChoice === 'impar' ? 'selected' : ''}" 
                                data-row-idx="${idx}" 
                                data-choice="impar" 
                                ${isAlreadySolved ? 'disabled' : ''}>
                            🟪 ÍMPAR
                        </button>
                        <input type="hidden" class="input-row-choice" id="choice-row-${atv.id}-${idx}" value="${selectedChoice}">
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="parity-list-container">
                <div class="parity-list-items">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions">
                    <button type="button" class="btn-decode-action btn-verify-parity-list" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-list-check"></i> ${isAlreadySolved ? 'Paridades Verificadas com Sucesso ✅' : 'Verificar Paridades da Lista'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 7: RETAS NUMÉRICAS (TRILHAS DE CONTAGEM)
    if (atv.tipo === 'retas_numericas' && atv.retas) {
        let linesHtml = '';
        atv.retas.forEach((reta, rIdx) => {
            let nodesHtml = '';
            reta.sequencia.forEach((val, nIdx) => {
                if (val === null) {
                    nodesHtml += `
                        <div class="number-line-node">
                            <input type="number" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="number-line-input ${isAlreadySolved ? 'correct' : ''}" 
                                   data-line-idx="${rIdx}" 
                                   data-expected="${reta.respostaEsperada}" 
                                   placeholder="?" 
                                   value="${isAlreadySolved ? reta.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   aria-label="Número faltante na ${reta.titulo}">
                            <div class="number-line-node-point"></div>
                        </div>
                    `;
                } else {
                    nodesHtml += `
                        <div class="number-line-node">
                            <div class="number-line-val-badge">${val}</div>
                            <div class="number-line-node-point"></div>
                        </div>
                    `;
                }
            });

            linesHtml += `
                <div class="number-line-card" id="number-line-card-${atv.id}-${rIdx}">
                    <div class="number-line-header">
                        <div class="number-line-title">
                            <i class="fa-solid fa-route"></i>
                            <span>${reta.titulo}</span>
                        </div>
                        <span class="number-line-step-badge">Pulo: ${reta.passo}</span>
                    </div>

                    <div class="number-line-track-wrapper">
                        <div class="number-line-track">
                            ${nodesHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="number-lines-container">
                ${linesHtml}
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-number-lines" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-square-check"></i> ${isAlreadySolved ? 'Retas Numéricas Verificadas com Sucesso ✅' : 'Verificar Todas as Retas Numéricas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 8: COMPARAÇÃO MAIOR (>), MENOR (<) OU IGUAL (=)
    if (atv.tipo === 'comparacao_maior_menor' && atv.itens) {
        let rowsHtml = '';
        atv.itens.forEach((item, idx) => {
            const selectedSym = isAlreadySolved ? item.correto : '';
            rowsHtml += `
                <div class="compare-row ${isAlreadySolved ? 'choice-correct' : ''}" id="compare-row-${atv.id}-${idx}">
                    <div class="compare-side-val">${item.label1}</div>

                    <div class="compare-symbols-group">
                        <button type="button" 
                                class="btn-compare-sym ${selectedSym === '>' ? 'selected' : ''}" 
                                data-sym=">" 
                                data-row-idx="${idx}" 
                                ${isAlreadySolved ? 'disabled' : ''} 
                                aria-label="Maior que">
                            &gt;
                        </button>
                        <button type="button" 
                                class="btn-compare-sym ${selectedSym === '=' ? 'selected' : ''}" 
                                data-sym="=" 
                                data-row-idx="${idx}" 
                                ${isAlreadySolved ? 'disabled' : ''} 
                                aria-label="Igual a">
                            =
                        </button>
                        <button type="button" 
                                class="btn-compare-sym ${selectedSym === '<' ? 'selected' : ''}" 
                                data-sym="<" 
                                data-row-idx="${idx}" 
                                ${isAlreadySolved ? 'disabled' : ''} 
                                aria-label="Menor que">
                            &lt;
                        </button>
                        <input type="hidden" class="input-compare-choice" id="choice-compare-${atv.id}-${idx}" value="${selectedSym}">
                    </div>

                    <div class="compare-side-val">${item.label2}</div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="compare-container">
                <div class="compare-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions">
                    <button type="button" class="btn-decode-action btn-verify-compare" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-scale-balanced"></i> ${isAlreadySolved ? 'Comparações Verificadas com Sucesso ✅' : 'Verificar Todas as Comparações'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 9: ORDEM CRESCENTE E DECRESCENTE
    if (atv.tipo === 'ordem_crescente_decrescente' && atv.grupos) {
        let cardsHtml = '';
        atv.grupos.forEach((grupo, gIdx) => {
            let pillsHtml = grupo.numerosDesordenados.map(n => `<span class="order-source-pill">${n}</span>`).join('');
            let slotsHtml = '';

            grupo.ordemCorreta.forEach((numCorreto, sIdx) => {
                slotsHtml += `
                    <div class="order-slot-item">
                        <input type="number" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="order-input ${isAlreadySolved ? 'correct' : ''}" 
                               data-group-idx="${gIdx}" 
                               data-slot-idx="${sIdx}" 
                               data-expected="${numCorreto}" 
                               placeholder="?" 
                               value="${isAlreadySolved ? numCorreto : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               aria-label="Posição ${sIdx + 1}">
                        ${sIdx < grupo.ordemCorreta.length - 1 ? '<span class="order-slot-arrow">➔</span>' : ''}
                    </div>
                `;
            });

            cardsHtml += `
                <div class="order-card" id="order-card-${atv.id}-${gIdx}">
                    <div class="order-header">
                        <div class="order-title">
                            <i class="fa-solid fa-arrow-down-short-wide"></i>
                            <span>${grupo.tituloOrdem}</span>
                        </div>
                    </div>

                    <div class="order-source-box">
                        <span class="order-source-tag"><i class="fa-solid fa-shuffle"></i> Números Desordenados:</span>
                        ${pillsHtml}
                    </div>

                    <div class="order-target-slots">
                        ${slotsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="order-container">
                ${cardsHtml}
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-order" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-arrow-down-1-9"></i> ${isAlreadySolved ? 'Sequências Ordenadas com Sucesso ✅' : 'Verificar Ordenações'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 10: DEZENAS E UNIDADES (AGRUPAMENTO)
    if (atv.tipo === 'dezenas_unidades_agrupamento' && atv.lotes) {
        let cardsHtml = '';
        atv.lotes.forEach((lote, lIdx) => {
            cardsHtml += `
                <div class="place-value-card" id="place-value-card-${atv.id}-${lIdx}">
                    <div class="place-value-title">
                        <i class="fa-solid fa-boxes-stacked"></i>
                        <span>${lote.titulo}</span>
                    </div>

                    <div class="place-value-fields">
                        <div class="place-field-group">
                            <label class="place-field-label">Dezenas (D)</label>
                            <input type="number" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="place-field-input input-dezenas ${isAlreadySolved ? 'correct' : ''}" 
                                   data-expected="${lote.dezenasEsperadas}" 
                                   placeholder="D" 
                                   value="${isAlreadySolved ? lote.dezenasEsperadas : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   aria-label="Quantidade de Dezenas">
                        </div>

                        <div class="place-field-group">
                            <label class="place-field-label">Unidades (U)</label>
                            <input type="number" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="place-field-input input-unidades ${isAlreadySolved ? 'correct' : ''}" 
                                   data-expected="${lote.unidadesEsperadas}" 
                                   placeholder="U" 
                                   value="${isAlreadySolved ? lote.unidadesEsperadas : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   aria-label="Quantidade de Unidades">
                        </div>

                        <div class="place-field-group">
                            <label class="place-field-label">Total (=)</label>
                            <input type="number" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="place-field-input input-total ${isAlreadySolved ? 'correct' : ''}" 
                                   data-expected="${lote.totalEsperado}" 
                                   placeholder="Total" 
                                   value="${isAlreadySolved ? lote.totalEsperado : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   aria-label="Valor Total">
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="place-value-container">
                ${cardsHtml}
            </div>
            <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                <button type="button" class="btn-decode-action btn-verify-place-value" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                    <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Dezenas e Unidades Verificadas ✅' : 'Verificar Dezenas e Unidades'}
                </button>
            </div>
        `;
    }

    // TIPO 11: CONTAGEM REGRESSIVA
    if (atv.tipo === 'contagem_regressiva_sequencia' && atv.sequencias) {
        let cardsHtml = '';
        atv.sequencias.forEach((seq, sIdx) => {
            let nodesHtml = '';
            seq.valores.forEach((val, vIdx) => {
                if (val === null) {
                    const expectedVal = seq.respostasEsperadas[String(vIdx)];
                    nodesHtml += `
                        <div class="number-line-node">
                            <input type="number" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="regressive-input ${isAlreadySolved ? 'correct' : ''}" 
                                   data-seq-idx="${sIdx}" 
                                   data-node-idx="${vIdx}" 
                                   data-expected="${expectedVal}" 
                                   placeholder="?" 
                                   value="${isAlreadySolved ? expectedVal : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   aria-label="Número regressivo">
                            <div class="regressive-node-point"></div>
                        </div>
                    `;
                } else {
                    nodesHtml += `
                        <div class="number-line-node">
                            <div class="regressive-val-badge">${val}</div>
                            <div class="regressive-node-point"></div>
                        </div>
                    `;
                }
            });

            cardsHtml += `
                <div class="regressive-card" id="regressive-card-${atv.id}-${sIdx}">
                    <div class="regressive-header">
                        <div class="regressive-title">
                            <i class="fa-solid fa-backward-step"></i>
                            <span>${seq.titulo}</span>
                        </div>
                        <span class="regressive-step-badge">Pulo: ${seq.passo}</span>
                    </div>

                    <div class="regressive-track-wrapper">
                        <div class="regressive-track">
                            ${nodesHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="regressive-container">
                ${cardsHtml}
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-regressive" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-hourglass-half"></i> ${isAlreadySolved ? 'Contagens Regressivas Verificadas ✅' : 'Verificar Contagens Regressivas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 12: QUIZ / DESAFIO DO COFRE FORENSE
    if (atv.tipo === 'quiz_numerico_forense' && atv.perguntas) {
        let questionsHtml = '';
        atv.perguntas.forEach((q, qIdx) => {
            questionsHtml += `
                <div class="quiz-question-card" id="quiz-question-${atv.id}-${qIdx}">
                    <div class="quiz-question-prompt">
                        ${q.enunciado}
                    </div>
                    <input type="number" 
                           inputmode="numeric" 
                           pattern="[0-9]*" 
                           class="quiz-input-field ${isAlreadySolved ? 'correct' : ''}" 
                           data-question-idx="${qIdx}" 
                           data-expected="${q.respostaEsperada}" 
                           placeholder="${q.placeholder || 'Resposta'}" 
                           value="${isAlreadySolved ? q.respostaEsperada : ''}" 
                           ${isAlreadySolved ? 'disabled' : ''}
                           aria-label="Resposta para ${q.enunciado}">
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="forensic-quiz-container">
                ${questionsHtml}
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-forensic-quiz" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-vault"></i> ${isAlreadySolved ? 'Cofre Forense Desbloqueado com Sucesso ✅' : 'Verificar Respostas e Abrir Cofre'}
                    </button>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="activity-card-header">
            <span class="activity-badge">ENIGMA #${num}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-lightbulb"></i> Vale 50 XP</span>
        </div>

        <h4 class="activity-prompt-title">${atv.titulo}</h4>
        <div class="activity-prompt-text">${atv.instrucoes}</div>

        ${inputSectionHtml}

        ${atv.dica ? `
            <button type="button" class="hint-toggle-btn" data-hint-target="hint-${atv.id}">
                <i class="fa-regular fa-lightbulb"></i> Ver Dica do Perito
            </button>
            <div class="hint-box" id="hint-${atv.id}">
                <strong>🔍 Dica Forense:</strong> ${atv.dica}
            </div>
        ` : ''}

        <div class="activity-feedback-box ${isAlreadySolved ? 'correct' : ''}" id="feedback-${atv.id}" ${isAlreadySolved ? 'style="display: flex;"' : ''}>
            ${isAlreadySolved ? `
                <i class="fa-solid fa-circle-check" style="font-size: 1.2rem;"></i>
                <div>
                    <strong>Correto! Enigma Desvendado!</strong><br>
                    ${atv.explicacao || 'Pista confirmada com sucesso pela perícia!'}
                </div>
            ` : ''}
        </div>
    `;

    // Eventos de Múltipla Escolha
    if (atv.tipo === 'multipla_escolha') {
        card.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const optId = btn.dataset.optionId;
                handleAnswerSubmit(atv, optId, card);
            });
        });
    }

    // Eventos de Decifrador
    if (atv.tipo === 'decifrador') {
        const btnDecode = card.querySelector('.btn-decode-action');
        const inputField = card.querySelector(`#input-cipher-${atv.id}`);

        btnDecode?.addEventListener('click', () => {
            const answer = inputField.value.trim();
            handleAnswerSubmit(atv, answer, card);
        });

        inputField?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                btnDecode.click();
            }
        });
    }

    // Eventos de Quadro Numérico (1 a 100)
    if (atv.tipo === 'quadro_numerico') {
        const btnVerify = card.querySelector('.btn-verify-hundred-grid');
        const cellInputs = card.querySelectorAll('.num-cell-input');

        btnVerify?.addEventListener('click', () => {
            handleGridAnswerSubmit(atv, card);
        });

        cellInputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < cellInputs.length - 1) {
                        cellInputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Antecessor e Sucessor
    if (atv.tipo === 'antecessor_sucessor') {
        const btnVerify = card.querySelector('.btn-verify-neighbors');
        const inputs = card.querySelectorAll('.neighbor-input');

        btnVerify?.addEventListener('click', () => {
            handleNeighborsAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Pares e Ímpares (1 a 100)
    if (atv.tipo === 'pares_impares_100') {
        const toolBtns = card.querySelectorAll('.btn-parity-tool');
        const gridCells = card.querySelectorAll('.parity-cell');
        const btnVerify = card.querySelector('.btn-verify-parity');
        const counterPar = card.querySelector(`#counter-par-${atv.id}`);
        const counterImpar = card.querySelector(`#counter-impar-${atv.id}`);

        let selectedTool = 'par';

        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                soundManager.playClick();
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedTool = btn.dataset.tool;
            });
        });

        const updateCounters = () => {
            let parCount = 0;
            let imparCount = 0;
            gridCells.forEach(cell => {
                const s = cell.dataset.state;
                if (s === 'par') parCount++;
                if (s === 'impar') imparCount++;
            });
            if (counterPar) counterPar.textContent = `${parCount} / 50`;
            if (counterImpar) counterImpar.textContent = `${imparCount} / 50`;
        };

        gridCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (isAlreadySolved) return;
                soundManager.playClick();

                cell.classList.remove('parity-wrong', 'parity-correct');

                const currentState = cell.dataset.state;
                if (currentState === selectedTool) {
                    cell.dataset.state = 'none';
                    cell.classList.remove('is-par', 'is-impar');
                } else {
                    cell.dataset.state = selectedTool;
                    cell.classList.remove('is-par', 'is-impar');
                    cell.classList.add(selectedTool === 'par' ? 'is-par' : 'is-impar');
                }

                updateCounters();
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleParityAnswerSubmit(atv, card);
        });
    }

    // Eventos de Classificação Par/Ímpar em Lista
    if (atv.tipo === 'classificar_par_impar_lista') {
        const rows = card.querySelectorAll('.parity-list-row');
        const btnVerify = card.querySelector('.btn-verify-parity-list');

        rows.forEach(row => {
            const buttons = row.querySelectorAll('.btn-parity-choice');
            const hiddenInput = row.querySelector('.input-row-choice');

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (isAlreadySolved) return;
                    soundManager.playClick();
                    row.classList.remove('choice-wrong', 'choice-correct');

                    const choice = btn.dataset.choice;
                    if (hiddenInput.value === choice) {
                        hiddenInput.value = '';
                        btn.classList.remove('selected');
                    } else {
                        buttons.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        hiddenInput.value = choice;
                    }
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleParityListAnswerSubmit(atv, card);
        });
    }

    // Eventos de Retas Numéricas (Trilhas de Contagem)
    if (atv.tipo === 'retas_numericas') {
        const btnVerify = card.querySelector('.btn-verify-number-lines');
        const inputs = card.querySelectorAll('.number-line-input');

        btnVerify?.addEventListener('click', () => {
            handleNumberLinesAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Comparação (> , < , =)
    if (atv.tipo === 'comparacao_maior_menor') {
        const rows = card.querySelectorAll('.compare-row');
        const btnVerify = card.querySelector('.btn-verify-compare');

        rows.forEach(row => {
            const symBtns = row.querySelectorAll('.btn-compare-sym');
            const hiddenInput = row.querySelector('.input-compare-choice');

            symBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (isAlreadySolved) return;
                    soundManager.playClick();
                    row.classList.remove('choice-wrong', 'choice-correct');

                    const sym = btn.dataset.sym;
                    if (hiddenInput.value === sym) {
                        hiddenInput.value = '';
                        btn.classList.remove('selected');
                    } else {
                        symBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        hiddenInput.value = sym;
                    }
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleCompareAnswerSubmit(atv, card);
        });
    }

    // Eventos de Ordem Crescente e Decrescente
    if (atv.tipo === 'ordem_crescente_decrescente') {
        const btnVerify = card.querySelector('.btn-verify-order');
        const inputs = card.querySelectorAll('.order-input');

        btnVerify?.addEventListener('click', () => {
            handleOrderAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Dezenas e Unidades
    if (atv.tipo === 'dezenas_unidades_agrupamento') {
        const btnVerify = card.querySelector('.btn-verify-place-value');
        const inputs = card.querySelectorAll('.place-field-input');

        btnVerify?.addEventListener('click', () => {
            handlePlaceValueAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Contagem Regressiva
    if (atv.tipo === 'contagem_regressiva_sequencia') {
        const btnVerify = card.querySelector('.btn-verify-regressive');
        const inputs = card.querySelectorAll('.regressive-input');

        btnVerify?.addEventListener('click', () => {
            handleRegressiveAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Quiz / Desafio do Cofre
    if (atv.tipo === 'quiz_numerico_forense') {
        const btnVerify = card.querySelector('.btn-verify-forensic-quiz');
        const inputs = card.querySelectorAll('.quiz-input-field');

        btnVerify?.addEventListener('click', () => {
            handleForensicQuizAnswerSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Toggle de Dica
    const hintBtn = card.querySelector('.hint-toggle-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            soundManager.playClick();
            const hintBox = card.querySelector(`#hint-${atv.id}`);
            hintBox.classList.toggle('open');
        });
    }

    return card;
}

// Validação e Feedback de Pares e Ímpares
function handleParityAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const gridCells = cardElement.querySelectorAll('.parity-cell');
    let allCorrect = true;
    let wrongCount = 0;
    let unmarkedCount = 0;

    gridCells.forEach(cell => {
        const num = parseInt(cell.dataset.num, 10);
        const state = cell.dataset.state;
        const shouldBeEven = (num % 2 === 0);

        cell.classList.remove('parity-wrong', 'parity-correct');

        if (state === 'none') {
            allCorrect = false;
            unmarkedCount++;
            cell.classList.add('parity-wrong');
        } else if (shouldBeEven && state === 'par') {
            cell.classList.add('parity-correct');
        } else if (!shouldBeEven && state === 'impar') {
            cell.classList.add('parity-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            cell.classList.add('parity-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        gridCells.forEach(cell => {
            cell.disabled = true;
        });

        cardElement.querySelectorAll('.btn-parity-tool').forEach(btn => {
            btn.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-parity');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Classificação Verificada com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Perfeito, Agente! Todos os 50 números pares e 50 ímpares foram identificados!</strong><br>
                ${atv.explicacao || 'Painel numérico classificado com 100% de precisão forense!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os números destacados em vermelho no quadro.';
        if (unmarkedCount > 0 && wrongCount === 0) {
            msg = `Ainda faltam ${unmarkedCount} número(s) para serem classificados como Par ou Ímpar.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) com classificação incorreta destacado(s) em vermelho. Lembre-se: Pares terminam em 0, 2, 4, 6, 8 e Ímpares em 1, 3, 5, 7, 9!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Radar!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Classificação Par/Ímpar em Lista
function handleParityListAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    let allCorrect = true;
    let wrongCount = 0;
    let unselectedCount = 0;

    atv.itens.forEach((item, idx) => {
        const row = cardElement.querySelector(`#parity-list-row-${atv.id}-${idx}`);
        const hiddenInput = row?.querySelector('.input-row-choice');
        const chosen = hiddenInput ? hiddenInput.value : '';
        const expected = item.paridade || (item.numero % 2 === 0 ? 'par' : 'impar');

        row?.classList.remove('choice-wrong', 'choice-correct');

        if (!chosen) {
            allCorrect = false;
            unselectedCount++;
            row?.classList.add('choice-wrong');
        } else if (chosen === expected) {
            row?.classList.add('choice-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            row?.classList.add('choice-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.btn-parity-choice').forEach(b => {
            b.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-parity-list');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Paridades Verificadas com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente, Detetive! Todos os códigos foram classificados corretamente!</strong><br>
                ${atv.explicacao || 'Paridades identificadas com 100% de sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as linhas destacadas em vermelho na lista.';
        if (unselectedCount > 0 && wrongCount === 0) {
            msg = `Selecione PAR ou ÍMPAR para os ${unselectedCount} número(s) ainda não preenchidos.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) com paridade incorreta. Observe o último algarismo: 0, 2, 4, 6, 8 (PAR) ou 1, 3, 5, 7, 9 (ÍMPAR).`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Códigos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Retas Numéricas (Trilhas de Contagem)
function handleNumberLinesAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.number-line-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-number-lines');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Retas Numéricas Verificadas com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Incrível, Agente! Todas as 7 retas numéricas foram completadas com exatidão!</strong><br>
                ${atv.explicacao || 'Padrões de contagem identificados com 100% de precisão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nas retas numéricas.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha o número que falta nas ${emptyCount} reta(s) ainda vazia(s).`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) incorreto(s). Observe a sequência e o pulo de contagem de cada trilha!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Trilhas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback do Quadro Numérico
function handleGridAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cellInputs = cardElement.querySelectorAll('.num-cell-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    cellInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);
        
        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
        } else if (val === expected) {
            input.classList.add('cell-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cellInputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-hundred-grid');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Quadro Verificado com Sucesso!';
        }

        // Atualiza visual do indicador de passo (dot) no cabeçalho
        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Sensacional, Detetive! Todos os 100 números estão corretos!</strong><br>
                ${atv.explicacao || 'Quadro numérico restaurado com perfeição!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Ainda há números incorretos ou em branco destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Você ainda precisa preencher ${emptyCount} número(s) em branco no quadro.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) incorreto(s) destacado(s) em vermelho. Observe a contagem e corrija!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Pistas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Antecessores e Sucessores
function handleNeighborsAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.neighbor-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
        } else if (val === expected) {
            input.classList.add('cell-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-neighbors');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Vizinhos Verificados com Sucesso!';
        }

        // Atualiza visual do indicador de passo (dot) no cabeçalho
        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente, Detetive! Todos os antecessores e sucessores estão corretos!</strong><br>
                ${atv.explicacao || 'Códigos vizinhos confirmados com sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho e tente novamente.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) em branco para completar a pista!`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) incorreto(s) destacado(s) em vermelho. Lembre-se: Antecessor = -1 e Sucessor = +1.`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Vizinhos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Comparação (> , < , =)
function handleCompareAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    let allCorrect = true;
    let wrongCount = 0;
    let unselectedCount = 0;

    atv.itens.forEach((item, idx) => {
        const row = cardElement.querySelector(`#compare-row-${atv.id}-${idx}`);
        const hiddenInput = row?.querySelector('.input-compare-choice');
        const chosen = hiddenInput ? hiddenInput.value : '';

        row?.classList.remove('choice-wrong', 'choice-correct');

        if (!chosen) {
            allCorrect = false;
            unselectedCount++;
            row?.classList.add('choice-wrong');
        } else if (chosen === item.correto) {
            row?.classList.add('choice-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            row?.classList.add('choice-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.btn-compare-sym').forEach(b => {
            b.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-compare');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Comparações Verificadas com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente, Detetive! Todas as 8 comparações foram calibradas com perfeição!</strong><br>
                ${atv.explicacao || 'Balança pericial calibrada com sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as linhas destacadas em vermelho.';
        if (unselectedCount > 0 && wrongCount === 0) {
            msg = `Selecione >, < ou = para as ${unselectedCount} comparação(ões) ainda não preenchidas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} comparação(ões) com símbolo incorreto. Lembre-se: a abertura do sinal sempre aponta para o maior valor!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Balança!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Ordem Crescente e Decrescente
function handleOrderAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.order-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-order');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sequências Ordenadas com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Perfeito, Agente! Todas as sequências crescentes e decrescentes estão impecáveis!</strong><br>
                ${atv.explicacao || 'Organização pericial concluída com êxito!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) vazios nas sequências.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) fora da ordem solicitada (Crescente: do menor para o maior; Decrescente: do maior para o menor).`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Ordem!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Dezenas e Unidades
function handlePlaceValueAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.place-field-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-place-value');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Dezenas e Unidades Verificadas!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Fantástico, Detetive! Todos os lotes foram decompostos e somados com 100% de precisão!</strong><br>
                ${atv.explicacao || 'Estrutura decimal pericial comprovada!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nos lotes.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) vazios de dezenas, unidades ou total.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} valor(es) incorreto(s). Lembre-se: 1 dezena = 10 unidades.`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Lotes!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback de Contagem Regressiva
function handleRegressiveAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.regressive-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-regressive');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Contagens Regressivas Desarmadas!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente, Agente! Todas as 4 contagens regressivas foram desativadas com perfeição!</strong><br>
                ${atv.explicacao || 'Mecanismo regressivo decifrado!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nas trilhas regressivas.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} número(s) ainda vazios nas contagens regressivas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) incorreto(s). Observe o padrão decrescente de cada sequência!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Desarme!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback do Quiz do Cofre
function handleForensicQuizAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.quiz-input-field');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected).trim();

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-forensic-quiz');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-vault"></i> Cofre Desbloqueado com Sucesso!';
        }

        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>EXTRAORDINÁRIO, DETETIVE MESTRE! O COFRE FOI DESBLOQUEADO!</strong><br>
                ${atv.explicacao || 'Todos os desafios supremos de senso numérico foram resolvidos com louvor pericial!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as respostas destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Responda às ${emptyCount} pergunta(s) do cofre que ainda estão em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} resposta(s) incorreta(s). Revise a contagem, as dezenas e os pares/ímpares!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Cofre Trancado!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação e Feedback da Resposta
function handleAnswerSubmit(atv, answer, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const normalize = (str) => String(str).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const isCorrect = normalize(answer) === normalize(atv.respostaCorreta);

    if (isCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        // Atualiza visual do indicador de passo (dot) no cabeçalho
        const dotBtns = document.querySelectorAll('.wizard-dot-btn');
        if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
            dotBtns[AppState.currentActivityIndex].classList.add('solved');
            dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
        }

        // Estiliza botões se for múltipla escolha
        cardElement.querySelectorAll('.option-btn').forEach(b => {
            if (b.dataset.optionId === answer) {
                b.className = 'option-btn selected-correct';
            }
            b.disabled = true;
        });

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.2rem;"></i>
            <div>
                <strong>Correto! Enigma Desvendado!</strong><br>
                ${atv.explicacao || 'Pista confirmada com sucesso pela perícia!'}
            </div>
        `;
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        if (atv.tipo === 'multipla_escolha') {
            cardElement.querySelectorAll('.option-btn').forEach(b => {
                if (b.dataset.optionId === answer) {
                    b.className = 'option-btn selected-incorrect';
                }
            });
        }

        feedbackBox.className = 'activity-feedback-box incorrect';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.2rem;"></i>
            <div>
                <strong>Pista Incorreta!</strong> Revise as pistas ou consulte a dica do perito e tente novamente.
            </div>
        `;
    }

    updateAccumulatedScoreUI();
}

function updateAccumulatedScoreUI() {
    const scoreEarned = Object.values(AppState.currentLessonScores).reduce((a, b) => a + b, 0);
    const maxScore = (AppState.currentLessonData?.atividades?.length || 1) * 50;
    document.getElementById('lesson-accumulated-score').textContent = `${scoreEarned} / ${maxScore} XP`;
}

// Finalização da Aula
async function finalizeCurrentLesson() {
    const lesson = AppState.currentLessonData;
    const subjectKey = AppState.currentSubjectKey;
    if (!lesson || !subjectKey) return;

    if (AppState.isTeacher) {
        soundManager.playSuccess();
        confettiCelebration();
        showToast('Modo Professor: Aula revisada com sucesso!', 'success');
        setTimeout(() => {
            openSubjectLessons(subjectKey);
        }, 1000);
        return;
    }

    const student = AppState.activeStudent;
    if (!student) return;

    const totalActivities = lesson.atividades.length;
    const solvedCount = lesson.atividades.filter(atv => AppState.currentLessonScores[atv.id] === 50).length;
    const scoreEarned = Object.values(AppState.currentLessonScores).reduce((a, b) => a + b, 0);
    const maxScore = (lesson.atividades.length || 1) * 50;

    if (solvedCount < totalActivities) {
        const remaining = totalActivities - solvedCount;
        const confirmFinish = await showCustomConfirm({
            title: 'Enigmas Pendentes no Caso!',
            message: `Ainda há <strong>${remaining} enigma(s) não solucionado(s)</strong> nesta aula.<br><br>Deseja realmente finalizar a investigação e registrar sua pontuação de <strong>${scoreEarned} XP</strong> agora?`,
            confirmText: 'Finalizar Caso',
            cancelText: 'Revisar Enigmas'
        });
        if (!confirmFinish) return;
    }

    // Se o aluno não respondeu nada, atribui a pontuação base do caso
    const finalScore = Math.max(scoreEarned, Math.floor(maxScore * 0.7));

    // Salva no banco de dados / Firestore
    const lastActivity = lesson.atividades[lesson.atividades.length - 1];
    const updatedStudent = await dbService.updateProgress(
        student.codinome,
        subjectKey,
        lesson.id,
        lastActivity.id,
        lesson.titulo,
        lastActivity.titulo,
        finalScore,
        maxScore
    );

    if (updatedStudent) {
        AppState.activeStudent = updatedStudent;
    }

    soundManager.playFanfare();
    confettiCelebration();

    showToast(`🎉 Caso Solucionado! Você ganhou +${finalScore} XP!`, 'success', 4000);

    // Retorna para a tela de aulas atualizada
    setTimeout(() => {
        openSubjectLessons(subjectKey);
    }, 1200);
}

// Efeito de Confetes / Comemoração
function confettiCelebration() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2fe', '#38bdf8', '#f59e0b', '#10b981', '#a855f7']
        });
    }
}

// ============================================================================
// 7. PAINEL DO PROFESSOR (MONITORAMENTO DA TURMA)
// ============================================================================
function setupTeacherDashboardListeners() {
    // Abrir Modal de Autenticação do Professor
    document.getElementById('btn-open-teacher-auth')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('modal-teacher-auth')?.classList.add('active');
        document.getElementById('input-teacher-master-password').value = '';
        document.getElementById('input-teacher-master-password').focus();
    });

    // Fechar Modal do Professor
    document.getElementById('btn-close-teacher-modal')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('modal-teacher-auth')?.classList.remove('active');
    });

    // Submissão da Senha do Professor
    const formTeacher = document.getElementById('form-teacher-auth');
    formTeacher?.addEventListener('submit', (e) => {
        e.preventDefault();
        soundManager.playClick();

        const pass = document.getElementById('input-teacher-master-password').value;
        if (pass === AppState.teacherPassword) {
            document.getElementById('modal-teacher-auth')?.classList.remove('active');
            AppState.isTeacher = true;
            AppState.activeStudent = null;
            dbService.clearActiveStudent();
            updateHeaderAuthUI();
            soundManager.playSuccess();
            showToast('Acesso concedido ao Painel do Professor!', 'success');
            openTeacherDashboard();
        } else {
            soundManager.playError();
            showToast('Senha de professor incorreta! Verifique e tente novamente.', 'error');
        }
    });

    // Sair do Painel do Professor
    document.getElementById('btn-teacher-exit')?.addEventListener('click', () => {
        soundManager.playClick();
        AppState.isTeacher = false;
        updateHeaderAuthUI();
        showView('view-welcome');
        showToast('Você saiu da Área do Professor.', 'info');
    });

    // Ir para as Aulas / Hub no Modo Professor
    document.getElementById('btn-teacher-go-hub')?.addEventListener('click', () => {
        soundManager.playClick();
        renderStudentHub();
        showView('view-student-hub');
    });

    // Atualizar Dados no Painel
    document.getElementById('btn-refresh-teacher-data')?.addEventListener('click', () => {
        soundManager.playClick();
        openTeacherDashboard();
        showToast('Dados da turma atualizados!', 'info');
    });

    // Busca na tabela de alunos
    const searchInput = document.getElementById('teacher-search-input');
    searchInput?.addEventListener('input', (e) => {
        filterTeacherTable(e.target.value);
    });

    // Exportar CSV
    document.getElementById('btn-export-students-csv')?.addEventListener('click', () => {
        soundManager.playClick();
        exportStudentsToCSV();
    });
}

// Carregar e Renderizar Painel do Professor
async function openTeacherDashboard() {
    showView('view-teacher-dashboard');

    const students = await dbService.getAllStudents();
    AppState.cachedStudents = students;

    // 1. Atualiza Métricas
    const totalStudents = students.length;
    let totalCompletedLessons = 0;
    let totalXpSum = 0;

    students.forEach(s => {
        const mathDone = Object.values(s.progress?.matematica?.completedLessons || {}).filter(l => l.completed).length;
        const portDone = Object.values(s.progress?.portugues?.completedLessons || {}).filter(l => l.completed).length;
        totalCompletedLessons += (mathDone + portDone);
        totalXpSum += (s.totalXp || 0);
    });

    const avgXp = totalStudents > 0 ? Math.round(totalXpSum / totalStudents) : 0;

    document.getElementById('teacher-metric-total-students').textContent = totalStudents;
    document.getElementById('teacher-metric-total-completed').textContent = totalCompletedLessons;
    document.getElementById('teacher-metric-avg-xp').textContent = `${avgXp} XP`;

    renderTeacherStudentsTable(students);
}

function renderTeacherStudentsTable(students) {
    const tbody = document.getElementById('teacher-students-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                    <i class="fa-solid fa-users-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                    Nenhum aluno cadastrado no momento.
                </td>
            </tr>
        `;
        return;
    }

    students.forEach(s => {
        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === s.avatar) || AVATARES_DISPONIVEIS[0];
        
        // Progresso por Matéria
        const mathLessons = s.progress?.matematica?.completedLessons || {};
        const mathCount = Object.values(mathLessons).filter(l => l.completed).length;
        const mathScore = s.progress?.matematica?.totalScore || 0;

        const portLessons = s.progress?.portugues?.completedLessons || {};
        const portCount = Object.values(portLessons).filter(l => l.completed).length;
        const portScore = s.progress?.portugues?.totalScore || 0;

        // Status atual
        const currentStatus = s.currentActivityStatus || (s.progress?.matematica?.lastLesson ? `Matemática - ${s.progress.matematica.lastLesson.title}` : 'Recém-Cadastrado');

        const realName = s.nomeReal || s.nome || '';
        const displayName = realName ? realName : s.codinome;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="student-table-profile">
                    <span class="student-table-avatar">${avatarObj.icone}</span>
                    <div>
                        <div class="student-table-name" style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
                            ${displayName}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--neon-cyan); margin-top: 0.15rem; font-weight: 600;">
                            <i class="fa-solid fa-mask"></i> Codinome: <strong>${s.codinome}</strong>
                        </div>
                        <div class="student-table-date">Registrado: ${s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}</div>
                    </div>
                </div>
            </td>

            <!-- Senha do Aluno Oculta por Padrão com Alternância -->
            <td>
                <div class="password-cell-container">
                    <span class="pw-text">••••••</span>
                    <button type="button" class="btn-toggle-pw-view" title="Mostrar Senha">
                        <i class="fa-regular fa-eye-slash"></i>
                    </button>
                </div>
            </td>

            <td>
                <span class="progress-mini-tag">${mathCount} / 5 Aulas</span>
                <span style="font-size: 0.8rem; color: var(--neon-cyan);">${mathScore} XP</span>
            </td>

            <td>
                <span class="progress-mini-tag" style="border-color: rgba(245, 158, 11, 0.3); color: var(--neon-amber);">${portCount} / 5 Aulas</span>
                <span style="font-size: 0.8rem; color: var(--neon-amber);">${portScore} XP</span>
            </td>

            <td style="font-size: 0.85rem; color: var(--text-secondary);">
                ${currentStatus}
            </td>

            <td>
                <span class="table-score-badge">${s.totalXp || 0} XP</span>
            </td>

            <td>
                <button type="button" class="btn-table-delete" data-codename="${s.codinome}" title="Excluir Perfil">
                    <i class="fa-solid fa-trash-can"></i> Excluir
                </button>
            </td>
        `;

        // Evento de Toggle de visualização da senha (oculta por padrão)
        const btnTogglePw = tr.querySelector('.btn-toggle-pw-view');
        const pwSpan = tr.querySelector('.pw-text');
        let isVisible = false;

        btnTogglePw?.addEventListener('click', () => {
            isVisible = !isVisible;
            if (isVisible) {
                pwSpan.textContent = s.senha;
                btnTogglePw.innerHTML = '<i class="fa-regular fa-eye"></i>';
                btnTogglePw.title = 'Ocultar Senha';
            } else {
                pwSpan.textContent = '••••••';
                btnTogglePw.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
                btnTogglePw.title = 'Mostrar Senha';
            }
        });

        // Evento de exclusão de aluno
        const btnDelete = tr.querySelector('.btn-table-delete');
        btnDelete?.addEventListener('click', async () => {
            soundManager.playClick();
            const confirmDelete = await showCustomConfirm({
                title: 'Excluir Perfil de Aluno',
                message: `Tem certeza que deseja remover permanentemente o aluno <strong>"${displayName}"</strong> (Codinome: <em>${s.codinome}</em>)?<br><br>Essa ação apagará todo o histórico e pontuações deste detetive.`,
                confirmText: 'Sim, Excluir Perfil',
                cancelText: 'Cancelar'
            });
            if (confirmDelete) {
                await dbService.deleteStudent(s.codinome);
                showToast(`Perfil de ${s.codinome} removido.`, 'info');
                openTeacherDashboard();
            }
        });

        tbody.appendChild(tr);
    });
}

function filterTeacherTable(query) {
    const clean = query.toLowerCase().trim();
    const filtered = AppState.cachedStudents.filter(s => 
        (s.codinome && s.codinome.toLowerCase().includes(clean)) ||
        (s.nomeReal && s.nomeReal.toLowerCase().includes(clean)) ||
        (s.nome && s.nome.toLowerCase().includes(clean))
    );
    renderTeacherStudentsTable(filtered);
}

// Exportar Tabela para CSV
function exportStudentsToCSV() {
    const students = AppState.cachedStudents;
    if (students.length === 0) {
        showToast('Nenhum dado disponível para exportar.', 'error');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nome Real,Codinome,Senha,Data de Criacao,Aulas Matematica,Pontos Matematica,Aulas Portugues,Pontos Portugues,Total XP,Ultima Atividade\n";

    students.forEach(s => {
        const mathCount = Object.values(s.progress?.matematica?.completedLessons || {}).filter(l => l.completed).length;
        const mathScore = s.progress?.matematica?.totalScore || 0;
        const portCount = Object.values(s.progress?.portugues?.completedLessons || {}).filter(l => l.completed).length;
        const portScore = s.progress?.portugues?.totalScore || 0;
        const status = (s.currentActivityStatus || '').replace(/,/g, ' ');
        const realName = (s.nomeReal || s.nome || 'Não informado').replace(/"/g, '""');

        const row = [
            `"${realName}"`,
            `"${s.codinome}"`,
            `"${s.senha}"`,
            `"${s.createdAt || ''}"`,
            mathCount,
            mathScore,
            portCount,
            portScore,
            s.totalXp || 0,
            `"${status}"`
        ].join(",");

        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `decifradores_relatorio_turma_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relatório CSV exportado com sucesso!', 'success');
}

// ============================================================================
// 8. MODO "JOGAR JUNTO" (SALA DE AULA SINCRONIZADA EM TEMPO REAL)
// ============================================================================

// Helper central para notificar conclusão bem-sucedida de qualquer enigma
function onEnigmaSolvedSuccess(atv, cardElement) {
    soundManager.playSuccess();
    cardElement?.classList.add('solved');
    AppState.currentLessonScores[atv.id] = 50;

    // Atualiza visual do indicador de passo (dot) no cabeçalho do wizard individual
    const dotBtns = document.querySelectorAll('.wizard-dot-btn');
    if (dotBtns && dotBtns[AppState.currentActivityIndex]) {
        dotBtns[AppState.currentActivityIndex].classList.add('solved');
        dotBtns[AppState.currentActivityIndex].innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Enigma #${AppState.currentActivityIndex + 1}</span>`;
    }

    // Se estiver no Modo JOGAR JUNTO (Live Session Sincronizada)
    if (AppState.isLiveSessionActive && AppState.currentLiveSession && AppState.activeStudent) {
        const startTime = AppState.currentLiveSession.currentActivityStartTime || Date.now();
        const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        
        liveSessionService.submitEnigmaAnswer(
            AppState.activeStudent.codinome,
            AppState.currentLiveSession.currentActivityIndex,
            elapsed,
            50
        );

        // Notifica na tela do aluno e entra em estado de espera
        setTimeout(() => {
            if (AppState.isLiveSessionActive && AppState.currentLiveSession) {
                renderStudentLiveWaiting(AppState.currentLiveSession);
            }
        }, 1000);
    }
}

function setupLiveSessionListeners() {
    // Escuta atualizações de sessões ativas do Firestore / BroadcastChannel
    liveSessionService.listenToActiveSession((session) => {
        handleLiveSessionUpdate(session);
    });

    // Ações do Modal de Convite (Aluno)
    document.getElementById('btn-accept-live-invite')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.activeStudent || !AppState.currentLiveSession) return;
        await liveSessionService.joinSession(AppState.activeStudent);
        document.getElementById('modal-jogar-junto-invite')?.classList.remove('active');
        const banner = document.getElementById('student-live-banner-rejoin');
        if (banner) banner.style.display = 'none';
        AppState.isLiveSessionActive = true;
        showView('view-student-live-session');
    });

    document.getElementById('btn-decline-live-invite')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('modal-jogar-junto-invite')?.classList.remove('active');
        AppState.declinedSessionId = AppState.currentLiveSession?.id;

        // Exibe a barra de reingresso no topo para o aluno poder entrar quando quiser
        const banner = document.getElementById('student-live-banner-rejoin');
        const bannerLessonInfo = document.getElementById('live-banner-lesson-info');
        if (banner && AppState.currentLiveSession) {
            banner.style.display = 'flex';
            if (bannerLessonInfo) {
                bannerLessonInfo.textContent = `${AppState.currentLiveSession.lessonTitle} • Investigação ao vivo com a turma`;
            }
        }
        showToast('Você pode entrar na investigação coletiva a qualquer momento pelo botão no topo da tela!', 'info', 5000);
    });

    // Botão na Barra de Alerta para Reingressar na Missão
    document.getElementById('btn-rejoin-live-banner')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.activeStudent || !AppState.currentLiveSession) return;
        await liveSessionService.joinSession(AppState.activeStudent);
        AppState.isLiveSessionActive = true;
        AppState.declinedSessionId = null;
        const banner = document.getElementById('student-live-banner-rejoin');
        if (banner) banner.style.display = 'none';
        showView('view-student-live-session');
        showToast('Você ingressou na missão com a turma! 🚀', 'success');
    });

    // Botão JOGAR JUNTO no Header da Aula
    document.getElementById('btn-jogar-junto-lesson-header')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.currentLessonData) return;
        await startTeacherLiveSession(AppState.currentSubjectKey, AppState.currentLessonId);
    });

    // Botão JOGAR JUNTO na Lista de Dossiês da Disciplina
    document.getElementById('btn-jogar-junto-subject-header')?.addEventListener('click', async () => {
        soundManager.playClick();
        const subj = getDisciplina(AppState.currentSubjectKey);
        if (!subj || !subj.aulas || subj.aulas.length === 0) {
            showToast('Não há aulas cadastradas nesta disciplina para jogar junto.', 'info');
            return;
        }
        const firstLesson = subj.aulas[0];
        await startTeacherLiveSession(AppState.currentSubjectKey, firstLesson.id);
    });

    // Professor Inicia a Partida (Libera Enigma Atual/Inicial)
    document.getElementById('btn-teacher-start-game')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.currentLiveSession) return;
        const count = Object.keys(AppState.currentLiveSession.participantes || {}).length;
        if (count === 0) {
            const proceed = await showCustomConfirm({
                title: 'Nenhum Aluno Conectado',
                message: 'Ainda não há alunos conectados no lobby. Deseja iniciar a partida mesmo assim para testes ou demonstração?',
                confirmText: 'Iniciar Mesmo Assim',
                cancelText: 'Aguardar Alunos'
            });
            if (!proceed) return;
        }
        await liveSessionService.startSession();
    });

    // Professor Avança para o Próximo Enigma
    document.getElementById('btn-teacher-next-enigma')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.currentLiveSession) return;
        await liveSessionService.advanceToNextEnigma();
    });

    // Professor Pausa e Salva a Sessão (Pausa no meio da aula)
    document.getElementById('btn-teacher-pause-session')?.addEventListener('click', async () => {
        soundManager.playClick();
        if (!AppState.currentLiveSession) return;
        const currentIdx = AppState.currentLiveSession.currentActivityIndex || 0;
        const confirmPause = await showCustomConfirm({
            title: 'Pausar e Salvar Progresso?',
            message: `Deseja pausar a sessão da turma no <strong>Enigma #${currentIdx + 1}</strong>?<br><br>O progresso individual de cada aluno e os pontos conquistados ficarão salvos para continuar de onde parou na próxima aula!`,
            confirmText: 'Pausar & Salvar',
            cancelText: 'Continuar Jogando'
        });
        if (!confirmPause) return;
        await liveSessionService.pauseSession();
        AppState.isLiveSessionActive = false;
        stopLiveTimer();
        showView('view-teacher-dashboard');
        showToast('Sessão pausada com sucesso! O progresso da turma foi salvo. 💾', 'success');
    });

    // Professor Cancela / Encerra a Sessão
    document.getElementById('btn-teacher-cancel-session')?.addEventListener('click', async () => {
        soundManager.playClick();
        const confirm = await showCustomConfirm({
            title: 'Encerrar Sessão Coletiva?',
            message: 'Deseja realmente encerrar a sessão ao vivo com os alunos?<br><br>Dica: se quiser continuar depois, utilize o botão "Pausar & Salvar".',
            confirmText: 'Encerrar Sessão',
            cancelText: 'Continuar na Sessão'
        });
        if (!confirm) return;
        await liveSessionService.closeSession();
        AppState.isLiveSessionActive = false;
        showView('view-teacher-dashboard');
        showToast('Sessão coletiva encerrada.', 'info');
    });

    // Professor Salva e Finaliza
    document.getElementById('btn-teacher-finish-and-save')?.addEventListener('click', async () => {
        soundManager.playClick();
        await liveSessionService.closeSession();
        AppState.isLiveSessionActive = false;
        showView('view-teacher-dashboard');
        renderTeacherRankingHistory();
        showToast('Partida finalizada e ranking gravado no histórico! 🏆', 'success');
    });

    // Aluno Sai da Sessão Finalizada
    document.getElementById('btn-student-exit-live-session')?.addEventListener('click', () => {
        soundManager.playClick();
        AppState.isLiveSessionActive = false;
        stopLiveTimer();
        renderStudentHub();
        showView('view-student-hub');
    });

    // Abas do Painel do Professor
    document.getElementById('tab-btn-teacher-students')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('tab-btn-teacher-students').classList.add('active');
        document.getElementById('tab-btn-teacher-rankings').classList.remove('active');
        document.getElementById('teacher-tab-content-students').style.display = 'block';
        document.getElementById('teacher-tab-content-rankings').style.display = 'none';
    });

    document.getElementById('tab-btn-teacher-rankings')?.addEventListener('click', () => {
        soundManager.playClick();
        document.getElementById('tab-btn-teacher-rankings').classList.add('active');
        document.getElementById('tab-btn-teacher-students').classList.remove('active');
        document.getElementById('teacher-tab-content-students').style.display = 'none';
        document.getElementById('teacher-tab-content-rankings').style.display = 'block';
        renderTeacherRankingHistory();
    });
}

// Iniciar Sessão do Professor (com suporte a continuar do checkpoint salvo)
async function startTeacherLiveSession(subjectKey, lessonId) {
    const subject = getDisciplina(subjectKey);
    const lesson = getAula(subjectKey, lessonId);
    if (!subject || !lesson) return;

    let startIndex = 0;
    let initialParticipantes = {};

    // Verifica se existe um checkpoint salvo para esta aula
    const checkpoint = await liveSessionService.getCheckpoint(subjectKey, lessonId);
    if (checkpoint && typeof checkpoint.currentActivityIndex === 'number' && checkpoint.currentActivityIndex > 0 && checkpoint.currentActivityIndex < lesson.atividades.length) {
        const resumeChoice = await showCustomConfirm({
            title: 'Missão Anterior em Andamento!',
            message: `Existe um progresso salvo nesta aula parado no <strong>Enigma #${checkpoint.currentActivityIndex + 1}</strong> de ${checkpoint.totalEnigmas || lesson.atividades.length}.<br><br>Deseja continuar de onde a turma parou ou reiniciar do Enigma #1?`,
            confirmText: `Continuar do Enigma #${checkpoint.currentActivityIndex + 1}`,
            cancelText: 'Reiniciar do Início'
        });

        if (resumeChoice) {
            startIndex = checkpoint.currentActivityIndex;
            initialParticipantes = checkpoint.participantes || {};
            showToast(`Retomando missão coletiva a partir do Enigma #${startIndex + 1}...`, 'info');
        } else {
            await liveSessionService.clearCheckpoint(subjectKey, lessonId);
            showToast('Iniciando nova investigação desde o Enigma #1.', 'info');
        }
    }

    AppState.isLiveSessionActive = true;
    const session = await liveSessionService.createSession(
        subjectKey,
        lessonId,
        lesson.titulo,
        lesson.atividades.length,
        startIndex,
        initialParticipantes
    );

    AppState.currentLiveSession = session;
    document.getElementById('teacher-live-lesson-title').textContent = `${subject.nome} • Aula ${lesson.numero}: ${lesson.titulo}`;

    showView('view-teacher-live-session');
    renderTeacherLiveLobby(session);
    showToast('Sessão ao vivo criada! O chamado foi enviado para os alunos.', 'success');
}

// Manipulador Geral de Atualizações da Sessão
function handleLiveSessionUpdate(session) {
    AppState.currentLiveSession = session;
    const rejoinBanner = document.getElementById('student-live-banner-rejoin');

    if (!session || session.status === 'closed' || session.status === 'paused') {
        document.getElementById('modal-jogar-junto-invite')?.classList.remove('active');
        if (rejoinBanner) rejoinBanner.style.display = 'none';

        if (AppState.isLiveSessionActive && AppState.activeStudent) {
            AppState.isLiveSessionActive = false;
            stopLiveTimer();
            renderStudentHub();
            showView('view-student-hub');
            if (session && session.status === 'paused') {
                showToast('💾 A missão foi pausada pelo Professor. Seu progresso e pontuação foram salvos com sucesso!', 'info', 5000);
            } else {
                showToast('A sessão coletiva foi finalizada pelo professor.', 'info');
            }
        }
        return;
    }

    if (session.status === 'final_ranking') {
        document.getElementById('modal-jogar-junto-invite')?.classList.remove('active');
        if (rejoinBanner) rejoinBanner.style.display = 'none';
    }

    // 1. VISÃO DO ALUNO LOGADO
    if (AppState.activeStudent) {
        const myCodename = AppState.activeStudent.codinome;
        const myParticipant = session.participantes ? session.participantes[myCodename] : null;
        const isStudentInLiveView = document.getElementById('view-student-live-session')?.classList.contains('active');
        const isWelcomeActive = document.getElementById('view-welcome')?.classList.contains('active');

        // Exibição da barra de reingresso para alunos que estão fora da sala ao vivo
        if (!isStudentInLiveView && !isWelcomeActive && ['lobby', 'playing', 'enigma_ranking'].includes(session.status)) {
            if (rejoinBanner) {
                rejoinBanner.style.display = 'flex';
                const bannerLessonInfo = document.getElementById('live-banner-lesson-info');
                if (bannerLessonInfo) {
                    bannerLessonInfo.textContent = `${session.lessonTitle} • Investigação ao vivo com a turma`;
                }
            }
        } else {
            if (rejoinBanner) rejoinBanner.style.display = 'none';
        }

        // Se o aluno ainda não entrou e o status é lobby -> Mostra o convite urgente
        if (!myParticipant && session.status === 'lobby') {
            if (AppState.declinedSessionId !== session.id) {
                const subject = getDisciplina(session.subjectKey);
                document.getElementById('invite-mission-subject').textContent = (subject?.nome || 'MATEMÁTICA').toUpperCase();
                document.getElementById('invite-mission-title').textContent = session.lessonTitle;
                document.getElementById('invite-mission-extra').textContent = `${session.totalEnigmas} Enigmas Sincronizados com a Turma`;
                document.getElementById('modal-jogar-junto-invite')?.classList.add('active');
                soundManager.playClick();
            }
        }

        // Se o aluno já está participando da sessão
        if (myParticipant) {
            document.getElementById('modal-jogar-junto-invite')?.classList.remove('active');
            AppState.isLiveSessionActive = true;
            if (rejoinBanner) rejoinBanner.style.display = 'none';

            if (session.status === 'lobby') {
                showView('view-student-live-session');
                renderStudentLiveLobby(session);
            } else if (session.status === 'playing') {
                showView('view-student-live-session');
                if (myParticipant.status === 'solved') {
                    renderStudentLiveWaiting(session);
                } else {
                    renderStudentLiveEnigma(session);
                }
            } else if (session.status === 'enigma_ranking') {
                showView('view-student-live-session');
                renderStudentLiveWaiting(session, true);
            } else if (session.status === 'final_ranking') {
                showView('view-student-live-session');
                renderStudentLivePodium(session);
            }
        }
    }

    // 2. VISÃO DO PROFESSOR (Se estiver na tela view-teacher-live-session)
    const currentTeacherView = document.getElementById('view-teacher-live-session');
    if (currentTeacherView && currentTeacherView.classList.contains('active')) {
        if (session.status === 'lobby') {
            renderTeacherLiveLobby(session);
        } else if (session.status === 'playing' || session.status === 'enigma_ranking') {
            renderTeacherLiveMonitoring(session);
        } else if (session.status === 'final_ranking') {
            renderTeacherLivePodium(session);
        }
    }
}

// Renderiza Lobby do Professor
function renderTeacherLiveLobby(session) {
    document.getElementById('teacher-live-phase-lobby').style.display = 'block';
    document.getElementById('teacher-live-phase-playing').style.display = 'none';
    document.getElementById('teacher-live-phase-final').style.display = 'none';

    const count = Object.keys(session.participantes || {}).length;
    document.getElementById('teacher-lobby-count').textContent = count;

    // Indicador visual de retomada por Checkpoint
    const checkpointBadge = document.getElementById('teacher-checkpoint-badge');
    const checkpointText = document.getElementById('teacher-checkpoint-text');
    const startBtnText = document.getElementById('btn-teacher-start-game-text');

    if (session.isResumed || (session.currentActivityIndex > 0)) {
        if (checkpointBadge) checkpointBadge.style.display = 'block';
        if (checkpointText) checkpointText.textContent = `Sessão retomada a partir do Enigma #${session.currentActivityIndex + 1} de ${session.totalEnigmas}`;
        if (startBtnText) startBtnText.textContent = `Iniciar Investigação Coletiva (Liberar Enigma #${session.currentActivityIndex + 1})`;
    } else {
        if (checkpointBadge) checkpointBadge.style.display = 'none';
        if (startBtnText) startBtnText.textContent = `Iniciar Investigação Coletiva (Liberar Enigma #1)`;
    }

    const grid = document.getElementById('teacher-lobby-agents-grid');
    if (grid) {
        grid.innerHTML = '';
        if (count === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 1.5rem;">
                    Nenhum aluno entrou ainda. Assim que os alunos clicarem no chamado em suas telas, eles aparecerão aqui.
                </div>
            `;
        } else {
            Object.values(session.participantes).forEach(p => {
                const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === p.avatar) || AVATARES_DISPONIVEIS[0];
                const card = document.createElement('div');
                card.className = 'lobby-agent-card';
                card.innerHTML = `
                    <div class="lobby-agent-avatar">${avatarObj.icone}</div>
                    <div class="lobby-agent-name">${p.codinome}</div>
                `;
                grid.appendChild(card);
            });
        }
    }
}

// Renderiza Painel de Monitoramento do Professor
function renderTeacherLiveMonitoring(session) {
    document.getElementById('teacher-live-phase-lobby').style.display = 'none';
    document.getElementById('teacher-live-phase-playing').style.display = 'block';
    document.getElementById('teacher-live-phase-final').style.display = 'none';

    const lesson = getAula(session.subjectKey, session.lessonId);
    const atv = lesson ? lesson.atividades[session.currentActivityIndex] : null;

    document.getElementById('teacher-live-enigma-number').textContent = `ENIGMA #${session.currentActivityIndex + 1} DE ${session.totalEnigmas}`;
    document.getElementById('teacher-live-enigma-name').textContent = atv ? atv.titulo : `Enigma #${session.currentActivityIndex + 1}`;

    // RENDERIZA O ENIGMA NA PROJEÇÃO DO PROFESSOR (Para leitura e explicação da sala)
    const projectionContainer = document.getElementById('teacher-live-enigma-projection-container');
    if (projectionContainer && atv) {
        projectionContainer.innerHTML = '';
        const enigmaCard = renderActivityCard(atv, session.currentActivityIndex + 1);
        projectionContainer.appendChild(enigmaCard);
    }

    const participantesList = Object.values(session.participantes || {});
    const totalCount = participantesList.length;
    const solvedCount = participantesList.filter(p => p.status === 'solved').length;

    document.getElementById('teacher-live-solved-counter').textContent = `${solvedCount} / ${totalCount} Concluíram`;

    const btnNext = document.getElementById('btn-teacher-next-enigma');
    if (btnNext) {
        if (session.currentActivityIndex >= session.totalEnigmas - 1) {
            btnNext.innerHTML = '<span>Ver Pódio Final</span> <i class="fa-solid fa-trophy"></i>';
        } else {
            btnNext.innerHTML = '<span>Próximo Enigma</span> <i class="fa-solid fa-forward-step"></i>';
        }
    }

    // Grid de Status dos Alunos (Apenas Codinomes)
    const statusGrid = document.getElementById('teacher-live-agents-status-grid');
    if (statusGrid) {
        statusGrid.innerHTML = '';
        participantesList.forEach(p => {
            const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === p.avatar) || AVATARES_DISPONIVEIS[0];
            const isSolved = (p.status === 'solved');
            const card = document.createElement('div');
            card.className = `live-agent-status-card ${isSolved ? 'solved' : 'answering'}`;
            card.innerHTML = `
                <div style="font-size: 1.65rem;">${avatarObj.icone}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.codinome}</div>
                    <span class="agent-status-tag ${isSolved ? 'solved' : 'answering'}">
                        ${isSolved ? '✅ Concluiu (+50 XP)' : '🔍 Investigando...'}
                    </span>
                </div>
            `;
            statusGrid.appendChild(card);
        });
    }

    // Ranking / Ordem de Conclusão Deste Enigma (Apenas Codinomes)
    const rankingList = document.getElementById('teacher-live-enigma-ranking-list');
    if (rankingList) {
        rankingList.innerHTML = '';
        const ranking = session.activeEnigmaRanking || [];
        if (ranking.length === 0) {
            rankingList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 1rem;">
                    Aguardando a primeira resolução da turma...
                </div>
            `;
        } else {
            ranking.forEach(item => {
                const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === item.avatar) || AVATARES_DISPONIVEIS[0];
                const row = document.createElement('div');
                row.className = 'live-rank-item';
                row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <span class="live-rank-pos top-${item.posicao}">${item.posicao}º</span>
                        <span>${avatarObj.icone}</span>
                        <strong style="color: #fff; font-size: 0.95rem;">${item.codinome}</strong>
                    </div>
                    <span class="live-rank-time" style="color: var(--neon-emerald); font-weight: 700;">+${item.score} XP</span>
                `;
                rankingList.appendChild(row);
            });
        }
    }
}

// Renderiza Pódio Final do Professor (Apenas Codinomes Projetados)
function renderTeacherLivePodium(session) {
    document.getElementById('teacher-live-phase-lobby').style.display = 'none';
    document.getElementById('teacher-live-phase-playing').style.display = 'none';
    document.getElementById('teacher-live-phase-final').style.display = 'block';

    const ranking = session.finalRanking || [];
    renderPodiumVisual(ranking, 'teacher-live-podium-container');

    const tbody = document.getElementById('teacher-live-final-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        ranking.forEach(r => {
            const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === r.avatar) || AVATARES_DISPONIVEIS[0];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${r.posicao}º Lugar</strong></td>
                <td>${avatarObj.icone} <strong>${r.codinome}</strong></td>
                <td><span class="score-counter-pill">${r.totalScore} XP</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    confettiCelebration();
    soundManager.playSuccess();
}

// Renderiza Pódio Visual Genérico (Top 3)
function renderPodiumVisual(ranking, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const first = ranking[0] || null;
    const second = ranking[1] || null;
    const third = ranking[2] || null;

    const renderStep = (player, rankNum, rankClass) => {
        if (!player) return `<div class="podium-step ${rankClass}"></div>`;
        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === player.avatar) || AVATARES_DISPONIVEIS[0];
        return `
            <div class="podium-step ${rankClass}">
                <div class="podium-agent-avatar">${avatarObj.icone}</div>
                <div class="podium-agent-name">${player.codinome}</div>
                <div class="podium-agent-score">${player.totalScore || player.score || 0} XP</div>
                <div class="podium-pillar">${rankNum}º</div>
            </div>
        `;
    };

    container.innerHTML = `
        ${renderStep(second, 2, 'podium-rank-2')}
        ${renderStep(first, 1, 'podium-rank-1')}
        ${renderStep(third, 3, 'podium-rank-3')}
    `;
}

// Renderiza Lobby do Aluno
function renderStudentLiveLobby(session) {
    document.getElementById('student-live-phase-lobby').style.display = 'block';
    document.getElementById('student-live-phase-playing').style.display = 'none';
    document.getElementById('student-live-phase-waiting').style.display = 'none';
    document.getElementById('student-live-phase-final').style.display = 'none';

    document.getElementById('student-live-lesson-title').textContent = session.lessonTitle;
    document.getElementById('student-live-enigma-label').textContent = session.currentActivityIndex > 0
        ? `Retomando no Enigma #${session.currentActivityIndex + 1} de ${session.totalEnigmas}`
        : 'Aguardando Início';

    const preview = document.getElementById('student-lobby-agents-preview');
    if (preview) {
        preview.innerHTML = '';
        const participantes = Object.values(session.participantes || {});
        participantes.forEach(p => {
            const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === p.avatar) || AVATARES_DISPONIVEIS[0];
            const badge = document.createElement('span');
            badge.className = 'order-source-pill';
            badge.style.margin = '0.25rem';
            badge.innerHTML = `${avatarObj.icone} ${p.codinome}`;
            preview.appendChild(badge);
        });
    }
}

// Renderiza Enigma Sincronizado do Aluno
function renderStudentLiveEnigma(session) {
    document.getElementById('student-live-phase-lobby').style.display = 'none';
    document.getElementById('student-live-phase-playing').style.display = 'block';
    document.getElementById('student-live-phase-waiting').style.display = 'none';
    document.getElementById('student-live-phase-final').style.display = 'none';

    const lesson = getAula(session.subjectKey, session.lessonId);
    if (!lesson) return;

    const atv = lesson.atividades[session.currentActivityIndex];
    if (!atv) return;

    document.getElementById('student-live-lesson-title').textContent = lesson.titulo;
    document.getElementById('student-live-enigma-label').textContent = `Enigma ${session.currentActivityIndex + 1} de ${session.totalEnigmas}`;

    // Só recria o card se mudou de enigma
    if (AppState.currentLiveEnigmaIndex !== session.currentActivityIndex) {
        AppState.currentLiveEnigmaIndex = session.currentActivityIndex;
        const container = document.getElementById('student-live-enigma-container');
        container.innerHTML = '';
        const card = renderActivityCard(atv, session.currentActivityIndex + 1);
        container.appendChild(card);
    }
}

// Renderiza Tela de Espera do Aluno (Após submissão ou Encerramento da rodada)
function renderStudentLiveWaiting(session, isRankingPhase = false) {
    document.getElementById('student-live-phase-lobby').style.display = 'none';
    document.getElementById('student-live-phase-playing').style.display = 'none';
    document.getElementById('student-live-phase-waiting').style.display = 'block';
    document.getElementById('student-live-phase-final').style.display = 'none';

    const myCodename = AppState.activeStudent?.codinome;
    const myHistory = session.participantes?.[myCodename]?.history?.[session.currentActivityIndex];

    const headline = document.getElementById('student-waiting-headline');
    const subtext = document.getElementById('student-waiting-subtext');

    if (myHistory && myHistory.solved) {
        headline.textContent = '✅ Enigma Solucionado com Sucesso!';
        subtext.innerHTML = `Você decifrou o enigma com sucesso e conquistou <strong>+50 XP</strong>! Aguarde o Professor autorizar o próximo caso!`;
    } else {
        headline.textContent = '⏳ Rodada Finalizada!';
        subtext.innerHTML = `O tempo desta pista foi encerrado. Prepare-se para o próximo enigma!`;
    }

    const rankList = document.getElementById('student-waiting-enigma-rank-list');
    if (rankList) {
        rankList.innerHTML = '';
        const ranking = session.activeEnigmaRanking || [];
        if (ranking.length === 0) {
            rankList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem;">Aguardando conclusões da turma...</div>`;
        } else {
            ranking.forEach(r => {
                const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === r.avatar) || AVATARES_DISPONIVEIS[0];
                const isMe = (r.codinome === myCodename);
                const row = document.createElement('div');
                row.className = 'live-rank-item';
                if (isMe) {
                    row.style.borderColor = 'var(--neon-cyan)';
                    row.style.background = 'rgba(56, 189, 248, 0.15)';
                }
                row.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <span class="live-rank-pos top-${r.posicao}">${r.posicao}º</span>
                        <span>${avatarObj.icone}</span>
                        <strong style="color: #fff;">${r.codinome} ${isMe ? ' (Você)' : ''}</strong>
                    </div>
                    <span class="live-rank-time" style="color: var(--neon-emerald); font-weight: 700;">✅ Concluído (+${r.score} XP)</span>
                `;
                rankList.appendChild(row);
            });
        }
    }
}

// Renderiza Pódio Final do Aluno
function renderStudentLivePodium(session) {
    document.getElementById('student-live-phase-lobby').style.display = 'none';
    document.getElementById('student-live-phase-playing').style.display = 'none';
    document.getElementById('student-live-phase-waiting').style.display = 'none';
    document.getElementById('student-live-phase-final').style.display = 'block';

    const ranking = session.finalRanking || [];
    renderPodiumVisual(ranking, 'student-live-podium-container');

    const myCodename = AppState.activeStudent?.codinome;
    const myRank = ranking.find(r => r.codinome === myCodename);

    const summary = document.getElementById('student-final-score-summary');
    if (summary && myRank) {
        summary.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.85); border: 1.5px solid var(--neon-cyan); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 500px; margin: 1.5rem auto; text-align: center;">
                <h3 style="font-family: var(--font-heading); color: #fff; margin-bottom: 0.5rem;">Sua Classificação Pericial</h3>
                <div style="font-size: 2.2rem; font-weight: 900; color: var(--neon-amber); margin: 0.5rem 0;">${myRank.posicao}º LUGAR</div>
                <p style="color: var(--text-secondary); margin-bottom: 0;">Pontuação Total: <strong>${myRank.totalScore} XP</strong></p>
            </div>
        `;
    }

    confettiCelebration();
    soundManager.playSuccess();
}

// Timer da Sessão ao Vivo
function startLiveTimer(startTime) {
    stopLiveTimer();
    const timerEl = document.getElementById('student-live-timer');
    const update = () => {
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        const mins = String(Math.floor(diff / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    };
    update();
    AppState.liveTimerInterval = setInterval(update, 1000);
}

function stopLiveTimer() {
    if (AppState.liveTimerInterval) {
        clearInterval(AppState.liveTimerInterval);
        AppState.liveTimerInterval = null;
    }
}

// Renderiza o Histórico de Rankings no Painel do Professor
async function renderTeacherRankingHistory() {
    const listContainer = document.getElementById('teacher-ranking-history-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Carregando histórico de partidas...</div>';

    const history = await liveSessionService.getRankingHistory();
    if (history.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1.5px dashed rgba(255,255,255,0.15);">
                <div style="font-size: 3rem; margin-bottom: 0.75rem;">🏆</div>
                <h4 style="color: var(--text-primary); font-family: var(--font-heading); margin-bottom: 0.5rem;">Nenhuma Partida Coletiva Registrada</h4>
                <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto;">Inicie o modo <strong>JOGAR JUNTO</strong> em qualquer aula para realizar investigações coletivas e registrar o histórico de rankings da turma!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = '';
    history.forEach(item => {
        const dateStr = item.completedAt ? new Date(item.completedAt).toLocaleString('pt-BR') : 'Data não informada';
        const card = document.createElement('div');
        card.className = 'ranking-history-card';

        let podiumSnippet = '';
        if (item.finalRanking && item.finalRanking.length > 0) {
            const top3 = item.finalRanking.slice(0, 3);
            podiumSnippet = top3.map(r => {
                const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === r.avatar) || AVATARES_DISPONIVEIS[0];
                return `<span style="display: inline-flex; align-items: center; gap: 0.35rem; margin-right: 1rem; font-size: 0.92rem; font-weight: 700; color: #fff;">
                    <strong>${r.posicao}º</strong> ${avatarObj.icone} ${r.codinome} (${r.totalScore} XP)
                </span>`;
            }).join('');
        }

        card.innerHTML = `
            <div class="ranking-history-top">
                <div>
                    <span class="dossier-stamp" style="font-size: 0.72rem; margin-bottom: 0.25rem;">${(item.subjectKey || 'MATEMÁTICA').toUpperCase()}</span>
                    <h4 class="ranking-history-title">${item.lessonTitle || 'Aula Coletiva'}</h4>
                </div>
                <div class="ranking-history-meta">
                    <i class="fa-regular fa-calendar-days"></i> ${dateStr} • <i class="fa-solid fa-users"></i> ${item.totalParticipants || 0} Detetives
                </div>
            </div>
            <div style="background: rgba(30, 41, 59, 0.6); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);">
                <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--neon-amber); font-weight: 800; margin-bottom: 0.35rem;">🏆 Pódio da Partida:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${podiumSnippet || '<span style="color: var(--text-muted);">Sem pódio gravado</span>'}
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}
