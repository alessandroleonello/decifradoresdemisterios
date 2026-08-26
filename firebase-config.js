// ============================================================================
// Decifradores de Mistérios - Firebase Firestore & Storage Service
// ============================================================================

const STORAGE_KEYS = {
    STUDENTS: 'decifradores_students',
    ACTIVE_STUDENT: 'decifradores_active_student',
    FIREBASE_CONFIG: 'decifradores_firebase_config',
    CUSTOM_LESSONS: 'decifradores_custom_lessons'
};

// ============================================================================
// COLE AQUI AS CHAVES DO SEU PROJETO FIREBASE:
// ============================================================================
window.DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDjcBPPYN5PKYi3tWP_hgEOZk6tCBy85Wo",
    authDomain: "decifradores-de-misterios.firebaseapp.com",
    projectId: "decifradores-de-misterios",
    storageBucket: "decifradores-de-misterios.firebasestorage.app",
    messagingSenderId: "527457459429",
    appId: "1:527457459429:web:03b5b5de648aa2c9f9c80c"
};

// Configuração interna do Firebase
let firebaseApp = null;
let firestoreDb = null;
let isFirebaseReady = false;

// Inicializador do Firebase
function initFirebase() {
    try {
        const savedConfigStr = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
        const config = savedConfigStr ? JSON.parse(savedConfigStr) : window.DEFAULT_FIREBASE_CONFIG;

        if (config && config.apiKey && config.projectId && config.apiKey !== "SUA_API_KEY_AQUI" && typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebaseApp = firebase.initializeApp(config);
            } else {
                firebaseApp = firebase.app();
            }
            firestoreDb = firebase.firestore();
            isFirebaseReady = true;
            console.log("🕵️‍♂️ [Firebase] Firestore conectado com sucesso!");
        } else {
            console.warn("🔍 [Storage] Firebase não configurado ou offline. Usando modo de Armazenamento Local Inteligente.");
            isFirebaseReady = false;
        }
    } catch (err) {
        console.error("⚠️ [Firebase Init Error]:", err);
        isFirebaseReady = false;
    }
}

// Objeto de Gerenciamento de Dados (Camada Unificada Firestore + Fallback LocalStorage)
const dbService = {
    isOnline: () => isFirebaseReady,

    // Obter todos os estudantes cadastrados
    async getAllStudents() {
        if (isFirebaseReady && firestoreDb) {
            try {
                const snapshot = await firestoreDb.collection('alunos').get();
                const students = [];
                snapshot.forEach(doc => {
                    students.push({ id: doc.id, ...doc.data() });
                });

                // Sincroniza cópia local de segurança
                if (students.length > 0) {
                    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
                }
                return students;
            } catch (err) {
                console.error("Erro ao buscar no Firestore, lendo do LocalStorage:", err);
                return this.getLocalStudents();
            }
        }
        return this.getLocalStudents();
    },

    getLocalStudents() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    // Buscar estudante por codinome (case-insensitive)
    async getStudentByCodename(codename) {
        if (!codename) return null;
        const cleanName = codename.trim();
        if (isFirebaseReady && firestoreDb) {
            try {
                const snapshot = await firestoreDb.collection('alunos')
                    .where('codinomeLower', '==', cleanName.toLowerCase())
                    .limit(1)
                    .get();
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    return { id: doc.id, ...doc.data() };
                }
            } catch (err) {
                console.warn("Erro no Firestore ao buscar por codinome, tentando localmente:", err);
            }
        }
        const local = this.getLocalStudents();
        return local.find(s => s.codinome && s.codinome.toLowerCase() === cleanName.toLowerCase()) || null;
    },

    // Salvar ou Criar Perfil de Estudante
    async saveStudent(studentData) {
        const student = {
            ...studentData,
            nomeReal: studentData.nomeReal || studentData.nome || '',
            codinome: studentData.codinome,
            codinomeLower: studentData.codinome.toLowerCase(),
            updatedAt: new Date().toISOString()
        };

        if (!student.createdAt) {
            student.createdAt = new Date().toISOString();
        }
        if (!student.progress) {
            student.progress = {
                matematica: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 },
                portugues: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 }
            };
        }

        // 1. Salvar no LocalStorage imediatamente
        const local = this.getLocalStudents();
        const existingIdx = local.findIndex(s => s.codinome && s.codinome.toLowerCase() === student.codinome.toLowerCase());
        if (existingIdx >= 0) {
            local[existingIdx] = { ...local[existingIdx], ...student };
        } else {
            local.push(student);
        }
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(local));

        // 2. Salvar no Firestore se disponível
        if (isFirebaseReady && firestoreDb) {
            try {
                const docId = student.codinome.toLowerCase().replace(/[^a-z0-9]/g, '_');
                await firestoreDb.collection('alunos').doc(docId).set(student, { merge: true });
                console.log(`📡 [Firestore] Perfil de ${student.codinome} (${student.nomeReal || 'Sem Nome'}) salvo na nuvem com sucesso.`);
            } catch (err) {
                console.error("Erro ao salvar no Firestore:", err);
            }
        }

        return student;
    },

    // Atualizar codinome e avatar do aluno (mantendo o nome real inalterado)
    async updateStudentProfile(oldCodename, newCodename, newAvatarId) {
        const cleanNew = (newCodename || '').trim();
        if (!cleanNew) return { success: false, message: 'O codinome não pode ser vazio.' };

        if (oldCodename.toLowerCase() !== cleanNew.toLowerCase()) {
            const existing = await this.getStudentByCodename(cleanNew);
            if (existing) {
                return { success: false, message: `O codinome "${cleanNew}" já está em uso por outro aluno.` };
            }
        }

        const student = await this.getStudentByCodename(oldCodename);
        if (!student) return { success: false, message: 'Aluno não encontrado.' };

        // Deleta registro com chave antiga se o identificador mudou
        if (oldCodename.toLowerCase() !== cleanNew.toLowerCase()) {
            await this.deleteStudent(oldCodename);
        }

        student.codinome = cleanNew;
        student.codinomeLower = cleanNew.toLowerCase();
        if (newAvatarId) {
            student.avatar = newAvatarId;
        }
        student.updatedAt = new Date().toISOString();

        await this.saveStudent(student);

        // Atualiza sessão ativa se for o aluno logado
        const active = this.getActiveStudent();
        if (active && active.codinome.toLowerCase() === oldCodename.toLowerCase()) {
            this.setActiveStudent(student);
        }

        return { success: true, student };
    },

    // Alias de compatibilidade
    async updateStudentCodename(oldCodename, newCodename, newAvatarId) {
        return this.updateStudentProfile(oldCodename, newCodename, newAvatarId);
    },

    // Atualizar progresso e pontuação de uma aula/atividade
    async updateProgress(codename, subjectKey, lessonId, activityId, lessonTitle, activityTitle, scoreEarned, maxScore) {
        const student = await this.getStudentByCodename(codename);
        if (!student) return null;

        if (!student.progress) {
            student.progress = {
                matematica: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 },
                portugues: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 }
            };
        }

        if (!student.progress[subjectKey]) {
            student.progress[subjectKey] = { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 };
        }

        const subj = student.progress[subjectKey];
        if (!subj.completedLessons) subj.completedLessons = {};

        // Atualiza última aula e última atividade realizadas
        subj.lastLesson = {
            id: lessonId,
            title: lessonTitle,
            timestamp: new Date().toISOString()
        };
        subj.lastActivity = {
            id: activityId,
            title: activityTitle,
            timestamp: new Date().toISOString()
        };

        // Registra aula como concluída com detalhes da pontuação
        const prevScore = subj.completedLessons[lessonId]?.score || 0;
        subj.completedLessons[lessonId] = {
            completed: true,
            title: lessonTitle,
            score: Math.max(prevScore, scoreEarned),
            maxScore: maxScore || 100,
            completedAt: new Date().toISOString()
        };

        // Recalcula score total da disciplina
        subj.totalScore = Object.values(subj.completedLessons).reduce((acc, l) => acc + (l.score || 0), 0);

        // Pontuação Geral / XP Total
        const totalXp = (student.progress.matematica?.totalScore || 0) + (student.progress.portugues?.totalScore || 0);
        student.totalXp = totalXp;
        student.currentActivityStatus = `${subjectKey === 'matematica' ? 'Matemática' : 'Língua Portuguesa'} - ${lessonTitle}`;

        // Salva
        await this.saveStudent(student);

        // Se for o aluno ativo logado, atualiza sessão
        const active = this.getActiveStudent();
        if (active && active.codinome.toLowerCase() === student.codinome.toLowerCase()) {
            this.setActiveStudent(student);
        }

        return student;
    },

    // Atualiza o progresso individual em tempo real durante o Modo Jogar Junto ou Enigmas
    async updateStudentLiveProgress(codename, subjectKey, lessonId, activityId, lessonTitle, activityTitle, scoreEarned, maxScore, isLessonCompleted = false) {
        const student = await this.getStudentByCodename(codename);
        if (!student) return null;

        if (!student.progress) {
            student.progress = {
                matematica: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 },
                portugues: { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 }
            };
        }

        if (!student.progress[subjectKey]) {
            student.progress[subjectKey] = { completedLessons: {}, lastLesson: null, lastActivity: null, totalScore: 0 };
        }

        const subj = student.progress[subjectKey];
        if (!subj.completedLessons) subj.completedLessons = {};

        // Atualiza última aula e última atividade
        subj.lastLesson = {
            id: lessonId,
            title: lessonTitle,
            timestamp: new Date().toISOString()
        };
        subj.lastActivity = {
            id: activityId,
            title: activityTitle,
            timestamp: new Date().toISOString()
        };

        const prevData = subj.completedLessons[lessonId] || { completed: false, score: 0 };
        const currentScore = Math.max(prevData.score || 0, scoreEarned || 0);

        subj.completedLessons[lessonId] = {
            completed: isLessonCompleted || prevData.completed || false,
            title: lessonTitle,
            score: currentScore,
            maxScore: maxScore || 500,
            updatedAt: new Date().toISOString(),
            ...(isLessonCompleted ? { completedAt: new Date().toISOString() } : {})
        };

        // Recalcula score total da disciplina
        subj.totalScore = Object.values(subj.completedLessons).reduce((acc, l) => acc + (l.score || 0), 0);

        // XP Total
        const totalXp = (student.progress.matematica?.totalScore || 0) + (student.progress.portugues?.totalScore || 0);
        student.totalXp = totalXp;
        student.currentActivityStatus = `${subjectKey === 'matematica' ? 'Matemática' : 'Língua Portuguesa'} - ${lessonTitle} (${activityTitle || 'Ao Vivo'})`;

        await this.saveStudent(student);

        // Se for o aluno ativo logado, atualiza sessão
        const active = this.getActiveStudent();
        if (active && active.codinome.toLowerCase() === student.codinome.toLowerCase()) {
            this.setActiveStudent(student);
        }

        return student;
    },

    // Sessão do Aluno Ativo
    getActiveStudent() {
        try {
            const data = sessionStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    setActiveStudent(student, remember = true) {
        if (!student) {
            sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
            localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
            return;
        }
        const json = JSON.stringify(student);
        sessionStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, json);
        if (remember) {
            localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, json);
        }
    },

    clearActiveStudent() {
        sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
    },

    // Deletar aluno (para o professor)
    async deleteStudent(codename) {
        // Local
        const local = this.getLocalStudents().filter(s => s.codinome.toLowerCase() !== codename.toLowerCase());
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(local));

        // Firestore
        if (isFirebaseReady && firestoreDb) {
            try {
                const docId = codename.toLowerCase().replace(/[^a-z0-9]/g, '_');
                await firestoreDb.collection('alunos').doc(docId).delete();
            } catch (err) {
                console.error("Erro ao deletar no Firestore:", err);
            }
        }
    },

    // Salvar configuração customizada do Firebase
    saveFirebaseConfig(configObj) {
        try {
            localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(configObj));
            initFirebase();
            return true;
        } catch (e) {
            return false;
        }
    }
};

// ============================================================================
// SERVIÇO EM TEMPO REAL: "JOGAR JUNTO" (SALA DE AULA SINCRONIZADA)
// ============================================================================
const liveBroadcast = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('decifradores_live_session') : null;

const liveSessionService = {
    activeUnsubscribe: null,
    localSession: null,

    // Canal local de broadcast para sincronizar abas instantaneamente
    broadcast(type, data) {
        if (liveBroadcast) {
            try {
                liveBroadcast.postMessage({ type, data, timestamp: Date.now() });
            } catch (e) {}
        }
    },

    // Escutar sessões ativas (para Alunos e Professor)
    listenToActiveSession(callback) {
        if (this.activeUnsubscribe) {
            this.activeUnsubscribe();
            this.activeUnsubscribe = null;
        }

        const handleIncomingSession = (session) => {
            if (!session || session.status === 'closed' || session.status === 'paused') {
                this.localSession = null;
                try {
                    localStorage.removeItem('decifradores_active_live_session');
                } catch(e) {}
                callback(null);
            } else {
                this.localSession = session;
                try {
                    localStorage.setItem('decifradores_active_live_session', JSON.stringify(session));
                } catch(e) {}
                callback(session);
            }
        };

        // 1. Escuta via BroadcastChannel local
        if (liveBroadcast) {
            liveBroadcast.onmessage = (event) => {
                if (event.data) {
                    handleIncomingSession(event.data.data);
                }
            };
        }

        // 2. Escuta via Firestore onSnapshot
        if (isFirebaseReady && firestoreDb) {
            try {
                this.activeUnsubscribe = firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa')
                    .onSnapshot((doc) => {
                        if (doc.exists) {
                            const data = doc.data();
                            handleIncomingSession(data);
                        } else {
                            handleIncomingSession(null);
                        }
                    }, (err) => {
                        console.warn("⚠️ [LiveSession] Erro no listener Firestore:", err);
                    });
            } catch (err) {
                console.error("Erro ao iniciar listener Firestore:", err);
            }
        }

        // Fallback inicial: Só aciona o callback se houver sessão REALMENTE ativa em andamento
        const saved = localStorage.getItem('decifradores_active_live_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && ['lobby', 'playing', 'enigma_ranking'].includes(parsed.status)) {
                    this.localSession = parsed;
                    callback(this.localSession);
                } else {
                    this.localSession = null;
                    localStorage.removeItem('decifradores_active_live_session');
                    callback(null);
                }
            } catch(e) {
                this.localSession = null;
                localStorage.removeItem('decifradores_active_live_session');
                callback(null);
            }
        } else {
            this.localSession = null;
            callback(null);
        }
    },

    // Salvar Checkpoint de Progresso da Aula (Local + Firestore)
    async saveCheckpoint(subjectKey, lessonId, sessionData) {
        if (!sessionData) return null;
        const checkpoint = {
            subjectKey,
            lessonId,
            lessonTitle: sessionData.lessonTitle,
            totalEnigmas: sessionData.totalEnigmas || 10,
            currentActivityIndex: sessionData.currentActivityIndex || 0,
            participantes: sessionData.participantes || {},
            savedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(`decifradores_checkpoint_${subjectKey}_${lessonId}`, JSON.stringify(checkpoint));
        } catch (e) {}

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('checkpoints_jogar_junto').doc(`${subjectKey}_${lessonId}`).set(checkpoint);
                console.log(`💾 [Checkpoint] Progresso salvo para ${subjectKey}/${lessonId} no Enigma #${(checkpoint.currentActivityIndex || 0) + 1}`);
            } catch (err) {
                console.warn("Erro ao salvar checkpoint no Firestore:", err);
            }
        }
        return checkpoint;
    },

    // Buscar Checkpoint salvo de uma aula
    async getCheckpoint(subjectKey, lessonId) {
        if (isFirebaseReady && firestoreDb) {
            try {
                const doc = await firestoreDb.collection('checkpoints_jogar_junto').doc(`${subjectKey}_${lessonId}`).get();
                if (doc.exists) {
                    return doc.data();
                }
            } catch (err) {
                console.warn("Erro ao buscar checkpoint no Firestore:", err);
            }
        }

        try {
            const raw = localStorage.getItem(`decifradores_checkpoint_${subjectKey}_${lessonId}`);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    // Limpar Checkpoint quando a aula for concluída ou reiniciada
    async clearCheckpoint(subjectKey, lessonId) {
        try {
            localStorage.removeItem(`decifradores_checkpoint_${subjectKey}_${lessonId}`);
        } catch (e) {}

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('checkpoints_jogar_junto').doc(`${subjectKey}_${lessonId}`).delete();
            } catch (err) {}
        }
    },

    // Criar uma nova Sessão Coletiva (Professor) - com suporte a continuar de onde parou
    async createSession(subjectKey, lessonId, lessonTitle, totalEnigmas, startIndex = 0, initialParticipantes = {}) {
        const sessionId = `sess_${Date.now()}`;
        const newSession = {
            id: sessionId,
            subjectKey,
            lessonId,
            lessonTitle,
            totalEnigmas: totalEnigmas || 10,
            status: 'lobby', // 'lobby' | 'playing' | 'enigma_ranking' | 'final_ranking' | 'paused' | 'closed'
            currentActivityIndex: startIndex || 0,
            currentActivityStartTime: Date.now(),
            isResumed: (startIndex > 0),
            participantes: { ...initialParticipantes },
            activeEnigmaRanking: [],
            finalRanking: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.localSession = newSession;
        localStorage.setItem('decifradores_active_live_session', JSON.stringify(newSession));
        this.broadcast('SESSION_UPDATE', newSession);

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set(newSession);
                console.log("🎮 [LiveSession] Sessão criada no Firestore:", sessionId);
            } catch (err) {
                console.error("Erro ao criar sessão no Firestore:", err);
            }
        }

        return newSession;
    },

    // Atualizar Sessão
    async updateSession(updatedData) {
        const merged = { ...this.localSession, ...updatedData, updatedAt: new Date().toISOString() };
        this.localSession = merged;
        localStorage.setItem('decifradores_active_live_session', JSON.stringify(merged));
        this.broadcast('SESSION_UPDATE', merged);

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set(merged, { merge: true });
            } catch (err) {
                console.error("Erro ao atualizar sessão no Firestore:", err);
            }
        }
        return merged;
    },

    // Aluno entra na sessão (preserva pontuação anterior se estiver retomando)
    async joinSession(student) {
        if (!this.localSession || !student) return null;
        const codename = student.codinome;
        const participantes = { ...(this.localSession.participantes || {}) };

        if (!participantes[codename]) {
            participantes[codename] = {
                codinome: student.codinome,
                nomeReal: student.nomeReal || student.nome || '',
                avatar: student.avatar || 'detetive_classico',
                status: 'idle',
                currentEnigmaTimeSeconds: 0,
                currentEnigmaScore: 0,
                totalScore: 0,
                totalTimeSeconds: 0,
                history: {},
                joinedAt: new Date().toISOString()
            };
        } else {
            participantes[codename].status = 'idle';
            participantes[codename].currentEnigmaTimeSeconds = 0;
            participantes[codename].currentEnigmaScore = 0;
        }

        return this.updateSession({ participantes });
    },

    // Aluno sai da sessão
    async leaveSession(codename) {
        if (!this.localSession || !codename) return null;
        const participantes = { ...(this.localSession.participantes || {}) };
        delete participantes[codename];
        return this.updateSession({ participantes });
    },

    // Iniciar a partida (Professor)
    async startSession() {
        if (!this.localSession) return null;
        const participantes = { ...(this.localSession.participantes || {}) };
        const currentIdx = this.localSession.currentActivityIndex || 0;

        Object.keys(participantes).forEach(k => {
            participantes[k].status = 'answering';
            participantes[k].currentEnigmaTimeSeconds = 0;
            participantes[k].currentEnigmaScore = 0;
        });

        const updated = await this.updateSession({
            status: 'playing',
            currentActivityIndex: currentIdx,
            currentActivityStartTime: Date.now(),
            participantes,
            activeEnigmaRanking: []
        });

        await this.saveCheckpoint(this.localSession.subjectKey, this.localSession.lessonId, updated);
        return updated;
    },

    // Aluno submete resposta correta do enigma (Atualiza sessão e salva progresso individual do aluno)
    async submitEnigmaAnswer(codename, enigmaIndex, timeSeconds, scoreEarned = 50) {
        if (!this.localSession || !this.localSession.participantes || !this.localSession.participantes[codename]) return null;

        const participantes = { ...this.localSession.participantes };
        const p = { ...participantes[codename] };

        p.status = 'solved';
        p.currentEnigmaTimeSeconds = timeSeconds;
        p.currentEnigmaScore = scoreEarned;
        p.totalScore = (p.totalScore || 0) + scoreEarned;
        p.totalTimeSeconds = (p.totalTimeSeconds || 0) + timeSeconds;
        if (!p.history) p.history = {};
        p.history[enigmaIndex] = {
            solved: true,
            timeSeconds,
            score: scoreEarned,
            answeredAt: new Date().toISOString()
        };

        participantes[codename] = p;

        // Salva progresso individual do aluno no banco
        const isLastEnigma = (enigmaIndex >= (this.localSession.totalEnigmas - 1));
        const maxScore = (this.localSession.totalEnigmas || 10) * 50;
        try {
            await dbService.updateStudentLiveProgress(
                codename,
                this.localSession.subjectKey,
                this.localSession.lessonId,
                `atv_${enigmaIndex + 1}`,
                this.localSession.lessonTitle,
                `Enigma #${enigmaIndex + 1}`,
                p.totalScore,
                maxScore,
                isLastEnigma
            );
        } catch (e) {
            console.warn("Erro ao sincronizar progresso individual do aluno:", e);
        }

        // Calcula ranking do enigma atual (ordenado por tempo crescente de quem acabou)
        const ranking = Object.values(participantes)
            .filter(player => player.history && player.history[enigmaIndex] && player.history[enigmaIndex].solved)
            .sort((a, b) => a.history[enigmaIndex].timeSeconds - b.history[enigmaIndex].timeSeconds)
            .map((player, idx) => ({
                posicao: idx + 1,
                codinome: player.codinome,
                nomeReal: player.nomeReal,
                avatar: player.avatar,
                timeSeconds: player.history[enigmaIndex].timeSeconds,
                score: player.history[enigmaIndex].score
            }));

        const allSolved = Object.values(participantes).every(player => player.status === 'solved');

        const updated = await this.updateSession({
            participantes,
            activeEnigmaRanking: ranking,
            status: allSolved ? 'enigma_ranking' : this.localSession.status
        });

        // Salva checkpoint atualizado
        await this.saveCheckpoint(this.localSession.subjectKey, this.localSession.lessonId, updated);
        return updated;
    },

    // Professor avança para o próximo enigma
    async advanceToNextEnigma() {
        if (!this.localSession) return null;
        const nextIndex = this.localSession.currentActivityIndex + 1;
        const total = this.localSession.totalEnigmas;

        if (nextIndex >= total) {
            return this.finishSession();
        }

        const participantes = { ...(this.localSession.participantes || {}) };
        Object.keys(participantes).forEach(k => {
            participantes[k].status = 'answering';
            participantes[k].currentEnigmaTimeSeconds = 0;
            participantes[k].currentEnigmaScore = 0;
        });

        const updated = await this.updateSession({
            status: 'playing',
            currentActivityIndex: nextIndex,
            currentActivityStartTime: Date.now(),
            participantes,
            activeEnigmaRanking: []
        });

        // Salva checkpoint do novo enigma
        await this.saveCheckpoint(this.localSession.subjectKey, this.localSession.lessonId, updated);
        return updated;
    },

    // Pausar sessão no meio da aula e salvar o progresso para continuar depois
    async pauseSession() {
        const session = this.localSession;
        if (session) {
            await this.saveCheckpoint(session.subjectKey, session.lessonId, session);
        }

        const pausedSession = {
            ...(session || {}),
            status: 'paused',
            pausedAt: new Date().toISOString()
        };

        this.localSession = null;
        try {
            localStorage.removeItem('decifradores_active_live_session');
        } catch (e) {}

        this.broadcast('SESSION_UPDATE', pausedSession);

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set(pausedSession);
            } catch (err) {}
        }
        return pausedSession;
    },

    // Finalizar Sessão (Gera Pódio, Marca aulas de todos os participantes como concluídas & Salva no Histórico)
    async finishSession() {
        if (!this.localSession) return null;
        const participantesList = Object.values(this.localSession.participantes || {});
        const maxScore = (this.localSession.totalEnigmas || 10) * 50;

        // Marca a aula como 100% concluída para todos os participantes individuais no banco
        for (const player of participantesList) {
            try {
                await dbService.updateStudentLiveProgress(
                    player.codinome,
                    this.localSession.subjectKey,
                    this.localSession.lessonId,
                    `atv_${this.localSession.totalEnigmas}`,
                    this.localSession.lessonTitle,
                    'Caso Concluído',
                    player.totalScore || maxScore,
                    maxScore,
                    true // isLessonCompleted = true
                );
            } catch (e) {
                console.warn("Erro ao marcar conclusão final do aluno:", e);
            }
        }

        // Limpa o checkpoint da aula pois ela foi finalizada com sucesso
        await this.clearCheckpoint(this.localSession.subjectKey, this.localSession.lessonId);

        // Ordena por maior pontuação total, depois por menor tempo total
        const finalRanking = participantesList.sort((a, b) => {
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }
            return a.totalTimeSeconds - b.totalTimeSeconds;
        }).map((player, idx) => ({
            posicao: idx + 1,
            codinome: player.codinome,
            nomeReal: player.nomeReal,
            avatar: player.avatar,
            totalScore: player.totalScore,
            totalTimeSeconds: player.totalTimeSeconds
        }));

        const finishedSession = {
            ...this.localSession,
            status: 'final_ranking',
            finalRanking,
            endedAt: new Date().toISOString()
        };

        await this.updateSession(finishedSession);
        await this.saveRankingToHistory(finishedSession);

        return finishedSession;
    },

    // Salvar no Histórico de Rankings
    async saveRankingToHistory(sessionData) {
        const historyEntry = {
            id: `rank_${Date.now()}`,
            sessionId: sessionData.id,
            subjectKey: sessionData.subjectKey,
            lessonId: sessionData.lessonId,
            lessonTitle: sessionData.lessonTitle,
            totalParticipants: Object.keys(sessionData.participantes || {}).length,
            finalRanking: sessionData.finalRanking || [],
            createdAt: sessionData.createdAt,
            completedAt: new Date().toISOString()
        };

        // Local
        try {
            const historyList = JSON.parse(localStorage.getItem('decifradores_ranking_history') || '[]');
            historyList.unshift(historyEntry);
            localStorage.setItem('decifradores_ranking_history', JSON.stringify(historyList));
        } catch (e) {}

        // Firestore
        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('historico_rankings_jogar_junto').doc(historyEntry.id).set(historyEntry);
                console.log("🏆 [RankingHistory] Ranking da partida gravado no Firestore com sucesso!");
            } catch (err) {
                console.error("Erro ao salvar histórico de ranking:", err);
            }
        }

        return historyEntry;
    },

    // Buscar histórico de rankings
    async getRankingHistory(subjectKey = null, lessonId = null) {
        if (isFirebaseReady && firestoreDb) {
            try {
                let query = firestoreDb.collection('historico_rankings_jogar_junto');
                if (subjectKey) query = query.where('subjectKey', '==', subjectKey);
                if (lessonId) query = query.where('lessonId', '==', lessonId);
                const snap = await query.get();
                const list = [];
                snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                list.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
                return list;
            } catch (err) {
                console.warn("Erro ao buscar histórico no Firestore, buscando local:", err);
            }
        }

        try {
            let list = JSON.parse(localStorage.getItem('decifradores_ranking_history') || '[]');
            if (subjectKey) list = list.filter(item => item.subjectKey === subjectKey);
            if (lessonId) list = list.filter(item => item.lessonId === lessonId);
            return list;
        } catch (e) {
            return [];
        }
    },

    // Fechar e encerrar sessão ativa
    async closeSession() {
        this.localSession = null;
        try {
            localStorage.removeItem('decifradores_active_live_session');
        } catch (e) {}
        
        this.broadcast('SESSION_UPDATE', { status: 'closed' });

        if (isFirebaseReady && firestoreDb) {
            try {
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set({
                    status: 'closed',
                    closedAt: new Date().toISOString()
                });
                console.log("🛑 [LiveSession] Sessão encerrada e desativada.");
            } catch (err) {
                console.error("Erro ao encerrar sessão no Firestore:", err);
            }
        }
    }
};

// Inicializa imediatamente e garante no DOMContentLoaded
initFirebase();
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
});
