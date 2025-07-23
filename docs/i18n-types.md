# Tipos TypeScript para i18n

Este projeto agora possui tipos TypeScript completos para as traduções, eliminando o uso de `any` e fornecendo type safety completo.

## Estrutura

### Tipos Principais

- `TranslationResource`: Interface completa que define toda a estrutura das traduções
- `Achievement`: Interface para conquistas pessoais
- `Experience`: Interface para experiências profissionais  
- `Project`: Interface para projetos

### Arquivos

- `src/types/i18n.ts`: Definições de tipos para as traduções
- `src/types/react-i18next.d.ts`: Declaração de módulo para o react-i18next
- `src/types/declarations.d.ts`: Declarações para arquivos JSON
- `src/hooks/useTypedTranslation.ts`: Hook personalizado com tipos seguros

## Uso

### Hook Tipado

```typescript
import { useTypedTranslation } from '../hooks/useTypedTranslation';

const MyComponent = () => {
  const { t, getAchievements, getExperiences, getProjects } = useTypedTranslation();
  
  // Tipos seguros para arrays
  const achievements = getAchievements(); // Achievement[]
  const experiences = getExperiences();   // Experience[]
  const projects = getProjects();         // Project[]
  
  // Função t normal para strings
  const title = t("about.title");
  
  return (
    <div>
      {achievements.map(achievement => (
        <div key={achievement.title}>
          <h3>{achievement.title}</h3>
          <p>{achievement.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### Benefícios

1. **Type Safety**: Nenhum uso de `any`, todos os tipos são explícitos
2. **IntelliSense**: Autocompletar completo para todas as chaves de tradução
3. **Refatoração Segura**: Renomeações são propagadas automaticamente
4. **Detecção de Erros**: Erros de typing são detectados em tempo de compilação
5. **Documentação**: Os tipos servem como documentação da estrutura das traduções

### Validação

Para validar que não há erros de tipo, execute:

```bash
npx tsc --noEmit
```

Este comando verifica todos os tipos sem gerar arquivos, garantindo que tudo está correto.
