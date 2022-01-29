async function main() {
  const file = await fetch("./Byjus Video List.csv");
  const text = await file.text();
  const lines = text.split("\r\n");
  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const obj = {};
    const values = line.split(",");
    headers.forEach((header, i) => {
      const val = values[i].trim();
      obj[header] = val.replace(/^"(.*)"$/, "$1");
    });
    return obj;
  });
  console.log(data);
  // console.log(
  // new Set(data.map((x) => console.log(extractVideoID(x.video_link))))
  // );

  data.forEach((x) => {
    switch (x.subject) {
      case "physics":
        x.subject = new Subject(SUBJECTS.SCIENCE, SUBSUBJECTS.SCIENCE.PHYSICS);
        break;
      case "chemistry":
        x.subject = new Subject(
          SUBJECTS.SCIENCE,
          SUBSUBJECTS.SCIENCE.CHEMISTRY
        );
        break;
      case "biology":
        x.subject = new Subject(SUBJECTS.SCIENCE, SUBSUBJECTS.SCIENCE.BIOLOGY);
        break;
      case "history":
        x.subject = new Subject(
          SUBJECTS.SOCIAL_SCIENCE,
          SUBSUBJECTS.SOCIAL_SCIENCE.HISTORY
        );
        break;
      case "geography":
        x.subject = new Subject(
          SUBJECTS.SOCIAL_SCIENCE,
          SUBSUBJECTS.SOCIAL_SCIENCE.GEOGRAPHY
        );
        break;
      case "pol_sci":
        x.subject = new Subject(
          SUBJECTS.SOCIAL_SCIENCE,
          SUBSUBJECTS.SOCIAL_SCIENCE.POLITICAL_SCIENCE
        );
        break;
      case "economics":
        x.subject = new Subject(
          SUBJECTS.SOCIAL_SCIENCE,
          SUBSUBJECTS.SOCIAL_SCIENCE.ECONOMICS
        );
        break;
      case "english":
        x.subject = new Subject(SUBJECTS.ENGLISH, null);
        break;
      case "mathematics":
        x.subject = new Subject(SUBJECTS.MATHEMATICS, null);
        break;
      default:
        x.subject = new Subject(SUBJECTS.ENGLISH, null);
        break;
    }
  });

  const allChapters = Object.values(chapters)
    .map((x) => {
      if (Array.isArray(x)) return x;
      return Object.values(x).flat();
    })
    .flat();

  let idx = 1;
  const subjects = Object.values(SUBJECTS)
    .map((x) => {
      if (SUBSUBJECTS[x])
        return Object.values(SUBSUBJECTS[x]).map((y) => {
          const s = new Subject(x, y);
          s.id = idx++;
          return s;
        });
      const s = new Subject(x, null);
      s.id = idx++;
      return s;
    })
    .flat();

  console.log(subjects);

  window.getSubject = (x, y) => {
    return subjects.find((s) => s.name === x && s.subSubject === y);
  };

  // const select = document.getElementById("subject");
  // subjects.forEach((x) => select.appendChild(createOption(x)));
  window.selectSub = (e) => {
    // remove all selected class
    const selected = document.querySelectorAll(".selected");
    selected.forEach((x) => x.classList.remove("selected"));

    render(parsedData.filter((x) => x.subject.name === e));
  };

  const parsedData = allChapters.map((ch) => {
    const obj = {};
    obj.chapter = ch;
    obj.videos = [];
    // find which subject this chapter belongs to;
    obj.subject = findSubject(ch);
    data.forEach((x) => {
      if (x.chapter === ch && x.type !== "special") {
        obj.videos.push(x);
      }
    });
    return obj;
  });

  console.log(parsedData);

  const render = (digest) => {
    const html = `
    <div class="card-container">
    ${digest
      .filter((x) => x.videos.length > 0)
      .map(
        (chap) => ` 
        <div class="card mdl-card mdl-shadow--2dp">
        <img style="width: 100%; aspect-ratio: 16 / 9; object-fit:cover;" src="https://img.youtube.com/vi/${extractVideoID(
          chap.videos[0]?.video_link
        )}/maxresdefault.jpg" />
        <div class="mdl-card__title">
          <h2 class="mdl-card__title-text">${chap.chapter}</h2>
        </div>
        <div class="mdl-card__supporting-text">
          ${chap.subject.displayName}
        </div>
        <div class="mdl-card__actions mdl-card--border">
          ${chap.videos
            .filter((x) => x.type !== "capsule")
            .map(
              (vid) => `<a href="${
                vid.video_link
              }" class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect">
            ${videoTypes[vid.type]}
          </a> ${
            vid.quiz_link
              ? `<a href="${vid.quiz_link}" class="mdl-button mdl-button--colored  mdl-js-button mdl-js-ripple-effect">Quiz</a>`
              : ""
          }
      `
            )
            .join("<br>")}<br>
          ${
            chap.videos.filter((x) => x.type === "capsule").length > 0
              ? `
          <ul>
          ${chap.videos
            .filter((x) => x.type === "capsule")
            .reverse()
            .map(
              (v) => `
            <li><a href="${v.video_link}">${v.topic}</a> ${
                v.quiz_link ? ` | <a href="${v.quiz_link}">Quiz</a>` : ""
              }</td>
  
          `
            )
            .join("")}</ul>
          `
              : ""
          }
        </div>
      </div>
`
      )
      .join("")}
    </div>`;
    document.querySelector(".cardss").innerHTML = html;
  };
  render(parsedData);
}

main();

function extractVideoID(url) {
  return url?.split("=")[1] || "";
}
