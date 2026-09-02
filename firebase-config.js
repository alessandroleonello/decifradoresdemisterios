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

    // Helper para calcular ranking do enigma de forma dinâmica e confiável
    computeEnigmaRanking(participantes, enigmaIndex) {
        if (!participantes) return [];
        return Object.values(participantes)
            .filter(player => (player.history && player.history[enigmaIndex] && player.history[enigmaIndex].solved) || (player.status === 'solved' && ((player.currentEnigmaTimeSeconds || 0) > 0 || (player.currentEnigmaScore || 0) > 0)))
            .sort((a, b) => {
                const timeA = (a.history && a.history[enigmaIndex] && typeof a.history[enigmaIndex].timeSeconds === 'number')
                    ? a.history[enigmaIndex].timeSeconds
                    : (a.currentEnigmaTimeSeconds || 999);
                const timeB = (b.history && b.history[enigmaIndex] && typeof b.history[enigmaIndex].timeSeconds === 'number')
                    ? b.history[enigmaIndex].timeSeconds
                    : (b.currentEnigmaTimeSeconds || 999);
                return timeA - timeB;
            })
            .map((player, idx) => ({
                posicao: idx + 1,
                codinome: player.codinome,
                nomeReal: player.nomeReal,
                avatar: player.avatar,
                timeSeconds: (player.history && player.history[enigmaIndex] && typeof player.history[enigmaIndex].timeSeconds === 'number')
                    ? player.history[enigmaIndex].timeSeconds
                    : (player.currentEnigmaTimeSeconds || 0),
                score: (player.history && player.history[enigmaIndex] && typeof player.history[enigmaIndex].score === 'number')
                    ? player.history[enigmaIndex].score
                    : (player.currentEnigmaScore || 50)
            }));
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
                // Mescla segura de participantes para evitar que snapshots concorrentes revertam status de 'solved'
                if (this.localSession && this.localSession.id === session.id && this.localSession.participantes && session.participantes) {
                    const localParticipants = this.localSession.participantes;
                    const incomingParticipants = session.participantes;
                    
                    Object.keys(localParticipants).forEach(cd => {
                        const localP = localParticipants[cd];
                        const incomingP = incomingParticipants[cd];
                        if (localP && incomingP && localP.status === 'solved' && this.localSession.currentActivityIndex === session.currentActivityIndex) {
                            if (incomingP.status !== 'solved') {
                                incomingP.status = 'solved';
                                incomingP.currentEnigmaTimeSeconds = localP.currentEnigmaTimeSeconds || incomingP.currentEnigmaTimeSeconds;
                                incomingP.currentEnigmaScore = localP.currentEnigmaScore || incomingP.currentEnigmaScore;
                                incomingP.history = { ...(incomingP.history || {}), ...(localP.history || {}) };
                            }
                        }
                    });
                }
                
                // Recalcula ranking dinamicamente para o enigma atual
                if (session.participantes && typeof session.currentActivityIndex === 'number') {
                    session.activeEnigmaRanking = this.computeEnigmaRanking(session.participantes, session.currentActivityIndex);
                }

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
        const currentP = this.localSession.participantes?.[codename];

        const participantData = {
            codinome: student.codinome,
            nomeReal: student.nomeReal || student.nome || '',
            avatar: student.avatar || 'detetive_classico',
            status: 'idle',
            currentEnigmaTimeSeconds: 0,
            currentEnigmaScore: 0,
            totalScore: currentP?.totalScore || 0,
            totalTimeSeconds: currentP?.totalTimeSeconds || 0,
            history: currentP?.history || {},
            joinedAt: currentP?.joinedAt || new Date().toISOString()
        };

        if (!this.localSession.participantes) this.localSession.participantes = {};
        this.localSession.participantes[codename] = participantData;
        this.localSession.updatedAt = new Date().toISOString();

        localStorage.setItem('decifradores_active_live_session', JSON.stringify(this.localSession));
        this.broadcast('SESSION_UPDATE', this.localSession);

        if (isFirebaseReady && firestoreDb) {
            try {
                const updatePayload = {};
                updatePayload[`participantes.${codename}`] = participantData;
                updatePayload.updatedAt = new Date().toISOString();
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').update(updatePayload);
            } catch (err) {
                try {
                    await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set({
                        participantes: { [codename]: participantData },
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                } catch(e) {
                    console.error("Erro ao registrar entrada no Firestore:", e);
                }
            }
        }
        return this.localSession;
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

    // Aluno submete resposta correta do enigma (Atualiza sessão atômica por aluno e salva progresso individual)
    async submitEnigmaAnswer(codename, enigmaIndex, timeSeconds, scoreEarned = 50) {
        if (!this.localSession) return null;
        if (!this.localSession.participantes) this.localSession.participantes = {};

        const existingP = this.localSession.participantes[codename] || {
            codinome: codename,
            nomeReal: codename,
            avatar: 'detetive_classico',
            status: 'answering',
            currentEnigmaTimeSeconds: 0,
            currentEnigmaScore: 0,
            totalScore: 0,
            totalTimeSeconds: 0,
            history: {}
        };

        const p = { ...existingP };
        p.status = 'solved';
        p.currentEnigmaTimeSeconds = timeSeconds;
        p.currentEnigmaScore = scoreEarned;
        p.totalScore = (p.totalScore || 0) + scoreEarned;
        p.totalTimeSeconds = (p.totalTimeSeconds || 0) + timeSeconds;
        p.history = { ...(p.history || {}) };
        p.history[enigmaIndex] = {
            solved: true,
            timeSeconds,
            score: scoreEarned,
            answeredAt: new Date().toISOString()
        };

        this.localSession.participantes[codename] = p;
        this.localSession.updatedAt = new Date().toISOString();

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

        // Calcula ranking dinamicamente para o enigma atual
        const ranking = this.computeEnigmaRanking(this.localSession.participantes, enigmaIndex);
        this.localSession.activeEnigmaRanking = ranking;

        const allSolved = Object.values(this.localSession.participantes).length > 0 &&
            Object.values(this.localSession.participantes).every(player => player.status === 'solved');

        if (allSolved && this.localSession.status === 'playing') {
            this.localSession.status = 'enigma_ranking';
        }

        localStorage.setItem('decifradores_active_live_session', JSON.stringify(this.localSession));
        this.broadcast('SESSION_UPDATE', this.localSession);

        if (isFirebaseReady && firestoreDb) {
            try {
                const updatePayload = {};
                updatePayload[`participantes.${codename}`] = p;
                updatePayload.updatedAt = new Date().toISOString();
                if (allSolved) {
                    updatePayload.status = 'enigma_ranking';
                }
                await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').update(updatePayload);
            } catch (err) {
                try {
                    await firestoreDb.collection('sessoes_jogar_junto').doc('sessao_ativa').set({
                        participantes: { [codename]: p },
                        updatedAt: new Date().toISOString(),
                        ...(allSolved ? { status: 'enigma_ranking' } : {})
                    }, { merge: true });
                } catch(e) {
                    console.error("Erro ao sincronizar resposta no Firestore:", e);
                }
            }
        }

        // Salva checkpoint atualizado
        try {
            await this.saveCheckpoint(this.localSession.subjectKey, this.localSession.lessonId, this.localSession);
        } catch(e) {}

        return this.localSession;
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
