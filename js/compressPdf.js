// ==========================================
// FAST MAGIC PDF
// SMART PDF COMPRESSOR
// ==========================================

let selectedPDF = null;
let compressedPDFBlob = null;


// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", () => {


    const dropzone =
    document.getElementById("dropzone");


    const input =
    document.getElementById("pdfFile");


    const button =
    document.getElementById("compressBtn");



    dropzone.addEventListener(
        "click",
        () => input.click()
    );



    input.addEventListener(
        "change",
        () => {

            if(input.files.length){

                handlePDF(input.files[0]);

            }

        }
    );



    dropzone.addEventListener(
        "dragover",
        (e)=>{

            e.preventDefault();

            dropzone.classList.add(
                "dragover"
            );

        }
    );



    dropzone.addEventListener(
        "dragleave",
        ()=>{

            dropzone.classList.remove(
                "dragover"
            );

        }
    );



    dropzone.addEventListener(
        "drop",
        (e)=>{

            e.preventDefault();


            dropzone.classList.remove(
                "dragover"
            );


            if(e.dataTransfer.files.length){

                handlePDF(
                    e.dataTransfer.files[0]
                );

            }

        }
    );



    button.addEventListener(
        "click",
        compressPDF
    );


});






// ===============================
// FILE SELECT
// ===============================


function handlePDF(file){


    if(file.type !== "application/pdf"){


        alert(
            "Please upload PDF only"
        );


        return;

    }



    selectedPDF = file;



    const info =
    document.getElementById(
        "fileInfo"
    );



    info.style.display="block";



    info.innerHTML = `

    <b>${file.name}</b>

    <br><br>

    Original Size:

    <b>${formatSize(file.size)}</b>

    `;


}








// ===============================
// MAIN COMPRESS
// ===============================


async function compressPDF(){


if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;


}



try{


updateProgress(
10,
"Reading PDF..."
);



// IMPORTANT
// Create separate buffers

const originalBuffer =
await selectedPDF.arrayBuffer();



const pdfForReader =
originalBuffer.slice(0);



const pdfForProcessor =
originalBuffer.slice(0);






let pages = 0;



try{


const pdf =
await pdfjsLib.getDocument(
{
data:pdfForReader
}
).promise;



pages =
pdf.numPages;



}

catch(e){


console.log(
"Page count skipped"
);


}






console.log(
"Pages:",
pages
);






// Large PDF

if(
pages > 200 ||
selectedPDF.size > 50 * 1024 * 1024
){


await optimizeLargePDF(
pdfForProcessor
);


}

else{


await compressSmallPDF(
pdfForProcessor
);


}



}

catch(error){


console.error(
"Compression Error:",
error
);



updateProgress(
0,
"❌ Compression failed: "
+
error.message
);



}

}








// ===============================
// LARGE PDF MODE
// ===============================


async function optimizeLargePDF(buffer){



updateProgress(
40,
"Optimizing large PDF..."
);



const pdfDoc =
await PDFLib.PDFDocument.load(
buffer
);



const bytes =
await pdfDoc.save(
{
useObjectStreams:true
}
);




let output;



if(bytes.length < selectedPDF.size){



output =
new Blob(
[
bytes
],
{
type:"application/pdf"
}
);



}
else{


output =
selectedPDF;


}






compressedPDFBlob =
output;



showResult(
selectedPDF.size,
output.size,
"Large PDF optimization completed"
);



updateProgress(
100,
"Completed"
);



createDownloadButton();



}









// ===============================
// SMALL PDF IMAGE MODE
// ===============================


async function compressSmallPDF(buffer){


updateProgress(
20,
"Rendering PDF pages..."
);



const pdf =
await pdfjsLib.getDocument(
{
data:buffer
}
).promise;



const newPDF =
await PDFLib.PDFDocument.create();



const quality =
getQuality();





for(
let i=1;
i<=pdf.numPages;
i++
){



updateProgress(
20+
(
i/pdf.numPages
)*60,

`Processing page ${i}/${pdf.numPages}`

);





const page =
await pdf.getPage(i);




const viewport =
page.getViewport(
{
scale:1.2
}
);




const canvas =
document.createElement(
"canvas"
);



const ctx =
canvas.getContext(
"2d"
);



canvas.width =
viewport.width;



canvas.height =
viewport.height;





await page.render(
{

canvasContext:ctx,

viewport:viewport

}
)
.promise;






const image =
canvas.toDataURL(
"image/jpeg",
quality
);





const jpg =
await newPDF.embedJpg(
image
);





const newPage =
newPDF.addPage(
[
viewport.width,
viewport.height
]
);





newPage.drawImage(
jpg,
{

x:0,

y:0,

width:viewport.width,

height:viewport.height

}

);



}







const bytes =
await newPDF.save();





let output;



if(bytes.length < selectedPDF.size){


output =
new Blob(
[
bytes
],
{
type:"application/pdf"
}
);


}

else{


output =
selectedPDF;


}






compressedPDFBlob =
output;



showResult(
selectedPDF.size,
output.size,
"Compression completed"
);



updateProgress(
100,
"Completed"
);



createDownloadButton();



}









// ===============================
// QUALITY
// ===============================


function getQuality(){


const level =
document.getElementById(
"compressionLevel"
).value;



switch(level){


case "extreme":

return 0.35;


case "high":

return 0.55;


case "medium":

return 0.75;


case "low":

return 0.90;


default:

return 0.75;


}


}








// ===============================
// RESULT
// ===============================


function showResult(
oldSize,
newSize,
message
){



let saved =
(
(oldSize-newSize)
/oldSize
)
*100;



if(saved<0){

saved=0;

}




document.getElementById(
"compressionStats"
).innerHTML = `


<div class="stats-card">


<h3>
${message}
</h3>


Original:

<b>
${formatSize(oldSize)}
</b>


<br>


Final:

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








// ===============================
// DOWNLOAD
// ===============================


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
.onclick = ()=>{


const url =
URL.createObjectURL(
compressedPDFBlob
);



const link =
document.createElement(
"a"
);



link.href=url;



link.download =
"compressed.pdf";



link.click();



URL.revokeObjectURL(
url
);



};


}









// ===============================
// HELPERS
// ===============================


function updateProgress(
percent,
text
){


document.getElementById(
"progressBar"
).style.width =
percent+"%";



document.getElementById(
"progressText"
).innerHTML =
text;


}






function formatSize(bytes){


if(bytes < 1024)

return bytes+" Bytes";



if(bytes < 1024*1024)

return (
bytes/1024
).toFixed(2)
+" KB";



return (
bytes/1024/1024
).toFixed(2)
+" MB";


}
