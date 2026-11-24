/**
 * Conteúdo padrão do mapa (Gran Concursos — Bruno Pilastre, págs. 43-44).
 * Formato compacto: [rótulo, filhos?]. É convertido em árvore por fromOutline().
 */
export const ROOT_LABEL = 'TEXTO';

export const DEFAULT_OUTLINE = [
  [
    'Pode ser',
    [
      [
        'Verbal',
        [
          ['Oral'],
          [
            'Escrito',
            [['Prosa (períodos e parágrafos)'], ['Poema (versos e estrofes)']],
          ],
        ],
      ],
      ['Não verbal'],
      ['Misto (verbal e não verbal)'],
    ],
  ],
  [
    'Critérios de textualidade',
    [
      ['Aceitabilidade'],
      ['Intencionalidade'],
      ['Informatividade'],
      ['Situacionalidade'],
      ['Intertextualidade'],
    ],
  ],
  [
    'Funções da linguagem',
    [
      ['Contexto (função referencial)'],
      ['Receptor (função apelativa/conativa)'],
      ['Código (função metalinguística)'],
      ['Canal (função fática)'],
      ['Mensagem (função poética)'],
      ['Emissor (função expressiva)'],
    ],
  ],
  [
    'O signo (segundo Pierce)',
    [
      ['Ícone (fotografia)'],
      ['Índice (fumaça)'],
      ['Símbolo (nomes substantivos)'],
    ],
  ],
  [
    'Vozes Discursivas',
    [
      ['Citação (explícita ou implícita)'],
      ['Paródia'],
      ['Alusão'],
      ['Paráfrase'],
      ['Epígrafe'],
    ],
  ],
  ['Níveis de linguagem', [['Culto'], ['Comum'], ['Popular']]],
  [
    'Variação Linguística',
    [
      [
        'Conceitos',
        [
          ['Dialeto'],
          ['Idioma'],
          ['Socioleto'],
          ['Linguagem Padrão'],
          ['Idioleto'],
          ['Registros'],
        ],
      ],
      [
        'Tipos',
        [
          ['Variação histórica'],
          ['Variação geográfica'],
          ['Variação social'],
          ['Variação estilística'],
        ],
      ],
    ],
  ],
];
