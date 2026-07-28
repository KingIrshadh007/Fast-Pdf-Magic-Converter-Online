// ==========================================
// FAST MAGIC PDF - PDF TO EXCEL JAVASCRIPT
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




// CLICK UPLOAD BOX

dropzone.addEventListener(
"click",
function(){

    pdfInput.click();

});






// SELECT FILE

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







// CONVERT BUTTON

convertBtn.addEventListener(
"click",
convertToExcel
);



});









// ==========================================
// HANDLE PDF FILE
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
// PDF TO EXCEL CONVERSION
// ==========================================


async function convertToExcel(){



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






let csvContent =
"Page,Text\n";








for(
let pageNo = 1;
pageNo <= pdf.numPages;
pageNo++
){



const page =
await pdf.getPage(
pageNo
);





const textContent =
await page.getTextContent();





let pageText =
textContent.items
.map(
item => item.str
)
.join(" ");






// Escape commas

pageText =
pageText.replace(
/,/g,
";"
);






csvContent +=

pageNo
+
",\""
+
pageText
+
"\"\n";






progress.style.width =

(
(pageNo / pdf.numPages)
*
80

)
+
"%";



}








const blob =
new Blob(
[csvContent],
{

type:
"text/csv;charset=utf-8"

}

);






const url =
URL.createObjectURL(
blob
);







downloadArea.innerHTML = `


<button
class="download-btn"
id="downloadExcel">

Download Excel File

</button>


`;








document
.getElementById(
"downloadExcel"
)
.onclick=function(){



const link =
document.createElement("a");


link.href=url;


link.download =
"converted-excel.csv";


link.click();


};








progress.style.width="100%";




status.innerHTML = `


✅ Conversion Completed

<br>

Excel compatible CSV file created.


`;




}

catch(error){



console.error(
"PDF To Excel Error:",
error
);



status.innerHTML =

"❌ Conversion failed. Try another PDF.";



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
