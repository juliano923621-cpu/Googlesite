# GERADOR DE QUESTÕES - RECEITA FEDERAL

## Como usar

Execute o script Python para gerar questões:

```bash
python gerador_questoes.py
```

## Matérias Disponíveis

| Código | Matéria | Cards | Status |
|--------|--------|-------|--------|
| direito_constitucional | Direito Constitucional | 396 | ✅ |
| direito_tributario | Direito Tributário | 375 | ✅ |
| direito_adm | Direito ADM+ | 311 | ✅ |
| direito_civil | Direito Civil | 293 | ✅ |
| direito_empresarial | Direito Empresarial | 215 | ✅ |
| direito_penal | Direito Penal | 197 | ✅ |
| auditoria_tributaria | Auditoria Tributária Fiscal | 233 | ✅ |
| contabilidade | Contabilidade Geral | 246 | ✅ |
| ti | Tecnologia da Informação | 426 | ✅ |
| rl | Raciocínio Lógico | 8 | ⚠️ |
| estatistica | Estatística | 8 | ⚠️ |
| matfin | Matemática Financeira | 4 | ⚠️ |

## Uso via Python

```python
from gerador_questoes import gerar_questao

# Gerar 5 questões de Direito Constitucional
questoes = gerar_questao(materia='direito constitucional', quantidade=5)

# Gerar 10 questões aleatórias
questoes = gerar_questao(quantidade=10)

# Ver lista de tópicos
from gerador_questoes import list_topics
topicos = list_topics()
```

## Tipos de Questão

1. **Certo ou Errado (C/E)** - Estilo Cespe
2. **Múltipla Escolha (A/B/C/D/E)** - Estilo Cesgranrio

## Tópicos por Matéria

### DIREITO CONSTITUCIONAL (396)
- Elementos do Estado (território, povo, governo soberano)
- Autogoverno e autonomia política
- Federação
- Poder constituinte originário e derivado
- Direitos e garantias fundamentais
- Controle de constitucionalidade
- Organização dos poderes

### DIREITO TRIBUTÁRIO (375)
- Tipo de lançamento
- Lançamentos de Imposto
- Obrigação tributária
- Competência tributária
- Impostos (federal, estadual, municipal)
- Crédito tributário
- Responsabilidade tributária

### DIREITO ADM+ (311)
- Direitos dos usuários (Lei 8.987/1995)
- Prestação de serviços públicos
- Concessão e permissão
- Licitação pública
- Contratos administrativos
- Agências reguladoras
- Parcerias público-privadas
- Responsabilidade civil do Estado

### DIREITO CIVIL (293)
- Prescrição e decadência
- Prazos de prescrição (10 anos)
- Capacidade civil
- Pessoas naturais e jurídicas
- Obrigações e contratos
- Responsabilidade civil
- Direitos reais

### DIREITO EMPRESARIAL (215)
- Dissolução de sociedade
- Sociedade limitada
- Sociedade anônima
- Falência e recuperação judicial
- Títulos de crédito (cheque, duplicata)
- Lei 11.101/2005

### DIREITO PENAL (197)
- Princípio da legalidade
- Princípio da anterioridade
- Princípio da insignificância
- Crimes contra administração pública
- Peculato, concussão, corrupção
- Concurso de pessoas
- Extinção da punibilidade

### CONTABILIDADE GERAL (246)
- Classificação das contas no ativo
- Disponibilidades
- Balanço patrimonial
- Demonstrações contábeis
- DRE
- Lei das S/A (6.404/76)

### TECNOLOGIA DA INFORMAÇÃO (426)
- Machine Learning
- Bagging
- Inteligência Artificial
- Redes Neurais
- Deep Learning
- Big Data
- Cloud Computing
- Algoritmos de classificação
- K-Nearest Neighbors
- SVM
- Clustering
- Processamento de Linguagem Natural

## Próximos Passos

1. Integrar com o Anki para gerar questões automaticamente
2. Adicionar mais tipos de questão
3. Criar interface web
4. Exportar para PDF