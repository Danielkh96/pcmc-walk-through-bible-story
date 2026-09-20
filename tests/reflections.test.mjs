import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const data = JSON.parse(await readFile(new URL("../app/comic/reflections.json", import.meta.url), "utf8"));
test("student reflections include collective scenarios and chapter Scripture only in both languages", () => {
  assert.deepEqual(Object.keys(data), ["brothers", "noahs-time"]);
  for (const reflection of Object.values(data)) {
    assert.deepEqual(Object.keys(reflection), ["zh", "en"]);
    for (const content of Object.values(reflection)) {
      assert.deepEqual(Object.keys(content), ["title", "scenarioTitle", "scenario", "references"]);
      assert.ok(content.scenario.length >= 5);
      assert.ok(content.title && content.scenarioTitle);
      assert.equal(content.references.length, 1);
      for (const reference of content.references) assert.ok(reference.label && reference.passage);
    }
    assert.match(reflection.zh.title, /我们/);
    assert.doesNotMatch(reflection.zh.title, /你/);
    assert.match(reflection.en.title, /\b(we|us)\b/);
    assert.match(reflection.zh.scenario[0], /我们/);
    assert.match(reflection.en.scenario[0], /^We /);
  }
  assert.match(data.brothers.zh.scenario.join(""), /我们是服事神/);
  assert.match(data["noahs-time"].zh.scenario.join(""), /等他走了才讨论/);
});
