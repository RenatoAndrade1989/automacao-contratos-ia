# 🤖 Ecossistema de Automação, Triagem e Gestão de Contratos com IA

## 📌 Sobre o Projeto
Este projeto consiste no desenvolvimento de um ecossistema automatizado focado na área operacional, administrativa e jurídica para otimizar o recebimento de dados, triagem e confecção automatizada de minutas de contratos. 

A solução integra uma interface inteligente de captação de dados (Typebot) e persistência com processamento lógico pesado em microsserviço serverless (Supabase Edge Functions).

> **Status do Projeto:** 🚧 Em Desenvolvimento (Fase de Migração de Infraestrutura)
> *As camadas de Interface (Typebot) e a Inteligência Core de Negócio (Supabase Edge Function em TypeScript) estão 100% concluídas e documentadas neste repositório. A etapa final de orquestração via n8n está congelada para migração de ambiente.*

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

O projeto foi desenhado seguindo o conceito de microsserviços e desacoplamento, utilizando as melhores ferramentas do ecossistema No-Code/Low-Code e IA:

* **Interface de Entrada (Front-end):** [Typebot] - Formulário dinâmico e inteligente para captura de variáveis contratuais com validação em tempo real.
* **Banco de Dados & Serverless Backend:** [Supabase] - Persistência de dados estruturados e uso de **Edge Functions em TypeScript** (Deno) para processamento lógico e integração direta com a API da OpenAI. É o verdadeiro cérebro da geração de contratos.
* **Orquestração de Fila (Pendente):** [n8n] - Camada planejada para recepção de webhooks e renderização final do arquivo PDF.

---

## 📁 Estrutura deste Repositório

Para demonstrar a engenharia por trás do projeto, os arquivos lógicos das camadas concluídas estão disponíveis na raiz:
* `/typebot/fluxo_interface_typebot.json` -> Estrutura lógica e árvore de decisão do bot de atendimento.
* `/supabase/gerador_contratos_function.ts` -> Edge Function (TypeScript) contendo as regras de negócio e chamadas de IA para montagem das minutas.

---

## 🚀 Próximos Passos & Desafios de Infraestrutura

O core lógico do sistema está pronto. O projeto encontra-se temporariamente pausado na última milha devido à expiração do ambiente de testes da nuvem do n8n. As próximas etapas técnicas mapeadas são:

1. **Definição de Infraestrutura para o n8n:** Avaliação de viabilidade entre upgrade para plano comercial ou deploy autônomo (Self-hosted via Docker na Railway/Render ou ambiente local com tunelamento via Ngrok).
2. **Integração de Webhooks:** Conectar a saída da Edge Function do Supabase com o novo nó receptor do orquestrador.
3. **Renderização de PDF:** Configuração do motor de layout para consolidação do documento final enviado ao usuário.

---

## 👨‍💻 Autor
* **Renato Souza de Andrade**
* LinkedIn: www.linkedin.com/in/renato-andrade-b3a644152

