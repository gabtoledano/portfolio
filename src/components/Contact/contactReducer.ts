import type { ContactField, ContactForm } from "@/types";

/**
 * Union discriminée plutôt que trois booléens `sending` / `success` / `error`.
 *
 * Avec des booléens, rien n'empêche l'état impossible « en cours d'envoi ET en
 * erreur » ; ici le formulaire ne peut être que dans un seul état à la fois, et
 * TypeScript refuse de lire `message` ailleurs que dans la branche `error`.
 */
export type ContactStatus =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success" }
  | { type: "error"; message: string };

export type FieldErrors = Partial<Record<ContactField, string>>;
export type TouchedFields = Partial<Record<ContactField, boolean>>;

export interface ContactState {
  values: ContactForm;
  errors: FieldErrors;
  touched: TouchedFields;
  status: ContactStatus;
}

export type ContactAction =
  | { type: "change"; field: ContactField; value: string }
  | { type: "blur"; field: ContactField }
  | { type: "invalid"; errors: FieldErrors }
  | { type: "submit" }
  | { type: "succeeded" }
  | { type: "failed"; message: string }
  | { type: "dismiss" };

const EMPTY_FORM: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export const initialContactState: ContactState = {
  values: EMPTY_FORM,
  errors: {},
  touched: {},
  status: { type: "idle" },
};

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 1200;

// Volontairement permissive : valider une adresse e-mail par expression
// régulière est un piège, le vrai test est l'envoi.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Renvoie le message d'erreur du champ, ou `undefined` s'il est valide. */
export function validateField(
  field: ContactField,
  value: string,
): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case "name":
      if (trimmed.length === 0) return "Votre nom est requis.";
      if (trimmed.length < 2) return "Au moins 2 caractères.";
      return undefined;
    case "email":
      if (trimmed.length === 0) return "Votre e-mail est requis.";
      if (!EMAIL_PATTERN.test(trimmed)) return "Cette adresse semble invalide.";
      return undefined;
    case "subject":
      if (trimmed.length === 0) return "Indiquez un sujet.";
      if (trimmed.length < 3) return "Au moins 3 caractères.";
      return undefined;
    case "message":
      if (trimmed.length === 0) return "Le message est vide.";
      if (trimmed.length < MESSAGE_MIN_LENGTH) {
        return `Au moins ${MESSAGE_MIN_LENGTH} caractères.`;
      }
      if (trimmed.length > MESSAGE_MAX_LENGTH) {
        return `${MESSAGE_MAX_LENGTH} caractères maximum.`;
      }
      return undefined;
  }
}

/** Valide le formulaire entier ; un objet vide signifie « tout est bon ». */
export function validateForm(values: ContactForm): FieldErrors {
  const errors: FieldErrors = {};

  for (const field of Object.keys(values) as ContactField[]) {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  }

  return errors;
}

export function contactReducer(
  state: ContactState,
  action: ContactAction,
): ContactState {
  switch (action.type) {
    case "change": {
      const values = { ...state.values, [action.field]: action.value };
      // On ne re-valide en cours de frappe que les champs déjà quittés une
      // fois : sinon le formulaire crie « requis » dès la première lettre.
      const errors = state.touched[action.field]
        ? { ...state.errors, [action.field]: validateField(action.field, action.value) }
        : state.errors;

      return {
        ...state,
        values,
        errors,
        // Toute modification efface le bandeau de résultat précédent.
        status: state.status.type === "idle" ? state.status : { type: "idle" },
      };
    }

    case "blur":
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
        errors: {
          ...state.errors,
          [action.field]: validateField(action.field, state.values[action.field]),
        },
      };

    case "invalid":
      return {
        ...state,
        errors: action.errors,
        // Un envoi refusé marque tout comme visité : les erreurs deviennent
        // visibles même sur les champs jamais touchés.
        touched: { name: true, email: true, subject: true, message: true },
        status: { type: "idle" },
      };

    case "submit":
      return { ...state, errors: {}, status: { type: "submitting" } };

    case "succeeded":
      return { ...initialContactState, status: { type: "success" } };

    case "failed":
      return { ...state, status: { type: "error", message: action.message } };

    case "dismiss":
      return { ...state, status: { type: "idle" } };
  }
}
