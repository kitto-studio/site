import { describe, expectTypeOf, it } from "vitest";
import type { app } from "../../../../app";
import type { IconsResult, ImagesResult } from "../../types";

/** The assets API as the site's Node app exposes it. */
type AssetsApi = (typeof app)["assets"];

// Checked by `tsc` (bun run typecheck); vitest only runs the calls. Catches: a consumer API typing
// regression on `app.assets`: a method taking an argument or its result widening to `any`, and the
// API collapsing to an index signature where a misspelt method still compiles.
describe("app.assets types", () => {
  it("types images and icons as runs without arguments that resolve to their results", () => {
    expectTypeOf<AssetsApi["images"]>().toEqualTypeOf<() => Promise<ImagesResult>>();
    expectTypeOf<AssetsApi["icons"]>().toEqualTypeOf<() => Promise<IconsResult>>();
  });

  it("rejects a method the assets API does not have", () => {
    // @ts-expect-error: the assets API has no `favicons` method; the lookup is the only error here
    type Favicons = AssetsApi["favicons"];
    // The failed lookup leaves `any`.
    expectTypeOf<Favicons>().toBeAny();
  });
});
