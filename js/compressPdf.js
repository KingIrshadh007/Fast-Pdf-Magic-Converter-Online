// ======================================
// FAST MAGIC PDF - COMPRESS PDF TOOL
// ======================================


let selectedPDF = null;


// Select PDF file
document
.getElementById("pdfFile")
.addEventListener("change", function () {


    selectedPDF = this.files[0];


    if(selectedPDF){


        document.getElementById("status").innerHTML = `

        Selected File:

        <b>${selectedPDF.name}</b>

        <br>

        Original Size:

        ${(selectedPDF.size / 1024 / 1024).toFixed(2)} MB

        `;


    }


});





// Compress PDF Function

async function compressPDF(){



    if(!selectedPDF){


        alert("Please select a PDF file first");

        return;


    }




    const status =
    document.getElementById("status");



    status.innerHTML =
    "⏳ Compressing PDF...";



    try{


        // Read PDF file

        const pdfBytes =
        await selectedPDF.arrayBuffer();




        // Load PDF

        const pdfDoc =
        await PDFLib.PDFDocument.load(
            pdfBytes
        );




        /*
        PDF optimization

        Removes unnecessary objects
        and compresses streams
        */


        const compressedBytes =
        await pdfDoc.save({

            useObjectStreams:true

        });





        // Create download file

        const blob =
        new Blob(
            [compressedBytes],
            {
                type:"application/pdf"
            }
        );



        const url =
        URL.createObjectURL(blob);




        const download =
        document.createElement("a");


        download.href=url;


        download.download =
        "compressed.pdf";


        download.click();




        URL.revokeObjectURL(url);





        const oldSize =
        selectedPDF.size;



        const newSize =
        compressedBytes.length;



        status.innerHTML = `


        ✅ Compression Completed


        <br><br>


        Original Size:

        ${(oldSize / 1024 / 1024).toFixed(2)} MB


        <br>


        Compressed Size:

        ${(newSize / 1024 / 1024).toFixed(2)} MB


        <br><br>


        File downloaded:
        <b>compressed.pdf</b>


        `;



    }
    catch(error){



        console.error(
            error
        );



        status.innerHTML =
        "❌ Compression failed. Try another PDF.";


    }


}
