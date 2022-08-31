import { createI18n } from 'vue-i18n';
import elementEnLocale from 'element-plus/lib/locale/lang/en';
import elementZhLocale from 'element-plus/lib/locale/lang/zh-cn'
import enLocale from './en';
import zhLocale from './zh';

import store from '@/store';

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale,
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale,
    }
}


const i18n = createI18n({
    locale: localStorage.getItem('my_locale') || 'zh',
    fallbackLocale: 'zh',
    legacy: false,
    messages
})

export default i18n;