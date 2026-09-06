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

    playJump() {
        if (!AppState.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(160, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.11);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.11);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.11);
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
function showView(viewId, scrollToTop = true) {
    const target = document.getElementById(viewId);
    const isAlreadyActive = target && target.classList.contains('active');

    if (!isAlreadyActive) {
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });

        if (target) {
            target.classList.add('active');
            if (scrollToTop) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
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
    const btnHeaderTeacherDash = document.getElementById('btn-header-teacher-dash');

    if (AppState.isTeacher) {
        if (studentBadge) studentBadge.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'flex';
        if (btnHeaderTeacherDash) btnHeaderTeacherDash.style.display = 'inline-flex';
    } else if (AppState.activeStudent) {
        if (studentBadge) studentBadge.style.display = 'flex';
        if (btnLogout) btnLogout.style.display = 'flex';
        if (btnHeaderTeacherDash) btnHeaderTeacherDash.style.display = 'none';

        const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === AppState.activeStudent.avatar) || AVATARES_DISPONIVEIS[0];
        if (studentAvatar) studentAvatar.textContent = avatarObj.icone;
        if (studentName) studentName.textContent = AppState.activeStudent.codinome;

        const totalXp = AppState.activeStudent.totalXp || 0;
        if (studentXp) studentXp.textContent = `${totalXp} XP`;
    } else {
        if (studentBadge) studentBadge.style.display = 'none';
        if (btnLogout) btnLogout.style.display = 'none';
        if (btnHeaderTeacherDash) btnHeaderTeacherDash.style.display = 'none';
    }
}

function updateHeaderAuthUI() {
    updateHeaderUI();
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

    // Carrega sessão salva se houver (Professor ou Aluno)
    const isTeacherSession = sessionStorage.getItem('decifradores_is_teacher') === 'true';
    const savedStudent = dbService.getActiveStudent();

    if (isTeacherSession) {
        AppState.isTeacher = true;
        AppState.activeStudent = null;
        updateHeaderAuthUI();

        // Se existir sessão de Jogar Junto ativa, entra direto na sala ao vivo!
        const isLiveOngoing = AppState.currentLiveSession && ['lobby', 'playing', 'enigma_ranking'].includes(AppState.currentLiveSession.status);
        if (isLiveOngoing) {
            const subject = getDisciplina(AppState.currentLiveSession.subjectKey);
            const lesson = getAula(AppState.currentLiveSession.subjectKey, AppState.currentLiveSession.lessonId);
            const lessonTitle = lesson ? `Aula ${lesson.numero}: ${lesson.titulo}` : AppState.currentLiveSession.lessonTitle;
            document.getElementById('teacher-live-lesson-title').textContent = `${subject?.nome || 'MATEMÁTICA'} • ${lessonTitle}`;
            
            showView('view-teacher-live-session');
            handleLiveSessionUpdate(AppState.currentLiveSession);
            showToast('📡 Sessão do "Jogar Junto" recuperada com sucesso!', 'info', 4000);
        } else {
            openTeacherDashboard();
        }
    } else if (savedStudent) {
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
        sessionStorage.removeItem('decifradores_is_teacher');
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

    // TIPO 13 (PORTUGUÊS 1): ALFABETO LACUNADO (ALFABETO PERICIAL)
    if (atv.tipo === 'alfabeto_lacunado' && atv.alfabeto) {
        let cellsHtml = '';
        atv.alfabeto.forEach((item, idx) => {
            if (item.oculto) {
                cellsHtml += `
                    <div class="alphabet-cell input-cell">
                        <input type="text" 
                               maxlength="1" 
                               class="alphabet-cell-input ${isAlreadySolved ? 'correct' : ''}" 
                               data-cell-idx="${idx}" 
                               data-expected="${item.letra}" 
                               id="alphabet-input-${atv.id}-${idx}"
                               value="${isAlreadySolved ? item.letra : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''} 
                               placeholder="?" 
                               autocomplete="off" 
                               autocapitalize="characters"
                               aria-label="Letra ${item.letra}">
                    </div>
                `;
            } else {
                cellsHtml += `
                    <div class="alphabet-cell fixed">${item.letra}</div>
                `;
            }
        });

        inputSectionHtml = `
            <div class="alphabet-activity-container">
                <div class="hundred-chart-legend">
                    <span><i class="fa-solid fa-pen-to-square" style="color: var(--neon-amber);"></i> Complete as letras destacadas em âmbar</span>
                    <span><i class="fa-solid fa-font" style="color: var(--neon-cyan);"></i> Ordem alfabética de A a Z</span>
                </div>
                <div class="alphabet-grid">
                    ${cellsHtml}
                </div>
                <div class="hundred-chart-actions">
                    <button type="button" class="btn-decode-action btn-verify-alphabet-grid" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-spell-check"></i> ${isAlreadySolved ? 'Alfabeto Verificado com Sucesso ✅' : 'Verificar Alfabeto Completo'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 14 (PORTUGUÊS 2): VIZINHOS DO ALFABETO (ANTES E DEPOIS)
    if (atv.tipo === 'vizinhos_alfabeto' && atv.itens) {
        let rowsHtml = '';
        atv.itens.forEach((item, idx) => {
            rowsHtml += `
                <div class="neighbor-row-card letter-neighbor-card" id="letter-neighbor-row-${atv.id}-${idx}">
                    <div class="neighbor-col neighbor-left">
                        <label class="neighbor-col-label"><i class="fa-solid fa-arrow-left"></i> Vem Antes</label>
                        <input type="text" 
                               maxlength="1" 
                               class="neighbor-input letter-neighbor-input antecessor-input" 
                               data-row-idx="${idx}" 
                               data-type="antes" 
                               data-expected="${item.antes}" 
                               placeholder="?" 
                               autocomplete="off" 
                               autocapitalize="characters"
                               value="${isAlreadySolved ? item.antes : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               aria-label="Letra que vem antes de ${item.letra}">
                    </div>

                    <div class="neighbor-col neighbor-center">
                        <span class="neighbor-badge-tag">Letra Pista</span>
                        <div class="neighbor-number-display letter-display">${item.letra}</div>
                    </div>

                    <div class="neighbor-col neighbor-right">
                        <label class="neighbor-col-label">Vem Depois <i class="fa-solid fa-arrow-right"></i></label>
                        <input type="text" 
                               maxlength="1" 
                               class="neighbor-input letter-neighbor-input sucessor-input" 
                               data-row-idx="${idx}" 
                               data-type="depois" 
                               data-expected="${item.depois}" 
                               placeholder="?" 
                               autocomplete="off" 
                               autocapitalize="characters"
                               value="${isAlreadySolved ? item.depois : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               aria-label="Letra que vem depois de ${item.letra}">
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="neighbors-container letter-neighbors-container">
                <div class="neighbors-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.35rem;">
                    <button type="button" class="btn-decode-action btn-verify-letter-neighbors" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-arrows-left-right"></i> ${isAlreadySolved ? 'Vizinhos Verificados com Sucesso ✅' : 'Verificar Letras Vizinhas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 15 (PORTUGUÊS 3): COMPLETAR PALAVRAS COM DESENHO / EMOJI
    if (atv.tipo === 'completar_palavras_desenho' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            let slotsHtml = '';
            item.lacunas.forEach((char, charIdx) => {
                if (char === null) {
                    const expectedChar = item.respostasEsperadas[String(charIdx)];
                    slotsHtml += `
                        <div class="word-char-slot input-slot">
                            <input type="text" 
                                   maxlength="1" 
                                   class="word-char-input ${isAlreadySolved ? 'correct' : ''}" 
                                   data-item-idx="${itemIdx}" 
                                   data-slot-idx="${charIdx}" 
                                   data-expected="${expectedChar}" 
                                   value="${isAlreadySolved ? expectedChar : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''} 
                                   placeholder="_" 
                                   autocomplete="off" 
                                   autocapitalize="characters"
                                   aria-label="Letra da posição ${charIdx + 1}">
                        </div>
                    `;
                } else {
                    slotsHtml += `
                        <div class="word-char-slot fixed-slot">${char}</div>
                    `;
                }
            });

            cardsHtml += `
                <div class="word-completion-card" id="word-comp-card-${atv.id}-${itemIdx}">
                    <div class="word-visual-header">
                        <div class="word-emoji-badge">${item.emoji}</div>
                        <div class="word-clue-label">Evidência #${itemIdx + 1}</div>
                    </div>
                    <div class="word-slots-container">
                        ${slotsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="word-completion-container">
                <div class="word-completion-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-complete-words" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-spell-check"></i> ${isAlreadySolved ? 'Palavras Decifradas com Sucesso ✅' : 'Verificar Todas as Palavras'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 16 (PORTUGUÊS 4): JUNTAR SÍLABAS PARA FORMAR PALAVRAS
    if (atv.tipo === 'juntar_silabas_palavra' && atv.itens) {
        let itemsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            let chipsHtml = '';
            item.silabasDesordenadas.forEach((syl, sylIdx) => {
                chipsHtml += `
                    <button type="button" 
                            class="syllable-chip-btn ${isAlreadySolved ? 'used' : ''}" 
                            data-item-idx="${itemIdx}" 
                            data-syl-idx="${sylIdx}" 
                            data-syl="${syl}" 
                            ${isAlreadySolved ? 'disabled' : ''}>
                        ${syl}
                    </button>
                `;
            });

            const solvedText = isAlreadySolved ? item.ordemCorreta.join('') : '';

            itemsHtml += `
                <div class="syllable-builder-card" id="syl-builder-card-${atv.id}-${itemIdx}" data-item-idx="${itemIdx}" data-expected="${item.ordemCorreta.join('-')}">
                    <div class="syllable-builder-header">
                        <span class="syllable-builder-emoji">${item.emoji}</span>
                        <div class="syllable-builder-title-box">
                            <strong>Pista #${itemIdx + 1}</strong>
                            <small>Clique nos blocos na ordem certa para montar a palavra</small>
                        </div>
                        <button type="button" class="btn-clear-syllables" data-item-idx="${itemIdx}" ${isAlreadySolved ? 'disabled' : ''} title="Limpar montagem">
                            <i class="fa-solid fa-rotate-left"></i> Limpar
                        </button>
                    </div>

                    <div class="syllable-target-display" id="syl-target-display-${atv.id}-${itemIdx}">
                        <span class="syl-assembled-text">${solvedText || '<em class="syl-placeholder">Clique nas sílabas abaixo...</em>'}</span>
                    </div>

                    <div class="syllable-chips-grid" id="syl-chips-${atv.id}-${itemIdx}">
                        ${chipsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="syllable-builder-container">
                <div class="syllable-builder-list">
                    ${itemsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-join-syllables" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-puzzle-piece"></i> ${isAlreadySolved ? 'Palavras Montadas com Sucesso ✅' : 'Verificar Palavras Formadas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 17 (PORTUGUÊS 5): SEPARAR AS SÍLABAS
    if (atv.tipo === 'separar_silabas' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            let fieldsHtml = '';
            item.silabasEsperadas.forEach((syl, sylIdx) => {
                fieldsHtml += `
                    <div class="syllable-split-slot">
                        <input type="text" 
                               class="syllable-split-input ${isAlreadySolved ? 'correct' : ''}" 
                               data-item-idx="${itemIdx}" 
                               data-slot-idx="${sylIdx}" 
                               data-expected="${syl}" 
                               value="${isAlreadySolved ? syl : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''} 
                               placeholder="Sílaba ${sylIdx + 1}" 
                               autocomplete="off" 
                               autocapitalize="characters"
                               aria-label="Sílaba ${sylIdx + 1} de ${item.palavra}">
                    </div>
                    ${sylIdx < item.silabasEsperadas.length - 1 ? '<span class="syllable-separator-hyphen">-</span>' : ''}
                `;
            });

            cardsHtml += `
                <div class="syllable-splitter-card" id="syl-splitter-card-${atv.id}-${itemIdx}">
                    <div class="syllable-splitter-left">
                        <span class="syllable-splitter-emoji">${item.emoji}</span>
                        <span class="syllable-splitter-word">${item.palavra}</span>
                        <span class="syllable-count-tag">${item.silabasEsperadas.length} Sílabas</span>
                    </div>
                    <div class="syllable-splitter-arrow"><i class="fa-solid fa-arrow-right"></i></div>
                    <div class="syllable-splitter-fields">
                        ${fieldsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="syllable-splitter-container">
                <div class="syllable-splitter-list">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-separate-syllables" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-scissors"></i> ${isAlreadySolved ? 'Separações Silábicas Verificadas com Sucesso ✅' : 'Verificar Separação Silábica'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 18 (PORTUGUÊS 6): BANCO DE SÍLABAS E PALAVRAS LACUNADAS
    if (atv.tipo === 'completar_silabas_banco' && atv.itens) {
        // Embaralha aleatoriamente as sílabas do banco para garantir ordem imprevisível
        const shuffledBank = [...(atv.bancoSilabas || [])];
        for (let i = shuffledBank.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledBank[i], shuffledBank[j]] = [shuffledBank[j], shuffledBank[i]];
        }

        let bankChipsHtml = shuffledBank.map((syl, sIdx) => `
            <button type="button" class="syl-bank-chip-btn ${isAlreadySolved ? 'used' : ''}" data-syl="${syl}" data-syl-idx="${sIdx}" ${isAlreadySolved ? 'disabled' : ''}>
                ${syl}
            </button>
        `).join('');

        let cardsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            cardsHtml += `
                <div class="syl-bank-word-card" id="syl-bank-card-${atv.id}-${itemIdx}">
                    <div class="syl-bank-word-emoji">${item.emoji}</div>
                    <div class="syl-bank-word-body">
                        <div class="syl-bank-slots-row">
                            ${item.prefixo ? `<span class="syl-fixed-segment">${item.prefixo}</span>` : ''}
                            <div class="syl-input-slot-box">
                                <input type="text" 
                                       class="syl-bank-word-input ${isAlreadySolved ? 'correct' : ''}" 
                                       data-item-idx="${itemIdx}" 
                                       data-expected="${item.respostaEsperada}" 
                                       maxlength="${item.respostaEsperada.length}" 
                                       value="${isAlreadySolved ? item.respostaEsperada : ''}" 
                                       ${isAlreadySolved ? 'disabled' : ''} 
                                       placeholder="?" 
                                       autocomplete="off" 
                                       autocapitalize="characters"
                                       aria-label="Sílaba que falta para ${item.palavraCompleta}">
                            </div>
                            ${item.sufixo ? `<span class="syl-fixed-segment">${item.sufixo}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="syl-bank-activity-container">
                <div class="syl-bank-tray">
                    <div class="syl-bank-header">
                        <span><i class="fa-solid fa-boxes-stacked" style="color: var(--neon-amber);"></i> <strong>Banco de Sílabas Pericial:</strong> Clique na sílaba ou digite diretamente nos campos</span>
                    </div>
                    <div class="syl-bank-chips-grid">
                        ${bankChipsHtml}
                    </div>
                </div>

                <div class="syl-bank-words-grid">
                    ${cardsHtml}
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-complete-syllables-bank" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-puzzle-piece"></i> ${isAlreadySolved ? 'Palavras Completadas com Sucesso ✅' : 'Verificar Palavras Completadas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 19 (PORTUGUÊS 7): FORMAR PALAVRAS COM SÍLABA FIXA (RADAR SILÁBICO)
    if (atv.tipo === 'formar_com_silaba_fixa' && atv.itens) {
        let itemsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            let optionsHtml = '';
            item.opcoes.forEach((opt, optIdx) => {
                const isSelected = isAlreadySolved && opt.formaPalavra;
                optionsHtml += `
                    <button type="button" 
                            class="btn-fixed-syl-option ${isSelected ? 'selected' : ''}" 
                            data-item-idx="${itemIdx}" 
                            data-opt-idx="${optIdx}" 
                            data-silaba="${opt.silaba}" 
                            data-valid="${opt.formaPalavra}" 
                            data-word="${opt.palavraFormada || ''}" 
                            ${isAlreadySolved ? 'disabled' : ''}>
                        <span class="fixed-opt-plus">+</span>
                        <span class="fixed-opt-syl">${opt.silaba}</span>
                    </button>
                `;
            });

            let solvedPreviews = '';
            if (isAlreadySolved) {
                solvedPreviews = item.opcoes.filter(o => o.formaPalavra).map(o => `
                    <span class="formed-word-pill"><i class="fa-solid fa-sparkles"></i> ${o.palavraFormada}</span>
                `).join('');
            }

            itemsHtml += `
                <div class="fixed-syl-card" id="fixed-syl-card-${atv.id}-${itemIdx}" data-item-idx="${itemIdx}" data-fixa="${item.silabaFixa}">
                    <div class="fixed-syl-card-header">
                        <div class="fixed-syl-badge-main">
                            <span class="fixed-tag-label"><i class="fa-solid fa-thumbtack"></i> SÍLABA FIXA</span>
                            <strong class="fixed-syl-root">${item.silabaFixa}</strong>
                        </div>
                        <div class="fixed-syl-header-info">
                            <strong>Pista #${itemIdx + 1}</strong>
                            <small>Clique em todas as opções que formam palavras com <strong>${item.silabaFixa}</strong></small>
                        </div>
                    </div>

                    <div class="fixed-syl-options-grid">
                        ${optionsHtml}
                    </div>

                    <div class="fixed-syl-preview-tray" id="fixed-tray-${atv.id}-${itemIdx}">
                        <span class="preview-tray-label"><i class="fa-solid fa-spell-check"></i> Palavras Selecionadas:</span>
                        <div class="preview-tray-chips">
                            ${solvedPreviews || '<em class="empty-tray-msg">Nenhuma sílaba selecionada ainda...</em>'}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="fixed-syl-activity-container">
                <div class="fixed-syl-cards-list">
                    ${itemsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-fixed-syllables" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${isAlreadySolved ? 'Radar Silábico Verificado com Sucesso ✅' : 'Verificar Sílabas Selecionadas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 20 (PORTUGUÊS 8): CLASSIFICAR POR CONTAGEM DE SÍLABAS (ARQUIVO SILÁBICO)
    if (atv.tipo === 'classificar_contagem_silabas' && atv.categorias && atv.palavras) {
        // Embaralha as palavras do banco para ficarem em ordem totalmente aleatória
        const shuffledWords = [...atv.palavras];
        for (let i = shuffledWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
        }

        let bankWordsHtml = '';
        shuffledWords.forEach((w) => {
            bankWordsHtml += `
                <button type="button" 
                        class="classifier-word-chip ${isAlreadySolved ? 'placed' : ''}" 
                        id="chip-word-${atv.id}-${w.id}" 
                        data-word-id="${w.id}" 
                        data-word="${w.palavra}" 
                        data-expected-cat="${w.categoriaCorreta}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    ${w.palavra}
                </button>
            `;
        });

        let drawersHtml = '';
        atv.categorias.forEach(cat => {
            let solvedWordsHtml = '';
            if (isAlreadySolved) {
                solvedWordsHtml = atv.palavras.filter(w => w.categoriaCorreta === cat.id).map(w => `
                    <button type="button" class="placed-word-pill correct" data-word-id="${w.id}" disabled>
                        ${w.palavra}
                    </button>
                `).join('');
            }

            drawersHtml += `
                <div class="classifier-drawer" id="drawer-${atv.id}-${cat.id}" data-cat-id="${cat.id}">
                    <div class="classifier-drawer-header">
                        <span class="drawer-header-icon">${cat.icone}</span>
                        <div class="drawer-header-text">
                            <strong>${cat.titulo}</strong>
                            <small>${cat.subtitulo}</small>
                        </div>
                        <span class="drawer-count-badge" id="count-badge-${atv.id}-${cat.id}">${isAlreadySolved ? atv.palavras.filter(w => w.categoriaCorreta === cat.id).length : 0}</span>
                    </div>

                    <div class="classifier-drawer-dropzone" id="dropzone-${atv.id}-${cat.id}" data-cat-id="${cat.id}">
                        ${solvedWordsHtml || '<em class="dropzone-empty-hint">Clique aqui para arquivar a palavra selecionada</em>'}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="classifier-activity-container" id="classifier-container-${atv.id}">
                <div class="classifier-bank-tray">
                    <div class="classifier-bank-header">
                        <span><i class="fa-solid fa-layer-group" style="color: var(--neon-cyan);"></i> <strong>Banco de Palavras:</strong> Clique em uma palavra e depois clique na gaveta pericial de destino</span>
                        <button type="button" class="btn-reset-classifier" id="btn-reset-classifier-${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                            <i class="fa-solid fa-rotate-left"></i> Limpar Tudo
                        </button>
                    </div>
                    <div class="classifier-bank-chips" id="bank-chips-${atv.id}">
                        ${isAlreadySolved ? '<em class="all-placed-msg">Todas as palavras foram arquivadas com sucesso!</em>' : bankWordsHtml}
                    </div>
                </div>

                <div class="classifier-drawers-grid">
                    ${drawersHtml}
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-syllable-count" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-box-archive"></i> ${isAlreadySolved ? 'Arquivo Silábico Verificado com Sucesso ✅' : 'Verificar Classificação de Sílabas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 21 (PORTUGUÊS 9): CAÇA-PALAVRAS INTERATIVO MULTICOR
    if (atv.tipo === 'caca_palavras' && atv.grid && atv.palavras) {
        let wordsLedgerHtml = atv.palavras.map((p, pIdx) => `
            <div class="ws-target-word-pill ${isAlreadySolved ? 'found' : ''}" 
                 id="ws-target-${atv.id}-${p.palavra}" 
                 data-word="${p.palavra}" 
                 style="--word-color: ${p.cor};">
                <span class="ws-word-dot"></span>
                <strong class="ws-word-name">${p.palavra}</strong>
                <i class="fa-solid fa-circle-check ws-check-icon"></i>
            </div>
        `).join('');

        let gridRowsHtml = '';
        atv.grid.forEach((row, rIdx) => {
            let cellsHtml = '';
            row.forEach((letter, cIdx) => {
                let cellClasses = 'ws-grid-cell';
                let cellStyle = '';

                if (isAlreadySolved) {
                    // Descobre se esta célula pertence a alguma palavra
                    for (const p of atv.palavras) {
                        const coords = atv.posicoesPalavras?.[p.palavra];
                        if (coords && coords.some(([r, c]) => r === rIdx && c === cIdx)) {
                            cellClasses += ' found-cell';
                            cellStyle = `style="background: ${p.cor}35; border-color: ${p.cor}; box-shadow: 0 0 10px ${p.cor}88;"`;
                            break;
                        }
                    }
                }

                cellsHtml += `
                    <button type="button" 
                            class="${cellClasses}" 
                            data-row="${rIdx}" 
                            data-col="${cIdx}" 
                            data-char="${letter}" 
                            ${cellStyle} 
                            ${isAlreadySolved ? 'disabled' : ''} 
                            aria-label="Letra ${letter} linha ${rIdx + 1} coluna ${cIdx + 1}">
                        ${letter}
                    </button>
                `;
            });
            gridRowsHtml += `<div class="ws-grid-row">${cellsHtml}</div>`;
        });

        inputSectionHtml = `
            <div class="wordsearch-activity-container" id="wordsearch-container-${atv.id}">
                <div class="wordsearch-layout">
                    <div class="wordsearch-ledger-col">
                        <div class="ws-ledger-header">
                            <i class="fa-solid fa-list-check" style="color: var(--neon-amber);"></i>
                            <strong>Palavras a Encontrar (${atv.palavras.length}):</strong>
                        </div>
                        <div class="ws-ledger-list">
                            ${wordsLedgerHtml}
                        </div>
                        <div class="ws-selection-status-box">
                            <span class="ws-status-label">Letras Clicadas:</span>
                            <div class="ws-current-selection-display" id="ws-selection-display-${atv.id}">
                                <em>Clique nas letras em sequência</em>
                            </div>
                            <button type="button" class="btn-clear-ws-selection" id="btn-clear-ws-${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                                <i class="fa-solid fa-rotate-left"></i> Limpar Seleção
                            </button>
                        </div>
                    </div>

                    <div class="wordsearch-grid-col">
                        <div class="wordsearch-grid" id="ws-grid-${atv.id}">
                            ${gridRowsHtml}
                        </div>
                    </div>
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-wordsearch" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-magnifying-glass-chart"></i> ${isAlreadySolved ? 'Caça-Palavras Completo com Sucesso ✅' : 'Verificar Caça-Palavras'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 22 (PORTUGUÊS 10): TEXTO LACUNADO DO BILHETE + COMPREENSÃO
    if (atv.tipo === 'texto_lacunado_compreensao' && atv.linhasBilhete && atv.perguntas) {
        let linesHtml = '';
        atv.linhasBilhete.forEach((linha, lIdx) => {
            let wordsHtml = '';
            linha.palavras.forEach((pal, pIdx) => {
                if (pal.textoFixo) {
                    wordsHtml += `<span class="note-plain-word">${pal.textoFixo}</span>`;
                } else {
                    wordsHtml += `
                        <span class="note-word-unit">
                            ${pal.prefixo ? `<span class="note-word-part">${pal.prefixo}</span>` : ''}
                            <input type="text" 
                                   class="note-char-input ${isAlreadySolved ? 'correct' : ''}" 
                                   data-expected="${pal.expected}" 
                                   maxlength="1" 
                                   value="${isAlreadySolved ? pal.expected : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''} 
                                   placeholder=" " 
                                   autocomplete="off" 
                                   autocapitalize="characters"
                                   aria-label="Letra ${pal.expected}">
                            ${pal.sufixo ? `<span class="note-word-part">${pal.sufixo}</span>` : ''}
                        </span>
                    `;
                }
            });
            linesHtml += `<div class="note-sheet-line">${wordsHtml}</div>`;
        });

        const shuffledLetters = [...(atv.bancoLetras || [])];
        for (let i = shuffledLetters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledLetters[i], shuffledLetters[j]] = [shuffledLetters[j], shuffledLetters[i]];
        }

        let letterBankChips = shuffledLetters.map((letter, idx) => `
            <button type="button" class="note-bank-chip ${isAlreadySolved ? 'used' : ''}" data-letter="${letter}" data-chip-idx="${idx}" ${isAlreadySolved ? 'disabled' : ''}>${letter}</button>
        `).join('');

        let questionsHtml = '';
        atv.perguntas.forEach((q, qIdx) => {
            let optionsHtml = '';
            q.opcoes.forEach(opt => {
                const isSelected = isAlreadySolved && (opt.id === q.respostaCorreta);
                optionsHtml += `
                    <button type="button" 
                            class="btn-note-choice ${isSelected ? 'selected' : ''}" 
                            data-q-idx="${qIdx}" 
                            data-opt-id="${opt.id}" 
                            ${isAlreadySolved ? 'disabled' : ''}>
                        <span class="choice-checkbox-box"><i class="fa-solid fa-check"></i></span>
                        <span class="choice-text">${opt.texto}</span>
                    </button>
                `;
            });

            questionsHtml += `
                <div class="note-question-card" id="note-q-card-${atv.id}-${qIdx}" data-q-idx="${qIdx}" data-expected="${q.respostaCorreta}">
                    <h5 class="note-question-title">${q.enunciado}</h5>
                    <div class="note-options-list">
                        ${optionsHtml}
                    </div>
                    <input type="hidden" class="note-question-answer-val" id="note-ans-input-${atv.id}-${qIdx}" value="${isAlreadySolved ? q.respostaCorreta : ''}">
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="note-activity-container">
                <div class="detective-intro-banner">
                    <i class="fa-solid fa-magnifying-glass-location" style="color: var(--neon-amber);"></i>
                    <span>${atv.introTexto || 'O DETETIVE ENCONTROU UM BILHETE:'}</span>
                </div>

                <div class="detective-note-card">
                    <div class="note-stamp-header">
                        <div class="note-stamp-badge">
                            <i class="fa-solid fa-note-sticky"></i> BILHETE SECRETO RECOLHIDO NO LOCAL
                        </div>
                        <span class="note-stamp-date"><i class="fa-solid fa-lock"></i> Confidencial</span>
                    </div>

                    <div class="note-paper-sheet">
                        <div class="note-text-body">
                            ${linesHtml}
                        </div>
                    </div>

                    <div class="note-letter-bank-bar">
                        <span class="note-bank-label"><i class="fa-solid fa-keyboard"></i> Banco de Letras:</span>
                        <div class="note-bank-chips-row">
                            ${letterBankChips}
                        </div>
                    </div>
                </div>

                <div class="note-questions-container">
                    <h4 class="note-section-heading"><i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i> Perguntas de Compreensão Pericial:</h4>
                    <div class="note-questions-grid">
                        ${questionsHtml}
                    </div>
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-note-comprehension" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-file-circle-check"></i> ${isAlreadySolved ? 'Bilhete e Respostas Verificados com Sucesso ✅' : 'Verificar Bilhete e Respostas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 23 (PORTUGUÊS 11): CRUZADINHA SIMPLES / ADIVINHAS
    if (atv.tipo === 'cruzadinha_simples' && atv.itens) {
        let rowsHtml = '';
        atv.itens.forEach((item, itemIdx) => {
            let slotsHtml = '';
            const expectedLetters = item.palavraEsperada.split('');
            expectedLetters.forEach((char, cIdx) => {
                slotsHtml += `
                    <div class="crossword-slot-box">
                        <input type="text" 
                               class="crossword-cell-input ${isAlreadySolved ? 'correct' : ''}" 
                               data-item-idx="${itemIdx}" 
                               data-char-idx="${cIdx}" 
                               data-expected="${char}" 
                               maxlength="1" 
                               value="${isAlreadySolved ? char : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''} 
                               placeholder="_" 
                               autocomplete="off" 
                               autocapitalize="characters"
                               aria-label="Letra ${cIdx + 1} de ${item.pista}">
                    </div>
                `;
            });

            rowsHtml += `
                <div class="crossword-row-card" id="crossword-row-${atv.id}-${itemIdx}">
                    <div class="crossword-clue-side">
                        <span class="crossword-num-pill">#${item.numero}</span>
                        <div class="crossword-clue-text-box">
                            <strong>${item.pista}</strong>
                            <span class="crossword-len-indicator">${item.tamanho} letras</span>
                        </div>
                    </div>

                    <div class="crossword-slots-side">
                        <div class="crossword-slots-row">
                            ${slotsHtml}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="crossword-activity-container">
                <div class="crossword-rows-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-simple-crossword" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-pen-ruler"></i> ${isAlreadySolved ? 'Cruzadinha Verificada com Sucesso ✅' : 'Verificar Todas as Adivinhas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 24 (PORTUGUÊS 12): CRIPTOGRAMA NUMÉRICO (LETRAS POR NÚMEROS)
    if (atv.tipo === 'criptograma_numerico' && atv.tabelaCodigos && atv.palavrasTexto) {
        let keyPillsHtml = atv.tabelaCodigos.map(k => `
            <div class="crypto-key-item">
                <strong class="crypto-key-num">${k.numero}</strong>
                <span class="crypto-key-eq">=</span>
                <span class="crypto-key-letter">${k.letra}</span>
            </div>
        `).join('');

        let wordsHtml = '';
        atv.palavrasTexto.forEach((wObj, wIdx) => {
            let charsHtml = '';
            wObj.chars.forEach((cObj, cIdx) => {
                if (cObj.lacuna) {
                    charsHtml += `
                        <div class="crypto-char-unit gap-unit">
                            <input type="text" 
                                   class="crypto-char-input ${isAlreadySolved ? 'correct' : ''}" 
                                   data-code="${cObj.codigo}" 
                                   data-expected="${cObj.char}" 
                                   data-word-idx="${wIdx}" 
                                   data-char-idx="${cIdx}" 
                                   maxlength="1" 
                                   value="${isAlreadySolved ? cObj.char : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''} 
                                   placeholder="" 
                                   autocomplete="off" 
                                   autocapitalize="characters"
                                   aria-label="Letra para código ${cObj.codigo}">
                            <span class="crypto-num-tag">${cObj.codigo}</span>
                        </div>
                    `;
                } else {
                    charsHtml += `
                        <div class="crypto-char-unit fixed-unit">
                            <span class="crypto-fixed-char">${cObj.char}</span>
                            <span class="crypto-fixed-spacer"></span>
                        </div>
                    `;
                }
            });

            wordsHtml += `
                <div class="crypto-word-card">
                    ${charsHtml}
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="cryptogram-activity-container">
                <div class="crypto-key-tray">
                    <div class="crypto-key-tray-header">
                        <i class="fa-solid fa-key" style="color: var(--neon-amber);"></i>
                        <strong>Tabela de Decodificação Secreta:</strong>
                        <small>Cada número representa a respectiva letra abaixo</small>
                    </div>
                    <div class="crypto-key-badges-grid">
                        ${keyPillsHtml}
                    </div>
                </div>

                <div class="crypto-message-board">
                    <div class="crypto-message-header">
                        <i class="fa-solid fa-terminal" style="color: var(--neon-cyan);"></i>
                        <span>Relatório Pericial Decodificado em Tempo Real:</span>
                    </div>
                    <div class="crypto-words-flow">
                        ${wordsHtml}
                    </div>
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-cryptogram" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-lock-open"></i> ${isAlreadySolved ? 'Criptograma Decifrado com Sucesso ✅' : 'Verificar e Decifrar Mensagem Final'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 25: MUTAÇÃO DO H MÁGICO (DÍGRAFOS LH, NH, CH)
    if (atv.tipo === 'mutacao_h_magico' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it) => {
            let optionsHtml = it.opcoes.map(opt => `
                <button type="button" 
                        class="mutation-opt-btn ${isAlreadySolved && opt === it.palavraCorreta ? 'selected-correct' : ''}" 
                        data-item-id="${it.id}" 
                        data-word="${opt}" 
                        data-correct="${opt === it.palavraCorreta}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    ${opt}
                </button>
            `).join('');

            cardsHtml += `
                <div class="mutation-card" id="mutation-card-${atv.id}-${it.id}">
                    <div class="mutation-formula">
                        <span class="mutation-base-word">${it.palavraBase}</span>
                        <span class="mutation-plus">+</span>
                        <span class="mutation-badge-h">[ H ]</span>
                        <span class="mutation-arrow">➔</span>
                        <span class="mutation-target-slot" id="target-slot-${atv.id}-${it.id}">
                            ${isAlreadySolved ? `<strong class="solved-word">${it.emoji} ${it.palavraCorreta}</strong>` : '?'}
                        </span>
                    </div>
                    <div class="mutation-options-row">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="mutation-activity-container">
                <div class="mutation-cards-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-mutation" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-wand-magic-sparkles"></i> ${isAlreadySolved ? 'Mutações Verificadas com Sucesso ✅' : 'Verificar Transformações do H'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 26: COMPLETAR DÍGRAFOS COM BANCO (LH, NH, CH, RR, SS, GU, QU)
    if (atv.tipo === 'completar_digrafos_banco' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it) => {
            let pillsHtml = (it.opcoesDigrafos || ['LH', 'NH', 'CH', 'RR', 'SS', 'GU', 'QU']).map(dig => `
                <button type="button" 
                        class="digraph-pill-btn ${isAlreadySolved && dig === it.digrafoEsperado ? 'selected-correct' : ''}" 
                        data-item-id="${it.id}" 
                        data-digraph="${dig}" 
                        data-correct="${dig === it.digrafoEsperado}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    ${dig}
                </button>
            `).join('');

            cardsHtml += `
                <div class="digraph-word-card" id="digraph-card-${atv.id}-${it.id}">
                    <div class="digraph-word-display">
                        <span>${it.emoji}</span>
                        <span>${it.prefixo}</span>
                        <span class="digraph-slot-box ${isAlreadySolved ? 'filled correct' : ''}" id="digraph-slot-${atv.id}-${it.id}" data-item-id="${it.id}" data-expected="${it.digrafoEsperado}">
                            ${isAlreadySolved ? it.digrafoEsperado : '___'}
                        </span>
                        <span>${it.sufixo}</span>
                    </div>
                    <div class="digraph-pills-row">
                        ${pillsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="digraph-completion-container">
                <div class="digraph-words-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-digraphs" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-puzzle-piece"></i> ${isAlreadySolved ? 'Dígrafos Confirmados com Sucesso ✅' : 'Verificar Dígrafos Selecionados'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 27: IDENTIFICAR INTRUSO SILÁBICO
    if (atv.tipo === 'identificar_intruso_silabico' && atv.grupos) {
        let groupsHtml = '';
        atv.grupos.forEach((g) => {
            let chipsHtml = g.palavras.map(p => `
                <button type="button" 
                        class="intruso-word-chip ${isAlreadySolved && p.isIntruso ? 'intruso-caught' : ''}" 
                        data-group-id="${g.id}" 
                        data-word="${p.palavra}" 
                        data-is-intruso="${p.isIntruso}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    <span class="chip-text">${p.palavra}</span>
                    ${isAlreadySolved && p.isIntruso ? '<span class="intruso-tag">🚩 INTRUSO</span>' : ''}
                </button>
            `).join('');

            groupsHtml += `
                <div class="intruso-group-card" id="intruso-card-${atv.id}-${g.id}">
                    <div class="intruso-group-header">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-folder-open" style="color: var(--neon-amber);"></i>
                            <strong>${g.titulo}</strong>
                        </div>
                        <small class="intruso-group-rule">Regra da Evidência: ${g.regra}</small>
                    </div>
                    <div class="intruso-options-grid">
                        ${chipsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="intruso-activity-container">
                ${groupsHtml}
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-intruso" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-user-secret"></i> ${isAlreadySolved ? 'Intrusos Desmascarados ✅' : 'Verificar Intrusos Selecionados'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 28: ENIGMA DAS RIMAS PERICIAIS
    if (atv.tipo === 'enigma_rimas_periciais' && atv.itens) {
        let itemsHtml = '';
        atv.itens.forEach((item) => {
            let optionsHtml = item.opcoes.map(opt => `
                <button type="button" 
                        class="rhyme-opt-btn ${isAlreadySolved && opt.correta ? 'selected-correct' : ''}" 
                        data-item-id="${item.id}" 
                        data-is-correct="${opt.correta}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    <span class="opt-emoji">${opt.emoji}</span>
                    <span class="opt-word">${opt.palavra}</span>
                </button>
            `).join('');

            itemsHtml += `
                <div class="rhyme-clue-card" id="rhyme-card-${atv.id}-${item.id}">
                    <div class="rhyme-lead-box">
                        <span class="rhyme-emoji">${item.emoji}</span>
                        <div class="rhyme-lead-info">
                            <span class="rhyme-label" style="font-size: 0.8rem; color: var(--text-muted); display: block;">Evidência Chave:</span>
                            <strong class="rhyme-lead-word">${item.palavraGuia}</strong>
                        </div>
                        <div class="rhyme-sound-badge">Terminação: ${item.somFinal}</div>
                    </div>
                    <div class="rhyme-prompt-msg">Qual suspeito RIMA com <strong>${item.palavraGuia}</strong>?</div>
                    <div class="rhyme-options-grid">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="rhyme-activity-container">
                <div class="rhyme-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.1rem;">
                    ${itemsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-rhymes" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-music"></i> ${isAlreadySolved ? 'Rimas Periciais Confirmadas ✅' : 'Verificar Rimas Selecionadas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 29: ANAGRAMAS COM SÍLABAS COMPLEXAS
    if (atv.tipo === 'anagramas_silabicos' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, aIdx) => {
            let chipsHtml = it.letrasDesordenadas.map(l => `<span class="anagram-letter-chip">${l}</span>`).join('');
            let slotsHtml = it.palavraEsperada.split('').map((ch, cIdx) => `
                <input type="text" 
                       class="anagram-char-input ${isAlreadySolved ? 'correct' : ''}" 
                       data-item-id="${it.id}" 
                       data-char-idx="${cIdx}" 
                       data-expected="${ch}" 
                       maxlength="1" 
                       value="${isAlreadySolved ? ch : ''}" 
                       ${isAlreadySolved ? 'disabled' : ''} 
                       placeholder="_" 
                       autocomplete="off" 
                       autocapitalize="characters">
            `).join('');

            cardsHtml += `
                <div class="anagram-card" id="anagram-card-${atv.id}-${it.id}">
                    <div class="anagram-header">
                        <span class="anagram-case-badge"><i class="fa-solid fa-puzzle-piece"></i> ANAGRAMA #${aIdx + 1}</span>
                        ${it.dica ? `
                            <button type="button" class="btn-anagram-hint-toggle" data-target="anagram-hint-${atv.id}-${it.id}">
                                <i class="fa-regular fa-lightbulb"></i> Pista Secreta
                            </button>
                        ` : ''}
                    </div>
                    ${it.dica ? `
                        <div class="anagram-hidden-clue" id="anagram-hint-${atv.id}-${it.id}">
                            <span class="anagram-emoji">${it.emoji || '🔍'}</span>
                            <span class="anagram-clue-text"><strong>Dica:</strong> ${it.dica}</span>
                        </div>
                    ` : ''}
                    <div class="anagram-scrambled-tray">
                        <div class="anagram-tray-header">
                            <span class="tray-label"><i class="fa-solid fa-shuffle"></i> Letras Embaralhadas:</span>
                        </div>
                        <div class="anagram-chips-row">
                            ${chipsHtml}
                        </div>
                    </div>
                    <div class="anagram-slots-row">
                        ${slotsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="anagram-activity-container">
                <div class="anagram-cards-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-anagrams" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-spell-check"></i> ${isAlreadySolved ? 'Anagramas Decifrados ✅' : 'Verificar Anagramas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO 30: AUDITORIA ORTOGRÁFICA (DÍGRAFOS E GRAFIA CORRETA)
    if (atv.tipo === 'ortografia_pericial_digrafos' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it) => {
            let choicesHtml = it.opcoes.map(opt => `
                <button type="button" 
                        class="ortho-choice-btn ${isAlreadySolved && opt.correta ? 'selected-correct' : ''}" 
                        data-item-id="${it.id}" 
                        data-is-correct="${opt.correta}" 
                        ${isAlreadySolved ? 'disabled' : ''}>
                    <i class="fa-solid fa-file-signature"></i>
                    <span>${opt.palavra}</span>
                </button>
            `).join('');

            cardsHtml += `
                <div class="orthography-audit-card" id="ortho-card-${atv.id}-${it.id}">
                    <div class="ortho-card-header">
                        <span class="ortho-emoji">${it.emoji}</span>
                        <div class="ortho-header-text">
                            <strong>Evidência #${it.numero}: ${it.descricao}</strong>
                            <small>Selecione a grafia ortográfica oficial:</small>
                        </div>
                    </div>
                    <div class="ortho-choices-grid">
                        ${choicesHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="ortho-activity-container">
                <div class="ortho-cards-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1rem;">
                    <button type="button" class="btn-decode-action btn-verify-ortho" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-stamp"></i> ${isAlreadySolved ? 'Auditoria Concluída com Sucesso ✅' : 'Auditar e Confirmar Grafias'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: SOMA POR QUANTIDADES (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'soma_quantidades' && atv.linhas) {
        let rowsHtml = '';
        atv.linhas.forEach((linha, idx) => {
            let icons1Html = '';
            for (let i = 0; i < linha.card1.quantidade; i++) {
                icons1Html += `<span class="quant-item-icon" title="${linha.card1.nome}">${linha.card1.icone}</span>`;
            }
            let icons2Html = '';
            for (let i = 0; i < linha.card2.quantidade; i++) {
                icons2Html += `<span class="quant-item-icon" title="${linha.card2.nome}">${linha.card2.icone}</span>`;
            }

            rowsHtml += `
                <div class="quant-calc-row" id="quant-row-${atv.id}-${linha.id}">
                    <div class="quant-row-header">
                        <span class="quant-row-label"><i class="fa-solid fa-magnifying-glass"></i> ${linha.label}</span>
                    </div>
                    <div class="quant-calc-equation">
                        <!-- Card 1 com Quantidade 1 -->
                        <div class="quant-object-card" id="card1-${atv.id}-${linha.id}">
                            <div class="quant-icons-cluster">
                                ${icons1Html}
                            </div>
                            <div class="quant-card-footer">
                                <span class="quant-card-count-badge">${linha.card1.quantidade} ${linha.card1.nome}</span>
                            </div>
                        </div>

                        <!-- Sinal de + -->
                        <div class="quant-operator-badge operator-plus" title="Somar">
                            <i class="fa-solid fa-plus"></i>
                        </div>

                        <!-- Card 2 com Quantidade 2 -->
                        <div class="quant-object-card" id="card2-${atv.id}-${linha.id}">
                            <div class="quant-icons-cluster">
                                ${icons2Html}
                            </div>
                            <div class="quant-card-footer">
                                <span class="quant-card-count-badge">${linha.card2.quantidade} ${linha.card2.nome}</span>
                            </div>
                        </div>

                        <!-- Sinal de = -->
                        <div class="quant-operator-badge operator-equal" title="Igual a">
                            <i class="fa-solid fa-equals"></i>
                        </div>

                        <!-- Card de Resposta (Apenas Números) -->
                        <div class="quant-result-card" id="card-result-${atv.id}-${linha.id}">
                            <label class="quant-result-label">Total:</label>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="quant-answer-input" 
                                   data-line-id="${linha.id}" 
                                   data-expected="${linha.respostaEsperada}" 
                                   id="input-soma-${atv.id}-${linha.id}"
                                   placeholder="?" 
                                   maxlength="3" 
                                   value="${isAlreadySolved ? linha.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="quant-result-status-icon"></span>
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="quant-calc-activity-container">
                <div class="quant-rows-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-soma-quant" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Somas Auditadas com Sucesso ✅' : 'Verificar Somas por Quantidades'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: SUBTRAÇÃO POR QUANTIDADES (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'subtracao_quantidades' && atv.linhas) {
        let rowsHtml = '';
        atv.linhas.forEach((linha, idx) => {
            let icons1Html = '';
            for (let i = 0; i < linha.card1.quantidade; i++) {
                icons1Html += `<span class="quant-item-icon" title="${linha.card1.nome}">${linha.card1.icone}</span>`;
            }
            let icons2Html = '';
            for (let i = 0; i < linha.card2.quantidade; i++) {
                icons2Html += `<span class="quant-item-icon subtrair" title="Retirar ${linha.card2.nome}">${linha.card2.icone}</span>`;
            }

            rowsHtml += `
                <div class="quant-calc-row subtracao" id="quant-sub-row-${atv.id}-${linha.id}">
                    <div class="quant-row-header">
                        <span class="quant-row-label"><i class="fa-solid fa-file-lines"></i> ${linha.label}</span>
                    </div>
                    <div class="quant-calc-equation">
                        <!-- Card 1 com Quantidade Inicial -->
                        <div class="quant-object-card" id="card1-sub-${atv.id}-${linha.id}">
                            <div class="quant-icons-cluster">
                                ${icons1Html}
                            </div>
                            <div class="quant-card-footer">
                                <span class="quant-card-count-badge">${linha.card1.quantidade} ${linha.card1.nome}</span>
                            </div>
                        </div>

                        <!-- Sinal de - -->
                        <div class="quant-operator-badge operator-minus" title="Subtrair">
                            <i class="fa-solid fa-minus"></i>
                        </div>

                        <!-- Card 2 com Quantidade a Subtrair -->
                        <div class="quant-object-card card-subtraendo" id="card2-sub-${atv.id}-${linha.id}">
                            <div class="quant-icons-cluster">
                                ${icons2Html}
                            </div>
                            <div class="quant-card-footer">
                                <span class="quant-card-count-badge sub-badge">Retirar ${linha.card2.quantidade}</span>
                            </div>
                        </div>

                        <!-- Sinal de = -->
                        <div class="quant-operator-badge operator-equal" title="Igual a">
                            <i class="fa-solid fa-equals"></i>
                        </div>

                        <!-- Card de Resposta (Apenas Números) -->
                        <div class="quant-result-card" id="card-result-sub-${atv.id}-${linha.id}">
                            <label class="quant-result-label">Restam:</label>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="quant-answer-input quant-sub-input" 
                                   data-line-id="${linha.id}" 
                                   data-expected="${linha.respostaEsperada}" 
                                   id="input-sub-${atv.id}-${linha.id}"
                                   placeholder="?" 
                                   maxlength="3" 
                                   value="${isAlreadySolved ? linha.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="quant-result-status-icon"></span>
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="quant-calc-activity-container">
                <div class="quant-rows-list">
                    ${rowsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-sub-quant" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Subtrações Auditadas com Sucesso ✅' : 'Verificar Subtrações por Quantidades'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: ALGORITMO DA SOMA ("CONTA ARMADA" COM "SOBE 1") (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'algoritmo_soma' && atv.contas) {
        let boardsHtml = '';
        atv.contas.forEach((conta, cIdx) => {
            const ordens = conta.ordens || ['C', 'D', 'U'];
            
            // Cabeçalho de Ordens (C, D, U)
            let headerColsHtml = `<div class="alg-col-sign"></div>`;
            ordens.forEach(o => {
                const labelFull = o === 'C' ? 'Centena' : (o === 'D' ? 'Dezena' : 'Unidade');
                headerColsHtml += `<div class="alg-col-header" title="${labelFull}">${o}</div>`;
            });

            // Linha do "Sobe 1" (Transporte)
            let carryRowHtml = `<div class="alg-col-sign alg-carry-tag"><i class="fa-solid fa-arrow-up"></i> Sobe</div>`;
            ordens.forEach(o => {
                const expectedCarry = conta.vaiUm && conta.vaiUm[o] !== undefined && conta.vaiUm[o] !== null ? String(conta.vaiUm[o]) : '';
                carryRowHtml += `
                    <div class="alg-cell alg-carry-cell">
                        ${o !== 'U' ? `
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="alg-carry-input" 
                                   data-conta-id="${conta.id}" 
                                   data-ordem="${o}" 
                                   data-expected="${expectedCarry}" 
                                   id="carry-${atv.id}-${conta.id}-${o}"
                                   placeholder="0" 
                                   maxlength="1" 
                                   value="${isAlreadySolved ? (expectedCarry || '') : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   title="Se subir 1 para a ${o === 'C' ? 'Centena' : 'Dezena'}, anote 1 aqui"
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        ` : '<span class="alg-carry-placeholder">-</span>'}
                    </div>
                `;
            });

            // Linha Parcela 1
            let p1RowHtml = `<div class="alg-col-sign"></div>`;
            ordens.forEach(o => {
                const digit = (conta.parcela1 && conta.parcela1[o] !== undefined) ? conta.parcela1[o] : '';
                p1RowHtml += `<div class="alg-cell alg-digit-fixed">${digit !== '' ? digit : ''}</div>`;
            });

            // Linha Parcela 2 com sinal +
            let p2RowHtml = `<div class="alg-col-sign operator-plus"><i class="fa-solid fa-plus"></i></div>`;
            ordens.forEach(o => {
                const digit = (conta.parcela2 && conta.parcela2[o] !== undefined) ? conta.parcela2[o] : '';
                p2RowHtml += `<div class="alg-cell alg-digit-fixed">${digit !== '' ? digit : ''}</div>`;
            });

            // Linha de Resposta (Resultado)
            let resultRowHtml = `<div class="alg-col-sign operator-equals"><i class="fa-solid fa-equals"></i></div>`;
            ordens.forEach(o => {
                const expectedDigit = conta.resultadoEsperado && conta.resultadoEsperado[o] !== undefined ? String(conta.resultadoEsperado[o]) : '';
                resultRowHtml += `
                    <div class="alg-cell alg-result-cell">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="alg-result-input" 
                               data-conta-id="${conta.id}" 
                               data-ordem="${o}" 
                               data-expected="${expectedDigit}" 
                               id="res-soma-${atv.id}-${conta.id}-${o}"
                               placeholder="?" 
                               maxlength="1" 
                               value="${isAlreadySolved ? expectedDigit : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            });

            boardsHtml += `
                <div class="alg-board-card" id="alg-soma-board-${atv.id}-${conta.id}">
                    <div class="alg-board-title">
                        <span><i class="fa-solid fa-calculator"></i> ${conta.titulo}</span>
                    </div>
                    <div class="alg-vertical-table">
                        <div class="alg-table-row alg-header-row">${headerColsHtml}</div>
                        <div class="alg-table-row alg-carry-row">${carryRowHtml}</div>
                        <div class="alg-table-row alg-digit-row">${p1RowHtml}</div>
                        <div class="alg-table-row alg-digit-row">${p2RowHtml}</div>
                        <div class="alg-calc-divider"></div>
                        <div class="alg-table-row alg-result-row">${resultRowHtml}</div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="alg-activity-container">
                <div class="alg-boards-grid">
                    ${boardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-algoritmo-soma" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-circle-check"></i> ${isAlreadySolved ? 'Algoritmos da Soma Verificados com Sucesso ✅' : 'Verificar Algoritmos da Soma'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: ALGORITMO DA SUBTRAÇÃO ("CONTA ARMADA" COM TROCA/EMPRÉSTIMO) (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'algoritmo_subtracao' && atv.contas) {
        let boardsHtml = '';
        atv.contas.forEach((conta, cIdx) => {
            const ordens = conta.ordens || ['C', 'D', 'U'];
            
            // Cabeçalho de Ordens (C, D, U)
            let headerColsHtml = `<div class="alg-col-sign"></div>`;
            ordens.forEach(o => {
                const labelFull = o === 'C' ? 'Centena' : (o === 'D' ? 'Dezena' : 'Unidade');
                headerColsHtml += `<div class="alg-col-header" title="${labelFull}">${o}</div>`;
            });

            // Linha de Troca / Empréstimo (Anotação de corte/novo valor)
            let borrowRowHtml = `<div class="alg-col-sign alg-borrow-tag"><i class="fa-solid fa-arrows-rotate"></i> Troca</div>`;
            ordens.forEach(o => {
                const expectedBorrow = conta.trocas && conta.trocas[o] !== undefined && conta.trocas[o] !== null ? String(conta.trocas[o]) : '';
                borrowRowHtml += `
                    <div class="alg-cell alg-borrow-cell">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="alg-borrow-input" 
                               data-conta-id="${conta.id}" 
                               data-ordem="${o}" 
                               data-expected="${expectedBorrow}" 
                               id="borrow-${atv.id}-${conta.id}-${o}"
                               placeholder="${expectedBorrow ? '?' : '-'}" 
                               maxlength="2" 
                               value="${isAlreadySolved ? (expectedBorrow || '') : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               title="Se houver troca/empréstimo na coluna ${o}, anote o novo valor aqui"
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            });

            // Linha Minuendo
            let minuendoRowHtml = `<div class="alg-col-sign"></div>`;
            ordens.forEach(o => {
                const digit = (conta.minuendo && conta.minuendo[o] !== undefined) ? conta.minuendo[o] : '';
                const hasBorrow = conta.trocas && conta.trocas[o] !== undefined && conta.trocas[o] !== null;
                minuendoRowHtml += `
                    <div class="alg-cell alg-digit-fixed ${hasBorrow ? 'has-borrow-target' : ''}">
                        <span class="digit-val">${digit !== '' ? digit : ''}</span>
                    </div>
                `;
            });

            // Linha Subtraendo com sinal -
            let subtraendoRowHtml = `<div class="alg-col-sign operator-minus"><i class="fa-solid fa-minus"></i></div>`;
            ordens.forEach(o => {
                const digit = (conta.subtraendo && conta.subtraendo[o] !== undefined) ? conta.subtraendo[o] : '';
                subtraendoRowHtml += `<div class="alg-cell alg-digit-fixed">${digit !== '' ? digit : ''}</div>`;
            });

            // Linha de Resposta (Resultado)
            let resultRowHtml = `<div class="alg-col-sign operator-equals"><i class="fa-solid fa-equals"></i></div>`;
            ordens.forEach(o => {
                const expectedDigit = conta.resultadoEsperado && conta.resultadoEsperado[o] !== undefined ? String(conta.resultadoEsperado[o]) : '';
                resultRowHtml += `
                    <div class="alg-cell alg-result-cell">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="alg-result-input" 
                               data-conta-id="${conta.id}" 
                               data-ordem="${o}" 
                               data-expected="${expectedDigit}" 
                               id="res-sub-${atv.id}-${conta.id}-${o}"
                               placeholder="?" 
                               maxlength="1" 
                               value="${isAlreadySolved ? expectedDigit : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            });

            boardsHtml += `
                <div class="alg-board-card subtracao" id="alg-sub-board-${atv.id}-${conta.id}">
                    <div class="alg-board-title">
                        <span><i class="fa-solid fa-calculator"></i> ${conta.titulo}</span>
                    </div>
                    <div class="alg-vertical-table">
                        <div class="alg-table-row alg-header-row">${headerColsHtml}</div>
                        <div class="alg-table-row alg-borrow-row">${borrowRowHtml}</div>
                        <div class="alg-table-row alg-digit-row">${minuendoRowHtml}</div>
                        <div class="alg-table-row alg-digit-row">${subtraendoRowHtml}</div>
                        <div class="alg-calc-divider"></div>
                        <div class="alg-table-row alg-result-row">${resultRowHtml}</div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="alg-activity-container">
                <div class="alg-boards-grid">
                    ${boardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-algoritmo-sub" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-circle-check"></i> ${isAlreadySolved ? 'Algoritmos da Subtração Verificados com Sucesso ✅' : 'Verificar Algoritmos da Subtração'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: MULTIPLICAÇÃO POR PARCELAS IGUAIS (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'multiplicacao_parcelas_iguais' && atv.casos) {
        let casesHtml = '';
        atv.casos.forEach((caso, cIdx) => {
            let optionsHtml = '';
            caso.opcoes.forEach(opt => {
                const isCorrect = (opt.id === caso.respostaCorreta);
                let optClass = 'mult-option-btn';
                if (isAlreadySolved && isCorrect) {
                    optClass += ' selected-correct';
                }
                optionsHtml += `
                    <button type="button" 
                            class="${optClass}" 
                            data-activity-id="${atv.id}" 
                            data-case-id="${caso.id}" 
                            data-option-id="${opt.id}" 
                            ${isAlreadySolved ? 'disabled' : ''}>
                        <span>${opt.texto}</span>
                    </button>
                `;
            });

            casesHtml += `
                <div class="mult-case-card" id="mult-card-${atv.id}-${caso.id}">
                    <div class="mult-card-header">
                        <span class="mult-badge">${caso.titulo}</span>
                    </div>
                    <div class="mult-sum-banner">
                        <span class="sum-terms">${caso.expressaoSoma}</span>
                        <span class="sum-equals">=</span>
                        <span class="sum-total-badge">${caso.total}</span>
                    </div>
                    <div class="mult-card-prompt">
                        <i class="fa-solid fa-hand-pointer" style="color: var(--neon-cyan);"></i> Selecione a multiplicação equivalente:
                    </div>
                    <div class="mult-options-grid">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="mult-activity-container">
                <div class="mult-cases-grid">
                    ${casesHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-mult-parcelas" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-stamp"></i> ${isAlreadySolved ? 'Multiplicações Confirmadas com Sucesso ✅' : 'Verificar Multiplicações'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: ALGORITMO DA MULTIPLICAÇÃO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'algoritmo_multiplicacao' && atv.contas) {
        let boardsHtml = '';
        atv.contas.forEach((conta, cIdx) => {
            const hasParciais = conta.parciais && conta.parciais.length > 0;
            const maxDigits = Math.max(
                conta.multiplicando.length,
                conta.multiplicador.length,
                conta.resultadoEsperado.length,
                ...(hasParciais ? conta.parciais.map(p => p.valor.length) : [])
            );

            const padDigitRow = (str, opChar = '') => {
                let html = `<div class="alg-col-sign">${opChar}</div>`;
                const padCount = maxDigits - str.length;
                for (let i = 0; i < padCount; i++) {
                    html += `<div class="alg-cell empty"></div>`;
                }
                for (let i = 0; i < str.length; i++) {
                    html += `<div class="alg-cell alg-digit-fixed">${str[i]}</div>`;
                }
                return html;
            };

            // Linhas de "Sobe" (Transporte da Multiplicação)
            let sobeRowsHtml = '';
            if (conta.sobeLinhas && conta.sobeLinhas.length > 0) {
                conta.sobeLinhas.forEach((sl, slIdx) => {
                    const lineIndicator = conta.sobeLinhas.length > 1 ? `<span class="carry-sub">${slIdx + 1}</span>` : '';
                    let sRow = `<div class="alg-col-sign alg-carry-tag" title="${sl.label || 'Sobe'}"><i class="fa-solid fa-arrow-up"></i>${lineIndicator}</div>`;
                    const padCount = maxDigits - conta.multiplicando.length;
                    for (let i = 0; i < padCount; i++) {
                        sRow += `<div class="alg-cell empty"></div>`;
                    }
                    for (let i = 0; i < conta.multiplicando.length; i++) {
                        const expCarry = sl.carries && sl.carries[i] !== undefined && sl.carries[i] !== null ? String(sl.carries[i]) : '';
                        if (expCarry !== '') {
                            sRow += `
                                <div class="alg-cell alg-carry-cell">
                                    <input type="text" 
                                           inputmode="numeric" 
                                           pattern="[0-9]*" 
                                           class="alg-mult-carry-input" 
                                           data-conta-id="${conta.id}" 
                                           data-sobe-idx="${slIdx}" 
                                           data-col-idx="${i}" 
                                           data-expected="${expCarry}" 
                                           id="mcarry-${atv.id}-${conta.id}-${slIdx}-${i}" 
                                           placeholder="?" 
                                           maxlength="1" 
                                           value="${isAlreadySolved ? expCarry : ''}" 
                                           ${isAlreadySolved ? 'disabled' : ''}
                                           title="Sobe para esta coluna: digite o transporte" 
                                           oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                </div>
                            `;
                        } else {
                            sRow += `<div class="alg-cell alg-carry-cell"><span class="alg-carry-placeholder">-</span></div>`;
                        }
                    }
                    sobeRowsHtml += `<div class="alg-table-row alg-carry-row mult-carry-row">${sRow}</div>`;
                });
            }

            const multiplicandoRow = padDigitRow(conta.multiplicando, '');
            const multiplicadorRow = padDigitRow(conta.multiplicador, '<i class="fa-solid fa-xmark"></i>');

            let parciaisHtml = '';
            if (hasParciais) {
                conta.parciais.forEach((parcial, pIdx) => {
                    let pRow = `<div class="alg-col-sign alg-partial-tag" title="${parcial.label}">${pIdx === conta.parciais.length - 1 ? '<i class="fa-solid fa-plus"></i>' : ''}</div>`;
                    const padCount = maxDigits - parcial.valor.length;
                    for (let i = 0; i < padCount; i++) {
                        pRow += `<div class="alg-cell empty"></div>`;
                    }
                    for (let i = 0; i < parcial.valor.length; i++) {
                        const expChar = parcial.valor[i];
                        pRow += `
                            <div class="alg-cell alg-input-cell">
                                <input type="text" 
                                       inputmode="numeric" 
                                       pattern="[0-9]*" 
                                       class="alg-partial-input" 
                                       data-conta-id="${conta.id}" 
                                       data-partial-idx="${pIdx}" 
                                       data-digit-idx="${i}" 
                                       data-expected="${expChar}" 
                                       id="part-${atv.id}-${conta.id}-${pIdx}-${i}" 
                                       placeholder="?" 
                                       maxlength="1" 
                                       value="${isAlreadySolved ? expChar : ''}" 
                                       ${isAlreadySolved ? 'disabled' : ''}
                                       oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            </div>
                        `;
                    }
                    parciaisHtml += `<div class="alg-table-row alg-partial-row">${pRow}</div>`;
                });
            }

            let resRow = `<div class="alg-col-sign operator-equals"><i class="fa-solid fa-equals"></i></div>`;
            const resPad = maxDigits - conta.resultadoEsperado.length;
            for (let i = 0; i < resPad; i++) {
                resRow += `<div class="alg-cell empty"></div>`;
            }
            for (let i = 0; i < conta.resultadoEsperado.length; i++) {
                const expChar = conta.resultadoEsperado[i];
                resRow += `
                    <div class="alg-cell alg-result-cell">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="alg-mult-result-input" 
                               data-conta-id="${conta.id}" 
                               data-digit-idx="${i}" 
                               data-expected="${expChar}" 
                               id="res-mult-${atv.id}-${conta.id}-${i}" 
                               placeholder="?" 
                               maxlength="1" 
                               value="${isAlreadySolved ? expChar : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            }

            boardsHtml += `
                <div class="alg-board-card multiplicacao" id="alg-mult-board-${atv.id}-${conta.id}">
                    <div class="alg-board-title">
                        <span><i class="fa-solid fa-xmark" style="color: var(--neon-amber);"></i> ${conta.titulo}</span>
                    </div>
                    <div class="alg-vertical-table mult-table">
                        ${sobeRowsHtml}
                        <div class="alg-table-row alg-digit-row">${multiplicandoRow}</div>
                        <div class="alg-table-row alg-digit-row">${multiplicadorRow}</div>
                        <div class="alg-calc-divider"></div>
                        ${hasParciais ? `
                            ${parciaisHtml}
                            <div class="alg-calc-divider parcial-divider"></div>
                        ` : ''}
                        <div class="alg-table-row alg-result-row">${resRow}</div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="alg-activity-container">
                <div class="alg-boards-grid">
                    ${boardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-algoritmo-mult" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-circle-check"></i> ${isAlreadySolved ? 'Algoritmos da Multiplicação Verificados ✅' : 'Verificar Algoritmos da Multiplicação'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: SOMA COM PARCELA FALTANDO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'soma_parcela_faltando' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, idx) => {
            const isP1Missing = (it.posicaoFaltando === 'parcela1');
            cardsHtml += `
                <div class="missing-term-card" id="missing-card-${atv.id}-${it.id}">
                    <div class="missing-term-badge">Desafio #${idx + 1}</div>
                    <div class="missing-equation-row">
                        ${isP1Missing ? `
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-term-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-spf-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="4" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="missing-op">+</span>
                            <span class="missing-val-fixed">${it.parcela2}</span>
                        ` : `
                            <span class="missing-val-fixed">${it.parcela1}</span>
                            <span class="missing-op">+</span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-term-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-spf-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="4" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        `}
                        <span class="missing-equals">=</span>
                        <span class="missing-total-badge">${it.total}</span>
                        <span class="missing-status-icon"></span>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="missing-terms-activity-container">
                <div class="missing-terms-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-soma-faltando" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Parcelas Verificadas com Sucesso ✅' : 'Verificar Parcelas Ocultas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: SUBTRAÇÃO COM NÚMERO FALTANDO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'subtracao_numero_faltando' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, idx) => {
            const isMinuendoMissing = (it.tipoFaltando === 'minuendo');
            cardsHtml += `
                <div class="missing-term-card subtracao" id="missing-sub-card-${atv.id}-${it.id}">
                    <div class="missing-term-badge subtracao">Desafio #${idx + 1}</div>
                    <div class="missing-equation-row">
                        ${isMinuendoMissing ? `
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-sub-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-snf-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="4" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="missing-op minus">-</span>
                            <span class="missing-val-fixed">${it.subtraendo}</span>
                        ` : `
                            <span class="missing-val-fixed">${it.minuendo}</span>
                            <span class="missing-op minus">-</span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-sub-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-snf-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="4" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        `}
                        <span class="missing-equals">=</span>
                        <span class="missing-total-badge subtracao">${it.resto}</span>
                        <span class="missing-status-icon"></span>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="missing-terms-activity-container">
                <div class="missing-terms-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-sub-faltando" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Subtrações Verificadas com Sucesso ✅' : 'Verificar Números Ocultos'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: TABUADAS VERTICAIS DO 1 AO 10 (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'tabuadas_verticais' && atv.tabuadas) {
        let navPillsHtml = '';
        let panelsHtml = '';

        atv.tabuadas.forEach((tab, tIdx) => {
            navPillsHtml += `
                <button type="button" class="tabuada-pill-btn ${tIdx === 0 ? 'active' : ''}" data-base="${tab.base}" data-activity-id="${atv.id}">
                    <span>${tab.base}</span>
                </button>
            `;

            let rowsHtml = '';
            for (let i = 1; i <= 10; i++) {
                const expectedProd = tab.base * i;
                rowsHtml += `
                    <div class="tabuada-vert-row" id="t-row-${atv.id}-${tab.base}-${i}">
                        <span class="tabuada-factor">${tab.base}</span>
                        <span class="tabuada-times">×</span>
                        <span class="tabuada-mult-factor">${i}</span>
                        <span class="tabuada-equal">=</span>
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="tabuada-cell-input" 
                               data-base="${tab.base}" 
                               data-factor="${i}" 
                               data-expected="${expectedProd}" 
                               id="tab-in-${atv.id}-${tab.base}-${i}"
                               placeholder="?" 
                               maxlength="3" 
                               value="${isAlreadySolved ? expectedProd : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            }

            panelsHtml += `
                <div class="tabuada-panel ${tIdx === 0 ? 'active' : ''}" id="tabuada-panel-${atv.id}-${tab.base}">
                    <div class="tabuada-panel-header">
                        <span class="tabuada-panel-title"><i class="fa-solid fa-book-bookmark"></i> ${tab.titulo}</span>
                        <span class="tabuada-panel-counter" id="tab-counter-${atv.id}-${tab.base}">0 / 10 completados</span>
                    </div>
                    <div class="tabuada-vert-list">
                        ${rowsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="tabuadas-activity-container">
                <div class="tabuadas-nav-bar">
                    <span class="tabuadas-nav-label"><i class="fa-solid fa-list-ol"></i> Selecione a Tabuada:</span>
                    <div class="tabuadas-pills-row">
                        ${navPillsHtml}
                    </div>
                </div>
                <div class="tabuadas-panels-container">
                    ${panelsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-tabuadas" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-calculator"></i> ${isAlreadySolved ? 'Todas as 10 Tabuadas Verificadas ✅' : 'Verificar Todas as Tabuadas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: FATOR FALTANDO NA MULTIPLICAÇÃO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'fator_faltando' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, idx) => {
            const isF1Missing = (it.fator1 === null);
            cardsHtml += `
                <div class="missing-term-card mult-factor" id="factor-card-${atv.id}-${it.id}">
                    <div class="missing-term-badge mult-factor">Fator Secreto #${idx + 1}</div>
                    <div class="missing-equation-row">
                        ${isF1Missing ? `
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-factor-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-ff-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="2" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="missing-op mult">×</span>
                            <span class="missing-val-fixed">${it.fator2}</span>
                        ` : `
                            <span class="missing-val-fixed">${it.fator1}</span>
                            <span class="missing-op mult">×</span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="missing-factor-input" 
                                   data-expected="${it.respostaEsperada}" 
                                   id="input-ff-${atv.id}-${it.id}"
                                   placeholder="?" 
                                   maxlength="2" 
                                   value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        `}
                        <span class="missing-equals">=</span>
                        <span class="missing-total-badge mult-factor">${it.produto}</span>
                        <span class="missing-status-icon"></span>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="missing-terms-activity-container">
                <div class="missing-terms-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-fator-faltando" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-key"></i> ${isAlreadySolved ? 'Fatores Ocultos Decifrados ✅' : 'Verificar Fatores da Multiplicação'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: SITUAÇÕES-PROBLEMA DAS 3 OPERAÇÕES (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'situacoes_problema_operacoes' && atv.casos) {
        let casesHtml = '';
        atv.casos.forEach((c, idx) => {
            casesHtml += `
                <div class="prob-case-card" id="prob-card-${atv.id}-${c.id}">
                    <div class="prob-case-header">
                        <span class="prob-case-badge">${c.titulo}</span>
                        <span class="prob-op-tag ${c.operacao.toLowerCase()}">${c.operacao}</span>
                    </div>
                    <div class="prob-case-body">
                        <p class="prob-case-text"><i class="fa-solid fa-clipboard-question prob-icon"></i> ${c.texto}</p>
                        <div class="prob-calc-row">
                            <span class="prob-calc-prompt"><i class="fa-solid fa-calculator"></i> Cálculo:</span>
                            <span class="prob-calc-hint">${c.expressaoDica} = </span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="prob-case-input" 
                                   data-expected="${c.respostaEsperada}" 
                                   id="input-prob-${atv.id}-${c.id}"
                                   placeholder="Resultado" 
                                   value="${isAlreadySolved ? c.respostaEsperada : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="prob-unit-label">${c.unidade}</span>
                            <span class="prob-status-icon"></span>
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="prob-activity-container">
                <div class="prob-cases-grid">
                    ${casesHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-situacoes-problema" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-clipboard-check"></i> ${isAlreadySolved ? 'Casos Resolvidos com Sucesso ✅' : 'Verificar Resoluções dos Casos'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: PIRÂMIDE NUMÉRICA (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'piramide_numerica' && atv.piramides) {
        let pyramidsHtml = '';
        atv.piramides.forEach((pyr, idx) => {
            let levelsHtml = '';
            pyr.niveis.forEach((lvl, lvlIdx) => {
                let bricksHtml = '';
                lvl.forEach(b => {
                    if (b.readonly) {
                        bricksHtml += `
                            <div class="pyr-brick pyr-brick-fixed">
                                <span>${b.valor}</span>
                            </div>
                        `;
                    } else {
                        bricksHtml += `
                            <div class="pyr-brick pyr-brick-input-wrap">
                                <input type="text" 
                                       inputmode="numeric" 
                                       pattern="[0-9]*" 
                                       class="pyr-brick-input" 
                                       data-expected="${b.respostaEsperada}" 
                                       id="pyr-input-${atv.id}-${b.id}"
                                       placeholder="?" 
                                       maxlength="4" 
                                       value="${isAlreadySolved ? b.respostaEsperada : ''}" 
                                       ${isAlreadySolved ? 'disabled' : ''}
                                       oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            </div>
                        `;
                    }
                });
                levelsHtml += `<div class="pyr-level-row level-${lvlIdx}">${bricksHtml}</div>`;
            });

            pyramidsHtml += `
                <div class="pyr-card" id="pyr-card-${atv.id}-${pyr.id}">
                    <div class="pyr-card-header">
                        <span class="pyr-badge">${pyr.titulo}</span>
                    </div>
                    <div class="pyr-bricks-container">
                        ${levelsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="pyr-activity-container">
                <div class="pyr-cards-grid">
                    ${pyramidsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-piramides" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-shapes"></i> ${isAlreadySolved ? 'Pirâmides Verificadas com Sucesso ✅' : 'Verificar Pirâmides Numéricas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: BALANÇA DE COMPARAÇÃO DE OPERAÇÕES (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'balanca_comparacao_operacoes' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, idx) => {
            cardsHtml += `
                <div class="balanca-card" id="balanca-card-${atv.id}-${it.id}">
                    <div class="balanca-header">
                        <span class="balanca-badge">Balança #${idx + 1}</span>
                    </div>
                    <div class="balanca-pan-row">
                        <div class="balanca-pan pan-left">
                            <span class="pan-expr">${it.esq}</span>
                        </div>
                        <div class="balanca-selector" data-expected="${it.respostaEsperada}" id="balanca-sel-${atv.id}-${it.id}">
                            <button type="button" class="balanca-opt-btn ${isAlreadySolved && it.respostaEsperada === '<' ? 'selected selected-correct' : ''}" data-symbol="<" ${isAlreadySolved ? 'disabled' : ''}>&lt;</button>
                            <button type="button" class="balanca-opt-btn ${isAlreadySolved && it.respostaEsperada === '=' ? 'selected selected-correct' : ''}" data-symbol="=" ${isAlreadySolved ? 'disabled' : ''}>=</button>
                            <button type="button" class="balanca-opt-btn ${isAlreadySolved && it.respostaEsperada === '>' ? 'selected selected-correct' : ''}" data-symbol=">" ${isAlreadySolved ? 'disabled' : ''}>&gt;</button>
                        </div>
                        <div class="balanca-pan pan-right">
                            <span class="pan-expr">${it.dir}</span>
                        </div>
                        <span class="balanca-status-icon"></span>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="balanca-activity-container">
                <div class="balanca-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-balanca" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-scale-balanced"></i> ${isAlreadySolved ? 'Balanças Equilibradas com Sucesso ✅' : 'Verificar Balanças Forenses'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: TRILHA DA CADEIA OPERATÓRIA (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'cadeia_operatoria_trilha' && atv.trilhas) {
        let trailsHtml = '';
        atv.trilhas.forEach((tr, trIdx) => {
            let stepsHtml = '';
            tr.passos.forEach((p, pIdx) => {
                stepsHtml += `
                    <div class="trilha-step-arrow">
                        <span class="trilha-op-badge">${p.labelOp}</span>
                        <i class="fa-solid fa-arrow-right-long trilha-arrow-icon"></i>
                    </div>
                    <div class="trilha-node trilha-step-node">
                        <span class="trilha-node-label">Posto ${pIdx + 1}</span>
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="trilha-step-input ${isAlreadySolved ? 'cell-correct' : ''}" 
                               data-expected="${p.respostaEsperada}" 
                               id="trilha-input-${atv.id}-${tr.id}-${pIdx}"
                               placeholder="?" 
                               maxlength="4" 
                               value="${isAlreadySolved ? p.respostaEsperada : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        <span class="trilha-step-status">${isAlreadySolved ? '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald); font-size: 0.85rem; margin-top: 3px;"></i>' : ''}</span>
                    </div>
                `;
            });

            trailsHtml += `
                <div class="trilha-card" id="trilha-card-${atv.id}-${tr.id}">
                    <div class="trilha-card-header">
                        <span class="trilha-badge"><i class="fa-solid fa-route"></i> ${tr.titulo}</span>
                    </div>
                    <div class="trilha-nodes-track">
                        <div class="trilha-node start-node">
                            <span class="trilha-node-label">Início</span>
                            <span class="trilha-node-value">${tr.valorInicial}</span>
                        </div>
                        ${stepsHtml}
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="trilha-activity-container">
                <div class="trilha-list">
                    ${trailsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-trilhas" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-shoe-prints"></i> ${isAlreadySolved ? 'Rotas Decifradas com Sucesso ✅' : 'Verificar Rotas Operatórias'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: DESCUBRA O SINAL DA OPERAÇÃO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'descubra_sinal_operacao' && atv.itens) {
        let cardsHtml = '';
        atv.itens.forEach((it, idx) => {
            cardsHtml += `
                <div class="sinal-card" id="sinal-card-${atv.id}-${it.id}">
                    <div class="sinal-header">
                        <span class="sinal-badge">Equação #${idx + 1}</span>
                    </div>
                    <div class="sinal-equation-row">
                        <span class="sinal-num">${it.num1}</span>
                        <div class="sinal-selector" data-expected="${it.respostaEsperada}" id="sinal-sel-${atv.id}-${it.id}">
                            <button type="button" class="sinal-opt-btn ${isAlreadySolved && it.respostaEsperada === '+' ? 'selected selected-correct' : ''}" data-op="+" ${isAlreadySolved ? 'disabled' : ''}>+</button>
                            <button type="button" class="sinal-opt-btn ${isAlreadySolved && it.respostaEsperada === '−' ? 'selected selected-correct' : ''}" data-op="−" ${isAlreadySolved ? 'disabled' : ''}>−</button>
                            <button type="button" class="sinal-opt-btn ${isAlreadySolved && it.respostaEsperada === '×' ? 'selected selected-correct' : ''}" data-op="×" ${isAlreadySolved ? 'disabled' : ''}>×</button>
                        </div>
                        <span class="sinal-num">${it.num2}</span>
                        <span class="sinal-equals">=</span>
                        <span class="sinal-result">${it.resultado}</span>
                        <span class="sinal-status-icon"></span>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="sinais-activity-container">
                <div class="sinais-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-sinais" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-spell-check"></i> ${isAlreadySolved ? 'Sinais Restaurados com Sucesso ✅' : 'Verificar Sinais da Operação'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: CÁLCULO MENTAL COM DEZENAS E CENTENAS (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'calculo_mental_exato' && atv.itens) {
        let itemsHtml = '';
        atv.itens.forEach((it, idx) => {
            itemsHtml += `
                <div class="cmental-card" id="cmental-card-${atv.id}-${it.id}">
                    <div class="cmental-badge">#${idx + 1}</div>
                    <div class="cmental-row">
                        <span class="cmental-expr">${it.expressao}</span>
                        <span class="cmental-equals">=</span>
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="cmental-input" 
                               data-expected="${it.respostaEsperada}" 
                               id="cmental-input-${atv.id}-${it.id}"
                               placeholder="?" 
                               maxlength="5" 
                               value="${isAlreadySolved ? it.respostaEsperada : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                        <span class="cmental-status-icon"></span>
                    </div>
                    <div class="cmental-hint-sub"><i class="fa-solid fa-lightbulb"></i> Pense: ${it.dicaRapida}</div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="cmental-activity-container">
                <div class="cmental-grid">
                    ${itemsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-calculo-mental" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-bolt"></i> ${isAlreadySolved ? 'Cálculos Mentais Validados ✅' : 'Verificar Cálculos Mentais'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: ADIÇÃO COM 3 PARCELAS (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'adicao_tres_parcelas' && atv.contas) {
        let boardsHtml = '';
        atv.contas.forEach((conta, cIdx) => {
            const carries = conta.carries || [null, null, null];
            const carryRow = `
                <div class="alg-cell alg-label-cell"></div>
                <div class="alg-cell">
                    ${carries[0] !== null ? `
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="alg-carry-input atp-carry" data-expected="${carries[0]}" maxlength="1" value="${isAlreadySolved ? carries[0] : ''}" ${isAlreadySolved ? 'disabled' : ''} oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    ` : ''}
                </div>
                <div class="alg-cell">
                    ${carries[1] !== null ? `
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="alg-carry-input atp-carry" data-expected="${carries[1]}" maxlength="1" value="${isAlreadySolved ? carries[1] : ''}" ${isAlreadySolved ? 'disabled' : ''} oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    ` : ''}
                </div>
                <div class="alg-cell"></div>
            `;

            let parcelRowsHtml = '';
            conta.parcelas.forEach((p, pIdx) => {
                const isLast = (pIdx === conta.parcelas.length - 1);
                const digits = p.padStart(3, ' ').split('');
                parcelRowsHtml += `
                    <div class="alg-table-row">
                        <div class="alg-cell alg-op-cell">${isLast ? '+' : ''}</div>
                        <div class="alg-cell alg-digit-fixed">${digits[0]}</div>
                        <div class="alg-cell alg-digit-fixed">${digits[1]}</div>
                        <div class="alg-cell alg-digit-fixed">${digits[2]}</div>
                    </div>
                `;
            });

            const resDigits = String(conta.resultadoEsperado).padStart(3, ' ').split('');
            let resRow = `<div class="alg-cell alg-label-cell"></div>`;
            resDigits.forEach((d, dIdx) => {
                resRow += `
                    <div class="alg-cell">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="alg-result-input atp-result" 
                               data-expected="${d.trim()}" 
                               maxlength="1" 
                               value="${isAlreadySolved ? d.trim() : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            });

            boardsHtml += `
                <div class="alg-board-card atp-board" id="atp-card-${atv.id}-${conta.id}">
                    <div class="alg-board-header">
                        <span class="alg-badge">${conta.titulo}</span>
                    </div>
                    <div class="alg-calc-table">
                        <div class="alg-col-headers">
                            <span class="alg-hdr-spacer"></span>
                            <span class="alg-col-hdr">C</span>
                            <span class="alg-col-hdr">D</span>
                            <span class="alg-col-hdr">U</span>
                        </div>
                        <div class="alg-table-row alg-carry-row">${carryRow}</div>
                        ${parcelRowsHtml}
                        <div class="alg-calc-divider"></div>
                        <div class="alg-table-row alg-result-row">${resRow}</div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="alg-activity-container">
                <div class="alg-boards-grid">
                    ${boardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-tres-parcelas" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-list-ol"></i> ${isAlreadySolved ? 'Somas de 3 Parcelas Verificadas ✅' : 'Verificar Somas de 3 Parcelas'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: MULTIPLICAÇÃO POR DECOMPOSIÇÃO (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'multiplicacao_decomposicao' && atv.casos) {
        let cardsHtml = '';
        atv.casos.forEach((c, idx) => {
            cardsHtml += `
                <div class="mdecomp-card" id="mdecomp-card-${atv.id}-${c.id}">
                    <div class="mdecomp-header">
                        <span class="mdecomp-badge">${c.titulo}</span>
                    </div>
                    <div class="mdecomp-main-op-banner">
                        <span class="mdecomp-main-op-text">${c.multiplicando} × ${c.multiplicador}</span>
                    </div>
                    <div class="mdecomp-decomp-banner">
                        <span class="mdecomp-decomp-text">Decomposição: (${c.dezena} + ${c.unidade}) × ${c.multiplicador}</span>
                    </div>
                    <div class="mdecomp-calc-row">
                        <div class="mdecomp-distrib-hint">(${c.dezena} × ${c.multiplicador}) + (${c.unidade} × ${c.multiplicador})</div>
                        <div class="mdecomp-inputs-inline">
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="mdecomp-input mdecomp-p1" 
                                   data-expected="${c.parcialDezenaEsperado}" 
                                   id="mdecomp-p1-${atv.id}-${c.id}"
                                   placeholder="${c.dezena}×${c.multiplicador}" 
                                   value="${isAlreadySolved ? c.parcialDezenaEsperado : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="mdecomp-op">+</span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="mdecomp-input mdecomp-p2" 
                                   data-expected="${c.parcialUnidadeEsperado}" 
                                   id="mdecomp-p2-${atv.id}-${c.id}"
                                   placeholder="${c.unidade}×${c.multiplicador}" 
                                   value="${isAlreadySolved ? c.parcialUnidadeEsperado : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="mdecomp-equals">=</span>
                            <input type="text" 
                                   inputmode="numeric" 
                                   pattern="[0-9]*" 
                                   class="mdecomp-input mdecomp-total" 
                                   data-expected="${c.totalEsperado}" 
                                   id="mdecomp-tot-${atv.id}-${c.id}"
                                   placeholder="Total" 
                                   value="${isAlreadySolved ? c.totalEsperado : ''}" 
                                   ${isAlreadySolved ? 'disabled' : ''}
                                   oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                            <span class="mdecomp-status-icon"></span>
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="mdecomp-activity-container">
                <div class="mdecomp-grid">
                    ${cardsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-decomp-mult" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-puzzle-piece"></i> ${isAlreadySolved ? 'Decomposições Verificadas ✅' : 'Verificar Multiplicações por Decomposição'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: CRUZADINHA OPERATÓRIA (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'cruzadinha_operacoes' && atv.grades) {
        let gridsHtml = '';
        atv.grades.forEach((gr, gIdx) => {
            const c = gr.celulas;

            const renderCell = (cell, idKey) => {
                if (!cell) return '<div class="cruz-empty-cell"></div>';
                if (cell.readonly) {
                    return `<div class="cruz-cell cruz-fixed">${cell.valor}</div>`;
                }
                return `
                    <div class="cruz-cell cruz-input-wrap">
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="cruz-input" 
                               data-expected="${cell.respostaEsperada}" 
                               id="cruz-${atv.id}-${gr.id}-${idKey}"
                               placeholder="?" 
                               maxlength="3" 
                               value="${isAlreadySolved ? cell.respostaEsperada : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                `;
            };

            gridsHtml += `
                <div class="cruz-card" id="cruz-card-${atv.id}-${gr.id}">
                    <div class="cruz-header">
                        <span class="cruz-badge">${gr.titulo}</span>
                    </div>
                    <div class="cruz-table">
                        <div class="cruz-row">
                            ${renderCell(c.a1, 'a1')}
                            <div class="cruz-op">${c.op1}</div>
                            ${renderCell(c.a2, 'a2')}
                            <div class="cruz-eq">${c.eq1}</div>
                            ${renderCell(c.a3, 'a3')}
                        </div>
                        <div class="cruz-row cruz-col-ops">
                            <div class="cruz-op">${c.opCol1}</div>
                            <div class="cruz-spacer"></div>
                            <div class="cruz-op">${c.opCol2}</div>
                            <div class="cruz-spacer"></div>
                            <div class="cruz-op">${c.opCol3}</div>
                        </div>
                        <div class="cruz-row">
                            ${renderCell(c.b1, 'b1')}
                            <div class="cruz-op">${c.op2}</div>
                            ${renderCell(c.b2, 'b2')}
                            <div class="cruz-eq">${c.eq2}</div>
                            ${renderCell(c.b3, 'b3')}
                        </div>
                        <div class="cruz-row cruz-col-eqs">
                            <div class="cruz-eq">${c.eqCol1}</div>
                            <div class="cruz-spacer"></div>
                            <div class="cruz-eq">${c.eqCol2}</div>
                            <div class="cruz-spacer"></div>
                            <div class="cruz-eq">${c.eqCol3}</div>
                        </div>
                        <div class="cruz-row">
                            ${renderCell(c.c1, 'c1')}
                            <div class="cruz-op">${c.op3}</div>
                            ${renderCell(c.c2, 'c2')}
                            <div class="cruz-eq">${c.eq3}</div>
                            ${renderCell(c.c3, 'c3')}
                        </div>
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="cruz-activity-container">
                <div class="cruz-grids-wrapper">
                    ${gridsHtml}
                </div>
                <div class="hundred-chart-actions" style="margin-top: 1.5rem;">
                    <button type="button" class="btn-decode-action btn-verify-cruzadinha" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-table-cells"></i> ${isAlreadySolved ? 'Cruzadinha Decifrada com Sucesso ✅' : 'Verificar Cruzadinha Operatória'}
                    </button>
                </div>
            </div>
        `;
    }

    // TIPO: O GRANDE COFRE FINAL (AULA 02 - MATEMÁTICA)
    if (atv.tipo === 'cofre_final_operacoes' && atv.pistas) {
        let dialsHtml = '';
        let cluesHtml = '';

        atv.pistas.forEach((p, idx) => {
            dialsHtml += `
                <div class="cofre-dial-slot" id="cofre-dial-${atv.id}-${idx}">
                    <span class="cofre-dial-num">#${idx + 1}</span>
                    <input type="text" 
                           inputmode="numeric" 
                           pattern="[0-9]*" 
                           class="cofre-dial-input" 
                           data-expected="${p.digitoEsperado}" 
                           data-dial-index="${idx}"
                           id="cofre-dial-input-${atv.id}-${idx}"
                           maxlength="1" 
                           placeholder="•" 
                           value="${isAlreadySolved ? p.digitoEsperado : ''}" 
                           ${isAlreadySolved ? 'disabled' : ''}
                           oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    <span class="cofre-dial-led"></span>
                </div>
            `;

            cluesHtml += `
                <div class="cofre-clue-card" id="cofre-clue-${atv.id}-${p.id}">
                    <div class="cofre-clue-hdr">
                        <span class="cofre-clue-badge"><i class="fa-solid fa-lock"></i> Trava #${idx + 1}: ${p.operacao}</span>
                        <span class="cofre-clue-status" id="clue-status-${atv.id}-${idx}"></span>
                    </div>
                    <p class="cofre-clue-text">${p.texto}</p>
                    <div class="cofre-clue-action-row">
                        <span class="cofre-clue-digit-prompt">Dígito da Trava #${idx + 1}:</span>
                        <input type="text" 
                               inputmode="numeric" 
                               pattern="[0-9]*" 
                               class="cofre-clue-input" 
                               data-expected="${p.digitoEsperado}" 
                               data-dial-index="${idx}"
                               id="cofre-clue-input-${atv.id}-${idx}"
                               maxlength="1" 
                               placeholder="?" 
                               value="${isAlreadySolved ? p.digitoEsperado : ''}" 
                               ${isAlreadySolved ? 'disabled' : ''}
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                    </div>
                </div>
            `;
        });

        inputSectionHtml = `
            <div class="cofre-final-container">
                <div class="cofre-vault-head">
                    <div class="cofre-vault-icon">
                        <i class="fa-solid fa-vault"></i>
                    </div>
                    <div class="cofre-vault-info">
                        <h3 class="cofre-vault-title">COFRE CENTRAL DA DELEGACIA</h3>
                        <p class="cofre-vault-sub">Insira a combinação de 5 dígitos para abrir o cofre pericial supremo!</p>
                    </div>
                </div>

                <div class="cofre-dials-panel">
                    <div class="cofre-dials-label"><i class="fa-solid fa-key"></i> COMBINAÇÃO SECRETA:</div>
                    <div class="cofre-dials-row">
                        ${dialsHtml}
                    </div>
                </div>

                <div class="cofre-clues-wrapper">
                    <h4 class="cofre-clues-section-title"><i class="fa-solid fa-magnifying-glass"></i> Pistas Operatórias para os 5 Dígitos:</h4>
                    <div class="cofre-clues-grid">
                        ${cluesHtml}
                    </div>
                </div>

                <div class="hundred-chart-actions" style="margin-top: 1.8rem;">
                    <button type="button" class="btn-decode-action btn-verify-cofre-final" data-activity-id="${atv.id}" ${isAlreadySolved ? 'disabled' : ''}>
                        <i class="fa-solid fa-unlock-keyhole"></i> ${isAlreadySolved ? 'Cofre Central Desbloqueado com Sucesso! 🏆' : 'Desativar Travas e Abrir o Cofre'}
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

    // Eventos de Alfabeto Lacunado (Língua Portuguesa)
    if (atv.tipo === 'alfabeto_lacunado') {
        const btnVerify = card.querySelector('.btn-verify-alphabet-grid');
        const inputs = card.querySelectorAll('.alphabet-cell-input');

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                if (input.value.length === 1 && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace' && input.value === '' && idx > 0) {
                    inputs[idx - 1].focus();
                }
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleAlphabetGridAnswerSubmit(atv, card);
        });
    }

    // Eventos de Vizinhos do Alfabeto (Língua Portuguesa)
    if (atv.tipo === 'vizinhos_alfabeto') {
        const btnVerify = card.querySelector('.btn-verify-letter-neighbors');
        const inputs = card.querySelectorAll('.letter-neighbor-input');

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                if (input.value.length === 1 && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace' && input.value === '' && idx > 0) {
                    inputs[idx - 1].focus();
                }
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleAlphabetNeighborsAnswerSubmit(atv, card);
        });
    }

    // Eventos de Completar Palavras com Desenho (Língua Portuguesa)
    if (atv.tipo === 'completar_palavras_desenho') {
        const btnVerify = card.querySelector('.btn-verify-complete-words');
        const inputs = card.querySelectorAll('.word-char-input');
        const wordCards = card.querySelectorAll('.word-completion-card');
        const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const validateWordCard = (wordCard) => {
            if (!wordCard) return;
            const wordInputs = wordCard.querySelectorAll('.word-char-input');
            if (wordInputs.length === 0) return;

            let allFilled = true;
            let allCorrect = true;

            wordInputs.forEach(inp => {
                const val = normalize(inp.value);
                const exp = normalize(inp.dataset.expected);
                if (!val) {
                    allFilled = false;
                    allCorrect = false;
                } else if (val !== exp) {
                    allCorrect = false;
                }
            });

            if (allFilled && allCorrect) {
                wordInputs.forEach(inp => {
                    inp.classList.remove('incorrect');
                    inp.classList.add('correct');
                });
                wordCard.classList.add('word-solved');
            } else {
                wordCard.classList.remove('word-solved');
                wordInputs.forEach(inp => {
                    const val = normalize(inp.value);
                    const exp = normalize(inp.dataset.expected);
                    if (!val) {
                        inp.classList.remove('correct', 'incorrect');
                    } else if (allFilled && !allCorrect) {
                        if (val === exp) {
                            inp.classList.add('correct');
                            inp.classList.remove('incorrect');
                        } else {
                            inp.classList.add('incorrect');
                            inp.classList.remove('correct');
                        }
                    } else {
                        inp.classList.remove('correct', 'incorrect');
                    }
                });
            }
        };

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                const wordCard = input.closest('.word-completion-card');
                validateWordCard(wordCard);

                if (input.value.length === 1 && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace') {
                    const wordCard = input.closest('.word-completion-card');
                    validateWordCard(wordCard);
                    if (input.value === '' && idx > 0) {
                        inputs[idx - 1].focus();
                    }
                }
            });
        });

        wordCards.forEach(wc => validateWordCard(wc));

        btnVerify?.addEventListener('click', () => {
            handleCompleteWordsAnswerSubmit(atv, card);
        });
    }

    // Eventos de Juntar Sílabas para Formar Palavras (Língua Portuguesa)
    if (atv.tipo === 'juntar_silabas_palavra') {
        const btnVerify = card.querySelector('.btn-verify-join-syllables');
        const builderCards = card.querySelectorAll('.syllable-builder-card');

        builderCards.forEach(bCard => {
            const itemIdx = parseInt(bCard.dataset.itemIdx, 10);
            const itemData = atv.itens[itemIdx];
            const chips = bCard.querySelectorAll('.syllable-chip-btn');
            const targetDisplay = bCard.querySelector('.syllable-target-display .syl-assembled-text');
            const btnClear = bCard.querySelector('.btn-clear-syllables');

            bCard._pickedSyllables = isAlreadySolved && itemData ? [...itemData.ordemCorreta] : [];

            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    if (isAlreadySolved || chip.classList.contains('used')) return;
                    soundManager.playClick();
                    chip.classList.add('used');
                    const syl = chip.dataset.syl;
                    bCard._pickedSyllables.push(syl);

                    if (targetDisplay) {
                        targetDisplay.innerHTML = bCard._pickedSyllables.map(s => `<span class="assembled-syl-badge">${s}</span>`).join('');
                    }
                });
            });

            btnClear?.addEventListener('click', () => {
                if (isAlreadySolved) return;
                soundManager.playClick();
                bCard._pickedSyllables = [];
                chips.forEach(c => c.classList.remove('used'));
                if (targetDisplay) {
                    targetDisplay.innerHTML = '<em class="syl-placeholder">Clique nas sílabas abaixo...</em>';
                }
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleJoinSyllablesAnswerSubmit(atv, card);
        });
    }

    // Eventos de Separar Sílabas (Língua Portuguesa)
    if (atv.tipo === 'separar_silabas') {
        const btnVerify = card.querySelector('.btn-verify-separate-syllables');
        const inputs = card.querySelectorAll('.syllable-split-input');
        const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        inputs.forEach((input, idx) => {
            const checkMatch = () => {
                input.value = input.value.toUpperCase();
                const val = normalize(input.value);
                const expected = normalize(input.dataset.expected);

                // Feedback em tempo real: contorno verde se a sílaba estiver correta
                if (val === expected && val.length > 0) {
                    input.classList.add('correct');
                    input.classList.remove('incorrect');
                } else {
                    input.classList.remove('correct');
                }
            };

            input.addEventListener('input', checkMatch);
            input.addEventListener('change', checkMatch);
            input.addEventListener('keyup', (e) => {
                checkMatch();
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace' && input.value === '' && idx > 0) {
                    inputs[idx - 1].focus();
                }
            });

            if (input.value) {
                checkMatch();
            }
        });

        btnVerify?.addEventListener('click', () => {
            handleSeparateSyllablesAnswerSubmit(atv, card);
        });
    }

    // Eventos de Banco de Sílabas (Português 6)
    if (atv.tipo === 'completar_silabas_banco') {
        const btnVerify = card.querySelector('.btn-verify-complete-syllables-bank');
        const inputs = card.querySelectorAll('.syl-bank-word-input');
        const wordCards = card.querySelectorAll('.syl-bank-word-card');
        const chips = card.querySelectorAll('.syl-bank-chip-btn');
        let activeWordIndex = 0;

        // Encontra o primeiro índice não preenchido
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].value.trim()) {
                activeWordIndex = i;
                break;
            }
        }

        const setActiveWord = (index, focusInput = true) => {
            if (index < 0 || index >= wordCards.length) return;
            activeWordIndex = index;
            wordCards.forEach((wCard, idx) => {
                wCard.classList.toggle('active-target-word', idx === activeWordIndex);
            });
            if (focusInput && inputs[activeWordIndex] && document.activeElement !== inputs[activeWordIndex]) {
                inputs[activeWordIndex].focus();
            }
        };

        const updateBankChipsState = () => {
            const usedSyllables = [];
            inputs.forEach(inp => {
                const val = inp.value.trim().toUpperCase();
                if (val) usedSyllables.push(val);
            });

            const usedCounts = {};
            usedSyllables.forEach(s => {
                usedCounts[s] = (usedCounts[s] || 0) + 1;
            });

            chips.forEach(chip => {
                const syl = chip.dataset.syl.toUpperCase();
                if (isAlreadySolved) {
                    chip.disabled = true;
                    chip.classList.add('used');
                } else if (usedCounts[syl] && usedCounts[syl] > 0) {
                    chip.disabled = true;
                    chip.classList.add('used');
                    usedCounts[syl]--;
                } else {
                    chip.disabled = false;
                    chip.classList.remove('used');
                }
            });
        };

        // Clique no cartão da palavra para defini-lo como alvo ativo
        wordCards.forEach((wCard, idx) => {
            wCard.addEventListener('click', () => {
                if (isAlreadySolved) return;
                setActiveWord(idx, true);
            });
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('focus', () => {
                setActiveWord(idx, false);
            });

            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                updateBankChipsState();
                if (input.value.length === parseInt(input.getAttribute('maxlength') || '2', 10)) {
                    // Avança para a próxima palavra vazia
                    let nextIdx = (idx + 1) % inputs.length;
                    for (let step = 1; step < inputs.length; step++) {
                        const checkIdx = (idx + step) % inputs.length;
                        if (!inputs[checkIdx].value.trim()) {
                            nextIdx = checkIdx;
                            break;
                        }
                    }
                    setActiveWord(nextIdx, true);
                }
            });

            input.addEventListener('change', () => {
                updateBankChipsState();
            });

            input.addEventListener('keyup', (e) => {
                updateBankChipsState();
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        setActiveWord(idx + 1, true);
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace' && input.value === '' && idx > 0) {
                    setActiveWord(idx - 1, true);
                }
            });
        });

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (isAlreadySolved || chip.classList.contains('used')) return;
                soundManager.playClick();
                const syl = chip.dataset.syl;

                // Coloca a sílaba na palavra atualmente em destaque
                const targetInput = inputs[activeWordIndex] || inputs[0];

                if (targetInput) {
                    targetInput.value = syl;
                    targetInput.classList.remove('incorrect', 'correct');
                    updateBankChipsState();

                    // Feedback sutil no cartão preenchido
                    const curCard = wordCards[activeWordIndex];
                    if (curCard) {
                        curCard.classList.add('just-filled');
                        setTimeout(() => curCard.classList.remove('just-filled'), 300);
                    }

                    // Encontra a próxima palavra a preencher
                    let nextIdx = (activeWordIndex + 1) % inputs.length;
                    for (let step = 1; step < inputs.length; step++) {
                        const checkIdx = (activeWordIndex + step) % inputs.length;
                        if (!inputs[checkIdx].value.trim()) {
                            nextIdx = checkIdx;
                            break;
                        }
                    }
                    setActiveWord(nextIdx, true);
                }
            });
        });

        // Inicializa o estado dos chips e ativa a primeira palavra
        updateBankChipsState();
        if (!isAlreadySolved) {
            setActiveWord(activeWordIndex, false);
        }

        btnVerify?.addEventListener('click', () => {
            handleCompleteSyllablesBankAnswerSubmit(atv, card);
        });
    }

    // Eventos de Sílaba Fixa (Português 7)
    if (atv.tipo === 'formar_com_silaba_fixa') {
        const btnVerify = card.querySelector('.btn-verify-fixed-syllables');
        const cardsList = card.querySelectorAll('.fixed-syl-card');

        cardsList.forEach(fCard => {
            const itemIdx = parseInt(fCard.dataset.itemIdx, 10);
            const itemData = atv.itens[itemIdx];
            const optButtons = fCard.querySelectorAll('.btn-fixed-syl-option');
            const previewTrayChips = fCard.querySelector('.preview-tray-chips');

            const updatePreviews = () => {
                const selectedButtons = fCard.querySelectorAll('.btn-fixed-syl-option.selected');
                if (selectedButtons.length === 0) {
                    if (previewTrayChips) previewTrayChips.innerHTML = '<em class="empty-tray-msg">Nenhuma sílaba selecionada ainda...</em>';
                    return;
                }
                let chipsHtml = '';
                selectedButtons.forEach(btn => {
                    const syl = btn.dataset.silaba;
                    const fullWord = itemData.silabaFixa + syl;
                    chipsHtml += `<span class="formed-word-pill"><i class="fa-solid fa-sparkles"></i> ${fullWord}</span>`;
                });
                if (previewTrayChips) previewTrayChips.innerHTML = chipsHtml;
            };

            optButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (isAlreadySolved) return;
                    soundManager.playClick();
                    btn.classList.toggle('selected');
                    fCard.classList.remove('fixed-card-wrong', 'fixed-card-correct');
                    updatePreviews();
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleFixedSyllableAnswerSubmit(atv, card);
        });
    }

    // Eventos de Classificação de Sílabas (Português 8)
    if (atv.tipo === 'classificar_contagem_silabas') {
        const btnVerify = card.querySelector('.btn-verify-syllable-count');
        const btnReset = card.querySelector(`#btn-reset-classifier-${atv.id}`);
        const bankContainer = card.querySelector(`#bank-chips-${atv.id}`);
        const wordChips = card.querySelectorAll('.classifier-word-chip');
        const drawers = card.querySelectorAll('.classifier-drawer');

        card._classifierState = {
            selectedWordId: null,
            placements: {} // wordId -> catId
        };

        if (isAlreadySolved) {
            atv.palavras.forEach(w => {
                card._classifierState.placements[w.id] = w.categoriaCorreta;
            });
        }

        const updateDrawersUI = () => {
            const placements = card._classifierState.placements;

            // Atualiza chips do banco
            wordChips.forEach(chip => {
                const wId = chip.dataset.wordId;
                const isPlaced = Boolean(placements[wId]);
                chip.style.display = isPlaced ? 'none' : 'inline-flex';
                chip.classList.toggle('selected-word', card._classifierState.selectedWordId === wId);
            });

            // Verifica se todas do banco foram colocadas
            const unplacedCount = atv.palavras.filter(w => !placements[w.id]).length;
            if (bankContainer) {
                if (unplacedCount === 0) {
                    bankContainer.innerHTML = '<em class="all-placed-msg"><i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i> Todas as 12 evidências foram distribuídas nas gavetas!</em>';
                } else if (!bankContainer.querySelector('.classifier-word-chip')) {
                    // Restaura chips no container se necessário
                    bankContainer.innerHTML = '';
                    wordChips.forEach(chip => bankContainer.appendChild(chip));
                }
            }

            // Atualiza gavetas
            atv.categorias.forEach(cat => {
                const dropzone = card.querySelector(`#dropzone-${atv.id}-${cat.id}`);
                const countBadge = card.querySelector(`#count-badge-${atv.id}-${cat.id}`);
                const wordsInCat = atv.palavras.filter(w => placements[w.id] === cat.id);

                if (countBadge) countBadge.textContent = wordsInCat.length;

                if (dropzone) {
                    if (wordsInCat.length === 0) {
                        dropzone.innerHTML = '<em class="dropzone-empty-hint">Clique aqui para arquivar a palavra selecionada</em>';
                    } else {
                        dropzone.innerHTML = wordsInCat.map(w => `
                            <button type="button" class="placed-word-pill ${isAlreadySolved ? 'correct' : ''}" data-word-id="${w.id}" ${isAlreadySolved ? 'disabled' : ''} title="Clique para devolver ao banco">
                                <span>${w.palavra}</span>
                                ${!isAlreadySolved ? '<i class="fa-solid fa-xmark"></i>' : ''}
                            </button>
                        `).join('');

                        // Eventos para devolver ao banco
                        dropzone.querySelectorAll('.placed-word-pill').forEach(pill => {
                            pill.addEventListener('click', (e) => {
                                e.stopPropagation();
                                if (isAlreadySolved) return;
                                soundManager.playClick();
                                const wId = pill.dataset.wordId;
                                delete card._classifierState.placements[wId];
                                updateDrawersUI();
                            });
                        });
                    }
                }
            });
        };

        // Clique em palavra do banco para selecionar
        wordChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (isAlreadySolved) return;
                soundManager.playClick();
                const wId = chip.dataset.wordId;
                if (card._classifierState.selectedWordId === wId) {
                    card._classifierState.selectedWordId = null;
                } else {
                    card._classifierState.selectedWordId = wId;
                }
                updateDrawersUI();
            });
        });

        // Clique na gaveta para alocar palavra selecionada
        drawers.forEach(drawer => {
            drawer.addEventListener('click', () => {
                if (isAlreadySolved) return;
                const catId = drawer.dataset.catId;
                const selectedWId = card._classifierState.selectedWordId;
                if (!selectedWId) return;

                soundManager.playClick();
                card._classifierState.placements[selectedWId] = catId;
                card._classifierState.selectedWordId = null;
                updateDrawersUI();
            });
        });

        // Botão de Limpar Tudo
        btnReset?.addEventListener('click', () => {
            if (isAlreadySolved) return;
            soundManager.playClick();
            card._classifierState.placements = {};
            card._classifierState.selectedWordId = null;
            if (bankContainer) {
                bankContainer.innerHTML = '';
                wordChips.forEach(chip => {
                    chip.style.display = 'inline-flex';
                    chip.classList.remove('selected-word');
                    bankContainer.appendChild(chip);
                });
            }
            updateDrawersUI();
        });

        btnVerify?.addEventListener('click', () => {
            handleSyllableCountClassifyAnswerSubmit(atv, card);
        });
    }

    // Eventos de Caça-Palavras (Português 9)
    if (atv.tipo === 'caca_palavras') {
        const btnVerify = card.querySelector('.btn-verify-wordsearch');
        const btnClear = card.querySelector(`#btn-clear-ws-${atv.id}`);
        const gridCells = card.querySelectorAll('.ws-grid-cell');
        const selectionDisplay = card.querySelector(`#ws-selection-display-${atv.id}`);

        card._wsState = {
            currentCoords: [], // array de [r, c]
            currentWordString: '',
            foundWords: isAlreadySolved ? atv.palavras.map(p => p.palavra) : []
        };

        const updateSelectionDisplay = () => {
            if (selectionDisplay) {
                if (card._wsState.currentCoords.length === 0) {
                    selectionDisplay.innerHTML = '<em>Clique nas letras em sequência</em>';
                } else {
                    const letters = card._wsState.currentCoords.map(([r, c]) => {
                        const cell = card.querySelector(`.ws-grid-cell[data-row="${r}"][data-col="${c}"]`);
                        return cell ? cell.dataset.char : '';
                    }).join('');
                    selectionDisplay.innerHTML = `<strong class="active-letters-badge">${letters}</strong>`;
                }
            }
        };

        const checkFormedWord = () => {
            const currentStr = card._wsState.currentCoords.map(([r, c]) => {
                const cell = card.querySelector(`.ws-grid-cell[data-row="${r}"][data-col="${c}"]`);
                return cell ? cell.dataset.char : '';
            }).join('');

            const reversedStr = currentStr.split('').reverse().join('');

            // Procura se corresponde a alguma palavra pendente
            for (const p of atv.palavras) {
                if (card._wsState.foundWords.includes(p.palavra)) continue;

                if (currentStr === p.palavra || reversedStr === p.palavra) {
                    // Palavra encontrada!
                    soundManager.playSuccess();
                    card._wsState.foundWords.push(p.palavra);

                    // Destaca as células permanentemente com a cor da palavra
                    card._wsState.currentCoords.forEach(([r, c]) => {
                        const cell = card.querySelector(`.ws-grid-cell[data-row="${r}"][data-col="${c}"]`);
                        if (cell) {
                            cell.classList.add('found-cell');
                            cell.classList.remove('selected-active');
                            cell.style.background = `${p.cor}35`;
                            cell.style.borderColor = p.cor;
                            cell.style.boxShadow = `0 0 12px ${p.cor}88`;
                        }
                    });

                    // Marca no ledger
                    const targetBadge = card.querySelector(`#ws-target-${atv.id}-${p.palavra}`);
                    if (targetBadge) {
                        targetBadge.classList.add('found');
                    }

                    // Limpa seleção ativa
                    card._wsState.currentCoords = [];
                    updateSelectionDisplay();

                    // Se encontrou todas, chama verificação
                    if (card._wsState.foundWords.length === atv.palavras.length) {
                        handleWordSearchAnswerSubmit(atv, card);
                    }
                    return true;
                }
            }
            return false;
        };

        gridCells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (isAlreadySolved) return;
                soundManager.playClick();

                const r = parseInt(cell.dataset.row, 10);
                const c = parseInt(cell.dataset.col, 10);

                // Verifica se já está selecionado
                const existingIdx = card._wsState.currentCoords.findIndex(([cr, cc]) => cr === r && cc === c);
                if (existingIdx >= 0) {
                    // Remove da seleção
                    card._wsState.currentCoords.splice(existingIdx, 1);
                    cell.classList.remove('selected-active');
                } else {
                    card._wsState.currentCoords.push([r, c]);
                    cell.classList.add('selected-active');
                }

                updateSelectionDisplay();
                checkFormedWord();
            });
        });

        btnClear?.addEventListener('click', () => {
            if (isAlreadySolved) return;
            soundManager.playClick();
            card._wsState.currentCoords.forEach(([r, c]) => {
                const cell = card.querySelector(`.ws-grid-cell[data-row="${r}"][data-col="${c}"]`);
                if (cell && !cell.classList.contains('found-cell')) {
                    cell.classList.remove('selected-active');
                }
            });
            card._wsState.currentCoords = [];
            updateSelectionDisplay();
        });

        btnVerify?.addEventListener('click', () => {
            handleWordSearchAnswerSubmit(atv, card);
        });
    }

    // Eventos de Texto Lacunado do Bilhete + Compreensão (Português 10)
    if (atv.tipo === 'texto_lacunado_compreensao') {
        const btnVerify = card.querySelector('.btn-verify-note-comprehension');
        const letterInputs = card.querySelectorAll('.note-char-input');
        const letterBankChips = card.querySelectorAll('.note-bank-chip');
        const questionCards = card.querySelectorAll('.note-question-card');
        let lastFocusedSlot = letterInputs[0] || null;

        const updateNoteLetterBankState = () => {
            const usedLetters = [];
            letterInputs.forEach(inp => {
                const val = inp.value.trim().toUpperCase();
                if (val) usedLetters.push(val);
            });

            const usedCounts = {};
            usedLetters.forEach(l => {
                usedCounts[l] = (usedCounts[l] || 0) + 1;
            });

            letterBankChips.forEach(chip => {
                const letter = chip.dataset.letter.toUpperCase();
                if (isAlreadySolved) {
                    chip.disabled = true;
                    chip.classList.add('used');
                } else if (usedCounts[letter] && usedCounts[letter] > 0) {
                    chip.disabled = true;
                    chip.classList.add('used');
                    usedCounts[letter]--;
                } else {
                    chip.disabled = false;
                    chip.classList.remove('used');
                }
            });
        };

        letterInputs.forEach((input, idx) => {
            input.addEventListener('focus', () => {
                lastFocusedSlot = input;
            });

            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                input.classList.remove('correct', 'incorrect');
                updateNoteLetterBankState();
                if (input.value.length === 1 && idx < letterInputs.length - 1) {
                    letterInputs[idx + 1].focus();
                    lastFocusedSlot = letterInputs[idx + 1];
                }
            });

            input.addEventListener('change', () => {
                updateNoteLetterBankState();
            });

            input.addEventListener('keyup', (e) => {
                updateNoteLetterBankState();
                if (e.key === 'Enter') {
                    if (idx < letterInputs.length - 1) {
                        letterInputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace' && input.value === '' && idx > 0) {
                    letterInputs[idx - 1].focus();
                    lastFocusedSlot = letterInputs[idx - 1];
                }
            });
        });

        letterBankChips.forEach(chip => {
            chip.addEventListener('click', () => {
                if (isAlreadySolved || chip.classList.contains('used')) return;
                soundManager.playClick();
                const letter = chip.dataset.letter;

                let target = lastFocusedSlot;
                if (!target || target.value.length > 0) {
                    for (const inp of letterInputs) {
                        if (!inp.value.trim()) {
                            target = inp;
                            break;
                        }
                    }
                }
                if (!target) target = letterInputs[0];

                if (target) {
                    target.value = letter;
                    target.classList.remove('correct', 'incorrect');
                    updateNoteLetterBankState();
                    const cIdx = Array.from(letterInputs).indexOf(target);
                    if (cIdx >= 0 && cIdx < letterInputs.length - 1) {
                        letterInputs[cIdx + 1].focus();
                        lastFocusedSlot = letterInputs[cIdx + 1];
                    }
                }
            });
        });

        // Inicializa o estado dos chips
        updateNoteLetterBankState();

        questionCards.forEach(qCard => {
            const qIdx = qCard.dataset.qIdx;
            const optButtons = qCard.querySelectorAll('.btn-note-choice');
            const hiddenAnsInput = qCard.querySelector('.note-question-answer-val');

            optButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (isAlreadySolved) return;
                    soundManager.playClick();
                    qCard.classList.remove('q-correct', 'q-wrong');

                    optButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    if (hiddenAnsInput) {
                        hiddenAnsInput.value = btn.dataset.optId;
                    }
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleNoteComprehensionAnswerSubmit(atv, card);
        });
    }

    // Eventos de Cruzadinha Simples (Português 11)
    if (atv.tipo === 'cruzadinha_simples') {
        const btnVerify = card.querySelector('.btn-verify-simple-crossword');
        const rows = card.querySelectorAll('.crossword-row-card');
        const allInputs = card.querySelectorAll('.crossword-cell-input');
        const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const validateCrosswordRow = (row) => {
            if (!row) return;
            const inputs = row.querySelectorAll('.crossword-cell-input');
            if (inputs.length === 0) return;

            let allFilled = true;
            let allCorrect = true;

            inputs.forEach(inp => {
                const val = normalize(inp.value);
                const exp = normalize(inp.dataset.expected);
                if (!val) {
                    allFilled = false;
                    allCorrect = false;
                } else if (val !== exp) {
                    allCorrect = false;
                }
            });

            if (allFilled && allCorrect) {
                inputs.forEach(inp => {
                    inp.classList.remove('incorrect');
                    inp.classList.add('correct');
                });
                row.classList.add('row-solved');
            } else {
                row.classList.remove('row-solved');
                inputs.forEach(inp => {
                    const val = normalize(inp.value);
                    const exp = normalize(inp.dataset.expected);
                    if (!val) {
                        inp.classList.remove('correct', 'incorrect');
                    } else if (allFilled && !allCorrect) {
                        if (val === exp) {
                            inp.classList.add('correct');
                            inp.classList.remove('incorrect');
                        } else {
                            inp.classList.add('incorrect');
                            inp.classList.remove('correct');
                        }
                    } else {
                        inp.classList.remove('correct', 'incorrect');
                    }
                });
            }
        };

        rows.forEach(row => {
            const inputs = row.querySelectorAll('.crossword-cell-input');
            inputs.forEach((input, idx) => {
                input.addEventListener('input', () => {
                    input.value = input.value.toUpperCase();
                    validateCrosswordRow(row);

                    if (input.value.length === 1 && idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    }
                });

                input.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        const globalIdx = Array.from(allInputs).indexOf(input);
                        if (globalIdx < allInputs.length - 1) {
                            allInputs[globalIdx + 1].focus();
                        } else {
                            btnVerify?.click();
                        }
                    } else if (e.key === 'Backspace') {
                        validateCrosswordRow(row);
                        if (input.value === '' && idx > 0) {
                            inputs[idx - 1].focus();
                        }
                    }
                });
            });

            validateCrosswordRow(row);
        });

        btnVerify?.addEventListener('click', () => {
            handleSimpleCrosswordAnswerSubmit(atv, card);
        });
    }

    // Eventos de Criptograma Numérico (Português 12 e 13)
    if (atv.tipo === 'criptograma_numerico') {
        const btnVerify = card.querySelector('.btn-verify-cryptogram');
        const inputs = card.querySelectorAll('.crypto-char-input');
        const wordCards = card.querySelectorAll('.crypto-word-card');
        const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const validateCryptoWord = (wordCard) => {
            if (!wordCard) return;
            const wordInputs = wordCard.querySelectorAll('.crypto-char-input');
            if (wordInputs.length === 0) return;

            let allFilled = true;
            let allCorrect = true;

            wordInputs.forEach(inp => {
                const val = normalize(inp.value);
                const exp = normalize(inp.dataset.expected);
                if (!val) {
                    allFilled = false;
                    allCorrect = false;
                } else if (val !== exp) {
                    allCorrect = false;
                }
            });

            if (allFilled && allCorrect) {
                wordInputs.forEach(inp => {
                    inp.classList.remove('incorrect');
                    inp.classList.add('correct');
                });
                wordCard.classList.add('word-solved');
            } else {
                wordCard.classList.remove('word-solved');
                wordInputs.forEach(inp => {
                    const val = normalize(inp.value);
                    const exp = normalize(inp.dataset.expected);
                    if (!val) {
                        inp.classList.remove('correct', 'incorrect');
                    } else if (allFilled && !allCorrect) {
                        if (val === exp) {
                            inp.classList.add('correct');
                            inp.classList.remove('incorrect');
                        } else {
                            inp.classList.add('incorrect');
                            inp.classList.remove('correct');
                        }
                    } else {
                        inp.classList.remove('correct', 'incorrect');
                    }
                });
            }
        };

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                input.value = input.value.toUpperCase();
                const wordCard = input.closest('.crypto-word-card');
                validateCryptoWord(wordCard);

                // Avança o foco para o próximo campo
                if (input.value.length === 1 && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                } else if (e.key === 'Backspace') {
                    const wordCard = input.closest('.crypto-word-card');
                    validateCryptoWord(wordCard);
                    if (input.value === '' && idx > 0) {
                        inputs[idx - 1].focus();
                    }
                }
            });
        });

        wordCards.forEach(wc => validateCryptoWord(wc));

        btnVerify?.addEventListener('click', () => {
            handleNumericCryptogramAnswerSubmit(atv, card);
        });
    }

    // Eventos de Mutação do H Mágico (Tipo 25)
    if (atv.tipo === 'mutacao_h_magico') {
        const btnVerify = card.querySelector('.btn-verify-mutation');
        const cards = card.querySelectorAll('.mutation-card');

        cards.forEach(mc => {
            const btns = mc.querySelectorAll('.mutation-opt-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                    const targetSlot = mc.querySelector('.mutation-target-slot');
                    if (targetSlot) {
                        targetSlot.textContent = btn.dataset.word;
                    }
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleMutationSubmit(atv, card);
        });
    }

    // Eventos de Completar Dígrafos (Tipo 26)
    if (atv.tipo === 'completar_digrafos_banco') {
        const btnVerify = card.querySelector('.btn-verify-digraphs');
        const cards = card.querySelectorAll('.digraph-word-card');

        cards.forEach(dc => {
            const slot = dc.querySelector('.digraph-slot-box');
            const btns = dc.querySelectorAll('.digraph-pill-btn');

            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                    const dig = btn.dataset.digraph;
                    if (slot) {
                        slot.textContent = dig;
                        slot.classList.add('filled');
                        slot.dataset.filledVal = dig;
                        if (dig === slot.dataset.expected) {
                            slot.classList.add('correct');
                            slot.classList.remove('incorrect');
                            btn.classList.add('selected-correct');
                        } else {
                            slot.classList.remove('correct');
                        }
                    }
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleDigraphCompletionSubmit(atv, card);
        });
    }

    // Eventos de Identificar Intruso Silábico (Tipo 27)
    if (atv.tipo === 'identificar_intruso_silabico') {
        const btnVerify = card.querySelector('.btn-verify-intruso');
        const cards = card.querySelectorAll('.intruso-group-card');

        cards.forEach(gc => {
            const chips = gc.querySelectorAll('.intruso-word-chip');
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    soundManager.playClick();
                    chips.forEach(c => c.classList.remove('selected', 'intruso-caught', 'selected-wrong'));
                    chip.classList.add('selected');
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleIntrusoSubmit(atv, card);
        });
    }

    // Eventos de Rimas Periciais (Tipo 28)
    if (atv.tipo === 'enigma_rimas_periciais') {
        const btnVerify = card.querySelector('.btn-verify-rhymes');
        const cards = card.querySelectorAll('.rhyme-clue-card');

        cards.forEach(rc => {
            const btns = rc.querySelectorAll('.rhyme-opt-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleRhymesSubmit(atv, card);
        });
    }

    // Eventos de Anagramas Silábicos (Tipo 29)
    if (atv.tipo === 'anagramas_silabicos') {
        const btnVerify = card.querySelector('.btn-verify-anagrams');
        const cards = card.querySelectorAll('.anagram-card');
        const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const validateAnagramCard = (ac) => {
            if (!ac) return;
            const inputs = ac.querySelectorAll('.anagram-char-input');
            if (inputs.length === 0) return;

            let allFilled = true;
            let allCorrect = true;

            inputs.forEach(inp => {
                const val = normalize(inp.value);
                const exp = normalize(inp.dataset.expected);
                if (!val) {
                    allFilled = false;
                    allCorrect = false;
                } else if (val !== exp) {
                    allCorrect = false;
                }
            });

            if (allFilled && allCorrect) {
                inputs.forEach(inp => {
                    inp.classList.remove('incorrect');
                    inp.classList.add('correct');
                });
                ac.classList.add('anagram-solved');
            } else {
                ac.classList.remove('anagram-solved');
                inputs.forEach(inp => {
                    const val = normalize(inp.value);
                    const exp = normalize(inp.dataset.expected);
                    if (!val) {
                        inp.classList.remove('correct', 'incorrect');
                    } else if (allFilled && !allCorrect) {
                        if (val === exp) {
                            inp.classList.add('correct');
                            inp.classList.remove('incorrect');
                        } else {
                            inp.classList.add('incorrect');
                            inp.classList.remove('correct');
                        }
                    } else {
                        inp.classList.remove('correct', 'incorrect');
                    }
                });
            }
        };

        cards.forEach(ac => {
            const hintBtn = ac.querySelector('.btn-anagram-hint-toggle');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => {
                    soundManager.playClick();
                    const targetId = hintBtn.dataset.target;
                    const clueBox = ac.querySelector(`#${targetId}`);
                    if (clueBox) {
                        clueBox.classList.toggle('open');
                    }
                });
            }

            const inputs = ac.querySelectorAll('.anagram-char-input');
            inputs.forEach((input, idx) => {
                input.addEventListener('input', () => {
                    input.value = input.value.toUpperCase();
                    validateAnagramCard(ac);

                    if (input.value.length === 1 && idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                    }
                });

                input.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        if (idx < inputs.length - 1) {
                            inputs[idx + 1].focus();
                        } else {
                            btnVerify?.click();
                        }
                    } else if (e.key === 'Backspace') {
                        validateAnagramCard(ac);
                        if (input.value === '' && idx > 0) {
                            inputs[idx - 1].focus();
                        }
                    }
                });
            });

            validateAnagramCard(ac);
        });

        btnVerify?.addEventListener('click', () => {
            handleAnagramSubmit(atv, card);
        });
    }

    // Eventos de Auditoria Ortográfica (Tipo 30)
    if (atv.tipo === 'ortografia_pericial_digrafos') {
        const btnVerify = card.querySelector('.btn-verify-ortho');
        const cards = card.querySelectorAll('.orthography-audit-card');

        cards.forEach(oc => {
            const btns = oc.querySelectorAll('.ortho-choice-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleOrthoAuditSubmit(atv, card);
        });
    }

    // Eventos de Soma por Quantidades (Aula 02 - Matemática)
    if (atv.tipo === 'soma_quantidades') {
        const btnVerify = card.querySelector('.btn-verify-soma-quant');
        const inputs = card.querySelectorAll('.quant-answer-input');

        btnVerify?.addEventListener('click', () => {
            handleSomaQuantidadesSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            // Contorno verde imediato ao digitar o resultado correto
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected);
                const row = input.closest('.quant-calc-row');
                const statusIcon = row ? row.querySelector('.quant-result-status-icon') : null;

                if (val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (statusIcon) statusIcon.innerHTML = '';
                }
            });

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

    // Eventos de Subtração por Quantidades (Aula 02 - Matemática)
    if (atv.tipo === 'subtracao_quantidades') {
        const btnVerify = card.querySelector('.btn-verify-sub-quant');
        const inputs = card.querySelectorAll('.quant-sub-input');

        btnVerify?.addEventListener('click', () => {
            handleSubtracaoQuantidadesSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            // Contorno verde imediato ao digitar o resultado correto
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected);
                const row = input.closest('.quant-calc-row');
                const statusIcon = row ? row.querySelector('.quant-result-status-icon') : null;

                if (val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (statusIcon) statusIcon.innerHTML = '';
                }
            });

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

    // Eventos de Algoritmo da Soma ("Conta Armada" com "Sobe 1") (Aula 02 - Matemática)
    if (atv.tipo === 'algoritmo_soma') {
        const btnVerify = card.querySelector('.btn-verify-algoritmo-soma');
        const allInputs = card.querySelectorAll('.alg-carry-input, .alg-result-input');

        btnVerify?.addEventListener('click', () => {
            handleAlgoritmoSomaSubmit(atv, card);
        });

        allInputs.forEach((input, idx) => {
            // Contorno verde imediato ao digitar o resultado ou transporte correto
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (input.classList.contains('alg-carry-input')) {
                    if (expected === '1' && val === '1') {
                        input.classList.add('cell-correct');
                        input.classList.remove('cell-incorrect');
                    } else if (!expected && (val === '' || val === '0')) {
                        input.classList.remove('cell-incorrect');
                    } else {
                        input.classList.remove('cell-correct');
                    }
                } else {
                    if (val !== '' && val === expected) {
                        input.classList.add('cell-correct');
                        input.classList.remove('cell-incorrect');
                    } else {
                        input.classList.remove('cell-correct');
                    }
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < allInputs.length - 1) {
                        allInputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Algoritmo da Subtração ("Conta Armada" com Troca/Empréstimo) (Aula 02 - Matemática)
    if (atv.tipo === 'algoritmo_subtracao') {
        const btnVerify = card.querySelector('.btn-verify-algoritmo-sub');
        const allInputs = card.querySelectorAll('.alg-borrow-input, .alg-result-input');

        btnVerify?.addEventListener('click', () => {
            handleAlgoritmoSubtracaoSubmit(atv, card);
        });

        allInputs.forEach((input, idx) => {
            // Contorno verde imediato ao digitar o resultado ou troca correta
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (input.classList.contains('alg-borrow-input')) {
                    if (expected !== '' && val === expected) {
                        input.classList.add('cell-correct');
                        input.classList.remove('cell-incorrect');
                    } else {
                        input.classList.remove('cell-correct');
                    }
                } else {
                    if (val !== '' && val === expected) {
                        input.classList.add('cell-correct');
                        input.classList.remove('cell-incorrect');
                    } else {
                        input.classList.remove('cell-correct');
                    }
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < allInputs.length - 1) {
                        allInputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Multiplicação por Parcelas Iguais (Aula 02 - Matemática)
    if (atv.tipo === 'multiplicacao_parcelas_iguais') {
        const btnVerify = card.querySelector('.btn-verify-mult-parcelas');
        const caseCards = card.querySelectorAll('.mult-case-card');

        caseCards.forEach(cCard => {
            const btns = cCard.querySelectorAll('.mult-option-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                });
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleMultiplicacaoParcelasSubmit(atv, card);
        });
    }

    // Eventos de Algoritmo da Multiplicação (Aula 02 - Matemática)
    if (atv.tipo === 'algoritmo_multiplicacao') {
        const btnVerify = card.querySelector('.btn-verify-algoritmo-mult');
        const allInputs = card.querySelectorAll('.alg-mult-carry-input, .alg-partial-input, .alg-mult-result-input');

        btnVerify?.addEventListener('click', () => {
            handleAlgoritmoMultiplicacaoSubmit(atv, card);
        });

        allInputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < allInputs.length - 1) {
                        allInputs[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Soma com Parcela Faltando (Aula 02 - Matemática)
    if (atv.tipo === 'soma_parcela_faltando') {
        const btnVerify = card.querySelector('.btn-verify-soma-faltando');
        const inputs = card.querySelectorAll('.missing-term-input');

        btnVerify?.addEventListener('click', () => {
            handleSomaParcelaFaltandoSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const row = input.closest('.missing-equation-row');
                const icon = row ? row.querySelector('.missing-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (icon) icon.innerHTML = '';
                }
            });

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

    // Eventos de Subtração com Número Faltando (Aula 02 - Matemática)
    if (atv.tipo === 'subtracao_numero_faltando') {
        const btnVerify = card.querySelector('.btn-verify-sub-faltando');
        const inputs = card.querySelectorAll('.missing-sub-input');

        btnVerify?.addEventListener('click', () => {
            handleSubtracaoNumeroFaltandoSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const row = input.closest('.missing-equation-row');
                const icon = row ? row.querySelector('.missing-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (icon) icon.innerHTML = '';
                }
            });

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

    // Eventos de Tabuadas Verticais do 1 ao 10 (Aula 02 - Matemática)
    if (atv.tipo === 'tabuadas_verticais') {
        const btnVerify = card.querySelector('.btn-verify-tabuadas');
        const pillBtns = card.querySelectorAll('.tabuada-pill-btn');
        const panels = card.querySelectorAll('.tabuada-panel');
        const allInputs = card.querySelectorAll('.tabuada-cell-input');

        pillBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                soundManager.playClick();
                pillBtns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                const base = btn.dataset.base;
                const targetPanel = card.querySelector(`#tabuada-panel-${atv.id}-${base}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    const firstEmpty = targetPanel.querySelector('.tabuada-cell-input:not(.cell-correct)') || targetPanel.querySelector('.tabuada-cell-input');
                    if (firstEmpty) {
                        setTimeout(() => {
                            firstEmpty.focus();
                            firstEmpty.select();
                        }, 50);
                    }
                }
            });
        });

        allInputs.forEach((input) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const isCorrect = (val !== '' && val === expected);

                if (isCorrect) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }

                // Atualiza contador de acertos da aba ativa
                const base = input.dataset.base;
                const panel = card.querySelector(`#tabuada-panel-${atv.id}-${base}`);
                if (panel) {
                    const panelInputs = Array.from(panel.querySelectorAll('.tabuada-cell-input'));
                    const correctCells = panel.querySelectorAll('.tabuada-cell-input.cell-correct').length;
                    const counter = panel.querySelector(`#tab-counter-${atv.id}-${base}`);
                    if (counter) counter.textContent = `${correctCells} / ${panelInputs.length} corretos`;

                    // Se a resposta estiver correta, avança automaticamente para o próximo campo!
                    if (isCorrect) {
                        const currentIdxInPanel = panelInputs.indexOf(input);
                        if (currentIdxInPanel >= 0 && currentIdxInPanel < panelInputs.length - 1) {
                            const nextInput = panelInputs[currentIdxInPanel + 1];
                            setTimeout(() => {
                                nextInput.focus();
                                nextInput.select();
                            }, 50);
                        } else if (currentIdxInPanel === panelInputs.length - 1 && correctCells === panelInputs.length) {
                            // Aba concluída com sucesso!
                            soundManager.playSuccess();
                            const currentPill = card.querySelector('.tabuada-pill-btn.active');
                            const nextPill = currentPill ? currentPill.nextElementSibling : null;
                            if (nextPill && nextPill.classList.contains('tabuada-pill-btn')) {
                                setTimeout(() => {
                                    nextPill.click();
                                }, 350);
                            } else {
                                setTimeout(() => {
                                    btnVerify?.focus();
                                }, 300);
                            }
                        }
                    }
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    const base = input.dataset.base;
                    const panel = card.querySelector(`#tabuada-panel-${atv.id}-${base}`);
                    if (panel) {
                        const panelInputs = Array.from(panel.querySelectorAll('.tabuada-cell-input'));
                        const currentIdxInPanel = panelInputs.indexOf(input);
                        if (currentIdxInPanel < panelInputs.length - 1) {
                            panelInputs[currentIdxInPanel + 1].focus();
                            panelInputs[currentIdxInPanel + 1].select();
                        } else {
                            btnVerify?.click();
                        }
                    }
                }
            });
        });

        btnVerify?.addEventListener('click', () => {
            handleTabuadasVerticaisSubmit(atv, card);
        });
    }

    // Eventos de Fator Faltando na Multiplicação (Aula 02 - Matemática)
    if (atv.tipo === 'fator_faltando') {
        const btnVerify = card.querySelector('.btn-verify-fator-faltando');
        const inputs = card.querySelectorAll('.missing-factor-input');

        btnVerify?.addEventListener('click', () => {
            handleFatorFaltandoSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const row = input.closest('.missing-equation-row');
                const icon = row ? row.querySelector('.missing-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (icon) icon.innerHTML = '';
                }
            });

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

    // Eventos de Situações-Problema das 3 Operações (Aula 02 - Matemática)
    if (atv.tipo === 'situacoes_problema_operacoes') {
        const btnVerify = card.querySelector('.btn-verify-situacoes-problema');
        const inputs = card.querySelectorAll('.prob-case-input');

        btnVerify?.addEventListener('click', () => {
            handleSituacoesProblemaSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const row = input.closest('.prob-calc-row');
                const icon = row ? row.querySelector('.prob-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (icon) icon.innerHTML = '';
                }
            });

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

    // Eventos de Pirâmide Numérica (Aula 02 - Matemática)
    if (atv.tipo === 'piramide_numerica') {
        const btnVerify = card.querySelector('.btn-verify-piramides');
        const inputs = card.querySelectorAll('.pyr-brick-input');

        btnVerify?.addEventListener('click', () => {
            handlePiramideNumericaSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }
            });

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

    // Eventos de Balança de Comparação de Operações (Aula 02 - Matemática)
    if (atv.tipo === 'balanca_comparacao_operacoes') {
        const btnVerify = card.querySelector('.btn-verify-balanca');
        const cards = card.querySelectorAll('.balanca-card');

        btnVerify?.addEventListener('click', () => {
            handleBalancaComparacaoSubmit(atv, card);
        });

        cards.forEach(bc => {
            const btns = bc.querySelectorAll('.balanca-opt-btn');
            const icon = bc.querySelector('.balanca-status-icon');

            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                    if (icon) icon.innerHTML = '';
                });
            });
        });
    }

    // Eventos de Trilha da Cadeia Operatória (Aula 02 - Matemática)
    if (atv.tipo === 'cadeia_operatoria_trilha') {
        const btnVerify = card.querySelector('.btn-verify-trilhas');
        const inputs = card.querySelectorAll('.trilha-step-input');

        btnVerify?.addEventListener('click', () => {
            handleCadeiaOperatoriaSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            const stepNode = input.closest('.trilha-step-node');
            const statusSpan = stepNode ? stepNode.querySelector('.trilha-step-status') : null;

            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (statusSpan) {
                        statusSpan.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald); font-size: 0.9rem; margin-top: 3px;"></i>';
                    }

                    const allInputs = [...inputs];
                    const allCorrect = allInputs.every(i => i.value.trim() === String(i.dataset.expected || ''));
                    if (allCorrect) {
                        handleCadeiaOperatoriaSubmit(atv, card);
                    } else if (idx < inputs.length - 1) {
                        inputs[idx + 1].focus();
                        inputs[idx + 1].select();
                    }
                } else {
                    input.classList.remove('cell-correct');
                    if (statusSpan) {
                        statusSpan.innerHTML = '';
                    }
                }
            });

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

    // Eventos de Descubra o Sinal da Operação (Aula 02 - Matemática)
    if (atv.tipo === 'descubra_sinal_operacao') {
        const btnVerify = card.querySelector('.btn-verify-sinais');
        const cards = card.querySelectorAll('.sinal-card');

        btnVerify?.addEventListener('click', () => {
            handleDescubraSinalSubmit(atv, card);
        });

        cards.forEach(sc => {
            const btns = sc.querySelectorAll('.sinal-opt-btn');
            const icon = sc.querySelector('.sinal-status-icon');

            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    soundManager.playClick();
                    btns.forEach(b => b.classList.remove('selected', 'selected-correct', 'selected-wrong'));
                    btn.classList.add('selected');
                    if (icon) icon.innerHTML = '';
                });
            });
        });
    }

    // Eventos de Cálculo Mental com Dezenas e Centenas (Aula 02 - Matemática)
    if (atv.tipo === 'calculo_mental_exato') {
        const btnVerify = card.querySelector('.btn-verify-calculo-mental');
        const inputs = card.querySelectorAll('.cmental-input');

        btnVerify?.addEventListener('click', () => {
            handleCalculoMentalSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const row = input.closest('.cmental-row');
                const icon = row ? row.querySelector('.cmental-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                    if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                } else {
                    input.classList.remove('cell-correct');
                    if (icon) icon.innerHTML = '';
                }
            });

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

    // Eventos de Adição com 3 Parcelas (Aula 02 - Matemática)
    if (atv.tipo === 'adicao_tres_parcelas') {
        const btnVerify = card.querySelector('.btn-verify-tres-parcelas');
        const carryInputs = card.querySelectorAll('.atp-carry');
        const resInputs = card.querySelectorAll('.atp-result');

        btnVerify?.addEventListener('click', () => {
            handleAdicaoTresParcelasSubmit(atv, card);
        });

        [...carryInputs, ...resInputs].forEach((input, idx, arr) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    if (idx < arr.length - 1) {
                        arr[idx + 1].focus();
                    } else {
                        btnVerify?.click();
                    }
                }
            });
        });
    }

    // Eventos de Multiplicação por Decomposição (Aula 02 - Matemática)
    if (atv.tipo === 'multiplicacao_decomposicao') {
        const btnVerify = card.querySelector('.btn-verify-decomp-mult');
        const inputs = card.querySelectorAll('.mdecomp-input');

        btnVerify?.addEventListener('click', () => {
            handleMultiplicacaoDecomposicaoSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');
                const cardWrap = input.closest('.mdecomp-card');
                const icon = cardWrap ? cardWrap.querySelector('.mdecomp-status-icon') : null;

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }

                if (cardWrap && icon) {
                    const cardInputs = cardWrap.querySelectorAll('.mdecomp-input');
                    const allCardCorrect = [...cardInputs].every(i => i.value.trim() === String(i.dataset.expected || ''));
                    if (allCardCorrect) {
                        icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
                    } else {
                        icon.innerHTML = '';
                    }
                }
            });

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

    // Eventos de Cruzadinha Operatória (Aula 02 - Matemática)
    if (atv.tipo === 'cruzadinha_operacoes') {
        const btnVerify = card.querySelector('.btn-verify-cruzadinha');
        const inputs = card.querySelectorAll('.cruz-input');

        btnVerify?.addEventListener('click', () => {
            handleCruzadinhaOperacoesSubmit(atv, card);
        });

        inputs.forEach((input, idx) => {
            input.addEventListener('input', () => {
                const val = input.value.trim();
                const expected = String(input.dataset.expected || '');

                if (val !== '' && val === expected) {
                    input.classList.add('cell-correct');
                    input.classList.remove('cell-incorrect');
                } else {
                    input.classList.remove('cell-correct');
                }
            });

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

    // Eventos do Grande Cofre Final (Aula 02 - Matemática)
    if (atv.tipo === 'cofre_final_operacoes') {
        const btnVerify = card.querySelector('.btn-verify-cofre-final');
        const dialInputs = card.querySelectorAll('.cofre-dial-input');
        const clueInputs = card.querySelectorAll('.cofre-clue-input');

        btnVerify?.addEventListener('click', () => {
            handleCofreFinalSubmit(atv, card);
        });

        const syncDialsAndClues = (dialIndex, value) => {
            const dial = card.querySelector(`#cofre-dial-input-${atv.id}-${dialIndex}`);
            const clue = card.querySelector(`#cofre-clue-input-${atv.id}-${dialIndex}`);
            const slot = card.querySelector(`#cofre-dial-${atv.id}-${dialIndex}`);
            const clueStatus = card.querySelector(`#clue-status-${atv.id}-${dialIndex}`);
            const expected = dial ? dial.dataset.expected : '';

            if (dial) dial.value = value;
            if (clue) clue.value = value;

            if (value !== '' && value === expected) {
                dial?.classList.add('cell-correct');
                clue?.classList.add('cell-correct');
                slot?.classList.add('dial-unlocked');
                if (clueStatus) clueStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i> Trava Aberta';
            } else {
                dial?.classList.remove('cell-correct');
                clue?.classList.remove('cell-correct');
                slot?.classList.remove('dial-unlocked');
                if (clueStatus) clueStatus.innerHTML = '';
            }
        };

        dialInputs.forEach((input) => {
            input.addEventListener('input', () => {
                const idx = input.dataset.dialIndex;
                syncDialsAndClues(idx, input.value.trim());
                if (input.value.trim() && Number(idx) < dialInputs.length - 1) {
                    dialInputs[Number(idx) + 1].focus();
                }
            });
        });

        clueInputs.forEach((input) => {
            input.addEventListener('input', () => {
                const idx = input.dataset.dialIndex;
                syncDialsAndClues(idx, input.value.trim());
            });

            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    const idx = Number(input.dataset.dialIndex);
                    if (idx < clueInputs.length - 1) {
                        clueInputs[idx + 1].focus();
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

// ==========================================================================
// HANDLERS DE VALIDAÇÃO: AULA 02 DE MATEMÁTICA (OPERAÇÕES BÁSICAS - PARTE 1)
// ==========================================================================

// Validação de Soma por Quantidades
function handleSomaQuantidadesSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.quant-answer-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);
        const row = input.closest('.quant-calc-row');
        const statusIcon = row ? row.querySelector('.quant-result-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-soma-quant');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Somas por Quantidades Verificadas com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente, Detetive! Todas as somas foram calculadas corretamente!</strong><br>
                ${atv.explicacao || 'Lotes de evidências somados com 100% de exatidão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho e tente novamente.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Você ainda precisa calcular ${emptyCount} linha(s) de soma.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} soma(s) com valor incorreto. Reconte com atenção os objetos de cada card!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Contagem!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Subtração por Quantidades
function handleSubtracaoQuantidadesSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.quant-sub-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected);
        const row = input.closest('.quant-calc-row');
        const statusIcon = row ? row.querySelector('.quant-result-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (statusIcon) statusIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-sub-quant');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Subtrações por Quantidades Verificadas com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Perfeito, Agente! Todas as subtrações de evidências estão exatas!</strong><br>
                ${atv.explicacao || 'Inventário de evidências subtraído com total precisão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho e tente novamente.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha o resultado restante nas ${emptyCount} linha(s) em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} resultado(s) incorreto(s). Lembre-se: subtrair é retirar a quantidade do 2º card da quantidade do 1º card!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Inventário!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação do Algoritmo da Soma ("Conta Armada" com "Sobe 1")
function handleAlgoritmoSomaSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const resultInputs = cardElement.querySelectorAll('.alg-result-input');
    const carryInputs = cardElement.querySelectorAll('.alg-carry-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongResultCount = 0;
    let wrongCarryCount = 0;

    // Valida os dígitos de resultado em cada ordem
    resultInputs.forEach(input => {
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
            wrongResultCount++;
            input.classList.add('cell-incorrect');
        }
    });

    // Valida os campos de "Sobe 1"
    carryInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        input.classList.remove('cell-correct', 'cell-incorrect');

        if (expected === '1') {
            if (val === '1') {
                input.classList.add('cell-correct');
            } else {
                allCorrect = false;
                wrongCarryCount++;
                input.classList.add('cell-incorrect');
            }
        } else {
            if (val === '' || val === '0') {
                // Aceito
            } else {
                allCorrect = false;
                wrongCarryCount++;
                input.classList.add('cell-incorrect');
            }
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        resultInputs.forEach(input => { input.disabled = true; });
        carryInputs.forEach(input => { input.disabled = true; });

        const btnVerify = cardElement.querySelector('.btn-verify-algoritmo-soma');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Algoritmos da Soma Verificados com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Incrível, Perito dos Cálculos! Todos os 4 algoritmos da adição e os transportes ("sobe 1") estão 100% corretos!</strong><br>
                ${atv.explicacao || 'Operações armadas executadas com excelência investigativa!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nas contas armadas.';
        if (emptyCount > 0 && wrongResultCount === 0 && wrongCarryCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) de resultado que ainda estão em branco.`;
        } else if (wrongCarryCount > 0 && wrongResultCount === 0) {
            msg = `Revise os campos de "Sobe 1"! Quando a soma de uma coluna atinge 10 ou mais, anote 1 na bolha "Sobe" da coluna vizinha.`;
        } else if (wrongResultCount > 0) {
            msg = `Há algarismos de resultado incorretos. Lembre-se de começar pelas UNIDADES e somar também o "1" que subiu nas dezenas/centenas!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Algoritmo!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação do Algoritmo da Subtração ("Conta Armada" com Troca/Empréstimo)
function handleAlgoritmoSubtracaoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const resultInputs = cardElement.querySelectorAll('.alg-result-input');
    const borrowInputs = cardElement.querySelectorAll('.alg-borrow-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongResultCount = 0;
    let wrongBorrowCount = 0;

    // Valida os dígitos de resultado da subtração
    resultInputs.forEach(input => {
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
            wrongResultCount++;
            input.classList.add('cell-incorrect');
        }
    });

    // Valida anotações de troca / empréstimo
    borrowInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        input.classList.remove('cell-correct', 'cell-incorrect');

        if (expected !== '') {
            if (val === expected) {
                input.classList.add('cell-correct');
            } else {
                allCorrect = false;
                wrongBorrowCount++;
                input.classList.add('cell-incorrect');
            }
        } else {
            if (val !== '' && val !== expected) {
                allCorrect = false;
                wrongBorrowCount++;
                input.classList.add('cell-incorrect');
            }
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        resultInputs.forEach(input => { input.disabled = true; });
        borrowInputs.forEach(input => { input.disabled = true; });

        const btnVerify = cardElement.querySelector('.btn-verify-algoritmo-sub');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Algoritmos da Subtração Verificados com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Espetacular, Detetive Chefe! Todas as 4 subtrações e os registros de troca/empréstimo foram calculados com perfeição!</strong><br>
                ${atv.explicacao || 'Mecânica de empréstimo executada com total segurança forense!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nas subtrações armadas.';
        if (emptyCount > 0 && wrongResultCount === 0 && wrongBorrowCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) que ainda estão em branco.`;
        } else if (wrongBorrowCount > 0 && wrongResultCount === 0) {
            msg = `Revise os campos de Troca (empréstimo)! Se o número de cima for menor que o de baixo, peça emprestado: a ordem vizinha fica com 1 a menos e a ordem atual ganha 10.`;
        } else if (wrongResultCount > 0) {
            msg = `Há resultados incorretos nas subtrações. Lembre-se de calcular com o novo valor após o empréstimo!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Trocas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Multiplicação por Parcelas Iguais
function handleMultiplicacaoParcelasSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const caseCards = cardElement.querySelectorAll('.mult-case-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    atv.casos.forEach(caso => {
        const caseCard = cardElement.querySelector(`#mult-card-${atv.id}-${caso.id}`);
        if (!caseCard) return;

        const selectedBtn = caseCard.querySelector('.mult-option-btn.selected');
        const allBtns = caseCard.querySelectorAll('.mult-option-btn');

        allBtns.forEach(b => b.classList.remove('selected-correct', 'selected-wrong'));

        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
            caseCard.classList.add('case-unanswered');
        } else {
            caseCard.classList.remove('case-unanswered');
            const chosenId = selectedBtn.dataset.optionId;
            if (chosenId === caso.respostaCorreta) {
                selectedBtn.classList.add('selected-correct');
            } else {
                allCorrect = false;
                wrongCount++;
                selectedBtn.classList.add('selected-wrong');
            }
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        caseCards.forEach(cCard => {
            const btns = cCard.querySelectorAll('.mult-option-btn');
            btns.forEach(b => { b.disabled = true; });
        });

        const btnVerify = cardElement.querySelector('.btn-verify-mult-parcelas');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Multiplicações Confirmadas com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Brilhante, Mestre dos Enigmas! Todas as 5 somas de parcelas iguais foram associadas à sua multiplicação com precisão cirúrgica!</strong><br>
                ${atv.explicacao || 'Multiplicações decifradas com 100% de aproveitamento!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os códigos em vermelho e ajuste suas escolhas.';
        if (unselectedCount > 0 && wrongCount === 0) {
            msg = `Você ainda não selecionou a multiplicação para ${unselectedCount} caso(s).`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} multiplicação(ões) incorreta(s). Lembre-se: conte QUANTAS vezes o número se repete e multiplique pelo seu valor! Exemplo: 4 + 4 + 4 são 3 vezes o 4 (3 × 4).`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Parcelas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação do Algoritmo da Multiplicação (Aula 02 - Matemática)
function handleAlgoritmoMultiplicacaoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const carryInputs = cardElement.querySelectorAll('.alg-mult-carry-input');
    const partialInputs = cardElement.querySelectorAll('.alg-partial-input');
    const resultInputs = cardElement.querySelectorAll('.alg-mult-result-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCarryCount = 0;
    let wrongCount = 0;

    carryInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
        } else if (val === expected) {
            input.classList.add('cell-correct');
        } else {
            allCorrect = false;
            wrongCarryCount++;
            input.classList.add('cell-incorrect');
        }
    });

    partialInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
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

    resultInputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
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

        carryInputs.forEach(i => i.disabled = true);
        partialInputs.forEach(i => i.disabled = true);
        resultInputs.forEach(i => i.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-algoritmo-mult');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Algoritmos e Transportes Verificados com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Espetacular, Detetive Calculista! Todas as multiplicações, transportes ("sobe") e produtos parciais foram executados com perfeição!</strong><br>
                ${atv.explicacao || 'Algoritmo da multiplicação consolidado com total maestria!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os algarismos em vermelho nas contas armadas.';
        if (wrongCarryCount > 0 && wrongCount === 0 && emptyCount === 0) {
            msg = `Revise os círculos de "Sobe" (transporte)! Por exemplo: se 5 × 8 = 40, anote 0 no resultado e suba 4 na próxima coluna.`;
        } else if (emptyCount > 0 && wrongCount === 0 && wrongCarryCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) ainda vazios nas contas (incluindo o transporte "Sobe").`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} algarismo(s) incorreto(s). Lembre-se de somar o número que subiu ao produto da coluna!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Algoritmo!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Soma com Parcela Faltando (Aula 02 - Matemática)
function handleSomaParcelaFaltandoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.missing-term-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const row = input.closest('.missing-equation-row');
        const icon = row ? row.querySelector('.missing-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(i => i.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-soma-faltando');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Parcelas Reveladas com Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Excelente dedução! Todas as 6 parcelas ocultas foram calculadas corretamente!</strong><br>
                ${atv.explicacao || 'Operações inversas dominadas com total segurança pericial!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as respostas destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha a parcela que falta nos ${emptyCount} caso(s) em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} valor(es) incorreto(s). Lembre-se: subtraia a parcela conhecida do total para achar a outra!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Parcelas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Subtração com Número Faltando (Aula 02 - Matemática)
function handleSubtracaoNumeroFaltandoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.missing-sub-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const row = input.closest('.missing-equation-row');
        const icon = row ? row.querySelector('.missing-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(i => i.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-sub-faltando');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Números Ocultos Revelados!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Magnífico, Perito Forense! Todos os termos ocultos das subtrações foram identificados!</strong><br>
                ${atv.explicacao || 'Raciocínio lógico e equações solucionadas com maestria!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as respostas destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} caso(s) de subtração que ainda estão em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} resposta(s) incorreta(s). Se faltar o primeiro número, some o subtraendo com o resto. Se faltar o do meio, subtraia o resto do minuendo!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Termos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Tabuadas Verticais do 1 ao 10 (Aula 02 - Matemática)
function handleTabuadasVerticaisSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.tabuada-cell-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
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

    // Atualiza contadores de cada aba
    atv.tabuadas.forEach(tab => {
        const panel = cardElement.querySelector(`#tabuada-panel-${atv.id}-${tab.base}`);
        if (panel) {
            const totalCells = panel.querySelectorAll('.tabuada-cell-input').length;
            const correctCells = panel.querySelectorAll('.tabuada-cell-input.cell-correct').length;
            const counter = panel.querySelector(`#tab-counter-${atv.id}-${tab.base}`);
            if (counter) counter.textContent = `${correctCells} / ${totalCells} completados`;
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(i => i.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-tabuadas');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as 10 Tabuadas Completadas com 100% de Sucesso!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>LENDÁRIO! Você completou com perfeição todas as 100 operações das 10 tabuadas!</strong><br>
                ${atv.explicacao || 'Arquivo mestre das tabuadas dominado integralmente!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Ainda restam campos incorretos ou em branco nas tabuadas.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Você ainda tem ${emptyCount} multiplicação(ões) para responder nas abas das tabuadas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} produto(s) incorreto(s) em vermelho. Revise as tabuadas e corrija os cálculos!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Tabuadas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Fator Faltando na Multiplicação (Aula 02 - Matemática)
function handleFatorFaltandoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.missing-factor-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const row = input.closest('.missing-equation-row');
        const icon = row ? row.querySelector('.missing-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(i => i.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-fator-faltando');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Fatores Desvendados!';
        }

        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>PARABÉNS SUPREMO, DETETIVE MESTRE! Todos os 8 fatores foram encontrados e o cofre final da Aula 02 foi aberto!</strong><br>
                ${atv.explicacao || 'Operações básicas dominadas com honras periciais!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os fatores destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha o fator que falta nos ${emptyCount} caso(s) em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} fator(es) incorreto(s). Pense: qual número vezes o fator conhecido dá o produto total?`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Fatores!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// Validação de Situações-Problema das 3 Operações (Aula 02 - Matemática)
function handleSituacoesProblemaSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.prob-case-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const row = input.closest('.prob-calc-row');
        const icon = row ? row.querySelector('.prob-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-situacoes-problema');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Casos Solucionados!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>CASOS CONCLUÍDOS COM SUCESSO!</strong><br>
                ${atv.explicacao || 'Raciocínio pericial impecável nas 4 situações-problema.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Revise os resultados destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha o cálculo dos ${emptyCount} caso(s) em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} cálculo(s) com valor divergente. Leia atentamente o enunciado e verifique a operação indicada!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Casos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Pirâmide Numérica (Aula 02 - Matemática)
function handlePiramideNumericaSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.pyr-brick-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');

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
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-piramides');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Pirâmides Construídas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>PIRÂMIDES PERICIAIS ERGUIDAS COM SUCESSO!</strong><br>
                ${atv.explicacao || 'Todos os blocos numéricos fecharam perfeitamente as somas em cadeia.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os blocos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} tijolo(s) em branco nas pirâmides.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} bloco(s) com soma incorreta. Lembre-se: o bloco de cima é exatamente a soma dos dois blocos abaixo dele!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Blocos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Balança de Comparação de Operações (Aula 02 - Matemática)
function handleBalancaComparacaoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.balanca-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(bc => {
        const selector = bc.querySelector('.balanca-selector');
        const selectedBtn = selector ? selector.querySelector('.balanca-opt-btn.selected') : null;
        const expected = selector ? selector.dataset.expected : '';
        const icon = bc.querySelector('.balanca-status-icon');

        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (selectedBtn.dataset.symbol === expected) {
            selectedBtn.classList.add('selected-correct');
            selectedBtn.classList.remove('selected-wrong');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            selectedBtn.classList.add('selected-wrong');
            selectedBtn.classList.remove('selected-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cardElement.querySelectorAll('.balanca-opt-btn').forEach(b => b.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-balanca');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Balanças Equilibradas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>EQUILÍBRIO FORENSE PERFEITO!</strong><br>
                ${atv.explicacao || 'Todas as comparações de operações foram julgadas com precisão.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as comparações destacadas em vermelho.';
        if (unselectedCount > 0 && wrongCount === 0) {
            msg = `Escolha o símbolo (< , = ou >) para as ${unselectedCount} balança(s) pendente(s).`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} comparação(ões) incorreta(s). Calcule o valor de cada prato antes de selecionar o sinal!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Balanças!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Trilha da Cadeia Operatória (Aula 02 - Matemática)
function handleCadeiaOperatoriaSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.trilha-step-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');

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
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-trilhas');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Rotas de Fuga Decifradas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>TODAS AS ROTAS FORAM BLOQUEADAS!</strong><br>
                ${atv.explicacao || 'Você seguiu cada etapa da cadeia operatória com absoluta precisão.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os postos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} posto(s) de controle em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} posto(s) com cálculo divergente. Lembre-se de usar o resultado anterior para a próxima operação!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Rota!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Descubra o Sinal da Operação (Aula 02 - Matemática)
function handleDescubraSinalSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.sinal-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(sc => {
        const selector = sc.querySelector('.sinal-selector');
        const selectedBtn = selector ? selector.querySelector('.sinal-opt-btn.selected') : null;
        const expected = selector ? selector.dataset.expected : '';
        const icon = sc.querySelector('.sinal-status-icon');

        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (selectedBtn.dataset.op === expected) {
            selectedBtn.classList.add('selected-correct');
            selectedBtn.classList.remove('selected-wrong');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            selectedBtn.classList.add('selected-wrong');
            selectedBtn.classList.remove('selected-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cardElement.querySelectorAll('.sinal-opt-btn').forEach(b => b.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-sinais');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Sinais Restaurados!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>SINAIS OPERATÓRIOS RESTAURADOS!</strong><br>
                ${atv.explicacao || 'Todos os operadores foram identificados e validados no laudo pericial.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os sinais destacados em vermelho.';
        if (unselectedCount > 0 && wrongCount === 0) {
            msg = `Escolha o operador (+ , − ou ×) para as ${unselectedCount} equação(ões) pendente(s).`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} sinal(is) incorreto(s). Teste a conta para ver qual operador resulta exatamente no número final!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Sinais!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Cálculo Mental com Dezenas e Centenas (Aula 02 - Matemática)
function handleCalculoMentalSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.cmental-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const row = input.closest('.cmental-row');
        const icon = row ? row.querySelector('.cmental-status-icon') : null;

        input.classList.remove('cell-correct', 'cell-incorrect');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i>';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i>';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            if (icon) icon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i>';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-calculo-mental');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Cálculos Mentais Concluídos!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>AGILIDADE MENTAL COMPROVADA!</strong><br>
                ${atv.explicacao || 'Operações de dezenas e centenas exatas resolvidas com máxima rapidez.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os cálculos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Digite o resultado dos ${emptyCount} cálculo(s) em branco.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} resposta(s) com valor divergente. Use a dica rápida para resolver mentalmente!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção aos Cálculos!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Adição com 3 Parcelas (Aula 02 - Matemática)
function handleAdicaoTresParcelasSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const carryInputs = cardElement.querySelectorAll('.atp-carry');
    const resInputs = cardElement.querySelectorAll('.atp-result');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    [...carryInputs, ...resInputs].forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');

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
        [...carryInputs, ...resInputs].forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-tres-parcelas');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Adições de 3 Parcelas Verificadas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>ADIÇÕES DE 3 PARCELAS DOMINADAS!</strong><br>
                ${atv.explicacao || 'Todos os cálculos armados e transportes múltiplos foram executados com precisão pericial.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} dígito(s) e transporte(s) em branco nas contas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} valor(es) incorreto(s). Lembre-se de conferir se a soma da coluna deu 20 ou mais para subir 2!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Contas Armadas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Multiplicação por Decomposição (Aula 02 - Matemática)
function handleMultiplicacaoDecomposicaoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.mdecomp-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');

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
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-decomp-mult');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Decomposições Concluídas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>DECOMPOSIÇÃO TÁTICA DOMINADA COM SUCESSO!</strong><br>
                ${atv.explicacao || 'Você multiplicou as dezenas e unidades separadamente e encontrou todos os totais.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} campo(s) em branco (produtos parciais ou total).`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} valor(es) divergente(s). Multiplique a dezena inteira, depois a unidade e some os dois resultados!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Decomposição!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Cruzadinha Operatória (Aula 02 - Matemática)
function handleCruzadinhaOperacoesSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.cruz-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');

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
        inputs.forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-cruzadinha');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Cruzadinha Operatória Decifrada!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>CRIPTOGRAMA DA GRADE DECIFRADO COM LOUVOR!</strong><br>
                ${atv.explicacao || 'Todas as equações horizontais e verticais se fecharam em perfeita concordância.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as células destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} célula(s) em branco da cruzadinha.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} número(s) incorreto(s). Lembre-se: o número precisa dar certo tanto na conta horizontal quanto na vertical!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Cruzadinha!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação do Grande Cofre Final (Aula 02 - Matemática)
function handleCofreFinalSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const dialInputs = cardElement.querySelectorAll('.cofre-dial-input');
    const clueInputs = cardElement.querySelectorAll('.cofre-clue-input');
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    dialInputs.forEach((input, idx) => {
        const val = input.value.trim();
        const expected = String(input.dataset.expected || '');
        const slot = cardElement.querySelector(`#cofre-dial-${atv.id}-${idx}`);
        const clueStatus = cardElement.querySelector(`#clue-status-${atv.id}-${idx}`);

        input.classList.remove('cell-correct', 'cell-incorrect');
        slot?.classList.remove('dial-unlocked', 'dial-error');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('cell-incorrect');
            slot?.classList.add('dial-error');
            if (clueStatus) clueStatus.innerHTML = '<i class="fa-solid fa-circle-question" style="color: var(--neon-amber);"></i> Trava Pendente';
        } else if (val === expected) {
            input.classList.add('cell-correct');
            slot?.classList.add('dial-unlocked');
            if (clueStatus) clueStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--neon-emerald);"></i> Trava Aberta';
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('cell-incorrect');
            slot?.classList.add('dial-error');
            if (clueStatus) clueStatus.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: var(--neon-rose);"></i> Dígito Incorreto';
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        [...dialInputs, ...clueInputs].forEach(i => i.disabled = true);
        const btnVerify = cardElement.querySelector('.btn-verify-cofre-final');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.className = 'btn-decode-action btn-vault-unlocked';
            btnVerify.innerHTML = '<i class="fa-solid fa-trophy"></i> COFRE ABERTO: MISSÃO CUMPRIDA! 🏆';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-trophy" style="font-size: 1.8rem; color: var(--neon-amber);"></i>
            <div>
                <strong style="font-size: 1.15rem; color: var(--neon-amber);">🏆 ACESSO CONCEDIDO: O COFRE SUPREMO FOI ABERTO! 🏆</strong><br>
                ${atv.explicacao || 'Você concluiu todos os 20 desafios da Aula 02 de Matemática com maestria absoluta e agora é oficialmente um MESTRE DAS OPERAÇÕES BÁSICAS!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as travas destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Descubra o dígito das ${emptyCount} trava(s) pendente(s) resolvendo as pistas operatórias.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} dígito(s) incorreto(s) na combinação. Releia a pista com atenção e verifique o cálculo pericial!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-lock" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Acesso Negado: Travas Bloqueadas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// --------------------------------------------------------------------------
// HANDLERS DE VALIDAÇÃO: SÍLABAS COMPLEXAS E NOVOS ENIGMAS DE PORTUGUÊS
// --------------------------------------------------------------------------

// Validação de Mutação do H Mágico
function handleMutationSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.mutation-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(mc => {
        const selectedBtn = mc.querySelector('.mutation-opt-btn.selected');

        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
        } else if (selectedBtn.dataset.correct === 'true') {
            selectedBtn.classList.add('selected-correct');
            selectedBtn.classList.remove('selected-wrong');
        } else {
            allCorrect = false;
            wrongCount++;
            selectedBtn.classList.add('selected-wrong');
            selectedBtn.classList.remove('selected-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(mc => mc.querySelectorAll('.mutation-opt-btn').forEach(b => b.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-mutation');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Transformações Verificadas com Sucesso!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>MUTAÇÕES DESVENDADAS COM SUCESSO!</strong><br>
                ${atv.explicacao || 'Você compreendeu perfeitamente o poder do H ao formar dígrafos (LH, NH, CH)!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as opções marcadas em vermelho.';
        if (unselectedCount > 0) {
            msg = `Selecione a palavra resultante para todos os ${cards.length} casos.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} resposta(s) incorreta(s). Preste atenção em como a letra H modifica o som das consoantes L, N e C!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Atenção às Mutações:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Completar Dígrafos
function handleDigraphCompletionSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.digraph-word-card');
    let allCorrect = true;
    let unfilledCount = 0;
    let wrongCount = 0;

    cards.forEach(dc => {
        const slot = dc.querySelector('.digraph-slot-box');
        const filled = slot?.dataset.filledVal;
        const expected = slot?.dataset.expected;

        if (!filled) {
            allCorrect = false;
            unfilledCount++;
            slot?.classList.remove('correct', 'incorrect');
        } else if (filled === expected) {
            slot?.classList.add('correct');
            slot?.classList.remove('incorrect');
        } else {
            allCorrect = false;
            wrongCount++;
            slot?.classList.add('incorrect');
            slot?.classList.remove('correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(dc => dc.querySelectorAll('.digraph-pill-btn').forEach(b => b.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-digraphs');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Dígrafos Confirmados!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>DÍGRAFOS CONFIRMADOS COM PRECISÃO!</strong><br>
                ${atv.explicacao || 'Todas as palavras foram completadas com os dígrafos adequados.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os dígrafos em destaque.';
        if (unfilledCount > 0) {
            msg = `Preencha os dígrafos de todas as ${cards.length} palavras.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} dígrafo(s) incorreto(s). Pronuncie a palavra para testar o som correto!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Dígrafos Incompletos:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Identificar Intruso Silábico
function handleIntrusoSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.intruso-group-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(gc => {
        const selectedChip = gc.querySelector('.intruso-word-chip.selected');
        if (!selectedChip) {
            allCorrect = false;
            unselectedCount++;
        } else if (selectedChip.dataset.isIntruso === 'true') {
            selectedChip.classList.add('intruso-caught');
            selectedChip.classList.remove('selected-wrong');
        } else {
            allCorrect = false;
            wrongCount++;
            selectedChip.classList.add('selected-wrong');
            selectedChip.classList.remove('intruso-caught');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(gc => gc.querySelectorAll('.intruso-word-chip').forEach(b => b.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-intruso');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Intrusos Foram Desmascarados!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>PERFEITO, DETETIVE!</strong><br>
                ${atv.explicacao || 'Você identificou com precisão todos os termos que não pertenciam aos grupos silábicos!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Identifique a palavra que não segue a regra em cada grupo.';
        if (unselectedCount > 0) {
            msg = `Selecione 1 intruso em cada um dos ${cards.length} grupos.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} intruso(s) apontado(s) incorretamente. Observe atentamente a regra descrita em cada caso!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Análise de Intrusos:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Rimas Periciais
function handleRhymesSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.rhyme-clue-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(rc => {
        const selectedBtn = rc.querySelector('.rhyme-opt-btn.selected');
        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
        } else if (selectedBtn.dataset.isCorrect === 'true') {
            selectedBtn.classList.add('selected-correct');
            selectedBtn.classList.remove('selected-wrong');
        } else {
            allCorrect = false;
            wrongCount++;
            selectedBtn.classList.add('selected-wrong');
            selectedBtn.classList.remove('selected-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(rc => rc.querySelectorAll('.rhyme-opt-btn').forEach(b => b.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-rhymes');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Rimas Confirmadas!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>OUVIDO DE DETETIVE APURADO!</strong><br>
                ${atv.explicacao || 'Todas as correspondências sonoras e rimas foram confirmadas!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as opções de rima.';
        if (unselectedCount > 0) {
            msg = `Escolha uma rima para cada uma das ${cards.length} pistas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} rima(s) incorreta(s). Pronuncie o final de cada palavra para sentir o mesmo som!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Rimas em Aberto:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Anagramas Silábicos
function handleAnagramSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.anagram-card');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    cards.forEach(ac => {
        const inputs = ac.querySelectorAll('.anagram-char-input');
        let wordCorrect = true;
        inputs.forEach(inp => {
            const val = normalize(inp.value);
            const exp = normalize(inp.dataset.expected);
            if (!val) {
                allCorrect = false;
                wordCorrect = false;
                emptyCount++;
                inp.classList.add('incorrect');
            } else if (val === exp) {
                inp.classList.add('correct');
                inp.classList.remove('incorrect');
            } else {
                allCorrect = false;
                wordCorrect = false;
                wrongCount++;
                inp.classList.add('incorrect');
            }
        });
        if (wordCorrect) {
            ac.classList.add('anagram-solved');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(ac => ac.querySelectorAll('.anagram-char-input').forEach(inp => inp.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-anagrams');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todos os Anagramas Decifrados!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>ANAGRAMAS DECIFRADOS COM SUCESSO!</strong><br>
                ${atv.explicacao || 'Todas as palavras com sílabas complexas foram reconstruídas na ordem perfeita.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os quadradinhos destacados.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} letra(s) ainda vazias nas caixas dos anagramas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) fora da ordem. Use a bandeja de letras e a dica visual para acertar!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Anagramas Bloqueados:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
}

// Validação de Auditoria Ortográfica
function handleOrthoAuditSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.orthography-audit-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongCount = 0;

    cards.forEach(oc => {
        const selectedBtn = oc.querySelector('.ortho-choice-btn.selected');
        if (!selectedBtn) {
            allCorrect = false;
            unselectedCount++;
        } else if (selectedBtn.dataset.isCorrect === 'true') {
            selectedBtn.classList.add('selected-correct');
            selectedBtn.classList.remove('selected-wrong');
        } else {
            allCorrect = false;
            wrongCount++;
            selectedBtn.classList.add('selected-wrong');
            selectedBtn.classList.remove('selected-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);
        cards.forEach(oc => oc.querySelectorAll('.ortho-choice-btn').forEach(b => b.disabled = true));
        const btnVerify = cardElement.querySelector('.btn-verify-ortho');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Auditoria Concluída com Honras!';
        }
        feedbackBox.className = 'activity-feedback-box correct';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size: 1.3rem;"></i>
            <div>
                <strong>AUDITORIA APROVADA COM LOUVOR!</strong><br>
                ${atv.explicacao || 'Todas as grafias de dígrafos e encontros consonantais foram validadas com 100% de exatidão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;
        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as opções assinaladas.';
        if (unselectedCount > 0) {
            msg = `Selecione a grafia oficial em cada um dos ${cards.length} documentos.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} grafia(s) com erro ortográfico. Lembre-se das regras de dígrafos como CH, LH, NH, RR, SS e GU/QU!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div><strong>Auditoria Rejeitada:</strong> ${msg}</div>
        `;
        feedbackBox.style.display = 'flex';
    }
    updateAccumulatedScoreUI();
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

// ============================================================================
// VALIDAÇÕES DAS ATIVIDADES DE LÍNGUA PORTUGUESA
// ============================================================================

// 1. Validação do Alfabeto Lacunado
function handleAlphabetGridAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.alphabet-cell-input');
    const normalize = (str) => String(str || '').toUpperCase().trim();
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = normalize(input.value);
        const expected = normalize(input.dataset.expected);

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

        const btnVerify = cardElement.querySelector('.btn-verify-alphabet-grid');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Alfabeto Restaurado com Sucesso!';
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
                <strong>Excelente restauração, Detetive! O alfabeto confidencial de A a Z está 100% completo!</strong><br>
                ${atv.explicacao || 'Todas as 26 letras foram organizadas em ordem alfabética perfeita.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as letras destacadas em vermelho no quadro.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Ainda faltam ${emptyCount} letra(s) para serem preenchidas no alfabeto.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) fora da ordem alfabética correta. Recite o alfabeto de A a Z para conferir!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Alfabeto!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 2. Validação dos Vizinhos do Alfabeto
function handleAlphabetNeighborsAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const rows = cardElement.querySelectorAll('.letter-neighbor-card');
    const normalize = (str) => String(str || '').toUpperCase().trim();
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    rows.forEach(row => {
        const inputs = row.querySelectorAll('.letter-neighbor-input');
        let rowCorrect = true;

        inputs.forEach(input => {
            const val = normalize(input.value);
            const expected = normalize(input.dataset.expected);

            input.classList.remove('correct', 'incorrect');

            if (!val) {
                allCorrect = false;
                rowCorrect = false;
                emptyCount++;
                input.classList.add('incorrect');
            } else if (val === expected) {
                input.classList.add('correct');
            } else {
                allCorrect = false;
                rowCorrect = false;
                wrongCount++;
                input.classList.add('incorrect');
            }
        });

        if (rowCorrect) {
            row.classList.add('choice-correct');
            row.classList.remove('choice-wrong');
        } else {
            row.classList.add('choice-wrong');
            row.classList.remove('choice-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.letter-neighbor-input').forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-letter-neighbors');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Vizinhos Verificados com Sucesso!';
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
                <strong>Fantástico! Você decifrou todas as letras que vêm antes e depois com perfeição!</strong><br>
                ${atv.explicacao || 'Ordem alfabética imediata validada com sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha os ${emptyCount} vizinho(s) ainda vazios.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) incorreta(s). Lembre-se: Antes (à esquerda) e Depois (à direita)!`;
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

// 3. Validação de Completar Palavras com Desenho
function handleCompleteWordsAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.word-completion-card');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    cards.forEach(wCard => {
        const inputs = wCard.querySelectorAll('.word-char-input');
        let cardCorrect = true;

        inputs.forEach(input => {
            const val = normalize(input.value);
            const expected = normalize(input.dataset.expected);

            input.classList.remove('correct', 'incorrect');

            if (!val) {
                allCorrect = false;
                cardCorrect = false;
                emptyCount++;
                input.classList.add('incorrect');
            } else if (val === expected) {
                input.classList.add('correct');
            } else {
                allCorrect = false;
                cardCorrect = false;
                wrongCount++;
                input.classList.add('incorrect');
            }
        });

        if (cardCorrect) {
            wCard.classList.add('card-correct');
            wCard.classList.remove('card-wrong');
        } else {
            wCard.classList.add('card-wrong');
            wCard.classList.remove('card-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.word-char-input').forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-complete-words');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Palavras Decifradas com Sucesso!';
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
                <strong>Extraordinário, Agente! Todas as 6 palavras misteriosas foram completadas com sucesso!</strong><br>
                ${atv.explicacao || 'Evidências visuais decifradas com precisão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as letras destacadas em vermelho nas palavras.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Ainda faltam ${emptyCount} letra(s) para serem preenchidas nas palavras.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) incorreta(s). Pronuncie o nome do desenho em voz alta para conferir o som!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Palavras!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 4. Validação de Juntar Sílabas para Formar Palavras
function handleJoinSyllablesAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const builderCards = cardElement.querySelectorAll('.syllable-builder-card');
    let allCorrect = true;
    let incompleteCount = 0;
    let wrongCount = 0;

    builderCards.forEach((bCard, idx) => {
        const item = atv.itens[idx];
        const picked = bCard._pickedSyllables || [];
        const expectedJoined = item.ordemCorreta.join('');
        const actualJoined = picked.join('');

        bCard.classList.remove('builder-correct', 'builder-wrong');

        if (picked.length === 0) {
            allCorrect = false;
            incompleteCount++;
            bCard.classList.add('builder-wrong');
        } else if (actualJoined === expectedJoined) {
            bCard.classList.add('builder-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            bCard.classList.add('builder-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.syllable-chip-btn').forEach(btn => {
            btn.disabled = true;
        });

        cardElement.querySelectorAll('.btn-clear-syllables').forEach(btn => {
            btn.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-join-syllables');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Palavras Formadas com Sucesso!';
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
                <strong>Brilhante, Detetive! Você ordenou e juntou todas as sílabas perfeitamente!</strong><br>
                ${atv.explicacao || 'Todas as palavras foram reconstruídas na ordem silábica exata!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os cartões destacados em vermelho.';
        if (incompleteCount > 0 && wrongCount === 0) {
            msg = `Você ainda não montou todas as palavras da lista. Clique nas sílabas para formá-las!`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} palavra(s) com sílabas fora de ordem. Clique em "Limpar" no cartão para tentar montar novamente!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Montagem!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 5. Validação de Separar Sílabas
function handleSeparateSyllablesAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cards = cardElement.querySelectorAll('.syllable-splitter-card');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    cards.forEach((sCard, cIdx) => {
        const item = atv.itens[cIdx];
        const inputs = sCard.querySelectorAll('.syllable-split-input');
        let cardCorrect = true;

        inputs.forEach((input, slotIdx) => {
            const val = normalize(input.value);
            const expected = normalize(item.silabasEsperadas[slotIdx]);

            input.classList.remove('correct', 'incorrect');

            if (!val) {
                allCorrect = false;
                cardCorrect = false;
                emptyCount++;
                input.classList.add('incorrect');
            } else if (val === expected) {
                input.classList.add('correct');
            } else {
                allCorrect = false;
                cardCorrect = false;
                wrongCount++;
                input.classList.add('incorrect');
            }
        });

        if (cardCorrect) {
            sCard.classList.add('splitter-correct');
            sCard.classList.remove('splitter-wrong');
        } else {
            sCard.classList.add('splitter-wrong');
            sCard.classList.remove('splitter-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.syllable-split-input').forEach(input => {
            input.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-separate-syllables');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sílabas Separadas com Sucesso!';
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
                <strong>PARABÉNS, DETETIVE MESTRE DA LÍNGUA PORTUGUESA!</strong><br>
                ${atv.explicacao || 'Você separou todas as sílabas com 100% de exatidão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho nas separações.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} sílaba(s) ainda vazias nos campos.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} sílaba(s) incorreta(s). Dica: fale a palavra pausadamente batendo palmas a cada pedaço!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Separação!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 6. Validação de Banco de Sílabas
function handleCompleteSyllablesBankAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.syl-bank-word-input');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = normalize(input.value);
        const expected = normalize(input.dataset.expected);
        const card = input.closest('.syl-bank-word-card');

        input.classList.remove('correct', 'incorrect');
        card?.classList.remove('card-correct', 'card-wrong');

        if (!val) {
            allCorrect = false;
            emptyCount++;
            input.classList.add('incorrect');
            card?.classList.add('card-wrong');
        } else if (val === expected) {
            input.classList.add('correct');
            card?.classList.add('card-correct');
        } else {
            allCorrect = false;
            wrongCount++;
            input.classList.add('incorrect');
            card?.classList.add('card-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        inputs.forEach(input => {
            input.disabled = true;
        });

        cardElement.querySelectorAll('.syl-bank-chip-btn').forEach(btn => {
            btn.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-complete-syllables-bank');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as Palavras Completadas com Sucesso!';
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
                <strong>Excelente, Detetive! Você completou todas as palavras com as sílabas corretas do banco pericial!</strong><br>
                ${atv.explicacao || 'Evidências completadas com precisão!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os campos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} palavra(s) que ainda estão incompletas.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} sílaba(s) incorreta(s). Consulte as opções no Banco de Sílabas acima!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção às Sílabas!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 7. Validação de Sílaba Fixa (Radar Silábico)
function handleFixedSyllableAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const cardsList = cardElement.querySelectorAll('.fixed-syl-card');
    let allCorrect = true;
    let unselectedCount = 0;
    let wrongSelectedCount = 0;

    cardsList.forEach(fCard => {
        const itemIdx = parseInt(fCard.dataset.itemIdx, 10);
        const item = atv.itens[itemIdx];
        const buttons = fCard.querySelectorAll('.btn-fixed-syl-option');
        let cardAllCorrect = true;

        buttons.forEach(btn => {
            const isValid = (btn.dataset.valid === 'true');
            const isSelected = btn.classList.contains('selected');

            btn.classList.remove('selected-correct', 'selected-wrong');

            if (isValid && !isSelected) {
                cardAllCorrect = false;
                allCorrect = false;
                unselectedCount++;
            } else if (!isValid && isSelected) {
                cardAllCorrect = false;
                allCorrect = false;
                wrongSelectedCount++;
                btn.classList.add('selected-wrong');
            } else if (isValid && isSelected) {
                btn.classList.add('selected-correct');
            }
        });

        if (cardAllCorrect) {
            fCard.classList.add('fixed-card-correct');
            fCard.classList.remove('fixed-card-wrong');
        } else {
            fCard.classList.add('fixed-card-wrong');
            fCard.classList.remove('fixed-card-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.btn-fixed-syl-option').forEach(btn => {
            btn.disabled = true;
        });

        const btnVerify = cardElement.querySelector('.btn-verify-fixed-syllables');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Radar Silábico Calibrado com Sucesso!';
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
                <strong>Fantástico, Agente! Você identificou todas as palavras possíveis com as sílabas fixas!</strong><br>
                ${atv.explicacao || 'Todas as combinações válidas foram desvendadas.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as opções nos cartões destacados em vermelho.';
        if (wrongSelectedCount > 0 && unselectedCount > 0) {
            msg = `Há sílabas marcadas que não formam palavras reais e faltam outras válidas para serem marcadas.`;
        } else if (wrongSelectedCount > 0) {
            msg = `Há ${wrongSelectedCount} sílaba(s) que não forma(m) palavra real com a sílaba fixa (destacada em vermelho).`;
        } else if (unselectedCount > 0) {
            msg = `Ainda faltam ${unselectedCount} combinação(ões) válida(s) para serem selecionadas nos cartões.`;
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

// 8. Validação de Classificação de Sílabas
function handleSyllableCountClassifyAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const placements = cardElement._classifierState?.placements || {};
    let allCorrect = true;
    let unplacedCount = 0;
    let wrongCategoryCount = 0;

    atv.palavras.forEach(w => {
        const placedCat = placements[w.id];
        if (!placedCat) {
            allCorrect = false;
            unplacedCount++;
        } else if (placedCat !== w.categoriaCorreta) {
            allCorrect = false;
            wrongCategoryCount++;
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.classifier-word-chip').forEach(c => c.disabled = true);
        cardElement.querySelectorAll('.placed-word-pill').forEach(p => {
            p.disabled = true;
            p.classList.add('correct');
            const xIcon = p.querySelector('i');
            if (xIcon) xIcon.remove();
        });

        const btnReset = cardElement.querySelector(`#btn-reset-classifier-${atv.id}`);
        if (btnReset) btnReset.disabled = true;

        const btnVerify = cardElement.querySelector('.btn-verify-syllable-count');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as 12 Evidências Arquivadas com Sucesso!';
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
                <strong>Incrível organização, Detetive! Monossílabas, Dissílabas, Trissílabas e Polissílabas catalogadas com louvor pericial!</strong><br>
                ${atv.explicacao || 'Arquivo pericial 100% organizado.'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as gavetas do arquivo.';
        if (unplacedCount > 0 && wrongCategoryCount === 0) {
            msg = `Ainda faltam ${unplacedCount} palavra(s) do banco para serem arquivadas nas gavetas.`;
        } else if (wrongCategoryCount > 0) {
            msg = `Há ${wrongCategoryCount} palavra(s) na gaveta errada. Lembre-se: Monossílaba = 1 sílaba, Dissílaba = 2, Trissílaba = 3, Polissílaba = 4 ou mais!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção ao Arquivo!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 9. Validação do Caça-Palavras
function handleWordSearchAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const foundWords = cardElement._wsState?.foundWords || [];
    const totalWords = atv.palavras.length;
    const remainingCount = totalWords - foundWords.length;

    if (remainingCount === 0) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.ws-grid-cell').forEach(c => c.disabled = true);
        const btnClear = cardElement.querySelector(`#btn-clear-ws-${atv.id}`);
        if (btnClear) btnClear.disabled = true;

        const btnVerify = cardElement.querySelector('.btn-verify-wordsearch');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as 6 Palavras Encontradas no Caça-Palavras!';
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
                <strong>Sensacional, Perito! Todas as 6 palavras-chave foram localizadas e destacadas na grade pericial!</strong><br>
                ${atv.explicacao || 'Caça-palavras desvendado com sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Ainda há palavras ocultas!</strong> Faltam ${remainingCount} palavra(s) para encontrar na grade. Clique nas letras em sequência na horizontal ou vertical.
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 10. Validação de Texto do Bilhete + Compreensão
function handleNoteComprehensionAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const letterInputs = cardElement.querySelectorAll('.note-char-input');
    const questionCards = cardElement.querySelectorAll('.note-question-card');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let allCorrect = true;
    let letterErrors = 0;
    let letterEmpty = 0;
    let questionErrors = 0;
    let questionUnanswered = 0;

    // 1. Valida letras do bilhete
    letterInputs.forEach(input => {
        const val = normalize(input.value);
        const expected = normalize(input.dataset.expected);

        input.classList.remove('correct', 'incorrect');

        if (!val) {
            allCorrect = false;
            letterEmpty++;
            input.classList.add('incorrect');
        } else if (val === expected) {
            input.classList.add('correct');
        } else {
            allCorrect = false;
            letterErrors++;
            input.classList.add('incorrect');
        }
    });

    // 2. Valida perguntas de compreensão
    questionCards.forEach(qCard => {
        const expected = qCard.dataset.expected;
        const hiddenInput = qCard.querySelector('.note-question-answer-val');
        const chosen = hiddenInput ? hiddenInput.value : '';

        qCard.classList.remove('q-correct', 'q-wrong');

        if (!chosen) {
            allCorrect = false;
            questionUnanswered++;
            qCard.classList.add('q-wrong');
        } else if (chosen === expected) {
            qCard.classList.add('q-correct');
        } else {
            allCorrect = false;
            questionErrors++;
            qCard.classList.add('q-wrong');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        letterInputs.forEach(input => input.disabled = true);
        cardElement.querySelectorAll('.note-bank-chip').forEach(chip => chip.disabled = true);
        cardElement.querySelectorAll('.btn-note-choice').forEach(btn => btn.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-note-comprehension');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Bilhete e Respostas Validados com Sucesso!';
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
                <strong>Perfeito, Agente! O bilhete secreto foi totalmente restaurado e todas as 3 perguntas foram respondidas com exatidão!</strong><br>
                ${atv.explicacao || 'Leitura e interpretação concluídas com louvor!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = '';
        if (letterEmpty > 0 || letterErrors > 0) {
            msg += `Preencha/corrija as letras em destaque no bilhete secreto. `;
        }
        if (questionUnanswered > 0 || questionErrors > 0) {
            msg += `Revise as 3 perguntas de compreensão abaixo do texto.`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Interpretação!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 11. Validação de Cruzadinha Simples
function handleSimpleCrosswordAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const rows = cardElement.querySelectorAll('.crossword-row-card');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    rows.forEach(row => {
        const inputs = row.querySelectorAll('.crossword-cell-input');
        let rowCorrect = true;

        inputs.forEach(input => {
            const val = normalize(input.value);
            const expected = normalize(input.dataset.expected);

            input.classList.remove('correct', 'incorrect');

            if (!val) {
                allCorrect = false;
                rowCorrect = false;
                emptyCount++;
                input.classList.add('incorrect');
            } else if (val === expected) {
                input.classList.add('correct');
            } else {
                allCorrect = false;
                rowCorrect = false;
                wrongCount++;
                input.classList.add('incorrect');
            }
        });

        if (rowCorrect) {
            row.classList.add('row-correct');
            row.classList.remove('row-wrong');
        } else {
            row.classList.add('row-wrong');
            row.classList.remove('row-correct');
        }
    });

    if (allCorrect) {
        onEnigmaSolvedSuccess(atv, cardElement);

        cardElement.querySelectorAll('.crossword-cell-input').forEach(input => input.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-simple-crossword');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Todas as 6 Adivinhas Decifradas com Sucesso!';
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
                <strong>Extraordinário, Detetive! Você solucionou todas as adivinhas e completou a cruzadinha com 100% de acerto!</strong><br>
                ${atv.explicacao || 'Cruzadinha pericial finalizada com sucesso!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique as palavras nas linhas destacadas em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} letra(s) ainda vazias nas caixas da cruzadinha.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) incorreta(s). Leia com atenção as pistas e conte o número de quadradinhos!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Atenção à Cruzadinha!</strong> ${msg}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    }

    updateAccumulatedScoreUI();
}

// 12. Validação de Criptograma Numérico
function handleNumericCryptogramAnswerSubmit(atv, cardElement) {
    const feedbackBox = cardElement.querySelector(`#feedback-${atv.id}`);
    const inputs = cardElement.querySelectorAll('.crypto-char-input');
    const normalize = (str) => String(str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let allCorrect = true;
    let emptyCount = 0;
    let wrongCount = 0;

    inputs.forEach(input => {
        const val = normalize(input.value);
        const expected = normalize(input.dataset.expected);

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

        inputs.forEach(input => input.disabled = true);

        const btnVerify = cardElement.querySelector('.btn-verify-cryptogram');
        if (btnVerify) {
            btnVerify.disabled = true;
            btnVerify.innerHTML = '<i class="fa-solid fa-circle-check"></i> Criptograma e Relatório Supremo Decifrados com Sucesso!';
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
                <strong>PARABÉNS, DETETIVE SUPREMO DA LÍNGUA PORTUGUESA! O CRIPTOGRAMA FOI DECIFRADO!</strong><br>
                ${atv.explicacao || 'Todos os enigmas da investigação foram desvendados com 100% de aproveitamento pericial!'}
            </div>
        `;
        feedbackBox.style.display = 'flex';
    } else {
        soundManager.playError();
        AppState.currentLessonScores[atv.id] = 0;

        feedbackBox.className = 'activity-feedback-box incorrect';
        let msg = 'Verifique os quadradinhos destacados em vermelho.';
        if (emptyCount > 0 && wrongCount === 0) {
            msg = `Preencha as ${emptyCount} letra(s) ainda vazias de acordo com os números.`;
        } else if (wrongCount > 0) {
            msg = `Há ${wrongCount} letra(s) incorreta(s). Consulte a Tabela de Decodificação no topo para conferir qual letra pertence a cada número!`;
        }
        feedbackBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.3rem;"></i>
            <div>
                <strong>Criptograma Bloqueado!</strong> ${msg}
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
            sessionStorage.setItem('decifradores_is_teacher', 'true');
            dbService.clearActiveStudent();
            updateHeaderAuthUI();
            soundManager.playSuccess();

            // SE EXISTIR UMA SESSÃO DE "JOGAR JUNTO" ATIVA EM ANDAMENTO, ABRE DIRETO NELA!
            const isLiveOngoing = AppState.currentLiveSession && ['lobby', 'playing', 'enigma_ranking'].includes(AppState.currentLiveSession.status);
            if (isLiveOngoing) {
                const subject = getDisciplina(AppState.currentLiveSession.subjectKey);
                const lesson = getAula(AppState.currentLiveSession.subjectKey, AppState.currentLiveSession.lessonId);
                const lessonTitle = lesson ? `Aula ${lesson.numero}: ${lesson.titulo}` : AppState.currentLiveSession.lessonTitle;
                document.getElementById('teacher-live-lesson-title').textContent = `${subject?.nome || 'MATEMÁTICA'} • ${lessonTitle}`;
                
                showView('view-teacher-live-session');
                handleLiveSessionUpdate(AppState.currentLiveSession);
                showToast('📡 Retornando à sessão do "Jogar Junto" em andamento!', 'info', 4000);
            } else {
                showToast('Acesso concedido ao Painel do Professor!', 'success');
                openTeacherDashboard();
            }
        } else {
            soundManager.playError();
            showToast('Senha de professor incorreta! Verifique e tente novamente.', 'error');
        }
    });

    // Sair do Painel do Professor
    document.getElementById('btn-teacher-exit')?.addEventListener('click', () => {
        soundManager.playClick();
        sessionStorage.removeItem('decifradores_is_teacher');
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

        // Notifica imediatamente na tela do aluno e entra no estado de espera/ranking em tempo real
        renderStudentLiveWaiting(AppState.currentLiveSession);
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

    // Professor Avança para o Próximo Enigma (Botão Superior e Inferior)
    const handleTeacherAdvanceEnigma = async () => {
        soundManager.playClick();
        if (!AppState.currentLiveSession) return;
        await liveSessionService.advanceToNextEnigma();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.getElementById('btn-teacher-next-enigma')?.addEventListener('click', handleTeacherAdvanceEnigma);
    document.getElementById('btn-teacher-next-enigma-bottom')?.addEventListener('click', handleTeacherAdvanceEnigma);

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
        stopStudentRunnerGame();
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
                const myHistory = myParticipant?.history?.[session.currentActivityIndex];
                const isSolved = (myParticipant?.status === 'solved') || (myHistory && myHistory.solved);
                if (isSolved) {
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

    // 2. VISÃO DO PROFESSOR
    if (AppState.isTeacher) {
        const isLiveOngoing = ['lobby', 'playing', 'enigma_ranking'].includes(session.status);

        if (isLiveOngoing) {
            const subject = getDisciplina(session.subjectKey);
            const lesson = getAula(session.subjectKey, session.lessonId);
            const lessonTitle = lesson ? `Aula ${lesson.numero}: ${lesson.titulo}` : session.lessonTitle;
            document.getElementById('teacher-live-lesson-title').textContent = `${subject?.nome || 'MATEMÁTICA'} • ${lessonTitle}`;

            // Se o professor estiver no dashboard, na landing ou já na tela ao vivo, sincroniza na tela ao vivo
            const teacherDashActive = document.getElementById('view-teacher-dashboard')?.classList.contains('active');
            const welcomeActive = document.getElementById('view-welcome')?.classList.contains('active');
            if (teacherDashActive || welcomeActive || !document.querySelector('.view-section.active')) {
                showView('view-teacher-live-session');
            }
        }

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
    const isPlayerSolved = (p) => (p.status === 'solved') || (p.history && p.history[session.currentActivityIndex] && p.history[session.currentActivityIndex].solved);
    const solvedCount = participantesList.filter(isPlayerSolved).length;

    const solvedCountText = `${solvedCount} / ${totalCount} Concluíram`;
    const counterTop = document.getElementById('teacher-live-solved-counter');
    const counterBottom = document.getElementById('teacher-live-solved-counter-bottom');
    if (counterTop) counterTop.textContent = solvedCountText;
    if (counterBottom) counterBottom.textContent = solvedCountText;

    const btnNextTop = document.getElementById('btn-teacher-next-enigma');
    const btnNextBottom = document.getElementById('btn-teacher-next-enigma-bottom');
    const nextBtnHtml = (session.currentActivityIndex >= session.totalEnigmas - 1)
        ? '<span>Ver Pódio Final</span> <i class="fa-solid fa-trophy"></i>'
        : '<span>Próximo Enigma</span> <i class="fa-solid fa-forward-step"></i>';

    if (btnNextTop) btnNextTop.innerHTML = nextBtnHtml;
    if (btnNextBottom) btnNextBottom.innerHTML = nextBtnHtml;

    // Grid de Status dos Alunos (Apenas Codinomes)
    const statusGrid = document.getElementById('teacher-live-agents-status-grid');
    if (statusGrid) {
        statusGrid.innerHTML = '';
        participantesList.forEach(p => {
            const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === p.avatar) || AVATARES_DISPONIVEIS[0];
            const isSolved = isPlayerSolved(p);
            const card = document.createElement('div');
            card.className = `live-agent-status-card ${isSolved ? 'solved' : 'answering'}`;
            card.innerHTML = `
                <div style="font-size: 1.65rem;">${avatarObj.icone}</div>
                <div style="flex: 1; min-width: 0;">
                    <div class="live-agent-name">${p.codinome}</div>
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
        const ranking = (session.activeEnigmaRanking && session.activeEnigmaRanking.length > 0)
            ? session.activeEnigmaRanking
            : (liveSessionService.computeEnigmaRanking ? liveSessionService.computeEnigmaRanking(session.participantes, session.currentActivityIndex) : []);
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
                        <strong class="live-rank-name">${item.codinome}</strong>
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
    stopStudentRunnerGame();
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
    stopStudentRunnerGame();
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
    const myParticipant = session.participantes?.[myCodename];
    const myHistory = myParticipant?.history?.[session.currentActivityIndex];
    const isSolved = (myParticipant?.status === 'solved') || (myHistory && myHistory.solved);

    const headline = document.getElementById('student-waiting-headline');
    const subtext = document.getElementById('student-waiting-subtext');

    if (isSolved) {
        headline.textContent = '✅ Enigma Solucionado com Sucesso!';
        subtext.innerHTML = `Você decifrou o enigma com sucesso e conquistou <strong>+50 XP</strong>! Aguarde o Professor autorizar o próximo caso!`;
    } else {
        headline.textContent = '⏳ Rodada Finalizada!';
        subtext.innerHTML = `O tempo desta pista foi encerrado. Prepare-se para o próximo enigma!`;
    }

    const rankList = document.getElementById('student-waiting-enigma-rank-list');
    if (rankList) {
        rankList.innerHTML = '';
        const ranking = (session.activeEnigmaRanking && session.activeEnigmaRanking.length > 0)
            ? session.activeEnigmaRanking
            : (liveSessionService.computeEnigmaRanking ? liveSessionService.computeEnigmaRanking(session.participantes, session.currentActivityIndex) : []);
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
                        <strong class="live-rank-name">${r.codinome} ${isMe ? ' (Você)' : ''}</strong>
                    </div>
                    <span class="live-rank-time" style="color: var(--neon-emerald); font-weight: 700;">✅ Concluído (+${r.score} XP)</span>
                `;
                rankList.appendChild(row);
            });
        }
    }

    // Inicializa o mini-game na tela de espera
    initStudentRunnerGame();
}

// Renderiza Pódio Final do Aluno
function renderStudentLivePodium(session) {
    stopStudentRunnerGame();
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
            <div class="student-final-summary-card">
                <h3>Sua Classificação Pericial</h3>
                <div style="font-size: 2.2rem; font-weight: 900; color: var(--neon-amber); margin: 0.5rem 0;">${myRank.posicao}º LUGAR</div>
                <p style="margin-bottom: 0;">Pontuação Total: <strong>${myRank.totalScore} XP</strong></p>
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
                return `<span class="ranking-history-agent-item">
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
            <div class="ranking-history-podium-box">
                <div style="font-size: 0.78rem; text-transform: uppercase; color: var(--neon-amber); font-weight: 800; margin-bottom: 0.35rem;">🏆 Pódio da Partida:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${podiumSnippet || '<span style="color: var(--text-muted);">Sem pódio gravado</span>'}
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

// ============================================================================
// 10. MINI-GAME: CORRIDA DO DETETIVE (TELA DE ESPERA DO JOGAR JUNTO)
// ============================================================================

class StudentRunnerMiniGame {
    constructor() {
        this.canvas = document.getElementById('student-runner-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.distEl = document.getElementById('runner-score-dist');
        this.highEl = document.getElementById('runner-score-high');
        this.overlay = document.getElementById('runner-game-overlay');
        this.overlayIcon = document.getElementById('runner-overlay-icon');
        this.overlayHeadline = document.getElementById('runner-overlay-headline');
        this.overlaySubtext = document.getElementById('runner-overlay-subtext');
        this.startBtn = document.getElementById('btn-runner-start');
        this.jumpBtn = document.getElementById('btn-runner-jump-mobile');
        this.charToggleBadge = document.getElementById('runner-char-toggle-badge');
        this.charPreview = document.getElementById('runner-char-preview');

        // Dimensões do jogo ampliadas para máxima visibilidade
        this.width = 800;
        this.height = 240;
        this.groundY = 195;

        this.highScore = parseInt(localStorage.getItem('decifradores_runner_highscore') || '0', 10);
        if (isNaN(this.highScore)) this.highScore = 0;
        this.updateScoreDisplay(0, this.highScore);

        // Personagem selecionado (Dino ou Avatar do Detetive)
        this.useDino = true;
        this.updateCharacterEmoji();

        // Estado do jogo
        this.isRunning = false;
        this.isGameOver = false;
        this.animationId = null;

        this.reset();

        // Handlers
        this.handleKeyDown = this.onKeyDown.bind(this);
        this.handleCanvasClick = this.onAction.bind(this);
        this.handleStartClick = this.onStartClick.bind(this);
        this.handleJumpClick = this.onAction.bind(this);
        this.handleIconToggle = this.toggleCharacter.bind(this);

        this.attachListeners();
        this.renderIdleScreen();
    }

    updateCharacterEmoji() {
        if (this.useDino) {
            this.characterEmoji = '🦖';
        } else {
            const studentAvatar = AppState.activeStudent?.avatar;
            const avatarObj = AVATARES_DISPONIVEIS.find(a => a.id === studentAvatar);
            this.characterEmoji = avatarObj ? avatarObj.icone : '🕵️';
        }
        if (this.overlayIcon) {
            this.overlayIcon.textContent = this.characterEmoji;
            this.overlayIcon.title = 'Clique para alternar entre o Dino e seu Avatar!';
            this.overlayIcon.style.cursor = 'pointer';
        }
        if (this.charPreview) {
            this.charPreview.textContent = this.useDino ? '🦖 Dino' : `${this.characterEmoji} Avatar`;
        }
    }

    toggleCharacter() {
        this.useDino = !this.useDino;
        this.updateCharacterEmoji();
        if (!this.isRunning) {
            this.renderIdleScreen();
        }
    }

    reset() {
        this.distance = 0;
        this.lastMilestone = 0;
        this.speed = 4.6;
        this.groundOffset = 0;

        this.player = {
            x: 55,
            y: this.groundY - 48,
            width: 44,
            height: 48,
            vy: 0,
            gravity: 0.72,
            jumpForce: -13.6,
            isGrounded: true,
            legPhase: 0
        };

        this.obstacles = [];
        this.spawnTimer = 55;

        this.stars = [];
        for (let i = 0; i < 28; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * (this.groundY - 55),
                size: Math.random() * 2.5 + 1,
                alpha: Math.random() * 0.7 + 0.3
            });
        }

        this.clouds = [
            { x: 100, y: 28, width: 75, speed: 0.28 },
            { x: 380, y: 50, width: 95, speed: 0.38 },
            { x: 650, y: 25, width: 65, speed: 0.22 }
        ];
    }

    attachListeners() {
        window.addEventListener('keydown', this.handleKeyDown);
        if (this.canvas) this.canvas.addEventListener('click', this.handleCanvasClick);
        if (this.startBtn) this.startBtn.addEventListener('click', this.handleStartClick);
        if (this.jumpBtn) this.jumpBtn.addEventListener('click', this.handleJumpClick);
        if (this.overlayIcon) this.overlayIcon.addEventListener('click', this.handleIconToggle);
        if (this.charToggleBadge) this.charToggleBadge.addEventListener('click', this.handleIconToggle);
    }

    detachListeners() {
        window.removeEventListener('keydown', this.handleKeyDown);
        if (this.canvas) this.canvas.removeEventListener('click', this.handleCanvasClick);
        if (this.startBtn) this.startBtn.removeEventListener('click', this.handleStartClick);
        if (this.jumpBtn) this.jumpBtn.removeEventListener('click', this.handleJumpClick);
        if (this.overlayIcon) this.overlayIcon.removeEventListener('click', this.handleIconToggle);
        if (this.charToggleBadge) this.charToggleBadge.removeEventListener('click', this.handleIconToggle);
    }

    onKeyDown(e) {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
            const container = document.getElementById('student-runner-game-container');
            if (container && container.offsetParent !== null) {
                e.preventDefault();
                this.onAction();
            }
        }
    }

    onStartClick(e) {
        if (e) e.stopPropagation();
        this.start();
    }

    onAction() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.jump();
        }
    }

    start() {
        this.reset();
        this.isRunning = true;
        this.isGameOver = false;

        if (this.overlay) {
            this.overlay.classList.add('hidden');
        }

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.lastTime = performance.now();
        soundManager.playClick();
        this.loop(this.lastTime);
    }

    jump() {
        if (this.player.isGrounded && this.isRunning && !this.isGameOver) {
            this.player.vy = this.player.jumpForce;
            this.player.isGrounded = false;
            soundManager.playJump();
        }
    }

    gameOver() {
        this.isRunning = false;
        this.isGameOver = true;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        const currentDist = Math.floor(this.distance);
        let isNewRecord = false;
        if (currentDist > this.highScore) {
            this.highScore = currentDist;
            localStorage.setItem('decifradores_runner_highscore', String(this.highScore));
            isNewRecord = true;
        }

        this.updateScoreDisplay(currentDist, this.highScore);

        if (isNewRecord && currentDist > 25) {
            soundManager.playFanfare();
        } else {
            soundManager.playError();
        }

        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            if (this.overlayHeadline) {
                this.overlayHeadline.textContent = isNewRecord ? '🎉 NOVO RECORDE PERICIAL!' : '💥 Fim da Corrida!';
            }
            if (this.overlaySubtext) {
                this.overlaySubtext.innerHTML = `Você correu <strong>${currentDist}m</strong>. ${isNewRecord ? 'Excelente agilidade!' : 'Pressione Espaço ou clique para tentar de novo!'}`;
            }
            if (this.startBtn) {
                this.startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Correr Novamente';
            }
        }

        this.draw();
    }

    updateScoreDisplay(dist, high) {
        if (this.distEl) {
            this.distEl.textContent = String(dist).padStart(4, '0') + 'm';
        }
        if (this.highEl) {
            this.highEl.textContent = String(high).padStart(4, '0') + 'm';
        }
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        this.update(dt);
        this.draw();

        if (this.isRunning) {
            this.animationId = requestAnimationFrame(t => this.loop(t));
        }
    }

    update(dt) {
        this.speed = Math.min(11.5, 4.6 + (this.distance / 250));
        this.distance += this.speed * 0.08;

        const currentDist = Math.floor(this.distance);
        this.updateScoreDisplay(currentDist, this.highScore);

        // Celebração a cada 100 metros
        if (currentDist > 0 && currentDist % 100 === 0 && currentDist !== this.lastMilestone) {
            this.lastMilestone = currentDist;
            soundManager.playSuccess();
            if (this.distEl) {
                this.distEl.style.color = '#fbbf24';
                setTimeout(() => {
                    if (this.distEl) this.distEl.style.color = '';
                }, 1200);
            }
        }

        // Física do pulo
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;

        if (this.player.y >= this.groundY - this.player.height) {
            this.player.y = this.groundY - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
            this.player.legPhase += this.speed * 0.18;
        } else {
            this.player.isGrounded = false;
        }

        // Movimento da pista
        this.groundOffset = (this.groundOffset + this.speed) % 36;

        // Movimento das nuvens
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed + (this.speed * 0.05);
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.width + Math.random() * 90;
                cloud.y = 15 + Math.random() * 45;
            }
        });

        // Spawn de obstáculos
        this.spawnTimer -= 1;
        if (this.spawnTimer <= 0) {
            this.spawnObstacle();
            const minGap = Math.max(48, Math.floor(100 - (this.speed * 3.5)));
            this.spawnTimer = minGap + Math.floor(Math.random() * 50);
        }

        // Atualização e colisão dos obstáculos
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.speed;

            if (obs.type === 'drone') {
                obs.floatPhase = (obs.floatPhase || 0) + 0.1;
                obs.currentY = obs.y + Math.sin(obs.floatPhase) * 5;
            }

            const obsY = obs.type === 'drone' ? obs.currentY : obs.y;
            if (this.checkCollision(this.player, { ...obs, y: obsY })) {
                this.gameOver();
                return;
            }

            if (obs.x + obs.width < -15) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    spawnObstacle() {
        const types = ['cone', 'double-cone', 'cactus'];
        if (this.distance > 70 && Math.random() > 0.55) {
            types.push('drone');
        }

        const type = types[Math.floor(Math.random() * types.length)];
        let obs = null;

        if (type === 'cone') {
            obs = { type: 'cone', x: this.width + 10, y: this.groundY - 38, width: 28, height: 38 };
        } else if (type === 'double-cone') {
            obs = { type: 'double-cone', x: this.width + 10, y: this.groundY - 38, width: 56, height: 38 };
        } else if (type === 'cactus') {
            obs = { type: 'cactus', x: this.width + 10, y: this.groundY - 50, width: 34, height: 50 };
        } else if (type === 'drone') {
            obs = { type: 'drone', x: this.width + 10, y: this.groundY - 78, width: 40, height: 28, floatPhase: 0 };
        }

        if (obs) this.obstacles.push(obs);
    }

    checkCollision(p, o) {
        const margin = 7;
        const pLeft = p.x + margin;
        const pRight = p.x + p.width - margin;
        const pTop = p.y + margin;
        const pBottom = p.y + p.height - 3;

        const oLeft = o.x + margin;
        const oRight = o.x + o.width - margin;
        const oTop = o.y + margin;
        const oBottom = o.y + o.height;

        return !(pRight < oLeft || pLeft > oRight || pBottom < oTop || pTop > oBottom);
    }

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';

        // Fundo
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.fillStyle = isLight ? '#f8fafc' : '#080e1e';
        ctx.fillRect(0, 0, this.width, this.height);

        if (!isLight) {
            // Fundo escuro: estrelas e lua
            ctx.fillStyle = '#38bdf8';
            this.stars.forEach(star => {
                ctx.globalAlpha = star.alpha;
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });
            ctx.globalAlpha = 1;

            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(720, 42, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#080e1e';
            ctx.beginPath();
            ctx.arc(726, 39, 15, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Fundo claro: nuvens suaves
            ctx.fillStyle = 'rgba(14, 165, 233, 0.16)';
            this.clouds.forEach(cloud => {
                ctx.beginPath();
                ctx.roundRect(cloud.x, cloud.y, cloud.width, 22, 11);
                ctx.fill();
            });
        }

        // Linha do solo
        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, this.groundY);
        ctx.lineTo(this.width, this.groundY);
        ctx.stroke();

        // Linhas tracejadas simulando pista pericial veloz
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        for (let x = -this.groundOffset; x < this.width; x += 36) {
            ctx.beginPath();
            ctx.moveTo(x, this.groundY + 10);
            ctx.lineTo(x + 18, this.groundY + 10);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + 12, this.groundY + 22);
            ctx.lineTo(x + 26, this.groundY + 22);
            ctx.stroke();
        }

        // Sombra do corredor
        ctx.fillStyle = isLight ? 'rgba(15, 23, 42, 0.2)' : 'rgba(0, 0, 0, 0.5)';
        const shadowY = this.groundY + 3;
        const jumpDistance = (this.groundY - this.player.height) - this.player.y;
        const shadowScale = Math.max(0.3, 1 - (jumpDistance / 110));
        ctx.beginPath();
        ctx.ellipse(
            this.player.x + (this.player.width / 2),
            shadowY,
            (this.player.width / 2) * shadowScale,
            6 * shadowScale,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Personagem em escala grande e legível
        ctx.save();
        ctx.font = '46px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const tilt = this.player.isGrounded ? Math.sin(this.player.legPhase) * 0.06 : -0.12;
        ctx.translate(this.player.x + (this.player.width / 2), this.player.y + this.player.height);
        ctx.rotate(tilt);
        ctx.fillText(this.characterEmoji, 0, 4);
        ctx.restore();

        // Obstáculos ampliados e nítidos
        this.obstacles.forEach(obs => {
            const obsY = obs.type === 'drone' ? obs.currentY : obs.y;

            if (obs.type === 'cone' || obs.type === 'double-cone') {
                const count = obs.type === 'double-cone' ? 2 : 1;
                const singleW = 26;
                for (let k = 0; k < count; k++) {
                    const cx = obs.x + (k * 28);
                    const grad = ctx.createLinearGradient(cx, obsY, cx, obsY + obs.height);
                    grad.addColorStop(0, '#f97316');
                    grad.addColorStop(1, '#ea580c');
                    ctx.fillStyle = grad;

                    ctx.beginPath();
                    ctx.moveTo(cx + (singleW / 2), obsY);
                    ctx.lineTo(cx + singleW, obsY + obs.height);
                    ctx.lineTo(cx, obsY + obs.height);
                    ctx.closePath();
                    ctx.fill();

                    // Faixa branca reflexiva
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(cx + 5, obsY + 18);
                    ctx.lineTo(cx + singleW - 5, obsY + 18);
                    ctx.lineTo(cx + singleW - 8, obsY + 25);
                    ctx.lineTo(cx + 8, obsY + 25);
                    ctx.closePath();
                    ctx.fill();
                }
            } else if (obs.type === 'cactus') {
                ctx.fillStyle = isLight ? '#059669' : '#10b981';
                ctx.beginPath();
                ctx.roundRect(obs.x + 8, obsY, 8, obs.height, 4);
                ctx.fill();

                ctx.beginPath();
                ctx.roundRect(obs.x, obsY + 8, 8, 14, 4);
                ctx.fill();
                ctx.fillRect(obs.x, obsY + 18, 12, 5);

                ctx.beginPath();
                ctx.roundRect(obs.x + 16, obsY + 12, 8, 14, 4);
                ctx.fill();
                ctx.fillRect(obs.x + 12, obsY + 22, 12, 5);
            } else if (obs.type === 'drone') {
                ctx.save();
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🛸', obs.x + (obs.width / 2), obsY + (obs.height / 2));
                ctx.restore();
            }
        });
    }

    renderIdleScreen() {
        this.draw();
        if (this.overlay) {
            this.overlay.classList.remove('hidden');
            if (this.overlayHeadline) this.overlayHeadline.textContent = 'Corrida dos Detetives';
            if (this.overlaySubtext) this.overlaySubtext.textContent = 'Pule os obstáculos enquanto espera a turma terminar!';
            if (this.startBtn) this.startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar Corrida';
        }
    }

    cleanup() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.detachListeners();
    }
}

let activeStudentRunnerGame = null;

function initStudentRunnerGame() {
    if (!activeStudentRunnerGame) {
        activeStudentRunnerGame = new StudentRunnerMiniGame();
    } else {
        // Atualiza o emoji do personagem caso tenha mudado avatar
        activeStudentRunnerGame.updateCharacterEmoji();
    }
}

function stopStudentRunnerGame() {
    if (activeStudentRunnerGame) {
        activeStudentRunnerGame.cleanup();
        activeStudentRunnerGame = null;
    }
}

