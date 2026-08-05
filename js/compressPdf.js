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

async function analyzePDF(){

    if(!selectedPDF){

        alert("Please choose a PDF first.");

        return;

    }

    try{

        progressText.innerHTML = "Reading PDF...";

        const buffer = await selectedPDF.arrayBuffer();

        const pdf = await pdfjsLib
            .getDocument({data:buffer})
            .promise;

        const pages = pdf.numPages;

        let imagePages = 0;
        let textPages = 0;

        const checkPages = Math.min(pages,10);

        for(let i=1;i<=checkPages;i++){

            progressText.innerHTML =
                "Analyzing page " + i + " of " + checkPages;

            const page = await pdf.getPage(i);

            const operatorList =
                await page.getOperatorList();

            let hasImage = false;

            for(const op of operatorList.fnArray){

                if(
                    op===pdfjsLib.OPS.paintImageXObject ||
                    op===pdfjsLib.OPS.paintInlineImageXObject
                ){
                    hasImage = true;
                    break;
                }

            }

            if(hasImage)
                imagePages++;
            else
                textPages++;

        }

        let type = "Mixed PDF";
        let method = "Hybrid Compression";

        if(imagePages===checkPages){

            type="Image PDF";
            method="Image Compression";

        }
        else if(textPages===checkPages){

            type="Text PDF";
            method="Structure Optimization";

        }

        document.getElementById("analysisCard").style.display="block";

        document.getElementById("pageCount").textContent = pages;
        document.getElementById("pdfType").textContent = type;
        document.getElementById("compressMethod").textContent = method;

        progressText.innerHTML = "✅ Analysis Completed";

    }
    catch(error){

        console.error(error);

        progressText.innerHTML = "❌ Failed to analyze PDF";

    }

}
