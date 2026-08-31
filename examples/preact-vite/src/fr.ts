import type { Messages } from "@kamod-ch/i18n";
import type { en } from "./locales";

const fr = {
  title: "Exemple Kamod i18n",
  welcome: "Bienvenue {name}",
  users: { zero: "Aucun utilisateur", one: "{count} utilisateur", other: "{count} utilisateurs" },
} satisfies Messages<typeof en>;

export default fr;
