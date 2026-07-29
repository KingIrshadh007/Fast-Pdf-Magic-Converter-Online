// ==========================================
// FAST MAGIC PDF
// SMART PDF COMPRESSOR
// ==========================================

let selectedPDF = null;
let compressedPDFBlob = null;


// ===============================
// INITIALIZE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const dropzone = document.getElementById("dropzone");
    const input = document.getElementById("pdfFile");
    const button = document.getElementById("compressBtn");


    dropzone.onclick = () => {
        input.click();
    };


    input.onchange = () => {

        if(input.files.length){

            handlePDF(input.files[0]);

        }

    };


    dropzone.ondragover = (e)=>{

        e.preventDefault();

        dropzone.classList.add("dragover");

    };


    dropzone.ondragleave = ()=>{

        dropzone.classList.remove("dragover");

    };


    dropzone.ondrop = (e)=>{

        e.preventDefault();

        dropzone.classList.remove("dragover");


        if(e.dataTransfer.files.length){

            handlePDF(e.dataTransfer.files[0]);

        }

    };


    button.onclick = compressPDF;


});



// ===============================
// SELECT PDF
// ===============================


function handlePDF(file){


    if(file.type !== "application/pdf"){

        alert("Please upload PDF file");

        return;

    }


    selectedPDF=file;


    const info=document.getElementById("fileInfo");


    info.style.display="block";


    info.innerHTML=`

    <b>${file.name}</b>

    <br><br>

    Size:
    ${formatSize(file.size)}

    `;


}






// ===============================
// MAIN COMPRESS FUNCTION
// ===============================


async function compressPDF(){


if(!selectedPDF){

alert("Upload PDF first");

return;

}



try{


updateProgress(
10,
"Reading PDF..."
);



const buffer =
await selectedPDF.arrayBuffer();



// Check page count

let pageCount=0;


try{


const pdf =
await pdfjsLib.getDocument(
{
data:buffer
}
).promise;


pageCount =
pdf.numPages;


}

catch(e){


console.log(
"Page detection skipped"
);


}




console.log(
"Pages:",
pageCount
);





// LARGE PDF MODE

if(
pageCount > 200
||
selectedPDF.size > 50*1024*1024
){


await optimizeLargePDF(
buffer
);


}

else{


await compressImagePDF(
buffer
);


}



}

catch(error){


console.error(error);


updateProgress(
0,
"❌ Compression failed"
);


}



}








// ===============================
// LARGE PDF OPTIMIZATION
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



let result;


if(bytes.length < selectedPDF.size){


result =
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


result =
selectedPDF;


}



compressedPDFBlob=result;



showResult(
selectedPDF.size,
result.size,
"Large PDF optimization completed"
);



updateProgress(
100,
"Completed"
);



createDownloadButton();



}








// ===============================
// IMAGE COMPRESSION
// ===============================


async function compressImagePDF(buffer){


updateProgress(
20,
"Rendering pages..."
);



const pdf =
await pdfjsLib.getDocument(
{
data:buffer
}
).promise;



const newPdf =
await PDFLib.PDFDocument.create();



const quality =
getQuality();



for(
let i=1;
i<=pdf.numPages;
i++
){



updateProgress(
20+(i/pdf.numPages)*60,
`Compressing page ${i}/${pdf.numPages}`
);



const page =
await pdf.getPage(i);



const viewport =
page.getViewport(
{
scale:1.3
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
await newPdf.embedJpg(
image
);



const newPage =
newPdf.addPage(
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
await newPdf.save();



let result;


if(bytes.length < selectedPDF.size){


result =
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


result =
selectedPDF;


}



compressedPDFBlob=result;



showResult(
selectedPDF.size,
result.size,
"Compression completed"
);



updateProgress(
100,
"Completed"
);



createDownloadButton();



}







// ===============================
// QUALITY SETTINGS
// ===============================


function getQuality(){


const level =
document.getElementById(
"compressionLevel"
).value;



if(level==="extreme")
return 0.35;


if(level==="high")
return 0.55;


if(level==="medium")
return 0.75;


return 0.90;


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
((oldSize-newSize)/oldSize)*100;


if(saved<0)
saved=0;



document.getElementById(
"compressionStats"
).innerHTML=`

<div class="stats-card">

<h3>${message}</h3>

Original:
<b>${formatSize(oldSize)}</b>

<br>

Final:
<b>${formatSize(newSize)}</b>

<br>

Saved:
<b>${saved.toFixed(2)}%</b>

</div>

`;

}








// ===============================
// DOWNLOAD
// ===============================


function createDownloadButton(){


document.getElementById(
"downloadArea"
).innerHTML=`

<button
class="download-btn"
id="downloadBtn">

⬇ Download Compressed PDF

</button>

`;



document.getElementById(
"downloadBtn"
).onclick=()=>{


const url =
URL.createObjectURL(
compressedPDFBlob
);



const a =
document.createElement("a");


a.href=url;


a.download="compressed.pdf";


a.click();



URL.revokeObjectURL(url);


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
).innerHTML=text;


}



function formatSize(bytes){


if(bytes < 1024)
return bytes+" Bytes";


if(bytes < 1024*1024)
return (bytes/1024).toFixed(2)+" KB";


return (bytes/1024/1024).toFixed(2)+" MB";


}
