// ============================================================================
// Decifradores de Mistérios - Banco de Aulas, Enigmas e Avatares
// ============================================================================

const AVATARES_DISPONIVEIS = [
    { id: 'detetive_classico', nome: 'Detetive Clássico', icone: '🕵️‍♂️', cor: '#38bdf8' },
    { id: 'detetive_classica', nome: 'Detetive Investigadora', icone: '🕵️‍♀️', cor: '#ec4899' },
    { id: 'cripto_hacker', nome: 'Cripto-Analista', icone: '💻', cor: '#10b981' },
    { id: 'coruja_sabia', nome: 'Coruja Perita', icone: '🦉', cor: '#f59e0b' },
    { id: 'lupa_dourada', nome: 'Olho de Falcão', icone: '🦅', cor: '#a855f7' },
    { id: 'misterio_sombra', nome: 'Sombra da Noite', icone: '👤', cor: '#64748b' },
    { id: 'robo_forense', nome: 'Androide Forense', icone: '🤖', cor: '#06b6d4' },
    { id: 'guardiao_codigo', nome: 'Guardião dos Códigos', icone: '🛡️', cor: '#eab308' },
    { id: 'lobo_rastreador', nome: 'Lobo Rastreador', icone: '🐺', cor: '#3b82f6' },
    { id: 'gato_astuto', nome: 'Gato Astuto', icone: '🐱', cor: '#f97316' },
    { id: 'raposa_esperta', nome: 'Raposa Astuta', icone: '🦊', cor: '#ef4444' },
    { id: 'mestre_enigmas', nome: 'Mestre dos Enigmas', icone: '🎩', cor: '#8b5cf6' }
];

const PATENTES_DETETIVE = [
    { minXp: 0, titulo: 'Recruta Investigador', nivel: 1, insígnia: '🔰' },
    { minXp: 150, titulo: 'Detetive Aprendiz', nivel: 2, insígnia: '🔍' },
    { minXp: 350, titulo: 'Perito em Pistas', nivel: 3, insígnia: '📑' },
    { minXp: 600, titulo: 'Criptoanalista Sênior', nivel: 4, insígnia: '🔐' },
    { minXp: 1000, titulo: 'Mestre Decifrador', nivel: 5, insígnia: '👑' }
];

function getPatenteAluno(xp = 0) {
    let patenteAtual = PATENTES_DETETIVE[0];
    for (const p of PATENTES_DETETIVE) {
        if (xp >= p.minXp) {
            patenteAtual = p;
        }
    }
    return patenteAtual;
}

// Catálogo de Disciplinas e Aulas de Investigação
const CURRICULO_INVESTIGACAO = {
    matematica: {
        id: 'matematica',
        nome: 'Matemática',
        subtitulo: 'Códigos, Lógica & Enigmas Numéricos',
        icone: 'fa-solid fa-calculator',
        corTema: '#38bdf8',
        corTemaSecundaria: '#0284c7',
        corGlow: 'rgba(56, 189, 248, 0.4)',
        descricao: 'Use lógica deductiva, cálculos rápidos e decifração de coordenadas para desvendar os segredos dos criminosos.',
        aulas: [
            {
                id: 'mat_aula_1',
                numero: 1,
                titulo: 'Senso Numérico e Contagem',
                descricao: 'Desenvolva seu raciocínio lógico investigativo completando sequências, identificando padrões de contagem e desvendando códigos numéricos ocultos.',
                dificuldade: 'Iniciante',
                tempoEstimado: '15 min',
                xpRecompensa: 100,
                atividades: [
                    {
                        id: 'mat_1_atv_1',
                        tipo: 'quadro_numerico',
                        titulo: 'Enigma do Quadro Secreto de 1 a 100',
                        instrucoes: 'Os peritos encontraram um quadro numérico confidencial de 1 a 100 com pistas cruciais, mas alguns números foram apagados. Complete os espaços em branco com os números corretos da sequência para restaurar o quadro e decifrar o mistério!',
                        total: 100,
                        numerosOcultos: [6, 14, 25, 38, 42, 57, 63, 79, 81, 95],
                        dica: 'Dica Forense: Conte de 1 em 1 observando a linha horizontal, ou conte de 10 em 10 observando a coluna vertical!',
                        explicacao: 'Incrível dedução! Você restaurou todo o quadro numérico de 1 a 100 com precisão cirúrgica.'
                    },
                    {
                        id: 'mat_1_atv_2',
                        tipo: 'antecessor_sucessor',
                        titulo: 'Enigma dos Vizinhos Numéricos (Antecessor e Sucessor)',
                        instrucoes: 'Para abrir o cofre de evidências, os peritos precisam identificar os vizinhos imediatos de cada código! Digite o número ANTECESSOR (à esquerda) e o número SUCESSOR (à direita) de cada número central.',
                        itens: [
                            { numero: 19, antecessor: 18, sucessor: 20 },
                            { numero: 40, antecessor: 39, sucessor: 41 },
                            { numero: 75, antecessor: 74, sucessor: 76 },
                            { numero: 89, antecessor: 88, sucessor: 90 },
                            { numero: 99, antecessor: 98, sucessor: 100 }
                        ],
                        dica: 'Dica Forense: O Antecessor vem imediatamente antes (-1) e o Sucessor vem imediatamente depois (+1)!',
                        explicacao: 'Excelente trabalho, Detetive! Você calculou com exatidão todos os antecessores e sucessores dos códigos.'
                    },
                    {
                        id: 'mat_1_atv_3',
                        tipo: 'pares_impares_100',
                        titulo: 'Enigma do Radar Pericial: Pares e Ímpares de 1 a 100',
                        instrucoes: 'O sistema de segurança requer a identificação completa de frequências pares e ímpares! Selecione o botão PAR e clique em todos os números pares do quadro. Em seguida, selecione o botão ÍMPAR e clique em todos os números ímpares para classificar e colorir todo o painel de 1 a 100.',
                        total: 100,
                        dica: 'Dica Forense: Números PARES terminam em 0, 2, 4, 6 ou 8. Números ÍMPARES terminam em 1, 3, 5, 7 ou 9!',
                        explicacao: 'Excelente classificação, Agente! Você identificou e coloriu com perfeição todos os 50 números pares e 50 números ímpares do painel!'
                    },
                    {
                        id: 'mat_1_atv_4',
                        tipo: 'classificar_par_impar_lista',
                        titulo: 'Enigma dos Códigos Suspeitos: Classificação Par ou Ímpar',
                        instrucoes: 'Os peritos interceptaram uma lista de códigos numéricos deixados pelo suspeito! Para cada número da lista, clique no botão correspondente para indicar se ele é PAR ou ÍMPAR.',
                        itens: [
                            { numero: 8, paridade: 'par' },
                            { numero: 15, paridade: 'impar' },
                            { numero: 24, paridade: 'par' },
                            { numero: 37, paridade: 'impar' },
                            { numero: 42, paridade: 'par' },
                            { numero: 59, paridade: 'impar' },
                            { numero: 66, paridade: 'par' },
                            { numero: 71, paridade: 'impar' },
                            { numero: 80, paridade: 'par' },
                            { numero: 93, paridade: 'impar' },
                            { numero: 104, paridade: 'par' },
                            { numero: 117, paridade: 'impar' },
                            { numero: 128, paridade: 'par' },
                            { numero: 135, paridade: 'impar' },
                            { numero: 146, paridade: 'par' },
                            { numero: 153, paridade: 'impar' },
                            { numero: 162, paridade: 'par' },
                            { numero: 179, paridade: 'impar' },
                            { numero: 190, paridade: 'par' },
                            { numero: 215, paridade: 'impar' }
                        ],
                        dica: 'Dica Forense: Observe apenas o último algarismo do número! Se terminar em 0, 2, 4, 6 ou 8 é PAR. Se terminar em 1, 3, 5, 7 ou 9 é ÍMPAR!',
                        explicacao: 'Excelente dedução pericial! Você classificou corretamente a paridade de todos os 20 códigos interceptados.'
                    },
                    {
                        id: 'mat_1_atv_5',
                        tipo: 'retas_numericas',
                        titulo: 'Enigma das Trilhas Periciais: Retas Numéricas',
                        instrucoes: 'Os peritos encontraram pistas em diferentes trilhas de contagem! Analise o padrão de cada reta numérica e digite o número que está faltando no espaço vazio.',
                        retas: [
                            {
                                id: 'reta_1',
                                titulo: 'Trilha 1: Contagem de 1 em 1 (1 a 10)',
                                passo: '1 em 1',
                                sequencia: [1, 2, 3, 4, 5, null, 7, 8, 9, 10],
                                respostaEsperada: 6
                            },
                            {
                                id: 'reta_2',
                                titulo: 'Trilha 2: Contagem de 1 em 1 (30 a 40)',
                                passo: '1 em 1',
                                sequencia: [30, 31, 32, 33, 34, 35, null, 37, 38, 39, 40],
                                respostaEsperada: 36
                            },
                            {
                                id: 'reta_3',
                                titulo: 'Trilha 3: Contagem de 2 em 2 (0 a 10)',
                                passo: '2 em 2',
                                sequencia: [0, 2, 4, null, 8, 10],
                                respostaEsperada: 6
                            },
                            {
                                id: 'reta_4',
                                titulo: 'Trilha 4: Contagem de 2 em 2 (20 a 30)',
                                passo: '2 em 2',
                                sequencia: [20, 22, 24, null, 28, 30],
                                respostaEsperada: 26
                            },
                            {
                                id: 'reta_5',
                                titulo: 'Trilha 5: Contagem de 5 em 5 (0 a 50)',
                                passo: '5 em 5',
                                sequencia: [0, 5, 10, 15, 20, null, 30, 35, 40, 45, 50],
                                respostaEsperada: 25
                            },
                            {
                                id: 'reta_6',
                                titulo: 'Trilha 6: Contagem de 10 em 10 (0 a 100)',
                                passo: '10 em 10',
                                sequencia: [0, 10, 20, 30, 40, 50, 60, null, 80, 90, 100],
                                respostaEsperada: 70
                            },
                            {
                                id: 'reta_7',
                                titulo: 'Trilha 7: Contagem de 5 em 5 (50 a 100)',
                                passo: '5 em 5',
                                sequencia: [50, 55, 60, 65, 70, null, 80, 85, 90, 95, 100],
                                respostaEsperada: 75
                            }
                        ],
                        dica: 'Dica Forense: Descubra de quanto em quanto os números estão pulando em cada reta (de 1 em 1, de 2 em 2, de 5 em 5 ou de 10 em 10)!',
                        explicacao: 'Incrível dedução pericial! Você completou todas as 7 retas numéricas com precisão absoluta!'
                    },
                    {
                        id: 'mat_1_atv_6',
                        tipo: 'comparacao_maior_menor',
                        titulo: 'Enigma da Balança Forense: Maior (>), Menor (<) ou Igual (=)',
                        instrucoes: 'Compare os valores das evidências em cada linha. Clique no símbolo correto ( > para maior que, < para menor que, ou = para igual a) para calibrar a balança da perícia!',
                        itens: [
                            { id: 'c1', num1: 47, num2: 74, correto: '<', label1: '47', label2: '74' },
                            { id: 'c2', num1: 85, num2: 58, correto: '>', label1: '85', label2: '58' },
                            { id: 'c3', num1: 99, num2: 100, correto: '<', label1: '99', label2: '100' },
                            { id: 'c4', num1: 62, num2: 26, correto: '>', label1: '62', label2: '26' },
                            { id: 'c5', num1: 35, num2: 35, correto: '=', label1: '30 + 5', label2: '35' },
                            { id: 'c6', num1: 100, num2: 100, correto: '=', label1: '50 + 50', label2: '100' },
                            { id: 'c7', num1: 150, num2: 105, correto: '>', label1: '150', label2: '105' },
                            { id: 'c8', num1: 209, num2: 290, correto: '<', label1: '209', label2: '290' }
                        ],
                        dica: 'Dica Forense: A abertura do sinal sempre aponta para o número maior! Exemplo: 8 > 3 (oito é maior que três).',
                        explicacao: 'Excelente análise pericial! Todas as 8 comparações de valores foram determinadas com 100% de exatidão.'
                    },
                    {
                        id: 'mat_1_atv_7',
                        tipo: 'ordem_crescente_decrescente',
                        titulo: 'Enigma do Organizador de Pistas: Ordem Crescente e Decrescente',
                        instrucoes: 'Os códigos foram encontrados desordenados na cena do crime! Digite os números nos campos para organizar cada conjunto na ordem solicitada.',
                        grupos: [
                            {
                                id: 'grupo_1',
                                tipoOrdem: 'crescente',
                                tituloOrdem: '📈 Ordem Crescente (do Menor para o Maior)',
                                numerosDesordenados: [68, 12, 94, 35, 51],
                                ordemCorreta: [12, 35, 51, 68, 94]
                            },
                            {
                                id: 'grupo_2',
                                tipoOrdem: 'decrescente',
                                tituloOrdem: '📉 Ordem Decrescente (do Maior para o Menor)',
                                numerosDesordenados: [23, 89, 47, 100, 15],
                                ordemCorreta: [100, 89, 47, 23, 15]
                            },
                            {
                                id: 'grupo_3',
                                tipoOrdem: 'crescente',
                                tituloOrdem: '📈 Ordem Crescente (do Menor para o Maior)',
                                numerosDesordenados: [8, 88, 18, 80, 28],
                                ordemCorreta: [8, 18, 28, 80, 88]
                            },
                            {
                                id: 'grupo_4',
                                tipoOrdem: 'decrescente',
                                tituloOrdem: '📉 Ordem Decrescente (do Maior para o Menor)',
                                numerosDesordenados: [77, 33, 99, 11, 55],
                                ordemCorreta: [99, 77, 55, 33, 11]
                            }
                        ],
                        dica: 'Dica Forense: Na ordem CRESCENTE os números sobem (do menor para o maior). Na ordem DECRESCENTE os números descem (do maior para o menor).',
                        explicacao: 'Organização impecável, Agente! Todas as pistas foram ordenadas perfeitamente no arquivo pericial.'
                    },
                    {
                        id: 'mat_1_atv_8',
                        tipo: 'dezenas_unidades_agrupamento',
                        titulo: 'Enigma do Arquivo Forense: Dezenas e Unidades',
                        instrucoes: 'Os peritos apreenderam lotes de evidências organizados em pacotes de 10 (Dezenas) e peças soltas (Unidades). Digite a quantidade de Dezenas, Unidades e o Valor Total de cada lote!',
                        lotes: [
                            {
                                id: 'lote_1',
                                titulo: 'Lote Alpha: 3 Pacotes de 10 e 4 Peças Soltas',
                                dezenasEsperadas: 3,
                                unidadesEsperadas: 4,
                                totalEsperado: 34
                            },
                            {
                                id: 'lote_2',
                                titulo: 'Lote Beta: 5 Pacotes de 10 e 8 Peças Soltas',
                                dezenasEsperadas: 5,
                                unidadesEsperadas: 8,
                                totalEsperado: 58
                            },
                            {
                                id: 'lote_3',
                                titulo: 'Lote Gamma: 7 Pacotes de 10 e 0 Peças Soltas',
                                dezenasEsperadas: 7,
                                unidadesEsperadas: 0,
                                totalEsperado: 70
                            },
                            {
                                id: 'lote_4',
                                titulo: 'Lote Ômega: 9 Pacotes de 10 e 9 Peças Soltas',
                                dezenasEsperadas: 9,
                                unidadesEsperadas: 9,
                                totalEsperado: 99
                            }
                        ],
                        dica: 'Dica Forense: Cada 1 Dezena vale 10 unidades. Exemplo: 3 dezenas (30) + 4 unidades = 34!',
                        explicacao: 'Contagem de lotes periciais finalizada! A estrutura decimal de todas as provas foi decifrada com sucesso.'
                    },
                    {
                        id: 'mat_1_atv_9',
                        tipo: 'contagem_regressiva_sequencia',
                        titulo: 'Enigma do Desarme: Contagens Regressivas Secretas',
                        instrucoes: 'Um mecanismo codificado precisa de sequências regressivas para ser desativado! Digite os números que estão faltando em cada contagem decrescente.',
                        sequencias: [
                            {
                                id: 'reg_1',
                                titulo: 'Trilha 1: Contagem Regressiva de 1 em 1 (20 a 10)',
                                passo: '-1 em 1',
                                valores: [20, 19, 18, null, 16, 15, null, 13, 12, 11, 10],
                                respostasEsperadas: { '3': 17, '6': 14 }
                            },
                            {
                                id: 'reg_2',
                                titulo: 'Trilha 2: Contagem Regressiva de 2 em 2 (50 a 34)',
                                passo: '-2 em 2',
                                valores: [50, 48, 46, null, 42, 40, null, 36, 34],
                                respostasEsperadas: { '3': 44, '6': 38 }
                            },
                            {
                                id: 'reg_3',
                                titulo: 'Trilha 3: Contagem Regressiva de 5 em 5 (100 a 60)',
                                passo: '-5 em 5',
                                valores: [100, 95, 90, null, 80, 75, null, 65, 60],
                                respostasEsperadas: { '3': 85, '6': 70 }
                            },
                            {
                                id: 'reg_4',
                                titulo: 'Trilha 4: Contagem Regressiva de 10 em 10 (100 a 30)',
                                passo: '-10 em 10',
                                valores: [100, 90, null, 70, 60, null, 40, 30],
                                respostasEsperadas: { '2': 80, '5': 50 }
                            }
                        ],
                        dica: 'Dica Forense: Em contagens regressivas, subtraia sempre o passo constante (-1, -2, -5 ou -10) a cada casa!',
                        explicacao: 'Mecanismo pericial desativado! Você dominou todas as sequências regressivas da investigação.'
                    },
                    {
                        id: 'mat_1_atv_10',
                        tipo: 'quiz_numerico_forense',
                        titulo: 'O Cofre do Perito Chefe: Desafio Supremo de Senso Numérico',
                        instrucoes: 'Para abrir o cofre mestre da Aula 1 e concluir a investigação com honras, responda aos 5 desafios fundamentais de senso numérico!',
                        perguntas: [
                            {
                                id: 'q1',
                                enunciado: '1. Qual é o maior número formado por apenas 2 algarismos?',
                                respostaEsperada: '99',
                                placeholder: 'Digite o número'
                            },
                            {
                                id: 'q2',
                                enunciado: '2. Qual número fica exatamente entre o 149 e o 151?',
                                respostaEsperada: '150',
                                placeholder: 'Digite o número'
                            },
                            {
                                id: 'q3',
                                enunciado: '3. Se contarmos de 10 em 10 a partir do 40, qual é o 3º número da contagem? (40 ➔ 50 ➔ 60 ➔ ?)',
                                respostaEsperada: '70',
                                placeholder: 'Digite o número'
                            },
                            {
                                id: 'q4',
                                enunciado: '4. Quantas dezenas completas existem no número 80?',
                                respostaEsperada: '8',
                                placeholder: 'Digite a quantia'
                            },
                            {
                                id: 'q5',
                                enunciado: '5. Qual é o menor número PAR formado por 2 algarismos?',
                                respostaEsperada: '10',
                                placeholder: 'Digite o número'
                            }
                        ],
                        dica: 'Dica Forense: Relembre os conceitos vistos nesta aula: pares, dezenas, contagem de 10 em 10 e antecessores/sucessores!',
                        explicacao: 'PARABÉNS, DETETIVE SUPREMO! Você desvendou todos os 10 enigmas da Aula 1 com 100% de aproveitamento pericial!'
                    }
                ]
            }
        ]
    },

    portugues: {
        id: 'portugues',
        nome: 'Língua Portuguesa',
        subtitulo: 'Palavras, Testemunhos & Criptogramas',
        icone: 'fa-solid fa-book-open-reader',
        corTema: '#f59e0b',
        corTemaSecundaria: '#d97706',
        corGlow: 'rgba(245, 158, 11, 0.4)',
        descricao: 'Analise depoimentos com lupa, descubra mensagens cifradas, pontuações ambíguas e contradições nos testemunhos.',
        aulas: [
            {
                id: 'port_aula_1',
                numero: 1,
                titulo: 'O Segredo das Letras e Sílabas',
                descricao: 'Desenvolva suas habilidades periciais de alfabetização: restaure o alfabeto secreto, descubra as letras vizinhas, decifre palavras com pistas visuais, organize sílabas embaralhadas e separe as sílabas dos códigos!',
                dificuldade: 'Iniciante',
                tempoEstimado: '15 min',
                xpRecompensa: 100,
                atividades: [
                    {
                        id: 'port_1_atv_1',
                        tipo: 'alfabeto_lacunado',
                        titulo: 'Enigma do Alfabeto Pericial',
                        instrucoes: 'Os peritos encontraram a fita do alfabeto confidencial de A a Z com algumas letras apagadas pelo suspeito! Digite as letras que estão faltando nos espaços em destaque para restaurar todo o alfabeto.',
                        totalLetras: 26,
                        alfabeto: [
                            { letra: 'A', oculto: false },
                            { letra: 'B', oculto: false },
                            { letra: 'C', oculto: true },
                            { letra: 'D', oculto: false },
                            { letra: 'E', oculto: false },
                            { letra: 'F', oculto: true },
                            { letra: 'G', oculto: false },
                            { letra: 'H', oculto: false },
                            { letra: 'I', oculto: true },
                            { letra: 'J', oculto: false },
                            { letra: 'K', oculto: false },
                            { letra: 'L', oculto: true },
                            { letra: 'M', oculto: false },
                            { letra: 'N', oculto: false },
                            { letra: 'O', oculto: true },
                            { letra: 'P', oculto: false },
                            { letra: 'Q', oculto: false },
                            { letra: 'R', oculto: true },
                            { letra: 'S', oculto: false },
                            { letra: 'T', oculto: false },
                            { letra: 'U', oculto: true },
                            { letra: 'V', oculto: false },
                            { letra: 'W', oculto: false },
                            { letra: 'X', oculto: true },
                            { letra: 'Y', oculto: false },
                            { letra: 'Z', oculto: true }
                        ],
                        dica: 'Dica Forense: Recite o alfabeto em ordem: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z!',
                        explicacao: 'Excelente restauração! Você completou todas as letras do alfabeto com precisão pericial.'
                    },
                    {
                        id: 'port_1_atv_2',
                        tipo: 'vizinhos_alfabeto',
                        titulo: 'Enigma dos Vizinhos do Alfabeto (Antes e Depois)',
                        instrucoes: 'Para decodificar os carimbos secretos, os peritos precisam das letras vizinhas imediatas! Digite a letra que vem ANTES (à esquerda) e a letra que vem DEPOIS (à direita) de cada letra central.',
                        itens: [
                            { letra: 'B', antes: 'A', depois: 'C' },
                            { letra: 'E', antes: 'D', depois: 'F' },
                            { letra: 'J', antes: 'I', depois: 'K' },
                            { letra: 'M', antes: 'L', depois: 'N' },
                            { letra: 'P', antes: 'O', depois: 'Q' },
                            { letra: 'T', antes: 'S', depois: 'U' }
                        ],
                        dica: 'Dica Forense: Pense na ordem alfabética! Qual letra vem logo antes e qual vem logo em seguida?',
                        explicacao: 'Incrível dedução! Você identificou corretamente todos os vizinhos alfabéticos dos códigos.'
                    },
                    {
                        id: 'port_1_atv_3',
                        tipo: 'completar_palavras_desenho',
                        titulo: 'Enigma das Palavras com Pistas Visuais',
                        instrucoes: 'O laboratório forense fotografou várias pistas deixadas no local do crime! Observe o desenho (emoji) de cada pista e preencha as letras que faltam para completar o nome de cada evidência.',
                        itens: [
                            { id: 'item_1', emoji: '🐱', nomeCompleto: 'GATO', lacunas: ['G', null, 'T', null], respostasEsperadas: { '1': 'A', '3': 'O' } },
                            { id: 'item_2', emoji: '🏠', nomeCompleto: 'CASA', lacunas: ['C', null, 'S', null], respostasEsperadas: { '1': 'A', '3': 'A' } },
                            { id: 'item_3', emoji: '🍌', nomeCompleto: 'BANANA', lacunas: ['B', null, 'N', null, 'N', null], respostasEsperadas: { '1': 'A', '3': 'A', '5': 'A' } },
                            { id: 'item_4', emoji: '🍿', nomeCompleto: 'PIPOCA', lacunas: ['P', null, 'P', null, 'C', null], respostasEsperadas: { '1': 'I', '3': 'O', '5': 'A' } },
                            { id: 'item_5', emoji: '⚽', nomeCompleto: 'BOLA', lacunas: [null, 'O', null, 'A'], respostasEsperadas: { '0': 'B', '2': 'L' } },
                            { id: 'item_6', emoji: '🐵', nomeCompleto: 'MACACO', lacunas: ['M', null, 'C', null, 'C', null], respostasEsperadas: { '1': 'A', '3': 'A', '5': 'O' } }
                        ],
                        dica: 'Dica Forense: Fale o nome do desenho em voz alta e preste atenção no som das vogais e consoantes que faltam!',
                        explicacao: 'Sensacional, Agente! Todas as palavras foram decifradas e completadas com base nas evidências visuais!'
                    },
                    {
                        id: 'port_1_atv_4',
                        tipo: 'juntar_silabas_palavra',
                        titulo: 'Enigma da Montagem de Sílabas (Junte e Forme)',
                        instrucoes: 'As sílabas das palavras foram cortadas e desordenadas pelo criminoso! Clique nas sílabas na ordem correta para reconstruir cada palavra misteriosa.',
                        itens: [
                            { id: 'syl_1', palavra: 'CASA', emoji: '🏠', silabasDesordenadas: ['SA', 'CA'], ordemCorreta: ['CA', 'SA'] },
                            { id: 'syl_2', palavra: 'BONECA', emoji: '🪆', silabasDesordenadas: ['CA', 'BO', 'NE'], ordemCorreta: ['BO', 'NE', 'CA'] },
                            { id: 'syl_3', palavra: 'SAPATO', emoji: '👞', silabasDesordenadas: ['TO', 'SA', 'PA'], ordemCorreta: ['SA', 'PA', 'TO'] },
                            { id: 'syl_4', palavra: 'TAPETE', emoji: '🧶', silabasDesordenadas: ['TE', 'TA', 'PE'], ordemCorreta: ['TA', 'PE', 'TE'] },
                            { id: 'syl_5', palavra: 'CORUJA', emoji: '🦉', silabasDesordenadas: ['JA', 'RU', 'CO'], ordemCorreta: ['CO', 'RU', 'JA'] },
                            { id: 'syl_6', palavra: 'DETETIVE', emoji: '🕵️', silabasDesordenadas: ['VE', 'DE', 'TI', 'TE'], ordemCorreta: ['DE', 'TE', 'TI', 'VE'] }
                        ],
                        dica: 'Dica Forense: Fale a palavra pausadamente e encontre o primeiro pedacinho (primeira sílaba), depois o segundo e assim por diante!',
                        explicacao: 'Excelente trabalho tático! Você reuniu e ordenou todas as sílabas, reconstruindo os depoimentos!'
                    },
                    {
                        id: 'port_1_atv_5',
                        tipo: 'separar_silabas',
                        titulo: 'Enigma da Separação Silábica',
                        instrucoes: 'A perícia precisa catalogar cada pedacinho sonoro das palavras! Digite cada sílaba no seu respectivo campo na frente de cada palavra.',
                        itens: [
                            { palavra: 'BONECA', emoji: '🪆', silabasEsperadas: ['BO', 'NE', 'CA'], totalSilabas: 3 },
                            { palavra: 'PIPOCA', emoji: '🍿', silabasEsperadas: ['PI', 'PO', 'CA'], totalSilabas: 3 },
                            { palavra: 'MACACO', emoji: '🐵', silabasEsperadas: ['MA', 'CA', 'CO'], totalSilabas: 3 },
                            { palavra: 'SAPATO', emoji: '👞', silabasEsperadas: ['SA', 'PA', 'TO'], totalSilabas: 3 },
                            { palavra: 'CADERNO', emoji: '📓', silabasEsperadas: ['CA', 'DER', 'NO'], totalSilabas: 3 },
                            { palavra: 'GATO', emoji: '🐱', silabasEsperadas: ['GA', 'TO'], totalSilabas: 2 }
                        ],
                        dica: 'Dica Forense: Bata palmas ou conte nos dedos quantas vezes você abre a boca para falar cada palavra. Cada batida é uma sílaba!',
                        explicacao: 'PARABÉNS, DETETIVE MESTRE DA LÍNGUA PORTUGUESA! Você completou com perfeição todos os 5 enigmas de Sílabas com nota máxima!'
                    }
                ]
            }
        ]
    }
};

// Funções utilitárias de busca curricular
function getDisciplina(key) {
    return CURRICULO_INVESTIGACAO[key] || null;
}

function getAula(subjectKey, lessonId) {
    const subj = getDisciplina(subjectKey);
    if (!subj) return null;
    return subj.aulas.find(a => a.id === lessonId) || null;
}

function getProximaAula(subjectKey, completedLessonsObj = {}) {
    const subj = getDisciplina(subjectKey);
    if (!subj) return null;
    for (const aula of subj.aulas) {
        if (!completedLessonsObj[aula.id] || !completedLessonsObj[aula.id].completed) {
            return aula;
        }
    }
    return null; // Todas concluídas
}
