function fail(filePath, path, message) {
  throw new Error(`[tokens:theme-validation] ${filePath} :: ${path} ${message}`);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertObject(value, filePath, path) {
  if (!isObject(value)) {
    fail(filePath, path, "must be an object");
  }
}

function assertNoExtraKeys(value, allowedKeys, filePath, path) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.includes(key)) {
      fail(filePath, `${path}.${key}`, "is not allowed");
    }
  }
}

function assertRequiredKeys(value, requiredKeys, filePath, path) {
  for (const key of requiredKeys) {
    if (!(key in value)) {
      fail(filePath, `${path}.${key}`, "is required");
    }
  }
}

function assertString(value, filePath, path, { minLength = 0 } = {}) {
  if (typeof value !== "string") {
    fail(filePath, path, "must be a string");
  }
  if (value.length < minLength) {
    fail(filePath, path, `must have length >= ${minLength}`);
  }
}

function assertNumber(value, filePath, path, { min, max } = {}) {
  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    fail(filePath, path, "must be a finite number");
  }
  if (typeof min === "number" && value < min) {
    fail(filePath, path, `must be >= ${min}`);
  }
  if (typeof max === "number" && value > max) {
    fail(filePath, path, `must be <= ${max}`);
  }
}

function assertEnum(value, allowedValues, filePath, path) {
  if (!allowedValues.includes(value)) {
    fail(filePath, path, `must be one of: ${allowedValues.join(", ")}`);
  }
}

function assertOptionalString(value, filePath, path) {
  if (value !== undefined) {
    assertString(value, filePath, path);
  }
}

function validatePrimarySection(value, filePath, path, { allowPartial = false } = {}) {
  assertObject(value, filePath, path);
  assertNoExtraKeys(value, ["hue", "chroma", "comment"], filePath, path);

  if (!allowPartial) {
    assertRequiredKeys(value, ["hue", "chroma"], filePath, path);
  } else if (!("hue" in value) && !("chroma" in value)) {
    fail(filePath, path, "must include at least one of: hue, chroma");
  }

  if ("hue" in value) {
    assertNumber(value.hue, filePath, `${path}.hue`, { min: 0, max: 360 });
  }

  if ("chroma" in value) {
    assertNumber(value.chroma, filePath, `${path}.chroma`, { min: 0, max: 1 });
  }

  assertOptionalString(value.comment, filePath, `${path}.comment`);
}

function validateSecondaryOrTertiarySection(value, filePath, path) {
  assertObject(value, filePath, path);
  assertNoExtraKeys(value, ["strategy", "hueShift", "chromaScale", "comment"], filePath, path);
  assertRequiredKeys(value, ["strategy", "hueShift", "chromaScale"], filePath, path);

  assertString(value.strategy, filePath, `${path}.strategy`, { minLength: 1 });
  assertEnum(value.strategy, ["analogous", "complementary", "custom"], filePath, `${path}.strategy`);
  assertNumber(value.hueShift, filePath, `${path}.hueShift`, { min: -360, max: 360 });
  assertNumber(value.chromaScale, filePath, `${path}.chromaScale`, { min: 0, max: 2 });
  assertOptionalString(value.comment, filePath, `${path}.comment`);
}

function validateNeutralSection(value, filePath, path) {
  assertObject(value, filePath, path);
  assertNoExtraKeys(value, ["strategy", "tintFromPrimary", "comment"], filePath, path);
  assertRequiredKeys(value, ["tintFromPrimary"], filePath, path);

  if ("strategy" in value) {
    assertString(value.strategy, filePath, `${path}.strategy`, { minLength: 1 });
  }

  assertNumber(value.tintFromPrimary, filePath, `${path}.tintFromPrimary`, { min: 0, max: 1 });
  assertOptionalString(value.comment, filePath, `${path}.comment`);
}

function validateErrorSection(value, filePath, path) {
  assertObject(value, filePath, path);
  assertNoExtraKeys(value, ["hue", "chroma", "comment"], filePath, path);
  assertRequiredKeys(value, ["hue", "chroma"], filePath, path);

  assertNumber(value.hue, filePath, `${path}.hue`, { min: 0, max: 360 });
  assertNumber(value.chroma, filePath, `${path}.chroma`, { min: 0, max: 1 });
  assertOptionalString(value.comment, filePath, `${path}.comment`);
}

function validateStatusSection(value, filePath, path) {
  validateErrorSection(value, filePath, path);
}

function validateSchemaReference(value, expected, filePath, path = "$schema") {
  if ("$schema" in value && value.$schema !== expected) {
    fail(filePath, path, `must equal "${expected}" when present`);
  }
}

export function validateThemeConfig(value, filePath) {
  assertObject(value, filePath, "$");
  assertNoExtraKeys(
    value,
    [
      "$schema",
      "name",
      "description",
      "primary",
      "secondary",
      "tertiary",
      "neutral",
      "error",
      "success",
      "warning",
      "info",
    ],
    filePath,
    "$",
  );
  assertRequiredKeys(
    value,
    ["name", "primary", "secondary", "tertiary", "neutral", "error", "success", "warning", "info"],
    filePath,
    "$",
  );

  validateSchemaReference(value, "./theme-config.schema.json", filePath);
  assertString(value.name, filePath, "$.name", { minLength: 1 });

  if ("description" in value) {
    assertString(value.description, filePath, "$.description");
  }

  validatePrimarySection(value.primary, filePath, "$.primary");
  validateSecondaryOrTertiarySection(value.secondary, filePath, "$.secondary");
  validateSecondaryOrTertiarySection(value.tertiary, filePath, "$.tertiary");
  validateNeutralSection(value.neutral, filePath, "$.neutral");
  validateErrorSection(value.error, filePath, "$.error");
  validateStatusSection(value.success, filePath, "$.success");
  validateStatusSection(value.warning, filePath, "$.warning");
  validateStatusSection(value.info, filePath, "$.info");
}

export function validateThemeOverride(value, filePath) {
  assertObject(value, filePath, "$");
  assertNoExtraKeys(value, ["$schema", "name", "description", "primary"], filePath, "$");
  assertRequiredKeys(value, ["name", "primary"], filePath, "$");

  validateSchemaReference(value, "./theme-override.schema.json", filePath);
  assertString(value.name, filePath, "$.name", { minLength: 1 });

  if ("description" in value) {
    assertString(value.description, filePath, "$.description");
  }

  validatePrimarySection(value.primary, filePath, "$.primary", { allowPartial: true });
}
