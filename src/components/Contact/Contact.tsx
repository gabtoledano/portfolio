import {
  useId,
  useReducer,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import emailjs from "@emailjs/browser";
import { site } from "@/data/site";
import type { ContactField } from "@/types";
import { IconAlert, IconCheck, IconGithub, IconLinkedin, IconMail } from "@/components/Icons/Icons";
import Section from "@/components/ui/Section";
import {
  contactReducer,
  initialContactState,
  MESSAGE_MAX_LENGTH,
  validateForm,
} from "./contactReducer";
import styles from "./Contact.module.css";

const INFOS = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: <IconMail size={17} />,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/gabrieltoledano",
    href: site.linkedin,
    icon: <IconLinkedin size={17} />,
  },
  {
    label: "GitHub",
    value: "github.com/gabtoledano",
    href: site.github,
    icon: <IconGithub size={17} />,
  },
] as const;

const FIELDS = [
  { name: "name", label: "Nom", placeholder: "Votre nom", type: "text" },
  { name: "email", label: "Email", placeholder: "vous@exemple.com", type: "email" },
  {
    name: "subject",
    label: "Sujet",
    placeholder: "Proposition de poste, mission…",
    type: "text",
  },
] as const satisfies readonly {
  name: ContactField;
  label: string;
  placeholder: string;
  type: string;
}[];

const { VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY } =
  import.meta.env;

/** Le formulaire ne s'affiche que si les trois clés EmailJS sont présentes. */
const emailjsConfig =
  VITE_EMAILJS_SERVICE_ID && VITE_EMAILJS_TEMPLATE_ID && VITE_EMAILJS_PUBLIC_KEY
    ? {
        serviceId: VITE_EMAILJS_SERVICE_ID,
        templateId: VITE_EMAILJS_TEMPLATE_ID,
        publicKey: VITE_EMAILJS_PUBLIC_KEY,
      }
    : null;

export default function Contact() {
  const [state, dispatch] = useReducer(contactReducer, initialContactState);
  const formId = useId();

  const { values, errors, touched, status } = state;
  const isSubmitting = status.type === "submitting";

  /** Une erreur ne s'affiche qu'une fois le champ quitté au moins une fois. */
  const errorFor = (field: ContactField) =>
    touched[field] ? errors[field] : undefined;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch({
      type: "change",
      field: event.target.name as ContactField,
      value: event.target.value,
    });
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    dispatch({ type: "blur", field: event.target.name as ContactField });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "invalid", errors: validationErrors });
      // Renvoie le focus sur le premier champ fautif.
      const firstInvalid = Object.keys(validationErrors)[0];
      document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }

    if (!emailjsConfig) {
      dispatch({
        type: "failed",
        message: "Le formulaire n'est pas configuré. Écrivez-moi directement.",
      });
      return;
    }

    dispatch({ type: "submit" });

    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: values.name,
          from_email: values.email,
          subject: values.subject,
          message: values.message,
        },
        emailjsConfig.publicKey,
      );
      dispatch({ type: "succeeded" });
    } catch {
      dispatch({
        type: "failed",
        message: "L'envoi a échoué. Réessayez ou écrivez-moi directement.",
      });
    }
  };

  const used = values.message.length;

  return (
    <Section id="contact">
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.intro}>
            Je suis actuellement à la recherche de ma première expérience
            professionnelle en tant que développeur <strong>front-end</strong>.
            Mon profil hybride graphiste / développeur m'attire particulièrement
            vers des équipes qui valorisent autant le soin du rendu visuel que
            la qualité du code. N'hésitez pas à me contacter !
          </p>

          <ul className={styles.infos}>
            {INFOS.map((info) => (
              <li key={info.label}>
                <a
                  href={info.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.info}
                >
                  <span className={styles.infoIcon}>{info.icon}</span>
                  <span className={styles.infoText}>
                    <span className={styles.infoLabel}>{info.label}</span>
                    <span className={styles.infoValue}>{info.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.row}>
            {FIELDS.slice(0, 2).map((field) => (
              <Field
                key={field.name}
                {...field}
                id={`${formId}-${field.name}`}
                value={values[field.name]}
                error={errorFor(field.name)}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            ))}
          </div>

          <Field
            {...FIELDS[2]}
            id={`${formId}-subject`}
            value={values.subject}
            error={errorFor("subject")}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor={`${formId}-message`} className={styles.label}>
                Message
              </label>
              <span
                className={styles.counter}
                data-low={MESSAGE_MAX_LENGTH - used < 100}
                aria-hidden="true"
              >
                {used} / {MESSAGE_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={6}
              placeholder="Parlez-moi de votre projet, de votre équipe…"
              className={styles.textarea}
              value={values.message}
              maxLength={MESSAGE_MAX_LENGTH}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errorFor("message") !== undefined}
              aria-describedby={
                errorFor("message") ? `${formId}-message-error` : undefined
              }
            />
            {errorFor("message") && (
              <p id={`${formId}-message-error`} className={styles.fieldError}>
                {errorFor("message")}
              </p>
            )}
          </div>

          {/* Une seule région live pour tout le résultat d'envoi : le lecteur
              d'écran annonce le succès ou l'échec sans déplacer le focus. */}
          <div role="status" aria-live="polite" className={styles.statusSlot}>
            {status.type === "success" && (
              <p className={`${styles.banner} ${styles.bannerSuccess}`}>
                <IconCheck size={16} />
                Message envoyé — je vous réponds rapidement.
              </p>
            )}
            {status.type === "error" && (
              <p className={`${styles.banner} ${styles.bannerError}`}>
                <IconAlert size={16} />
                {status.message}{" "}
                <a href={`mailto:${site.email}`} className={styles.bannerLink}>
                  {site.email}
                </a>
              </p>
            )}
          </div>

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                Envoi en cours…
              </>
            ) : (
              "Envoyer le message"
            )}
          </button>
        </form>
      </div>
    </Section>
  );
}

interface FieldProps {
  id: string;
  name: ContactField;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}

/**
 * Champ contrôlé accessible : `htmlFor`/`id` reliés, `aria-invalid` et
 * `aria-describedby` pointant vers le message d'erreur.
 */
function Field({ id, name, label, error, ...inputProps }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        name={name}
        className={styles.input}
        aria-invalid={error !== undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}
