# RPG Meet - UI Kit (Guia de Estilo)

## 1. Paleta de Cores

### Cores Primárias (Medieval Grimdark)

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Ouro Envelhecido** | #D4AF37 | 212, 175, 55 | Destaques, títulos, botões primários |
| **Preto Profundo** | #1A1A1A | 26, 26, 26 | Fundo principal, backgrounds |
| **Cinza Carvão** | #2F2F2F | 47, 47, 47 | Superfícies, cards, panels |
| **Branco Osso** | #F5F5DC | 245, 245, 220 | Texto primário, corpo |
| **Marrom Couro** | #6B4423 | 107, 68, 35 | Bordas, separadores, frames |
| **Marrom Pálido** | #9B8B7E | 155, 139, 126 | Texto secundário, muted |

### Cores Funcionais

| Nome | Hex | RGB | Uso |
|------|-----|-----|-----|
| **Verde Floresta** | #228B22 | 34, 139, 34 | Sucesso, confirmação, HP alto |
| **Vermelho Carmesim** | #8B0000 | 139, 0, 0 | Erro, alerta, HP baixo |
| **Amarelo Ouro** | #FFD700 | 255, 215, 0 | Aviso, atenção |
| **Azul Profundo** | #001F3F | 0, 31, 63 | Informação, secundário |

## 2. Tipografia

### Famílias de Fontes

| Tipo | Fonte | Peso | Uso |
|------|-------|------|-----|
| **Títulos** | Cinzel / Crimson Text | 700 (Bold) | Títulos de tela, nomes de personagem |
| **Subtítulos** | Cinzel / Crimson Text | 600 (SemiBold) | Cabeçalhos de seção |
| **Corpo** | Inter / Roboto | 400 (Regular) | Texto principal, descrições |
| **Pequeno** | Inter / Roboto | 400 (Regular) | Labels, hints, secundário |
| **Monoespacial** | Courier New / Monaco | 400 | Códigos, IDs de sala |

### Escalas de Tamanho

| Nível | Tamanho | Line Height | Uso |
|-------|---------|------------|-----|
| **H1** | 32px | 40px | Títulos principais |
| **H2** | 28px | 36px | Títulos de seção |
| **H3** | 24px | 32px | Subtítulos |
| **Body Large** | 18px | 28px | Texto principal |
| **Body** | 16px | 24px | Texto padrão |
| **Body Small** | 14px | 20px | Texto secundário |
| **Caption** | 12px | 16px | Labels, hints |

## 3. Componentes

### 3.1 Botões

#### MedievalButton - Primário
```
Cor Fundo: #D4AF37 (Ouro)
Cor Texto: #1A1A1A (Preto)
Borda: 2px #6B4423 (Marrom)
Padding: 12px 24px (medium)
Border Radius: 8px
Font: Bold 16px
Feedback: Scale 0.97 ao pressionar
```

#### MedievalButton - Secundário
```
Cor Fundo: #2F2F2F (Cinza)
Cor Texto: #F5F5DC (Branco)
Borda: 2px #6B4423 (Marrom)
Padding: 12px 24px (medium)
Border Radius: 8px
Font: SemiBold 16px
Feedback: Opacity 0.8 ao pressionar
```

#### MedievalButton - Perigo
```
Cor Fundo: #8B0000 (Vermelho)
Cor Texto: #F5F5DC (Branco)
Borda: 2px #8B0000 (Vermelho)
Padding: 12px 24px (medium)
Border Radius: 8px
Font: Bold 16px
Feedback: Scale 0.97 ao pressionar
```

### 3.2 Cards

#### MedievalCard - Default
```
Cor Fundo: #2F2F2F (Cinza)
Borda: 2px #6B4423 (Marrom)
Padding: 16px
Border Radius: 8px
Sombra: Nenhuma
Textura: Pergaminho (opcional)
```

#### MedievalCard - Elevated
```
Cor Fundo: #2F2F2F (Cinza)
Borda: 2px #6B4423 (Marrom)
Padding: 16px
Border Radius: 8px
Sombra: 0 4px 12px rgba(0,0,0,0.5)
Textura: Pergaminho (opcional)
```

#### MedievalCard - Outline
```
Cor Fundo: Transparente
Borda: 2px #6B4423 (Marrom)
Padding: 16px
Border Radius: 8px
Sombra: Nenhuma
```

### 3.3 Campos de Entrada

#### TextInput
```
Cor Fundo: #1A1A1A (Preto)
Cor Borda: #6B4423 (Marrom)
Cor Texto: #F5F5DC (Branco)
Borda: 1px
Padding: 12px
Border Radius: 6px
Font: 16px Regular
Placeholder Color: #9B8B7E (Marrom Pálido)
```

#### TextInput - Foco
```
Cor Borda: #D4AF37 (Ouro)
Borda: 2px
Sombra: 0 0 8px rgba(212,175,55,0.3)
```

### 3.4 Barras de Progresso

#### HP Bar
```
Cor Fundo: #1A1A1A (Preto)
Cor Preenchimento: #228B22 (Verde) → #8B0000 (Vermelho) gradual
Altura: 20px
Border Radius: 4px
Borda: 1px #6B4423 (Marrom)
```

#### Mana Bar
```
Cor Fundo: #1A1A1A (Preto)
Cor Preenchimento: #001F3F (Azul) → #D4AF37 (Ouro) gradual
Altura: 20px
Border Radius: 4px
Borda: 1px #6B4423 (Marrom)
```

### 3.5 Badges e Tags

#### Badge - Classe
```
Cor Fundo: #D4AF37 (Ouro)
Cor Texto: #1A1A1A (Preto)
Padding: 4px 12px
Border Radius: 12px
Font: Bold 12px
```

#### Badge - Status
```
Cor Fundo: #228B22 (Verde) / #8B0000 (Vermelho)
Cor Texto: #F5F5DC (Branco)
Padding: 4px 12px
Border Radius: 12px
Font: SemiBold 12px
```

### 3.6 Modais e Overlays

#### Modal Background
```
Cor: rgba(0, 0, 0, 0.7)
Animação: Fade-in 250ms
```

#### Modal Content
```
Cor Fundo: #2F2F2F (Cinza)
Borda: 2px #6B4423 (Marrom)
Padding: 24px
Border Radius: 12px
Sombra: 0 8px 24px rgba(0,0,0,0.8)
```

## 4. Ícones e Símbolos

### Ícones Medievais

| Ícone | Significado | Uso |
|-------|------------|-----|
| ⚔️ | Ataque / Combate | Ações de ataque |
| 🛡️ | Defesa / Armadura | HP, defesa |
| 🔥 | Magia / Fogo | Mana, magia |
| 🗝️ | Chave / Destreza | Ações furtivas |
| 📜 | Pergaminho / Conhecimento | Habilidades |
| 🎲 | Dados | Sistema de dados |
| 👑 | Mestre / Autoridade | Painel do mestre |
| 🔔 | Notificação / Alerta | Alertas |

### Tamanhos de Ícones

| Tamanho | Uso |
|--------|-----|
| 16px | Inline, labels |
| 24px | Botões, navegação |
| 32px | Destaques |
| 48px | Ícones principais |

## 5. Espaçamento

### Escala de Espaçamento

| Valor | Pixel | Uso |
|-------|-------|-----|
| xs | 4px | Espaçamento mínimo |
| sm | 8px | Espaçamento pequeno |
| md | 16px | Espaçamento padrão |
| lg | 24px | Espaçamento grande |
| xl | 32px | Espaçamento extra |
| 2xl | 48px | Espaçamento máximo |

### Padding Padrão

| Elemento | Padding |
|----------|---------|
| ScreenContainer | 16px (p-4) |
| Card | 16px (p-4) |
| Button | 12px 24px (py-3 px-6) |
| Input | 12px (p-3) |
| Section | 24px (gap-6) |

## 6. Animações

### Transições Padrão

| Tipo | Duração | Easing | Uso |
|------|---------|--------|-----|
| Fade | 250ms | ease-in-out | Aparecer/desaparecer |
| Slide | 300ms | ease-out | Deslizar de painéis |
| Scale | 150ms | ease-out | Feedback de botão |
| Rotate | 1-2s | ease-in-out | Rolagem de dados |

### Exemplos de Animação

#### Button Press
```
Scale: 0.97
Duration: 80ms
Easing: ease-out
```

#### Dice Roll
```
Rotate: 360deg × 5
Duration: 1500ms
Easing: ease-in-out
```

#### Modal Appear
```
Opacity: 0 → 1
Scale: 0.95 → 1
Duration: 250ms
Easing: ease-out
```

## 7. Estados de Componentes

### Botão

| Estado | Cor Fundo | Cor Texto | Opacity |
|--------|-----------|-----------|---------|
| Default | #D4AF37 | #1A1A1A | 1.0 |
| Hover | #E5C158 | #1A1A1A | 1.0 |
| Pressed | #C49B2F | #1A1A1A | 0.9 |
| Disabled | #6B4423 | #9B8B7E | 0.5 |

### Input

| Estado | Borda | Sombra |
|--------|-------|--------|
| Default | #6B4423 (1px) | Nenhuma |
| Focus | #D4AF37 (2px) | 0 0 8px rgba(212,175,55,0.3) |
| Error | #8B0000 (2px) | 0 0 8px rgba(139,0,0,0.3) |
| Disabled | #6B4423 (1px) | Nenhuma |

## 8. Responsividade

### Breakpoints

| Breakpoint | Largura | Uso |
|-----------|---------|-----|
| Mobile | 320px - 480px | Foco principal |
| Tablet | 480px - 768px | Layout adaptável |
| Desktop | 768px+ | Suporte opcional |

### Adaptações por Breakpoint

**Mobile (320px - 480px):**
- Padding: 16px
- Font Size: 14px - 18px
- Button Height: 44px mínimo
- Espaçamento: Reduzido

**Tablet (480px+):**
- Padding: 24px
- Font Size: 16px - 24px
- Layout: Mais espaçado
- Colunas: 2-3 colunas possível

## 9. Acessibilidade

### Contraste Mínimo
- Texto: 4.5:1 (WCAG AA)
- Componentes: 3:1 (WCAG AA)

### Tamanho Mínimo de Toque
- Botões: 44x44 pt
- Ícones: 24x24 pt
- Inputs: 44px altura

### Labels Descritivos
- Todos os inputs devem ter labels
- Ícones devem ter alt text
- Botões devem ter texto descritivo

## 10. Exemplos de Uso

### Exemplo 1: Card com Botão
```tsx
<MedievalCard variant="default">
  <Text className="text-2xl font-bold text-primary mb-4">
    Título
  </Text>
  <Text className="text-base text-muted mb-6">
    Descrição do conteúdo
  </Text>
  <MedievalButton
    title="Ação"
    variant="primary"
    size="medium"
    onPress={() => {}}
  />
</MedievalCard>
```

### Exemplo 2: HUD de Personagem
```tsx
<View className="bg-surface border-2 border-border rounded-lg p-4">
  <Text className="text-lg font-bold text-primary">
    {character.name}
  </Text>
  <Text className="text-sm text-muted mb-3">
    {character.class}
  </Text>
  
  {/* HP Bar */}
  <View className="mb-3">
    <Text className="text-xs text-muted mb-1">HP</Text>
    <View className="bg-background h-5 rounded border border-border overflow-hidden">
      <View
        className="bg-green-600 h-full"
        style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
      />
    </View>
  </View>
  
  {/* Mana Bar */}
  <View>
    <Text className="text-xs text-muted mb-1">Mana</Text>
    <View className="bg-background h-5 rounded border border-border overflow-hidden">
      <View
        className="bg-blue-900 h-full"
        style={{ width: `${(character.mana / character.maxMana) * 100}%` }}
      />
    </View>
  </View>
</View>
```

## 11. Checklist de Implementação

- [ ] Paleta de cores aplicada em theme.config.js
- [ ] Tipografia configurada em tailwind.config.js
- [ ] Componentes temáticos criados (Button, Card, Input)
- [ ] Ícones medievais mapeados
- [ ] Animações implementadas
- [ ] Estados de componentes testados
- [ ] Responsividade validada
- [ ] Acessibilidade verificada
- [ ] Documentação atualizada

## 12. Recursos Adicionais

- **Figma Design System**: (Link para Figma, se disponível)
- **Color Palette**: https://coolors.co/
- **Typography Scale**: https://type-scale.com/
- **Accessibility Checker**: https://webaim.org/contrast/check
