import type { SkillCategory } from '../types'

export const skills: SkillCategory[] = [
  {
    id: 1,
    title: 'Langages & Frameworks',
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React', 'Redux Toolkit', 'React Router', 'Axios']
  },
  {
    id: 2,
    title: 'Back-end & Outils',
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger / OpenAPI', 'Vite', 'Git', 'GitHub', 'VS Code', 'npm / yarn']
  },
  {
    id: 3,
    title: 'Qualité & SEO',
    skills: ['Lighthouse', 'WebP / Lazy loading', 'Accessibilité WCAG', 'HTML sémantique', 'SEO technique', 'Schema.org JSON-LD', 'Open Graph', 'CSS Modules', 'Responsive design']
  }
]