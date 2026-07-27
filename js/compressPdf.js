// ==========================================
// FAST MAGIC PDF - COMPRESS PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;


// Wait until page loads

document.addEventListener("DOMContentLoaded", function(){



const dropzone = document.getElementById("dropzone");

const pdfInput = document.getElementById("pdfFile");

const fileInfo = document.getElementById("fileInfo");

const compressBtn = document.getElementById("compressBtn");



/*
=============================
CLICK UPLOAD BOX
=============================
*/


dropzone.addEventListener("click",function(){

    pdfInput.click();

});





/*
=============================
SELECT PDF FILE
=============================
*/


pdfInput.addEventListener("change",function(){


    handleFile(this.files[0]);


});






/*
=============================
DRAG OVER
=============================
*/


dropzone.addEventListener(
"dragover",
function(e){

    e.preventDefault();

    dropzone.classList.add("dragover");

});






/*
=============================
DRAG LEAVE
=============================
*/


dropzone.addEventListener(
"dragleave",
function(){

    dropzone.classList.remove("dragover");

});






/*
=============================
DROP FILE
=============================
*/


dropzone.addEventListener(
"drop",
function(e){


    e.preventDefault();


    dropzone.classList.remove("dragover");


    const file =
    e.dataTransfer.files[0];


    handleFile(file);


});







/*
=============================
COMPRESS BUTTON
=============================
*/


compressBtn.addEventListener(
"click",
compressPDF
);



});







// ==========================================
// FILE CHECK
// ==========================================


function handleFile(file){


const fileInfo =
document.getElementById("fileInfo");



if(!file){

    return;

}



if(file.type !== "application/pdf"){


    alert("Please select a PDF file only");

    return;

}



selectedPDF = file;



fileInfo.style.display="block";



fileInfo.innerHTML = `


<b>Selected PDF</b>

<br><br>


${file.name}


<br><br>


Original Size:

<b>
${formatSize(file.size)}
</b>


`;



}







// ==========================================
// COMPRESS PDF
// ==========================================


async function compressPDF(){



if(!selectedPDF){


alert("Please upload PDF first");

return;


}



const progressBar =
document.getElementById("progressBar");


const progressText =
document.getElementById("progressText");


const result =
document.getElementById("result");
const compressionStats =
document.getElementById("compressionStats");

const downloadBtn =
document.getElementById("downloadBtn");



try{


progressText.innerHTML =
"Loading PDF...";

progressBar.style.width="20%";





const bytes =
await selectedPDF.arrayBuffer();





progressText.innerHTML =
"Compressing PDF...";

progressBar.style.width="50%";





const level =
document.getElementById("compressionLevel").value;


const compressedPDF =
await compressPDFEngine(
    selectedPDF,
    level,
    function(progress){

        progressBar.style.width =
        (progress + "%");

        progressText.innerHTML =
        "Compressing: " + progress + "%";

    }
);






progressBar.style.width="90%";

progressText.innerHTML =
"Preparing download...";






const blob =
new Blob(
[compressedPDF],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);





let downloadURL = url;


downloadBtn.style.display="block";


downloadBtn.onclick=function(){

    const link =
    document.createElement("a");


    link.href=downloadURL;


    link.download="compressed.pdf";


    link.click();

};




downloadBtn.onclick=function(){

    const link=document.createElement("a");

    link.href=downloadURL;

    link.download="compressed.pdf";

    link.click();


    setTimeout(()=>{
        URL.revokeObjectURL(downloadURL);
    },1000);

};





progressBar.style.width="100%";

progressText.innerHTML =
"Completed";






const originalMB =
selectedPDF.size /
(1024*1024);


const compressedMB =
compressedPDF.length /
(1024*1024);



const reduction =
(
((originalMB-compressedMB)
/
originalMB)
*100
)
.toFixed(2);



compressionStats.innerHTML = `

<div class="stats-card">

<h3>
✅ Compression Completed
</h3>


Original Size:

<b>
${originalMB.toFixed(2)} MB
</b>


<br>


Compressed Size:

<b>
${compressedMB.toFixed(2)} MB
</b>


<br>


Saved:

<b>
${reduction}%
</b>


</div>

`;



}

catch(error){


console.error(
"Compression Error:",
error
);



compressionStats.innerHTML = `

<div class="stats-card">

❌ Something went wrong.

<br><br>

Please try another PDF file.

</div>

`;



}



}







// ==========================================
// FILE SIZE FORMAT
// ==========================================


function formatSize(bytes){


if(bytes < 1024){

return bytes + " Bytes";

}


else if(bytes < 1024*1024){


return (
(bytes/1024)
.toFixed(2)
+
" KB"
);


}


else{


return (

(bytes/(1024*1024))
.toFixed(2)

+

" MB"

);


}


}
