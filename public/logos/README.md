# INOVE.AI Dev - Logos

Esta pasta contém os logos do INOVE.AI Dev MVP.

## 📁 Arquivos Atuais

- `inove-ai-logo.svg` - Logo placeholder atual (SVG)

## 🎨 Como Adicionar Sua Logo Real

### Opção 1: Substituir o arquivo SVG (Recomendado)

1. Exporte sua logo em formato **SVG** (vetor)
2. Renomeie o arquivo para `inove-ai-logo.svg`
3. Substitua o arquivo existente em `public/logos/inove-ai-logo.svg`
4. Reinicie o servidor de desenvolvimento

### Opção 2: Usar PNG/JPG

1. Exporte sua logo em **PNG** (transparente) ou **JPG**
2. Coloque o arquivo em `public/logos/`
3. Atualize o componente `Logo.tsx`:

```tsx
// src/components/common/Logo.tsx
// Linha 53 - Altere de:
<img
  src="/logos/inove-ai-logo.svg"
  ...
/>

// Para:
<img
  src="/logos/inove-ai-logo.png"  // ou .jpg
  ...
/>
```

### Opção 3: Usar múltiplas versões

Para ter versões diferentes (light/dark mode, favicon, etc.):

1. Adicione os arquivos:
   - `inove-ai-logo-light.svg` - Versão para modo claro
   - `inove-ai-logo-dark.svg` - Versão para modo escuro
   - `inove-ai-favicon.png` - Para favicon (32x32 ou 64x64)

2. Atualize o componente `Logo.tsx` para usar a versão correta

## 📐 Especificações Recomendadas

### Para SVG:
- **Formato**: SVG (vetor)
- **Dimensões**: Escalável (o SVG se adapta)
- **Cores**: Use gradientes ou cores sólidas
- **Transparência**: Fundo transparente

### Para PNG:
- **Dimensões**: 512x512px ou 1024x1024px
- **Formato**: PNG com transparência
- **Qualidade**: Alta resolução para evitar pixelização
- **Fundo**: Transparente

### Para Favicon:
- **Dimensões**: 32x32px, 64x64px, ou 128x128px
- **Formato**: PNG ou ICO
- **Localização**: `public/favicon.ico`

## 🎯 Onde a Logo Aparece

A logo é usada automaticamente em:

1. **Header** (topo da página)
   - Tamanho: Médio (32x32px)
   - Com texto "INOVE.AI dev"
   - Link para dashboard

2. **Sidebar** (barra lateral esquerda)
   - Tamanho: Médio (32x32px)
   - Sem texto
   - Link para dashboard

## 🛠️ Componente Logo

O componente `Logo` está localizado em: `src/components/common/Logo.tsx`

### Props disponíveis:

```tsx
<Logo
  size="sm" | "md" | "lg" | "xl"  // Tamanho da logo
  showText={true | false}          // Mostrar/ocultar texto
  to="/dashboard"                  // Link de destino
  text="INOVE.AI dev"             // Texto personalizado
  className="custom-class"         // Classes CSS extras
/>
```

### Exemplos de uso:

```tsx
// Logo completa (imagem + texto)
<Logo size="md" showText={true} />

// Apenas a imagem
<Logo size="lg" showText={false} />

// Logo sem link
<Logo to={null} />

// Logo customizada
<Logo 
  size="xl" 
  text="Meu App" 
  className="my-custom-class"
/>
```

## 🎨 Personalização Avançada

Para customizar cores do texto ou adicionar animações, edite:

`src/components/common/Logo.tsx`

O texto usa um gradiente verde por padrão:
```tsx
className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
```

## 💡 Dicas

1. **Use SVG sempre que possível** - Melhor qualidade em qualquer tamanho
2. **Mantenha o fundo transparente** - Para funcionar em temas dark/light
3. **Teste em diferentes tamanhos** - Verifique se a logo fica legível
4. **Otimize o arquivo** - Use ferramentas como SVGOMG para reduzir tamanho

## 🔗 Recursos Úteis

- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Otimizar SVGs
- [Squoosh](https://squoosh.app/) - Otimizar PNGs/JPGs
- [Favicon Generator](https://realfavicongenerator.net/) - Gerar favicons

---

**Precisa de ajuda?** Consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.
