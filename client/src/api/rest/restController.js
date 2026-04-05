import http from '../interceptor';

// --- АВТОРИЗАЦИЯ ---
export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.post('login', data);
export const getUser = () => http.post('getUser');
export const updateUser = data => http.post('updateUser', data); // Проверь, что передаешь FormData для фото

// --- КОНКУРСЫ ---
export const updateContest = data => http.post('updateContest', data);
export const dataForContest = data => http.post('dataForContest', data);

// Исправлено: На бэкенде GET, параметры передаем через params
export const getCustomersContests = data =>
  http.get('getCustomersContests', {
    params: { 
      limit: data.limit, 
      offset: data.offset 
    },
    headers: {
      status: data.contestStatus,
    },
  });

// Исправлено: На бэкенде эндпоинт называется 'getContests'
export const getActiveContests = (data) =>
  http.post('getContests', data); 

// Исправлено: На бэкенде GET, используем params для передачи ID
export const getContestById = data =>
  http.get('contestById', {
    headers: {
      contestId: data.contestId,
    },
  });

// --- ОФФЕРЫ ---
export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.post('setOfferStatus', data);
export const downloadContestFile = data =>
  http.get(`downloadFile/${data.fileName}`);

// --- ОПЛАТА И СТАТИСТИКА ---
export const payMent = data => http.post('pay', data);
export const changeMark = data => http.post('changeMark', data);
export const cashOut = data => http.post('cashout', data);

// --- ЧАТ ---
export const getPreviewChat = () => http.post('getPreview');
export const getDialog = data => http.post('getChat', data);
export const newMessage = data => http.post('addMessage', data); // Исправлено на addMessage
export const changeChatFavorite = data => http.post('favoriteChat', data); // Исправлено на favoriteChat
export const changeChatBlock = data => http.post('blackList', data);

// --- КАТАЛОГИ ---
export const getCatalogList = data => http.post('getCatalogs', data);
export const addChatToCatalog = data => http.post('addNewChatToCatalog', data);
export const createCatalog = data => http.post('createCatalog', data);
export const deleteCatalog = data => http.post('deleteCatalog', data);
export const removeChatFromCatalog = data =>
  http.post('removeChatFromCatalog', data);
export const changeCatalogName = data => http.post('updateNameCatalog', data);

// --- МОДЕРАЦИЯ (Проверь наличие этих роутов на бэкенде) ---
export const getOffersModeration = (data) => 
  http.get('all-offers', { params: data });

export const changeOfferStatus = (data) => 
  http.post('change-offer-status', data);