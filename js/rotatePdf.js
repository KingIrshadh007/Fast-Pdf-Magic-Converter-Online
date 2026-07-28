// ==========================================
// FAST MAGIC PDF - ROTATE PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const rotateBtn =
document.getElementById("rotateBtn");





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






// ROTATE BUTTON

rotateBtn.addEventListener(
"click",
rotatePDF
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



selectedPDF = file;



const info =
document.getElementById("pdfInfo");



info.style.display="block";


info.innerHTML = `

<b>Selected PDF</b>

<br><br>

${file.name}

<br><br>

Size:

${formatSize(file.size)}

`;



}








// ==========================================
// ROTATE PDF
// ==========================================


async function rotatePDF(){



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



try{


status.innerHTML =
"⏳ Loading PDF...";


progress.style.width="20%";





const bytes =
await selectedPDF.arrayBuffer();





const pdfDoc =
await PDFLib.PDFDocument.load(
bytes
);





status.innerHTML =
"⏳ Rotating pages...";


progress.style.width="50%";





const angle =
parseInt(
document.getElementById("rotationAngle").value
);






const pages =
pdfDoc.getPages();






pages.forEach(
(page)=>{


const currentRotation =
page.getRotation().angle;



page.setRotation(
PDFLib.degrees(
currentRotation + angle
)
);


});







const rotatedBytes =
await pdfDoc.save();





const blob =
new Blob(
[rotatedBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);





const area =
document.getElementById("downloadArea");



area.innerHTML = `


<button 
class="download-btn"
id="downloadRotated">

Download Rotated PDF

</button>


`;






document
.getElementById("downloadRotated")
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"rotated.pdf";


link.click();


};





progress.style.width="100%";



status.innerHTML =
"✅ PDF Rotated Successfully";



}

catch(error){


console.error(
error
);



status.innerHTML =
"❌ Rotation failed. Try another PDF";


progress.style.width="0%";


}



}








// ==========================================
// FILE SIZE FORMAT
// ==========================================


function formatSize(bytes){


if(bytes < 1024){

return bytes + " Bytes";

}



if(bytes < 1024*1024){

return (
bytes / 1024
)
.toFixed(2)
+
" KB";

}



return (

bytes /
(1024*1024)

)
.toFixed(2)
+
" MB";


}
