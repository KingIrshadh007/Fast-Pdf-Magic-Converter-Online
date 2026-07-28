// ==========================================
// FAST MAGIC PDF - COMPRESS PDF
// Part 1
// ==========================================

let selectedPDF = null;
let downloadBlob = null;

document.addEventListener("DOMContentLoaded", () => {

    const dropzone = document.getElementById("dropzone");
    const pdfInput = document.getElementById("pdfFile");
    const compressBtn = document.getElementById("compressBtn");

    // Click upload
    dropzone.addEventListener("click", () => {
        pdfInput.click();
    });

    // File selected
    pdfInput.addEventListener("change", () => {
        if (pdfInput.files.length > 0) {
            handlePDF(pdfInput.files[0]);
        }
    });

    // Drag over
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    // Drag leave
    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    // Drop
    dropzone.addEventListener("drop", (e) => {

        e.preventDefault();

        dropzone.classList.remove("dragover");

        if (e.dataTransfer.files.length > 0) {
            handlePDF(e.dataTransfer.files[0]);
        }

    });

    compressBtn.addEventListener("click", compressPDF);

});

// ------------------------------------------

function handlePDF(file) {

    if (!file) return;

    if (file.type !== "application/pdf") {

        alert("Please select a PDF file.");

        return;
    }

    selectedPDF = file;

    document.getElementById("fileInfo").style.display = "block";

    document.getElementById("fileInfo").innerHTML = `

        <b>Selected File</b><br><br>

        ${file.name}

        <br><br>

        Size :
        <b>${formatSize(file.size)}</b>

    `;

}

// ------------------------------------------

function updateProgress(percent, text) {

    document.getElementById("progressBar").style.width =
        percent + "%";

    document.getElementById("progressText").innerHTML =
        text;

}

// ------------------------------------------

function showResult(original, output) {

    const originalMB = original / 1024 / 1024;
    const outputMB = output / 1024 / 1024;

    let saved = (
        ((original - output) / original) * 100
    );

    if (saved < 0)
        saved = 0;

    document.getElementById("compressionStats").innerHTML = `

        <div class="stats-card">

        <h3>Compression Finished</h3>

        Original :
        <b>${originalMB.toFixed(2)} MB</b>

        <br>

        Result :
        <b>${outputMB.toFixed(2)} MB</b>

        <br>

        Saved :
        <b>${saved.toFixed(2)}%</b>

        </div>

    `;

}

// ------------------------------------------

function createDownload(blob) {

    downloadBlob = blob;

    document.getElementById("downloadArea").innerHTML = `

        <button
        class="download-btn"
        id="downloadBtn">

        Download PDF

        </button>

    `;

    document
        .getElementById("downloadBtn")
        .onclick = () => {

            const url =
                URL.createObjectURL(downloadBlob);

            const a =
                document.createElement("a");

            a.href = url;

            a.download = "compressed.pdf";

            a.click();

            URL.revokeObjectURL(url);

        };

}

// ------------------------------------------

function formatSize(bytes) {

    if (bytes < 1024)
        return bytes + " Bytes";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / 1024 / 1024).toFixed(2) + " MB";

}

// ==========================================
// COMPRESS PDF FUNCTION
// Part 2
// ==========================================


async function compressPDF(){


    if(!selectedPDF){

        alert("Please upload PDF first");

        return;

    }



    const level =
    document.getElementById("compressionLevel").value;



    try{


        updateProgress(
            10,
            "Loading PDF..."
        );



        const pdfBytes =
        await selectedPDF.arrayBuffer();



        updateProgress(
            40,
            "Processing PDF..."
        );



        const pdfDoc =
        await PDFLib.PDFDocument.load(
            pdfBytes
        );



        /*
        --------------------------------
        Compression options
        --------------------------------
        */


        let saveOptions = {};



        if(level === "low"){

            saveOptions = {

                useObjectStreams:false

            };

        }



        else if(level === "medium"){


            saveOptions = {

                useObjectStreams:true

            };


        }



        else if(level === "high"){


            saveOptions = {

                useObjectStreams:true,

                addDefaultPage:false

            };


        }





        updateProgress(
            70,
            "Optimizing PDF..."
        );





        const compressedBytes =
        await pdfDoc.save(
            saveOptions
        );





        updateProgress(
            90,
            "Checking file size..."
        );






        let finalBlob;



        /*
        Compare sizes

        If compressed is smaller:
        use compressed file

        Otherwise:
        keep original

        */



        if(
            compressedBytes.length <
            selectedPDF.size
        ){


            finalBlob =
            new Blob(
                [
                    compressedBytes
                ],
                {
                    type:
                    "application/pdf"
                }
            );


            document.getElementById(
                "progressText"
            ).innerHTML =
            "Compression successful";



        }

        else{


            finalBlob =
            selectedPDF;



            document.getElementById(
                "progressText"
            ).innerHTML =
            "PDF already optimized - original kept";


        }





        updateProgress(
            100,
            "Completed"
        );





        showResult(

            selectedPDF.size,

            finalBlob.size

        );





        createDownload(
            finalBlob
        );



    }



    catch(error){


        console.error(
            "Compression Error:",
            error
        );



        document.getElementById(
            "progressText"
        ).innerHTML =
        "❌ Compression failed";


    }


}
