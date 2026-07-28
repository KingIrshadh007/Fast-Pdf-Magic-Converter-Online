// ==========================================
// FAST MAGIC PDF
// PROTECT PDF - ZIP PASSWORD VERSION
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");



// CLICK UPLOAD BOX

dropzone.addEventListener(
"click",
function(){

    pdfInput.click();

});




// FILE SELECT

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




// DROP FILE

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
"Please upload PDF file only"
);


return;

}



selectedPDF = file;



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





const pdfBytes =
await selectedPDF.arrayBuffer();






const zip =
new zip.ZipWriter(
new zip.BlobWriter(
"application/zip"
),
{

password: password

}

);







await zip.add(

selectedPDF.name,

new zip.Uint8ArrayReader(

new Uint8Array(pdfBytes)

)

);






await zip.close();






const blob =
await zip.getData();






const url =
URL.createObjectURL(blob);






const download =
document.createElement("a");



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


`;



}

catch(error){


console.error(error);


status.innerHTML =
"❌ Failed";


}



}







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
