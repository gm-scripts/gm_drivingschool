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
];

const langValidator: string[] = ["sample"];

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
