# 🚀 Deploy no Vercel - Meu Reverb

Guia rápido para publicar seu app no Vercel em menos de 5 minutos!

---

## 📦 Opção A: Upload Direto (Mais Fácil)

**Sem precisar de GitHub!**

### Passo a Passo:

1. **Acesse o Vercel**
   - Vá para [vercel.com](https://vercel.com)
   - Faça login na sua conta

2. **Crie um novo projeto**
   - Clique em **"Add New..."** → **"Project"**
   - Procure a opção de upload ou "Deploy from template"

3. **Faça upload da pasta `dist`**
   - Arraste a pasta `dist` gerada pelo build
   - Aguarde o deploy (alguns segundos)

4. **Pronto!** 🎉
   - Você receberá um link como: `meu-reverb-abc123.vercel.app`
   - Acesse esse link no celular e instale como app!

---

## 🐙 Opção B: Via GitHub (Recomendado)

**Deploys automáticos a cada alteração!**

### 1. Crie um repositório no GitHub

```bash
# No terminal, dentro da pasta do projeto:

# Inicializa o git
git init

# Adiciona todos os arquivos
git add .

# Faz o primeiro commit
git commit -m "Primeiro commit - Meu Reverb PWA"

# Define a branch principal
git branch -M main

# Conecta ao seu repositório (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/meu-reverb.git

# Envia para o GitHub
git push -u origin main
```

### 2. Conecte o Vercel ao GitHub

1. No Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **meu-reverb**
3. O Vercel detecta automaticamente que é um projeto Vite
4. Confirme as configurações:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **"Deploy"**

### 3. Pronto! 🎉

Seu app estará no ar em segundos!

**Vantagem:** A cada `git push`, o Vercel faz o deploy automaticamente!

---

## 📱 Instalando no Celular

### Android (Chrome)

1. Abra o link do app no Chrome
2. Toque nos **3 pontos (⋮)** no canto superior
3. Selecione **"Instalar app"** ou **"Adicionar à tela inicial"**
4. Confirme tocando em **"Instalar"**

### iPhone (Safari)

1. Abra o link do app no **Safari** ⚠️
2. Toque no botão **Compartilhar** (quadrado com seta ↑)
3. Role para baixo e toque em **"Adicionar à Tela de Início"**
4. Toque em **"Adicionar"**

**⚠️ Importante:** No iPhone, use apenas o Safari! Outros navegadores não suportam PWA no iOS.

---

## 🔧 Configurações do Projeto

O arquivo `vercel.json` já está configurado com:

- ✅ Build automático com Vite
- ✅ Output na pasta `dist`
- ✅ Redirecionamento para SPA (Single Page Application)
- ✅ Cache correto para Service Worker e manifest

---

## 🌐 Domínio Personalizado (Opcional)

Se quiser um domínio próprio (ex: `meureverb.com.br`):

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio
3. Configure o DNS conforme as instruções do Vercel
4. Aguarde a propagação (pode levar até 48h)

---

## 🔄 Atualizações

### Se usou Upload Direto:
- Faça as alterações no código
- Rode `npm run build`
- Faça upload da nova pasta `dist` no Vercel

### Se usou GitHub:
- Faça as alterações no código
- Commit e push:
  ```bash
  git add .
  git commit -m "Atualização"
  git push
  ```
- O Vercel faz o deploy automaticamente! 🚀

---

## 📊 Verificar Status do Deploy

1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Veja o status dos deploys e logs

---

## 🆘 Problemas Comuns

### "Página não encontrada" ao atualizar
- Verifique se o `vercel.json` está configurado com `rewrites`

### Service Worker não atualiza
- Limpe o cache do navegador
- Ou acesse em modo anônimo

### App não instala no iPhone
- Use apenas o Safari
- Certifique-se de que o site está em HTTPS (o Vercel faz isso automaticamente)

---

## 📞 Suporte

- [Documentação do Vercel](https://vercel.com/docs)
- [Guia Visual Completo](./public/deploy-vercel.html)

---

**Feito com ❤️ para músicos**
