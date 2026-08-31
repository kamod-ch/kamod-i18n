import type { FunctionalComponent } from "preact";
import { KamodProductLogo } from "@kamod-ch/brand";

interface LogoProps {
  class?: string;
  label: string;
  base?: string;
}

const Logo: FunctionalComponent<LogoProps> = ({ class: className, label, base = "/" }) => (
  <KamodProductLogo
    {...(className !== undefined ? { class: className } : {})}
    label={label}
    base={base}
    suffix="i18n"
  />
);

export default Logo;
