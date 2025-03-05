---
titleSuffix: "From Micro-Frontend Dilemma to ESM Innovation: The Evolution Path of Gez Framework"
description: Explore the evolution of the Gez framework from the challenges of traditional micro-frontend architecture to ESM-based innovation breakthroughs, sharing technical practices in performance optimization, dependency management, and build tool selection.
head:
  - - meta
    - property: keywords
      content: Gez, Micro-Frontend Framework, ESM, Import Maps, Rspack, Module Federation, Dependency Management, Performance Optimization, Technical Evolution, Server-Side Rendering
sidebar: false
---

# From Component Sharing to Native Modularization: The Evolution Path of Gez Micro-Frontend Framework

## Project Background

Over the past few years, micro-frontend architecture has been searching for the right path. However, what we've seen are various complex technical solutions that use layers of packaging and artificial isolation to simulate an ideal micro-frontend world. These solutions bring heavy performance burdens, making simple development complex and standard processes obscure.

### Limitations of Traditional Solutions

In practicing micro-frontend architecture, we deeply experienced the many limitations of traditional solutions:

- **Performance Overhead**: Runtime dependency injection, JS sandbox proxies - every operation consumes valuable performance
- **Fragile Isolation**: Artificially created sandbox environments can never match the native isolation capabilities of browsers
- **Build Complexity**: To handle dependency relationships, build tools had to be modified, making simple projects difficult to maintain
- **Custom Rules**: Special deployment strategies and runtime processing deviate from standard modern development processes
- **Ecosystem Constraints**: Framework coupling and custom APIs force technology choices to be bound to specific ecosystems

These issues were particularly prominent in a 2019 enterprise-level project. At that time, a large product was divided into more than ten independent business subsystems, which needed to share a set of basic and business components. The initial npm-based component sharing solution exposed serious maintenance efficiency problems in practice: when shared components were updated, all subsystems dependent on these components had to go through complete build and deployment processes.

## Technical Evolution

### v1.0: Exploring Remote Components

To solve the efficiency problem of component sharing, Gez v1.0 introduced the RemoteView component mechanism based on HTTP protocol. This solution achieved on-demand code assembly between services through runtime dynamic requests, successfully solving the problem of long build dependency chains. However, due to the lack of standardized runtime communication mechanisms, state synchronization and event passing between services still had efficiency bottlenecks.

### v2.0: Module Federation Attempt

In version v2.0, we adopted [Webpack 5.0](https://webpack.js.org/)'s [Module Federation](https://webpack.js.org/concepts/module-federation/) technology. This technology significantly improved collaboration efficiency between services through a unified module loading mechanism and runtime containers. However, in large-scale practice, the closed implementation mechanism of Module Federation brought new challenges: it was difficult to achieve precise dependency version management, especially when unifying shared dependencies across multiple services, often encountering version conflicts and runtime exceptions.

## Embracing the New ESM Era

When planning version v3.0, we deeply observed the development trends of the front-end ecosystem and found that advancements in browser native capabilities brought new possibilities for micro-frontend architecture:

### Standardized Module System

With mainstream browsers' comprehensive support for [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and the maturity of the [Import Maps](https://github.com/WICG/import-maps) specification, front-end development has entered a true modular era. According to [Can I Use](https://caniuse.com/?search=importmap) statistics, native support for ESM in mainstream browsers (Chrome >= 89, Edge >= 89, Firefox >= 108, Safari >= 16.4) has reached 93.5%, providing us with the following advantages:

- **Standardized Dependency Management**: Import Maps provide the ability to resolve module dependencies at the browser level, eliminating the need for complex runtime injection
- **Resource Loading Optimization**: Browser-native module caching mechanisms significantly improve resource loading efficiency
- **Simplified Build Process**: ESM-based development mode makes build processes more consistent between development and production environments

At the same time, through compatibility mode support (Chrome >= 87, Edge >= 88, Firefox >= 78, Safari >= 14), we can further increase browser coverage to 96.81%, allowing us to maintain high performance without sacrificing support for older browsers.

### Breakthroughs in Performance and Isolation

The native module system brings not only standardization but also qualitative improvements in performance and isolation:

- **Zero Runtime Overhead**: Eliminates JavaScript sandbox proxies and runtime injection in traditional micro-frontend solutions
- **Reliable Isolation Mechanism**: ESM's strict module scope naturally provides the most reliable isolation capabilities
- **Precise Dependency Management**: Static import analysis makes dependency relationships clearer and version control more precise

### Build Tool Selection

In the implementation of technical solutions, build tool selection is a key decision point. After nearly a year of technical research and practice, our choices have evolved as follows:

1. **Vite Exploration**
   - Advantages: ESM-based development server provides an ultimate development experience
   - Challenges: Differences between development and production builds introduce some uncertainty

2. **[Rspack](https://www.rspack.dev/) Establishment**
   - Performance Advantages: High-performance compilation based on [Rust](https://www.rust-lang.org/) significantly improves build speed
   - Ecosystem Support: High compatibility with Webpack ecosystem reduces migration costs
   - ESM Support: Verified reliability in ESM builds through Rslib project practice

This decision allowed us to maintain development experience while gaining more stable production environment support. Based on the combination of ESM and Rspack, we ultimately built a high-performance, low-intrusive micro-frontend solution.

## Future Outlook

In future development plans, the Gez framework will focus on the following three directions:

### Deep Optimization of Import Maps

- **Dynamic Dependency Management**: Implement intelligent scheduling of runtime dependency versions to resolve dependency conflicts between multiple applications
- **Preloading Strategy**: Intelligent preloading based on route analysis to improve resource loading efficiency
- **Build Optimization**: Automatically generate optimal Import Maps configurations to reduce manual configuration costs for developers

### Framework-Agnostic Routing Solution

- **Unified Routing Abstraction**: Design framework-agnostic routing interfaces supporting mainstream frameworks like Vue and React
- **Micro-Application Routing**: Implement routing linkage between applications to maintain URL and application state consistency
- **Routing Middleware**: Provide extensible middleware mechanisms supporting features like permission control and page transitions

### Best Practices for Cross-Framework Communication

- **Example Applications**: Provide complete cross-framework communication examples covering mainstream frameworks like Vue, React, and Preact
- **State Synchronization**: Lightweight state sharing solution based on ESM implementation
- **Event Bus**: Standardized event communication mechanism supporting decoupled communication between applications

Through these optimizations and extensions, we aim to make Gez a more complete and user-friendly micro-frontend solution, providing developers with better development experiences and higher efficiency.