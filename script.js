let qrCode;

function generateQRCode() {
  const text = document.getElementById("text").value.trim();
  const size = parseInt(document.getElementById("size").value, 10);
  const qrContainer = document.getElementById("qrcode");
  const downloadLink = document.getElementById("downloadLink");
  const copyBtn = document.getElementById("copyBtn");
  const shareBtn = document.getElementById("shareBtn");

  qrContainer.innerHTML = ""; // Clear previous

  if (!text) {
    alert("⚠️ Please enter text or a URL!");
    return;
  }

  qrCode = new QRCode(qrContainer, { text, width: size, height: size });

  setTimeout(() => {
    const qrCanvas = qrContainer.querySelector("canvas");
    if (!qrCanvas) return;

    const dataUrl = qrCanvas.toDataURL("image/png");
    downloadLink.href = dataUrl;
    downloadLink.style.display = "inline-flex";

    // Show copy if supported
    if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
      copyBtn.style.display = "inline-flex";
    } else {
      copyBtn.style.display = "none";
    }

    // Show share if supported
    if (navigator.share) {
      shareBtn.style.display = "inline-flex";
    } else {
      shareBtn.style.display = "none";
    }
  }, 300);
}

async function copyQRCode() {
  const qrCanvas = document.querySelector("#qrcode canvas");
  if (!qrCanvas) return;

  qrCanvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("✅ QR Code copied to clipboard!");
    } catch (err) {
      alert("❌ Failed to copy QR Code: " + err);
    }
  });
}

async function shareQRCode() {
  const qrCanvas = document.querySelector("#qrcode canvas");
  if (!qrCanvas) return;

  qrCanvas.toBlob(async (blob) => {
    const file = new File([blob], "qrcode.png", { type: "image/png" });
    try {
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        await navigator.share({ title: "QR Code", text: "Scan this QR Code" });
        return;
      }
      await navigator.share({ files: [file], title: "QR Code", text: "Here is my QR Code" });
    } catch (err) {
      if (!String(err).includes("AbortError")) {
        alert("❌ Sharing failed: " + err);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").addEventListener("click", generateQRCode);
  document.getElementById("copyBtn").addEventListener("click", copyQRCode);
  document.getElementById("shareBtn").addEventListener("click", shareQRCode);

  // Enter key shortcut
  document.getElementById("text").addEventListener("keydown", (e) => {
    if (e.key === "Enter") generateQRCode();
  });
});
