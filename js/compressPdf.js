// ============================================
// FAST MAGIC PDF
// COMPRESS PDF
// PART 3 - FILE UPLOAD
// ============================================

let selectedPDF = null;

// Elements
const dropZone = document.getElementById("dropZone");
const pdfInput = document.getElementById("pdfInput");
const browseBtn = document.getElementById("browseBtn");
const fileCard = document.getElementById("fileCard");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const progressText = document.getElementById("progressText");

// ----------------------------
// Browse Button
// ----------------------------
browseBtn.addEventListener("click", () => {
    pdfInput.click();
});

// ----------------------------
// File Selected
// ----------------------------
pdfInput.addEventListener("change", (e) => {

    if (!e.target.files.length) return;

    loadPDF(e.target.files[0]);

});

// ----------------------------
// Drag Over
// ----------------------------
dropZone.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropZone.classList.add("dragover");

});

// ----------------------------
// Drag Leave
// ----------------------------
dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("dragover");

});

// ----------------------------
// Drop
// ----------------------------
dropZone.addEventListener("drop", (e) => {

    e.preventDefault();

    dropZone.classList.remove("dragover");

    if (!e.dataTransfer.files.length) return;

    loadPDF(e.dataTransfer.files[0]);

});

// ----------------------------
// Load PDF
// ----------------------------
function loadPDF(file){

    if(file.type !== "application/pdf"){

        alert("Please select a PDF file.");

        return;

    }

    selectedPDF = file;

    fileCard.style.display = "block";

    fileName.innerHTML =
        "<b>File:</b> " + file.name;

    fileSize.innerHTML =
        "<b>Size:</b> " + formatSize(file.size);

    progressText.innerHTML =
        "✅ PDF Ready for Compression";

}

// ----------------------------
// Size Formatter
// ----------------------------
function formatSize(bytes){

    if(bytes < 1024)
        return bytes + " Bytes";

    if(bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

document
.getElementById("compressBtn")
.addEventListener("click", analyzePDF);
