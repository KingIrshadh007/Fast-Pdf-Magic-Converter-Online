// ==========================================
// FAST MAGIC PDF
// PASSWORD PROTECT PDF (ZIP METHOD)
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){



const dropzone =
document.getElementById("dropzone");


const pdfFile =
document.getElementById("pdfFile");




// Click upload box

dropzone.addEventListener(
"click",
function(){

pdfFile.click();

});






// Select PDF

pdfFile.addEventListener(
"change",
function(){

handlePDF(this.files[0]);

});






// Drag Over

dropzone.addEventListener(
"dragover",
function(e){

e.preventDefault();

dropzone.classList.add("dragover");

});






// Drag Leave

dropzone.addEventListener(
"dragleave",
function(){

dropzone.classList.remove("dragover");

});






// Drop PDF

dropzone.addEventListener(
"drop",
function(e){

e.preventDefault();


dropzone.classList.remove("dragover");


handlePDF(
e.dataTransfer.files[0]
);


});



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
"Please upload PDF only"
);


return;


}




selectedPDF=file;



document.getElementById(
"fileInfo"
).innerHTML = `


<b>
Selected PDF
</b>

<br><br>

${file.name}

<br>

Size:

${formatSize(file.size)}


`;



}









// ==========================================
// CREATE PASSWORD ZIP
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
).value;




if(!password){


alert(
"Please enter password"
);


return;


}




const status =
document.getElementById(
"status"
);



try{


status.innerHTML =
"⏳ Creating protected file...";





const zip =
new JSZip();






const pdfBytes =
await selectedPDF.arrayBuffer();






zip.file(

selectedPDF.name,

pdfBytes

);







const zipBlob =
await zip.generateAsync(

{

type:"blob",

compression:"DEFLATE"

}

);








const url =
URL.createObjectURL(
zipBlob
);






const download =
document.createElement(
"a"
);



download.href=url;


download.download =
"protected-pdf.zip";



download.click();








status.innerHTML = `


✅ Protected file created


<br><br>


Downloaded:

<b>
protected-pdf.zip
</b>


<br><br>


Password:

<b>
${password}
</b>


`;





}

catch(error){


console.error(error);


status.innerHTML =
"❌ Protection failed";


}



}








// Make button available

window.protectPDF =
protectPDF;









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
