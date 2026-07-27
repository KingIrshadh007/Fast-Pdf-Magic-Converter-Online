// ======================================
// FAST MAGIC PDF - COMPRESS PDF TOOL
// ======================================

let selectedPDF = null;

window.addEventListener("DOMContentLoaded", () => {

    const pdfInput = document.getElementById("pdfFile");
    const dropzone = document.getElementById("dropzone");
    const status = document.getElementById("status");

    if (!pdfInput || !dropzone || !status) {
        console.error("Required HTML elements not found.");
        return;
    }

    // Click upload area
    dropzone.addEventListener("click", () => {
        pdfInput.click();
    });

    // File selected
    pdfInput.addEventListener("change", function () {

        if (this.files.length === 0) return;

        selectedPDF = this.files[0];

        status.innerHTML = `
            <b>Selected File:</b><br>
            ${selectedPDF.name}<br><br>

            <b>Original Size:</b><br>
            ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB
        `;
    });

    // Drag Over
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    // Drag Leave
    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    // Drop
    dropzone.addEventListener("drop", (e) => {

        e.preventDefault();

        dropzone.classList.remove("dragover");

        if (e.dataTransfer.files.length === 0) return;

        selectedPDF = e.dataTransfer.files[0];

        status.innerHTML = `
            <b>Selected File:</b><br>
            ${selectedPDF.name}<br><br>

            <b>Original Size:</b><br>
            ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB
        `;
    });

});

async function compressPDF() {

    if (!selectedPDF) {
        alert("Please select a PDF first.");
        return;
    }

    const status = document.getElementById("status");

    status.innerHTML = "⏳ Compressing PDF...";

    try {

        const bytes = await selectedPDF.arrayBuffer();

        const pdfDoc = await PDFLib.PDFDocument.load(bytes);

        const compressedBytes = await pdfDoc.save({
            useObjectStreams: true
        });

        const blob = new Blob([compressedBytes], {
            type: "application/pdf"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "compressed.pdf";
        link.click();

        URL.revokeObjectURL(url);

        status.innerHTML = `
            <h3>✅ Compression Completed</h3>

            Original Size:
            ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB

            <br><br>

            New Size:
            ${(compressedBytes.length / 1024 / 1024).toFixed(2)} MB
        `;

    }
    catch (err) {

        console.error(err);

        status.innerHTML =
            "❌ Compression Failed.";

    }

}
