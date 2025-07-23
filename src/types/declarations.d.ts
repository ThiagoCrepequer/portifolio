declare module "*.json" {
  import { TranslationResource } from "../types/i18n";
  const value: TranslationResource;
  export default value;
}
