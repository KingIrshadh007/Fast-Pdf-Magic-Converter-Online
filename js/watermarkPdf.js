// ==========================================
// FAST MAGIC PDF - WATERMARK PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const watermarkBtn =
document.getElementById("watermarkBtn");




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




// BUTTON

watermarkBtn.addEventListener(
"click",
addWatermark
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

<b>Selected PDF</b>

<br><br>

${file.name}

<br><br>

Size:

${formatSize(file.size)}

`;



}









// ==========================================
// ADD WATERMARK
// ==========================================


async function addWatermark(){



if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;

}





const text =
document
.getElementById("watermarkText")
.value
.trim();



if(text===""){


alert(
"Enter watermark text"
);


return;

}





const fontSize =
Number(
document.getElementById("fontSize").value
);



const opacity =
Number(
document.getElementById("opacity").value
);





const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");


const downloadArea =
document.getElementById("downloadArea");



try{


status.innerHTML =
"⏳ Adding watermark...";


progress.style.width="20%";





const bytes =
await selectedPDF.arrayBuffer();





const pdfDoc =
await PDFLib.PDFDocument.load(
bytes
);





const pages =
pdfDoc.getPages();





for(
let i=0;
i<pages.length;
i++
){



const page =
pages[i];



const width =
page.getWidth();



const height =
page.getHeight();





page.drawText(
text,
{

x:
width/2 - (text.length * fontSize / 4),


y:
height/2,


size:
fontSize,


opacity:
opacity,


rotate:
PDFLib.degrees(45)

}

);





progress.style.width =
(
((i+1)/pages.length)
*80
)
+
"%";


}







const watermarkedBytes =
await pdfDoc.save(
{

useObjectStreams:true

}
);






const blob =
new Blob(
[watermarkedBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);





downloadArea.innerHTML = `


<button
class="download-btn"
id="downloadWatermark">

Download Watermarked PDF

</button>


`;






document
.getElementById(
"downloadWatermark"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"watermarked.pdf";


link.click();


};







progress.style.width="100%";



status.innerHTML = `

✅ Watermark added successfully

<br>

Text:

<b>${text}</b>

`;



}

catch(error){


console.error(
"Watermark Error:",
error
);



status.innerHTML =
"❌ Unable to add watermark";


progress.style.width="0%";


}



}








// ==========================================
// FILE SIZE
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
