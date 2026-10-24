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
- RF01 — Permitir login de usuários;
- RF02 — Exibir dashboard com indicadores de monitoramento;
- RF03 — Apresentar áreas críticas identificadas na rodovia;
- RF04 — Permitir visualização de alertas operacionais;
- RF05 — Permitir visualizar detalhes da vegetação monitorada;
- RF06 — Exibir status das áreas monitoradas;
- RF07 — Permitir navegação entre as telas do aplicativo.
---
## Requisitos Não Funcionais
- RNF01 — Interface responsiva e intuitiva;
- RNF02 — Navegação simples e objetiva;
- RNF03 — Identidade visual consistente;
- RNF04 — Possibilidade de futura integração com geolocalização;
- RNF05 — Desenvolvimento utilizando React Native.
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
## Registro de Novas Ocorrências — Sprint 4
Na Sprint 4, foi implementada a funcionalidade de registro de novas ocorrências.
A tela de cadastro permite preencher as informações da ocorrência, incluindo localização, dados ambientais e descrição.
### Funcionalidades implementadas
- Cadastro de uma nova ocorrência;
- Armazenamento local das ocorrências;
- Exibição das ocorrências cadastradas nas telas relacionadas;
- Consulta aos detalhes da ocorrência;
- Exclusão de ocorrências registradas.
As ocorrências cadastradas também são consideradas no fluxo de atualização do Dashboard e da lista de Alertas.
### Persistência local
As novas ocorrências são armazenadas localmente utilizando AsyncStorage, por meio da chave `@smarttrack/new-occurrences`.
Essa implementação permite manter os registros no armazenamento local do aplicativo. Não representa sincronização com um servidor ou banco de dados remoto.
---
# Estados e Cenários Mockados
Foram implementados diferentes estados para representar situações que podem ocorrer durante o carregamento dos dados.
Os cenários estão organizados no arquivo `src/data/mockScenarios.ts`.
### Success
Representa o funcionamento normal da aplicação.
Os dados mockados são carregados e os sete pontos monitorados são exibidos.
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
Os cenários de sucesso, lista vazia e erro podem ser testados diretamente na tela de Alertas, por meio do seletor de cenário disponível na interface.
Não é necessário alterar o código-fonte para alternar entre os cenários.
## Testar o cenário Success
1. Acesse a tela de Alertas;
2. Selecione o cenário de sucesso;
3. Verifique se os sete pontos monitorados são exibidos.
## Testar o cenário Empty
1. Acesse a tela de Alertas;
2. Utilize o seletor de cenário disponível na tela;
3. Selecione o cenário de lista vazia;
4. Verifique a mensagem apresentada e o botão **Atualizar**;
5. Selecione **Atualizar** para retornar ao cenário de sucesso.
## Testar o cenário Error
1. Acesse a tela de Alertas;
2. Utilize o seletor de cenário disponível na tela;
3. Selecione o cenário de erro;
4. Verifique a mensagem de erro e o botão **Tentar novamente**;
5. Selecione **Tentar novamente** para retornar ao cenário de sucesso.
Esses cenários permitem demonstrar os estados alternativos da aplicação sem precisar modificar temporariamente o código.
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
O projeto utiliza uma camada de dados mockados para simular futuras integrações com APIs reais.
Os dados simulam:
- Trechos da rodovia;
- Níveis de risco da vegetação;
- Altura da vegetação;
- Temperatura;
- Umidade;
- Tendência de crescimento;
- Status operacional das áreas monitoradas.
Os dados principais são armazenados localmente por meio do arquivo `src/data/mockData.ts`.
Os cenários de sucesso, lista vazia e erro são organizados em `src/data/mockScenarios.ts`.
As novas ocorrências registradas são armazenadas localmente utilizando AsyncStorage.
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
| Acionamento de equipe no protótipo | Concluído |
| Confirmação da solicitação | Concluído |
| Cancelamento da solicitação | Concluído |
| Cenário de sucesso | Concluído |
| Cenário de lista vazia | Concluído |
| Cenário de erro | Concluído |
| Recuperação após erro | Concluído |
| Seletor de cenários na tela de Alertas | Concluído |
| Cadastro de novas ocorrências | Implementado |
| Armazenamento local de ocorrências | Implementado |
| Visualização dos detalhes de ocorrência | Implementado |
| Exclusão de ocorrências | Implementado |
| Atualização do Dashboard e Alertas pelas novas ocorrências | Implementada |
| Geração do APK Android | Concluída |
| Instalação e inicialização no emulador Pixel 8 | Concluídas |
| Integração com API real | Pendente |
| Autenticação real | Pendente |
| Geolocalização real | Pendente |
| Sincronização remota das ocorrências | Pendente |
---
# Testes Manuais — Sprint 3
Foram realizados testes manuais dos principais fluxos da aplicação.
| # | Cenário | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| 1 | Login com e-mail e senha | Permitir acesso ao Dashboard | Dashboard foi exibido | Aprovado |
| 2 | Login sem preenchimento | Impedir acesso e informar os campos obrigatórios | Acesso bloqueado e mensagem exibida | Aprovado |
| 3 | Alertas com dados | Exibir os pontos monitorados | Sete pontos exibidos | Aprovado |
| 4 | Lista de alertas vazia | Exibir estado vazio e permitir atualização | Estado vazio exibido e atualização retornou os sete pontos | Aprovado |
| 5 | Erro no carregamento | Exibir erro e permitir nova tentativa | Erro exibido e nova tentativa retornou os sete pontos | Aprovado |
| 6 | Solicitação de equipe | Solicitar confirmação antes do registro | Confirmação exibida e solicitação registrada após confirmação | Aprovado |
| 7 | Cancelamento da solicitação | Não registrar solicitação e retornar à ação inicial | Solicitação cancelada e botão retornou | Aprovado |
| 8 | Área de baixo risco | Não disponibilizar solicitação de equipe | Área exibida sem botão de solicitação | Aprovado |
| 9 | Navegação geral | Permitir navegação entre os principais fluxos | Navegação realizada sem erros | Aprovado |
---
# Testes Manuais — Sprint 4
Os testes abaixo devem ser executados na versão atual do aplicativo. Os resultados devem ser preenchidos conforme a execução; não devem ser marcados como aprovados antes de serem realizados.
#	Cenário	Resultado esperado	Resultado obtido	Status
1	Cadastro de nova ocorrência	Salvar uma ocorrência preenchida e exibi-la nas telas relacionadas	Preencher após executar o teste	Pendente de validação
2	Consulta de ocorrência	Abrir uma ocorrência cadastrada e visualizar seus detalhes	Preencher após executar o teste	Pendente de validação
3	Exclusão de ocorrência	Excluir a ocorrência selecionada e removê-la das listas relacionadas	Preencher após executar o teste	Pendente de validação
4	Persistência após reabrir o app	Fechar e abrir novamente o aplicativo e verificar se a ocorrência continua armazenada	Preencher após executar o teste	Pendente de validação


Observação: as ocorrências utilizam AsyncStorage no próprio dispositivo. Esse teste verifica a persistência local no dispositivo e não representa sincronização com um servidor remoto.
---
# Testes do APK — Sprint 4
Foi gerado um APK Android utilizando o Expo EAS Build.
O aplicativo foi baixado, instalado e iniciado no emulador Android Pixel 8.
### Resultado da validação
- Build concluído com sucesso;
- APK gerado no formato instalável;
- Download do artefato concluído;
- Instalação no emulador concluída;
- Aplicativo iniciado com sucesso;
- Funcionamento geral confirmado durante a validação realizada.
### Link do build
[**Acessar o build do SMARTTRACK no Expo**](https://expo.dev/accounts/gipraieiro/projects/smarttrack-mobile/builds/fc830272-e950-44ed-afc1-dce24c225ccd)
O link direciona para a página do build no Expo, e não deve ser considerado um link direto de download até que o acesso seja verificado. Antes da entrega, abra o link em uma sessão sem autenticação e confirme se o professor consegue baixar o APK. Se o download exigir login ou permissões da conta Expo, disponibilize o arquivo APK por um serviço de compartilhamento acessível e substitua o link nesta documentação pelo link de download validado. Não informe que o acesso externo foi confirmado até realizar esse teste.
---
# Resultado dos Testes
Os principais fluxos da aplicação foram validados manualmente, incluindo navegação, exibição dos pontos monitorados, cenários alternativos e recuperação após erro.
Na Sprint 4, também foi confirmada a geração, instalação e inicialização do APK no emulador Android Pixel 8.
A validação realizada confirma o funcionamento observado no emulador Android Pixel 8. Até o momento, não foi registrada uma validação em aparelho físico; esse teste permanece recomendado antes da entrega final.
---
# Tecnologias Utilizadas
## Desenvolvimento
- React Native;
- Expo;
- TypeScript.
## Navegação
- React Navigation.
## Armazenamento local
- AsyncStorage.
## Interface
- Expo Vector Icons / Ionicons.
## Build Android
- Expo EAS Build;
- EAS CLI.
## Prototipação
- Figma.
---
# Protótipo Desenvolvido na Sprint 1
Figma:
https://www.figma.com/design/uiT7Sx1GymCKe3wxQIi0LM/smarttrack?node-id=0-1&t=16lK5cTkyCKeFN1Q-1
---
# Como Executar o Projeto
## Instalar dependências
```bash
npm install
```
## Executar o projeto
```bash
npx expo start
```
## Executar no celular durante o desenvolvimento
- Instalar o aplicativo Expo Go, quando compatível com a versão do projeto;
- Executar o projeto;
- Escanear o QR Code gerado pelo Expo.
Para testar a versão final compilada, utilize o APK disponibilizado na seção de download.
---
# APK Android — Sprint 4
## Informações do build
- Plataforma: Android;
- Ferramenta: Expo EAS Build;
- Perfil de compilação: `preview`;
- Formato do artefato: APK;
- Identificador Android: `com.smarttrack.mobile`;
- Distribuição: interna, para instalação e teste.
## Download
[Acessar o APK do SMARTTRACK no Expo](https://expo.dev/accounts/gipraieiro/projects/smarttrack-mobile/builds/fc830272-e950-44ed-afc1-dce24c225ccd)
## Instruções de instalação
1. Abra o link do build em um dispositivo Android;
2. Acesse a opção para baixar o APK;
3. Abra o arquivo baixado;
4. Se necessário, autorize a instalação de aplicativos dessa origem nas configurações do Android;
5. Conclua a instalação e abra o SMARTTRACK.
O arquivo APK não é armazenado diretamente no repositório GitHub. A página do build do Expo é a referência atual, mas o acesso de download por pessoas externas precisa ser confirmado. Antes da entrega, teste o link sem estar autenticado na conta Expo. Caso o APK não possa ser baixado livremente, publique-o em um serviço de compartilhamento com acesso para o professor e atualize o link nesta seção.
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
## Sprint 4
- Implementação do cadastro de novas ocorrências;
- Armazenamento local das ocorrências com AsyncStorage;
- Exibição das ocorrências nas telas relacionadas;
- Consulta aos detalhes e exclusão das ocorrências;
- Configuração do projeto no Expo EAS Build;
- Criação e vinculação do projeto EAS;
- Configuração do perfil `preview` para geração do APK;
- Geração do APK Android;
- Instalação e inicialização do aplicativo no emulador Pixel 8;
- Atualização da documentação do projeto.
---
# Pendências
As seguintes funcionalidades permanecem como possibilidades de evolução do projeto:
- Integração com API real;
- Autenticação real de usuários;
- Integração com geolocalização;
- Recebimento de dados reais dos sensores;
- Sincronização remota das ocorrências;
- Atualização automática dos dados;
- Evolução dos indicadores de monitoramento;
- Integração com infraestrutura de monitoramento da rodovia;
- Teste de instalação e funcionamento em aparelho Android físico;
- Confirmação de acesso externo ao link de download do APK.
---
# Plano de Negócio — Sprint 4
### 1. Proposta de Valor
O SmartTrack é um aplicativo desenvolvido para apoiar a Motiva no monitoramento da vegetação ao longo das rodovias. A solução permite acompanhar indicadores como altura da vegetação, tendência de crescimento, temperatura, umidade e nível de risco, facilitando a identificação de áreas que precisam de atenção.
O objetivo é auxiliar as equipes operacionais a priorizar manutenções, organizar ocorrências e tomar decisões com base nas informações disponíveis, contribuindo para uma gestão mais eficiente e preventiva da vegetação rodoviária.
Atualmente, o SmartTrack é um protótipo funcional que utiliza dados simulados. A implantação em ambiente real dependerá da integração com fontes de dados operacionais e, caso seja adotado o monitoramento automatizado, de equipamentos instalados nos pontos monitorados.
### 2. Público-Alvo
O público-alvo do SmartTrack são concessionárias de rodovias, especialmente a Motiva, além de gestores operacionais, supervisores de manutenção e equipes responsáveis pela conservação e segurança das vias.
A persona principal do projeto é Marcelo, de 42 anos, supervisor operacional que precisa acompanhar as condições da rodovia, identificar pontos de risco e direcionar equipes de manutenção. O aplicativo busca facilitar esse trabalho ao reunir alertas, indicadores e registros de ocorrências em uma única interface.
### 3. Modelo de Receita
Como estratégia comercial futura, o SmartTrack poderá ser oferecido por meio de contratos corporativos ou assinaturas para concessionárias de rodovias.
O modelo poderá considerar a quantidade de trechos monitorados, o número de usuários e os recursos contratados. Também poderão ser oferecidos serviços de implantação, integração com sistemas existentes, treinamento e suporte técnico.
A definição do preço de venda dependerá de pesquisas de mercado, validação com potenciais clientes e levantamento dos custos efetivos de operação. Nesta etapa, não há receita comercial comprovada nem preço de venda definido.
### 4. Investimento Inicial: Piloto com 10 Pontos de Monitoramento
Para simular a implantação do SmartTrack em uma operação real, foi considerado um piloto com 10 pontos de monitoramento, utilizando os valores estimados apresentados no projeto.
| Item | Custo estimado |
|---|---:|
| Dispositivos de monitoramento (10 × R$ 400) | R$ 4.000 |
| Receptor LoRa | R$ 1.500 |
| Instalação (10 × R$ 150) | R$ 1.500 |
| Implantação e treinamento | R$ 6.000 |
| **Total do investimento inicial** | **R$ 13.000** |
Esse investimento corresponde à simulação de uma estrutura física de monitoramento. Os valores ainda precisam ser validados por cotações de fornecedores.
### 5. Custos Operacionais Mensais do Piloto
Além do investimento inicial, o piloto prevê despesas recorrentes para manter a infraestrutura de monitoramento em funcionamento.
| Item | Custo mensal estimado |
|---|---:|
| Nuvem e banco de dados | R$ 300 |
| Manutenção e suporte (10 × R$ 50) | R$ 500 |
| Licença do aplicativo | R$ 400 |
| **Total mensal do piloto** | **R$ 1.200** |
Esses valores representam a simulação apresentada para o piloto com 10 pontos. A parcela de licença do aplicativo é uma hipótese de custo mensal para o cenário proposto, e não um preço já praticado pelo SmartTrack.
### 6. Simulação dos Custos Específicos do Aplicativo
O desenvolvimento do protótipo foi realizado pela equipe acadêmica. Portanto, o custo de desenvolvimento já executado não representa necessariamente uma despesa financeira paga pela equipe, embora o trabalho tenha valor econômico.
Para uma futura operação comercial, é importante considerar os custos de manutenção e evolução do software, mesmo que o aplicativo possa ser executado sem uma infraestrutura complexa em sua versão atual.
Como hipótese de planejamento, os custos específicos do aplicativo poderiam ser estimados da seguinte forma:
| Item | Estimativa mensal |
|---|---:|
| Manutenção corretiva e pequenas melhorias | R$ 600 |
| Suporte técnico aos usuários | R$ 300 |
| Serviços e ferramentas de desenvolvimento | R$ 100 |
| **Total estimado para manutenção do app** | **R$ 1.000/mês** |
Esses valores são estimativas ilustrativas para planejamento, não cotações de mercado. O custo real dependerá da quantidade de usuários, da frequência de atualizações, do nível de suporte e da estrutura da equipe responsável.
A hospedagem e o banco de dados não foram somados novamente nessa simulação, pois já aparecem na tabela de custos mensais do piloto. Da mesma forma, o valor de R$ 400 previsto como licença do aplicativo no piloto não foi tratado como custo adicional nesta composição, pois pode representar uma cobrança comercial pelo uso do software, e não necessariamente uma despesa operacional do fornecedor.
A geração de APK pelo Expo EAS Build também pode ter custos conforme o plano e o volume de utilização. Como o aplicativo já foi compilado e instalado para testes, não foi atribuído um valor fixo a esse serviço nesta simulação.
### 7. Resumo Financeiro do Cenário Simulado
Para evitar a duplicidade de despesas, o resumo abaixo considera o investimento físico inicial do piloto e os custos recorrentes apresentados na simulação original, acrescentando a estimativa de manutenção do aplicativo como um cenário alternativo.
| Indicador | Valor |
|---|---:|
| Investimento inicial do piloto | R$ 13.000 |
| Custos mensais do piloto, conforme a simulação original | R$ 1.200 |
| Estimativa mensal de manutenção específica do app | R$ 1.000 |
| **Custo mensal combinado, caso a manutenção do app seja adicional** | **R$ 2.200** |
| **Desembolso estimado no primeiro ano, incluindo o investimento inicial** | **R$ 39.400** |
O valor de R$ 39.400 considera R$ 13.000 de investimento inicial e 12 meses de despesas recorrentes de R$ 2.200. Esse é um cenário ilustrativo em que os R$ 1.000 mensais estimados para manutenção específica do aplicativo são adicionais aos R$ 1.200 mensais do piloto. Como a rubrica de R$ 500 de manutenção e suporte do piloto pode incluir parte dessas atividades, os valores precisam ser confirmados para evitar dupla contagem.
Para deixar essa diferença transparente, há dois cenários possíveis:
- Cenário A — despesas separadas: R$ 2.200 por mês e R$ 39.400 no primeiro ano, incluindo o investimento inicial de R$ 13.000.
- Cenário B — manutenção do aplicativo já incluída no suporte do piloto: R$ 1.200 por mês e R$ 27.400 no primeiro ano, incluindo o investimento inicial de R$ 13.000.
Os dois cenários são simulações, não cotações nem custos efetivamente medidos. A composição final deverá ser definida após esclarecer o que está incluído na manutenção e no suporte do piloto.
### 8. Diferenciais Competitivos
O SmartTrack reúne funcionalidades voltadas ao acompanhamento da vegetação e à organização das ações operacionais:
- Visualização dos pontos monitorados e de seus indicadores.
- Acompanhamento da altura da vegetação e da tendência de crescimento.
- Classificação das áreas por nível de risco.
- Visualização de alertas e identificação de situações prioritárias.
- Solicitação de equipes de manutenção conforme as regras de risco do sistema.
- Registro e acompanhamento de novas ocorrências.
Esses recursos buscam centralizar informações e facilitar a priorização das atividades de conservação rodoviária.
### 9. Impacto Esperado para a Motiva
A implantação do SmartTrack poderá contribuir para melhorar a organização das informações sobre a vegetação, facilitar a identificação de trechos prioritários e apoiar o planejamento das equipes de manutenção.
Com o uso de dados reais, a solução poderá ajudar a identificar situações que exigem atenção, melhorar o acompanhamento das ocorrências e favorecer uma atuação preventiva.
Os resultados financeiros e operacionais ainda precisam ser validados. Um piloto permitiria avaliar indicadores como tempo de identificação de ocorrências, tempo de resposta, utilização das equipes e custos de manutenção, verificando se os benefícios obtidos justificam o investimento.
### 10. Viabilidade e Próximos Passos
O SmartTrack encontra-se na etapa de protótipo funcional, com dados simulados e funcionalidades demonstráveis. Para avançar em direção a uma implantação real, será necessário integrar fontes confiáveis de dados, validar os indicadores de risco com a operação, testar o sistema com usuários da Motiva e confirmar os custos dos equipamentos e serviços.
Também será necessário definir a infraestrutura tecnológica, o modelo de suporte e a estratégia comercial. Com essas informações, será possível avaliar a viabilidade econômica da solução e estabelecer um preço de contratação compatível com os custos e com o valor entregue ao cliente.
Assim, o SmartTrack apresenta potencial para apoiar a gestão da vegetação rodoviária, mas sua viabilidade comercial deverá ser confirmada por meio de testes em campo, cotações e avaliação dos resultados do piloto.
---
# Repositório
https://github.com/gipraieiro/smarttrack