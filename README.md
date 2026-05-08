# CurrículoPronto

Uma ferramenta moderna e intuitiva para criação de currículos profissionais em tempo real. Este projeto permite que usuários construam, personalizem e exportem seus currículos para PDF com um layout limpo e otimizado para sistemas de recrutamento.

## 🚀 Funcionalidades

- **Edição em Tempo Real:** Veja as alterações no seu currículo instantaneamente enquanto preenche os dados.
- **Upload e Recorte de Foto:** Adicione sua foto profissional com uma ferramenta de corte integrada para o ajuste perfeito.
- **Download em PDF:** Gere um arquivo PDF profissional com um clique, utilizando a biblioteca `@react-pdf/renderer` para máxima precisão.
- **Design Responsivo:** Interface otimizada para desktops e dispositivos móveis.
- **Seções Completas:**
  - Informações Pessoais e Contato
  - Objetivo Profissional
  - Experiência Profissional
  - Formação Acadêmica
  - Habilidades e Competências
  - Formação Complementar

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca principal para a interface do usuário.
- **TypeScript**: Garantia de tipagem e código mais seguro.
- **Tailwind CSS**: Estilização moderna e rápida.
- **@react-pdf/renderer**: Motor de renderização para geração de PDFs de alta fidelidade.
- **Motion (motion/react)**: Animações suaves e interações fluidas.
- **Lucide React**: Conjunto de ícones consistentes e profissionais.
- **react-easy-crop**: Interface amigável para ajuste de fotografias.
- **File-Saver**: Utilitário para gerenciamento de downloads no navegador.

## 📦 Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em `http://localhost:3000`.

## 📄 Estrutura do Projeto

- `src/components/`: Componentes reutilizáveis (Formulário, Preview, PDF).
- `src/types.ts`: Definições de tipos TypeScript para os dados do currículo.
- `src/App.tsx`: Componente principal que gerencia o estado e a lógica de download.
- `src/index.css`: Configurações globais de estilo e Tailwind.

---
Desenvolvido com foco em praticidade e elegância para ajudar profissionais a alcançarem suas próximas oportunidades.
