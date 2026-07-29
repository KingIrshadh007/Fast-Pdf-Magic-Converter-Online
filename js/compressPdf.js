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
