const crypto = require("crypto");

function isLikelyHash(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}

function hashPassword(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function passwordMatches(storedPassword, providedPassword) {
  if (typeof storedPassword !== "string" || typeof providedPassword !== "string") {
    return false;
  }

  const storedIsHash = isLikelyHash(storedPassword);
  const providedIsHash = isLikelyHash(providedPassword);

  if (storedIsHash && providedIsHash) {
    return storedPassword.toLowerCase() === providedPassword.toLowerCase();
  }

  if (storedIsHash && !providedIsHash) {
    return storedPassword.toLowerCase() === hashPassword(providedPassword).toLowerCase();
  }

  if (!storedIsHash && providedIsHash) {
    return hashPassword(storedPassword).toLowerCase() === providedPassword.toLowerCase();
  }

  return hashPassword(storedPassword).toLowerCase() === hashPassword(providedPassword).toLowerCase();
}

module.exports = {
  hashPassword,
  passwordMatches,
};
