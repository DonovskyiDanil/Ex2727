const env = process.env.NODE_ENV || 'development';

/**
 * ВАЖНО: Браузер не понимает имя сервиса 'server-dev'. 
 * Если фронтенд запущен вне сети Docker (на хосте), он должен стучаться в localhost.
 * Если вы используете Nginx как прокси в Docker, здесь должен быть адрес прокси.
 */
const serverIP = 'localhost'; 
const serverPort = 5001;

export default {
  // Роли пользователей
  CUSTOMER: 'customer',
  CREATOR: 'creator',
  MODERATOR: 'moderator',

  // Статусы конкурсов
  CONTEST_STATUS_ACTIVE: 'active',
  CONTEST_STATUS_FINISHED: 'finished',
  CONTEST_STATUS_PENDING: 'pending',

  // Типы конкурсов
  NAME_CONTEST: 'name',
  LOGO_CONTEST: 'logo',
  TAGLINE_CONTEST: 'tagline',

  // Статусы предложений (офферов)
  OFFER_STATUS_REJECTED: 'rejected',
  OFFER_STATUS_WON: 'won',
  OFFER_STATUS_PENDING: 'pending',
  OFFER_STATUS_APPROVED: 'approved',   // Одобрено модератором
  OFFER_STATUS_DISCARDED: 'discarded', // Отклонено модератором (спам/не цензура)

  // Пути к изображениям
  STATIC_IMAGES_PATH: '/staticImages/',
  ANONYM_IMAGE_PATH: '/staticImages/anonym.png',

  // Адреса API
  BASE_URL: `http://${serverIP}:${serverPort}/`,
  
  ACCESS_TOKEN: 'accessToken',

  publicURL: env === 'production'
      ? `http://${serverIP}:80/images/` // В продакшене обычно через Nginx на 80 порту
      : `http://${serverIP}:${serverPort}/public/images/`,

  // Режимы чата
  NORMAL_PREVIEW_CHAT_MODE: 'NORMAL_PREVIEW_CHAT_MODE',
  FAVORITE_PREVIEW_CHAT_MODE: 'FAVORITE_PREVIEW_CHAT_MODE',
  BLOCKED_PREVIEW_CHAT_MODE: 'BLOCKED_PREVIEW_CHAT_MODE',
  CATALOG_PREVIEW_CHAT_MODE: 'CATALOG_PREVIEW_CHAT_MODE',
  CHANGE_BLOCK_STATUS: 'CHANGE_BLOCK_STATUS',
  ADD_CHAT_TO_OLD_CATALOG: 'ADD_CHAT_TO_OLD_CATALOG',
  CREATE_NEW_CATALOG_AND_ADD_CHAT: 'CREATE_NEW_CATALOG_AND_ADD_CHAT',
  
  USER_INFO_MODE: 'USER_INFO_MODE',
  CASHOUT_MODE: 'CASHOUT_MODE',

  AUTH_MODE: {
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
  },

  HEADER_ANIMATION_TEXT: [
    'a Company', 'a Brand', 'a Website', 'a Service', 'a Book',
    'a Business', 'an App', 'a Product', 'a Startup',
  ],

  FooterItems: [
    {
      title: 'SQUADHELP',
      items: ['About', 'Contact', 'How It Works?', 'Testimonials', 'Our Work'],
    },
    {
      title: 'RESOURCES',
      items: [
        'How It Works', 'Become a Creative', 'Business Name Generator',
        'Discussion Forum', 'Blog', 'Download eBook', 'Pricing', 'Help & FAQs',
      ],
    },
    {
      title: 'OUR SERVICES',
      items: [
        'Naming', 'Logo Design', 'Taglines', 'Premium Names For Sale',
        'Creative Owned Names For Sale', 'Audience Testing', 
        'Trademark Research & Filling', 'Managed Agency Service',
      ],
    },
    {
      title: 'LEGAL',
      items: ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
    },
  ],
};