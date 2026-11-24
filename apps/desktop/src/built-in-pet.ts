export const builtInPet = {
  id: "builtin",
  displayName: "鎏金与紫蝶",
  gazeAnchor: { x: 0.51, y: 0.64 },
  builtIn: true,
  protected: true,
  installed: true,
} as const;

/** The bundled Pixel Duo is distinct from pets in the public catalog. */
export const builtInPetCatalogIds: ReadonlySet<string> = new Set();
