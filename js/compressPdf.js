// ==========================================
// FAST MAGIC PDF
// COMPRESS PDF
// Version 2.0
// ==========================================

let selectedPDF = null;
let compressedBlob = null;

document.addEventListener("DOMContentLoaded", () => {

    const dropzone = document.getElementById("dropzone");
    const pdfInput = document.getElementById("pdfFile");
    const compressBtn = document.getElementById("compressBtn");

    // Upload click
    dropzone.addEventListener("click", () => {
        pdfInput.click();
    });

    // File picker
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

function handlePDF(file){

    if(!file) return;

    if(file.type !== "application/pdf"){

        alert("Please upload PDF only.");

        return;

    }

    selectedPDF = file;

    const info = document.getElementById("fileInfo");

    info.style.display = "block";

    info.innerHTML = `

        <b>Selected PDF</b>

        <br><br>

        ${file.name}

        <br><br>

        Size :
        <b>${formatSize(file.size)}</b>

    `;

}

function updateProgress(percent,text){

    document.getElementById("progressBar").style.width =
        percent + "%";

    document.getElementById("progressText").innerHTML =
        text;

}

function formatSize(bytes){

    if(bytes < 1024){

        return bytes + " Bytes";

    }

    if(bytes < 1024*1024){

        return (bytes/1024).toFixed(2) + " KB";

    }

    return (bytes/1024/1024).toFixed(2) + " MB";

}

// ==========================================
// COMPRESS PDF FUNCTION
// Part 2
// ==========================================


// ==========================================
// IMPROVED COMPRESS PDF FUNCTION
// ==========================================


async function compressPDF(){


    if(!selectedPDF){

        alert("Please upload PDF first");

        return;

    }


    try{


        updateProgress(
            10,
            "Reading PDF..."
        );



        const bytes =
        await selectedPDF.arrayBuffer();





        updateProgress(
            30,
            "Opening PDF..."
        );





        const pdfDoc =
        await PDFLib.PDFDocument.load(
            bytes
        );





        updateProgress(
            60,
            "Optimizing PDF objects..."
        );






        const level =
        document.getElementById(
            "compressionLevel"
        ).value;






        let saveOptions = {

            useObjectStreams:true

        };






        if(level === "low"){


            saveOptions = {

                useObjectStreams:false

            };


        }






        if(level === "high"){


            saveOptions = {

                useObjectStreams:true,

                objectsPerTick:50

            };


        }






        const result =
        await pdfDoc.save(
            saveOptions
        );







        updateProgress(
            85,
            "Checking compression..."
        );







        let outputBlob;

        let statusMessage;







        if(result.length < selectedPDF.size){


            outputBlob =
            new Blob(
                [
                    result
                ],
                {
                    type:"application/pdf"
                }
            );



            statusMessage =
            "✅ PDF size reduced";



        }

        else{


            outputBlob =
            selectedPDF;



            statusMessage =
            "ℹ️ This PDF cannot be reduced with browser compression. Original kept.";


        }







        compressedBlob =
        outputBlob;






        updateProgress(
            100,
            "Completed"
        );






        showCompressionResult(

            selectedPDF.size,

            outputBlob.size,

            statusMessage

        );







        createDownloadButton();





    }


    catch(error){


        console.error(
            error
        );


        updateProgress(
            0,
            "❌ Error processing PDF"
        );


    }


}







// ==========================================
// SHOW RESULT
// ==========================================


function showCompressionResult(
originalSize,
newSize,
message
){


const saved =

Math.max(
0,
(
(originalSize-newSize)
/
originalSize
)
*
100
);



document.getElementById(
"compressionStats"
).innerHTML = `


<div class="stats-card">


<h3>
${message}
</h3>



Original Size:

<b>
${formatSize(originalSize)}
</b>


<br>


Final Size:

<b>
${formatSize(newSize)}
</b>


<br>


Saved:

<b>
${saved.toFixed(2)}%
</b>



</div>


`;



}







// ==========================================
// DOWNLOAD BUTTON
// ==========================================


function createDownloadButton(){


document.getElementById(
"downloadArea"
).innerHTML = `


<button

class="download-btn"

id="downloadBtn">

⬇ Download Compressed PDF

</button>


`;



document.getElementById(
"downloadBtn"
)
.onclick = function(){


const url =
URL.createObjectURL(
compressedBlob
);



const link =
document.createElement(
"a"
);



link.href=url;


link.download =
"compressed.pdf";



link.click();



URL.revokeObjectURL(url);



};



}
