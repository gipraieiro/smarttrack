# SMARTTRACK

## Integrantes

- Gabrielly Souza Lorentz — RM: 565806
- Giovanna Praieiro Pavani — RM: 565681
- Heitor Fernandes Barbosa — RM: 563078
- Julia Aparicio de Souza — RM: 563623
- Maria Eduarda de Oliveira — RM: 565386
- Nicole Calasans Rosanti — RM: 564381

---

## Sobre o Projeto

O SMARTTRACK é uma solução mobile desenvolvida para auxiliar no monitoramento inteligente da vegetação em rodovias concedidas pela CCR Motiva.

A aplicação tem como objetivo identificar áreas críticas com crescimento excessivo de vegetação, permitindo o acompanhamento das condições da rodovia e auxiliando equipes operacionais na tomada de decisão.

Nesta etapa do projeto, a aplicação utiliza dados mockados para representar os pontos monitorados da rodovia Fernão Dias (BR-381), permitindo a demonstração dos principais fluxos do sistema enquanto futuras integrações com APIs podem ser realizadas.

---

## Problema Proposto pela Motiva

O crescimento descontrolado da vegetação em áreas próximas às rodovias pode causar:

- Redução da visibilidade;
- Riscos operacionais;
- Dificuldades de manutenção;
- Aumento da possibilidade de acidentes;
- Impactos na conservação da rodovia.

Atualmente, grande parte desse monitoramento depende de inspeções manuais, tornando o processo mais lento e menos eficiente.

---

## Persona

### Marcelo — Supervisor Operacional

**Idade:** 42 anos

**Cargo:** Supervisor de conservação rodoviária

**Objetivo:**

- Monitorar áreas críticas da rodovia;
- Identificar riscos relacionados à vegetação;
- Otimizar o acionamento das equipes operacionais.

**Principais dificuldades:**

- Monitoramento manual ineficiente;
- Dificuldade na visualização rápida de ocorrências;
- Falta de centralização das informações.

---

## Requisitos Funcionais

- RF01 – Permitir login de usuários;
- RF02 – Exibir dashboard com indicadores de monitoramento;
- RF03 – Apresentar áreas críticas identificadas na rodovia;
- RF04 – Permitir visualização de alertas operacionais;
- RF05 – Permitir visualizar detalhes da vegetação monitorada;
- RF06 – Exibir status das áreas monitoradas;
- RF07 – Permitir navegação entre as telas do aplicativo.

---

## Requisitos Não Funcionais

- RNF01 – Interface responsiva e intuitiva;
- RNF02 – Navegação simples e objetiva;
- RNF03 – Identidade visual consistente;
- RNF04 – Possibilidade de futura integração com geolocalização;
- RNF05 – Desenvolvimento utilizando React Native.

---

# Funcionalidades Implementadas

## Login

Tela inicial de acesso ao sistema com validação dos campos de e-mail e senha.

O protótipo utiliza autenticação mockada. Portanto, nesta etapa, não há validação de credenciais reais.

### Cenários implementados

- Campos vazios;
- E-mail preenchido sem senha;
- Senha preenchida sem e-mail;
- E-mail e senha preenchidos.

---

## Dashboard

Exibição dos principais indicadores de monitoramento:

- Áreas monitoradas;
- Áreas em alerta;
- Áreas críticas.

Também apresenta:

- Mapa da BR-381 — Fernão Dias;
- Indicadores operacionais;
- Altura média da vegetação;
- Tendência de crescimento;
- Modal para visualização ampliada do mapa.

---

## Alertas

Lista de pontos monitorados organizados por nível de risco:

- Alto;
- Médio;
- Baixo.

Os alertas apresentam informações como:

- Localização;
- Região;
- Quilometragem;
- Altura da vegetação;
- Tendência de crescimento;
- Status operacional;
- Nível de risco.

---

## Detalhes da Vegetação

Permite visualizar informações detalhadas de cada ponto monitorado:

- Localização;
- Rodovia;
- Quilometragem;
- Nível de risco;
- Altura da vegetação;
- Tendência de crescimento;
- Temperatura;
- Umidade;
- Status operacional;
- Imagem representativa da vegetação.

---

## Acionamento de Equipe

Ocorrências classificadas como Alto ou Médio risco permitem solicitar uma equipe de manutenção.

O fluxo possui confirmação antes do registro da solicitação.

### Fluxo principal

1. Selecionar uma área de risco Alto ou Médio;
2. Selecionar **Solicitar equipe**;
3. Selecionar **Confirmar**;
4. O sistema apresenta a confirmação de que a equipe foi solicitada.

### Fluxo alternativo

1. Selecionar **Solicitar equipe**;
2. Selecionar **Cancelar**;
3. A solicitação não é registrada;
4. O botão **Solicitar equipe** volta a aparecer.

Áreas classificadas como Baixo risco não apresentam a opção de solicitação de equipe.

---

# Estados e Cenários Mockados

Para a Sprint 3, foram implementados diferentes estados para representar situações que podem ocorrer durante o carregamento dos dados.

Os cenários estão organizados no arquivo `src/data/mockScenarios.ts`.

### Success

Representa o funcionamento normal da aplicação.

Os dados mockados são carregados e os 7 pontos monitorados são exibidos.

### Empty

Representa uma situação em que não existem pontos disponíveis para exibição.

O sistema apresenta:

- Mensagem de lista vazia;
- Botão **Atualizar**.

Ao selecionar **Atualizar**, o cenário retorna para os dados de sucesso.

### Error

Representa uma falha no carregamento dos pontos monitorados.

O sistema apresenta:

- Mensagem de erro;
- Botão **Tentar novamente**.

Ao selecionar **Tentar novamente**, o cenário retorna para os dados de sucesso.

---

# Como Testar os Cenários Mockados

Os cenários de sucesso, lista vazia e erro são controlados pelo arquivo `src/screens/AlertsScreen.tsx`, por meio da variável `scenario`.

Por padrão, o aplicativo inicia no cenário de sucesso:

`const [scenario, setScenario] = React.useState<MockScenario>("success");`

## Testar o cenário Success

Mantenha o valor:

`"success"`

Execute o aplicativo e acesse a tela de **Alertas**.

O sistema deverá apresentar os 7 pontos monitorados.

---

## Testar o cenário Empty

Para testar a situação de lista vazia, altere temporariamente o valor de `scenario` para:

`"empty"`

Execute novamente o aplicativo e acesse a tela de **Alertas**.

O sistema deverá apresentar o estado de lista vazia com o botão **Atualizar**.

Ao selecionar **Atualizar**, o sistema retorna ao cenário de sucesso e os 7 pontos monitorados são exibidos novamente.

Após realizar o teste, retorne o valor para:

`"success"`

---

## Testar o cenário Error

Para testar uma falha no carregamento dos dados, altere temporariamente o valor de `scenario` para:

`"error"`

Execute novamente o aplicativo e acesse a tela de **Alertas**.

O sistema deverá apresentar o estado de erro com o botão **Tentar novamente**.

Ao selecionar **Tentar novamente**, o sistema retorna ao cenário de sucesso e os 7 pontos monitorados são exibidos novamente.

Após realizar o teste, retorne o valor para:

`"success"`

> Os cenários `empty` e `error` são utilizados exclusivamente para validação do comportamento da aplicação durante os testes e não ficam ativos no fluxo normal do aplicativo.

---

# Componentes Reutilizáveis

Para manter a organização e consistência da interface, foram criados componentes reutilizáveis para estados específicos:

- `src/components/EmptyState.tsx`
- `src/components/ErrorState.tsx`

### EmptyState

Responsável pela apresentação da situação em que não existem dados para exibição.

### ErrorState

Responsável pela apresentação de erros durante o carregamento dos dados e pela opção de tentar novamente.

---

# Estrutura dos Dados Mockados

Nesta Sprint foi utilizada uma camada de dados mockados para simular futuras integrações com APIs reais.

Os dados simulam:

- Trechos da rodovia;
- Níveis de risco da vegetação;
- Altura da vegetação;
- Temperatura;
- Umidade;
- Tendência de crescimento;
- Status operacional das áreas monitoradas.

Os dados principais são armazenados localmente através do arquivo `src/data/mockData.ts`.

Os cenários de sucesso, lista vazia e erro são organizados em `src/data/mockScenarios.ts`.

---

# Status das Funcionalidades

| Funcionalidade | Status |
|---|---|
| Login | Concluído |
| Validação do login | Concluído |
| Dashboard | Concluído |
| Indicadores de monitoramento | Concluído |
| Mapa da BR-381 | Concluído |
| Visualização ampliada do mapa | Concluído |
| Lista de alertas | Concluído |
| Classificação de risco | Concluído |
| Detalhes da vegetação | Concluído |
| Acionamento de equipe | Concluído |
| Confirmação da solicitação | Concluído |
| Cancelamento da solicitação | Concluído |
| Área controlada | Concluído |
| Cenário de sucesso | Concluído |
| Cenário de lista vazia | Concluído |
| Cenário de erro | Concluído |
| Recuperação após erro | Concluído |
| Navegação entre telas | Concluído |
| Integração com API real | Pendente |
| Autenticação real | Pendente |
| Geolocalização real | Pendente |

---

# Testes Manuais — Sprint 3

Foram realizados testes manuais dos principais fluxos da aplicação.

| # | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| 1 | Login com e-mail e senha | Permitir acesso ao Dashboard | Dashboard foi exibido | Aprovado |
| 2 | Login sem preenchimento | Impedir acesso e informar os campos obrigatórios | Acesso bloqueado e mensagem exibida | Aprovado |
| 3 | Alertas com dados | Exibir os pontos monitorados | 7 pontos exibidos | Aprovado |
| 4 | Lista de alertas vazia | Exibir estado vazio e permitir atualização | Estado vazio exibido e atualização retornou os 7 pontos | Aprovado |
| 5 | Erro no carregamento | Exibir erro e permitir nova tentativa | Erro exibido e nova tentativa retornou os 7 pontos | Aprovado |
| 6 | Solicitação de equipe | Solicitar confirmação antes do registro | Confirmação exibida e solicitação registrada após confirmação | Aprovado |
| 7 | Cancelamento da solicitação | Não registrar solicitação e retornar à ação inicial | Solicitação cancelada e botão retornou | Aprovado |
| 8 | Área controlada | Não disponibilizar solicitação de equipe | Área controlada exibida sem botão de solicitação | Aprovado |
| 9 | Navegação geral | Permitir navegação entre os principais fluxos | Navegação realizada sem erros | Aprovado |

---

# Resultado dos Testes

Os principais fluxos da aplicação foram testados manualmente e apresentaram o comportamento esperado.

Também foram validados cenários alternativos de:

- Lista vazia;
- Erro no carregamento;
- Recuperação após erro;
- Cancelamento de solicitação de equipe;
- Áreas sem necessidade de intervenção.

Os testes realizados não apresentaram falhas durante a validação manual.

---

# Tecnologias Utilizadas

## Desenvolvimento

- React Native
- Expo
- TypeScript

## Navegação

- React Navigation

## Interface

- Expo Vector Icons / Ionicons

## Prototipação

- Figma

---

# Protótipo Desenvolvido na Sprint 1

Figma:

https://www.figma.com/design/uiT7Sx1GymCKe3wxQIi0LM/smarttrack?node-id=0-1&t=16lK5cTkyCKeFN1Q-1

---

# Como Executar o Projeto

## Instalar dependências

`npm install`

## Executar o projeto

`npx expo start`

## Executar no celular

- Instalar o aplicativo Expo Go;
- Executar o projeto;
- Escanear o QR Code gerado pelo Expo.

---

# Evolução do Projeto

## Sprint 1

- Levantamento de requisitos;
- Definição da persona;
- Criação dos requisitos funcionais e não funcionais;
- Criação do protótipo navegável no Figma;
- Definição do fluxo principal da aplicação.

## Sprint 2

- Desenvolvimento do aplicativo funcional;
- Implementação da navegação entre telas;
- Utilização de dados mockados;
- Implementação do fluxo de monitoramento;
- Acionamento de equipes de manutenção;
- Inclusão de imagens representativas da vegetação;
- Implementação do Dashboard;
- Implementação da tela de Alertas;
- Implementação da tela de Detalhes da Vegetação.

## Sprint 3

- Implementação da validação do login;
- Evolução dos dados mockados;
- Implementação dos cenários de sucesso, lista vazia e erro;
- Criação dos componentes reutilizáveis EmptyState e ErrorState;
- Implementação do fluxo de recuperação após erro;
- Implementação da confirmação de solicitação de equipe;
- Implementação do cancelamento da solicitação de equipe;
- Validação dos fluxos principais e alternativos;
- Realização dos testes manuais;
- Consolidação da navegação entre as telas.

---

# Pendências

As seguintes funcionalidades permanecem como possibilidades de evolução do projeto:

- Integração com API real;
- Autenticação real de usuários;
- Integração com geolocalização;
- Recebimento de dados reais dos sensores;
- Persistência das solicitações de manutenção;
- Atualização automática dos dados;
- Evolução dos indicadores de monitoramento;
- Integração com infraestrutura de monitoramento da rodovia.

---

# Plano para a Sprint 4

Para a próxima Sprint, estão previstas evoluções relacionadas à integração e consolidação da solução:

- Avaliar integração com APIs reais;
- Preparar a aplicação para receber dados reais;
- Evoluir a integração com geolocalização;
- Aprimorar os indicadores de monitoramento;
- Avaliar persistência das solicitações de manutenção;
- Realizar novos testes após as integrações;
- Refinar a experiência do usuário a partir dos testes realizados.

---

# Repositório

https://github.com/gipraieiro/smarttrack