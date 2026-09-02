# Currículo (arquivo morto — não faz parte do site)

Pasta local para o HTML/PDF do currículo.
O **modelo definitivo ATS** para download fica em `public/curriculo.pdf` (espelho de `curriculo.pdf`).

Abrir HTML:
- PT: `curriculo.html`
- EN: `curriculo-en.html`

Regenerar o PDF definitivo (visual limpo + prompts invisíveis + metadados):

```bash
npm run export:resume
```

Download local com o site rodando:
- `http://localhost:3003/curriculo.pdf`

Camadas ATS no PDF definitivo:
1. Metadados (`Subject`, `Keywords`)
2. Texto branco 1pt nos espaços em branco (HTML)
3. Texto branco 1pt no rodapé (pdf-lib)
