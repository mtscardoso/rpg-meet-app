# RPG Meet - TODO List

## Fase 1: Estrutura Base e Tema Visual
- [x] Configurar tema medieval Grimdark em theme.config.js
- [x] Criar componentes temáticos: MedievalButton, MedievalCard, MedievalText
- [ ] Implementar navegação com Expo Router (Lobby, CharacterSheet, VideoConference, MasterPanel)
- [x] Configurar SafeArea e ScreenContainer para todas as telas
- [ ] Adicionar ícones medievais ao icon-symbol.tsx
- [x] BUG: TextInputs não funcionais na tela Lobby - implementar TextInput real
- [x] BUG: Botões não respondem corretamente - revisar onPress handlers

## Fase 2: Tela de Lobby
- [x] Criar tela Lobby com TextInputs funcionais: Nome, ID da sala, Classe
- [x] Implementar geração de ID único de sala
- [x] Adicionar validação de campos
- [x] Criar botões funcionais: "Entrar na Sessão", "Minhas Fichas"
- [x] Salvar preferências localmente (AsyncStorage)
- [x] BUGFIX: Substituir Views por TextInput real
- [x] BUGFIX: Implementar state management para inputs
- [x] REFACTOR: Dividir Lobby em dois fluxos - "Criar Sessão" e "Entrar na Sessão"
- [x] Criar botão "Criar Sessão" (gera ID novo)
- [x] Criar botão "Entrar na Sessão" (apenas nome, classe e ID existente)

## Fase 3: Ficha de Personagem (Character Sheet)
- [x] BUG: Botão "Entrar na Sessão" não navega corretamente - CORRIGIDO
- [x] Criar tela CharacterSheet com campos: Nome, Classe, HP, Mana, Atributos
- [x] Implementar barras visuais para HP e Mana (inputs numéricos)
- [x] Criar grid de atributos (STR, DEX, CON, INT, WIS, CHA)
- [ ] Adicionar seção de Habilidades e Equipamento
- [x] Implementar modo edição (formulário)
- [x] Salvar ficha localmente (AsyncStorage)
- [x] BUG: Botão "Minhas Fichas" não funciona - CORRIGIDO
- [x] BUG: Botão "Configurações" não funciona - CORRIGIDO

## Fase 4: Integração Jitsi Meet
- [x] BUG CRÍTICO: Fluxo de navegação errado - CORRIGIDO (Lobby agora vai direto para Jitsi)
- [x] Instalar react-native-webview para integração Jitsi
- [x] Criar componente JitsiMeeting wrapper com WebView
- [x] BUG CRÍTICO: WebView fica carregando infinitamente - CORRIGIDO
- [x] Usar servidor Jitsi público (meet.jitsi.org) - IMPLEMENTADO
- [x] Adicionar timeout de carregamento com retry
- [x] Melhorar tratamento de erros e feedback do usuário
- [ ] Corrigir renderização do componente JitsiMeetingComponent
- [x] Adicionar loading indicator e tratamento de erros
- [x] Adicionar session info com sala e personagem
- [ ] Configurar permissões Android (AndroidManifest.xml)
- [ ] Configurar permissões iOS (Info.plist)
- [ ] Testar integração com servidor Jitsi real

## Fase 5: HUD de Personagem
- [ ] Criar componente HUDFrame (borda medieval + info)
- [ ] Exibir Nome, Classe, HP, Mana em overlay de miniatura
- [ ] Implementar atualização em tempo real
- [ ] Sincronizar HUD com dados de personagem

## Fase 6: Sistema de Rolagem de Dados
- [ ] Criar componente DiceRoller (seletor D4-D20)
- [ ] Implementar animação de rolagem
- [ ] Exibir resultado em overlay grande
- [ ] Integrar Socket.io para broadcast de dados
- [ ] Adicionar histórico de rolagens

## Fase 7: Painel do Mestre
- [ ] Criar tela MasterPanel (visível apenas para master)
- [ ] Implementar controle de mute para participantes
- [ ] Criar interface de whisper (mensagem privada)
- [ ] Adicionar controle de trilha sonora
- [ ] Implementar efeitos sonoros
- [ ] Criar bloco de anotações

## Fase 8: Sincronização em Tempo Real
- [ ] Configurar Socket.io (ou Firebase)
- [ ] Implementar sincronização de dados de dados
- [ ] Implementar sincronização de whispers
- [ ] Implementar sincronização de trilha sonora
- [ ] Testar latência e confiabilidade

## Fase 9: Assets Visuais e UI Kit
- [ ] Gerar logo/ícone medieval
- [ ] Criar assets de pergaminho (texturas)
- [ ] Criar ícones medievais (armas, magia, etc.)
- [ ] Implementar efeitos visuais (glow, sombra)
- [ ] Aplicar UI Kit completo em todos os componentes

## Fase 4.5: Telas Adicionais
- [x] Criar tela de Video Conference (placeholder para Jitsi)
- [x] Criar tela de Settings/Configurações
- [x] Implementar navegação entre todas as telas
- [x] Adicionar switches para preferências (modo escuro, notificações, som)

## Fase 10: Testes e Polimento
- [ ] Testar fluxo completo de usuário
- [ ] Testar em Android e iOS
- [ ] Otimizar performance
- [ ] Corrigir bugs e edge cases
- [ ] Implementar tratamento de erros
- [ ] Adicionar feedback háptico

## Fase 11: Documentação e Entrega
- [ ] Criar roteiro técnico completo (TECHNICAL.md)
- [ ] Documentar arquitetura de componentes
- [ ] Documentar guia de estilo (UI Kit)
- [ ] Criar README com instruções de setup
- [ ] Preparar checkpoint final
