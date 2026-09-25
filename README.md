# 🎸 Meu Reverb - M-Vave Mini Universe

PWA (Progressive Web App) para gerenciar presets do pedal de guitarra M-Vave Mini Universe Reverb.

## ✨ Funcionalidades

### 🎛️ Gerenciamento de Presets
- **Criar presets** com nome da música, tipo de reverb e posições dos 5 knobs
- **Editar presets** existentes
- **Deletar presets** com confirmação
- **Buscar presets** por nome ou tipo
- **Persistência automática** no localStorage

### 🎨 Tipos de Reverb
9 tipos de reverb disponíveis, cada um com cor e ícone únicos:
- 🌀 **Spring** - Reverb clássico de mola
- ✨ **Shimmer** - Reverb brilhante com oitavas
- ☁️ **Cloud** - Reverb suave e etéreo
- 🪞 **Plate** - Reverb de placa metálica
- 🏛️ **Hall** - Reverb de salão
- 🏠 **Room** - Reverb de ambiente
- 💥 **Blom** - Reverb explosivo
- 🌊 **Swel** - Reverb suave e envolvente
- 📻 **Lofi** - Reverb vintage/lo-fi

### 🎚️ Controles dos Knobs
5 knobs configuráveis com posições de relógio:
- **Decay** - Tempo de decaimento do reverb
- **Mix** - Balanço entre sinal seco e molhado
- **Param 1** - Parâmetro 1 (varia por tipo)
- **Param 2** - Parâmetro 2 (varia por tipo)
- **Param 3** - Parâmetro 3 (varia por tipo)

Posições disponíveis: 7h, 8h, 9h, 10h, 11h, 12h, 1h, 2h, 3h, 4h, 5h

### 📱 Visualização do Pedal
- **Vista compacta**: Knobs individuais com indicadores de posição
- **Vista expandida**: Representação SVG completa do pedal com todos os knobs nas posições corretas
- Botão para alternar entre as vistas (🎸 pedal / 🎛️ knobs)

### 📲 PWA - Progressive Web App
- **Instalável** como app no celular
- **Funciona offline** após primeiro carregamento
- **Service Worker** para cache inteligente
- **Manifest** com ícones SVG
- **Meta tags** para iOS e Android
- **Mobile-first** - otimizado para telas pequenas

## 🚀 Como Usar

### No Navegador (Desktop)
1. Abra o arquivo `index.html` no navegador
2. Crie presets clicando no botão "+"
3. Configure nome, tipo de reverb e posições dos knobs
4. Salve e visualize seus presets

### No Celular (PWA)
1. Acesse o app pelo navegador (Chrome, Safari, etc.)
2. Toque em "Adicionar à tela inicial" ou "Instalar app"
3. Use o app como qualquer outro aplicativo
4. Funciona offline!

### Recursos Visuais
- **Botão 🎸**: Mostra o pedal completo com todos os knobs
- **Botão 🎛️**: Mostra os knobs individuais
- **Botão ✏️**: Edita o preset
- **Botão 🗑️**: Deleta o preset (com confirmação)

## 🎨 Interface

### Tema
- Fundo escuro (#121212)
- Acentos em âmbar (#f5a623)
- Cores únicas para cada tipo de reverb
- Animações suaves
- Design responsivo

### Componentes Visuais
- **Knobs SVG**: Indicadores circulares com posições de relógio
- **Pedal SVG**: Representação realista do M-Vave Mini Universe
- **Cards**: Presets com barra de cor do tipo selecionado
- **FAB**: Botão flutuante para adicionar presets

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool
- **SVG** - Gráficos vetoriais
- **LocalStorage** - Persistência
- **Service Worker** - Cache offline
- **Web App Manifest** - PWA

## 📦 Build

```bash
npm install
npm run build
```

Os arquivos serão gerados em `dist/` prontos para deploy.

## 🌐 Deploy

### Opção 1: GitHub Pages
```bash
npm run build
# Copie o conteúdo de dist/ para a branch gh-pages
```

### Opção 2: Netlify/Vercel
```bash
# Conecte o repositório e configure:
# Build command: npm run build
# Publish directory: dist
```

### Opção 3: Servidor Local
```bash
npm run build
# Sirva a pasta dist/ com qualquer servidor HTTP
npx serve dist
```

## 📱 Instalação como PWA

### Android (Chrome)
1. Acesse o app no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme o nome do app

### iOS (Safari)
1. Acesse o app no Safari
2. Toque no botão Compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme o nome do app

## 🎯 Dicas de Uso

1. **Organize por música**: Use nomes descritivos como "Ocean Eyes - Worship"
2. **Anotações**: Adicione o tipo de reverb no nome se usar variações
3. **Backup**: Exporte seus presets periodicamente (feature futura)
4. **Teste**: Ajuste os knobs no pedal real e compare com o preset salvo

## 🔧 Próximas Funcionalidades (Futuras)

- [ ] Exportar/Importar presets (JSON)
- [ ] Categorias/Tags
- [ ] Favoritos
- [ ] Compartilhamento de presets
- [ ] Modo escuro/claro
- [ ] Anotações por preset
- [ ] Histórico de edições

## 📄 Licença

Projeto pessoal para uso com o pedal M-Vave Mini Universe.

---

**Desenvolvido com ❤️ para músicos**
