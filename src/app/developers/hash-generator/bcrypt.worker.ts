import bcrypt from "bcryptjs";

self.onmessage = (e: MessageEvent) => {
  const { action, password, rounds, hash } = e.data;
  
  if (action === "hash") {
    try {
      const salt = bcrypt.genSaltSync(rounds);
      const result = bcrypt.hashSync(password, salt);
      self.postMessage({ success: true, result });
    } catch (err: any) {
      self.postMessage({ success: false, error: err.message || "Failed to generate Bcrypt hash" });
    }
  } else if (action === "verify") {
    try {
      const result = bcrypt.compareSync(password, hash);
      self.postMessage({ success: true, result });
    } catch (err: any) {
      self.postMessage({ success: false, error: err.message || "Failed to compare Bcrypt hash" });
    }
  }
};
