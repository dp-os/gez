"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([["4217"],{2731:function(e,i,n){n.r(i),n.d(i,{default:()=>a});var s=n(1549),r=n(6603);function t(e){let i=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",code:"code",h3:"h3",ul:"ul",li:"li",div:"div",pre:"pre",ol:"ol"},(0,r.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(i.h1,{id:"exigences-environnementales",children:["Exigences environnementales",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#exigences-environnementales",children:"#"})]}),"\n",(0,s.jsx)(i.p,{children:"Ce document pr\xe9sente les exigences environnementales n\xe9cessaires pour utiliser ce framework, y compris l'environnement Node.js et la compatibilit\xe9 des navigateurs."}),"\n",(0,s.jsxs)(i.h2,{id:"environnement-nodejs",children:["Environnement Node.js",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#environnement-nodejs",children:"#"})]}),"\n",(0,s.jsxs)(i.p,{children:["Le framework n\xe9cessite une version de Node.js >= 22.6, principalement pour supporter l'importation de types TypeScript (via le flag ",(0,s.jsx)(i.code,{children:"--experimental-strip-types"}),"), sans \xe9tape de compilation suppl\xe9mentaire."]}),"\n",(0,s.jsxs)(i.h2,{id:"compatibilit\\xe9-des-navigateurs",children:["Compatibilit\xe9 des navigateurs",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#compatibilit\\xe9-des-navigateurs",children:"#"})]}),"\n",(0,s.jsxs)(i.p,{children:["Le framework est construit par d\xe9faut en mode de compatibilit\xe9 pour supporter une large gamme de navigateurs. Cependant, pour une compatibilit\xe9 compl\xe8te des navigateurs, il est n\xe9cessaire d'ajouter manuellement la d\xe9pendance ",(0,s.jsx)(i.a,{href:"https://github.com/guybedford/es-module-shims",target:"_blank",rel:"noopener noreferrer",children:"es-module-shims"}),"."]}),"\n",(0,s.jsxs)(i.h3,{id:"mode-de-compatibilit\\xe9-par-d\\xe9faut",children:["Mode de compatibilit\xe9 (par d\xe9faut)",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#mode-de-compatibilit\\xe9-par-d\\xe9faut",children:"#"})]}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"\uD83C\uDF10 Chrome : >= 87"}),"\n",(0,s.jsx)(i.li,{children:"\uD83D\uDD37 Edge : >= 88"}),"\n",(0,s.jsx)(i.li,{children:"\uD83E\uDD8A Firefox : >= 78"}),"\n",(0,s.jsx)(i.li,{children:"\uD83E\uDDED Safari : >= 14"}),"\n"]}),"\n",(0,s.jsxs)(i.p,{children:["Selon les statistiques de ",(0,s.jsx)(i.a,{href:"https://caniuse.com/?search=dynamic%20import",target:"_blank",rel:"noopener noreferrer",children:"Can I Use"}),", le taux de couverture des navigateurs en mode de compatibilit\xe9 est de 96,81 %."]}),"\n",(0,s.jsxs)(i.h3,{id:"mode-de-support-natif",children:["Mode de support natif",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#mode-de-support-natif",children:"#"})]}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"\uD83C\uDF10 Chrome : >= 89"}),"\n",(0,s.jsx)(i.li,{children:"\uD83D\uDD37 Edge : >= 89"}),"\n",(0,s.jsx)(i.li,{children:"\uD83E\uDD8A Firefox : >= 108"}),"\n",(0,s.jsx)(i.li,{children:"\uD83E\uDDED Safari : >= 16.4"}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:"Le mode de support natif offre les avantages suivants :"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"Aucun surco\xfbt d'ex\xe9cution, pas besoin de chargeur de modules suppl\xe9mentaire"}),"\n",(0,s.jsx)(i.li,{children:"Analyse native par le navigateur, vitesse d'ex\xe9cution plus rapide"}),"\n",(0,s.jsx)(i.li,{children:"Meilleure capacit\xe9 de d\xe9coupage de code et de chargement \xe0 la demande"}),"\n"]}),"\n",(0,s.jsxs)(i.p,{children:["Selon les statistiques de ",(0,s.jsx)(i.a,{href:"https://caniuse.com/?search=importmap",target:"_blank",rel:"noopener noreferrer",children:"Can I Use"}),", le taux de couverture des navigateurs en mode de support natif est de 93,5 %."]}),"\n",(0,s.jsxs)(i.h3,{id:"activation-du-support-de-compatibilit\\xe9",children:["Activation du support de compatibilit\xe9",(0,s.jsx)(i.a,{className:"header-anchor","aria-hidden":"true",href:"#activation-du-support-de-compatibilit\\xe9",children:"#"})]}),"\n",(0,s.jsxs)(i.div,{className:"rspress-directive warning",children:[(0,s.jsx)(i.div,{className:"rspress-directive-title",children:"Avertissement important"}),(0,s.jsxs)(i.div,{className:"rspress-directive-content",children:[(0,s.jsxs)(i.p,{children:["Bien que le framework soit construit par d\xe9faut en mode de compatibilit\xe9, pour un support complet des anciens navigateurs, vous devez ajouter la d\xe9pendance ",(0,s.jsx)(i.a,{href:"https://github.com/guybedford/es-module-shims",target:"_blank",rel:"noopener noreferrer",children:"es-module-shims"})," \xe0 votre projet."]}),"\n"]})]}),"\n",(0,s.jsx)(i.p,{children:"Ajoutez le script suivant dans votre fichier HTML :"}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-html",children:'\x3c!-- Environnement de d\xe9veloppement --\x3e\n<script async src="https://ga.jspm.io/npm:es-module-shims@2.0.10/dist/es-module-shims.js"><\/script>\n\n\x3c!-- Environnement de production --\x3e\n<script async src="/path/to/es-module-shims.js"><\/script>\n'})}),"\n",(0,s.jsxs)(i.div,{className:"rspress-directive tip",children:[(0,s.jsx)(i.div,{className:"rspress-directive-title",children:"Bonnes pratiques"}),(0,s.jsxs)(i.div,{className:"rspress-directive-content",children:["\n",(0,s.jsxs)(i.ol,{children:["\n",(0,s.jsxs)(i.li,{children:["Recommandations pour l'environnement de production :","\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"D\xe9ployez es-module-shims sur votre propre serveur"}),"\n",(0,s.jsx)(i.li,{children:"Assurez la stabilit\xe9 et la vitesse de chargement des ressources"}),"\n",(0,s.jsx)(i.li,{children:"\xc9vitez les risques de s\xe9curit\xe9 potentiels"}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(i.li,{children:["Consid\xe9rations de performance :","\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsx)(i.li,{children:"Le mode de compatibilit\xe9 entra\xeene un l\xe9ger surco\xfbt de performance"}),"\n",(0,s.jsx)(i.li,{children:"Vous pouvez d\xe9cider de l'activer en fonction de la distribution des navigateurs de votre public cible"}),"\n"]}),"\n"]}),"\n"]}),"\n"]})]})]})}function d(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:i}=Object.assign({},(0,r.ah)(),e.components);return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(t,{...e})}):t(e)}let a=d;d.__RSPRESS_PAGE_META={},d.__RSPRESS_PAGE_META["fr%2Fguide%2Fstart%2Fenvironment.md"]={toc:[{text:"Environnement Node.js",id:"environnement-nodejs",depth:2},{text:"Compatibilit\xe9 des navigateurs",id:"compatibilit\xe9-des-navigateurs",depth:2},{text:"Mode de compatibilit\xe9 (par d\xe9faut)",id:"mode-de-compatibilit\xe9-par-d\xe9faut",depth:3},{text:"Mode de support natif",id:"mode-de-support-natif",depth:3},{text:"Activation du support de compatibilit\xe9",id:"activation-du-support-de-compatibilit\xe9",depth:3}],title:"Exigences environnementales",headingTitle:"Exigences environnementales",frontmatter:{titleSuffix:"Guide de compatibilit\xe9 du framework Gez",description:"D\xe9tails sur les exigences environnementales du framework Gez, y compris les versions requises de Node.js et les informations de compatibilit\xe9 des navigateurs, pour aider les d\xe9veloppeurs \xe0 configurer correctement leur environnement de d\xe9veloppement.",head:[["meta",{property:"keywords",content:"Gez, Node.js, Compatibilit\xe9 des navigateurs, TypeScript, es-module-shims, Configuration de l'environnement"}]]}}}}]);