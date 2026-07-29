// ==========================================
// FAST MAGIC PDF
// IMAGE BASED PDF COMPRESSOR
// Part 1/3
// ==========================================


let selectedPDF = null;
let compressedPDFBlob = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const compressBtn =
document.getElementById("compressBtn");




// Click upload area

dropzone.addEventListener(
"click",
()=>{

pdfInput.click();

});





// File select

pdfInput.addEventListener(
"change",
()=>{

if(pdfInput.files.length){

handlePDF(
pdfInput.files[0]
);

}

});






// Drag over

dropzone.addEventListener(
"dragover",
(e)=>{

e.preventDefault();

dropzone.classList.add(
"dragover"
);

});







// Drag leave

dropzone.addEventListener(
"dragleave",
()=>{

dropzone.classList.remove(
"dragover"
);

});







// Drop file

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


});







compressBtn.addEventListener(
"click",
compressPDF
);



});









// ==========================================
// SELECT PDF
// ==========================================


function handlePDF(file){



if(!file){

return;

}





if(file.type !== "application/pdf"){


alert(
"Please upload PDF only"
);


return;


}





selectedPDF=file;




document.getElementById(
"fileInfo"
).style.display="block";





document.getElementById(
"fileInfo"
).innerHTML=

`

<b>
Selected PDF
</b>

<br><br>

${file.name}

<br>

Size:

<b>
${formatSize(file.size)}
</b>

`;



}









// ==========================================
// PROGRESS
// ==========================================


function updateProgress(
percent,
message
){



document.getElementById(
"progressBar"
).style.width =
percent+"%";




document.getElementById(
"progressText"
).innerHTML =
message;



}









// ==========================================
// SIZE FORMAT
// ==========================================


function formatSize(bytes){


if(bytes < 1024){

return bytes+" Bytes";

}



if(bytes < 1024*1024){

return (

bytes/1024

)
.toFixed(2)
+
" KB";

}



return (

bytes/(1024*1024)

)
.toFixed(2)
+
" MB";


}

// ==========================================
// IMAGE COMPRESSION ENGINE
// Part 2/3
// ==========================================


async function compressPDF(){


if(!selectedPDF){

alert("Please upload PDF first");

return;

}



try{


updateProgress(
10,
"Loading PDF..."
);



const arrayBuffer =
await selectedPDF.arrayBuffer();



const pdf =
await pdfjsLib.getDocument(
{
data:arrayBuffer
}
).promise;



const newPdf =
await PDFLib.PDFDocument.create();



const quality =
getCompressionQuality();



for(
let pageNumber = 1;
pageNumber <= pdf.numPages;
pageNumber++
){


updateProgress(

20 + 
(
pageNumber /
pdf.numPages
)
* 60,

`Compressing page ${pageNumber} of ${pdf.numPages}`

);




const page =
await pdf.getPage(
pageNumber
);



const viewport =
page.getViewport(
{
scale:1.5
}
);



const canvas =
document.createElement(
"canvas"
);



const context =
canvas.getContext(
"2d"
);



canvas.width =
viewport.width;


canvas.height =
viewport.height;



await page.render(
{

canvasContext:context,

viewport:viewport

}
)
.promise;






const imageData =
canvas.toDataURL(
"image/jpeg",
quality
);






const jpgImage =
await newPdf.embedJpg(
imageData
);






const newPage =
newPdf.addPage(
[
viewport.width,
viewport.height
]
);



newPage.drawImage(
jpgImage,
{

x:0,

y:0,

width:viewport.width,

height:viewport.height

}
);



}





updateProgress(
90,
"Creating compressed PDF..."
);




const pdfBytes =
await newPdf.save();



const compressedSize =
pdfBytes.length;



let finalBlob;

let message;



if(
compressedSize <
selectedPDF.size
){


finalBlob =
new Blob(
[
pdfBytes
],
{
type:
"application/pdf"
}
);


message =
"✅ Compression successful";


}

else{


finalBlob =
selectedPDF;


message =
"ℹ️ Original PDF is already smaller";


}





compressedPDFBlob =
finalBlob;



updateProgress(
100,
"Completed"
);



showResult(
selectedPDF.size,
finalBlob.size,
message
);



createDownloadButton();



}


catch(error){


console.error(
error
);


updateProgress(
0,
"❌ Compression failed"
);


}



}







// ==========================================
// COMPRESSION QUALITY
// ==========================================


function getCompressionQuality(){


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
