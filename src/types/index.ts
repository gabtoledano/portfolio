export interface Project {
  id: number
  title: string
  tag: string
  description: string
  stack: string[]
  githubUrl: string
  liveUrl?: string
  liveLabel?: string
  image: string
}

export interface SkillCategory {
  id: number
  title: string
  skills: string[]
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}