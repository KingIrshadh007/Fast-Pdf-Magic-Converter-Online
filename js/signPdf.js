// ==========================================
// FAST MAGIC PDF - SIGN PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;

let isDrawing = false;

let canvas;
let ctx;




document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const signBtn =
document.getElementById("signBtn");


const clearBtn =
document.getElementById("clearBtn");



canvas =
document.getElementById("signaturePad");


ctx =
canvas.getContext("2d");



// Signature style

ctx.lineWidth = 3;

ctx.lineCap = "round";

ctx.strokeStyle = "#000";





// ================================
// UPLOAD EVENTS
// ================================


dropzone.addEventListener(
"click",
function(){

pdfInput.click();

});





pdfInput.addEventListener(
"change",
function(){

handlePDF(this.files[0]);

});






dropzone.addEventListener(
"dragover",
function(e){

e.preventDefault();

dropzone.classList.add("dragover");

});





dropzone.addEventListener(
"dragleave",
function(){

dropzone.classList.remove("dragover");

});






dropzone.addEventListener(
"drop",
function(e){

e.preventDefault();

dropzone.classList.remove("dragover");


handlePDF(
e.dataTransfer.files[0]
);


});







// ================================
// SIGNATURE DRAWING
// ================================


canvas.addEventListener(
"mousedown",
startDrawing
);


canvas.addEventListener(
"mousemove",
draw
);


canvas.addEventListener(
"mouseup",
stopDrawing
);


canvas.addEventListener(
"mouseleave",
stopDrawing
);




// MOBILE TOUCH


canvas.addEventListener(
"touchstart",
startDrawing
);


canvas.addEventListener(
"touchmove",
draw
);


canvas.addEventListener(
"touchend",
stopDrawing
);







// CLEAR SIGNATURE


clearBtn.addEventListener(
"click",
function(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

});







// SIGN PDF


signBtn.addEventListener(
"click",
signPDF
);



});









// ==========================================
// DRAW SIGNATURE
// ==========================================


function getPosition(e){


const rect =
canvas.getBoundingClientRect();



if(e.touches){


return {

x:
e.touches[0].clientX - rect.left,

y:
e.touches[0].clientY - rect.top

};


}



return {

x:
e.clientX - rect.left,

y:
e.clientY - rect.top

};


}






function startDrawing(e){

e.preventDefault();

isDrawing=true;


const pos =
getPosition(e);


ctx.beginPath();


ctx.moveTo(
pos.x,
pos.y
);


}







function draw(e){


if(!isDrawing)
return;



e.preventDefault();



const pos =
getPosition(e);



ctx.lineTo(
pos.x,
pos.y
);


ctx.stroke();



}







function stopDrawing(){

isDrawing=false;

}









// ==========================================
// HANDLE PDF
// ==========================================


function handlePDF(file){



if(!file)
return;




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



info.innerHTML=`

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
// SIGN PDF
// ==========================================


async function signPDF(){



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
"⏳ Adding signature...";


progress.style.width="30%";





const bytes =
await selectedPDF.arrayBuffer();





const pdfDoc =
await PDFLib.PDFDocument.load(
bytes
);





const signatureImage =
canvas.toDataURL(
"image/png"
);





const pngImage =
await pdfDoc.embedPng(
signatureImage
);





const pages =
pdfDoc.getPages();





const firstPage =
pages[0];





const {width,height} =
firstPage.getSize();






firstPage.drawImage(
pngImage,
{


x:
width/2 - 100,


y:
height/2 - 50,


width:200,


height:80


}

);







progress.style.width="80%";






const signedBytes =
await pdfDoc.save();





const blob =
new Blob(
[signedBytes],
{
type:"application/pdf"
}
);



const url =
URL.createObjectURL(blob);







downloadArea.innerHTML=`

<button
class="download-btn"
id="downloadSigned">

Download Signed PDF

</button>

`;






document
.getElementById(
"downloadSigned"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"signed.pdf";


link.click();


};







progress.style.width="100%";



status.innerHTML=`

✅ PDF Signed Successfully

<br>

Signature added to first page.

`;



}

catch(error){


console.error(
error
);


status.innerHTML=

"❌ Unable to sign PDF";


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
