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
            },
            {
                id: 'mat_aula_2',
                numero: 2,
                titulo: 'Operações Básicas - Parte 1',
                descricao: 'Domine as operações fundamentais da perícia matemática: some e subtraia através da contagem visual de evidências, execute os algoritmos armados com "sobe 1" e "empréstimo/troca", e descubra a multiplicação como a soma de parcelas iguais!',
                dificuldade: 'Iniciante',
                tempoEstimado: '25 min',
                xpRecompensa: 120,
                atividades: [
                    {
                        id: 'mat_2_atv_1',
                        tipo: 'soma_quantidades',
                        titulo: 'Enigma dos Lotes Periciais: Soma por Quantidades',
                        instrucoes: 'Os detetives coletaram lotes de evidências em duas caixas periciais. Conte os objetos de cada card, some as quantidades e digite o número total no card de resposta correspondente!',
                        linhas: [
                            {
                                id: 'sq_1',
                                label: 'Pista 1: Lupas Forenses',
                                card1: { icone: '🔍', nome: 'Lupas', quantidade: 4 },
                                card2: { icone: '🔍', nome: 'Lupas', quantidade: 3 },
                                respostaEsperada: 7
                            },
                            {
                                id: 'sq_2',
                                label: 'Pista 2: Pegadas Suspeitas',
                                card1: { icone: '🐾', nome: 'Pegadas', quantidade: 6 },
                                card2: { icone: '🐾', nome: 'Pegadas', quantidade: 5 },
                                respostaEsperada: 11
                            },
                            {
                                id: 'sq_3',
                                label: 'Pista 3: Chaves Mestras',
                                card1: { icone: '🔑', nome: 'Chaves', quantidade: 8 },
                                card2: { icone: '🔑', nome: 'Chaves', quantidade: 4 },
                                respostaEsperada: 12
                            },
                            {
                                id: 'sq_4',
                                label: 'Pista 4: Maletas Secretas',
                                card1: { icone: '💼', nome: 'Maletas', quantidade: 5 },
                                card2: { icone: '💼', nome: 'Maletas', quantidade: 7 },
                                respostaEsperada: 12
                            },
                            {
                                id: 'sq_5',
                                label: 'Pista 5: Crachás de Acesso',
                                card1: { icone: '🛡️', nome: 'Crachás', quantidade: 9 },
                                card2: { icone: '🛡️', nome: 'Crachás', quantidade: 6 },
                                respostaEsperada: 15
                            }
                        ],
                        dica: 'Dica Forense: Conte primeiro todos os objetos do primeiro card e continue a contagem adicionando os objetos do segundo card!',
                        explicacao: 'Excelente contagem, Detetive! Todas as somas de evidências foram calculadas com exatidão pericial.'
                    },
                    {
                        id: 'mat_2_atv_2',
                        tipo: 'subtracao_quantidades',
                        titulo: 'Enigma do Inventário Pericial: Subtração por Quantidades',
                        instrucoes: 'Evidências do primeiro lote precisaram ser transferidas ou analisadas pelo laboratório. Observe a quantidade inicial no primeiro card, subtraia a quantia do segundo card e digite quantas evidências restaram!',
                        linhas: [
                            {
                                id: 'subq_1',
                                label: 'Caso 1: Diamantes Preciosos',
                                card1: { icone: '💎', nome: 'Diamantes', quantidade: 8 },
                                card2: { icone: '💎', nome: 'Diamantes', quantidade: 3 },
                                respostaEsperada: 5
                            },
                            {
                                id: 'subq_2',
                                label: 'Caso 2: Lanternas Táticas',
                                card1: { icone: '🔦', nome: 'Lanternas', quantidade: 9 },
                                card2: { icone: '🔦', nome: 'Lanternas', quantidade: 4 },
                                respostaEsperada: 5
                            },
                            {
                                id: 'subq_3',
                                label: 'Caso 3: Moedas Antigas',
                                card1: { icone: '🪙', nome: 'Moedas', quantidade: 12 },
                                card2: { icone: '🪙', nome: 'Moedas', quantidade: 5 },
                                respostaEsperada: 7
                            },
                            {
                                id: 'subq_4',
                                label: 'Caso 4: Cadeados de Segurança',
                                card1: { icone: '🔒', nome: 'Cadeados', quantidade: 10 },
                                card2: { icone: '🔒', nome: 'Cadeados', quantidade: 6 },
                                respostaEsperada: 4
                            },
                            {
                                id: 'subq_5',
                                label: 'Caso 5: Pastas Confidenciais',
                                card1: { icone: '📁', nome: 'Pastas', quantidade: 14 },
                                card2: { icone: '📁', nome: 'Pastas', quantidade: 8 },
                                respostaEsperada: 6
                            }
                        ],
                        dica: 'Dica Forense: Subtrair significa retirar! Conte quantos itens havia no primeiro card e retire a quantidade indicada no segundo card.',
                        explicacao: 'Perfeito, Agente! Todas as subtrações de evidências foram auditadas com sucesso.'
                    },
                    {
                        id: 'mat_2_atv_3',
                        tipo: 'algoritmo_soma',
                        titulo: 'O Algoritmo Pericial da Soma: Contas Armadas e "Sobe 1"',
                        instrucoes: 'Resolva cada conta armada calculando coluna por coluna (começando sempre pelas UNIDADES, depois DEZENAS e CENTENAS). Se a soma de uma coluna for 10 ou mais, anote o algarismo das unidades no resultado e digite "1" no espaço do "Sobe 1" da ordem seguinte!',
                        contas: [
                            {
                                id: 'asoma_1',
                                titulo: 'Operação 1: 24 + 15 (Sem transporte)',
                                ordens: ['D', 'U'],
                                parcela1: { D: 2, U: 4 },
                                parcela2: { D: 1, U: 5 },
                                vaiUm: { D: null },
                                resultadoEsperado: { D: 3, U: 9 },
                                total: 39
                            },
                            {
                                id: 'asoma_2',
                                titulo: 'Operação 2: 38 + 27 (Com "Sobe 1" nas Dezenas)',
                                ordens: ['D', 'U'],
                                parcela1: { D: 3, U: 8 },
                                parcela2: { D: 2, U: 7 },
                                vaiUm: { D: 1 },
                                resultadoEsperado: { D: 6, U: 5 },
                                total: 65
                            },
                            {
                                id: 'asoma_3',
                                titulo: 'Operação 3: 146 + 238 (Com "Sobe 1" nas Dezenas)',
                                ordens: ['C', 'D', 'U'],
                                parcela1: { C: 1, D: 4, U: 6 },
                                parcela2: { C: 2, D: 3, U: 8 },
                                vaiUm: { C: null, D: 1 },
                                resultadoEsperado: { C: 3, D: 8, U: 4 },
                                total: 384
                            },
                            {
                                id: 'asoma_4',
                                titulo: 'Operação 4: 375 + 258 (Com "Sobe 1" duplo nas Dezenas e Centenas)',
                                ordens: ['C', 'D', 'U'],
                                parcela1: { C: 3, D: 7, U: 5 },
                                parcela2: { C: 2, D: 5, U: 8 },
                                vaiUm: { C: 1, D: 1 },
                                resultadoEsperado: { C: 6, D: 3, U: 3 },
                                total: 633
                            }
                        ],
                        dica: 'Dica Forense: Comece sempre pela coluna das UNIDADES (da direita para a esquerda)! Se a soma for 10 ou mais, anote a unidade embaixo e coloque 1 na bolha "Sobe 1" da coluna seguinte.',
                        explicacao: 'Fantástico domínio do algoritmo, Detetive! Você calculou todas as adições e gerenciou perfeitamente os transportes ("sobe 1").'
                    },
                    {
                        id: 'mat_2_atv_4',
                        tipo: 'algoritmo_subtracao',
                        titulo: 'O Algoritmo Pericial da Subtração: Troca e Empréstimo',
                        instrucoes: 'Resolva as contas armadas de subtração calculando ordem por ordem, começando pelas UNIDADES. Quando o número superior for menor que o inferior, faça a TROCA (empréstimo): anote o novo valor da ordem que emprestou e o novo valor aumentado da ordem que recebeu!',
                        contas: [
                            {
                                id: 'asub_1',
                                titulo: 'Operação 1: 58 - 25 (Sem necessidade de troca)',
                                ordens: ['D', 'U'],
                                minuendo: { D: 5, U: 8 },
                                subtraendo: { D: 2, U: 5 },
                                trocas: { D: null, U: null },
                                resultadoEsperado: { D: 3, U: 3 },
                                total: 33
                            },
                            {
                                id: 'asub_2',
                                titulo: 'Operação 2: 63 - 28 (Troca da Dezena para as Unidades)',
                                ordens: ['D', 'U'],
                                minuendo: { D: 6, U: 3 },
                                subtraendo: { D: 2, U: 8 },
                                trocas: { D: 5, U: 13 },
                                resultadoEsperado: { D: 3, U: 5 },
                                total: 35
                            },
                            {
                                id: 'asub_3',
                                titulo: 'Operação 3: 352 - 127 (Troca na Unidade)',
                                ordens: ['C', 'D', 'U'],
                                minuendo: { C: 3, D: 5, U: 2 },
                                subtraendo: { C: 1, D: 2, U: 7 },
                                trocas: { C: null, D: 4, U: 12 },
                                resultadoEsperado: { C: 2, D: 2, U: 5 },
                                total: 225
                            },
                            {
                                id: 'asub_4',
                                titulo: 'Operação 4: 528 - 274 (Troca da Centena para as Dezenas)',
                                ordens: ['C', 'D', 'U'],
                                minuendo: { C: 5, D: 2, U: 8 },
                                subtraendo: { C: 2, D: 7, U: 4 },
                                trocas: { C: 4, D: 12, U: null },
                                resultadoEsperado: { C: 2, D: 5, U: 4 },
                                total: 254
                            }
                        ],
                        dica: 'Dica Forense: Se o algarismo de cima for menor que o de baixo, ele pede emprestado à ordem vizinha à esquerda! A ordem vizinha perde 1 e a atual ganha 10.',
                        explicacao: 'Excelente técnica pericial! O algoritmo da subtração e a mecânica das trocas foram executados com maestria.'
                    },
                    {
                        id: 'mat_2_atv_5',
                        tipo: 'multiplicacao_parcelas_iguais',
                        titulo: 'Decodificador de Multiplicação: Soma de Parcelas Iguais',
                        instrucoes: 'A multiplicação é uma forma rápida e eficiente de somar parcelas iguais! Para cada soma repetida abaixo, clique na opção de MULTIPLICAÇÃO que representa exatamente aquela operação.',
                        casos: [
                            {
                                id: 'mult_1',
                                titulo: 'Código 1: Parcelas de 4',
                                expressaoSoma: '4 + 4 + 4',
                                parcelas: [4, 4, 4],
                                total: 12,
                                respostaCorreta: '3x4',
                                opcoes: [
                                    { id: '3x3', texto: '3 × 3' },
                                    { id: '3x4', texto: '3 × 4' },
                                    { id: '4x4', texto: '4 × 4' },
                                    { id: '2x4', texto: '2 × 4' }
                                ]
                            },
                            {
                                id: 'mult_2',
                                titulo: 'Código 2: Parcelas de 5',
                                expressaoSoma: '5 + 5 + 5 + 5',
                                parcelas: [5, 5, 5, 5],
                                total: 20,
                                respostaCorreta: '4x5',
                                opcoes: [
                                    { id: '5x5', texto: '5 × 5' },
                                    { id: '3x5', texto: '3 × 5' },
                                    { id: '4x5', texto: '4 × 5' },
                                    { id: '4x4', texto: '4 × 4' }
                                ]
                            },
                            {
                                id: 'mult_3',
                                titulo: 'Código 3: Parcelas de 2',
                                expressaoSoma: '2 + 2 + 2 + 2 + 2 + 2',
                                parcelas: [2, 2, 2, 2, 2, 2],
                                total: 12,
                                respostaCorreta: '6x2',
                                opcoes: [
                                    { id: '5x2', texto: '5 × 2' },
                                    { id: '2x2', texto: '2 × 2' },
                                    { id: '6x6', texto: '6 × 6' },
                                    { id: '6x2', texto: '6 × 2' }
                                ]
                            },
                            {
                                id: 'mult_4',
                                titulo: 'Código 4: Parcelas de 7',
                                expressaoSoma: '7 + 7',
                                parcelas: [7, 7],
                                total: 14,
                                respostaCorreta: '2x7',
                                opcoes: [
                                    { id: '3x7', texto: '3 × 7' },
                                    { id: '2x7', texto: '2 × 7' },
                                    { id: '7x7', texto: '7 × 7' },
                                    { id: '2x2', texto: '2 × 2' }
                                ]
                            },
                            {
                                id: 'mult_5',
                                titulo: 'Código 5: Parcelas de 6',
                                expressaoSoma: '6 + 6 + 6',
                                parcelas: [6, 6, 6],
                                total: 18,
                                respostaCorreta: '3x6',
                                opcoes: [
                                    { id: '4x6', texto: '4 × 6' },
                                    { id: '3x3', texto: '3 × 3' },
                                    { id: '3x6', texto: '3 × 6' },
                                    { id: '6x6', texto: '6 × 6' }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Conte quantas vezes a parcela se repete! Exemplo: 4 + 4 + 4 são 3 parcelas de 4, logo a multiplicação é 3 × 4.',
                        explicacao: 'PARABÉNS, AGENTE ESPECIAL! Você dominou as operações básicas de adição, subtração e multiplicação!'
                    },
                    {
                        id: 'mat_2_atv_6',
                        tipo: 'algoritmo_multiplicacao',
                        titulo: 'O Algoritmo Pericial da Multiplicação: Contas Armadas e Transporte ("Sobe")',
                        instrucoes: 'Resolva as multiplicações armadas calculando da direita para a esquerda. Use os círculos superiores do "Sobe" para anotar o transporte quando a multiplicação de uma casa for 10 ou mais (por exemplo, se 5 × 8 = 40, anote 0 no resultado e suba 4 na próxima casa). Em contas com mais de um algarismo no multiplicador, calcule cada produto parcial e depois some para encontrar o resultado final. Todos os campos ganham contorno verde ao digitar o número correto!',
                        contas: [
                            {
                                id: 'amult_1',
                                titulo: 'Operação 1: 243 × 6 (1 Algarismo)',
                                multiplicando: '243',
                                multiplicador: '6',
                                sobeLinhas: [
                                    { id: 's1', label: 'Sobe', carries: [2, 1, null] }
                                ],
                                parciais: [],
                                resultadoEsperado: '1458',
                                total: 1458
                            },
                            {
                                id: 'amult_2',
                                titulo: 'Operação 2: 268 × 25 (2 Algarismos)',
                                multiplicando: '268',
                                multiplicador: '25',
                                sobeLinhas: [
                                    { id: 's1', label: 'Sobe (×5)', carries: [3, 4, null] },
                                    { id: 's2', label: 'Sobe (×2)', carries: [1, 1, null] }
                                ],
                                parciais: [
                                    { label: '268 × 5', valor: '1340', deslocamento: 0 },
                                    { label: '268 × 20', valor: '5360', deslocamento: 0 }
                                ],
                                resultadoEsperado: '6700',
                                total: 6700
                            },
                            {
                                id: 'amult_3',
                                titulo: 'Operação 3: 315 × 24 (2 Algarismos)',
                                multiplicando: '315',
                                multiplicador: '24',
                                sobeLinhas: [
                                    { id: 's1', label: 'Sobe (×4)', carries: [null, 2, null] },
                                    { id: 's2', label: 'Sobe (×2)', carries: [null, 1, null] }
                                ],
                                parciais: [
                                    { label: '315 × 4', valor: '1260', deslocamento: 0 },
                                    { label: '315 × 20', valor: '6300', deslocamento: 0 }
                                ],
                                resultadoEsperado: '7560',
                                total: 7560
                            },
                            {
                                id: 'amult_4',
                                titulo: 'Operação 4: 142 × 123 (3 Algarismos)',
                                multiplicando: '142',
                                multiplicador: '123',
                                sobeLinhas: [
                                    { id: 's1', label: 'Sobe (×3)', carries: [1, null, null] }
                                ],
                                parciais: [
                                    { label: '142 × 3', valor: '426', deslocamento: 0 },
                                    { label: '142 × 20', valor: '2840', deslocamento: 0 },
                                    { label: '142 × 100', valor: '14200', deslocamento: 0 }
                                ],
                                resultadoEsperado: '17466',
                                total: 17466
                            }
                        ],
                        dica: 'Dica Forense: Multiplique primeiro as unidades. Lembre-se de preencher as bolhas superiores do "Sobe" quando o produto dos dígitos passar de 10 e somar esse transporte no cálculo da coluna vizinha!',
                        explicacao: 'Incrível domínio do algoritmo da multiplicação! Você calculou com exatidão operações de 1, 2 e 3 algarismos com todos os transportes periciais.'
                    },
                    {
                        id: 'mat_2_atv_7',
                        tipo: 'soma_parcela_faltando',
                        titulo: 'Enigma da Parcela Secreta: Adição com Termo Faltando',
                        instrucoes: 'Os peritos encontraram equações com uma das parcelas apagada pelo suspeito! Use a dedução (ou a operação inversa: subtraia a parcela conhecida do total) para descobrir qual parcela está faltando em cada caso.',
                        itens: [
                            { id: 'spf_1', posicaoFaltando: 'parcela2', parcela1: 45, parcela2: null, total: 82, respostaEsperada: 37 },
                            { id: 'spf_2', posicaoFaltando: 'parcela1', parcela1: null, parcela2: 68, total: 115, respostaEsperada: 47 },
                            { id: 'spf_3', posicaoFaltando: 'parcela2', parcela1: 120, parcela2: null, total: 250, respostaEsperada: 130 },
                            { id: 'spf_4', posicaoFaltando: 'parcela1', parcela1: null, parcela2: 74, total: 100, respostaEsperada: 26 },
                            { id: 'spf_5', posicaoFaltando: 'parcela2', parcela1: 89, parcela2: null, total: 142, respostaEsperada: 53 },
                            { id: 'spf_6', posicaoFaltando: 'parcela1', parcela1: null, parcela2: 155, total: 300, respostaEsperada: 145 }
                        ],
                        dica: 'Dica Forense: Para descobrir a parcela que falta, subtraia a parcela conhecida do resultado total! Exemplo: se 45 + ? = 82, faça 82 - 45 = 37.',
                        explicacao: 'Dedução pericial impecável! Todas as 6 parcelas ocultas foram reveladas com sucesso.'
                    },
                    {
                        id: 'mat_2_atv_8',
                        tipo: 'subtracao_numero_faltando',
                        titulo: 'Enigma do Termo Desconhecido: Subtração com Número Faltando',
                        instrucoes: 'Descubra qual número está faltando em cada subtração. Se faltar o subtraendo, faça Minuendo - Resto. Se faltar o minuendo, some o Subtraendo com o Resto!',
                        itens: [
                            { id: 'snf_1', tipoFaltando: 'subtraendo', minuendo: 94, subtraendo: null, resto: 61, respostaEsperada: 33 },
                            { id: 'snf_2', tipoFaltando: 'minuendo', minuendo: null, subtraendo: 35, resto: 48, respostaEsperada: 83 },
                            { id: 'snf_3', tipoFaltando: 'subtraendo', minuendo: 150, subtraendo: null, resto: 85, respostaEsperada: 65 },
                            { id: 'snf_4', tipoFaltando: 'minuendo', minuendo: null, subtraendo: 72, resto: 128, respostaEsperada: 200 },
                            { id: 'snf_5', tipoFaltando: 'subtraendo', minuendo: 210, subtraendo: null, resto: 145, respostaEsperada: 65 },
                            { id: 'snf_6', tipoFaltando: 'minuendo', minuendo: null, subtraendo: 59, resto: 41, respostaEsperada: 100 }
                        ],
                        dica: 'Dica Forense: Se o número que falta está no começo ([?] - B = C), some: B + C. Se estiver no meio (A - [?] = C), subtraia: A - C.',
                        explicacao: 'Excelente análise, Agente! Todos os números ocultos das subtrações foram perfeitamente identificados.'
                    },
                    {
                        id: 'mat_2_atv_9',
                        tipo: 'tabuadas_verticais',
                        titulo: 'O Grande Arquivo das Tabuadas: Tabuadas Verticais de 1 a 10',
                        instrucoes: 'Navegue pelas abas das tabuadas de 1 a 10 e complete os resultados de cada multiplicação vertical. Ao digitar o produto correto, o campo ficará com contorno verde imediatamente!',
                        tabuadas: [
                            { base: 1, titulo: 'Tabuada do 1' },
                            { base: 2, titulo: 'Tabuada do 2' },
                            { base: 3, titulo: 'Tabuada do 3' },
                            { base: 4, titulo: 'Tabuada do 4' },
                            { base: 5, titulo: 'Tabuada do 5' },
                            { base: 6, titulo: 'Tabuada do 6' },
                            { base: 7, titulo: 'Tabuada do 7' },
                            { base: 8, titulo: 'Tabuada do 8' },
                            { base: 9, titulo: 'Tabuada do 9' },
                            { base: 10, titulo: 'Tabuada do 10' }
                        ],
                        dica: 'Dica Forense: Cada tabuada pula de acordo com sua base (ex: na tabuada do 7, cada linha soma +7 ao valor anterior: 7, 14, 21, 28...).',
                        explicacao: 'MESTRE DA MULTIPLICAÇÃO! Todas as 10 tabuadas foram completadas com 100% de precisão!'
                    },
                    {
                        id: 'mat_2_atv_10',
                        tipo: 'fator_faltando',
                        titulo: 'O Cofre dos Fatores Ocultos: Multiplicação com Fator Faltando',
                        instrucoes: 'Descubra qual é o fator que falta para completar a multiplicação e abrir o cofre pericial final da aula. Digite o número e veja o contorno verde confirmar seu acerto!',
                        itens: [
                            { id: 'ff_1', fator1: 6, fator2: null, produto: 42, respostaEsperada: 7 },
                            { id: 'ff_2', fator1: null, fator2: 8, produto: 56, respostaEsperada: 7 },
                            { id: 'ff_3', fator1: 9, fator2: null, produto: 72, respostaEsperada: 8 },
                            { id: 'ff_4', fator1: null, fator2: 5, produto: 45, respostaEsperada: 9 },
                            { id: 'ff_5', fator1: 7, fator2: null, produto: 63, respostaEsperada: 9 },
                            { id: 'ff_6', fator1: null, fator2: 4, produto: 36, respostaEsperada: 9 },
                            { id: 'ff_7', fator1: 8, fator2: null, produto: 64, respostaEsperada: 8 },
                            { id: 'ff_8', fator1: null, fator2: 3, produto: 27, respostaEsperada: 9 }
                        ],
                        dica: 'Dica Forense: Pense: "qual número vezes o fator conhecido dá o produto?" Exemplo: 6 vezes quanto dá 42? 6 × 7 = 42!',
                        explicacao: 'PARABÉNS SUPREMO, DETETIVE MESTRE! Você concluiu todos os 10 enigmas da Aula 02 de Matemática com honras periciais!'
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
                descricao: 'Desenvolva suas habilidades periciais completas: restaure o alfabeto secreto, descubra letras vizinhas, monte e separe sílabas, domine dígrafos e sílabas complexas (LH, NH, CH, RR, SS), desmascare intrusos, decifre rimas, monte anagramas, audite ortografias e resolva o grande criptograma final!',
                dificuldade: 'Iniciante',
                tempoEstimado: '35 min',
                xpRecompensa: 150,
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
                        explicacao: 'Excelente separação silábica! Todos os blocos sonoros foram catalogados perfeitamente.'
                    },
                    {
                        id: 'port_1_atv_6',
                        tipo: 'completar_silabas_banco',
                        titulo: 'Enigma do Banco de Sílabas Pericial',
                        instrucoes: 'Várias evidências estão com sílabas faltando! Observe o banco de sílabas disponíveis e selecione ou digite a sílaba correta para completar cada palavra.',
                        bancoSilabas: ['LU', 'SA', 'PO', 'BO', 'PA', 'JA', 'TO', 'MA'],
                        itens: [
                            { id: 'sb_1', emoji: '🔍', palavraCompleta: 'LUPA', prefixo: '', sufixo: 'PA', respostaEsperada: 'LU' },
                            { id: 'sb_2', emoji: '🏠', palavraCompleta: 'CASA', prefixo: 'CA', sufixo: '', respostaEsperada: 'SA' },
                            { id: 'sb_3', emoji: '🍿', palavraCompleta: 'PIPOCA', prefixo: 'PI', sufixo: 'CA', respostaEsperada: 'PO' },
                            { id: 'sb_4', emoji: '🪆', palavraCompleta: 'BONECA', prefixo: '', sufixo: 'NECA', respostaEsperada: 'BO' },
                            { id: 'sb_5', emoji: '👞', palavraCompleta: 'SAPATO', prefixo: 'SA', sufixo: 'TO', respostaEsperada: 'PA' },
                            { id: 'sb_6', emoji: '🦉', palavraCompleta: 'CORUJA', prefixo: 'CORU', sufixo: '', respostaEsperada: 'JA' },
                            { id: 'sb_7', emoji: '🐱', palavraCompleta: 'GATO', prefixo: 'GA', sufixo: '', respostaEsperada: 'TO' },
                            { id: 'sb_8', emoji: '🐵', palavraCompleta: 'MACACO', prefixo: '', sufixo: 'CACO', respostaEsperada: 'MA' }
                        ],
                        dica: 'Dica Forense: Veja qual sílaba do banco se encaixa no espaço vazio para formar o nome correto do desenho!',
                        explicacao: 'Excelente dedução! Todas as 8 palavras foram restauradas com as sílabas do banco pericial.'
                    },
                    {
                        id: 'port_1_atv_7',
                        tipo: 'formar_com_silaba_fixa',
                        titulo: 'Enigma do Radar Silábico (Sílaba Fixa)',
                        instrucoes: 'Os peritos encontraram uma sílaba base em cada caso! Observe a SÍLABA FIXA em destaque e selecione TODAS as outras sílabas que, combinadas com ela, formam palavras reais.',
                        itens: [
                            {
                                id: 'fix_1',
                                silabaFixa: 'CA',
                                opcoes: [
                                    { silaba: 'SA', formaPalavra: true, palavraFormada: 'CASA' },
                                    { silaba: 'BO', formaPalavra: true, palavraFormada: 'CABO' },
                                    { silaba: 'MA', formaPalavra: true, palavraFormada: 'CAMA' },
                                    { silaba: 'RO', formaPalavra: true, palavraFormada: 'CARO' },
                                    { silaba: 'LHA', formaPalavra: false },
                                    { silaba: 'OI', formaPalavra: false },
                                    { silaba: 'XU', formaPalavra: false }
                                ]
                            },
                            {
                                id: 'fix_2',
                                silabaFixa: 'BO',
                                opcoes: [
                                    { silaba: 'LA', formaPalavra: true, palavraFormada: 'BOLA' },
                                    { silaba: 'CA', formaPalavra: true, palavraFormada: 'BOCA' },
                                    { silaba: 'LO', formaPalavra: true, palavraFormada: 'BOLO' },
                                    { silaba: 'TO', formaPalavra: true, palavraFormada: 'BOTO' },
                                    { silaba: 'FI', formaPalavra: false },
                                    { silaba: 'JE', formaPalavra: false },
                                    { silaba: 'LU', formaPalavra: false }
                                ]
                            },
                            {
                                id: 'fix_3',
                                silabaFixa: 'PA',
                                opcoes: [
                                    { silaba: 'TO', formaPalavra: true, palavraFormada: 'PATO' },
                                    { silaba: 'PO', formaPalavra: true, palavraFormada: 'PAPO' },
                                    { silaba: 'NO', formaPalavra: true, palavraFormada: 'PANO' },
                                    { silaba: 'PA', formaPalavra: true, palavraFormada: 'PAPA' },
                                    { silaba: 'QI', formaPalavra: false },
                                    { silaba: 'VO', formaPalavra: false },
                                    { silaba: 'LE', formaPalavra: false }
                                ]
                            },
                            {
                                id: 'fix_4',
                                silabaFixa: 'SA',
                                opcoes: [
                                    { silaba: 'PO', formaPalavra: true, palavraFormada: 'SAPO' },
                                    { silaba: 'CO', formaPalavra: true, palavraFormada: 'SACO' },
                                    { silaba: 'LA', formaPalavra: true, palavraFormada: 'SALA' },
                                    { silaba: 'IA', formaPalavra: true, palavraFormada: 'SAIA' },
                                    { silaba: 'FE', formaPalavra: false },
                                    { silaba: 'BO', formaPalavra: false },
                                    { silaba: 'TU', formaPalavra: false }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Junte a sílaba fixa com cada opção e fale em voz alta. Se for uma palavra de verdade, clique para selecioná-la!',
                        explicacao: 'Radar calibrado com sucesso! Você identificou todas as combinações válidas da língua portuguesa.'
                    },
                    {
                        id: 'port_1_atv_8',
                        tipo: 'classificar_contagem_silabas',
                        titulo: 'Enigma do Arquivo Silábico (Classificação por Sílabas)',
                        instrucoes: 'Classifique as evidências pelo número de sílabas! Clique em uma palavra do banco e, em seguida, clique na gaveta pericial correspondente para arquivá-la (ou clique nela dentro da gaveta para devolvê-la ao banco).',
                        categorias: [
                            { id: 'monossilaba', titulo: 'Monossílabas', subtitulo: '1 Sílaba', icone: '1️⃣', cor: '#38bdf8' },
                            { id: 'dissilaba', titulo: 'Dissílabas', subtitulo: '2 Sílabas', icone: '2️⃣', cor: '#10b981' },
                            { id: 'trissilaba', titulo: 'Trissílabas', subtitulo: '3 Sílabas', icone: '3️⃣', cor: '#f59e0b' },
                            { id: 'polissilaba', titulo: 'Polissílabas', subtitulo: '4 ou mais Sílabas', icone: '4️⃣', cor: '#ec4899' }
                        ],
                        palavras: [
                            { id: 'w1', palavra: 'SOL', categoriaCorreta: 'monossilaba', silabas: 'SOL (1)' },
                            { id: 'w2', palavra: 'PÉ', categoriaCorreta: 'monossilaba', silabas: 'PÉ (1)' },
                            { id: 'w3', palavra: 'MÃO', categoriaCorreta: 'monossilaba', silabas: 'MÃO (1)' },
                            { id: 'w4', palavra: 'LUPA', categoriaCorreta: 'dissilaba', silabas: 'LU-PA (2)' },
                            { id: 'w5', palavra: 'GATO', categoriaCorreta: 'dissilaba', silabas: 'GA-TO (2)' },
                            { id: 'w6', palavra: 'CASA', categoriaCorreta: 'dissilaba', silabas: 'CA-SA (2)' },
                            { id: 'w7', palavra: 'PIPOCA', categoriaCorreta: 'trissilaba', silabas: 'PI-PO-CA (3)' },
                            { id: 'w8', palavra: 'CORUJA', categoriaCorreta: 'trissilaba', silabas: 'CO-RU-JA (3)' },
                            { id: 'w9', palavra: 'CADERNO', categoriaCorreta: 'trissilaba', silabas: 'CA-DER-NO (3)' },
                            { id: 'w10', palavra: 'DETETIVE', categoriaCorreta: 'polissilaba', silabas: 'DE-TE-TI-VE (4)' },
                            { id: 'w11', palavra: 'BORBOLETA', categoriaCorreta: 'polissilaba', silabas: 'BOR-BO-LE-TA (4)' },
                            { id: 'w12', palavra: 'INVESTIGADOR', categoriaCorreta: 'polissilaba', silabas: 'IN-VES-TI-GA-DOR (5)' }
                        ],
                        dica: 'Dica Forense: Monossílaba = 1 sílaba; Dissílaba = 2 sílabas; Trissílaba = 3 sílabas; Polissílaba = 4 ou mais sílabas!',
                        explicacao: 'Arquivo forense 100% organizado! Todas as 12 palavras foram classificadas com precisão pericial.'
                    },
                    {
                        id: 'port_1_atv_9',
                        tipo: 'caca_palavras',
                        titulo: 'Enigma do Caça-Palavras Pericial',
                        instrucoes: 'Palavras secretas da investigação foram escondidas na grade! Encontre todas as 6 palavras clicando nas suas letras em sequência. Cada palavra encontrada receberá um destaque de cor especial!',
                        palavras: [
                            { id: 'cp_1', palavra: 'LUPA', cor: '#38bdf8', nomeCor: 'Ciano' },
                            { id: 'cp_2', palavra: 'PISTA', cor: '#10b981', nomeCor: 'Esmeralda' },
                            { id: 'cp_3', palavra: 'COFRE', cor: '#f59e0b', nomeCor: 'Âmbar' },
                            { id: 'cp_4', palavra: 'MAPA', cor: '#ec4899', nomeCor: 'Rosa' },
                            { id: 'cp_5', palavra: 'CRIME', cor: '#a855f7', nomeCor: 'Roxo' },
                            { id: 'cp_6', palavra: 'LIVRO', cor: '#f97316', nomeCor: 'Laranja' }
                        ],
                        grid: [
                            ['L', 'U', 'P', 'A', 'X', 'M', 'A', 'P', 'A'],
                            ['I', 'K', 'T', 'W', 'Z', 'B', 'V', 'Q', 'C'],
                            ['V', 'P', 'I', 'S', 'T', 'A', 'R', 'H', 'R'],
                            ['R', 'F', 'C', 'O', 'F', 'R', 'E', 'J', 'I'],
                            ['O', 'M', 'D', 'E', 'T', 'E', 'C', 'L', 'M'],
                            ['S', 'B', 'N', 'Y', 'G', 'A', 'T', 'O', 'E'],
                            ['A', 'C', 'A', 'S', 'A', 'F', 'O', 'R', 'K'],
                            ['L', 'I', 'V', 'E', 'N', 'I', 'G', 'M', 'A']
                        ],
                        posicoesPalavras: {
                            'LUPA': [[0,0], [0,1], [0,2], [0,3]],
                            'MAPA': [[0,5], [0,6], [0,7], [0,8]],
                            'PISTA': [[2,1], [2,2], [2,3], [2,4], [2,5]],
                            'COFRE': [[3,2], [3,3], [3,4], [3,5], [3,6]],
                            'CRIME': [[1,8], [2,8], [3,8], [4,8], [5,8]],
                            'LIVRO': [[0,0], [1,0], [2,0], [3,0], [4,0]]
                        },
                        dica: 'Dica Forense: Procure as palavras na horizontal (da esquerda para a direita) e na vertical (de cima para baixo)!',
                        explicacao: 'Visão de falcão, Detetive! Você encontrou todas as 6 palavras secretas no caça-palavras pericial.'
                    },
                    {
                        id: 'port_1_atv_10',
                        tipo: 'texto_lacunado_compreensao',
                        titulo: 'Enigma do Bilhete Secreto e Compreensão',
                        instrucoes: 'Os peritos encontraram um bilhete confidencial com letras apagadas! Complete as letras do texto e, em seguida, responda às 3 perguntas periciais de interpretação.',
                        bancoLetras: ['A', 'T', 'L', 'R', 'T', 'S'],
                        introTexto: 'O DETETIVE ENCONTROU UM BILHETE:',
                        linhasBilhete: [
                            {
                                id: 'linha_1',
                                palavras: [
                                    { prefixo: '“A CH', lacuna: true, expected: 'A', id: 'tl_1', sufixo: 'VE' },
                                    { prefixo: 'ES', lacuna: true, expected: 'T', id: 'tl_2', sufixo: 'Á' },
                                    { textoFixo: 'NA' },
                                    { prefixo: 'SA', lacuna: true, expected: 'L', id: 'tl_3', sufixo: 'A.' }
                                ]
                            },
                            {
                                id: 'linha_2',
                                palavras: [
                                    { prefixo: 'PROCU', lacuna: true, expected: 'R', id: 'tl_4', sufixo: 'E' },
                                    { prefixo: 'PER', lacuna: true, expected: 'T', id: 'tl_5', sufixo: 'O' },
                                    { textoFixo: 'DA' },
                                    { prefixo: 'ME', lacuna: true, expected: 'S', id: 'tl_6', sufixo: 'A.”' }
                                ]
                            }
                        ],
                        perguntas: [
                            {
                                id: 'p1',
                                enunciado: '1. O que o detetive encontrou?',
                                opcoes: [
                                    { id: 'chave', texto: 'Uma chave' },
                                    { id: 'bola', texto: 'Uma bola' },
                                    { id: 'livro', texto: 'Um livro' }
                                ],
                                respostaCorreta: 'chave'
                            },
                            {
                                id: 'p2',
                                enunciado: '2. Onde está a chave?',
                                opcoes: [
                                    { id: 'sala', texto: 'Na sala' },
                                    { id: 'quarto', texto: 'No quarto' },
                                    { id: 'jardim', texto: 'No jardim' }
                                ],
                                respostaCorreta: 'sala'
                            },
                            {
                                id: 'p3',
                                enunciado: '3. Perto de que objeto ela está?',
                                opcoes: [
                                    { id: 'porta', texto: 'Da porta' },
                                    { id: 'mesa', texto: 'Da mesa' },
                                    { id: 'janela', texto: 'Da janela' }
                                ],
                                respostaCorreta: 'mesa'
                            }
                        ],
                        dica: 'Dica Forense: Leia com atenção o bilhete restaurado para responder às 3 perguntas da investigação!',
                        explicacao: 'Excelente compreensão de texto! O bilhete foi restaurado e todas as perguntas foram respondidas com precisão.'
                    },
                    {
                        id: 'port_1_atv_11',
                        tipo: 'cruzadinha_simples',
                        titulo: 'Enigma da Cruzadinha Pericial',
                        instrucoes: 'Analise as pistas dos peritos e descubra a palavra misteriosa. Preencha as letras nas caixas na frente de cada pista (o número de tracinhos mostra o tamanho da palavra!).',
                        itens: [
                            { id: 'cz_1', numero: 1, pista: 'Animal de estimação que mia', palavraEsperada: 'GATO', tamanho: 4 },
                            { id: 'cz_2', numero: 2, pista: 'Lente de aumento usada para achar pistas', palavraEsperada: 'LUPA', tamanho: 4 },
                            { id: 'cz_3', numero: 3, pista: 'Lugar onde moramos com nossa família', palavraEsperada: 'CASA', tamanho: 4 },
                            { id: 'cz_4', numero: 4, pista: 'Alimento de milho que estoura na panela', palavraEsperada: 'PIPOCA', tamanho: 6 },
                            { id: 'cz_5', numero: 5, pista: 'Objeto de metal usado para abrir portas e cofres', palavraEsperada: 'CHAVE', tamanho: 5 },
                            { id: 'cz_6', numero: 6, pista: 'Móvel onde colocamos cadernos e livros na sala', palavraEsperada: 'MESA', tamanho: 4 }
                        ],
                        dica: 'Dica Forense: Conte o número de caixas de cada linha para ter certeza de que a palavra tem o tamanho exato!',
                        explicacao: 'Cruzadinha pericial desvendada! Todas as 6 adivinhas foram resolvidas com louvor.'
                    },
                    {
                        id: 'port_1_atv_12',
                        tipo: 'criptograma_numerico',
                        titulo: 'O Criptograma do Mestre Decifrador (Código Secreto)',
                        instrucoes: 'O relatório confidencial final está criptografado com números! Cada número abaixo das lacunas representa uma letra específica. Digite as letras correspondentes aos números e decifre todo o texto secreto!',
                        tabelaCodigos: [
                            { numero: 1, letra: 'A' },
                            { numero: 2, letra: 'E' },
                            { numero: 3, letra: 'I' },
                            { numero: 4, letra: 'O' },
                            { numero: 5, letra: 'U' },
                            { numero: 6, letra: 'D' },
                            { numero: 7, letra: 'T' },
                            { numero: 8, letra: 'V' },
                            { numero: 9, letra: 'P' },
                            { numero: 10, letra: 'S' },
                            { numero: 11, letra: 'R' }
                        ],
                        palavrasTexto: [
                            {
                                chars: [
                                    { char: 'O', lacuna: false }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'D', lacuna: false },
                                    { char: 'E', lacuna: true, codigo: 2 },
                                    { char: 'T', lacuna: true, codigo: 7 },
                                    { char: 'E', lacuna: true, codigo: 2 },
                                    { char: 'T', lacuna: false },
                                    { char: 'I', lacuna: true, codigo: 3 },
                                    { char: 'V', lacuna: true, codigo: 8 },
                                    { char: 'E', lacuna: true, codigo: 2 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'D', lacuna: false },
                                    { char: 'E', lacuna: true, codigo: 2 },
                                    { char: 'S', lacuna: true, codigo: 10 },
                                    { char: 'C', lacuna: false },
                                    { char: 'O', lacuna: true, codigo: 4 },
                                    { char: 'B', lacuna: false },
                                    { char: 'R', lacuna: true, codigo: 11 },
                                    { char: 'I', lacuna: true, codigo: 3 },
                                    { char: 'U', lacuna: true, codigo: 5 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'T', lacuna: true, codigo: 7 },
                                    { char: 'O', lacuna: true, codigo: 4 },
                                    { char: 'D', lacuna: false },
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'S', lacuna: true, codigo: 10 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'S', lacuna: true, codigo: 10 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'P', lacuna: true, codigo: 9 },
                                    { char: 'I', lacuna: true, codigo: 3 },
                                    { char: 'S', lacuna: true, codigo: 10 },
                                    { char: 'T', lacuna: true, codigo: 7 },
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'S', lacuna: true, codigo: 10 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'D', lacuna: false },
                                    { char: 'O', lacuna: true, codigo: 4 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'C', lacuna: false },
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'S', lacuna: true, codigo: 10 },
                                    { char: 'O', lacuna: true, codigo: 4 },
                                    { char: '!', lacuna: false }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Olhe a Tabela de Códigos no topo! Se o número 1 é A, todo quadradinho com o número 1 abaixo deve receber a letra A!',
                        explicacao: 'Excelente dedução! Você decifrou o primeiro criptograma pericial da investigação com honras periciais!'
                    },
                    {
                        id: 'port_1_atv_13',
                        tipo: 'criptograma_numerico',
                        titulo: 'O Criptograma Secreto do Investigador Desaparecido',
                        instrucoes: '🕵️ Detetives, atenção!\nUm crime misterioso aconteceu e, antes de desaparecer, o investigador responsável pelo caso deixou uma última mensagem para a equipe. Porém, parece que alguém descobriu que os detetives estão se aproximando da verdade...\n\nA mensagem foi cuidadosamente escondida em um código secreto formado apenas por números. Para descobrir o que está acontecendo, vocês precisarão decifrar cada sequência e revelar o aviso deixado pelo investigador.\n\nMas cuidado, detetives! Nem tudo é o que parece, e talvez vocês não estejam sozinhos nessa investigação. Alguém pode estar observando cada movimento de vocês...\n\nSerá que vocês são capazes de decifrar a mensagem antes que seja tarde? 🔎🕵️‍♀️\n\n🔎 Desafio:\nCada número representa uma letra do alfabeto. Use a chave A = 1, B = 2, C = 3... Z = 26 e transforme os números em letras.\nTrabalhem como verdadeiros detetives: observem cada detalhe, organizem as pistas e não revelem a descoberta antes de solucionar completamente o mistério!\n\nAtenção, detetive! O código esconde uma mensagem misteriosa. Observe cada sequência de números, transforme-a em letras e descubra o que o bilhete quer dizer.\nSerá que você conseguirá decifrar a mensagem antes que seja tarde demais? 🕵️‍♂️🔐',
                        tabelaCodigos: [
                            { numero: 1, letra: 'A' },
                            { numero: 2, letra: 'B' },
                            { numero: 3, letra: 'C' },
                            { numero: 4, letra: 'D' },
                            { numero: 5, letra: 'E' },
                            { numero: 6, letra: 'F' },
                            { numero: 7, letra: 'G' },
                            { numero: 8, letra: 'H' },
                            { numero: 9, letra: 'I' },
                            { numero: 10, letra: 'J' },
                            { numero: 11, letra: 'K' },
                            { numero: 12, letra: 'L' },
                            { numero: 13, letra: 'M' },
                            { numero: 14, letra: 'N' },
                            { numero: 15, letra: 'O' },
                            { numero: 16, letra: 'P' },
                            { numero: 17, letra: 'Q' },
                            { numero: 18, letra: 'R' },
                            { numero: 19, letra: 'S' },
                            { numero: 20, letra: 'T' },
                            { numero: 21, letra: 'U' },
                            { numero: 22, letra: 'V' },
                            { numero: 23, letra: 'W' },
                            { numero: 24, letra: 'X' },
                            { numero: 25, letra: 'Y' },
                            { numero: 26, letra: 'Z' }
                        ],
                        palavrasTexto: [
                            {
                                chars: [
                                    { char: 'C', lacuna: true, codigo: 3 },
                                    { char: 'U', lacuna: true, codigo: 21 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'D', lacuna: true, codigo: 4 },
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'D', lacuna: true, codigo: 4 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: ',', lacuna: false }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'D', lacuna: true, codigo: 4 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'V', lacuna: true, codigo: 22 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: '!', lacuna: false }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'V', lacuna: true, codigo: 22 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: 'C', lacuna: true, codigo: 3 },
                                    { char: 'Ê', lacuna: true, codigo: 5 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'M', lacuna: true, codigo: 13 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'N', lacuna: true, codigo: 14 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'M', lacuna: true, codigo: 13 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'G', lacuna: true, codigo: 7 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: 'S', lacuna: true, codigo: 19 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'P', lacuna: true, codigo: 16 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: 'R', lacuna: true, codigo: 18 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: 'D', lacuna: true, codigo: 4 },
                                    { char: 'A', lacuna: true, codigo: 1 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'P', lacuna: true, codigo: 16 },
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'R', lacuna: true, codigo: 18 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: '.', lacuna: false }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'S', lacuna: true, codigo: 19 },
                                    { char: 'U', lacuna: true, codigo: 21 },
                                    { char: 'A', lacuna: true, codigo: 1 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'V', lacuna: true, codigo: 22 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'D', lacuna: true, codigo: 4 },
                                    { char: 'A', lacuna: true, codigo: 1 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'S', lacuna: true, codigo: 19 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'Á', lacuna: true, codigo: 1 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'M', lacuna: true, codigo: 13 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'P', lacuna: true, codigo: 16 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'R', lacuna: true, codigo: 18 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'G', lacuna: true, codigo: 7 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: '.', lacuna: false }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'F', lacuna: true, codigo: 6 },
                                    { char: 'I', lacuna: true, codigo: 9 },
                                    { char: 'Q', lacuna: true, codigo: 17 },
                                    { char: 'U', lacuna: true, codigo: 21 },
                                    { char: 'E', lacuna: true, codigo: 5 }
                                ]
                            },
                            {
                                chars: [
                                    { char: 'A', lacuna: true, codigo: 1 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'E', lacuna: true, codigo: 5 },
                                    { char: 'N', lacuna: true, codigo: 14 },
                                    { char: 'T', lacuna: true, codigo: 20 },
                                    { char: 'O', lacuna: true, codigo: 15 },
                                    { char: '!', lacuna: false }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Consulte a Tabela de Decodificação (A=1, B=2, C=3... Z=26)! Substitua cada número pela letra correspondente para desvendar o aviso secreto deixado pelo investigador.',
                        explicacao: 'PARABÉNS, DETETIVE SUPREMO DE LÍNGUA PORTUGUESA! Você decifrou a mensagem confidencial final do investigador com 100% de precisão e salvou a equipe pericial!'
                    },
                    {
                        id: 'port_1_atv_14',
                        tipo: 'mutacao_h_magico',
                        titulo: 'Enigma da Transformação do H Mágico (Dígrafos LH, NH, CH)',
                        instrucoes: 'Os peritos descobriram uma fórmula secreta: ao adicionar a letra H mágica em certas palavras, surge um novo som pericial com LH, NH ou CH! Analise a palavra base e escolha qual nova evidência se forma ao juntar o H.',
                        itens: [
                            { id: 'mut_1', palavraBase: 'VELA', emoji: '👵', palavraCorreta: 'VELHA', opcoes: ['VELHA', 'VELIA', 'VELAÇO'] },
                            { id: 'mut_2', palavraBase: 'BOLA', emoji: '🫧', palavraCorreta: 'BOLHA', opcoes: ['BOLIA', 'BOLHA', 'BOLÃO'] },
                            { id: 'mut_3', palavraBase: 'BICO', emoji: '🐛', palavraCorreta: 'BICHO', opcoes: ['BICOTE', 'BICOA', 'BICHO'] },
                            { id: 'mut_4', palavraBase: 'SONO', emoji: '💭', palavraCorreta: 'SONHO', opcoes: ['SONINHO', 'SONHO', 'SONIO'] },
                            { id: 'mut_5', palavraBase: 'CAVE', emoji: '🗝️', palavraCorreta: 'CHAVE', opcoes: ['CHAVE', 'CAVIA', 'CHUVA'] },
                            { id: 'mut_6', palavraBase: 'FILA', emoji: '👧', palavraCorreta: 'FILHA', opcoes: ['FILIA', 'FILHA', 'FILINHA'] }
                        ],
                        dica: 'Dica Forense: Veja como o H altera o som! C + H vira som de CH; L + H vira LH; N + H vira NH!',
                        explicacao: 'Incrível dedução pericial! Você dominou o poder do H e a formação dos dígrafos LH, NH e CH.'
                    },
                    {
                        id: 'port_1_atv_15',
                        tipo: 'completar_digrafos_banco',
                        titulo: 'Enigma do Laboratório de Dígrafos (LH, NH, CH, RR, SS, GU, QU)',
                        instrucoes: 'Várias evidências do caso perderam seus dígrafos e sílabas complexas! Observe cada pista e selecione o dígrafo correto (LH, NH, CH, RR, SS, GU ou QU) para restaurar as palavras.',
                        itens: [
                            { id: 'dig_1', emoji: '🎫', prefixo: 'BI', sufixo: 'ETE', digrafoEsperado: 'LH', palavraCompleta: 'BILHETE', opcoesDigrafos: ['LH', 'NH', 'CH', 'RR'] },
                            { id: 'dig_2', emoji: '🪺', prefixo: 'NI', sufixo: 'O', digrafoEsperado: 'NH', palavraCompleta: 'NINHO', opcoesDigrafos: ['LH', 'NH', 'CH', 'SS'] },
                            { id: 'dig_3', emoji: '🗝️', prefixo: '', sufixo: 'AVE', digrafoEsperado: 'CH', palavraCompleta: 'CHAVE', opcoesDigrafos: ['CH', 'LH', 'NH', 'QU'] },
                            { id: 'dig_4', emoji: '🐕', prefixo: 'CA', sufixo: 'ORRO', digrafoEsperado: 'CH', palavraCompleta: 'CACHORRO', opcoesDigrafos: ['CH', 'RR', 'SS', 'GU'] },
                            { id: 'dig_5', emoji: '🐦', prefixo: 'PÁ', sufixo: 'ARO', digrafoEsperado: 'SS', palavraCompleta: 'PÁSSARO', opcoesDigrafos: ['SS', 'RR', 'CH', 'NH'] },
                            { id: 'dig_6', emoji: '🚀', prefixo: 'FO', sufixo: 'ETE', digrafoEsperado: 'GU', palavraCompleta: 'FOGUETE', opcoesDigrafos: ['GU', 'QU', 'LH', 'NH'] },
                            { id: 'dig_7', emoji: '🧀', prefixo: '', sufixo: 'EIJO', digrafoEsperado: 'QU', palavraCompleta: 'QUEIJO', opcoesDigrafos: ['QU', 'GU', 'CH', 'LH'] },
                            { id: 'dig_8', emoji: '🐇', prefixo: 'COE', sufixo: 'O', digrafoEsperado: 'LH', palavraCompleta: 'COELHO', opcoesDigrafos: ['LH', 'NH', 'SS', 'RR'] }
                        ],
                        dica: 'Dica Forense: Fale a palavra com cada opção e ouça qual dígrafo produz a pronúncia exata do item!',
                        explicacao: 'Excelente calibragem! Todos os dígrafos e sons complexos foram restaurados com sucesso.'
                    },
                    {
                        id: 'port_1_atv_16',
                        tipo: 'classificar_contagem_silabas',
                        titulo: 'Enigma do Arquivo de Dígrafos (Classificação em Gavetas)',
                        instrucoes: 'Organize o fichário criminal separando as palavras de acordo com o dígrafo que elas contêm! Clique na palavra do banco e, em seguida, na gaveta pericial correspondente (CH, LH, NH ou RR/SS).',
                        categorias: [
                            { id: 'cat_ch', titulo: 'Dígrafo CH', subtitulo: 'Som de X', icone: '🗝️', cor: '#38bdf8' },
                            { id: 'cat_lh', titulo: 'Dígrafo LH', subtitulo: 'Som de Lhado', icone: '🐇', cor: '#10b981' },
                            { id: 'cat_nh', titulo: 'Dígrafo NH', subtitulo: 'Som de Nhado', icone: '🪺', cor: '#f59e0b' },
                            { id: 'cat_rr_ss', titulo: 'Dígrafos RR / SS', subtitulo: 'Sons Fortes', icone: '🐕', cor: '#ec4899' }
                        ],
                        palavras: [
                            { id: 'pw1', palavra: 'CHAVE', categoriaCorreta: 'cat_ch' },
                            { id: 'pw2', palavra: 'CHUVA', categoriaCorreta: 'cat_ch' },
                            { id: 'pw3', palavra: 'CHINELO', categoriaCorreta: 'cat_ch' },
                            { id: 'pw4', palavra: 'COELHO', categoriaCorreta: 'cat_lh' },
                            { id: 'pw5', palavra: 'BILHETE', categoriaCorreta: 'cat_lh' },
                            { id: 'pw6', palavra: 'ESPELHO', categoriaCorreta: 'cat_lh' },
                            { id: 'pw7', palavra: 'NINHO', categoriaCorreta: 'cat_nh' },
                            { id: 'pw8', palavra: 'RAINHA', categoriaCorreta: 'cat_nh' },
                            { id: 'pw9', palavra: 'LINHA', categoriaCorreta: 'cat_nh' },
                            { id: 'pw10', palavra: 'CARRO', categoriaCorreta: 'cat_rr_ss' },
                            { id: 'pw11', palavra: 'PÁSSARO', categoriaCorreta: 'cat_rr_ss' },
                            { id: 'pw12', palavra: 'CACHORRO', categoriaCorreta: 'cat_rr_ss' }
                        ],
                        dica: 'Dica Forense: Olhe as letras destacadas: se tiver CH vai na 1ª gaveta; LH na 2ª; NH na 3ª; RR ou SS na 4ª!',
                        explicacao: 'Arquivo de dígrafos 100% catalogado! Todas as 12 evidências foram arquivadas em suas gavetas corretas.'
                    },
                    {
                        id: 'port_1_atv_17',
                        tipo: 'identificar_intruso_silabico',
                        titulo: 'Enigma do Intruso Silábico (Suspeito Disfarçado)',
                        instrucoes: 'Em cada grupo pericial, 3 palavras seguem uma regra secreta de sílaba complexa e 1 palavra é um INTRUSO disfarçado! Clique no termo intruso de cada grupo para desmascará-lo.',
                        grupos: [
                            {
                                id: 'grp_1',
                                titulo: 'Caso 1: Dossiê das Palavras com LH',
                                regra: 'Todas possuem LH, exceto o intruso!',
                                palavras: [
                                    { palavra: 'COELHO', isIntruso: false },
                                    { palavra: 'TOALHA', isIntruso: false },
                                    { palavra: 'SAPATO', isIntruso: true },
                                    { palavra: 'BILHETE', isIntruso: false }
                                ]
                            },
                            {
                                id: 'grp_2',
                                titulo: 'Caso 2: Dossiê das Palavras com NH',
                                regra: 'Todas possuem NH, exceto o intruso!',
                                palavras: [
                                    { palavra: 'NINHO', isIntruso: false },
                                    { palavra: 'PIPOCA', isIntruso: true },
                                    { palavra: 'GALINHA', isIntruso: false },
                                    { palavra: 'LINHA', isIntruso: false }
                                ]
                            },
                            {
                                id: 'grp_3',
                                titulo: 'Caso 3: Dossiê das Palavras com CH',
                                regra: 'Todas possuem CH, exceto o intruso!',
                                palavras: [
                                    { palavra: 'CHAVE', isIntruso: false },
                                    { palavra: 'CHUVA', isIntruso: false },
                                    { palavra: 'CADERNO', isIntruso: true },
                                    { palavra: 'MOCHILA', isIntruso: false }
                                ]
                            },
                            {
                                id: 'grp_4',
                                titulo: 'Caso 4: Dossiê dos Encontros com R (BR, CR, DR, PR)',
                                regra: 'Todas possuem Encontro Consonantal com R, exceto o intruso!',
                                palavras: [
                                    { palavra: 'PRATO', isIntruso: false },
                                    { palavra: 'COFRE', isIntruso: false },
                                    { palavra: 'PEDRA', isIntruso: false },
                                    { palavra: 'BONECA', isIntruso: true }
                                ]
                            },
                            {
                                id: 'grp_5',
                                titulo: 'Caso 5: Dossiê dos Encontros com L (BL, CL, FL, PL)',
                                regra: 'Todas possuem Encontro Consonantal com L, exceto o intruso!',
                                palavras: [
                                    { palavra: 'PLANTA', isIntruso: false },
                                    { palavra: 'GATO', isIntruso: true },
                                    { palavra: 'CLUBE', isIntruso: false },
                                    { palavra: 'FLOR', isIntruso: false }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Procure qual palavra NÃO TEM a sílaba complexa (LH, NH, CH ou encontros consonantais) que as outras 3 têm!',
                        explicacao: 'Percepção forense impecável! Todos os 5 intrusos foram desmascarados e removidos da investigação.'
                    },
                    {
                        id: 'port_1_atv_18',
                        tipo: 'enigma_rimas_periciais',
                        titulo: 'Enigma das Rimas Secretas da Cena do Crime',
                        instrucoes: 'O suspeito deixou bilhetes com pistas poéticas em rimas! Para cada evidência em destaque, descubra qual das opções termina com o mesmo som e forma a rima pericial.',
                        itens: [
                            {
                                id: 'rhy_1',
                                emoji: '🪞',
                                palavraGuia: 'ESPELHO',
                                somFinal: '-ELHO',
                                opcoes: [
                                    { emoji: '🐇', palavra: 'COELHO', correta: true },
                                    { emoji: '🏰', palavra: 'CASTELO', correta: false },
                                    { emoji: '🪆', palavra: 'BONECA', correta: false },
                                    { emoji: '👞', palavra: 'SAPATO', correta: false }
                                ]
                            },
                            {
                                id: 'rhy_2',
                                emoji: '🪺',
                                palavraGuia: 'NINHO',
                                somFinal: '-INHO',
                                opcoes: [
                                    { emoji: '🌧️', palavra: 'CHUVA', correta: false },
                                    { emoji: '🐦', palavra: 'PASSARINHO', correta: true },
                                    { emoji: '🦉', palavra: 'CORUJA', correta: false },
                                    { emoji: '🗝️', palavra: 'CHAVE', correta: false }
                                ]
                            },
                            {
                                id: 'rhy_3',
                                emoji: '🚪',
                                palavraGuia: 'PORTÃO',
                                somFinal: '-ÃO',
                                opcoes: [
                                    { emoji: '🚪', palavra: 'PORTA', correta: false },
                                    { emoji: '🎫', palavra: 'BILHETE', correta: false },
                                    { emoji: '🔘', palavra: 'BOTÃO', correta: true },
                                    { emoji: '🪟', palavra: 'JANELA', correta: false }
                                ]
                            },
                            {
                                id: 'rhy_4',
                                emoji: '👑',
                                palavraGuia: 'RAINHA',
                                somFinal: '-INHA',
                                opcoes: [
                                    { emoji: '👑', palavra: 'COROA', correta: false },
                                    { emoji: '🐔', palavra: 'GALINHA', correta: true },
                                    { emoji: '🏰', palavra: 'CASTELO', correta: false },
                                    { emoji: '🤴', palavra: 'PRÍNCIPE', correta: false }
                                ]
                            },
                            {
                                id: 'rhy_5',
                                emoji: '🚀',
                                palavraGuia: 'FOGUETE',
                                somFinal: '-ETE',
                                opcoes: [
                                    { emoji: '🧶', palavra: 'TAPETE', correta: true },
                                    { emoji: '⚽', palavra: 'BOLA', correta: false },
                                    { emoji: '🍿', palavra: 'PIPOCA', correta: false },
                                    { emoji: '👞', palavra: 'SAPATO', correta: false }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Fale a palavra-guia e teste o som final com cada opção para encontrar o par rimado!',
                        explicacao: 'Ouvido afiado, Detetive! Todas as rimas periciais foram decifradas com precisão sonora.'
                    },
                    {
                        id: 'port_1_atv_19',
                        tipo: 'anagramas_silabicos',
                        titulo: 'Decodificador de Anagramas com Sílabas Complexas',
                        instrucoes: 'As letras das palavras periciais foram desordenadas pelo criminoso! Reorganize as letras da bandeja e digite a palavra correta contendo sílabas complexas (CH, LH, NH, PL, FR).',
                        itens: [
                            { id: 'an_1', emoji: '🗝️', dica: 'Objeto de metal que abre cofres e trancas', letrasDesordenadas: ['E', 'C', 'H', 'A', 'V'], palavraEsperada: 'CHAVE' },
                            { id: 'an_2', emoji: '🐇', dica: 'Animal de orelhas longas com dígrafo LH', letrasDesordenadas: ['O', 'C', 'E', 'L', 'H', 'O'], palavraEsperada: 'COELHO' },
                            { id: 'an_3', emoji: '🪺', dica: 'Casa feita por passarinhos nas árvores', letrasDesordenadas: ['O', 'N', 'I', 'H', 'N'], palavraEsperada: 'NINHO' },
                            { id: 'an_4', emoji: '🪴', dica: 'Vegetal com encontro consonantal PL', letrasDesordenadas: ['A', 'P', 'L', 'A', 'N', 'T'], palavraEsperada: 'PLANTA' },
                            { id: 'an_5', emoji: '🔐', dica: 'Caixa de segurança com encontro consonantal FR', letrasDesordenadas: ['E', 'C', 'O', 'F', 'R'], palavraEsperada: 'COFRE' },
                            { id: 'an_6', emoji: '🌧️', dica: 'Água que cai do céu com dígrafo CH', letrasDesordenadas: ['A', 'C', 'H', 'U', 'V'], palavraEsperada: 'CHUVA' }
                        ],
                        dica: 'Dica Forense: Observe a pista e use todas as letras da bandeja na ordem certa para reconstruir o termo pericial!',
                        explicacao: 'Decodificação espetacular! Todos os 6 anagramas com sílabas complexas foram reconstruídos com louvor.'
                    },
                    {
                        id: 'port_1_atv_20',
                        tipo: 'ortografia_pericial_digrafos',
                        titulo: 'A Grande Auditoria Ortográfica (Dígrafos e Sons Complexos)',
                        instrucoes: 'Conclua a investigação como um verdadeiro Auditor Pericial! Analise cada evidência e selecione a grafia ortograficamente correta (evitando armadilhas e falsificações).',
                        itens: [
                            { id: 'ort_1', numero: 1, emoji: '🗝️', descricao: 'Instrumento para abrir o cofre', opcoes: [{ palavra: 'CHAVE', correta: true }, { palavra: 'XAVE', correta: false }] },
                            { id: 'ort_2', numero: 2, emoji: '🐇', descricao: 'Animal veloz com dígrafo LH', opcoes: [{ palavra: 'COELIO', correta: false }, { palavra: 'COELHO', correta: true }] },
                            { id: 'ort_3', numero: 3, emoji: '🐔', descricao: 'Ave do sítio com dígrafo NH', opcoes: [{ palavra: 'GALINHA', correta: true }, { palavra: 'GALINIA', correta: false }] },
                            { id: 'ort_4', numero: 4, emoji: '🐕', descricao: 'Mascote pericial com dígrafo RR', opcoes: [{ palavra: 'CACHORRO', correta: true }, { palavra: 'CAXORRO', correta: false }] },
                            { id: 'ort_5', numero: 5, emoji: '🐦', descricao: 'Pássaro cantor com dígrafo SS', opcoes: [{ palavra: 'PÁSSARO', correta: true }, { palavra: 'PÁÇARO', correta: false }] },
                            { id: 'ort_6', numero: 6, emoji: '🎸', descricao: 'Instrumento de cordas com GU e RR', opcoes: [{ palavra: 'GITARRA', correta: false }, { palavra: 'GUITARRA', correta: true }] }
                        ],
                        dica: 'Dica Forense: Lembre-se: som de CH se escreve com CH; LH e NH mantêm a consoante com H; RR e SS dobram entre vogais!',
                        explicacao: 'HONRAS MÁXIMAS, DETETIVE MESTRE! Você desvendou todos os 20 enigmas da Aula 1 de Língua Portuguesa com maestria pericial absoluta!'
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
