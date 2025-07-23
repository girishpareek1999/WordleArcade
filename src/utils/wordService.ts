export type WordLength = 5 | 6 | 7;

export interface WordConfig {
  length: WordLength;
  maxGuesses: number;
}

export const WORD_CONFIGS: Record<WordLength, WordConfig> = {
  5: { length: 5, maxGuesses: 6 },
  6: { length: 6, maxGuesses: 6 },
  7: { length: 7, maxGuesses: 7 }
};

// Import word lists from JSON files
import words5Data from '../data/words-5.json';
import words6Data from '../data/words-6.json';
import words7Data from '../data/words-7.json';

// Extract word arrays from JSON
const WORDS_5: string[] = words5Data.words;
const WORDS_6: string[] = words6Data.words;
const WORDS_7: string[] = words7Data.words;

// Word lists mapped by length
const WORD_LISTS: Record<WordLength, string[]> = {
  5: WORDS_5,
  6: WORDS_6,
  7: WORDS_7
};

// Local word lists for each length (keeping old names for compatibility)
const FIVE_LETTER_WORDS = [
  "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
  "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE",
  "ALLOW", "ALONE", "ALONG", "ALTER", "AMONG", "ANGER", "ANGLE", "ANGRY", "APART", "APPLE",
  "APPLY", "ARENA", "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AVOID", "AWAKE", "AWARD",
  "AWARE", "BADLY", "BAKER", "BASIC", "BEACH", "BEGAN", "BEGIN", "BEING", "BELOW", "BENCH",
  "BILLY", "BIRTH", "BLACK", "BLAME", "BLANK", "BLIND", "BLOCK", "BLOOD", "BOARD", "BOOST",
  "BOOTH", "BOUND", "BRAIN", "BRAND", "BRAVE", "BREAD", "BREAK", "BREED", "BRIEF", "BRING",
  "BROAD", "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH",
  "CAUSE", "CHAIN", "CHAIR", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST",
  "CHIEF", "CHILD", "CHINA", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK",
  "CLIMB", "CLOCK", "CLOSE", "CLOUD", "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER",
  "CRAFT", "CRASH", "CRAZY", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CURVE",
  "CYCLE", "DAILY", "DANCE", "DATED", "DEALT", "DEATH", "DEBUT", "DELAY", "DEPTH", "DOING",
  "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRANK", "DREAM", "DRESS", "DRILL", "DRINK", "DRIVE",
  "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY", "ENJOY",
  "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA", "FAITH",
  "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST", "FIXED",
  "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM", "FOUND",
  "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT", "GIVEN",
  "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GRAVE", "GREAT",
  "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HARRY",
  "HEART", "HEAVY", "HENRY", "HORSE", "HOTEL", "HOUSE", "HUMAN", "IDEAL", "IMAGE", "INDEX",
  "INNER", "INPUT", "ISSUE", "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE", "KNOWN", "LABEL",
  "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL",
  "LEVEL", "LEWIS", "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOOSE", "LOWER", "LUCKY",
  "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MARIA", "MATCH", "MAYBE", "MAYOR",
  "MEANT", "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED", "MODEL", "MONEY", "MONTH",
  "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVED", "MOVIE", "MUSIC", "NEEDS", "NEVER",
  "NEWLY", "NIGHT", "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE", "OCCUR", "OCEAN", "OFFER",
  "OFTEN", "ORDER", "OTHER", "OUGHT", "PAINT", "PANEL", "PAPER", "PARTY", "PEACE", "PETER",
  "PHASE", "PHONE", "PHOTO", "PIANO", "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE",
  "PLANT", "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME", "PRINT",
  "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "QUEEN", "QUICK", "QUIET", "QUITE", "RADIO",
  "RAISE", "RANGE", "RAPID", "RATIO", "REACH", "READY", "REALM", "REBEL", "REFER", "RELAX",
  "REPLY", "RIGHT", "RIGID", "RIVER", "ROBIN", "ROGER", "ROMAN", "ROUGH", "ROUND", "ROUTE",
  "ROYAL", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE", "SENSE", "SERVE", "SEVEN", "SHALL",
  "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF", "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK",
  "SHOOT", "SHORT", "SHOWN", "SIGHT", "SILLY", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL",
  "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMITH", "SMOKE", "SNAKE", "SNOW", "SOLID",
  "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED", "SPEND", "SPENT",
  "SPLIT", "SPOKE", "SPORT", "SQUAD", "STAFF", "STAGE", "STAKE", "STAND", "START", "STATE",
  "STEAM", "STEEL", "STEEP", "STEER", "STEVE", "STICK", "STILL", "STOCK", "STONE", "STOOD",
  "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE",
  "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TEAM", "TEETH", "TERRY",
  "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK", "THING", "THINK",
  "THIRD", "THOSE", "THREE", "THREW", "THROW", "THUMB", "TIGER", "TIGHT", "TIMER", "TIRED",
  "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE", "TRAIN",
  "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUNK",
  "TRUST", "TRUTH", "TRYING", "TWICE", "UNCLE", "UNDER", "UNDUE", "UNION", "UNITY", "UNTIL",
  "UPPER", "URBAN", "USAGE", "USUAL", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOCAL",
  "VOICE", "WASTE", "WATCH", "WATER", "WHEEL", "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE",
  "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WRITE",
  "WRONG", "WROTE", "YOUNG", "YOUTH"
];

const SIX_LETTER_WORDS = [
  "ABROAD", "ACCEPT", "ACCESS", "ACROSS", "ACTING", "ACTION", "ACTIVE", "ACTUAL", "ADVICE", "ADVISE",
  "AFFECT", "AFFORD", "AFRAID", "AGENCY", "AGENDA", "AGREED", "ALLOWS", "ALMOST", "ALONE", "AMOUNT",
  "ANIMAL", "ANNUAL", "ANSWER", "ANYONE", "ANYWAY", "APPEAR", "AROUND", "ARRIVE", "ARTIST", "ASPECT",
  "ASSERT", "ASSESS", "ASSIST", "ASSUME", "ATTACK", "ATTEND", "AUGUST", "AUTHOR", "AUTUMN", "AVENUE",
  "BACKED", "BACKUP", "BARELY", "BATTLE", "BECAME", "BECOME", "BEFORE", "BEHALF", "BEHAVE", "BEHIND",
  "BELIEF", "BELONG", "BESIDE", "BETTER", "BEYOND", "BINARY", "BISHOP", "BORDER", "BOTTLE", "BOTTOM",
  "BOUGHT", "BRANCH", "BREATH", "BRIDGE", "BRIGHT", "BRINGS", "BROKEN", "BUDGET", "BURDEN", "BUREAU",
  "BUTTON", "CAMERA", "CANCER", "CANNOT", "CANVAS", "CAREER", "CARPET", "CASTLE", "CASUAL", "CAUGHT",
  "CAUSED", "CENTER", "CENTRE", "CHANCE", "CHANGE", "CHARGE", "CHOICE", "CHOOSE", "CHOSEN", "CHURCH",
  "CIRCLE", "CLIENT", "CLOSED", "CLOSER", "COFFEE", "COLUMN", "COMBAT", "COMING", "COMMIT", "COMMON",
  "COUPLE", "COURSE", "COVERS", "CREATE", "CREDIT", "CRISIS", "CUSTOM", "DAMAGE", "DANGER", "DEALER",
  "DEBATE", "DECADE", "DECIDE", "DEFEAT", "DEFEND", "DEFINE", "DEGREE", "DEMAND", "DEPEND", "DEPUTY",
  "DESERT", "DESIGN", "DESIRE", "DETAIL", "DETECT", "DEVICE", "DIFFER", "DINNER", "DIRECT", "DOCTOR",
  "DOMAIN", "DOUBLE", "DRIVEN", "DRIVER", "DURING", "EASILY", "EATING", "EDITOR", "EFFECT", "EFFORT",
  "EITHER", "ELEVEN", "EMPIRE", "EMPLOY", "ENABLE", "ENDING", "ENERGY", "ENGAGE", "ENGINE", "ENOUGH",
  "ENSURE", "ENTIRE", "EQUITY", "ESCAPE", "ESTATE", "ETHNIC", "EVENTS", "EXCEED", "EXCEPT", "EXPAND",
  "EXPECT", "EXPERT", "EXPORT", "EXTENT", "FABRIC", "FACIAL", "FACTOR", "FAILED", "FAIRLY", "FALLEN",
  "FAMILY", "FAMOUS", "FATHER", "FAVOUR", "FELLOW", "FEMALE", "FINGER", "FINISH", "FISCAL", "FLIGHT",
  "FLOWER", "FLYING", "FOLLOW", "FOOTER", "FOREST", "FORGET", "FORMAL", "FORMAT", "FORMER", "FOSTER",
  "FOUGHT", "FOURTH", "FREELY", "FRENCH", "FRIEND", "FROZEN", "FUNDED", "FUTURE", "GARDEN", "GATHER",
  "GENDER", "GENTLE", "GERMAN", "GLOBAL", "GOLDEN", "GOVERN", "GROUND", "GROWTH", "GUILTY", "HANDED",
  "HANDLE", "HARDLY", "HATRED", "HEADED", "HEALTH", "HEIGHT", "HIDDEN", "HOLDER", "HONEST", "HOPING",
  "HORROR", "HOTELS", "IMPACT", "IMPORT", "INCOME", "INDEED", "INDOOR", "INFANT", "INFORM", "INJURY",
  "INSIDE", "INTEND", "INTENT", "INVEST", "ISLAND", "ITSELF", "JERSEY", "JOINED", "JUNIOR", "KILLED",
  "LABOUR", "LADDER", "LADIES", "LAPTOP", "LARGER", "LATEST", "LATTER", "LAUNCH", "LAWYER", "LEADER",
  "LEAGUE", "LEARNS", "LEAVES", "LEGACY", "LENGTH", "LESSON", "LETTER", "LEVELS", "LIABLE", "LIKELY",
  "LINKED", "LIQUID", "LISTEN", "LITTLE", "LIVING", "LOCKED", "LONDON", "LONGER", "LOOKED", "LOSING",
  "LOVELY", "LOVING", "LUXURY", "MAINLY", "MAKING", "MANAGE", "MANNER", "MANUAL", "MARGIN", "MARINE",
  "MARKED", "MARKET", "MASTER", "MATTER", "MATURE", "MEDIUM", "MEMBER", "MEMORY", "MENTAL", "MERELY",
  "MIDDLE", "MILLER", "MINING", "MINUTE", "MIRROR", "MOBILE", "MODERN", "MODIFY", "MOMENT", "MONTHS",
  "MOTHER", "MOTION", "MOVING", "MURDER", "MUSCLE", "NATURE", "NEARBY", "NEARLY", "NEEDED", "NEEDLE",
  "NEPHEW", "NICELY", "NIGHTS", "NOBODY", "NORMAL", "NOTICE", "NOTION", "NUMBER", "OBJECT", "OBTAIN",
  "OFFICE", "OPENED", "OPTION", "ORANGE", "ORIGIN", "OUTPUT", "OXYGEN", "PACKED", "PALACE", "PAPERS",
  "PARENT", "PARTLY", "PASSED", "PATENT", "PATROL", "PAYING", "PEOPLE", "PERIOD", "PERMIT", "PERSON",
  "PHRASE", "PICKED", "PIECES", "PLACED", "PLANET", "PLAYED", "PLAYER", "PLEASE", "PLENTY", "POCKET",
  "POETRY", "POLICE", "POLICY", "POORLY", "PORTAL", "POTATO", "POUNDS", "POWDER", "PRAISE", "PRAYER",
  "PREFER", "PRETTY", "PRIEST", "PRINCE", "PRISON", "PROFIT", "PROPER", "PROVEN", "PUBLIC", "PURPLE",
  "PUSHED", "RACING", "RADIUS", "RAISED", "RANDOM", "RARELY", "RATHER", "RATING", "READER", "REALLY",
  "REASON", "RECALL", "RECENT", "RECORD", "REDUCE", "REFORM", "REFUSE", "REGARD", "REGION", "RELATE",
  "RELIEF", "REMAIN", "REMOTE", "REMOVE", "REPAIR", "REPEAT", "REPLAY", "REPORT", "RESCUE", "RESIST",
  "RESORT", "RESULT", "RETAIL", "RETIRE", "RETURN", "REVEAL", "REVIEW", "REWARD", "RIDING", "RISING",
  "ROBUST", "ROLLED", "ROUGHLY", "ROUTINE", "RUBBER", "RULING", "SAFELY", "SAFETY", "SALARY", "SAMPLE",
  "SAVING", "SAYING", "SCHEME", "SCHOOL", "SCREEN", "SCRIPT", "SEARCH", "SEASON", "SEATED", "SECOND",
  "SECRET", "SECTOR", "SECURE", "SEEING", "SELECT", "SENIOR", "SENSOR", "SERIAL", "SERIES", "SERVED",
  "SERVER", "SETTLE", "SEVERE", "SEXUAL", "SHADOW", "SHARED", "SHIELD", "SHOULD", "SHOWED", "SHOWER",
  "SIGNED", "SILVER", "SIMPLE", "SINGLE", "SISTER", "SIZING", "SKILLS", "SLIGHT", "SLOWLY", "SMOOTH",
  "SOCCER", "SOCIAL", "SOLELY", "SOLVED", "SOURCE", "SOVIET", "SPACES", "SPEAKS", "SPIDER", "SPIRIT",
  "SPOKEN", "SPREAD", "SPRING", "SQUARE", "STABLE", "STAGES", "STANDS", "STARTS", "STATED", "STATUE",
  "STATUS", "STAYED", "STEADY", "STOLEN", "STORED", "STORES", "STORMS", "STRAIN", "STRAND", "STREAM",
  "STREET", "STRESS", "STRIKE", "STRING", "STRONG", "STRUCK", "STUDIO", "STUPID", "SUBMIT", "SUBSET",
  "SUBTLE", "SUDDEN", "SUFFER", "SUMMER", "SUMMIT", "SUNDAY", "SUNSET", "SUPPLY", "SURELY", "SURVEY",
  "SWITCH", "SYMBOL", "SYSTEM", "TABLES", "TACKLE", "TAKING", "TALENT", "TALKED", "TARGET", "TAUGHT",
  "TENANT", "THANKS", "THEORY", "THIRTY", "THOUGH", "THREAD", "THREAT", "THROWN", "THRUST", "TICKET",
  "TIMBER", "TIMING", "TISSUE", "TITLED", "TOWARD", "TRACKS", "TRADED", "TRAGIC", "TRAINS", "TRAVEL",
  "TREATY", "TRENDS", "TRIBAL", "TROOPS", "TWELVE", "TWENTY", "UNABLE", "UNIQUE", "UNLESS", "UNLIKE",
  "UPDATE", "UPLOAD", "USEFUL", "VALLEY", "VALUES", "VARIED", "VECTOR", "VENDOR", "VERSUS", "VESSEL",
  "VICTIM", "VIEWED", "VIEWER", "VISION", "VISUAL", "VOLUME", "WAITED", "WALKED", "WANTED", "WARNED",
  "WEALTH", "WEAPON", "WEIGHT", "WIDELY", "WINDOW", "WINTER", "WISDOM", "WITHIN", "WIZARD", "WONDER",
  "WOODEN", "WORKED", "WORKER", "WORTHY", "WRITER", "YELLOW", "YEARLY"
];

const SEVEN_LETTER_WORDS = [
  "ABILITY", "ABSENCE", "ACADEMY", "ACCOUNT", "ACCUSED", "ACHIEVE", "ACQUIRE", "ADDRESS", "ADVANCE",
  "ADVERSE", "ADVISED", "ADVISER", "AGAINST", "AIRLINE", "AIRPORT", "ALCOHOL", "ALREADY", "AMAZING",
  "ANALYSE", "ANCIENT", "ANOTHER", "ANXIOUS", "ANYBODY", "APPLIED", "APPROVE", "ARCHIVE", "ARGUING",
  "ARRANGE", "ARTICLE", "ARTWORK", "ASSAULT", "ASSUMED", "ASSURED", "ATHLETE", "ATTEMPT", "ATTRACT",
  "AUCTION", "AUDIBLE", "AUDITOR", "AVERAGE", "AVOIDED", "AWESOME", "BACKING", "BALANCE", "BANKING",
  "BATTERY", "BECAUSE", "BEDROOM", "BENEFIT", "BICYCLE", "BIOLOGY", "BOMBING", "BOOKING", "BOROUGH",
  "BOULDER", "BRACKET", "BRIEFLY", "BROTHER", "BROUGHT", "BUILDER", "BURNING", "CABINET", "CALLING",
  "CAPABLE", "CAPITAL", "CAPTAIN", "CAPTION", "CAPTURE", "CAREFUL", "CARRIER", "CATALOG", "CEILING",
  "CENTRAL", "CENTURY", "CERTAIN", "CHAMBER", "CHANNEL", "CHAPTER", "CHARCOD", "CHARITY", "CHARLIE",
  "CHECKED", "CHICKEN", "CHICKEN", "CITIZEN", "CLASSIC", "CLIMATE", "CLOSING", "CLOTHES", "COASTAL",
  "COLLECT", "COLLEGE", "COMBINE", "COMMAND", "COMMENT", "COMPACT", "COMPANY", "COMPARE", "COMPETE",
  "COMPLEX", "CONCEPT", "CONCERN", "CONDUCT", "CONFIRM", "CONNECT", "CONSENT", "CONSIST", "CONTACT",
  "CONTAIN", "CONTENT", "CONTEST", "CONTEXT", "CONTROL", "CONVERT", "COOKING", "CORRECT", "CORRUPT",
  "COUNCIL", "COUNTER", "COUNTRY", "COURAGE", "COVERING", "CREATED", "CRYSTAL", "CULTURE", "CURRENT",
  "CURIOUS", "CUSTOMS", "CYCLING", "DEALING", "DECIDED", "DECLARE", "DEFAULT", "DELIVER", "DENSITY",
  "DEPOSIT", "DESKTOP", "DESPITE", "DESTROY", "DEVELOP", "DIAMOND", "DIGITAL", "DIPLOMA", "DISABLE",
  "DISASTER", "DISCUSS", "DISEASE", "DISPLAY", "DISPUTE", "DISTANT", "DIVERSE", "DIVIDED", "DIVORCE",
  "DOLLARS", "DRAWING", "DRESSED", "DRIVING", "DROPPED", "EASTERN", "ECONOMY", "EDITION", "ELECTED",
  "ELEMENT", "EMOTION", "EMPEROR", "ENABLED", "ENGAGED", "ENGLISH", "ENHANCE", "ENQUIRY", "EPISODE",
  "EQUALLY", "EVENING", "EXACTLY", "EXAMINE", "EXAMPLE", "EXCITED", "EXCLUDE", "EXERCISE", "EXHIBIT",
  "EXPLAIN", "EXPLORE", "EXPRESS", "EXTREME", "FACTORY", "FACULTY", "FAILURE", "FANTASY", "FASHION",
  "FEATURE", "FEDERAL", "FEELING", "FICTION", "FIFTEEN", "FINANCE", "FINDING", "FIREARM", "FISHING",
  "FITNESS", "FOREIGN", "FOREVER", "FORMULA", "FORTUNE", "FORWARD", "FOUNDER", "FREEDOM", "FREIGHT",
  "GALLERY", "GARBAGE", "GENERAL", "GENUINE", "GETTING", "GRAPHIC", "GREATER", "GROWING", "HABITAT",
  "HANGING", "HEADING", "HEALTHY", "HEARING", "HEAVILY", "HELPING", "HERSELF", "HIGHWAY", "HIMSELF",
  "HISTORY", "HOLIDAY", "HOUSING", "HOWEVER", "HUNDRED", "HUNTING", "HUSBAND", "IMAGINE", "IMAGING",
  "IMPROVE", "INCLUDE", "INITIAL", "INQUIRY", "INSIGHT", "INSTALL", "INSTANT", "INSTEAD", "INVOICE",
  "INVOLVE", "JANUARY", "JEALOUS", "JOURNEY", "JUSTICE", "JUSTIFY", "KITCHEN", "KNOWING", "LARGELY",
  "LASTING", "LAUNDRY", "LAWSUIT", "LEADING", "LEARNED", "LEATHER", "LECTURE", "LEISURE", "LIBRARY",
  "LICENSE", "LIMITED", "LINKING", "LISTING", "MACHINE", "MANAGER", "MANKIND", "MARRIED", "MASSIVE",
  "MAXIMUM", "MEANING", "MEDICAL", "MEETING", "MENTION", "MESSAGE", "METHOD", "MILLION", "MINERAL",
  "MINIMUM", "MIRACLE", "MISSION", "MISTAKE", "MIXTURE", "MONITOR", "MORNING", "MYSTERY", "NATURAL",
  "NETWORK", "NEUTRAL", "NUCLEAR", "NURSING", "OBVIOUS", "OFFENSE", "OFFICER", "OPENING", "OPINION",
  "OPPOSED", "OPTICAL", "ORGANIC", "ORIGINAL", "OVERALL", "PACKAGE", "PAINTER", "PARKING", "PARTIAL",
  "PARTNER", "PASSAGE", "PASSIVE", "PATIENT", "PATTERN", "PAYMENT", "PENALTY", "PENDING", "PENSION",
  "PERFECT", "PERFORM", "PERHAPS", "PERSIAN", "PICTURE", "PIONEER", "PLASTIC", "PLAYING", "PLEASED",
  "POPULAR", "PORTION", "POVERTY", "PRECISE", "PREDICT", "PREMIER", "PREMIUM", "PREPARE", "PRESENT",
  "PREVENT", "PRIMARY", "PRINTER", "PRIVACY", "PRIVATE", "PROBLEM", "PRODUCE", "PRODUCT", "PROFILE",
  "PROJECT", "PROMISE", "PROTECT", "PROTEST", "PROVIDE", "PURPOSE", "PUSHING", "PUTTING", "PYRAMID",
  "QUALITY", "QUARTER", "RADICAL", "RAILWAY", "READILY", "READING", "REALITY", "RECEIPT", "RECEIVE",
  "RECOVER", "REFLECT", "REFUSAL", "REGULAR", "RELATED", "RELEASE", "REMAINS", "REMOVAL", "REPLACE",
  "REQUEST", "REQUIRE", "RESERVE", "RESOLVE", "RESPECT", "RESPOND", "RESTORE", "RETIRED", "REVENUE",
  "REVERSE", "ROUTINE", "RUNNING", "RUSSIAN", "SATISFIED", "SCIENCE", "SCRATCH", "SECTION", "SEGMENT",
  "SELLING", "SENATOR", "SERIOUS", "SERVICE", "SESSION", "SETTING", "SEVERAL", "SHARING", "SHELTER",
  "SHERIFF", "SHORTLY", "SHOWING", "SIMILAR", "SITTING", "SIXTEEN", "SMOKING", "SOCIETY", "SOLDIER",
  "SOMEHOW", "SOMEONE", "SPEAKER", "SPECIAL", "STATION", "STORAGE", "STRANGE", "STRETCH", "STUDENT",
  "STUDIED", "SUBJECT", "SUCCESS", "SUDDENLY", "SUGGEST", "SUMMARY", "SUPPORT", "SUPPOSE", "SURFACE",
  "SURGERY", "SURPLUS", "SURVIVE", "SUSPECT", "SWEATER", "SYMPTOM", "TALKING", "TEACHER", "TEENAGE",
  "TELLING", "TENANCY", "TEXTILE", "THEATER", "THERAPY", "THEREBY", "THOUGHT", "THROUGH", "TONIGHT",
  "TOTALLY", "TOWARDS", "TRADING", "TRAFFIC", "TRAINED", "TRAINER", "TROUBLE", "TYPICAL", "UNKNOWN",
  "UNUSUAL", "UPGRADE", "UTILITY", "VARIETY", "VARIOUS", "VEHICLE", "VERSION", "VETERAN", "VILLAGE",
  "VISITOR", "VOLUME", "WALKING", "WANTING", "WARNING", "WARRANT", "WEALTHY", "WEATHER", "WEBSITE",
  "WEEKEND", "WELCOME", "WESTERN", "WHETHER", "WILLING", "WINNING", "WITHOUT", "WORKING", "WORRIED",
  "WRITING", "WRITTEN"
];

export class WordService {
  // Cache for API validation results to avoid repeated calls
  private static validationCache: Map<string, boolean> = new Map();
  
  // Local words as fallback
  private static wordsByLength: Map<WordLength, string[]> = new Map([
    [5, WORD_LISTS[5]],
    [6, WORD_LISTS[6]], 
    [7, WORD_LISTS[7]]
  ]);

  static getRandomWord(length: WordLength): string {
    const wordList = this.wordsByLength.get(length);
    if (!wordList || wordList.length === 0) {
      throw new Error(`No words found for length ${length}`);
    }
    
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  // Enhanced word validation using multiple APIs
  static async isValidWord(word: string, length: WordLength): Promise<boolean> {
    const upperWord = word.toUpperCase();
    
    // First check: basic word pattern validation
    if (!this.isValidWordPattern(upperWord, length)) {
      return false;
    }
    
    // Check cache first
    if (this.validationCache.has(upperWord)) {
      return this.validationCache.get(upperWord)!;
    }

    // Check local words first for instant validation
    const localWordList = this.wordsByLength.get(length);
    if (localWordList?.includes(upperWord)) {
      this.validationCache.set(upperWord, true);
      return true;
    }

    try {
      // Try multiple API endpoints for validation
      const isValid = await this.validateWordWithAPIs(upperWord, length);
      this.validationCache.set(upperWord, isValid);
      return isValid;
    } catch (error) {
      console.warn('API validation failed, using local fallback:', error);
      // Fallback to local validation only (strict)
      const isValid = localWordList?.includes(upperWord) || false;
      this.validationCache.set(upperWord, isValid);
      return isValid;
    }
  }

  // Synchronous version for backward compatibility - STRICT validation only
  static isValidWordSync(word: string, length: WordLength): boolean {
    const upperWord = word.toUpperCase();
    
    // First check: basic word pattern validation
    if (!this.isValidWordPattern(upperWord, length)) {
      return false;
    }
    
    const wordList = this.wordsByLength.get(length);
    return wordList?.includes(upperWord) || false;
  }

  // Helper method to validate basic word patterns
  private static isValidWordPattern(word: string, length: WordLength): boolean {
    // Must be exact length
    if (word.length !== length) {
      return false;
    }
    
    // Must contain only letters
    if (!/^[A-Z]+$/.test(word)) {
      return false;
    }
    
    // Reject obvious nonsense patterns
    if (this.isNonsensePattern(word)) {
      return false;
    }
    
    return true;
  }

  // Detect obvious nonsense word patterns
  private static isNonsensePattern(word: string): boolean {
    // Check for consecutive identical letters (more than 2)
    if (/(.)\1{2,}/.test(word)) {
      return true;
    }
    
    // Check for common keyboard patterns
    const keyboardPatterns = [
      'QWERT', 'ASDF', 'ZXCV', 'POIUY', 'LKJH', 'MNBV',
      'QWER', 'WERT', 'ERTY', 'RTYU', 'TYUI', 'YUIO', 'UIOP',
      'ASDF', 'SDFG', 'DFGH', 'FGHJ', 'GHJK', 'HJKL',
      'ZXCV', 'XCVB', 'CVBN', 'VBNM'
    ];
    
    for (const pattern of keyboardPatterns) {
      if (word.includes(pattern)) {
        return true;
      }
    }
    
    // Check for alphabetical sequences
    for (let i = 0; i < word.length - 2; i++) {
      const charCode1 = word.charCodeAt(i);
      const charCode2 = word.charCodeAt(i + 1);
      const charCode3 = word.charCodeAt(i + 2);
      
      // Check for ascending sequence (ABC, DEF, etc.)
      if (charCode2 === charCode1 + 1 && charCode3 === charCode2 + 1) {
        return true;
      }
      
      // Check for descending sequence (CBA, FED, etc.)
      if (charCode2 === charCode1 - 1 && charCode3 === charCode2 - 1) {
        return true;
      }
    }
    
    // Check for lack of vowels (words should have at least one vowel or Y)
    if (!/[AEIOUY]/.test(word)) {
      return true;
    }
    
    // Check for too many consonants in a row (more than 3)
    if (/[BCDFGJKLMNPQRSTVWXZ]{4,}/.test(word)) {
      return true;
    }
    
    return false;
  }

  private static async validateWordWithAPIs(word: string, length: WordLength): Promise<boolean> {
    const validationPromises = [
      this.validateWithDataMuse(word, length),
      this.validateWithDictionaryAPI(word)
    ];

    try {
      // Use Promise.allSettled to get results from all APIs
      const results = await Promise.allSettled(validationPromises);
      
      let validCount = 0;
      let totalAttempts = 0;
      
      // Count successful validations
      for (const result of results) {
        if (result.status === 'fulfilled') {
          totalAttempts++;
          if (result.value === true) {
            validCount++;
          }
        }
      }
      
      // Require at least one API to confirm validity
      return totalAttempts > 0 && validCount > 0;
    } catch (error) {
      console.warn('All API validations failed:', error);
      return false;
    }
  }

  private static async validateWithDataMuse(word: string, length: WordLength): Promise<boolean> {
    try {
      const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=5`);
      if (!response.ok) return false;
      
      const words = await response.json();
      
      // Look for exact match with proper filtering
      const exactMatch = words.find((w: any) => {
        const apiWord = w.word.toUpperCase();
        return apiWord === word && 
               apiWord.length === length && 
               /^[A-Z]+$/.test(apiWord) &&
               !this.isNonsensePattern(apiWord);
      });
      
      return !!exactMatch;
    } catch {
      return false;
    }
  }

  private static async validateWithDictionaryAPI(word: string): Promise<boolean> {
    try {
      // Free Dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      
      if (!response.ok) return false;
      
      const data = await response.json();
      
      // Check if we got valid dictionary data
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        // Verify it has meanings (not just a word that exists)
        return entry.meanings && Array.isArray(entry.meanings) && entry.meanings.length > 0;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  static getWordCount(length: WordLength): number {
    const wordList = this.wordsByLength.get(length);
    return wordList?.length || 0;
  }

  static getAllWordsForLength(length: WordLength): string[] {
    return this.wordsByLength.get(length) || [];
  }

  // Enhanced API method using multiple sources for word fetching
  static async fetchRandomWordFromAPI(length: WordLength): Promise<string> {
    try {
      // Try different approaches to get random words
      const fetchPromises = [
        this.fetchFromDataMuse(length),
        this.fetchFromWordnik(length),
        this.fetchRandomFromLocal(length)
      ];

      // Use Promise.allSettled to try all sources
      const results = await Promise.allSettled(fetchPromises);
      
      // Return the first successful result
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
      }
      
      // Final fallback to local words
      return this.getRandomWord(length);
    } catch (error) {
      console.warn('API fetch failed, using local words:', error);
      return this.getRandomWord(length);
    }
  }

  private static async fetchFromDataMuse(length: WordLength): Promise<string | null> {
    try {
      const pattern = '?'.repeat(length);
      const response = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=1000`);
      
      if (!response.ok) return null;
      
      const apiWords = await response.json();
      
      if (apiWords && apiWords.length > 0) {
        const validWords = apiWords
          .map((item: any) => item.word.toUpperCase())
          .filter((word: string) => 
            word.length === length && 
            /^[A-Z]+$/.test(word) &&
            !word.includes('-') &&
            !word.includes("'") &&
            !word.includes(' ')
          );
        
        if (validWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * validWords.length);
          return validWords[randomIndex];
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  private static async fetchFromWordnik(length: WordLength): Promise<string | null> {
    try {
      // Get random words from Wordnik API
      const response = await fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=${length}&maxLength=${length}&limit=50&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`);
      
      if (!response.ok) return null;
      
      const words = await response.json();
      
      if (words && words.length > 0) {
        const validWords = words
          .map((item: any) => item.word.toUpperCase())
          .filter((word: string) => 
            word.length === length && 
            /^[A-Z]+$/.test(word) &&
            !word.includes('-') &&
            !word.includes("'") &&
            !word.includes(' ')
          );
        
        if (validWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * validWords.length);
          return validWords[randomIndex];
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  private static async fetchRandomFromLocal(length: WordLength): Promise<string> {
    // Enhanced local selection with better randomization
    const wordList = this.wordsByLength.get(length);
    if (!wordList || wordList.length === 0) {
      throw new Error(`No words found for length ${length}`);
    }
    
    // Use crypto.getRandomValues for better randomness if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const randomIndex = array[0] % wordList.length;
      return wordList[randomIndex];
    }
    
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  // Clear validation cache (useful for testing or memory management)
  static clearValidationCache(): void {
    this.validationCache.clear();
  }
}
