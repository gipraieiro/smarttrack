
# SmartTrack

Aplicativo mobile para monitoramento da vegetação em rodovias, desenvolvido para apoiar a Motiva na identificação de áreas críticas e no planejamento das ações de manutenção.

## Integrantes

- Gabrielly Souza Lorentz — RM 565806
- Giovanna Praieiro Pavani — RM 565681
- Heitor Fernandes Barbosa — RM 563078
- Julia Aparicio de Souza — RM 563623
- Maria Eduarda de Oliveira — RM 565386
- Nicole Calasans Rosanti — RM 564381

## Problema

O crescimento excessivo da vegetação próximo às rodovias pode comprometer a visibilidade, aumentar riscos operacionais e dificultar a conservação das vias. O SmartTrack centraliza informações sobre os pontos monitorados, facilitando a identificação de áreas que precisam de atenção.

## Persona

**Marcelo, 42 anos — Supervisor de conservação rodoviária**

Precisa acompanhar as condições da vegetação, identificar áreas de risco e organizar as equipes de manutenção de forma eficiente.

## Requisitos funcionais

- RF01 — Permitir login de usuários.
- RF02 — Exibir indicadores no Dashboard.
- RF03 — Apresentar pontos monitorados e áreas críticas.
- RF04 — Exibir alertas operacionais.
- RF05 — Apresentar detalhes da vegetação.
- RF06 — Exibir o status das áreas monitoradas.
- RF07 — Permitir navegação entre as telas.

## Requisitos não funcionais

- RNF01 — Interface intuitiva e responsiva.
- RNF02 — Navegação simples.
- RNF03 — Identidade visual consistente.
- RNF04 — Possibilidade de integração futura com geolocalização.
- RNF05 — Desenvolvimento em React Native.

## Funcionalidades implementadas

### Login
Tela de acesso com campos de e-mail e senha. A autenticação é simulada.

### Dashboard
Apresenta indicadores de monitoramento, áreas em alerta, áreas críticas, altura da vegetação, tendência de crescimento e mapa representativo da BR-381.

### Alertas
Lista os pontos monitorados com classificação de risco alto, médio e baixo, localização, quilometragem e informações operacionais.

### Detalhes da vegetação
Exibe informações do ponto selecionado, incluindo altura da vegetação, tendência de crescimento, temperatura, umidade, nível de risco e status operacional.

### Solicitação de equipe
Permite solicitar uma equipe de manutenção para áreas de risco alto ou médio, com opção de confirmar ou cancelar a solicitação. Áreas de baixo risco não permitem o acionamento.

### Cenários de teste
A tela de Alertas possui três cenários simulados:

- **Success:** apresenta os pontos monitorados.
- **Empty:** simula uma lista sem dados.
- **Error:** simula uma falha no carregamento.

O cenário pode ser selecionado diretamente na interface.

### Cadastro de ocorrências
Permite cadastrar, consultar e excluir ocorrências. Os registros são armazenados localmente com AsyncStorage e aparecem nas telas relacionadas do aplicativo.

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage
- Expo Vector Icons / Ionicons
- Expo EAS Build
- Figma

## Estrutura principal

- `src/data/mockData.ts` — dados simulados dos pontos monitorados.
- `src/data/mockScenarios.ts` — cenários de teste.
- `src/components/EmptyState.tsx` — componente de estado vazio.
- `src/components/ErrorState.tsx` — componente de erro.
- `@smarttrack/new-occurrences` — chave utilizada para armazenar ocorrências localmente.

## Testes manuais

| Teste | Resultado esperado |
|---|---|
| Login com campos preenchidos | Acesso ao Dashboard |
| Login sem preenchimento | Exibição de validação |
| Lista de alertas | Exibição dos pontos monitorados |
| Cenário Empty | Exibição de estado vazio |
| Cenário Error | Exibição de erro e opção de nova tentativa |
| Solicitação de equipe | Confirmação antes de concluir |
| Cancelamento da solicitação | Solicitação não concluída |
| Área de baixo risco | Solicitação indisponível |
| Cadastro de ocorrência | Registro salvo localmente |
| Consulta de ocorrência | Detalhes exibidos |
| Exclusão de ocorrência | Registro removido |
| Persistência local | Registro mantido após reabrir o aplicativo |

## APK Android

O APK foi gerado pelo Expo EAS Build, instalado e executado no emulador Android Pixel 8.

- **Plataforma:** Android
- **Perfil de build:** `preview`
- **Formato:** APK
- **Identificador do aplicativo:** `com.smarttrack.mobile`

**Link para acessar o build e baixar o APK:**

https://expo.dev/accounts/gipraieiro/projects/smarttrack-mobile/builds/fc830272-e950-44ed-afc1-dce24c225ccd

## Como executar o projeto

**Pré-requisitos:** Node.js e npm instalados.

Instale as dependências:

`npm install`

Inicie o projeto:

`npx expo start`

## Protótipo no Figma

https://www.figma.com/design/uiT7Sx1GymCKe3wxQIi0LM/smarttrack?node-id=0-1&t=16lK5cTkyCKeFN1Q-1

## Plano de negócio

### Proposta de valor

Centralizar informações sobre a vegetação rodoviária, facilitar a identificação de áreas críticas e apoiar o planejamento das equipes de manutenção.

### Público-alvo

Concessionárias de rodovias, supervisores operacionais e equipes responsáveis pela conservação e segurança viária.

### Modelo de receita

Possibilidade de comercialização por meio de contratos corporativos ou assinaturas, considerando trechos monitorados, usuários, implantação, integração e suporte técnico.

### Investimento inicial estimado

Simulação para um piloto com dez pontos de monitoramento:

| Item | Custo estimado |
|---|---:|
| Dispositivos de monitoramento (10 × R$ 400) | R$ 4.000 |
| Receptor LoRa | R$ 1.500 |
| Instalação (10 × R$ 150) | R$ 1.500 |
| Implantação e treinamento | R$ 6.000 |
| **Total inicial** | **R$ 13.000** |

### Custos mensais estimados do piloto

| Item | Custo mensal |
|---|---:|
| Nuvem e banco de dados | R$ 300 |
| Manutenção e suporte | R$ 500 |
| Licença do aplicativo | R$ 400 |
| **Total mensal** | **R$ 1.200** |

### Manutenção adicional estimada do aplicativo

| Item | Custo mensal |
|---|---:|
| Manutenção e melhorias | R$ 600 |
| Suporte técnico | R$ 300 |
| Ferramentas de desenvolvimento | R$ 100 |
| **Total mensal** | **R$ 1.000** |

Os valores financeiros são estimativas ilustrativas e precisam ser validados por cotações. Os custos adicionais do aplicativo devem ser revisados para evitar duplicidade com os serviços já incluídos no piloto.

### Resumo financeiro estimado

Considerando os custos adicionais do aplicativo como valores separados dos custos mensais do piloto:

| Indicador | Valor |
|---|---:|
| Investimento inicial | R$ 13.000 |
| Custo mensal combinado | R$ 2.200 |
| **Custo estimado no primeiro ano** | **R$ 39.400** |

A estimativa considera o investimento inicial mais doze meses de custos mensais. Não representa um orçamento definitivo.

### Diferenciais

- Visualização centralizada dos pontos monitorados.
- Classificação das áreas por nível de risco.
- Acompanhamento de indicadores da vegetação.
- Registro de ocorrências.
- Apoio à priorização das equipes de manutenção.

### Impacto esperado

A solução poderá facilitar o acompanhamento da vegetação, melhorar a organização das ocorrências e apoiar ações preventivas. Os benefícios deverão ser avaliados em um piloto com dados reais.

## Evolução por sprint

### Sprint 1

- Levantamento de requisitos.
- Definição da persona.
- Criação do protótipo no Figma.

### Sprint 2

- Implementação das telas principais.
- Navegação entre telas.
- Dados simulados.
- Dashboard, Alertas e Detalhes da Vegetação.

### Sprint 3

- Validação do login.
- Cenários Success, Empty e Error.
- Confirmação e cancelamento de solicitações de equipe.
- Testes manuais dos principais fluxos.

### Sprint 4

- Cadastro, consulta e exclusão de ocorrências.
- Armazenamento local com AsyncStorage.
- Atualização das telas relacionadas.
- Geração e teste do APK Android.
- Consolidação da documentação e do plano de negócio.

## Próximas melhorias

- Integração com APIs e dados reais.
- Autenticação de usuários.
- Geolocalização real.
- Integração com sensores.
- Sincronização remota de ocorrências.
- Validação em aparelho Android físico.
- Testes com usuários da operação.

## Repositório GitHub

https://github.com/gipraieiro/smarttrack