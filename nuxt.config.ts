// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  // When deploying to GitHub Pages under a repository (project pages),
  // set a base path so assets are referenced under '/<repo>/' instead of '/'.
  // This can be overridden by setting the NUXT_BASE environment variable in CI.
  app: {
    baseURL: process.env.NUXT_BASE ? (process.env.NUXT_BASE.endsWith('/') ? process.env.NUXT_BASE : process.env.NUXT_BASE + '/') : '/test_frontend_v2/'
  },
  build: {
    // publicPath determines where the `_nuxt` static assets are served from.
    publicPath: (process.env.NUXT_BASE ? (process.env.NUXT_BASE.endsWith('/') ? process.env.NUXT_BASE : process.env.NUXT_BASE + '/') : '/test_frontend_v2/') + '_nuxt/'
  },

  modules: ['@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/image', '@unocss/nuxt', '@nuxtjs/google-fonts'],

  googleFonts: {
    display: 'swap',
    download: false,
    families: {
      'Noto Sans TC': true,
    },
  },

  image: {
    provider: 'ipx',
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 75, // 設定品質
        },
      },
    },
  },

  i18n: {
    locales: [
      {
        code: 'zh-TW',
        file: 'tw.json',
        language: 'zh-TW',
        name: '繁體中文',
      },
      {
        code: 'en-US',
        file: 'en.json',
        language: 'en-US',
        name: 'English',
      },
    ],
    lazy: true,
    langDir: 'language/',
    defaultLocale: 'zh-TW',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'zh-TW',
    },
  },

  unocss: {
    nuxtLayers: true,
  },

  postcss: {
    plugins: {
      '@unocss/postcss': {},
      'postcss-preset-env': {
        stage: 1,
        features: {
          'nesting-rules': true,
        },
      },
      'postcss-nested': {},
      'postcss-pxtorem': {
        // 更正插件名稱
        rootValue: 16,
        propList: ['*'],
        exclude: /node_modules/i,
      },
      autoprefixer: {
        overrideBrowserslist: ['last 2 versions', '> 1%'],
      },
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },

  css: ['~/assets/css/reset.css', '~/assets/css/style.scss'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://54079.wu.elitepro.ltd'
    }
  },
})
