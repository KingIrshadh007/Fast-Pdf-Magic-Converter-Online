// ==========================================
// FAST MAGIC PDF - PDF TO WORD JAVASCRIPT
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
convertToWord
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
// PDF TO WORD CONVERSION
// ==========================================


async function convertToWord(){



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
"⏳ Reading PDF...";


progress.style.width="20%";





const fileURL =
URL.createObjectURL(
selectedPDF
);





const pdf =
await pdfjsLib.getDocument(
fileURL
).promise;





let fullText = "";





for(
let pageNumber=1;
pageNumber<=pdf.numPages;
pageNumber++
){



const page =
await pdf.getPage(
pageNumber
);



const textContent =
await page.getTextContent();





const pageText =
textContent.items
.map(
item=>item.str
)
.join(" ");





fullText +=

"Page "
+
pageNumber
+
"\n\n"
+
pageText
+
"\n\n\n";





progress.style.width =
(
(pageNumber/pdf.numPages)
*
80
)
+
"%";



}







if(fullText.trim()===""){


fullText =
"No readable text found. This PDF may be scanned.";

}





status.innerHTML =
"⏳ Creating Word file...";






// Create DOC file


const docContent = `

<html>

<head>

<meta charset="UTF-8">

</head>


<body>


<pre>

${fullText}

</pre>


</body>


</html>

`;







const blob =
new Blob(
[docContent],
{
type:
"application/msword"
}
);





const url =
URL.createObjectURL(blob);





downloadArea.innerHTML = `


<button
class="download-btn"
id="downloadWord">

Download Word File

</button>


`;







document
.getElementById(
"downloadWord"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"converted-word.doc";


link.click();


};







progress.style.width="100%";





status.innerHTML = `

✅ Conversion Completed

<br>

Your Word file is ready.

`;



}

catch(error){


console.error(
"PDF To Word Error:",
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
