const SUBJECTS = {
  ENGLISH: "ENGLISH",
  HINDI: "HINDI",
  MATHEMATICS: "MATHEMATICS",
  SCIENCE: "SCIENCE",
  SOCIAL_SCIENCE: "SOCIAL_SCIENCE",
};

const SUBSUBJECTS = {
  SCIENCE: {
    PHYSICS: "PHYSICS",
    CHEMISTRY: "CHEMISTRY",
    BIOLOGY: "BIOLOGY",
  },
  SOCIAL_SCIENCE: {
    HISTORY: "HISTORY",
    GEOGRAPHY: "GEOGRAPHY",
    POLITICAL_SCIENCE: "POLITICAL_SCIENCE",
    ECONOMICS: "ECONOMICS",
  },
};

class Subject {
  constructor(name, subSubject) {
    this.name = name;
    this.subSubject = subSubject;
  }
  get displayName() {
    let name;
    if (this.subSubject) {
      name = `${this.name} - ${this.subSubject}`;
    } else name = this.name;
    return capitaliseEachWord(name.replace(/_/g, " "));
  }
}

const chapters = {
  ENGLISH: ["Prose", "Writing Skills", "Poems"],
  MATHEMATICS: [
    "Quadratic Equations",
    "Arithmetic Progressions",
    "Circles",
    "Constructions",
    "Some Applications of Trigonometry",
    "Surface Areas and Volumes",
    "Statistics",
  ],
  SCIENCE: {
    CHEMISTRY: [
      "Carbon and its Compounds",
      "Periodic Classification of Elements",
    ],
    BIOLOGY: [
      "How do Organisms Reproduce?",
      "Heredity and Evolution",
      "Our Environment",
    ],
    PHYSICS: ["Electricity", "Magnetic Effects of Electric Current"],
  },
  SOCIAL_SCIENCE: {
    HISTORY: ["Nationalism in India"],
    GEOGRAPHY: ["Manufacturing Industries", "Lifelines of National Economy"],
    POLITICAL_SCIENCE: ["Political Parties", "Outcomes of Democracy"],
    ECONOMICS: ["Money and Credit", "Globalisation and the National Economy"],
  },
};

const videoTypes = {
  capsule: "Content Capsule",
  one_shot: "One Shot",
  special: "Special Video",
  imp_qs: "Important Questions",
  quiz: "Quiz",
};

function capitaliseEachWord(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function findSubject(chapter) {
  for (const subject in chapters) {
    if (
      Array.isArray(chapters[subject]) &&
      chapters[subject].includes(chapter)
    ) {
      return getSubject(subject, null);
    } else {
      for (const subSubject in chapters[subject]) {
        if (chapters[subject][subSubject].includes(chapter)) {
          return getSubject(subject, subSubject);
        }
      }
    }
  }
  return null;
}
