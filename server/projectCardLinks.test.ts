import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const componentSource = readFileSync(
  resolve(process.cwd(), "client/src/components/PortfolioExperience.tsx"),
  "utf8",
);

const stylesheetSource = readFileSync(
  resolve(process.cwd(), "client/src/index.css"),
  "utf8",
);

describe("project card links", () => {
  it("renders a dedicated visit anchor for cards with a public URL", () => {
    expect(componentSource).toContain('className="project-entry__visit"');
    expect(componentSource).toContain('href={project.previewUrl}');
    expect(componentSource).toContain('className="project-entry"');
  });

  it("keeps the visit control above the visual preview and clickable", () => {
    expect(stylesheetSource).toContain(".project-entry__visit");
    expect(stylesheetSource).toContain("z-index: 6");
    expect(stylesheetSource).toContain("pointer-events: auto");
  });
});
