// ==========================================
// FAST MAGIC PDF - SPLIT PDF JAVASCRIPT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const splitBtn =
document.getElementById("splitBtn");





// CLICK UPLOAD

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








// SPLIT BUTTON

splitBtn.addEventListener(
"click",
splitPDF
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



selectedPDF = file;



const info =
document.getElementById("pdfInfo");


info.style.display="block";


info.innerHTML = `

<b>Selected File:</b>

<br>

${file.name}

<br><br>

Size:

${formatSize(file.size)}

`;



}








// ==========================================
// SPLIT PDF FUNCTION
// ==========================================


async function splitPDF(){



if(!selectedPDF){


alert(
"Please upload a PDF first"
);


return;


}





const pageInput =
document.getElementById("pageNumbers").value.trim();



if(pageInput===""){


alert(
"Please enter page numbers"
);


return;


}






const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");



try{


status.innerHTML =
"⏳ Reading PDF...";


progress.style.width="20%";





const bytes =
await selectedPDF.arrayBuffer();





const originalPDF =
await PDFLib.PDFDocument.load(
bytes
);




const totalPages =
originalPDF.getPageCount();





const pages =
parsePages(
pageInput,
totalPages
);




if(pages.length===0){


throw new Error(
"Invalid page range"
);


}





status.innerHTML =
"⏳ Extracting pages...";


progress.style.width="50%";






const newPDF =
await PDFLib.PDFDocument.create();





const copiedPages =
await newPDF.copyPages(
originalPDF,
pages
);





copiedPages.forEach(
(page)=>{


newPDF.addPage(page);


});





const pdfBytes =
await newPDF.save();





const blob =
new Blob(
[pdfBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);





const area =
document.getElementById(
"downloadArea"
);



area.innerHTML = `


<button 
class="download-btn"
id="downloadSplit">

Download Split PDF

</button>


`;






document
.getElementById("downloadSplit")
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download=
"split.pdf";


link.click();


};






progress.style.width="100%";


status.innerHTML =
"✅ PDF Split Successfully";



}

catch(error){


console.error(error);


status.innerHTML =
"❌ Unable to split PDF. Check page numbers.";


progress.style.width="0%";


}



}








// ==========================================
// PAGE RANGE PARSER
// ==========================================


function parsePages(input,totalPages){



let pages=[];



const parts =
input.split(",");





parts.forEach(
part=>{


part=part.trim();





// RANGE 1-5

if(part.includes("-")){


const range =
part.split("-");



let start =
parseInt(range[0])-1;


let end =
parseInt(range[1])-1;





if(
start>=0 &&
end<totalPages &&
start<=end
){


for(
let i=start;
i<=end;
i++
){

pages.push(i);

}


}



}



// SINGLE PAGE

else{


let page =
parseInt(part)-1;



if(
page>=0 &&
page<totalPages
){


pages.push(page);


}



}



});




return [
...new Set(pages)
];


}








// ==========================================
// FILE SIZE FORMAT
// ==========================================


function formatSize(bytes){


if(bytes < 1024){

return bytes+" Bytes";

}



if(bytes < 1024*1024){


return (
bytes/1024
).toFixed(2)
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
