export type WeightEntry = { weight: number; label: string; italic?: boolean; italicAngle?: number };

export type FontConfig = {
  name: string;
  family: string;
  defaultText: string;
  sampleText: string;
  category: string;
  script: string;
  year: string;
  weights: WeightEntry[];
  charset: {
    uppercase?: string;
    lowercase?: string;
    numerals?: string;
    punctuation?: string;
    hebrew?: string;
  };
  features: string[];
  featureShowcase?: { feature: string; before: string; after: string }[];
  themedContent?: { text: string; footnote: string }[];
  hebrewThemedContent?: { text: string; footnote: string }[];
  aboutInfo?: string;
  hebrewAboutInfo?: string;
  hebrewName?: string;
  isVariable?: boolean;
  variableAxes?: { axis: string; min: number; max: number; default: number }[];
  tags: string[];
  testerSizes?: number[];
};

export const FONT_DATA: Record<string, FontConfig> = {
  neoklass: {
    name: "NeoKlass",
    hebrewName: "נאוקלאס",
    family: "Neoklass",
    defaultText: "NeoKlass Neo-Grotesque",
    sampleText: "The quick brown fox jumps over the lazy dog. 0123456789",
    category: "Sans-Serif",
    script: "Latin + Hebrew",
    year: "2024",
    tags: ["Sans-serif", "Latin + Hebrew", "Grotesque"],
    weights: [
      { weight: 100, label: "Thin" },
      { weight: 100, label: "Thin Italic", italic: true },
      { weight: 300, label: "Light" },
      { weight: 300, label: "Light Italic", italic: true },
      { weight: 400, label: "Regular" },
      { weight: 400, label: "Italic", italic: true },
      { weight: 500, label: "Medium" },
      { weight: 500, label: "Medium Italic", italic: true },
      { weight: 700, label: "Bold" },
      { weight: 700, label: "Bold Italic", italic: true },
      { weight: 900, label: "Black" },
      { weight: 900, label: "Black Italic", italic: true },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…/@#$%&*+={}<>[]|\\~^_`",
      hebrew: "אבגדהוזחטיכךלמםנןסעפףצץקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "onum", "lnum", "pnum", "tnum", "frac", "salt", "ss01", "ss02", "smcp", "c2sc"],
    featureShowcase: [
      { feature: "liga", before: "fi fl ff ffi", after: "fi fl ff ffi" },
      { feature: "frac", before: "1/2 1/4 3/4", after: "1/2 1/4 3/4" },
      { feature: "onum", before: "0123456789", after: "0123456789" },
      { feature: "smcp", before: "Small Caps", after: "Small Caps" },
    ],
    themedContent: [
      { 
        text: "The Roman Empire was the post-Republican period of ancient Rome. As a polity, it included large territorial holdings around the Mediterranean Sea in Europe, North Africa, and Western Asia, ruled by emperors.", 
        footnote: "[1] Wikipedia, \"Roman Empire\", 2026."
      },
      { 
        text: "Senatus Populusque Romanus (SPQR) is an emblematic abbreviated phrase referring to the government of the ancient Roman Republic.", 
        footnote: "[2] Wikipedia, \"SPQR\", 2026."
      },
      { 
        text: "The Latin alphabet, also known as the Roman alphabet, is the set of letters originally used by the ancient Romans to write the Latin language.", 
        footnote: "[3] Wikipedia, \"Latin Alphabet\", 2026."
      },
      { 
        text: "Augustus was the first Roman emperor, reigning from 27 BC until his death in AD 14. He is known as the founder of the Roman Empire.", 
        footnote: "[4] Wikipedia, \"Augustus\", 2026."
      },
      { 
        text: "The Column of Trajan is a Roman triumphal column in Rome, Italy, that commemorates Roman emperor Trajan's victory in the Dacian Wars.", 
        footnote: "[5] Wikipedia, \"Trajan's Column\", 2026."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "האימפריה הרומית הייתה מדינה רומית שהתקיימה באגן הים התיכון מימי אוגוסטוס ועד נפילת האימפריה הרומית המערבית.", 
        footnote: "[1] ויקיפדיה, \"האימפריה הרומית\", 2026."
      },
      { 
        text: "SPQR הוא ראשי תיבות של הביטוי הלטיני Senatus Populusque Romanus, שפירושו \"הסנאט והעם של רומא\".", 
        footnote: "[2] ויקיפדיה, \"SPQR\", 2026."
      },
      { 
        text: "האלפבית הלטיני הוא מערכת אותיות ששימשה במקור את הרומאים הקדומים לכתיבת השפה הלטינית.", 
        footnote: "[3] ויקיפדיה, \"אלפבית לטיני\", 2026."
      },
      { 
        text: "אוגוסטוס היה קיסר רומא הראשון, ששלט בין השנים 27 לפנה\"ס ל-14 לספירה. הוא נחשב למייסד האימפריה הרומית.", 
        footnote: "[4] ויקיפדיה, \"אוגוסטוס\", 2026."
      },
      { 
        text: "עמוד טראיאנוס הוא עמוד ניצחון רומי ברומא, איטליה, המנציח את ניצחונו של הקיסר טראיאנוס במלחמות הדאקיות.", 
        footnote: "[5] ויקיפדיה, \"עמוד טראיאנוס\", 2026."
      }
    ],
    aboutInfo: "A sans-serif font that combines the precision and innovation of the grotesque style (early 19th century) with the warmth and tradition of humanist fonts originating from Roman lettering. This fusion of worlds allows for versatile use that works well in small text, while giving a stage to fine details at headline sizes. With its decisive angles, contrast, and abstract forms, NeoKlass can flatter complex designs and elevate simple typesetting. It started as a school project during the Master's in Type Design at ECAL.",
    hebrewAboutInfo: "פונט סנס־סריפי שמשלב את הדיוק והחדשנות של הסגנון הגרוטסקי (תחילת המאה ה-19) יחד עם החום והמסורת של פונטים הומניסטים שמקורם בכיתוב רומאי. מיזוג עולמות זה מאפשר שימוש ורסטילי שעובד בטקסט קטן ונותן במה לפרטים בגודל כותרות. עם זוויות החלטיות, קונטרסט, וצורות מופשטות, נאוקלאס יכול להחמיא לעיצוב מורכב ולהרים עימוד פשוט. עוצב במסגרת תואר שני בעיצוב אותיות בלוזאן, שוויץ."
  },
  dafna: {
    name: "Dafna",
    hebrewName: "דפנה",
    family: "Dafna",
    defaultText: "Dafna Classic Serif דפנה",
    sampleText: "The quick brown fox jumps over the lazy dog. 0123456789",
    category: "Serif",
    script: "Latin + Hebrew",
    year: "2026",
    tags: ["Serif", "Latin + Hebrew", "In process"],
    weights: [
      { weight: 300, label: "Light" },
      { weight: 300, label: "Light Italic", italic: true },
      { weight: 400, label: "Regular" },
      { weight: 400, label: "Italic", italic: true },
      { weight: 500, label: "Medium" },
      { weight: 500, label: "Medium Italic", italic: true },
      { weight: 700, label: "Bold" },
      { weight: 700, label: "Bold Italic", italic: true },
      { weight: 900, label: "Black" },
      { weight: 900, label: "Black Italic", italic: true },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…/@#$%&*+={}<>[]|\\~^_`",
      hebrew: "אבגדהוזחטיכךלמםנןסעפףצץקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "onum", "lnum", "pnum", "tnum", "frac", "salt", "ss01", "swsh"],
    featureShowcase: [
      { feature: "onum", before: "0123456789", after: "0123456789" },
      { feature: "salt", before: "Q R K", after: "Q R K" },
      { feature: "ss01", before: "Classic", after: "Classic" },
      { feature: "liga", before: "fb fh fj fk", after: "fb fh fj fk" },
    ],
    themedContent: [
      { 
        text: "The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner's luck, improvisation and believing in the universe. The Fool is numbered 0 – the number of unlimited potential – and therefore does not have a specific place in the sequence of the Tarot cards. The Fool can be placed either at the beginning of the Major Arcana or at the end. The Major Arcana is often considered the Fool's journey through life and as such, he is ever present and therefore needs no number.", 
        footnote: "[1] Wikipedia, \"The Fool (Tarot card)\", 2026."
      },
      { 
        text: "Tarot cards are used throughout much of Europe to play Tarot card games. In English-speaking countries, where the games are largely unknown, Tarot cards came to be utilized primarily for divinatory purposes. The design of the cards incorporates profound symbolism, drawing from classical imagery, astrology, and mystical traditions to reflect the archetypal experiences of the human condition.", 
        footnote: "[2] Wikipedia, \"Tarot\", 2026."
      },
      { 
        text: "The High Priestess is the second trump or Major Arcana card in most traditional Tarot decks. This card represents intuition, mystery, and knowledge.", 
        footnote: "[3] Wikipedia, \"The High Priestess\", 2026."
      },
      { 
        text: "Astrology is a range of divinatory practices, recognized as pseudoscientific, that claim to discern information about human affairs.", 
        footnote: "[4] Wikipedia, \"Astrology\", 2026."
      },
      { 
        text: "Alchemy is an ancient branch of natural philosophy, a philosophical and protoscientific tradition that was historically practiced.", 
        footnote: "[5] Wikipedia, \"Alchemy\", 2026."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "השוטה מייצג התחלות חדשות, אמונה בעתיד, חוסר ניסיון, חוסר ידיעה למה לצפות, מזל של מתחילים, אלתור ואמונה ביקום. השוטה ממוספר 0 – המספר של הפוטנציאל הבלתי מוגבל – ולכן אין לו מקום ספציפי ברצף של קלפי הטארות. ניתן למקם את השוטה בתחילת הארקנה הגדולה או בסופה. הארקנה הגדולה נחשבת לעתים קרובות למסעו של השוטה דרך החיים וככזה, הוא נוכח תמיד ולכן אינו זקוק למספר.", 
        footnote: "[1] ויקיפדיה, \"השוטה (קלף טארוט)\", 2026."
      },
      { 
        text: "קלפי טארוט משמשים ברחבי רוב אירופה למשחקי קלפים. במדינות דוברות אנגלית, שבהן המשחקים אינם מוכרים במיוחד, קלפי הטארות נוצלו בעיקר למטרות גילוי עתידות. העיצוב של הקלפים משלב סמליות עמוקה, השואבת מדימויים קלאסיים, אסטרולוגיה ומסורות מיסטיות כדי לשקף את החוויות הארכיטיפיות של המצב האנושי.", 
        footnote: "[2] ויקיפדיה, \"טארוט\", 2026."
      },
      { 
        text: "הכוהנת הגדולה היא קלף העלה השני או הארקנה הגדולה ברוב חפיסות הטארות המסורתיות. קלף זה מייצג אינטואיציה, מסתורין וידע.", 
        footnote: "[3] ויקיפדיה, \"הכוהנת הגדולה\", 2026."
      },
      { 
        text: "אסטרולוגיה היא סדרה של פרקטיקות גילוי עתידות, המוכרות כפסאודו-מדעיות, הטוענות להסיק מידע על ענייני אנוש.", 
        footnote: "[4] ויקיפדיה, \"אסטרולוגיה\", 2026."
      },
      { 
        text: "אלכימיה היא ענף עתיק של פילוסופיית הטבע, מסורת פילוסופית וקדם-מדעית שנהגה באופן היסטורי.", 
        footnote: "[5] ויקיפדיה, \"אלכימיה\", 2026."
      }
    ],
    aboutInfo: "Dafna began as a meticulous revival of the early 20th-century German typeface Säculum, before evolving into an extensive, contemporary text family. The design balances historical references with modern editorial needs, offering five weights from Light to Black with matching Italics. Featuring various figure styles, elegant swashes, and full Hebrew set, it is designed for sophisticated, immersive reading environments.",
    hebrewAboutInfo: "דפנה החל כחידוש מוקפד של הפונט הגרמני סקולום (Säculum) מתחילת המאה ה-20, לפני שהתפתח למשפחת טקסט עכשווית ומקיפה. העיצוב מאזן בין רפרנסים היסטוריים לצרכי עריכה מודרניים, ומציע חמישה משקלים מ-Light עד Black עם אותיות נטויות תואמות. הפונט כולל סגנונות ספרות שונים, עיטורים אלגנטיים (Swashes) ומערכת עברית עיצובית מלאה, ומיועד לסביבות קריאה מתוחכמות ורציפות."
  },
  monoklass: {
    name: "MonoKlass",
    hebrewName: "מונוקלאס",
    family: "Monoklass",
    defaultText: "Mono-Klass Monospaced",
    sampleText: "The quick brown fox jumps over the lazy dog. 0123456789",
    category: "Monospaced",
    script: "Latin + Hebrew",
    year: "2024",
    tags: ["Sans-serif", "Latin + Hebrew", "Monospace", "In process"],
    weights: [
      { weight: 300, label: "Light" },
      { weight: 300, label: "Light Italic", italic: true },
      { weight: 400, label: "Regular" },
      { weight: 400, label: "Italic", italic: true },
      { weight: 500, label: "Medium" },
      { weight: 500, label: "Medium Italic", italic: true },
      { weight: 700, label: "Bold" },
      { weight: 700, label: "Bold Italic", italic: true },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…/@#$%&*+={}<>[]|\\~^_`",
      hebrew: "אבגדהוזחטיכךלמםנןסעפףצץקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "onum", "lnum", "pnum", "tnum", "frac", "salt", "ss01", "ss02"],
    featureShowcase: [
      { feature: "tnum", before: "0123456789", after: "0123456789" },
      { feature: "frac", before: "1/2 1/4 3/4", after: "1/2 1/4 3/4" },
      { feature: "salt", before: "a g y", after: "a g y" },
      { feature: "ss01", before: "Alternative", after: "Alternative" },
    ],
    themedContent: [
      { 
        text: "Chess is a game of strategy between two players, played on a checkered board with 64 squares arranged in an 8x8 grid. Each player begins with 16 pieces: one king, one queen, two rooks, two knights, two bishops, and eight pawns.", 
        footnote: "[1] Wikipedia, \"Chess\", 2026."
      },
      { 
        text: "Deep Blue was a chess-playing expert system run on a specialized IBM supercomputer. It was the first computer chess-playing system to win both a chess game and a chess match against a reigning world champion, Garry Kasparov, in 1997.", 
        footnote: "[2] Wikipedia, \"Deep Blue (chess computer)\", 2026."
      },
      { 
        text: "The Sicilian Defense is a chess opening that begins with the moves: 1. e4 c5. It is the most popular and best-scoring response to White's first move 1. e4.", 
        footnote: "[3] Wikipedia, \"Sicilian Defense\", 2026."
      },
      { 
        text: "Bobby Fischer was an American chess grandmaster and the eleventh World Chess Champion. Many consider him to be one of the greatest chess players of all time.", 
        footnote: "[4] Wikipedia, \"Bobby Fischer\", 2026."
      },
      { 
        text: "The Queen's Gambit is one of the oldest known chess openings and continues to be played at the highest levels of the game today.", 
        footnote: "[5] Wikipedia, \"Queen's Gambit\", 2026."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "שחמט הוא משחק אסטרטגיה בין שני שחקנים, הנערך על לוח מרובע עם 64 משבצות המסודרות ברשת של 8x8. כל שחקן מתחיל עם 16 כלים: מלך אחד, מלכה אחת, שני צריחים, שני פרשים, שני רצים ושמונה רגלים.", 
        footnote: "[1] ויקיפדיה, \"שחמט\", 2026."
      },
      { 
        text: "דיפ בלו הייתה מערכת מומחית למשחק שחמט שפעלה על גבי מחשב-על ייעודי של יבמ. היא הייתה המערכת הממוחשבת הראשונה שניצחה משחק שחמט ודו-קרב שחמט נגד אלוף עולם מכהן, גארי קספרוב, בשנת 1997.", 
        footnote: "[2] ויקיפדיה, \"דיפ בלו\", 2026."
      },
      { 
        text: "ההגנה הסיציליאנית היא פתיחת שחמט המתחילה במהלכים: 1. e4 c5. זוהי התגובה הפופולרית ביותר והמשיגה את התוצאות הטובות ביותר למהלך הראשון של הלבן 1. e4.", 
        footnote: "[3] ויקיפדיה, \"ההגנה הסיציליאנית\", 2026."
      },
      { 
        text: "בובי פישר היה רב-אמן שחמט אמריקאי ואלוף העולם ה-11 בשחמט. רבים מחשיבים אותו לאחד מגדולי שחקני השחמט בכל הזמנים.", 
        footnote: "[4] ויקיפדיה, \"בובי פישר\", 2026."
      },
      { 
        text: "גמביט המלכה היא אחת מפתיחות השחמט העתיקות ביותר המוכרות וממשיכה להיות משוחקת ברמות הגבוהות ביותר של המשחק כיום.", 
        footnote: "[5] ויקיפדיה, \"גמביט המלכה\", 2026."
      }
    ],
    aboutInfo: "MonoKlass is a monospaced version of NeoKlass, taking the same approach of concise and utilitarian design with character to define the shape of the letters. It is meant for small-sized texts and technical information such as footnotes.",
    hebrewAboutInfo: "מונוקלאס הוא גרסה מונוספייסית של נאוקלאס, הנוקטת באותה גישה של עיצוב תמציתי ושימושי עם אופי להגדרת צורת האותיות. הוא מיועד לטקסטים בגדלים קטנים ומידע טכני כגון הערות שוליים."
  },
  "skolar-sans-hebrew": {
    name: "Skolar Sans Hebrew",
    hebrewName: "סקולר סנס עברית",
    family: "'Skolar Sans Hebrew'",
    defaultText: "Skolar Sans Hebrew סקולר סנס עברית",
    sampleText: "אבגדהוזחטיכלמנסעפצקרשת The lazy fox 0123456789",
    category: "Sans-Serif",
    script: "Latin + Hebrew",
    year: "2023",
    tags: ["Sans-serif", "Latin + Hebrew", "Collaboration"],
    weights: [
      { weight: 100, label: "Thin" },
      { weight: 100, label: "Thin Italic", italic: true },
      { weight: 300, label: "Light" },
      { weight: 300, label: "Light Italic", italic: true },
      { weight: 400, label: "Regular" },
      { weight: 400, label: "Italic", italic: true },
      { weight: 500, label: "Medium" },
      { weight: 500, label: "Medium Italic", italic: true },
      { weight: 600, label: "Semibold" },
      { weight: 600, label: "Semibold Italic", italic: true },
      { weight: 700, label: "Bold" },
      { weight: 700, label: "Bold Italic", italic: true },
      { weight: 800, label: "Extrabold" },
      { weight: 800, label: "Extrabold Italic", italic: true },
      { weight: 900, label: "Black" },
      { weight: 900, label: "Black Italic", italic: true },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…",
      hebrew: "אבגדהוזחטיכךלמםנןסעפףצץקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "onum", "lnum", "pnum", "tnum", "frac", "locl", "ss01", "ss02"],
    featureShowcase: [
      { feature: "locl", before: "לוקאליזציה", after: "לוקאליזציה" },
      { feature: "onum", before: "0123456789", after: "0123456789" },
      { feature: "ss01", before: "Alternate", after: "Alternate" },
      { feature: "frac", before: "1/2 1/4 3/4", after: "1/2 1/4 3/4" },
    ],
    themedContent: [
      { 
        text: "Linguistics is the scientific study of language. It involves the analysis of language form, language meaning, and language in context.", 
        footnote: "[1] Wikipedia, \"Linguistics\", 2026."
      },
      { 
        text: "The Dead Sea Scrolls are ancient Jewish religious manuscripts found in the Qumran Caves in the Judaean Desert.", 
        footnote: "[2] Wikipedia, \"Dead Sea Scrolls\", 2026."
      },
      { 
        text: "The Hebrew alphabet, also known as the Ktav Ashuri, is an abjad script used in the writing of the Hebrew language.", 
        footnote: "[3] Wikipedia, \"Hebrew Alphabet\", 2026."
      },
      { 
        text: "Eliezer Ben-Yehuda was a Hebrew lexicographer and newspaper editor who was the driving spirit behind the revival of the Hebrew language in the modern era.", 
        footnote: "[4] Wikipedia, \"Eliezer Ben-Yehuda\", 2026."
      },
      { 
        text: "The Academy of the Hebrew Language is the supreme institution for scholarship on the Hebrew language in Israel.", 
        footnote: "[5] Wikipedia, \"Academy of the Hebrew Language\", 2026."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "בלשנות היא המחקר המדעי של שפה. היא כוללת את ניתוח צורת השפה, משמעות השפה והשפה בהקשר.", 
        footnote: "[1] ויקיפדיה, \"בלשנות\", 2026."
      },
      { 
        text: "מגילות מדבר יהודה הן כתבי יד דתיים יהודיים עתיקים שנמצאו במערות קומראן במדבר יהודה.", 
        footnote: "[2] ויקיפדיה, \"מגילות מדבר יהודה\", 2026."
      },
      { 
        text: "האלפבית העברי, הידוע גם בשם כתב אשורי, הוא אלפבית מסוג אבג'ד המשמש לכתיבת השפה העברית.", 
        footnote: "[3] ויקיפדיה, \"אלפבית עברי\", 2026."
      },
      { 
        text: "אליעזר בן-יהודה היה מילונאי ועורך עיתון עברי שהיה הרוח החיה מאחורי החייאת השפה העברית בעידן המודרני.", 
        footnote: "[4] ויקיפדיה, \"אליעזר בן-יהודה\", 2026."
      },
      { 
        text: "האקדמיה ללשון העברית היא המוסד העליון למדע הלשון העברית במדינת ישראל.", 
        footnote: "[5] ויקיפדיה, \"האקדמיה ללשון העברית\", 2026."
      }
    ],
    aboutInfo: "A collaboration with Rosetta Type, Skolar Sans Hebrew is a scholarly typeface that seamlessly integrates Latin and Hebrew scripts for academic and complex editorial environments.",
    hebrewAboutInfo: "בשיתוף פעולה עם Rosetta Type, סקולר סנס עברית הוא פונט אקדמי המשלב בצורה חלקה את הכתב הלטיני והעברי לסביבות מחקר ועריכה מורכבות."
  },
  "olivia-display": {
    name: "Olivia Display",
    hebrewName: "אוליביה דיספליי",
    family: "'Olivia Display'",
    defaultText: "אוליביה דיספליי Olivia",
    sampleText: "אבגדהוזחטיכלמנסעפצקרשת 0123456789",
    category: "Display",
    script: "Hebrew",
    year: "2024",
    testerSizes: [60, 80, 120],
    tags: ["Serif", "Latin + Hebrew", "Experimental", "Display"],
    weights: [
      { weight: 100, label: "Thin" },
      { weight: 300, label: "Light" },
      { weight: 400, label: "Regular" },
      { weight: 500, label: "Medium" },
      { weight: 600, label: "Demibold" },
      { weight: 700, label: "Bold" },
      { weight: 800, label: "Ultrabold" },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…",
      hebrew: "אבגדהוזחטיכלמנסעפצקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "salt", "ss01", "ss02", "dlig"],
    featureShowcase: [
      { feature: "salt", before: "Olivia Display", after: "Olivia Display" },
      { feature: "ss01", before: "Soft Terminals", after: "Soft Terminals" },
      { feature: "dlig", before: "st ct sp", after: "st ct sp" },
      { feature: "ss02", before: "Alt Shapes", after: "Alt Shapes" },
    ],
    themedContent: [
      { 
        text: "All the world's a stage, and all the men and women merely players; they have their exits and their entrances, and one man in his time plays many parts.", 
        footnote: "[1] William Shakespeare, \"As You Like It\", 1599."
      },
      { 
        text: "I regard the theatre as the greatest of all art forms, the most immediate way in which a human being can share with another the sense of what it is to be a human being.", 
        footnote: "[2] Oscar Wilde."
      },
      { 
        text: "To be, or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.", 
        footnote: "[3] William Shakespeare, \"Hamlet\", 1609."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "כל העולם במה, וכל האנשים והנשים אינם אלא שחקנים; יש להם את יציאותיהם וכניסותיהם, ואדם אחד בחייו משחק תפקידים רבים.", 
        footnote: "[1] ויליאם שייקספיר, \"כטוב בעיניכם\", 1599."
      },
      { 
        text: "אני רואה בתיאטרון את צורת האמנות הגדולה ביותר, הדרך המיידית ביותר שבה בן אנוש יכול לחלוק עם אחר את התחושה של מה זה להיות בן אנוש.", 
        footnote: "[2] אוסקר ויילד."
      },
      { 
        text: "להיות או לא להיות, זאת השאלה: האם אציל יותר לסבול באצילות את חיציה ואבני קלעה של הגורל האכזר, או לאחוז בנשק נגד ים של צרות.", 
        footnote: "[3] ויליאם שייקספיר, \"המלט\", 1609."
      }
    ],
    aboutInfo: "Olivia Display was born from a visual exploration of Hebrew and Latin scripts, aiming to create a rich dialogue between them. It challenges the rules of contrast and serifs while preserving the unique structure of each language. The result is an elegant, characterful typographic system for display use—where both scripts blend harmoniously without either losing its original essence. Originally developed during a Master's in Type Design at ECAL in Switzerland.",
    hebrewAboutInfo: "אוליביה דיספליי נולד מתוך חקר ויזואלי של האות העברית אל מול הכתב הלטיני, במטרה ליצור דיאלוג עשיר ביניהם. הפרויקט בא לאתגר את חוקי הקונטרסט והסריף, ועדיין לשמור על המבנה הייחודי של כל שפה. התוצאה היא מערכת טיפוגרפית אלגנטית ומלאת אופי לתצוגה – בה שני הכתבים משתלבים בהרמוניה מבלי שאף אחד יאבד ממהותו המקורית. פותח במקור במסגרת תואר שני בעיצוב אותיות ב־ECAL, שווייץ."
  },
  "olivia-text": {
    name: "Olivia Text",
    hebrewName: "אוליביה טקסט",
    family: "'Olivia Text'",
    defaultText: "אוליביה טקסט Olivia Text",
    sampleText: "אבגדהוזחטיכלמנסעפצקרשת 0123456789",
    category: "Text",
    script: "Hebrew",
    year: "2025",
    tags: ["Serif", "Latin + Hebrew", "Experimental", "Text"],
    weights: [
      { weight: 300, label: "Light" },
      { weight: 400, label: "Regular" },
      { weight: 500, label: "Medium" },
      { weight: 600, label: "Demibold" },
      { weight: 700, label: "Bold" },
    ],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…",
      hebrew: "אבגדהוזחטיכךלמםנןסעפףצץקרשת אָאַבּכּפּתּשׁשׂוּוֹ",
    },
    features: ["liga", "kern", "salt", "ss01", "onum"],
    featureShowcase: [
      { feature: "onum", before: "0123456789", after: "0123456789" },
      { feature: "salt", before: "Text Version", after: "Text Version" },
      { feature: "ss01", before: "Legibility", after: "Legibility" },
    ],
    themedContent: [
      { 
        text: "Education is not the learning of facts, but the training of the mind to think. True learning extends beyond the mere acquisition of knowledge; it is the process of developing the intellectual capacity to analyze, synthesize, and evaluate information. In an ever-evolving world, the ability to adapt and apply critical thinking is paramount. A well-rounded education fosters curiosity and empowers individuals to navigate complex challenges with creativity and reason.", 
        footnote: "[1] Albert Einstein."
      },
      { 
        text: "Tell me and I forget, teach me and I may remember, involve me and I learn. This philosophy forms the cornerstone of experiential education, where hands-on engagement transforms abstract concepts into tangible understanding. When students actively participate in their own learning process, they develop deeper retention and a more profound connection to the material.", 
        footnote: "[2] Benjamin Franklin."
      },
      { 
        text: "The Socratic method is a form of cooperative argumentative dialogue between individuals, based on asking and answering questions to stimulate critical thinking.", 
        footnote: "[3] Wikipedia, \"Socratic method\", 2026."
      },
      { 
        text: "Montessori education is an educational approach developed by Italian physician and educator Maria Montessori, characterized by an emphasis on independence.", 
        footnote: "[4] Wikipedia, \"Montessori education\", 2026."
      },
      { 
        text: "Active learning is an approach to instruction that involves actively engaging students with the course material through discussions, problem solving, and role play.", 
        footnote: "[5] Wikipedia, \"Active learning\", 2026."
      }
    ],
    hebrewThemedContent: [
      { 
        text: "חינוך אינו למידת עובדות, אלא אימון של המוח לחשוב. למידה אמיתית משתרעת אל מעבר לרכישה גרידא של ידע; זהו תהליך של פיתוח היכולת האינטלקטואלית לנתח, לסנתז ולהעריך מידע. בעולם שמשתנה ללא הרף, היכולת להסתגל וליישם חשיבה ביקורתית היא בעלת חשיבות עליונה. חינוך מקיף מטפח סקרנות ומעצים אנשים לנווט באתגרים מורכבים ביצירתיות ובהגיון.", 
        footnote: "[1] אלברט איינשטיין."
      },
      { 
        text: "אמור לי ואשכח, למד אותי ואולי אזכור, שתף אותי ואלמד. פילוסופיה זו מהווה את אבן הפינה של החינוך החווייתי, שבו מעורבות מעשית הופכת מושגים מופשטים להבנה מוחשית. כאשר תלמידים משתתפים באופן פעיל בתהליך הלמידה של עצמם, הם מפתחים זיכרון עמוק יותר וחיבור משמעותי יותר לחומר הנלמד.", 
        footnote: "[2] בנג'מין פרנקלין."
      },
      { 
        text: "השיטה הסוקרטית היא צורה של דיאלוג ארגומנטטיבי משותף בין אנשים, המבוסס על שאלת שאלות כדי לעורר חשיבה ביקורתית.", 
        footnote: "[3] ויקיפדיה, \"השיטה הסוקרטית\", 2026."
      },
      { 
        text: "חינוך מונטסורי הוא גישה חינוכית שפותחה על ידי הרופאה והמחנכת האיטלקייה מריה מונטסורי, המאופיינת בדגש על עצמאות.", 
        footnote: "[4] ויקיפדיה, \"שיטת מונטסורי\", 2026."
      },
      { 
        text: "למידה פעילה היא גישה להוראה המערבת תלמידים באופן פעיל עם חומר הלימוד באמצעות דיונים, פתרון בעיות ומשחקי תפקידים.", 
        footnote: "[5] ויקיפדיה, \"למידה פעילה\", 2026."
      }
    ],
    aboutInfo: "Olivia Text was born from a visual exploration of Hebrew and Latin scripts, aiming to create a rich dialogue between them. It challenges the rules of contrast and serifs while preserving the unique structure of each language. The result is an elegant, characterful typographic system for immersive text use—where both scripts blend harmoniously without either losing its original essence. Originally developed during a Master's in Type Design at ECAL in Switzerland.",
    hebrewAboutInfo: "אוליביה טקסט נולד מתוך חקר ויזואלי של האות העברית אל מול הכתב הלטיני, במטרה ליצור דיאלוג עשיר ביניהם. הפרויקט בא לאתגר את חוקי הקונטרסט והסריף, ועדיין לשמור על המבנה הייחודי של כל שפה. התוצאה היא מערכת טיפוגרפית אלגנטית לסביבת טקסט – בה שני הכתבים משתלבים בהרמוניה מבלי שאף אחד יאבד ממהותו המקורית. פותח במקור במסגרת תואר שני בעיצוב אותיות ב־ECAL, שווייץ."
  },
  sticky: {
    name: "Sticky Variable",
    family: "StickyVariable",
    defaultText: "Sticky Variable Font",
    sampleText: "The quick brown fox jumps over the lazy dog. 0123456789",
    category: "Variable",
    script: "Latin",
    year: "2024",
    tags: ["Variable", "Latin", "Display"],
    weights: [
      { weight: 51, label: "Backslant", italic: true, italicAngle: -7 },
      { weight: 51, label: "Regular", italic: false, italicAngle: 0 },
      { weight: 51, label: "Italic", italic: true, italicAngle: 9 },
      { weight: 81, label: "Medium Backslant", italic: true, italicAngle: -7 },
      { weight: 81, label: "Medium", italic: false, italicAngle: 0 },
      { weight: 81, label: "Medium Italic", italic: true, italicAngle: 9 },
      { weight: 111, label: "Bold Backslant", italic: true, italicAngle: -7 },
      { weight: 111, label: "Bold", italic: false, italicAngle: 0 },
      { weight: 111, label: "Bold Italic", italic: true, italicAngle: 9 },
    ],
    isVariable: true,
    variableAxes: [
      { axis: "wght", min: 51, max: 111, default: 81 },
      { axis: "ital", min: -7, max: 9, default: 0 },
    ],
    testerSizes: [60, 80, 120],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…/@#$%&*+={}<>[]|\\~^_`",
    },
    features: ["liga", "kern", "salt", "ss01"],
    featureShowcase: [
      { feature: "salt", before: "Sticky Flow", after: "Sticky Flow" },
      { feature: "ss01", before: "Surface Tension", after: "Surface Tension" },
    ],
    themedContent: [
      { 
        text: "Masking tape, also known as painter's tape, is a type of pressure-sensitive tape made of a thin and easy-to-tear paper, and an easily released pressure-sensitive adhesive.", 
        footnote: "[1] Wikipedia, \"Masking tape\", 2026."
      },
      { 
        text: "Logistics involves the management of the flow of goods between the point of origin and the point of consumption to meet the requirements of customers.", 
        footnote: "[2] Wikipedia, \"Logistics\", 2026."
      },
      { 
        text: "Packaging is the science, art and technology of enclosing or protecting products for distribution, storage, sale, and use.", 
        footnote: "[3] Wikipedia, \"Packaging\", 2026."
      },
      { 
        text: "Supply chain management (SCM) deals with the system of methods, software and strategy for managing the supply and transport of goods.", 
        footnote: "[4] Wikipedia, \"Supply chain\", 2026."
      },
      { 
        text: "Distribution centers are often highly automated, utilizing conveyor systems and sorting machinery to handle thousands of parcels per hour.", 
        footnote: "[5] Wikipedia, \"Distribution center\", 2026."
      }
    ],
    aboutInfo: "Sticky is a typeface utilizing the limitation of writing with masking tape. Sticky was inspired by sign painting, classical italics, and pichação style graffiti. The typeface has multiple ligatures and automatic alternative letters to create tight spacing and a convincing sign painting feeling. With simple strokes and economic structures, the typeface is perfect for headlines and call for actions.",
    hebrewAboutInfo: "סטיקי הוא פונט המנצל את המגבלות של כתיבה בסרט הדבקה (מסקנטייפ). סטיקי שואב השראה משלטי רחוב, איטליק קלאסי וגרפיטי בסגנון פישאסאו. הפונט כולל ליגטורות רבות ואותיות חלופיות אוטומטיות כדי ליצור ריווח הדוק ותחושה משכנעת של ציור שלטים. עם משיכות פשוטות ומבנים חסכוניים, הפונט מושלם לכותרות ולקריאות לפעולה.",
  },
  wilson: {
    name: "Wilson typeface",
    family: "Wilson",
    defaultText: "Wilson Psychedelic 60s",
    sampleText: "The quick brown fox jumps over the lazy dog. 0123456789",
    category: "Display",
    script: "Latin",
    year: "2025",
    tags: ["Display", "Latin", "Wild"],
    testerSizes: [60, 80, 120],
    weights: [{ weight: 400, label: "Regular" }],
    charset: {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ",
      lowercase: "abcdefghijklmnopqrstuvwxyzàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ",
      numerals: "0123456789",
      punctuation: ".,;:!?\"'()-—–…",
    },
    features: ["liga", "kern", "salt", "onum"],
    featureShowcase: [
      { feature: "onum", before: "0123456789", after: "0123456789" },
      { feature: "salt", before: "Specimen", after: "Specimen" },
    ],
    themedContent: [
      { 
        text: "Psychedelic rock is a style of rock music that is inspired by psychedelic culture and attempts to replicate and enhance the mind-altering experiences of specialized music.", 
        footnote: "[1] Wikipedia, \"Psychedelic rock\", 2026."
      },
      { 
        text: "Rush is a Canadian rock band formed in Toronto in 1968. Known for its musicianship, complex compositions, and eclectic lyrical motifs, Rush has been influential in both progressive and hard rock.", 
        footnote: "[2] Wikipedia, \"Rush (band)\", 2026."
      },
      { 
        text: "Led Zeppelin were an English rock band formed in London in 1968. Their heavy, guitar-driven sound has led them to be cited as one of the progenitors of hard rock and heavy metal.", 
        footnote: "[3] Wikipedia, \"Led Zeppelin\", 2026."
      },
      { 
        text: "The Summer of Love was a social phenomenon that occurred during the summer of 1967, when as many as 100,000 people converged in San Francisco's Haight-Ashbury neighborhood.", 
        footnote: "[4] Wikipedia, \"Summer of Love\", 2026."
      },
      { 
        text: "Jimi Hendrix was an American guitarist, singer, and songwriter. He is widely regarded as one of the most influential electric guitarists in the history of popular music.", 
        footnote: "[5] Wikipedia, \"Jimi Hendrix\", 2026."
      }
    ],
    aboutInfo: "Wilson is a wavy, psychedelic display typeface that channels the spirit of 1960s rock posters. Named after Wes Wilson, it celebrates distortion, rhythm, and the beauty of imbalance. Drawing inspiration from the interlocking forms and optical illusions of psychedelic lettering, each curve and counter is crafted to create a hypnotic, fluid texture that turns negative space into motion.",
    hebrewAboutInfo: "ווילסון הוא פונט תצוגה פסיכדלי שמשדר את רוחן של כרזות הרוק משנות ה-60. הוא נקרא על שמו של ווס ווילסון וחוגג עיוות, קצב ואת היופי שבחוסר איזון. בהשראת הצורות המשתלבות והאשליות האופטיות של כיתוב פסיכדלי, כל עקומה וחלל פנימי מעוצבים כדי ליצור טקסטורה מהפנטת וזורמת שהופכת את החלל השלילי לתנועה."
  },
};
