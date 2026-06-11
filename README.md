# SMARTTRACK

## Integrantes

* Gabrielly Souza Lorentz — RM: 565806
* Giovanna Praieiro Pavani — RM: 565681
* Heitor Fernandes Barbosa — RM: 563078
* Julia Aparicio de Souza — RM: 563623
* Maria Eduarda de Oliveira — RM: 565386
* Nicole Calasans Rosanti — RM: 564381

---

## Sobre o Projeto

O SMARTTRACK é uma solução mobile desenvolvida para auxiliar no monitoramento inteligente da vegetação em rodovias concedidas pela CCR Motiva.

A aplicação tem como objetivo identificar áreas críticas com crescimento excessivo de vegetação, permitindo o acompanhamento em tempo real das condições da rodovia e auxiliando equipes operacionais na tomada de decisão.

---

## Problema Proposto pela Motiva

O crescimento descontrolado da vegetação em áreas próximas às rodovias pode causar:

* Redução da visibilidade;
* Riscos operacionais;
* Dificuldades de manutenção;
* Aumento da possibilidade de acidentes;
* Impactos na conservação da rodovia.

Atualmente, grande parte desse monitoramento depende de inspeções manuais, tornando o processo mais lento e menos eficiente.

---

## Persona

### Marcelo — Supervisor Operacional

**Idade:** 42 anos

**Cargo:** Supervisor de conservação rodoviária

**Objetivo:**

* Monitorar áreas críticas da rodovia;
* Identificar riscos relacionados à vegetação;
* Otimizar o acionamento das equipes operacionais.

**Principais dificuldades:**

* Monitoramento manual ineficiente;
* Dificuldade na visualização rápida de ocorrências;
* Falta de centralização das informações.

---

## Requisitos Funcionais

* RF01 – Permitir login de usuários;
* RF02 – Exibir dashboard com indicadores de monitoramento;
* RF03 – Apresentar áreas críticas identificadas na rodovia;
* RF04 – Permitir visualização de alertas operacionais;
* RF05 – Permitir visualizar detalhes da vegetação monitorada;
* RF06 – Exibir status das áreas monitoradas;
* RF07 – Permitir navegação entre as telas do aplicativo.

---

## Requisitos Não Funcionais

* RNF01 – Interface responsiva e intuitiva;
* RNF02 – Navegação simples e objetiva;
* RNF03 – Identidade visual consistente;
* RNF04 – Possibilidade de futura integração com geolocalização;
* RNF05 – Desenvolvimento utilizando React Native.

---

## Funcionalidades Implementadas na Sprint 2

### Login

Tela inicial de acesso ao sistema.

### Dashboard

Exibição dos indicadores principais:

* Áreas críticas;
* Áreas em alerta;
* Áreas monitoradas.

Além disso, apresenta um mapa representando os trechos monitorados da rodovia.

### Alertas

Lista de ocorrências identificadas com diferentes níveis de risco:

* Alto;
* Médio;
* Baixo.

### Detalhes da Vegetação

Apresenta informações detalhadas sobre cada ocorrência:

* Localização;
* Nível de risco;
* Temperatura;
* Umidade;
* Status da vegetação;
* Imagem representativa da situação encontrada.

### Acionamento de Equipe

Ocorrências classificadas como Alto ou Médio risco permitem o acionamento de uma equipe de manutenção.

---

## Estrutura dos Dados Mockados

Nesta Sprint foi utilizada uma camada de dados mockados para simular futuras integrações com APIs reais.

Os dados simulam:

* Trechos da rodovia;
* Níveis de risco da vegetação;
* Temperatura;
* Umidade;
* Status operacional das áreas monitoradas.

Os dados são armazenados localmente através do arquivo:

```text
src/data/mockData.ts
```

---

## Tecnologias Utilizadas

### Desenvolvimento

* React Native
* Expo
* TypeScript

### Navegação

* React Navigation

### Interface

* Material Icons

### Prototipação

* Figma

---

## Protótipo Desenvolvido na Sprint 1

Figma:

https://www.figma.com/design/uiT7Sx1GymCKe3wxQIi0LM/smarttrack?node-id=0-1&t=16lK5cTkyCKeFN1Q-1

---

## Como Executar o Projeto

### Instalar dependências

```bash
npm install
```

### Executar o projeto

```bash
npx expo start
```

### Executar no celular

* Instalar o aplicativo Expo Go;
* Escanear o QR Code gerado pelo Expo.

---

## Evolução do Projeto

### Sprint 1

* Levantamento de requisitos;
* Definição da persona;
* Criação do protótipo navegável no Figma.

### Sprint 2

* Desenvolvimento do aplicativo funcional;
* Implementação da navegação entre telas;
* Utilização de dados mockados;
* Implementação do fluxo de monitoramento;
* Acionamento de equipes de manutenção;
* Inclusão de imagens representativas da vegetação.

---

## Repositório

https://github.com/gipraieiro/smarttrack