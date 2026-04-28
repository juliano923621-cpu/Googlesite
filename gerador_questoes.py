"""
Gerador de Questões para Receita Federal
Baseado nas notas reais do Anki de Juliano
"""
import sqlite3
import random
import sys
from datetime import datetime

# Conectar ao banco do Anki
DB_PATH = r"C:\Users\Administrador\AppData\Roaming\Anki2\Juliano\collection.anki2"

def get_decks():
    conn = sqlite3.connect(DB_PATH, isolation_level=None)
    conn.text_factory = lambda b: b.decode('utf-8', errors='ignore')
    cur = conn.cursor()
    cur.execute('SELECT name, id FROM decks')
    return dict(cur.fetchall())

def get_notes_by_deck(deck_name):
    conn = sqlite3.connect(DB_PATH, isolation_level=None)
    conn.text_factory = lambda b: b.decode('utf-8', errors='ignore')
    cur = conn.cursor()
    decks = get_decks()
    
    did = None
    for name, id in decks.items():
        if deck_name.lower() in name.lower():
            did = id
            break
    
    if not did:
        return []
    
    cur.execute('''
        SELECT n.flds 
        FROM notes n 
        JOIN cards c ON n.id = c.nid 
        WHERE c.did = ?
    ''', (did,))
    
    notas = []
    for (flds,) in cur.fetchall():
        campos = flds.split('\x1f')
        frente = campos[0].strip() if campos else ''
        verso = campos[1].strip() if len(campos) > 1 else ''
        notas.append({'pergunta': frente[:200], 'resposta': verso[:200]})
    
    return notas

def generate_question(topic, notes):
    """Gera uma questão baseada nas notas"""
    if not notes:
        return None
    
    note = random.choice(notes)
    
    # Tipos de questão
    question_type = random.choice(['certo_errado', 'multipla'])
    
    if question_type == 'certo_errado':
        # 50% de chance de estar certa ou errada
        is_correct = random.choice([True, False])
        
        if is_correct:
            question = f"{note['pergunta']}"
            answer = "C"
            explanation = f"Correto. {note['resposta']}"
        else:
            # Inverter ou modificar a resposta
            wrong_answers = [
                "Essaafirmação é incorreta porque...",
                "Não existe essa relação no direito.",
                "O correto seria..."
            ]
            question = f"{note['pergunta']} {random.choice(wrong_answers)}"
            answer = "E"
            explanation = f"Incorreto. {note['resposta']}"
        
        return {
            'tipo': 'Certo ou Errado',
            'pergunta': question,
            'gabarito': answer,
            'explicacao': explanation,
            'topico': topic
        }
    
    else:  # múltipla escolha
        alternativas = ['A', 'B', 'C', 'D', 'E']
        correta = random.choice(alternativas)
        
        return {
            'tipo': 'Múltipla Escolha',
            'pergunta': note['pergunta'],
            'alternativas': {
                correta: note['resposta'][:100],
                '其他': '的其他选项placeholder'
            },
            'gabarito': correta,
            'explicacao': note['resposta'],
            'topico': topic
        }

def list_topics():
    """Lista todos os tópicos disponíveis"""
    return {
        'direito_constitucional': {
            'nome': 'Direito Constitucional',
            'cards': 396,
            'topicos': [
                'Elementos do Estado',
                'Autogoverno',
                'Federação',
                'Poder Constituinte',
                'Direitos Fundamentais',
                'Controle de Constitucionalidade'
            ]
        },
        'direito_tributario': {
            'nome': 'Direito Tributário',
            'cards': 375,
            'topicos': [
                'Tipo de lançamento',
                'Impostos',
                'Obrigação tributária',
                'Competência tributária',
                'Crédito tributário'
            ]
        },
        'direito_adm': {
            'nome': 'Direito Administrativo',
            'cards': 311,
            'topicos': [
                'Direitos dos usuários',
                'Concessões',
                'Permissão',
                'Licitação',
                'Contratos administrativos'
            ]
        },
        'direito_civil': {
            'nome': 'Direito Civil',
            'cards': 293,
            'topicos': [
                'Prescrição',
                'Capacidade civil',
                'Pessoas jurídicas',
                'Obrigações',
                'Responsabilidade civil'
            ]
        },
        'auditoria_tributaria': {
            'nome': 'Auditoria Tributária Fiscal',
            'cards': 233,
            'topicos': [
                'Continuidade operacional',
                'NBC',
                'Testes de recuperação',
                'Parecer do auditor'
            ]
        },
        'direito_empresarial': {
            'nome': 'Direito Empresarial',
            'cards': 215,
            'topicos': [
                'Sociedades limitada',
                'Sociedade anônima',
                'Dissolução',
                'Falência',
                'Recuperação judicial'
            ]
        },
        'direito_penal': {
            'nome': 'Direito Penal',
            'cards': 197,
            'topicos': [
                'Princípio da legalidade',
                'Princípio da anterioridade',
                'Concurso de pessoas',
                'Extinção da punibilidade'
            ]
        },
        'contabilidade': {
            'nome': 'Contabilidade Geral',
            'cards': 246,
            'topicos': [
                'Classificação do ativo',
                'Disponibilidades',
                'Balanço patrimonial',
                'Demonstrações contábeis'
            ]
        },
        'ti': {
            'nome': 'Tecnologia da Informação',
            'cards': 426,
            'topicos': [
                'Machine Learning',
                'Redes Neurais',
                'Big Data',
                'Cloud Computing',
                'Inteligência Artificial'
            ]
        }
    }

def gerar_questao(materia=None, quantidade=1, tipo='certo_errado'):
    """Main function para gerar questões"""
    topics = list_topics()
    
    if materia:
        materia_lower = materia.lower()
        key = None
        for k in topics:
            if materia_lower in k or materia_lower in topics[k]['nome'].lower():
                key = k
                break
        
        if key:
            notas = get_notes_by_deck(topics[key]['nome'])
            questoes = []
            for i in range(min(quantidade, len(notas) if notas else 10)):
                q = generate_question(topics[key]['nome'], notas)
                if q:
                    questoes.append(q)
            return questoes
    
    # Se não especificar matéria, gerar de todas
    all_questions = []
    for key, info in topics.items():
        notas = get_notes_by_deck(info['nome'])
        for i in range(min(2, len(notas) if notas else 5)):
            q = generate_question(info['nome'], notas)
            if q:
                all_questions.append(q)
    
    return all_questions[:quantidade]

# Teste
if __name__ == '__main__':
    print("=" * 60)
    print("GERADOR DE QUESTÕES - RECEITA FEDERAL")
    print("=" * 60)
    print()
    print("Matérias disponíveis:")
    for k, v in list_topics().items():
        print(f"  - {v['nome']}: {v['cards']} cards")
    print()
    
    # Gerar exemplo
    print("Exemplo de questão gerada:")
    print("-" * 40)
    qs = gerar_questao('direito constitucional', 1)
    if qs:
        print(f"Tipo: {qs[0]['tipo']}")
        print(f"Pergunta: {qs[0]['pergunta']}")
        print(f"Gabarito: {qs[0]['gabarito']}")
        print(f"Explicação: {qs[0]['explicacao']}")