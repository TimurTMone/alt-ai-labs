export type Locale = 'en' | 'ru' | 'ky'

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ky: 'Кыргызча',
}

export const translations = {
  // ── Navigation ─────────────────────────────────────────
  nav: {
    dashboard: { en: 'Dashboard', ru: 'Главная', ky: 'Башкы бет' },
    drops: { en: 'Drops', ru: 'Дропы', ky: 'Дроптор' },
    classroom: { en: 'Classroom', ru: 'Класс', ky: 'Класс' },
    community: { en: 'Community', ru: 'Сообщество', ky: 'Коомчулук' },
    leaderboard: { en: 'Leaderboard', ru: 'Рейтинг', ky: 'Рейтинг' },
    groups: { en: 'Groups', ru: 'Группы', ky: 'Группалар' },
    profile: { en: 'Profile', ru: 'Профиль', ky: 'Профиль' },
    admin: { en: 'Admin', ru: 'Админ', ky: 'Админ' },
    signOut: { en: 'Sign Out', ru: 'Выйти', ky: 'Чыгуу' },
    allCommunities: { en: 'All Communities', ru: 'Все сообщества', ky: 'Бардык коомчулуктар' },
  },

  // ── Auth ───────────────────────────────────────────────
  auth: {
    welcomeBack: { en: 'Welcome to Alt AI Labs', ru: 'Добро пожаловать в Alt AI Labs', ky: 'Alt AI Labs\'ка кош келиңиз' },
    exploreDesc: { en: 'Explore the platform and see what builders are shipping.', ru: 'Изучите платформу и посмотрите, что создают разработчики.', ky: 'Платформаны изилдеп, иштеп чыгуучулар эмнелерди жасап жатканын көрүңүз.' },
    explorePlatform: { en: 'Explore the Platform', ru: 'Исследовать платформу', ky: 'Платформаны карап чыгуу' },
    joinWaitlist: { en: 'Join the Waitlist', ru: 'Записаться в список ожидания', ky: 'Күтүү тизмесине жазылуу' },
    continueWithGoogle: { en: 'Continue with Google', ru: 'Войти через Google', ky: 'Google менен кирүү' },
    orContinueWith: { en: 'or continue with', ru: 'или войти через', ky: 'же кирүү' },
    signInWithEmail: { en: 'sign in with email', ru: 'войти по email', ky: 'email менен кирүү' },
    email: { en: 'Email', ru: 'Электронная почта', ky: 'Электрондук почта' },
    password: { en: 'Password', ru: 'Пароль', ky: 'Сырсөз' },
    signIn: { en: 'Sign In', ru: 'Войти', ky: 'Кирүү' },
    signingIn: { en: 'Signing in...', ru: 'Вход...', ky: 'Кирүү...' },
    alreadyHaveAccount: { en: 'Already have an account?', ru: 'Уже есть аккаунт?', ky: 'Аккаунтуңуз барбы?' },
    signInFailed: { en: 'Sign in failed. Please try again.', ru: 'Ошибка входа. Попробуйте снова.', ky: 'Кирүү ишке ашкан жок. Кайра аракет кылыңыз.' },
  },

  // ── Dashboard ──────────────────────────────────────────
  dashboard: {
    welcomeBack: { en: 'Welcome back', ru: 'С возвращением', ky: 'Кош келиңиз' },
    watchBuildShip: { en: 'Watch the video. Do the challenge. Ship.', ru: 'Смотри видео. Делай челлендж. Отправляй.', ky: 'Видео көр. Челлендж жаса. Жөнөт.' },
    points: { en: 'Points', ru: 'Баллы', ky: 'Упайлар' },
    level: { en: 'Level', ru: 'Уровень', ky: 'Деңгээл' },
    completed: { en: 'Completed', ru: 'Завершено', ky: 'Аяктаган' },
    rank: { en: 'Rank', ru: 'Ранг', ky: 'Орун' },
    ptsToGo: { en: 'pts to go', ru: 'баллов осталось', ky: 'упай калды' },
    dayStreak: { en: 'day streak', ru: 'дней подряд', ky: 'күн катары менен' },
    bestStreak: { en: 'Best', ru: 'Лучший', ky: 'Эң жакшы' },
  },

  // ── Drops ──────────────────────────────────────────────
  drops: {
    title: { en: 'Drops', ru: 'Дропы', ky: 'Дроптор' },
    liveNow: { en: 'LIVE NOW', ru: 'СЕЙЧАС', ky: 'ЖАНДУУ' },
    comingSoon: { en: 'COMING SOON', ru: 'СКОРО', ky: 'ЖАКЫНДА' },
    active: { en: 'active', ru: 'активных', ky: 'активдүү' },
    upcoming: { en: 'upcoming', ru: 'предстоящих', ky: 'алдыдагы' },
    live: { en: 'LIVE', ru: 'LIVE', ky: 'ЖАНДУУ' },
    soon: { en: 'SOON', ru: 'СКОРО', ky: 'ЖАКЫНДА' },
    sponsoredBy: { en: 'Sponsored by', ru: 'Спонсор:', ky: 'Демөөрчү:' },
    submissions: { en: 'submissions', ru: 'работ', ky: 'тапшырмалар' },
    duration: { en: 'Duration', ru: 'Длительность', ky: 'Узактыгы' },
    access: { en: 'Access', ru: 'Доступ', ky: 'Мүмкүнчүлүк' },
    free: { en: 'Free', ru: 'Бесплатно', ky: 'Акысыз' },
    pro: { en: 'Pro', ru: 'Про', ky: 'Про' },
  },

  // ── Drop Detail ────────────────────────────────────────
  dropDetail: {
    challengeBrief: { en: 'Challenge Brief', ru: 'Описание челленджа', ky: 'Челлендж сүрөттөмөсү' },
    deliverables: { en: 'Deliverables', ru: 'Что нужно сдать', ky: 'Тапшыруулар' },
    rules: { en: 'Rules', ru: 'Правила', ky: 'Эрежелер' },
    watch: { en: 'Watch', ru: 'Смотреть', ky: 'Көрүү' },
    submit: { en: 'Submit', ru: 'Отправить', ky: 'Жөнөтүү' },
    submitBuild: { en: 'Submit Build', ru: 'Отправить работу', ky: 'Жумушту жөнөтүү' },
    submitting: { en: 'Submitting...', ru: 'Отправка...', ky: 'Жөнөтүлүүдө...' },
    buildSubmitted: { en: 'Build Submitted!', ru: 'Работа отправлена!', ky: 'Жумуш жөнөтүлдү!' },
    goodLuck: { en: 'Your submission is in. Good luck!', ru: 'Ваша работа принята. Удачи!', ky: 'Тапшырмаңыз кабыл алынды. Ийгилик!' },
    shareYourBuild: { en: 'Share your build', ru: 'Поделиться работой', ky: 'Жумушуңузду бөлүшүңүз' },
    communityBuilds: { en: 'Community Builds', ru: 'Работы сообщества', ky: 'Коомчулук жумуштары' },
    seeWhatOthersShipped: { en: 'See what others shipped — vote for the best', ru: 'Посмотрите работы других — голосуйте за лучших', ky: 'Башкалардын жумуштарын көрүңүз — эң жакшысына добуш бериңиз' },
    noSubmissionsYet: { en: 'No submissions yet. Be the first!', ru: 'Пока нет работ. Будьте первым!', ky: 'Азырынча тапшырма жок. Биринчи болуңуз!' },
    markAsWatched: { en: 'Mark as Watched', ru: 'Отметить как просмотренное', ky: 'Көрүлдү деп белгилөө' },
    prizePool: { en: 'Prize Pool', ru: 'Призовой фонд', ky: 'Сыйлык фонду' },
  },

  // ── Leaderboard ────────────────────────────────────────
  leaderboard: {
    title: { en: 'Leaderboard', ru: 'Рейтинг', ky: 'Рейтинг' },
    allBuilders: { en: 'ALL BUILDERS', ru: 'ВСЕ УЧАСТНИКИ', ky: 'БАРДЫК КАТЫШУУЧУЛАР' },
    noEntries: { en: 'No entries yet', ru: 'Пока нет участников', ky: 'Азырынча катышуучулар жок' },
  },

  // ── Community ──────────────────────────────────────────
  community: {
    title: { en: 'Community', ru: 'Сообщество', ky: 'Коомчулук' },
    subtitle: { en: 'Share your wins, ask questions, and connect with other builders.', ru: 'Делитесь победами, задавайте вопросы и общайтесь с другими.', ky: 'Жеңиштериңизди бөлүшүңүз, суроо бериңиз жана башкалар менен байланышыңыз.' },
    pinned: { en: 'Pinned', ru: 'Закреплено', ky: 'Кадалган' },
    all: { en: 'All', ru: 'Все', ky: 'Баары' },
    wins: { en: 'Wins', ru: 'Победы', ky: 'Жеңиштер' },
    questions: { en: 'Questions', ru: 'Вопросы', ky: 'Суроолор' },
    builds: { en: 'Builds', ru: 'Проекты', ky: 'Долбоорлор' },
    announcements: { en: 'Announcements', ru: 'Объявления', ky: 'Жарыялар' },
    writeComment: { en: 'Write a comment...', ru: 'Написать комментарий...', ky: 'Комментарий жазыңыз...' },
    noComments: { en: 'No comments yet. Be the first!', ru: 'Пока нет комментариев. Будьте первым!', ky: 'Комментарий жок. Биринчи болуңуз!' },
    noPosts: { en: 'No posts yet', ru: 'Пока нет постов', ky: 'Пост жок' },
    beFirst: { en: 'Be the first to share!', ru: 'Будьте первым!', ky: 'Биринчи болуңуз!' },
  },

  // ── Groups ─────────────────────────────────────────────
  groups: {
    title: { en: 'Groups', ru: 'Группы', ky: 'Группалар' },
    subtitle: { en: 'Join focused builder groups. Learn and build together.', ru: 'Присоединяйтесь к группам. Учитесь и стройте вместе.', ky: 'Группаларга кошулуңуз. Чогуу үйрөнүңүз жана жасаңыз.' },
    joinGroup: { en: 'Join Group', ru: 'Вступить', ky: 'Кошулуу' },
    requestToJoin: { en: 'Request to Join', ru: 'Запросить вступление', ky: 'Кошулуу сурамы' },
    joined: { en: 'Joined', ru: 'Вы участник', ky: 'Кошулдуңуз' },
    inviteOnly: { en: 'Invite Only', ru: 'Только по приглашению', ky: 'Чакыруу менен гана' },
    members: { en: 'members', ru: 'участников', ky: 'мүчө' },
  },

  // ── Profile ────────────────────────────────────────────
  profile: {
    title: { en: 'Profile', ru: 'Профиль', ky: 'Профиль' },
    manageAccount: { en: 'Manage your account and public profile.', ru: 'Управляйте аккаунтом и публичным профилем.', ky: 'Аккаунтуңузду жана жалпыга ачык профилиңизди башкарыңыз.' },
    viewPublicProfile: { en: 'View public profile →', ru: 'Открыть публичный профиль →', ky: 'Жалпыга ачык профилди көрүү →' },
    totalPoints: { en: 'Total Points', ru: 'Всего баллов', ky: 'Жалпы упай' },
    memberSince: { en: 'Member Since', ru: 'Участник с', ky: 'Мүчө болгон' },
    fullName: { en: 'Full Name', ru: 'Полное имя', ky: 'Толук аты' },
    bio: { en: 'Bio', ru: 'О себе', ky: 'Өзүм жөнүндө' },
    username: { en: 'Username', ru: 'Имя пользователя', ky: 'Колдонуучу аты' },
    socialLinks: { en: 'Social Links', ru: 'Социальные сети', ky: 'Социалдык тармактар' },
    saveChanges: { en: 'Save Changes', ru: 'Сохранить', ky: 'Сактоо' },
    saved: { en: 'Saved!', ru: 'Сохранено!', ky: 'Сакталды!' },
    signInToView: { en: 'Sign in to view your profile', ru: 'Войдите, чтобы увидеть профиль', ky: 'Профилди көрүү үчүн кириңиз' },
  },

  // ── AI Review ──────────────────────────────────────────
  ai: {
    reviewing: { en: 'AI reviewing your build...', ru: 'ИИ анализирует вашу работу...', ky: 'ЖИ жумушуңузду анализдеп жатат...' },
    usuallyTakes: { en: 'Usually takes 15-30 seconds', ru: 'Обычно 15-30 секунд', ky: 'Адатта 15-30 секунд' },
    aiReview: { en: 'AI Review', ru: 'ИИ Обзор', ky: 'ЖИ Баалоо' },
    poweredByClaude: { en: 'Powered by Claude', ru: 'На базе Claude', ky: 'Claude негизинде' },
    strengths: { en: 'STRENGTHS', ru: 'СИЛЬНЫЕ СТОРОНЫ', ky: 'КҮЧТҮҮ ЖАКТАРЫ' },
    levelUp: { en: 'LEVEL UP', ru: 'УЛУЧШИТЬ', ky: 'ЖАКШЫРТУУ' },
  },

  // ── Common ─────────────────────────────────────────────
  common: {
    loading: { en: 'Loading...', ru: 'Загрузка...', ky: 'Жүктөлүүдө...' },
    error: { en: 'Something went wrong', ru: 'Что-то пошло не так', ky: 'Бир нерсе туура эмес кетти' },
    repoLinked: { en: 'Repo linked', ru: 'Репо подключен', ky: 'Репо туташтырылды' },
    liveDemo: { en: 'Live demo', ru: 'Демо', ky: 'Демо' },
    video: { en: 'Video', ru: 'Видео', ky: 'Видео' },
    copyLink: { en: 'Copy link', ru: 'Копировать', ky: 'Шилтемени көчүрүү' },
    copied: { en: 'Copied!', ru: 'Скопировано!', ky: 'Көчүрүлдү!' },
    postOnX: { en: 'Post on X', ru: 'Пост в X', ky: 'X\'ке жазуу' },
    startBuildingToday: { en: 'Start building today', ru: 'Начните создавать сегодня', ky: 'Бүгүн баштаңыз' },
    account: { en: 'Account', ru: 'Аккаунт', ky: 'Аккаунт' },
  },
} as const

export type TranslationKey = keyof typeof translations
export type TranslationSubKey<K extends TranslationKey> = keyof (typeof translations)[K]
