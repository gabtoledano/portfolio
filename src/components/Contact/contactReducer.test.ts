import { describe, expect, it } from "vitest";
import {
  contactReducer,
  initialContactState,
  validateField,
  validateForm,
  type ContactState,
} from "./contactReducer";

const VALID = {
  name: "Gabriel",
  email: "gabriel@exemple.fr",
  subject: "Mission React",
  message: "Bonjour, j'aimerais échanger avec vous sur un poste.",
};

const filled: ContactState = { ...initialContactState, values: VALID };

describe("validateField", () => {
  it("refuse un champ vide", () => {
    expect(validateField("name", "   ")).toBeDefined();
    expect(validateField("message", "")).toBeDefined();
  });

  it("refuse une adresse mal formée", () => {
    expect(validateField("email", "gabriel@")).toBeDefined();
    expect(validateField("email", "gabriel.fr")).toBeDefined();
  });

  it("accepte une saisie correcte", () => {
    expect(validateField("email", "a@b.fr")).toBeUndefined();
    expect(validateField("name", "Gabriel")).toBeUndefined();
  });

  it("ignore les espaces de bord", () => {
    expect(validateField("name", "  Gabriel  ")).toBeUndefined();
    expect(validateField("name", "  G  ")).toBeDefined();
  });
});

describe("validateForm", () => {
  it("ne renvoie aucune erreur sur un formulaire valide", () => {
    expect(validateForm(VALID)).toEqual({});
  });

  it("remonte toutes les erreurs d'un coup", () => {
    expect(Object.keys(validateForm(initialContactState.values))).toEqual([
      "name",
      "email",
      "subject",
      "message",
    ]);
  });
});

describe("contactReducer", () => {
  it("n'affiche pas d'erreur pendant la première saisie", () => {
    const state = contactReducer(initialContactState, {
      type: "change",
      field: "email",
      value: "g",
    });
    expect(state.values.email).toBe("g");
    expect(state.errors.email).toBeUndefined();
  });

  it("re-valide en direct un champ déjà quitté", () => {
    const blurred = contactReducer(initialContactState, {
      type: "blur",
      field: "email",
    });
    expect(blurred.errors.email).toBeDefined();

    const fixed = contactReducer(blurred, {
      type: "change",
      field: "email",
      value: "gabriel@exemple.fr",
    });
    expect(fixed.errors.email).toBeUndefined();
  });

  it("marque tous les champs comme visités lors d'un envoi refusé", () => {
    const state = contactReducer(initialContactState, {
      type: "invalid",
      errors: validateForm(initialContactState.values),
    });
    expect(state.touched).toEqual({
      name: true,
      email: true,
      subject: true,
      message: true,
    });
    expect(state.status).toEqual({ type: "idle" });
  });

  it("vide le formulaire après un envoi réussi", () => {
    const sending = contactReducer(filled, { type: "submit" });
    expect(sending.status).toEqual({ type: "submitting" });

    const sent = contactReducer(sending, { type: "succeeded" });
    expect(sent.values).toEqual(initialContactState.values);
    expect(sent.status).toEqual({ type: "success" });
  });

  it("conserve la saisie après un échec, pour pouvoir réessayer", () => {
    const failed = contactReducer(
      contactReducer(filled, { type: "submit" }),
      { type: "failed", message: "Boum" },
    );
    expect(failed.values).toEqual(VALID);
    expect(failed.status).toEqual({ type: "error", message: "Boum" });
  });

  it("efface le bandeau de résultat dès qu'on retouche le formulaire", () => {
    const failed = contactReducer(filled, {
      type: "failed",
      message: "Boum",
    });
    const retyped = contactReducer(failed, {
      type: "change",
      field: "message",
      value: "Un nouveau message assez long pour passer.",
    });
    expect(retyped.status).toEqual({ type: "idle" });
  });

  it("ne peut jamais être en envoi et en erreur simultanément", () => {
    // Garantie apportée par l'union discriminée : un seul état à la fois.
    const failed = contactReducer(
      contactReducer(filled, { type: "submit" }),
      { type: "failed", message: "Boum" },
    );
    expect(failed.status.type).toBe("error");
  });
});
