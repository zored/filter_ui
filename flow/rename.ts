import { walkSync } from "https://deno.land/std@0.106.0/fs/mod.ts";

const renamesFile = "renames.json";
let renames: [string, string][];

function fillId(id: ImageId | null, d: Date | null, p: string): null | ImageId {
  if (!d) {
    return id;
  }
  if (id == null) {
    return null;
  }
  const zero = (v: number): string => (v < 10 ? "0" : "") + v;
  const extensionMatches = p.match(/.*\.(?<ext>.*)$/i);
  return {
    path: p,
    year: id?.year || d.getFullYear() + "",
    month: id?.month || zero(d.getMonth() + 1),
    date: id?.date || zero(d.getDate()),
    hours: id?.hours || zero(d.getHours()),
    minutes: id?.minutes || zero(d.getMinutes()),
    version: id?.version || "0000",
    extension: id?.extension || (extensionMatches?.groups?.ext ?? ""),
  };
}

interface ImageId {
  path: string;
  year: string;
  month: string;
  date: string;
  hours: string;
  minutes: string;
  version: string;
  extension: string;
}

function getImageId(p: string): null | ImageId {
  const patterns = [
    // My iPhone:
    /(?<year>\d{4})_(?<month>\d{2})_(?<date>\d{2})_(?<hours>\d{2})_(?<minutes>\d{2})_IMG_(?<version>\d{4})\.(?<ext>[^.]*)$/i,

    // Others:
    /(img|vid)_(?<year>\d{4})(?<month>\d{2})(?<date>\d{2})_(?<hours>\d{2})(?<minutes>\d{2})(?<version>\d{2}(_\d+)?)\.(?<ext>[^.]*)$/i,
    /(img|vid)_(?<version>\d+)\.(?<ext>[^.]+)$/i,
  ];
  const g = patterns.map((v) => p.match(v)).find((v) => !!v)?.groups;
  if (!g) {
    return null;
  }
  return {
    path: p,
    year: g.year || "",
    month: g.month || "",
    date: g.date || "",
    hours: g.hours || "",
    minutes: g.minutes || "",
    version: g.version || "",
    extension: g.extension || "",
  };
}

switch (Deno.args[0]) {
  case "save-renames":
    renames = [...walkSync(".")]
      .map((e) => e.path)
      .map((p): null | ImageId =>
        fillId(getImageId(p), Deno.statSync(p).birthtime, p)
      )
      .filter((id): id is ImageId => id !== null)
      .map((
        { year, month, date, hours, minutes, version, extension, path },
      ) => [
        path,
        `${year}-${month}-${date} ${hours}-${minutes} ${version}.${extension.toUpperCase()}`,
      ]);

    await Deno.writeTextFile(renamesFile, JSON.stringify(renames));
    console.log(`Saved to ${renamesFile}.`);
    break;
  case "rename":
    renames = JSON.parse(await Deno.readTextFile(renamesFile));
    renames.forEach(([before, after]) => Deno.renameSync(before, after));
    console.log(`Renamed ${renames.length} file(s).`);
    break;
  default:
    console.log("?");
    Deno.exit(1);
}
