const CLIPBOARD_TIMEOUT_MS = 800;

type CopyTextOptions = {
  writeText?: ((text: string) => Promise<void>) | undefined;
  fallback?: ((text: string) => boolean) | undefined;
  timeoutMs?: number | undefined;
};

function copyWithTextarea(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

async function writeWithTimeout(
  writeText: (text: string) => Promise<void>,
  text: string,
  timeoutMs: number,
): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      writeText(text),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Clipboard write timed out.")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export async function copyText(
  text: string,
  options: CopyTextOptions = {},
): Promise<boolean> {
  const writeText = options.writeText ?? navigator.clipboard?.writeText?.bind(navigator.clipboard);
  const fallback = options.fallback ?? copyWithTextarea;

  if (writeText) {
    const writeSucceeded = writeWithTimeout(
      writeText,
      text,
      options.timeoutMs ?? CLIPBOARD_TIMEOUT_MS,
    ).then(
      () => true,
      () => false,
    );

    let fallbackCopied = false;
    try {
      fallbackCopied = fallback(text);
    } catch {
      fallbackCopied = false;
    }

    if (fallbackCopied) {
      void writeSucceeded;
      return true;
    }

    return writeSucceeded;
  }

  try {
    return fallback(text);
  } catch {
    return false;
  }
}
