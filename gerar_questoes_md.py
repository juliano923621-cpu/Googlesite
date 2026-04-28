import sys
import os
from gerador_questoes import gerar_questao, list_topics

def main():
    print("Gerando 10 questões...")
    questoes = gerar_questao(quantidade=10)
    
    output = "# Lista de Questões Geradas\n\n"
    
    for i, q in enumerate(questoes, 1):
        output += f"### Questão {i} - {q['topico']}\n\n"
        output += f"**Tipo:** {q['tipo']}\n\n"
        output += f"**Pergunta:** {q['pergunta']}\n\n"
        
        if q['tipo'] == 'Múltipla Escolha' and 'alternativas' in q:
            for alt, texto in q['alternativas'].items():
                output += f"- **{alt})** {texto}\n"
            output += "\n"
            
        output += f"<details>\n<summary><b>Ver Gabarito e Explicação</b></summary>\n\n"
        output += f"**Gabarito:** {q['gabarito']}\n\n"
        output += f"**Explicação:** {q['explicacao']}\n\n"
        output += f"</details>\n\n"
        output += "---\n\n"
        
    with open("questoes_geradas.md", "w", encoding="utf-8") as f:
        f.write(output)
    
    print("Questões salvas em questoes_geradas.md")

if __name__ == '__main__':
    main()
