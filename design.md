# RPG Meet - Design de Interface Mobile

## Visão Geral
RPG Meet é um aplicativo de videoconferência especializado em sessões de RPG de Mesa (TTRPG), com integração Jitsi Meet, sistema de rolagem de dados, HUD de personagem e painel do mestre. A interface segue estética medieval Grimdark com elementos de pergaminho, ferro batido e tipografia gótica.

## Orientação e Uso
- **Orientação**: Portrait (9:16) - uso com uma mão
- **Foco Visual**: Videoconferência como elemento central
- **Padrão iOS**: Seguir Apple Human Interface Guidelines (HIG)

## Telas Principais

### 1. Splash/Onboarding
- Logo do aplicativo (ícone medieval)
- Breve descrição: "Videoconferência para Mestres e Jogadores"
- Botão "Começar"
- Tema: Fundo escuro com efeito de pergaminho

### 2. Lobby (Entrada/Criação de Sala)
**Conteúdo Principal:**
- Campo de entrada: Nome do jogador
- Campo de entrada: ID da sala (ou botão "Gerar Nova Sala")
- Seletor: Classe do personagem (Guerreiro, Mago, Clérigo, Ladino, etc.)
- Botão primário: "Entrar na Sessão"
- Botão secundário: "Minhas Fichas" (histórico)

**Funcionalidade:**
- Validação de campos
- Geração de ID único de sala
- Salvamento local de preferências

### 3. Character Sheet (Ficha de Personagem)
**Conteúdo Principal:**
- Cabeçalho: Nome do personagem + Classe
- Seção de Atributos: HP (barra visual), Mana (barra visual)
- Grid de Atributos: STR, DEX, CON, INT, WIS, CHA (valores numéricos)
- Seção de Habilidades: Lista de ações/magia
- Seção de Equipamento: Armas, armaduras, itens
- Botão: "Editar Ficha" (abre formulário)
- Botão: "Confirmar e Iniciar Sessão"

**Hierarquia Visual:**
1. Nome/Classe (maior, destaque)
2. HP/Mana (barras visuais proeminentes)
3. Atributos (grid organizado)
4. Habilidades/Equipamento (secundário)

### 4. Video Conference (Tela Principal de Sessão)
**Layout:**
- **Topo**: Barra de status (nome da sala, tempo decorrido)
- **Centro**: Jitsi Meet (videoconferência)
- **Overlay Esquerdo**: Miniaturas de participantes com HUD
- **Overlay Direito**: Controles flutuantes (dados, mute, vídeo)
- **Fundo**: Painel de dados e trilha sonora (colapsável)

**Componentes:**
- **HUD de Participante**: Frame medieval ao redor de cada miniatura
  - Nome do personagem
  - Classe (ícone)
  - HP (barra pequena)
  - Mana (barra pequena)
- **Roller de Dados**: Botões para D4, D6, D8, D10, D12, D20
  - Resultado em overlay animado
  - Broadcast para todos os participantes
- **Controles de Chamada**: Mute áudio, Mute vídeo, Sair, Mais opções
- **Trilha Sonora**: Botões para play/pause, volume, seleção de faixa

### 5. Master Panel (Painel do Mestre)
**Conteúdo Principal:**
- **Controles de Participantes**: Lista com opções de mutar
- **Whisper**: Enviar mensagem privada para jogador específico
- **Trilha Sonora**: Controle de áudio ambiente
- **Efeitos Sonoros**: Botões para sons de ação (ataque, magia, etc.)
- **Anotações**: Bloco de notas para mestrado
- **Estatísticas**: Resumo de dados rolados, iniciativas

**Acesso:**
- Visível apenas para usuário com role = "master"
- Acessível via botão "Painel do Mestre" na tela de conferência

### 6. Settings/Configurações
- Tema (claro/escuro - padrão: escuro)
- Volume de áudio
- Qualidade de vídeo
- Notificações
- Sobre/Créditos

## Fluxos de Usuário Principais

### Fluxo 1: Jogador Entrando em Sessão
1. Splash → Lobby
2. Inserir nome + ID da sala + Classe
3. Character Sheet (editar ou usar padrão)
4. Video Conference (Jitsi + HUD)
5. Rolar dados, participar da sessão

### Fluxo 2: Mestre Criando Sessão
1. Splash → Lobby
2. Gerar Nova Sala (recebe ID único)
3. Inserir nome + Classe (Mestre)
4. Character Sheet (opcional)
5. Video Conference (aguarda jogadores)
6. Acessa Master Panel para controlar sessão

### Fluxo 3: Rolagem de Dados
1. Jogador toca em "Rolar Dados"
2. Seleciona tipo de dado (D20, D12, etc.)
3. Dado rola com animação
4. Resultado exibido em overlay grande
5. Broadcast automático para todos

## Estética e Tema

### Paleta de Cores
| Elemento | Cor | Hex |
|----------|-----|-----|
| Fundo Principal | Preto Profundo | #1A1A1A |
| Superfícies | Cinza Carvão | #2F2F2F |
| Texto Primário | Branco Osso | #F5F5DC |
| Texto Secundário | Ouro Envelhecido | #D4AF37 |
| Destaque/Alerta | Vermelho Carmesim | #8B0000 |
| Sucesso | Verde Floresta | #228B22 |
| Borda | Marrom Couro | #6B4423 |

### Tipografia
- **Títulos**: Cinzel, Crimson Text (serif gótica)
- **Corpo**: Inter, Roboto (legível em mobile)
- **Acentos**: Fontes rúnicas para ícones/símbolos

### Componentes Temáticos
- **Botões**: Bordas de ferro batido, fundo escuro com ouro
- **Cards**: Pergaminho com textura, sombra de profundidade
- **Barras**: Efeito de madeira ou metal enferrujado
- **Ícones**: Símbolos medievais (espada, escudo, poção, etc.)

### Animações (Discretas)
- Fade-in de elementos
- Slide suave de painéis
- Rotação de dados (1-2 segundos)
- Glow sutil em interações

## Componentes Reutilizáveis

### MedievalButton
- Estilo: Borda de ferro, fundo escuro, texto ouro
- Variantes: Primário, Secundário, Perigo
- Feedback: Escala 0.97 ao pressionar

### CharacterCard
- Exibe: Nome, Classe, HP, Mana
- Estilo: Pergaminho com borda medieval
- Interação: Toque para editar

### HUDFrame
- Borda medieval ao redor de miniatura de vídeo
- Exibe: Nome, Classe, HP, Mana em tempo real
- Atualização: Sincronizada via Socket.io

### DiceRoller
- Seletor de dado (D4-D20)
- Animação de rolagem
- Resultado em overlay grande

### MasterControl
- Botão para mutar participante
- Botão para enviar whisper
- Controle de trilha sonora

## Responsividade
- **Breakpoint Mobile**: 360px - 480px (foco)
- **Breakpoint Tablet**: 480px+ (layout adaptável)
- Layout: Sempre portrait, com suporte a landscape (opcional)

## Acessibilidade
- Contraste mínimo 4.5:1 para texto
- Tamanho mínimo de toque: 44x44 pt
- Suporte a leitores de tela (labels descritivos)
- Feedback háptico para ações críticas

## Próximos Passos
1. Implementar estrutura de navegação (Expo Router)
2. Criar componentes temáticos (buttons, cards)
3. Integrar Jitsi React Native SDK
4. Implementar Socket.io para sincronização
5. Gerar/integrar assets visuais medievais
