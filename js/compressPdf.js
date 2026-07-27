// ===============================
// COMPRESS PDF TOOL
// ===============================


function loadCompressPDF(){

    const content = document.getElementById("dynamicContent");


    content.innerHTML = `

    <h1>Compress PDF</h1>


    <div class="dropzone" id="compressDropzone">

        <h3>Upload PDF</h3>

        <p>
        Click or drag & drop PDF here
        </p>


        <div class="formats">
        Supported: PDF files only
        </div>


    </div>


    <input 
    type="file"
    id="compressFile"
    accept="application/pdf"
    >



    <div id="compressInfo"></div>



    <div class="options">

        <label>
        Compression Level
        </label>


        <select id="compressionLevel">

            <option value="high">
            High Compression
            </option>


            <option value="medium" selected>
            Medium Compression
            </option>


            <option value="low">
            Low Compression
            </option>

        </select>


    </div>



    <button 
    class="convert-btn"
    onclick="compressPDF()">

    Compress & Download PDF

    </button>



    <div id="compressStatus"></div>


    `;



    initializeCompressPDF();

}




let compressSelectedFile = null;



function initializeCompressPDF(){


    const input =
    document.getElementById("compressFile");


    const dropzone =
    document.getElementById("compressDropzone");



    dropzone.onclick = () => {

        input.click();

    };




    input.addEventListener(
        "change",
        function(){

            compressSelectedFile=this.files[0];

            showCompressFile();

        }
    );




    dropzone.addEventListener(
        "dragover",
        function(e){

            e.preventDefault();

            dropzone.classList.add(
                "dragover"
            );

        }
    );



    dropzone.addEventListener(
        "dragleave",
        function(){

            dropzone.classList.remove(
                "dragover"
            );

        }
    );




    dropzone.addEventListener(
        "drop",
        function(e){

            e.preventDefault();


            compressSelectedFile =
            e.dataTransfer.files[0];


            showCompressFile();


        }
    );

}




function showCompressFile(){


    if(!compressSelectedFile)
    return;



    document.getElementById(
        "compressInfo"
    ).innerHTML = `


    <div class="file-item">

    📄 ${compressSelectedFile.name}

    <br>

    Original Size:

    ${(compressSelectedFile.size / 1024 / 1024)
    .toFixed(2)} MB


    </div>


    `;


}





async function compressPDF(){



    if(!compressSelectedFile){


        alert(
        "Please select a PDF file"
        );


        return;

    }



    const status =
    document.getElementById(
    "compressStatus"
    );



    status.innerHTML =
    "⏳ Compressing PDF...";




    try{


        const pdfBytes =
        await compressSelectedFile.arrayBuffer();




        const pdfDoc =
        await PDFLib.PDFDocument.load(
            pdfBytes
        );




        const level =
        document.getElementById(
        "compressionLevel"
        ).value;



        let saveOptions={

            useObjectStreams:true

        };



        if(level==="high"){


            saveOptions={

                useObjectStreams:true,

                addDefaultPage:false

            };


        }




        const compressedPDF =
        await pdfDoc.save(
            saveOptions
        );




        downloadCompressedPDF(
            compressedPDF
        );




        const oldSize =
        compressSelectedFile.size;



        const newSize =
        compressedPDF.length;



        status.innerHTML = `


        ✅ Compression Completed

        <br><br>

        Original:

        ${(oldSize/1024/1024)
        .toFixed(2)} MB


        <br>

        New Size:

        ${(newSize/1024/1024)
        .toFixed(2)} MB


        `;



    }
    catch(error){


        console.error(error);


        status.innerHTML =
        "❌ Compression failed";


    }



}





function downloadCompressedPDF(bytes){



    const blob =
    new Blob(
        [bytes],
        {
            type:"application/pdf"
        }
    );



    const url =
    URL.createObjectURL(
        blob
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


}
