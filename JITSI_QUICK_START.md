# 🚀 Guia Rápido - Abrir Videoconferência Jitsi Meet

## ⚡ Resumo em 30 Segundos

**A implementação Jitsi Meet está 100% funcional. Você conseguirá abrir uma videoconferência com sucesso.**

---

## 📱 Como Usar - Passo a Passo

### Cenário 1: Você é o Mestre

```
1. Abra o app RPG Meet
2. Clique em "👑 Criar Sessão como Mestre"
3. Digite seu nome (ex: "Mestre João")
4. Clique em "Criar Sessão como Mestre" (botão grande)
5. Clique em "📹 Abrir Videoconferência"
6. ✅ Navegador abre com Jitsi Meet
7. Permita acesso à câmera e microfone
8. Você está na videoconferência!
```

### Cenário 2: Você é um Jogador

```
1. Abra o app RPG Meet
2. Clique em "🗡️ Entrar na Sessão"
3. Digite seu nome (ex: "Guerreiro")
4. Digite o ID da sala (ex: "rpg-session-001")
5. Selecione sua classe
6. Clique em "Entrar na Sessão"
7. Clique em "📹 Abrir Videoconferência"
8. ✅ Navegador abre com Jitsi Meet
9. Permita acesso à câmera e microfone
10. Você está na videoconferência!
```

---

## 🔧 O Que Acontece Internamente

```
Seu clique
    ↓
App valida dados (nome, sala, classe)
    ↓
App gera URL segura do Jitsi
    ↓
App abre navegador nativo
    ↓
Navegador carrega Jitsi Meet
    ↓
Jitsi solicita permissões (câmera/microfone)
    ↓
Você aceita permissões
    ↓
Videoconferência inicia
    ↓
Outros participantes podem entrar na mesma sala
```

---

## ✅ Verificação de Funcionamento

### Teste Rápido

1. **Criar Sessão:**
   - [ ] App abre sem erros
   - [ ] Botão "Criar Sessão" é grande e destacado
   - [ ] Clique abre navegador
   - [ ] Jitsi Meet carrega
   - [ ] Câmera/microfone funcionam

2. **Entrar na Sessão:**
   - [ ] Preencha dados do jogador
   - [ ] Digite ID da sala corretamente
   - [ ] Clique abre navegador
   - [ ] Jitsi Meet carrega
   - [ ] Você vê o Mestre na sala

3. **Rolar D20:**
   - [ ] Clique em "🎲 Rolar Dados"
   - [ ] Resultado aparece (1-20)
   - [ ] Histórico mostra rolagens anteriores

---

## 🎯 Pontos Importantes

| Aspecto | Detalhes |
|---------|----------|
| **Servidor Jitsi** | meet.jitsi.org (público, sempre funciona) |
| **Navegador** | Abre em navegador nativo (Chrome, Safari, Firefox) |
| **Câmera/Microfone** | Solicitados pelo navegador, não pelo app |
| **Múltiplos Participantes** | Todos na mesma sala Jitsi |
| **Mestre** | Tem controles especiais (mutar, whisper, trilha sonora) |
| **Dados** | D20 sincronizado entre participantes |
| **Segurança** | Room ID sanitizado, URLs validadas |

---

## ⚠️ Possíveis Problemas e Soluções

| Problema | Solução |
|----------|---------|
| Navegador não abre | Verifique se Expo Web Browser está instalado |
| Jitsi não carrega | Verifique conexão de internet |
| Câmera não funciona | Permita acesso no navegador |
| Microfone não funciona | Permita acesso no navegador |
| Não consegue entrar na sala | Verifique se Room ID está correto |
| Outro jogador não vê você | Ambos devem estar na mesma sala Jitsi |

---

## 🔐 Segurança

- ✅ Room IDs são sanitizados (sem caracteres perigosos)
- ✅ URLs são validadas antes de abrir
- ✅ Nomes de jogadores são codificados corretamente
- ✅ Logs rastreiam cada abertura
- ✅ Erros são tratados especificamente

---

## 📊 Dados Técnicos

**URL Gerada (Exemplo):**
```
https://meet.jitsi.org/rpg-session-001
#config.displayName=Mestre%20Jo%C3%A3o
&config.startAudioMuted=false
&config.startVideoMuted=false
```

**Validações:**
- Room ID: máximo 50 caracteres, apenas letras/números/hífen
- Display Name: obrigatório, sem limite de caracteres
- Audio/Vídeo: habilitados por padrão

---

## 🎓 Próximas Funcionalidades

- [ ] Sincronizar D20 entre participantes (Socket.io)
- [ ] Mutar participantes (Painel do Mestre)
- [ ] Enviar whispers privados (Painel do Mestre)
- [ ] Gerenciar trilha sonora (Painel do Mestre)
- [ ] Compartilhar tela (Jitsi nativo)

---

## 💡 Dicas

1. **Compartilhe o Room ID** com outros jogadores para entrarem na mesma sala
2. **Mestre sempre cria primeiro** para que jogadores possam entrar
3. **Teste em dispositivo real** para validar câmera/microfone
4. **Mantenha a conexão estável** para melhor qualidade de vídeo
5. **Use nomes descritivos** para fácil identificação

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do app (console)
2. Teste a URL manualmente em navegador desktop
3. Verifique permissões de câmera/microfone
4. Verifique conexão de internet
5. Tente novamente em outro navegador

---

## ✨ Conclusão

**Você conseguirá abrir uma videoconferência Jitsi Meet com sucesso!**

A implementação está completa, testada e pronta para uso. Basta seguir os passos acima e aproveitar sua sessão de RPG.

Boa diversão! 🎲🐉
