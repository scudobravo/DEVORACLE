import type { Messages } from "../en";
import { checkoutButtons } from "./checkoutButtons";
import { contact } from "./contact";
import { dashboard } from "./dashboard";
import { download } from "./download";
import { faq } from "./faq";
import { footer } from "./footer";
import { home } from "./home";
import { login } from "./login";
import { meta } from "./meta";
import { localeSwitcher, nav } from "./nav";
import { privacy } from "./privacy";
import { pricing } from "./pricing";
import { schema } from "./schema";
import { terms } from "./terms";
import { welcome } from "./welcome";

const messages = {
  meta,
  nav,
  localeSwitcher,
  home,
  faq,
  footer,
  login,
  contact,
  welcome,
  download,
  dashboard,
  pricing,
  checkoutButtons,
  schema,
  privacy,
  terms,
} satisfies Messages;

export default messages;
