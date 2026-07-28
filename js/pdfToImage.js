// ==========================================
// FAST MAGIC PDF - PDF TO IMAGE JAVASCRIPT
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
convertPDF
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
// CONVERT PDF TO IMAGE
// ==========================================


async function convertPDF(){



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


const results =
document.getElementById("imageResults");



results.innerHTML="";



try{


status.innerHTML =
"⏳ Loading PDF...";


progress.style.width="10%";





const bytes =
await selectedPDF.arrayBuffer();





const pdf =
await pdfjsLib.getDocument(
{
data:bytes
}
).promise;





const totalPages =
pdf.numPages;





status.innerHTML =
`⏳ Converting ${totalPages} pages...`;





for(
let pageNumber=1;
pageNumber<=totalPages;
pageNumber++
){



const page =
await pdf.getPage(
pageNumber
);





const viewport =
page.getViewport(
{
scale:2
}
);





const canvas =
document.createElement(
"canvas"
);


const context =
canvas.getContext(
"2d"
);



canvas.width =
viewport.width;


canvas.height =
viewport.height;





await page.render(
{

canvasContext:context,

viewport:viewport

}
)
.promise;






const imageURL =
canvas.toDataURL(
"image/jpeg",
0.95
);







const card =
document.createElement(
"div"
);



card.className =
"image-result-card";





card.innerHTML = `


<h3>
Page ${pageNumber}
</h3>


<img src="${imageURL}">


<button>
Download JPG
</button>


`;







const button =
card.querySelector(
"button"
);




button.onclick=function(){


const link =
document.createElement(
"a"
);


link.href=imageURL;


link.download =
`page-${pageNumber}.jpg`;


link.click();


};






results.appendChild(card);







progress.style.width =
(
(pageNumber / totalPages)
*100
)
+
"%";





}





status.innerHTML =
"✅ PDF converted successfully";



}

catch(error){


console.error(
error
);


status.innerHTML =
"❌ Conversion failed. Try another PDF";


progress.style.width="0%";


}



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
