import { describe, expectTypeOf, it } from "vitest";
import type { app } from "../../../../app";
import type { PostbuildResult } from "../../types";

/** The postbuild API as the site's Node app exposes it. */
type PostbuildApi = (typeof app)["postbuild"];

// Checked by `tsc` (bun run typecheck); vitest only runs the calls. Catches: a consumer API typing
// regression on `app.postbuild`: `run` losing its optional directory or its result widening to
// `any`, and the API collapsing to an index signature where a misspelt method still compiles.
describe("app.postbuild types", () => {
  it("types run as an optional output directory to the written files", () => {
    expectTypeOf<PostbuildApi["run"]>().toEqualTypeOf<
      (outputDirectory?: string) => Promise<PostbuildResult>
    >();
  });

  it("rejects a method the postbuild API does not have", () => {
    // @ts-expect-error: the postbuild API has no `clean` method; the lookup is the only error here
    type Clean = PostbuildApi["clean"];
    // The failed lookup leaves `any`.
    expectTypeOf<Clean>().toBeAny();
  });
});
