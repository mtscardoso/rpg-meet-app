# RPG Meet - TODO List

## Fase 1: Estrutura Base e Tema Visual
- [ ] Configurar tema medieval Grimdark em theme.config.js
- [ ] Criar componentes temáticos: MedievalButton, MedievalCard, MedievalText
- [ ] Implementar navegação com Expo Router (Lobby, CharacterSheet, VideoConference, MasterPanel)
- [ ] Configurar SafeArea e ScreenContainer para todas as telas
- [ ] Adicionar ícones medievais ao icon-symbol.tsx

## Fase 2: Tela de Lobby
- [ ] Criar tela Lobby com campos: Nome, ID da sala, Classe
- [ ] Implementar geração de ID único de sala
- [ ] Adicionar validação de campos
- [ ] Criar botões: "Entrar na Sessão", "Minhas Fichas"
- [ ] Salvar preferências localmente (AsyncStorage)

## Fase 3: Ficha de Personagem (Character Sheet)
- [ ] Criar tela CharacterSheet com campos: Nome, Classe, HP, Mana, Atributos
- [ ] Implementar barras visuais para HP e Mana
- [ ] Criar grid de atributos (STR, DEX, CON, INT, WIS, CHA)
- [ ] Adicionar seção de Habilidades e Equipamento
- [ ] Implementar modo edição (formulário)
- [ ] Salvar ficha localmente (AsyncStorage)

## Fase 4: Integração Jitsi Meet
- [ ] Instalar @jitsi/react-native-sdk
- [ ] Configurar permissões Android (AndroidManifest.xml)
- [ ] Configurar permissões iOS (Info.plist)
- [ ] Criar componente JitsiMeeting wrapper
- [ ] Implementar listeners de eventos (onConferenceJoined, onParticipantJoined, etc.)
- [ ] Testar integração básica

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
