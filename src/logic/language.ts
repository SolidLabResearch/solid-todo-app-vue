import { Ref, ref } from 'vue'
import { getCookie, setCookie } from 'typescript-cookie'

import english from '../translations/en.json'
import finnish from '../translations/fi.json'

const availableTranslations: Record<string, Record<string, string>> = {
  en: english,
  fi: finnish
}

const availableLanguages: string[] = [...Object.keys(availableTranslations)]

const languageCookie: string = 'language'
const language: Ref<string> = ref(getCookie(languageCookie) ?? availableLanguages[0])

const translations: Ref<Record<string, string>> = ref(availableTranslations[language.value])

function setLanguage(lang: string): void {
  language.value = lang
  translations.value = availableTranslations[lang]
  const pageTitle: HTMLTitleElement = document.getElementsByTagName('title')[0]
  pageTitle.textContent = translations.value.appName
  setCookie(languageCookie, lang)
}

document.addEventListener('DOMContentLoaded', () => setLanguage(language.value))

export { setLanguage, translations, language, availableLanguages }
