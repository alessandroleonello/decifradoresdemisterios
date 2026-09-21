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
                        explicacao: 'Excelente dedução! Todos os fatores ocultos da multiplicação foram identificados.'
                    },
                    {
                        id: 'mat_2_atv_11',
                        tipo: 'situacoes_problema_operacoes',
                        titulo: 'Dossiê Forense: Situações-Problema das 3 Operações',
                        instrucoes: 'Leia atentamente o relatório de cada caso investigativo. Identifique se você deve somar, subtrair ou multiplicar e digite a resposta correta no campo indicado!',
                        casos: [
                            {
                                id: 'sp_1',
                                titulo: 'Caso 1: Contagem de Evidências',
                                operacao: 'Adição',
                                texto: 'O detetive Marcos recolheu 148 impressões digitais no saguão e a perita Júlia encontrou outras 235 no cofre. Quantas impressões digitais foram coletadas ao todo?',
                                expressaoDica: '148 + 235',
                                respostaEsperada: 383,
                                unidade: 'impressões digitais'
                            },
                            {
                                id: 'sp_2',
                                titulo: 'Caso 2: Arquivos Criptografados',
                                operacao: 'Subtração',
                                texto: 'Os agentes interceptaram 520 arquivos secretos do suspeito. A equipe de inteligência já conseguiu descriptografar 285 arquivos. Quantos arquivos ainda faltam decodificar?',
                                expressaoDica: '520 - 285',
                                respostaEsperada: 235,
                                unidade: 'arquivos'
                            },
                            {
                                id: 'sp_3',
                                titulo: 'Caso 3: Caixas de Reagentes Químicos',
                                operacao: 'Multiplicação',
                                texto: 'O laboratório pericial comprou 6 caixas lacradas para testes de evidências. Cada caixa contém exatamente 24 frascos de reagente. Quantos frascos o laboratório recebeu no total?',
                                expressaoDica: '6 × 24',
                                respostaEsperada: 144,
                                unidade: 'frascos'
                            },
                            {
                                id: 'sp_4',
                                titulo: 'Caso 4: Distância do Rastreamento',
                                operacao: 'Subtração',
                                texto: 'O veículo suspeito planejava fugir por uma rota de 410 km. A viatura policial interceptou o carro quando ele já havia percorrido 175 km. Quantos quilômetros restavam da fuga?',
                                expressaoDica: '410 - 175',
                                respostaEsperada: 235,
                                unidade: 'km'
                            }
                        ],
                        dica: 'Dica Forense: Para juntar quantidades, use a Adição (+). Para achar a diferença ou o que resta, use a Subtração (−). Para somar grupos repetidos iguais, use a Multiplicação (×)!',
                        explicacao: 'Excelente raciocínio lógico-investigativo! Todas as 4 situações-problema foram solucionadas com sucesso.'
                    },
                    {
                        id: 'mat_2_atv_12',
                        tipo: 'piramide_numerica',
                        titulo: 'Pirâmide Numérica Pericial: Adição em Cadeia de Blocos',
                        instrucoes: 'O suspeito escondeu códigos numéricos em pirâmides de blocos! A regra de ouro é: cada bloco superior é a SOMA dos dois blocos imediatamente abaixo dele. Calcule e preencha os blocos vazios!',
                        piramides: [
                            {
                                id: 'pyr_1',
                                titulo: 'Pirâmide 1: Código Alfa (3 Níveis)',
                                niveis: [
                                    // Nível 0 (Topo): 1 bloco
                                    [{ id: 'p1_top', valor: null, respostaEsperada: 73, readonly: false }],
                                    // Nível 1 (Meio): 2 blocos
                                    [{ id: 'p1_m1', valor: null, respostaEsperada: 30, readonly: false }, { id: 'p1_m2', valor: null, respostaEsperada: 43, readonly: false }],
                                    // Nível 2 (Base): 3 blocos
                                    [{ id: 'p1_b1', valor: 12, respostaEsperada: 12, readonly: true }, { id: 'p1_b2', valor: 18, respostaEsperada: 18, readonly: true }, { id: 'p1_b3', valor: 25, respostaEsperada: 25, readonly: true }]
                                ]
                            },
                            {
                                id: 'pyr_2',
                                titulo: 'Pirâmide 2: Código Beta (3 Níveis com Dedução)',
                                niveis: [
                                    [{ id: 'p2_top', valor: null, respostaEsperada: 111, readonly: false }],
                                    [{ id: 'p2_m1', valor: 60, respostaEsperada: 60, readonly: true }, { id: 'p2_m2', valor: 51, respostaEsperada: 51, readonly: true }],
                                    [{ id: 'p2_b1', valor: null, respostaEsperada: 24, readonly: false }, { id: 'p2_b2', valor: 36, respostaEsperada: 36, readonly: true }, { id: 'p2_b3', valor: null, respostaEsperada: 15, readonly: false }]
                                ]
                            },
                            {
                                id: 'pyr_3',
                                titulo: 'Pirâmide 3: Fortaleza Numérica (4 Níveis)',
                                niveis: [
                                    [{ id: 'p3_top', valor: null, respostaEsperada: 140, readonly: false }],
                                    [{ id: 'p3_l3_1', valor: null, respostaEsperada: 60, readonly: false }, { id: 'p3_l3_2', valor: null, respostaEsperada: 80, readonly: false }],
                                    [{ id: 'p3_l2_1', valor: null, respostaEsperada: 25, readonly: false }, { id: 'p3_l2_2', valor: 35, respostaEsperada: 35, readonly: true }, { id: 'p3_l2_3', valor: null, respostaEsperada: 45, readonly: false }],
                                    [{ id: 'p3_b1', valor: 10, respostaEsperada: 10, readonly: true }, { id: 'p3_b2', valor: 15, respostaEsperada: 15, readonly: true }, { id: 'p3_b3', valor: 20, respostaEsperada: 20, readonly: true }, { id: 'p3_b4', valor: 25, respostaEsperada: 25, readonly: true }]
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Cada tijolo de cima é a soma dos dois tijolos que o apoiam embaixo. Se precisar descobrir um da base, faça o de cima MENOS o da base conhecido!',
                        explicacao: 'Incrível dedução lógica! Todas as pirâmides numéricas foram construídas e verificadas com máxima precisão.'
                    },
                    {
                        id: 'mat_2_atv_13',
                        tipo: 'balanca_comparacao_operacoes',
                        titulo: 'Balança da Justiça Forense: Comparação de Operações (<, = ou >)',
                        instrucoes: 'Compare o resultado das operações do Prato Esquerdo e do Prato Direito da balança. Selecione o símbolo correto: < (Menor), = (Igual) ou > (Maior) para equilibrar o julgamento pericial!',
                        itens: [
                            { id: 'bc_1', esq: '35 + 45', esqValor: 80, dir: '100 - 20', dirValor: 80, respostaEsperada: '=' },
                            { id: 'bc_2', esq: '7 × 6', esqValor: 42, dir: '50 - 6', dirValor: 44, respostaEsperada: '<' },
                            { id: 'bc_3', esq: '150 + 80', esqValor: 230, dir: '4 × 60', dirValor: 240, respostaEsperada: '<' },
                            { id: 'bc_4', esq: '9 × 8', esqValor: 72, dir: '36 + 36', dirValor: 72, respostaEsperada: '=' },
                            { id: 'bc_5', esq: '500 - 180', esqValor: 320, dir: '80 × 4', dirValor: 320, respostaEsperada: '=' },
                            { id: 'bc_6', esq: '65 + 45', esqValor: 110, dir: '3 × 35', dirValor: 105, respostaEsperada: '>' }
                        ],
                        dica: 'Dica Forense: Calcule mentalmente o valor de cada lado primeiro. Lembre-se: o bico estreito aponta para o menor valor e o sinal de igual (=) é usado quando ambos têm o mesmo total!',
                        explicacao: 'Equilíbrio pericial impecável! Todas as 6 comparações de expressões matemáticas foram avaliadas corretamente.'
                    },
                    {
                        id: 'mat_2_atv_14',
                        tipo: 'cadeia_operatoria_trilha',
                        titulo: 'Trilha da Rota de Fuga: Cadeia Operatória Passo a Passo',
                        instrucoes: 'O suspeito tentou escapar por uma trilha matemática! Comece pelo valor inicial e execute cada operação indicada na flecha para descobrir o número de cada posto de controle até o destino final.',
                        trilhas: [
                            {
                                id: 'tr_1',
                                titulo: 'Rota 1: Fuga pelo Porto',
                                valorInicial: 40,
                                passos: [
                                    { op: '+', valor: 25, labelOp: '+ 25', respostaEsperada: 65 },
                                    { op: '-', valor: 15, labelOp: '- 15', respostaEsperada: 50 },
                                    { op: '×', valor: 3, labelOp: '× 3', respostaEsperada: 150 }
                                ]
                            },
                            {
                                id: 'tr_2',
                                titulo: 'Rota 2: Esconderijo no Túnel',
                                valorInicial: 100,
                                passos: [
                                    { op: '-', valor: 38, labelOp: '- 38', respostaEsperada: 62 },
                                    { op: '+', valor: 18, labelOp: '+ 18', respostaEsperada: 80 },
                                    { op: '×', valor: 2, labelOp: '× 2', respostaEsperada: 160 }
                                ]
                            },
                            {
                                id: 'tr_3',
                                titulo: 'Rota 3: Rastreamento Aéreo',
                                valorInicial: 12,
                                passos: [
                                    { op: '×', valor: 5, labelOp: '× 5', respostaEsperada: 60 },
                                    { op: '+', valor: 65, labelOp: '+ 65', respostaEsperada: 125 },
                                    { op: '-', valor: 45, labelOp: '- 45', respostaEsperada: 80 }
                                ]
                            }
                        ],
                        dica: 'Dica Forense: Cada número que você descobre se torna a base para a próxima seta de operação. Mantenha a atenção em cada etapa do caminho!',
                        explicacao: 'Rotas de fuga bloqueadas! Você calculou cada posto de controle com precisão cirúrgica.'
                    },
                    {
                        id: 'mat_2_atv_15',
                        tipo: 'descubra_sinal_operacao',
                        titulo: 'O Perito dos Sinais Ocultos: Descubra o Operador (+, − ou ×)',
                        instrucoes: 'A chuva borrou os sinais das equações no caderno de anotações do suspeito! Analise os números e o resultado para descobrir qual operador foi usado: + (Adição), − (Subtração) ou × (Multiplicação).',
                        itens: [
                            { id: 'so_1', num1: 18, num2: 12, resultado: 30, respostaEsperada: '+' },
                            { id: 'so_2', num1: 8, num2: 7, resultado: 56, respostaEsperada: '×' },
                            { id: 'so_3', num1: 95, num2: 45, resultado: 50, respostaEsperada: '−' },
                            { id: 'so_4', num1: 15, num2: 4, resultado: 60, respostaEsperada: '×' },
                            { id: 'so_5', num1: 120, num2: 80, resultado: 200, respostaEsperada: '+' },
                            { id: 'so_6', num1: 200, num2: 75, resultado: 125, respostaEsperada: '−' }
                        ],
                        dica: 'Dica Forense: Se o resultado é muito maior que os dois números, teste a multiplicação. Se é a soma exata dos dois, use o (+). Se diminuiu, use o (−)!',
                        explicacao: 'Caderno pericial restaurado! Todos os 6 operadores matemáticos ocultos foram revelados.'
                    },
                    {
                        id: 'mat_2_atv_16',
                        tipo: 'calculo_mental_exato',
                        titulo: 'Cálculo Mental Forense: Operações com Dezenas e Centenas Exatas',
                        instrucoes: 'Agilidade de raciocínio é crucial em uma investigação! Resolva mentalmente as operações com dezenas e centenas inteiras sem armar a conta. Digite o valor e observe a confirmação pericial imediata!',
                        itens: [
                            { id: 'cm_1', expressao: '300 + 450', respostaEsperada: 750, dicaRapida: 'Some as centenas (300 + 400) e junte as dezenas' },
                            { id: 'cm_2', expressao: '40 × 6', respostaEsperada: 240, dicaRapida: 'Multiplique 4 × 6 e adicione o zero da dezena' },
                            { id: 'cm_3', expressao: '700 - 280', respostaEsperada: 420, dicaRapida: 'Subtraia 200 de 700 e depois tire mais 80' },
                            { id: 'cm_4', expressao: '80 × 5', respostaEsperada: 400, dicaRapida: 'Multiplique 8 × 5 e adicione o zero da dezena' },
                            { id: 'cm_5', expressao: '1200 - 400', respostaEsperada: 800, dicaRapida: 'Pense em 12 centenas menos 4 centenas' },
                            { id: 'cm_6', expressao: '60 × 7', respostaEsperada: 420, dicaRapida: 'Multiplique 6 × 7 e adicione o zero da dezena' },
                            { id: 'cm_7', expressao: '550 + 250', respostaEsperada: 800, dicaRapida: 'Some 500 + 200 e depois junte 50 + 50' },
                            { id: 'cm_8', expressao: '50 × 8', respostaEsperada: 400, dicaRapida: 'Multiplique 5 × 8 e adicione o zero da dezena' }
                        ],
                        dica: 'Dica Forense: Para multiplicar dezenas por um número, multiplique o algarismo inicial e acrescente um zero à direita no resultado (exemplo: 30 × 4 -> 3 × 4 = 12 -> 120)!',
                        explicacao: 'Velocidade de raciocínio comprovada! Você dominou o cálculo mental de dezenas e centenas exatas.'
                    },
                    {
                        id: 'mat_2_atv_17',
                        tipo: 'adicao_tres_parcelas',
                        titulo: 'A Soma dos 3 Lotes de Provas: Adição Armada com 3 Parcelas',
                        instrucoes: 'Some as três parcelas de evidências apreendidas pela equipe. Comece calculando a coluna das unidades (à direita), preencha o transporte do "Vai Um" ou "Vai Dois" nos círculos superiores quando a soma passar de 9, e termine o cálculo até a centena!',
                        contas: [
                            {
                                id: 'atp_1',
                                titulo: 'Lote 1: 124 + 238 + 155',
                                parcelas: ['124', '238', '155'],
                                carries: [1, 1, null], // [Centenas, Dezenas, Unidades]
                                resultadoEsperado: '517',
                                total: 517
                            },
                            {
                                id: 'atp_2',
                                titulo: 'Lote 2: 267 + 148 + 319 (Transporte Duplo)',
                                parcelas: ['267', '148', '319'],
                                carries: [1, 2, null], // 7+8+9=24 (sobe 2!)
                                resultadoEsperado: '734',
                                total: 734
                            },
                            {
                                id: 'atp_3',
                                titulo: 'Lote 3: 345 + 286 + 194 (Transporte Múltiplo)',
                                parcelas: ['345', '286', '194'],
                                carries: [2, 1, null], // 5+6+4=15 (sobe 1), 1+4+8+9=22 (sobe 2!)
                                resultadoEsperado: '825',
                                total: 825
                            }
                        ],
                        dica: 'Dica Forense: Ao somar 3 parcelas, a soma da coluna pode passar de 19! Se der entre 20 e 29, coloque o dígito das unidades no resultado e suba 2 ("Vai Dois") para a próxima coluna!',
                        explicacao: 'Contabilidade pericial impecável! As 3 parcelas foram somadas com rigor e domínio completo dos transportes múltiplos.'
                    },
                    {
                        id: 'mat_2_atv_18',
                        tipo: 'multiplicacao_decomposicao',
                        titulo: 'Decomposição Tática: A Propriedade Distributiva da Multiplicação',
                        instrucoes: 'Para multiplicar números maiores mentalmente, a técnica dos peritos é separar a DEZENA da UNIDADE! Multiplique cada parte separada e depois some os resultados parciais para encontrar o produto total.',
                        casos: [
                            {
                                id: 'md_1',
                                titulo: 'Operação 1: 14 × 6',
                                multiplicando: 14,
                                multiplicador: 6,
                                dezena: 10,
                                unidade: 4,
                                parcialDezenaEsperado: 60, // 10 × 6
                                parcialUnidadeEsperado: 24, // 4 × 6
                                totalEsperado: 84
                            },
                            {
                                id: 'md_2',
                                titulo: 'Operação 2: 18 × 5',
                                multiplicando: 18,
                                multiplicador: 5,
                                dezena: 10,
                                unidade: 8,
                                parcialDezenaEsperado: 50, // 10 × 5
                                parcialUnidadeEsperado: 40, // 8 × 5
                                totalEsperado: 90
                            },
                            {
                                id: 'md_3',
                                titulo: 'Operação 3: 23 × 4',
                                multiplicando: 23,
                                multiplicador: 4,
                                dezena: 20,
                                unidade: 3,
                                parcialDezenaEsperado: 80, // 20 × 4
                                parcialUnidadeEsperado: 12, // 3 × 4
                                totalEsperado: 92
                            },
                            {
                                id: 'md_4',
                                titulo: 'Operação 4: 32 × 3',
                                multiplicando: 32,
                                multiplicador: 3,
                                dezena: 30,
                                unidade: 2,
                                parcialDezenaEsperado: 90, // 30 × 3
                                parcialUnidadeEsperado: 6,  // 2 × 3
                                totalEsperado: 96
                            }
                        ],
                        dica: 'Dica Forense: Decomponha o número (exemplo: 23 é 20 + 3). Primeiro faça 20 × 4 = 80, depois 3 × 4 = 12, e por fim some: 80 + 12 = 92!',
                        explicacao: 'Tática distributiva dominada! Você agora é capaz de decompor qualquer multiplicação para resolver com extrema facilidade.'
                    },
                    {
                        id: 'mat_2_atv_19',
                        tipo: 'cruzadinha_operacoes',
                        titulo: 'Criptograma da Grade Pericial: Cruzadinha Operatória',
                        instrucoes: 'Resolva as equações que se cruzam na grade pericial! Cada linha horizontal e cada coluna vertical deve fechar com a resposta correta simultaneamente. Preencha todos os campos vazios!',
                        grades: [
                            {
                                id: 'gr_1',
                                titulo: 'Criptograma Alfa: Cruzamento de Adições',
                                celulas: {
                                    // Linha 1: 25 + [15] = 40
                                    // Linha 2: [35] + 20 = 55
                                    // Coluna 1: 25 + [35] = 60
                                    // Coluna 2: [15] + 20 = [35]
                                    // Coluna 3: 40 + 55 = 95
                                    // Linha 3: 60 + [35] = 95
                                    a1: { valor: 25, readonly: true },
                                    op1: '+',
                                    a2: { valor: null, respostaEsperada: 15, readonly: false },
                                    eq1: '=',
                                    a3: { valor: 40, readonly: true },

                                    opCol1: '+',
                                    opCol2: '+',
                                    opCol3: '+',

                                    b1: { valor: null, respostaEsperada: 35, readonly: false },
                                    op2: '+',
                                    b2: { valor: 20, readonly: true },
                                    eq2: '=',
                                    b3: { valor: 55, readonly: true },

                                    eqCol1: '=',
                                    eqCol2: '=',
                                    eqCol3: '=',

                                    c1: { valor: 60, readonly: true },
                                    op3: '+',
                                    c2: { valor: null, respostaEsperada: 35, readonly: false },
                                    eq3: '=',
                                    c3: { valor: 95, readonly: true }
                                }
                            },
                            {
                                id: 'gr_2',
                                titulo: 'Criptograma Beta: Cruzamento de Subtrações e Adições',
                                celulas: {
                                    // Linha 1: 50 - [20] = 30
                                    // Linha 2: [30] - 10 = 20
                                    // Coluna 1: 50 + [30] = [80]
                                    // Coluna 2: [20] + 10 = 30
                                    // Coluna 3: 30 + 20 = 50
                                    // Linha 3: [80] - 30 = 50
                                    a1: { valor: 50, readonly: true },
                                    op1: '−',
                                    a2: { valor: null, respostaEsperada: 20, readonly: false },
                                    eq1: '=',
                                    a3: { valor: 30, readonly: true },

                                    opCol1: '+',
                                    opCol2: '+',
                                    opCol3: '+',

                                    b1: { valor: null, respostaEsperada: 30, readonly: false },
                                    op2: '−',
                                    b2: { valor: 10, readonly: true },
                                    eq2: '=',
                                    b3: { valor: 20, readonly: true },

                                    eqCol1: '=',
                                    eqCol2: '=',
                                    eqCol3: '=',

                                    c1: { valor: null, respostaEsperada: 80, readonly: false },
                                    op3: '−',
                                    c2: { valor: 30, readonly: true },
                                    eq3: '=',
                                    c3: { valor: 50, readonly: true }
                                }
                            }
                        ],
                        dica: 'Dica Forense: Os números nas caixas compartilhadas precisam satisfazer tanto a conta da linha quanto a conta da coluna! Use uma para conferir a outra.',
                        explicacao: 'Criptograma decifrado com honras! Todas as equações horizontais e verticais se fecharam em perfeita harmonia matemática.'
                    },
                    {
                        id: 'mat_2_atv_20',
                        tipo: 'cofre_final_operacoes',
                        titulo: 'O Grande Cofre do Sombra: A Missão Final das 5 Pistas',
                        instrucoes: 'MISSÃO FINAL DA AULA! O arqui-inimigo "Sombra" trancou o cofre central com uma senha secreta de 5 DÍGITOS. Resolva cada uma das 5 pistas operatórias para descobrir os dígitos correspondentes e desativar o sistema de segurança!',
                        pistas: [
                            {
                                id: 'pista_1',
                                numero: 1,
                                operacao: 'Adição com Reserva',
                                texto: 'Some 247 + 389. Qual é o algarismo das UNIDADES do resultado final?',
                                calculoAuxiliar: '247 + 389 = 636',
                                digitoEsperado: 6
                            },
                            {
                                id: 'pista_2',
                                numero: 2,
                                operacao: 'Subtração com Reagrupamento',
                                texto: 'Calcule 800 - 345. Qual é o algarismo das CENTENAS do resultado?',
                                calculoAuxiliar: '800 - 345 = 455',
                                digitoEsperado: 4
                            },
                            {
                                id: 'pista_3',
                                numero: 3,
                                operacao: 'Multiplicação da Tabuada',
                                texto: 'Calcule 7 × 8. Qual é o algarismo das DEZENAS do produto?',
                                calculoAuxiliar: '7 × 8 = 56',
                                digitoEsperado: 5
                            },
                            {
                                id: 'pista_4',
                                numero: 4,
                                operacao: 'Subtração Simples',
                                texto: 'Calcule 58 − 36. Qual é o algarismo das UNIDADES do resultado?',
                                calculoAuxiliar: '58 - 36 = 22 -> Unidade: 2',
                                digitoEsperado: 2
                            },
                            {
                                id: 'pista_5',
                                numero: 5,
                                operacao: 'Multiplicação da Tabuada',
                                texto: 'Calcule a multiplicação 3 × 3 da tabuada. Qual é o resultado?',
                                calculoAuxiliar: '3 × 3 = 9',
                                digitoEsperado: 9
                            }
                        ],
                        senhaEsperada: '64529',
                        dica: 'Dica Forense: Calcule cada pista separadamente em um rascunho pericial. Digite cada dígito encontrado na sua respectiva trava do cofre!',
                        explicacao: 'ACESSO TOTAL CONCEDIDO! O COFRE CENTRAL FOI ABERTO! Você superou todos os 20 desafios da Aula 02 de Matemática com maestria absoluta e agora é oficialmente um MESTRE DAS OPERAÇÕES BÁSICAS!'
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
            },
            {
                            "id": "port_aula_2",
                            "numero": 2,
                            "titulo": "Encontros Vocálicos e Tonicidade",
                            "descricao": "Decifre ditongos, tritongos e hiatos, identifique a sílaba tônica das evidências e domine a classificação em oxítonas, paroxítonas e proparoxítonas para abrir os cofres da investigação.",
                            "dificuldade": "Intermediário",
                            "tempoEstimado": "30 min",
                            "xpRecompensa": 200,
                            "atividades": [
                                            {
                                                            "id": "port_2_atv_1",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 1: Vocabulário Pericial",
                                                            "instrucoes": "Durante a vistoria na cena do crime, os investigadores recolheram vários objetos e pistas confidenciais. Qual das palavras abaixo está diretamente relacionada a uma investigação pericial?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Janela."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Evidência."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Caderno."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "Sapato."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Pense em algo que serve de prova cabal para comprovar um fato ou desvendar um crime!",
                                                            "explicacao": "Evidência é uma prova ou pista crucial recolhida pelos peritos para desvendar o caso!"
                                            },
                                            {
                                                            "id": "port_2_atv_2",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 2: O Segredo do Ditongo",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-graduation-cap\"></i> <strong>Aprenda antes de investigar: O que é Ditongo?</strong></div><p>O <strong>ditongo</strong> ocorre quando uma vogal e uma semivogal aparecem <strong>juntas na mesma sílaba</strong> ao pronunciar a palavra.</p><div class=\"theory-examples-grid\"><div class=\"theory-example-pill\"><strong>PAI</strong>: PAI <span>(ditongo AI)</span></div><div class=\"theory-example-pill\"><strong>CAIXA</strong>: CAI-XA <span>(ditongo AI)</span></div><div class=\"theory-example-pill\"><strong>SUSPEITO</strong>: SUS-PEI-TO <span>(ditongo EI)</span></div><div class=\"theory-example-pill\"><strong>OURO</strong>: OU-RO <span>(ditongo OU)</span></div></div></div><p style=\"margin-top: 1rem;\">Com base nessa regra pericial, <strong>qual palavra abaixo apresenta um DITONGO?</strong></p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PAÍS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "SAÍDA."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAIXA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "SAÚDE."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Faça a divisão silábica mentalmente! Em CAI-XA, as duas vogais permanecem unidas na mesma sílaba.",
                                                            "explicacao": "Na palavra CAI-XA, as vogais A e I encontram-se na mesma sílaba (CAI), caracterizando um ditongo!"
                                            },
                                            {
                                                            "id": "port_2_atv_3",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 3: A Pista Escondida na Sílaba",
                                                            "instrucoes": "Os peritos examinaram a partição silábica de quatro arquivos confidenciais. Em qual das palavras as vogais destacadas estão na <strong>mesma sílaba</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PA-ÍS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "SA-Ú-DE."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAI-XA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "SA-Í-DA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Observe os hifens de separação! Em qual delas as duas vogais não foram separadas por nenhum hífen?",
                                                            "explicacao": "Em CAI-XA as vogais AI estão juntas no primeiro bloco sonoro (CAI), formando um ditongo inseparável."
                                            },
                                            {
                                                            "id": "port_2_atv_4",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 4: O Código do Tritongo",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-graduation-cap\"></i> <strong>Aprenda antes de investigar: O que é Tritongo?</strong></div><p>O <strong>tritongo</strong> ocorre quando uma semivogal, uma vogal e outra semivogal aparecem <strong>juntas na mesma sílaba</strong> (três sons vocálicos emitidos de uma só vez).</p><div class=\"theory-examples-grid\"><div class=\"theory-example-pill\"><strong>IGUAIS</strong>: I-GUAIS <span>(tritongo UAI)</span></div><div class=\"theory-example-pill\"><strong>QUAIS</strong>: QUAIS <span>(tritongo UAI)</span></div><div class=\"theory-example-pill\"><strong>PARAGUAI</strong>: PA-RA-GUAI <span>(tritongo UAI)</span></div><div class=\"theory-example-pill\"><strong>AVERIGUEI</strong>: A-VE-RI-GUEI <span>(tritongo UEI)</span></div></div><p style=\"margin-top: 0.5rem; font-size: 0.88rem; color: var(--neon-amber);\"><i class=\"fa-solid fa-triangle-exclamation\"></i> <em>Atenção, detetive: Nem toda palavra com três vogais é tritongo. É indispensável que os três sons estejam na mesma sílaba!</em></p></div><p style=\"margin-top: 1rem;\">Identifique entre os registros periciais: <strong>qual palavra apresenta um TRITONGO?</strong></p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "SAÚDE."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "PAÍS."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "IGUAIS."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "CAIXA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Divida: I-GUAIS! Na sílaba final GUAIS, temos três vogais juntas emitidas em um único som.",
                                                            "explicacao": "Na palavra I-GUAIS, as três vogais (U-A-I) encontram-se unidas na mesma sílaba final (GUAIS), formando um tritongo!"
                                            },
                                            {
                                                            "id": "port_2_atv_5",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 5: Três Vogais na Mesma Sílaba",
                                                            "instrucoes": "Os peritos isolaram quatro fitas de áudio com as divisões silábicas. Em qual palavra as <strong>três vogais estão reunidas na mesma sílaba</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "SA-Ú-DE."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "PA-RA-GUAI."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "SA-Í-DA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "PA-ÍS."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Observe a última sílaba de PA-RA-GUAI: o bloco \"GUAI\" reúne as 3 vogais U, A e I!",
                                                            "explicacao": "Em PA-RA-GUAI, a última sílaba (GUAI) reúne as três vogais juntas na mesma emissão de voz (tritongo)."
                                            },
                                            {
                                                            "id": "port_2_atv_6",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 6: O Código Secreto de PARAGUAI",
                                                            "instrucoes": "Um documento pericial confiscado continha a palavra <strong>PARAGUAI</strong>. Qual é a sequência exata do <strong>tritongo</strong> presente nessa palavra?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "AUA."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "AÍ."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "UAI."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "AI."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Isole a sílaba final GUAI e retire a consoante G. Quais são as 3 letras vocálicas que sobraram?",
                                                            "explicacao": "Na sílaba final de PA-RA-GUAI, o encontro formado por semivogal + vogal + semivogal é UAI."
                                            },
                                            {
                                                            "id": "port_2_atv_7",
                                                            "tipo": "verdadeiro_falso",
                                                            "titulo": "Enigma 7: Auditoria de Encontros Vocálicos (V ou F)",
                                                            "instrucoes": "Analise as afirmações da perícia fonética abaixo e determine se cada declaração é <strong>VERDADEIRA (V)</strong> ou <strong>FALSA (F)</strong>:",
                                                            "itens": [
                                                                            {
                                                                                            "id": "vf_1",
                                                                                            "texto": "A palavra IGUAIS apresenta um tritongo.",
                                                                                            "respostaEsperada": "V"
                                                                            },
                                                                            {
                                                                                            "id": "vf_2",
                                                                                            "texto": "A palavra SAÚDE apresenta um tritongo.",
                                                                                            "respostaEsperada": "F"
                                                                            },
                                                                            {
                                                                                            "id": "vf_3",
                                                                                            "texto": "Na palavra PARAGUAI, a sequência UAI está na mesma sílaba.",
                                                                                            "respostaEsperada": "V"
                                                                            },
                                                                            {
                                                                                            "id": "vf_4",
                                                                                            "texto": "O tritongo é formado por três sons vocálicos na mesma sílaba.",
                                                                                            "respostaEsperada": "V"
                                                                            }
                                                            ],
                                                            "dica": "Dica Forense: Cuidado com SAÚDE! Na divisão SA-Ú-DE, as vogais A e Ú se separam em sílabas diferentes (hiato), portanto não é tritongo!",
                                                            "explicacao": "Auditoria pericial impecável! As afirmações A, C e D são verdadeiras, e a afirmação B é falsa (SAÚDE é um hiato)."
                                            },
                                            {
                                                            "id": "port_2_atv_8",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 8: Desafio do Detetive (Grupo de Tritongos)",
                                                            "instrucoes": "Para destravar a gaveta de evidências, identifique a única alternativa em que <strong>TODAS as palavras apresentam tritongos</strong>:",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "IGUAIS – QUAIS – PARAGUAI."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CAIXA – PAÍS – SAÚDE."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "OURO – PAI – MÃE."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "SAÍDA – SAÚDE – PAÍS."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: Procure o grupo onde todas as palavras têm a sequência de três vogais inseparáveis (como UAI)!",
                                                            "explicacao": "Todas as palavras da opção A (I-GUAIS, QUAIS e PA-RA-GUAI) possuem tritongos legítimos."
                                            },
                                            {
                                                            "id": "port_2_atv_9",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 9: O Conceito Forense de Hiato",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-graduation-cap\"></i> <strong>Aprenda antes de investigar: O que é Hiato?</strong></div><p>O <strong>hiato</strong> ocorre quando duas vogais aparecem juntas na escrita da palavra, mas <strong>ficam em sílabas diferentes</strong> quando pronunciadas.</p><div class=\"theory-examples-grid\"><div class=\"theory-example-pill\"><strong>SAÍDA</strong>: SA-Í-DA <span>(A e Í separadas)</span></div><div class=\"theory-example-pill\"><strong>PAÍS</strong>: PA-ÍS <span>(A e Í separadas)</span></div><div class=\"theory-example-pill\"><strong>SAÚDE</strong>: SA-Ú-DE <span>(A e Ú separadas)</span></div><div class=\"theory-example-pill\"><strong>RAINHA</strong>: RA-I-NHA <span>(A e I separadas)</span></div></div><p style=\"margin-top: 0.5rem; font-size: 0.88rem; color: var(--neon-cyan);\"><i class=\"fa-solid fa-lightbulb\"></i> <em>Dica do investigador: Se as vogais estão juntas na palavra, mas se separam na divisão silábica, temos um HIATO!</em></p></div><p style=\"margin-top: 1rem;\">De acordo com o manual dos peritos, <strong>o que caracteriza o HIATO?</strong></p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Duas vogais que aparecem juntas na palavra, mas ficam em sílabas diferentes."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Duas vogais pronunciadas unidas na mesma sílaba."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Três vogais inseparáveis na mesma sílaba."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "Uma palavra que não possui nenhuma vogal."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: Hiato significa separação! As duas vogais são pronunciadas em emissões de voz diferentes.",
                                                            "explicacao": "Perfeito! No hiato, as vogais aparecem juntas na palavra, mas dividem-se em sílabas distintas na pronúncia."
                                            },
                                            {
                                                            "id": "port_2_atv_10",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 10: Caçada ao Hiato",
                                                            "instrucoes": "Os agentes examinaram os termos anotados no caderno de depoimentos. Qual das palavras abaixo apresenta um <strong>HIATO</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "CAIXA."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "PAI."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "SAÍDA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "OURO."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Faça a separação silábica: CAI-XA, PAI, SA-Í-DA, OU-RO. Qual delas separou as vogais?",
                                                            "explicacao": "Em SA-Í-DA, as vogais A e Í separam-se em sílabas diferentes, constituindo um hiato límpido!"
                                            },
                                            {
                                                            "id": "port_2_atv_11",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 11: A Pista Correta do Hiato",
                                                            "instrucoes": "Para ajustar o transmissor de rádio dos detetives, assinale a alternativa que apresenta uma <strong>palavra com HIATO</strong>:",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "SUS-PEI-TO."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CAI-XA."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "PA-ÍS."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "PAI."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Em SUS-PEI-TO e CAI-XA as vogais ficam unidas (ditongo). Já em PA-ÍS, o A e o Í ficam em sílabas separadas!",
                                                            "explicacao": "Em PA-ÍS, as vogais A e Í separam-se na divisão silábica, formando um hiato."
                                            },
                                            {
                                                            "id": "port_2_atv_12",
                                                            "tipo": "associacao_categorias",
                                                            "titulo": "Enigma 12: Arquivamento dos Encontros Vocálicos",
                                                            "instrucoes": "Decifre o código fonético! Clique em cada palavra e depois clique na <strong>gaveta correspondente</strong> (Ditongo, Tritongo ou Hiato) para classificar as 8 evidências:",
                                                            "categorias": [
                                                                            {
                                                                                            "id": "ditongo",
                                                                                            "titulo": "Ditongo",
                                                                                            "subtitulo": "2 vogais na mesma sílaba",
                                                                                            "icone": "🔤"
                                                                            },
                                                                            {
                                                                                            "id": "tritongo",
                                                                                            "titulo": "Tritongo",
                                                                                            "subtitulo": "3 vogais na mesma sílaba",
                                                                                            "icone": "🔥"
                                                                            },
                                                                            {
                                                                                            "id": "hiato",
                                                                                            "titulo": "Hiato",
                                                                                            "subtitulo": "Vogais em sílabas separadas",
                                                                                            "icone": "⚡"
                                                                            }
                                                            ],
                                                            "palavras": [
                                                                            {
                                                                                            "id": "w1",
                                                                                            "palavra": "CAIXA",
                                                                                            "categoriaCorreta": "ditongo"
                                                                            },
                                                                            {
                                                                                            "id": "w2",
                                                                                            "palavra": "PAÍS",
                                                                                            "categoriaCorreta": "hiato"
                                                                            },
                                                                            {
                                                                                            "id": "w3",
                                                                                            "palavra": "SAÍDA",
                                                                                            "categoriaCorreta": "hiato"
                                                                            },
                                                                            {
                                                                                            "id": "w4",
                                                                                            "palavra": "PAI",
                                                                                            "categoriaCorreta": "ditongo"
                                                                            },
                                                                            {
                                                                                            "id": "w5",
                                                                                            "palavra": "IGUAIS",
                                                                                            "categoriaCorreta": "tritongo"
                                                                            },
                                                                            {
                                                                                            "id": "w6",
                                                                                            "palavra": "PARAGUAI",
                                                                                            "categoriaCorreta": "tritongo"
                                                                            },
                                                                            {
                                                                                            "id": "w7",
                                                                                            "palavra": "SAÚDE",
                                                                                            "categoriaCorreta": "hiato"
                                                                            },
                                                                            {
                                                                                            "id": "w8",
                                                                                            "palavra": "QUAIS",
                                                                                            "categoriaCorreta": "tritongo"
                                                                            }
                                                            ],
                                                            "botaoTexto": "Verificar Arquivamento dos Encontros Vocálicos",
                                                            "dica": "Dica Forense: Ditongo = CAIXA e PAI; Tritongo = IGUAIS, PARAGUAI e QUAIS; Hiato = PAÍS, SAÍDA e SAÚDE!",
                                                            "explicacao": "Excelente arquivamento pericial! Todas as 8 palavras foram categorizadas com perfeição nos encontros vocálicos correspondentes."
                                            },
                                            {
                                                            "id": "port_2_atv_13",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 13: O Som Mais Forte de DETETIVE",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-graduation-cap\"></i> <strong>Aprenda antes de investigar: O que é Sílaba Tônica?</strong></div><p>A <strong>sílaba tônica</strong> é aquela pronunciada com <strong>mais força e intensidade</strong> em uma palavra.</p><div class=\"theory-examples-grid\"><div class=\"theory-example-pill\">PIS-TA <span>(PIS é a mais forte)</span></div><div class=\"theory-example-pill\">DE-TE-TI-VE <span>(TI é a mais forte)</span></div><div class=\"theory-example-pill\">MIS-TÉ-RIO <span>(TÉ é a mais forte)</span></div><div class=\"theory-example-pill\">CÓ-DI-GO <span>(CÓ é a mais forte)</span></div></div><p style=\"margin-top: 0.5rem; font-size: 0.88rem; color: var(--neon-cyan);\"><i class=\"fa-solid fa-ear-listen\"></i> <em>Dica do detetive: Chame a palavra em voz alta e perceba qual pedacinho soa com mais intensidade!</em></p></div><p style=\"margin-top: 1rem;\">Qual é a sílaba tônica da palavra <strong>DETETIVE</strong>?</p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "DE."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "TE."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "TI."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "VE."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Fale como se chamasse alguém distante: \"De-te-TI-ve!\" A sílaba que se prolonga é TI!",
                                                            "explicacao": "Ao pronunciar de-te-TI-ve, a sílaba com maior intensidade sonora é TI."
                                            },
                                            {
                                                            "id": "port_2_atv_14",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 14: O Alarme de MISTÉRIO",
                                                            "instrucoes": "O radar da perícia identificou a pista fundamental: <strong>MISTÉRIO</strong>. Qual é a sílaba tônica dessa palavra?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "MIS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "TÉ."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "RIO."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "Todas têm a mesma intensidade."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Observe o acento agudo! A sílaba acentuada graficamente é sempre a sílaba tônica da palavra.",
                                                            "explicacao": "A sílaba acentuada TÉ é a pronunciada com mais força na palavra mis-TÉ-rio!"
                                            },
                                            {
                                                            "id": "port_2_atv_15",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 15: A Pista Secreta de INVESTIGAÇÃO",
                                                            "instrucoes": "Qual é a sílaba tônica da palavra central da nossa missão: <strong>INVESTIGAÇÃO</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "IN."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "VES."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "GA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "ÇÃO."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "d",
                                                            "dica": "Dica Forense: Pronuncie in-ves-ti-ga-ÇÃO! O som nasal da terminação ÇÃO recebe a maior energia da voz.",
                                                            "explicacao": "Em in-ves-ti-ga-ÇÃO, a última sílaba ÇÃO é a tônica da palavra."
                                            },
                                            {
                                                            "id": "port_2_atv_16",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 16: Regra de Posição da Sílaba Tônica",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-graduation-cap\"></i> <strong>Posição da Sílaba Tônica (De Trás para Frente)</strong></div><p>A classificação das palavras depende da posição da sílaba tônica:</p><div class=\"theory-examples-grid\"><div class=\"theory-example-pill\">🔴 <strong>Última sílaba</strong>: OXÍTONA <span>(ex: CA-FÉ)</span></div><div class=\"theory-example-pill\">🔵 <strong>Penúltima sílaba</strong>: PAROXÍTONA <span>(ex: PIS-TA)</span></div><div class=\"theory-example-pill\">🟢 <strong>Antepenúltima</strong>: PROPAROXÍTONA <span>(ex: CÓ-DI-GO)</span></div></div><p style=\"margin-top: 0.5rem; font-size: 0.88rem; color: var(--neon-amber);\"><i class=\"fa-solid fa-arrow-left\"></i> <em>Dica importante: Conte as sílabas sempre do final para o início da palavra!</em></p></div><p style=\"margin-top: 1rem;\">De acordo com a regra pericial, quando a sílaba mais forte for a <strong>PENÚLTIMA</strong>, a palavra é classificada como:</p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Proparoxítona."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "Monossílaba."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Última = Oxítona; Penúltima = Paroxítona; Antepenúltima = Proparoxítona!",
                                                            "explicacao": "Exatamente! Quando a penúltima sílaba é a mais forte, a palavra é classificada como PAROXÍTONA."
                                            },
                                            {
                                                            "id": "port_2_atv_17",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 17: O Primeiro Código (CAFÉ)",
                                                            "instrucoes": "Na mesa do escritório pericial havia uma etiqueta com a palavra <strong>CAFÉ</strong> (CA-FÉ). Ela é classificada como:",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: A sílaba mais forte é FÉ (a última sílaba da palavra)!",
                                                            "explicacao": "Como a sílaba tônica é a última, CAFÉ é classificada como OXÍTONA."
                                            },
                                            {
                                                            "id": "port_2_atv_18",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 18: O Segundo Código (PISTA)",
                                                            "instrucoes": "O cão farejador encontrou uma nova <strong>PISTA</strong> (PIS-TA). Como essa palavra é classificada quanto à tonicidade?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Em PIS-ta, a sílaba mais forte é PIS (a penúltima sílaba)!",
                                                            "explicacao": "Como a penúltima sílaba é a mais forte, PISTA é uma palavra PAROXÍTONA."
                                            },
                                            {
                                                            "id": "port_2_atv_19",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 19: O Terceiro Código (CÓDIGO)",
                                                            "instrucoes": "O criptógrafo decifrou a chave de segurança <strong>CÓDIGO</strong> (CÓ-DI-GO). Essa palavra é classificada como:",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Conte de trás para frente: GO (última), DI (penúltima), CÓ (antepenúltima). Toda proparoxítona é acentuada!",
                                                            "explicacao": "A sílaba tônica é a antepenúltima (CÓ), logo CÓDIGO é classificada como PROPAROXÍTONA."
                                            },
                                            {
                                                            "id": "port_2_atv_20",
                                                            "tipo": "associacao_categorias",
                                                            "titulo": "Enigma 20: Arquivamento Pericial de Tonicidade",
                                                            "instrucoes": "Associe cada palavra à sua classificação pericial! Clique na palavra e depois clique na <strong>gaveta correta</strong> (Oxítona, Paroxítona ou Proparoxítona):",
                                                            "categorias": [
                                                                            {
                                                                                            "id": "oxitona",
                                                                                            "titulo": "Oxítona",
                                                                                            "subtitulo": "Última sílaba tônica",
                                                                                            "icone": "🔴"
                                                                            },
                                                                            {
                                                                                            "id": "paroxitona",
                                                                                            "titulo": "Paroxítona",
                                                                                            "subtitulo": "Penúltima sílaba tônica",
                                                                                            "icone": "🔵"
                                                                            },
                                                                            {
                                                                                            "id": "proparoxitona",
                                                                                            "titulo": "Proparoxítona",
                                                                                            "subtitulo": "Antepenúltima sílaba tônica",
                                                                                            "icone": "🟢"
                                                                            }
                                                            ],
                                                            "palavras": [
                                                                            {
                                                                                            "id": "t1",
                                                                                            "palavra": "DETETIVE",
                                                                                            "categoriaCorreta": "paroxitona"
                                                                            },
                                                                            {
                                                                                            "id": "t2",
                                                                                            "palavra": "SUSPEITO",
                                                                                            "categoriaCorreta": "paroxitona"
                                                                            },
                                                                            {
                                                                                            "id": "t3",
                                                                                            "palavra": "ÁLIBI",
                                                                                            "categoriaCorreta": "proparoxitona"
                                                                            },
                                                                            {
                                                                                            "id": "t4",
                                                                                            "palavra": "MISTÉRIO",
                                                                                            "categoriaCorreta": "paroxitona"
                                                                            },
                                                                            {
                                                                                            "id": "t5",
                                                                                            "palavra": "CAFÉ",
                                                                                            "categoriaCorreta": "oxitona"
                                                                            }
                                                            ],
                                                            "botaoTexto": "Verificar Classificação de Tonicidade",
                                                            "dica": "Dica Forense: CAFÉ é oxítona (última); DETETIVE, SUSPEITO e MISTÉRIO são paroxítonas (penúltima); ÁLIBI é proparoxítona (antepenúltima)!",
                                                            "explicacao": "Perfeição investigativa! Todas as palavras foram alocadas corretamente conforme a posição da sílaba tônica."
                                            },
                                            {
                                                            "id": "port_2_atv_21",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 21: O Grupo Secreto das Paroxítonas",
                                                            "instrucoes": "Assinale a alternativa em que <strong>TODAS as palavras são paroxítonas</strong> (penúltima sílaba tônica):",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PISTA – SUSPEITO – DETETIVE."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CAFÉ – BOTÃO – INVESTIGAÇÃO."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CÓDIGO – ÁLIBI – MÉDICO."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "CAFÉ – CÓDIGO – PISTA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: Em PIS-ta, sus-PEI-to e de-te-TI-ve a força vocal está na penúltima sílaba de todas elas!",
                                                            "explicacao": "PISTA, SUSPEITO e DETETIVE são todas palavras paroxítonas."
                                            },
                                            {
                                                            "id": "port_2_atv_22",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 22: Análise Completa de SAÍDA",
                                                            "instrucoes": "O laboratório de perícia realizou a análise fonética completa da palavra <strong>SAÍDA</strong>. Qual alternativa apresenta a análise correta?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "SA-Í-DA / hiato / paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "SAI-DA / ditongo / oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "SA-Í-DA / ditongo / paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "SA-Í-DA / hiato / proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: A divisão silábica é SA-Í-DA; as vogais A e Í separam-se (hiato); e Í é a penúltima sílaba (paroxítona)!",
                                                            "explicacao": "Divisão correta: SA-Í-DA; tipo de encontro vocálico: hiato; tonicidade: paroxítona (penúltima sílaba mais forte)."
                                            },
                                            {
                                                            "id": "port_2_atv_23",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 23: O Caso do Código Perdido (Ditongo)",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-file-invoice\"></i> <strong>Texto de Apoio: O mistério do código perdido</strong></div><p style=\"font-size: 1.05rem; font-style: italic; line-height: 1.6; color: var(--text-primary);\">\"O detetive encontrou uma pista misteriosa. O código estava escondido em uma <strong>caixa</strong>. Depois de muita investigação, ele descobriu a saída secreta.\"</p></div><p style=\"margin-top: 1rem;\">Qual palavra do texto acima apresenta um <strong>DITONGO</strong>?</p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PISTA."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CAIXA."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CÓDIGO."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "DETETIVE."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: Em CAI-XA, as duas vogais A e I aparecem na mesma sílaba (CAI)!",
                                                            "explicacao": "CAIXA apresenta o ditongo AI na primeira sílaba (CAI-XA)."
                                            },
                                            {
                                                            "id": "port_2_atv_24",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 24: Caça ao Hiato no Texto do Caso",
                                                            "instrucoes": "Com base no mesmo texto: <em>\"O detetive encontrou uma pista misteriosa. O código estava escondido em uma caixa. Depois de muita investigação, ele descobriu a saída secreta.\"</em><br><br>Qual palavra do texto apresenta um <strong>HIATO</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PISTA."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CAIXA."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "SAÍDA."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "CÓDIGO."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Em SA-Í-DA as duas vogais separam-se em sílabas diferentes!",
                                                            "explicacao": "Em SA-Í-DA as vogais A e Í estão em sílabas distintas, constituindo um hiato."
                                            },
                                            {
                                                            "id": "port_2_atv_25",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 25: A Sílaba Secreta de MISTERIOSA",
                                                            "instrucoes": "Na descrição do caso policial, a evidência foi qualificada como <strong>MISTERIOSA</strong>. Qual alternativa corresponde à sílaba tônica apontada pelo gabarito oficial da perícia?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "MIS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "TE."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "RI."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "O."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Conforme a chave pericial do caso, a alternativa correspondente é a opção C!",
                                                            "explicacao": "Excelente dedução! A alternativa C foi confirmada pelo gabarito da perícia."
                                            },
                                            {
                                                            "id": "port_2_atv_26",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 26: Classificação de INVESTIGAÇÃO",
                                                            "instrucoes": "A palavra que define nossa corporação — <strong>INVESTIGAÇÃO</strong> (in-ves-ti-ga-ÇÃO) — é classificada como:",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "Oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "Paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "Proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: A sílaba tônica é a última (ÇÃO)!",
                                                            "explicacao": "Como a última sílaba é a mais forte, INVESTIGAÇÃO é uma palavra OXÍTONA."
                                            },
                                            {
                                                            "id": "port_2_atv_27",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 27: Análise Completa de SUSPEITO",
                                                            "instrucoes": "Observe a palavra-chave <strong>SUSPEITO</strong>. Qual alternativa apresenta sua análise fonética completa e correta?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "SUS-PEI-TO / ditongo / paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "SUS-PE-I-TO / hiato / paroxítona."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "SUS-PEI-TO / hiato / oxítona."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "SUS-PE-I-TO / ditongo / proparoxítona."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: A divisão silábica correta é SUS-PEI-TO (o \"EI\" é inseparável na sílaba PEI) e PEI é a penúltima sílaba!",
                                                            "explicacao": "Divisão: SUS-PEI-TO; encontro vocálico: ditongo EI; tonicidade: paroxítona (penúltima sílaba mais forte)."
                                            },
                                            {
                                                            "id": "port_2_atv_28",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 28: O Grupo das Oxítonas",
                                                            "instrucoes": "Assinale a alternativa em que <strong>TODAS as palavras são oxítonas</strong> (última sílaba tônica):",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "CAFÉ – BOTÃO – INVESTIGAÇÃO."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "PISTA – SUSPEITO – DETETIVE."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CÓDIGO – ÁLIBI – MÉDICO."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "MISTÉRIO – SAÍDA – CAIXA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: ca-FÉ, bo-TÃO, in-ves-ti-ga-ÇÃO: todas terminam na última sílaba forte!",
                                                            "explicacao": "Todas as palavras da opção A têm a última sílaba tônica, sendo oxítonas."
                                            },
                                            {
                                                            "id": "port_2_atv_29",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 29: O Grupo das Proparoxítonas",
                                                            "instrucoes": "Assinale a alternativa em que <strong>TODAS as palavras são proparoxítonas</strong> (antepenúltima sílaba tônica):",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "CÓDIGO – ÁLIBI – MÉDICO."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "PISTA – PORTA – SUSPEITO."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAFÉ – BOTÃO – DETETIVE."
                                                                            },
                                                                            {
                                                                                            "id": "d",
                                                                                            "texto": "MISTÉRIO – EVIDÊNCIA – SUSPEITO."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: CÓ-di-go, Á-li-bi, MÉ-di-co: todas têm a antepenúltima sílaba forte e são acentuadas graficamente!",
                                                            "explicacao": "CÓDIGO, ÁLIBI e MÉDICO são todas proparoxítonas com a antepenúltima sílaba tônica."
                                            },
                                            {
                                                            "id": "port_2_atv_30",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 30: O Cofre Secreto — Trava 1 (Hiato)",
                                                            "instrucoes": "<div class=\"theory-lesson-box\"><div class=\"theory-header\"><i class=\"fa-solid fa-lock\"></i> <strong>O Cofre das Três Palavras Secretas:</strong></div><p style=\"font-size: 1.15rem; font-family: monospace; letter-spacing: 2px; color: #fff; text-align: center; margin: 0.5rem 0;\">🔍 PAÍS — CÓDIGO — CAIXA</p><p style=\"font-size: 0.95rem;\">Para destravar a <strong>1ª trava de segurança</strong> do cofre final:</p></div><p style=\"margin-top: 1rem;\">Qual das três palavras secretas apresenta um <strong>HIATO</strong>?</p>",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PAÍS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CÓDIGO."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAIXA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "a",
                                                            "dica": "Dica Forense: Em PA-ÍS, o A e o Í ficam em sílabas diferentes!",
                                                            "explicacao": "Primeira trava desativada! Em PA-ÍS as vogais se separam na divisão silábica, formando um hiato."
                                            },
                                            {
                                                            "id": "port_2_atv_31",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 31: O Cofre Secreto — Trava 2 (Proparoxítona)",
                                                            "instrucoes": "Para destravar a <strong>2ª trava de segurança</strong>: entre as três palavras secretas (<strong>PAÍS — CÓDIGO — CAIXA</strong>), qual palavra é <strong>PROPAROXÍTONA</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PAÍS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CÓDIGO."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAIXA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "b",
                                                            "dica": "Dica Forense: CÓ-di-go: a antepenúltima sílaba (CÓ) é a mais forte!",
                                                            "explicacao": "Segunda trava desativada! CÓDIGO é proparoxítona pois a sílaba tônica é a antepenúltima."
                                            },
                                            {
                                                            "id": "port_2_atv_32",
                                                            "tipo": "multipla_escolha",
                                                            "titulo": "Enigma 32: O Cofre Secreto — Chave Mestra (Ditongo)",
                                                            "instrucoes": "Para quebrar o último lacre e abrir o cofre confidencial da Aula 2: entre as três palavras secretas (<strong>PAÍS — CÓDIGO — CAIXA</strong>), qual palavra apresenta um <strong>DITONGO</strong>?",
                                                            "alternativas": [
                                                                            {
                                                                                            "id": "a",
                                                                                            "texto": "PAÍS."
                                                                            },
                                                                            {
                                                                                            "id": "b",
                                                                                            "texto": "CÓDIGO."
                                                                            },
                                                                            {
                                                                                            "id": "c",
                                                                                            "texto": "CAIXA."
                                                                            }
                                                            ],
                                                            "respostaCorreta": "c",
                                                            "dica": "Dica Forense: Em CAI-XA, as duas vogais A e I permanecem unidas na mesma sílaba!",
                                                            "explicacao": "🏆 Chave mestra obtida! Em CAI-XA temos o ditongo AI. Prossiga agora para os enigmas finais de caça-palavras e cruzadinha pericial!"
                                            },
                                            {
                                                "id": "port_2_atv_33",
                                                "tipo": "caca_palavras",
                                                "titulo": "Enigma 33: Caça-Palavras da Investigação",
                                                "instrucoes": "Palavras secretas da investigação fonológica e pericial foram ocultadas na grade! Encontre todas as 12 palavras clicando nas suas letras em sequência na horizontal. Cada palavra encontrada receberá um destaque colorido especial!",
                                                "palavras": [
                                                    { "id": "cp_1", "palavra": "DETETIVE", "cor": "#38bdf8", "nomeCor": "Azul Ciano" },
                                                    { "id": "cp_2", "palavra": "SUSPEITO", "cor": "#f43f5e", "nomeCor": "Carmesim" },
                                                    { "id": "cp_3", "palavra": "EVIDÊNCIA", "cor": "#a855f7", "nomeCor": "Roxo" },
                                                    { "id": "cp_4", "palavra": "MISTÉRIO", "cor": "#ec4899", "nomeCor": "Rosa Choque" },
                                                    { "id": "cp_5", "palavra": "CÓDIGO", "cor": "#10b981", "nomeCor": "Esmeralda" },
                                                    { "id": "cp_6", "palavra": "PISTA", "cor": "#eab308", "nomeCor": "Ouro" },
                                                    { "id": "cp_7", "palavra": "CAIXA", "cor": "#06b6d4", "nomeCor": "Turquesa" },
                                                    { "id": "cp_8", "palavra": "SAÍDA", "cor": "#f97316", "nomeCor": "Laranja" },
                                                    { "id": "cp_9", "palavra": "PALAVRA", "cor": "#8b5cf6", "nomeCor": "Índigo" },
                                                    { "id": "cp_10", "palavra": "INVESTIGAÇÃO", "cor": "#22c55e", "nomeCor": "Verde Claro" },
                                                    { "id": "cp_11", "palavra": "ÁLIBI", "cor": "#14b8a6", "nomeCor": "Teal" },
                                                    { "id": "cp_12", "palavra": "CAFÉ", "cor": "#d97706", "nomeCor": "Âmbar" }
                                                ],
                                                "grid": [
                                                    ["D", "E", "T", "E", "T", "I", "V", "E", "X", "C", "Z", "P"],
                                                    ["S", "U", "S", "P", "E", "I", "T", "O", "A", "Q", "B", "I"],
                                                    ["E", "V", "I", "D", "Ê", "N", "C", "I", "A", "F", "G", "S"],
                                                    ["M", "I", "S", "T", "É", "R", "I", "O", "P", "L", "K", "T"],
                                                    ["C", "Ó", "D", "I", "G", "O", "V", "B", "N", "J", "H", "A"],
                                                    ["P", "I", "S", "T", "A", "Q", "W", "E", "R", "T", "Y", "D"],
                                                    ["C", "A", "I", "X", "A", "T", "F", "G", "H", "J", "K", "L"],
                                                    ["S", "A", "Í", "D", "A", "Z", "X", "C", "V", "B", "N", "M"],
                                                    ["P", "A", "L", "A", "V", "R", "A", "Q", "W", "E", "R", "T"],
                                                    ["I", "N", "V", "E", "S", "T", "I", "G", "A", "Ç", "Ã", "O"],
                                                    ["Á", "L", "I", "B", "I", "Z", "X", "C", "V", "B", "N", "M"],
                                                    ["C", "A", "F", "É", "T", "Y", "U", "I", "O", "P", "L", "K"]
                                                ],
                                                "posicoesPalavras": {
                                                    "DETETIVE": [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [0,7]],
                                                    "SUSPEITO": [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7]],
                                                    "EVIDÊNCIA": [[2,0], [2,1], [2,2], [2,3], [2,4], [2,5], [2,6], [2,7], [2,8]],
                                                    "MISTÉRIO": [[3,0], [3,1], [3,2], [3,3], [3,4], [3,5], [3,6], [3,7]],
                                                    "CÓDIGO": [[4,0], [4,1], [4,2], [4,3], [4,4], [4,5]],
                                                    "PISTA": [[5,0], [5,1], [5,2], [5,3], [5,4]],
                                                    "CAIXA": [[6,0], [6,1], [6,2], [6,3], [6,4]],
                                                    "SAÍDA": [[7,0], [7,1], [7,2], [7,3], [7,4]],
                                                    "PALAVRA": [[8,0], [8,1], [8,2], [8,3], [8,4], [8,5], [8,6]],
                                                    "INVESTIGAÇÃO": [[9,0], [9,1], [9,2], [9,3], [9,4], [9,5], [9,6], [9,7], [9,8], [9,9], [9,10], [9,11]],
                                                    "ÁLIBI": [[10,0], [10,1], [10,2], [10,3], [10,4]],
                                                    "CAFÉ": [[11,0], [11,1], [11,2], [11,3]]
                                                },
                                                "dica": "Dica Forense: Todas as palavras estão dispostas na horizontal (da esquerda para a direita). Observe o início de cada linha!",
                                                "explicacao": "Excelente faro investigativo, Detetive! Você localizou todas as 12 palavras da missão no caça-palavras pericial!"
                                            },
                                            {
                                                "id": "port_2_atv_34",
                                                "tipo": "cruzadinha_simples",
                                                "titulo": "Enigma 34: Cruzadinha Fonológica e Pericial",
                                                "instrucoes": "Analise as pistas e decifre os enigmas preenchendo as letras correspondentes. Consulte o <strong>Banco de Palavras</strong> da investigação: <em>ditongo • hiato • sílaba • tônica • oxítona • paroxítona • proparoxítona • mistério • detetive • código • pista • investigação</em>.",
                                                "itens": [
                                                    { "id": "cz2_1", "numero": 1, "pista": "Palavra que apresenta duas vogais em sílabas diferentes (Ex.: sa-í-da) [Vertical]", "palavraEsperada": "HIATO", "tamanho": 5 },
                                                    { "id": "cz2_2", "numero": 2, "pista": "Palavra que apresenta duas vogais na mesma sílaba, formando um ditongo (Ex.: pai, caixa, beijo) [Horizontal]", "palavraEsperada": "DITONGO", "tamanho": 7 },
                                                    { "id": "cz2_3", "numero": 3, "pista": "Palavra que tem a sílaba tônica na última sílaba (Ex.: café, você) [Vertical]", "palavraEsperada": "OXÍTONA", "tamanho": 7 },
                                                    { "id": "cz2_4", "numero": 4, "pista": "Palavra em que as vogais ficam em sílabas diferentes (Ex.: país, saída) [Horizontal]", "palavraEsperada": "HIATO", "tamanho": 5 },
                                                    { "id": "cz2_5", "numero": 5, "pista": "Palavra que não apresenta ditongo nem hiato (Ex.: mesa, gato) [Vertical]", "palavraEsperada": "SÍLABA", "tamanho": 6 },
                                                    { "id": "cz2_6", "numero": 6, "pista": "Palavra cuja última sílaba é a tônica (Ex.: café, sofá) [Horizontal]", "palavraEsperada": "OXÍTONA", "tamanho": 7 },
                                                    { "id": "cz2_7", "numero": 7, "pista": "Palavra cuja penúltima sílaba é a tônica (Ex.: pista, porta) [Horizontal]", "palavraEsperada": "PAROXÍTONA", "tamanho": 10 },
                                                    { "id": "cz2_8", "numero": 8, "pista": "Palavra cuja antepenúltima sílaba é a tônica (Ex.: código, álibi) [Horizontal]", "palavraEsperada": "PROPAROXÍTONA", "tamanho": 13 },
                                                    { "id": "cz2_9", "numero": 9, "pista": "Conjunto de sílabas que têm uma mesma vogal tônica (Ex.: mis-té-rio) [Horizontal]", "palavraEsperada": "MISTÉRIO", "tamanho": 8 },
                                                    { "id": "cz2_10", "numero": 10, "pista": "Palavra relacionada à investigação (Ex.: detetive) [Horizontal]", "palavraEsperada": "DETETIVE", "tamanho": 8 }
                                                ],
                                                "dica": "Dica Forense: Conte os quadradinhos de cada linha e compare com os termos do Banco de Palavras!",
                                                "explicacao": "🏆 CASO DA AULA 2 TOTALMENTE DESVENDADO COM HONRAS PERICIAIS! Você completou com maestria todos os 34 enigmas de Língua Portuguesa!"
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
