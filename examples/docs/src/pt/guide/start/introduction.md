---
titleSuffix: Visão Geral e Inovações Técnicas do Framework Gez
description: Aprofunde-se no contexto do projeto, evolução técnica e vantagens principais do framework de micro frontend Gez, explorando soluções modernas de renderização no lado do servidor baseadas em ESM.
head:
  - - meta
    - property: keywords
      content: Gez, micro frontend, ESM, renderização no servidor, SSR, inovação técnica, Module Federation
---

# Introdução

## Contexto do Projeto
Gez é um framework moderno de micro frontend baseado em ECMAScript Modules (ESM), focado na construção de aplicações de renderização no servidor (SSR) de alto desempenho e escaláveis. Como a terceira geração do projeto Genesis, Gez tem inovado continuamente ao longo de sua evolução técnica:

- **v1.0**: Implementação de carregamento sob demanda de componentes remotos baseado em requisições HTTP
- **v2.0**: Integração de aplicações baseada em Webpack Module Federation
- **v3.0**: Redesenho do sistema de [vinculação de módulos](/guide/essentials/module-link) baseado em ESM nativo do navegador

## Contexto Técnico
No desenvolvimento da arquitetura de micro frontend, as soluções tradicionais apresentam principalmente as seguintes limitações:

### Desafios das Soluções Existentes
- **Gargalos de desempenho**: Injeção de dependência em tempo de execução e proxies de sandbox JavaScript trazem sobrecarga significativa de desempenho
- **Mecanismos de isolamento**: Ambientes de sandbox desenvolvidos internamente dificilmente alcançam a capacidade de isolamento de módulos nativa do navegador
- **Complexidade de construção**: Modificações nas ferramentas de construção para compartilhamento de dependências aumentam os custos de manutenção do projeto
- **Desvio de padrões**: Estratégias de implantação especiais e mecanismos de processamento em tempo de execução divergem dos padrões modernos de desenvolvimento Web
- **Limitações do ecossistema**: Acoplamento de frameworks e APIs personalizadas restringem a escolha da pilha tecnológica

### Inovação Técnica
Gez oferece uma nova solução baseada em padrões Web modernos:

- **Sistema de módulos nativo**: Utiliza ESM nativo do navegador e Import Maps para gerenciamento de dependências, com maior velocidade de análise e execução
- **Mecanismo de isolamento padrão**: Isolamento confiável de aplicações baseado no escopo de módulos ECMAScript
- **Pilha tecnológica aberta**: Suporte a integração perfeita de qualquer framework frontend moderno
- **Experiência de desenvolvimento otimizada**: Oferece um modo de desenvolvimento intuitivo e capacidade completa de depuração
- **Otimização de desempenho máxima**: Implementação de sobrecarga zero em tempo de execução através de capacidades nativas, combinada com estratégias de cache inteligente

:::tip
Gez foca em fornecer infraestrutura de micro frontend de alto desempenho e fácil expansão, especialmente adequada para cenários de aplicações de renderização no servidor em larga escala.
:::

## Especificações Técnicas

### Dependências de Ambiente
Consulte o documento [Requisitos de Ambiente](/guide/start/environment) para obter detalhes sobre os requisitos de navegador e Node.js.

### Pilha Tecnológica Principal
- **Gerenciamento de dependências**: Utiliza [Import Maps](https://caniuse.com/?search=import%20map) para mapeamento de módulos, com suporte de compatibilidade fornecido por [es-module-shims](https://github.com/guybedford/es-module-shims)
- **Sistema de construção**: Baseado em [module-import](https://rspack.dev/config/externals#externalstypemodule-import) do Rspack para processamento de dependências externas
- **Ferramentas de desenvolvimento**: Suporte a atualização em tempo real (hot reload) de ESM e execução nativa de TypeScript

## Posicionamento do Framework
Gez difere de [Next.js](https://nextjs.org) ou [Nuxt.js](https://nuxt.com/), focando em fornecer infraestrutura de micro frontend:

- **Sistema de vinculação de módulos**: Implementa importação e exportação de módulos eficientes e confiáveis
- **Renderização no servidor**: Oferece mecanismos flexíveis de implementação de SSR
- **Suporte a sistema de tipos**: Integra definições de tipos TypeScript completas
- **Neutralidade de framework**: Suporta integração com frameworks frontend principais

## Design de Arquitetura

### Gerenciamento Centralizado de Dependências
- **Fonte de dependências unificada**: Gerenciamento centralizado de dependências de terceiros
- **Distribuição automática**: Sincronização global automática de atualizações de dependências
- **Consistência de versão**: Controle preciso de versões de dependências

### Design Modular
- **Separação de responsabilidades**: Desacoplamento de lógica de negócio e infraestrutura
- **Mecanismo de plugins**: Suporte a combinação e substituição flexível de módulos
- **Interfaces padronizadas**: Protocolo de comunicação padronizado entre módulos

### Otimização de Desempenho
- **Princípio de sobrecarga zero**: Maximiza o uso de capacidades nativas do navegador
- **Cache inteligente**: Estratégia de cache precisa baseada em hash de conteúdo
- **Carregamento sob demanda**: Gerenciamento refinado de divisão de código e dependências

## Maturidade do Projeto
Gez, através de quase 5 anos de evolução iterativa (v1.0 a v3.0), foi amplamente validado em ambientes empresariais. Atualmente, suporta dezenas de projetos de negócios em execução estável e continua a impulsionar a modernização da pilha tecnológica. A estabilidade, confiabilidade e vantagens de desempenho do framework foram amplamente comprovadas na prática, fornecendo uma base técnica confiável para o desenvolvimento de aplicações em larga escala.