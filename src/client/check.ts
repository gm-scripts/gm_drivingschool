import { conf, lang, error } from "./utils";

interface Validator {
  name: string;
  name2?: string;
  name3?: string;
  name4?: string;
  name5?: string;
  name6?: string;
  type: string;
}

const confValidator: Validator[] = [
  { name: "framework", type: "string" },
  { name: "lang", type: "string" },
  { name: "keys", name2: "openMenu", type: "number" },
  { name: "maxMistakes", name2: "theoryExam", type: "number" },
  { name: "maxMistakes", name2: "practicalExam", type: "number" },
  { name: "speedLimit", name2: "limit", type: "number" },
  { name: "speedLimit", name2: "useKmh", type: "boolean" },
  { name: "prices", name2: "allFree", type: "boolean" },
  { name: "prices", name2: "theory", type: "number" },
  { name: "prices", name2: "car", type: "number" },
  { name: "prices", name2: "bike", type: "number" },
  { name: "prices", name2: "truck", type: "number" },
  { name: "prices", name2: "bus", type: "number" },
  { name: "school", name2: "marker", name3: "x", type: "number" },
  { name: "school", name2: "marker", name3: "y", type: "number" },
  { name: "school", name2: "marker", name3: "z", type: "number" },
  { name: "school", name2: "spawn", name3: "x", type: "number" },
  { name: "school", name2: "spawn", name3: "y", type: "number" },
  { name: "school", name2: "spawn", name3: "z", type: "number" },
  { name: "school", name2: "spawn", name3: "h", type: "number" },
  { name: "school", name2: "showBlip", type: "boolean" },
  { name: "exams", name2: "car", type: "boolean" },
  { name: "exams", name2: "bike", type: "boolean" },
  { name: "exams", name2: "bus", type: "boolean" },
  { name: "exams", name2: "truck", type: "boolean" },
  { name: "vehicles", name2: "car", name3: "model", type: "string" },
  { name: "vehicles", name2: "car", name3: "color", type: "number" },
  { name: "vehicles", name2: "car", name3: "livery", type: "number" },
  { name: "vehicles", name2: "bike", name3: "model", type: "string" },
  { name: "vehicles", name2: "bike", name3: "color", type: "number" },
  { name: "vehicles", name2: "bike", name3: "livery", type: "number" },
  { name: "vehicles", name2: "bus", name3: "model", type: "string" },
  { name: "vehicles", name2: "bus", name3: "color", type: "number" },
  { name: "vehicles", name2: "bus", name3: "livery", type: "number" },
  { name: "vehicles", name2: "truck", name3: "model", type: "string" },
  { name: "vehicles", name2: "truck", name3: "color", type: "number" },
  { name: "vehicles", name2: "truck", name3: "livery", type: "number" },
  { name: "vehicles", name2: "truck", name3: "useTrailer", type: "boolean" },
  { name: "vehicles", name2: "truck", name3: "trailerModel", type: "string" },
  { name: "vehicles", name2: "truck", name3: "trailerLivery", type: "number" },
  { name: "vehicles", name2: "truck", name3: "model", type: "string" },
  { name: "vehicles", name2: "truck", name3: "color", type: "number" },
  { name: "menuColors", name2: "backgroundPrimary", type: "string" },
  { name: "menuColors", name2: "backgroundSecondary", type: "string" },
  { name: "menuColors", name2: "colorPrimary", type: "string" },
  { name: "menuColors", name2: "colorSecondary", type: "string" },
  { name: "menuColors", name2: "colorCorrect", type: "string" },
  { name: "menuColors", name2: "colorFalse", type: "string" },
  { name: "menuColors", name2: "textPrimary", type: "string" },
  { name: "menuColors", name2: "textSecondary", type: "string" },
  { name: "markers", name2: "school", name3: "type", type: "number" },
  { name: "markers", name2: "school", name3: "direction", name4: "x", type: "number" },
  { name: "markers", name2: "school", name3: "direction", name4: "y", type: "number" },
  { name: "markers", name2: "school", name3: "direction", name4: "z", type: "number" },
  { name: "markers", name2: "school", name3: "rotation", name4: "x", type: "number" },
  { name: "markers", name2: "school", name3: "rotation", name4: "y", type: "number" },
  { name: "markers", name2: "school", name3: "rotation", name4: "z", type: "number" },
  { name: "markers", name2: "school", name3: "scale", name4: "x", type: "number" },
  { name: "markers", name2: "school", name3: "scale", name4: "y", type: "number" },
  { name: "markers", name2: "school", name3: "scale", name4: "z", type: "number" },
  { name: "markers", name2: "school", name3: "color", name4: "r", type: "number" },
  { name: "markers", name2: "school", name3: "color", name4: "g", type: "number" },
  { name: "markers", name2: "school", name3: "color", name4: "b", type: "number" },
  { name: "markers", name2: "school", name3: "alpha", type: "number" },
  { name: "markers", name2: "school", name3: "bob", type: "boolean" },
  { name: "markers", name2: "school", name3: "face", type: "boolean" },
  { name: "markers", name2: "school", name3: "distance", name4: "show", type: "number" },
  { name: "markers", name2: "school", name3: "distance", name4: "open", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "type", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "direction", name4: "x", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "direction", name4: "y", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "direction", name4: "z", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "rotation", name4: "x", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "rotation", name4: "y", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "rotation", name4: "z", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "scale", name4: "x", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "scale", name4: "y", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "scale", name4: "z", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "color", name4: "r", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "color", name4: "g", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "color", name4: "b", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "alpha", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "bob", type: "boolean" },
  { name: "markers", name2: "checkPoint", name3: "face", type: "boolean" },
  { name: "markers", name2: "checkPoint", name3: "distance", name4: "show", type: "number" },
  { name: "markers", name2: "checkPoint", name3: "distance", name4: "open", type: "number" },
  { name: "blip", name2: "id", type: "number" },
  { name: "blip", name2: "color", type: "number" },
  { name: "blip", name2: "size", type: "number" },
];

const langValidator: string[] = [
  "blip_title",
  "press_e_theory",
  "press_e",
  "no_exams",
  "currency",
  "free",
  "too_fast",
  "damaged",
  "mistakes",
  "passed",
  "failed",
];

const checkConf = (): void => {
  for (let i = 0; i < confValidator.length; i++) {
    if (Object.prototype.hasOwnProperty.call(confValidator[i], "name6")) {
      if (
        typeof conf[confValidator[i].name][confValidator[i].name2][confValidator[i].name3][
          confValidator[i].name4
        ][confValidator[i].name5][confValidator[i].name6] !== confValidator[i].type
      ) {
        error(
          `${confValidator[i].name}.${confValidator[i].name2}.${confValidator[i].name3}.${
            confValidator[i].name4
          }.${confValidator[i].name5}.${confValidator[i].name6} should be a ${
            confValidator[i].type
          }, but was a ${typeof conf[confValidator[i].name][confValidator[i].name2][
            confValidator[i].name3
          ][confValidator[i].name4][confValidator[i].name5][confValidator[i].name6]}.`,
          "config",
        );
      }
    } else if (Object.prototype.hasOwnProperty.call(confValidator[i], "name5")) {
      if (
        typeof conf[confValidator[i].name][confValidator[i].name2][confValidator[i].name3][
          confValidator[i].name4
        ][confValidator[i].name5] !== confValidator[i].type
      ) {
        error(
          `${confValidator[i].name}.${confValidator[i].name2}.${confValidator[i].name3}.${
            confValidator[i].name4
          }.${confValidator[i].name5} should be a ${confValidator[i].type}, but was a ${typeof conf[
            confValidator[i].name
          ][confValidator[i].name2][confValidator[i].name3][confValidator[i].name4][
            confValidator[i].name5
          ]}.`,
          "config",
        );
      }
    } else if (Object.prototype.hasOwnProperty.call(confValidator[i], "name4")) {
      if (
        typeof conf[confValidator[i].name][confValidator[i].name2][confValidator[i].name3][
          confValidator[i].name4
        ] !== confValidator[i].type
      ) {
        error(
          `${confValidator[i].name}.${confValidator[i].name2}.${confValidator[i].name3}.${
            confValidator[i].name4
          } should be a ${confValidator[i].type}, but was a ${typeof conf[confValidator[i].name][
            confValidator[i].name2
          ][confValidator[i].name3][confValidator[i].name4]}.`,
          "config",
        );
      }
    } else if (Object.prototype.hasOwnProperty.call(confValidator[i], "name3")) {
      if (
        typeof conf[confValidator[i].name][confValidator[i].name2][confValidator[i].name3] !==
        confValidator[i].type
      ) {
        error(
          `${confValidator[i].name}.${confValidator[i].name2}.${
            confValidator[i].name3
          } should be a ${confValidator[i].type}, but was a ${typeof conf[confValidator[i].name][
            confValidator[i].name2
          ][confValidator[i].name3]}.`,
          "config",
        );
      }
    } else if (Object.prototype.hasOwnProperty.call(confValidator[i], "name2")) {
      if (typeof conf[confValidator[i].name][confValidator[i].name2] !== confValidator[i].type) {
        error(
          `${confValidator[i].name}.${confValidator[i].name2} should be a ${
            confValidator[i].type
          }, but was a ${typeof conf[confValidator[i].name][confValidator[i].name2]}.`,
          "config",
        );
      }
    } else {
      if (typeof conf[confValidator[i].name] !== confValidator[i].type) {
        error(
          `${confValidator[i].name} should be a ${confValidator[i].type}, but was a ${typeof conf[
            confValidator[i].name
          ]}.`,
          "config",
        );
      }
    }
  }
  if (conf["framework"] != "esx" && conf["framework"] != "vrp" && conf["framework"] != "none") {
    error(
      `framework "${conf["framework"]}" does not exist, please use "esx", "vrp" or "none"`,
      "config",
    );
  }
};

const checkLang = (): void => {
  for (let i = 0; i < langValidator.length; i++) {
    if (typeof lang[langValidator[i]] === "undefined") {
      error(`locale "${langValidator[i]}" does not exist in ${conf["lang"]}.json`, "lang");
    } else {
      if (typeof lang[langValidator[i]] !== "string") {
        error(
          `locale "${langValidator[i]}" should be a string, but was a ${typeof lang[
            langValidator[i]
          ]}`,
          "lang",
        );
      }
    }
  }
};

export { checkConf, checkLang };
