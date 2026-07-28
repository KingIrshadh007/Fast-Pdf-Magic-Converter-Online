// ==========================================
// FAST MAGIC PDF - UNLOCK PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const unlockBtn =
document.getElementById("unlockBtn");




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






unlockBtn.addEventListener(
"click",
unlockPDF
);



});









// ==========================================
// HANDLE FILE
// ==========================================


function handlePDF(file){


if(!file){

return;

}



if(file.type !== "application/pdf"){


alert(
"Please select PDF file only"
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
// UNLOCK PDF
// ==========================================


async function unlockPDF(){



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
"⏳ Processing PDF...";


progress.style.width="30%";





const bytes =
await selectedPDF.arrayBuffer();





const pdfDoc =
await PDFLib.PDFDocument.load(
bytes,
{
ignoreEncryption:true
}
);





progress.style.width="70%";






const unlockedBytes =
await pdfDoc.save(
{

useObjectStreams:true

}
);







const blob =
new Blob(
[unlockedBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);






downloadArea.innerHTML = `


<button 
class="download-btn"
id="downloadUnlocked">

Download Unlocked PDF

</button>


`;







document
.getElementById(
"downloadUnlocked"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"unlocked.pdf";


link.click();


};







progress.style.width="100%";





status.innerHTML = `

✅ PDF processed successfully

<br><br>

Your unlocked PDF is ready.

`;



}

catch(error){



console.error(
"Unlock Error:",
error
);



status.innerHTML = `

❌ Unable to unlock PDF.

<br>

The PDF may have a password encryption.

`;



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
(bytes/1024)
.toFixed(2)
+
" KB"
);

}



return (

(bytes/(1024*1024))
.toFixed(2)

+
" MB"

);


}
