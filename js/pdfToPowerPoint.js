// ==========================================
// FAST MAGIC PDF - PDF TO POWERPOINT JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const convertBtn =
document.getElementById("convertBtn");




// CLICK UPLOAD

dropzone.addEventListener(
"click",
function(){

    pdfInput.click();

});




// SELECT PDF

pdfInput.addEventListener(
"change",
function(){

    handlePDF(this.files[0]);

});




// DRAG OVER

dropzone.addEventListener(
"dragover",
function(e){

    e.preventDefault();

    dropzone.classList.add("dragover");

});




// DRAG LEAVE

dropzone.addEventListener(
"dragleave",
function(){

    dropzone.classList.remove("dragover");

});




// DROP PDF

dropzone.addEventListener(
"drop",
function(e){

    e.preventDefault();

    dropzone.classList.remove("dragover");


    handlePDF(
        e.dataTransfer.files[0]
    );

});




// CONVERT BUTTON

convertBtn.addEventListener(
"click",
convertToPowerPoint
);



});









// ==========================================
// HANDLE PDF
// ==========================================


function handlePDF(file){


if(!file){

return;

}



if(file.type !== "application/pdf"){


alert(
"Please upload PDF file only"
);


return;

}



selectedPDF=file;



const info =
document.getElementById("pdfInfo");



info.style.display="block";



info.innerHTML = `

<b>
Selected PDF
</b>

<br><br>

${file.name}

<br><br>

Size:

${formatSize(file.size)}

`;



}









// ==========================================
// PDF TO POWERPOINT
// ==========================================


async function convertToPowerPoint(){



if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;

}




const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");


const downloadArea =
document.getElementById("downloadArea");





try{


status.innerHTML =
"⏳ Preparing slides...";


progress.style.width="10%";





const fileURL =
URL.createObjectURL(
selectedPDF
);





const pdf =
await pdfjsLib.getDocument(
fileURL
).promise;






let slidesHTML = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
PDF Presentation
</title>


<style>

body{

margin:0;

background:#222;

font-family:Arial;

}


.slide{

width:960px;

height:540px;

background:white;

margin:30px auto;

display:flex;

justify-content:center;

align-items:center;

box-shadow:0 0 20px #000;

}


.slide img{

max-width:100%;

max-height:100%;

}


</style>


</head>


<body>

`;








for(
let pageNumber=1;
pageNumber<=pdf.numPages;
pageNumber++
){



const page =
await pdf.getPage(
pageNumber
);





const viewport =
page.getViewport(
{
scale:2
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





await page.render({

canvasContext:
context,

viewport:
viewport

})
.promise;





const image =
canvas.toDataURL(
"image/png"
);







slidesHTML += `


<div class="slide">


<img src="${image}">


</div>


`;






progress.style.width =

(
(pageNumber/pdf.numPages)
*
90

)
+
"%";



}







slidesHTML += `

</body>

</html>

`;








const blob =
new Blob(
[slidesHTML],
{
type:
"application/vnd.ms-powerpoint"
}
);






const url =
URL.createObjectURL(
blob
);






downloadArea.innerHTML = `


<button
class="download-btn"
id="downloadPPT">

Download PowerPoint File

</button>


`;







document
.getElementById(
"downloadPPT"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"converted-powerpoint.ppt";


link.click();


};







progress.style.width="100%";





status.innerHTML = `


✅ PowerPoint Created Successfully

<br>

${pdf.numPages} slides generated.

`;



}

catch(error){


console.error(
"PDF To PowerPoint Error:",
error
);



status.innerHTML =

"❌ Conversion failed. Try another PDF.";


progress.style.width="0%";



}



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
