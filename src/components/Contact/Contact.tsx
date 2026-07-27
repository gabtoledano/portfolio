import { useState } from "react";
import React from "react";
import type { FC } from "react";
import emailjs from "@emailjs/browser";
import type { ContactForm } from "../../types";
import styles from "./Contact.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

const Contact: FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  const infos: InfoItem[] = [
    {
      icon: <HiMail />,
      label: "Email",
      value: "gabrieltoledano19@gmail.com",
      href: "mailto:gabrieltoledano19@gmail.com",
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      value: "linkedin.com/in/gabrieltoledano",
      href: "https://linkedin.com/in/gabrieltoledano",
    },
    {
      icon: <FaGithub />,
      label: "Github",
      value: "github.com/gabtoledano",
      href: "https://github.com/gabtoledano",
    },
  ];

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.sectionTitle}>
        <span className={styles.number}>04 /</span>
        <h2>Contact</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.intro}>
            Je suis actuellement à la recherche de ma première expérience
            professionnelle en tant que développeur <strong>front-end</strong>.
            Mon profil hybride graphiste / développeur m'attire particulièrement
            vers des équipes qui valorisent autant le soin du rendu visuel que
            la qualité du code. N'hésitez pas à me contacter !
          </p>
          <div className={styles.infos}>
            {infos.map((info) => (
              <a
                key={info.label}
                href={info.href}
                target="_blank"
                rel="noreferrer"
                className={styles.info}
              >
                <span className={styles.infoIcon}>{info.icon}</span>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>{info.label}</span>
                  <span className={styles.infoValue}>{info.value}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          {success && (
            <div className={styles.toast}>✓ Message envoyé avec succès !</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Nom</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sujet</label>
              <input
                type="text"
                name="subject"
                placeholder="Ex : Proposition de projet/offre etc.."
                value={form.subject}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Message</label>
              <textarea
                name="message"
                placeholder="Votre message..."
                value={form.message}
                onChange={handleChange}
                required
                className={styles.textarea}
                rows={6}
              />
            </div>
            {error && (
              <p className={styles.errorMessage}>
                Une erreur est survenue, réessayez.
              </p>
            )}
            <button type="submit" className={styles.btn} disabled={sending}>
              {sending ? "Envoi en cours..." : "Envoyer le message →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
