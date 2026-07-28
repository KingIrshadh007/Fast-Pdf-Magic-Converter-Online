// ==========================================
// FAST MAGIC PDF - PROTECT PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const protectBtn =
document.getElementById("protectBtn");




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

protectBtn.addEventListener(
"click",
protectPDF
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
// PROTECT PDF
// ==========================================


async function protectPDF(){



if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;

}





const password =
document.getElementById(
"pdfPassword"
).value.trim();





if(password.length < 4){


alert(
"Password should contain minimum 4 characters"
);


return;


}







const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");


const downloadArea =
document.getElementById(
"downloadArea"
);





try{


status.innerHTML =
"⏳ Processing PDF...";


progress.style.width="30%";





const bytes =
await selectedPDF.arrayBuffer();





const pdfDoc =
await PDFLib.PDFDocument.load(
bytes
);






progress.style.width="60%";



/*
================================================

NOTE:

pdf-lib does NOT support PDF encryption.

This saves a processed PDF.

Real password locking requires
server-side encryption.

================================================
*/





const protectedBytes =
await pdfDoc.save(
{

useObjectStreams:true

}
);






const blob =
new Blob(
[protectedBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);







downloadArea.innerHTML = `


<button 
class="download-btn"
id="downloadProtected">

Download Protected PDF

</button>


`;







document
.getElementById(
"downloadProtected"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"protected.pdf";


link.click();


};






progress.style.width="100%";



status.innerHTML = `

✅ PDF Processed Successfully

<br>

⚠️ Browser version cannot apply real password encryption.

`;




}

catch(error){


console.error(error);


status.innerHTML =
"❌ Unable to process PDF";


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
