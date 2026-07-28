// ==========================================
// FAST MAGIC PDF - DELETE PDF PAGES JAVASCRIPT
// ==========================================


let selectedPDF = null;

let totalPages = 0;

let deletePages = [];




// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const pdfInput =
document.getElementById("pdfFile");


const deleteBtn =
document.getElementById("deleteBtn");




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

    loadPDF(this.files[0]);

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


    loadPDF(
        e.dataTransfer.files[0]
    );

});




// DELETE BUTTON

deleteBtn.addEventListener(
"click",
deleteSelectedPages
);


});








// ==========================================
// LOAD PDF
// ==========================================


async function loadPDF(file){


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




try{


const bytes =
await file.arrayBuffer();



const pdfDoc =
await PDFLib.PDFDocument.load(
bytes
);



totalPages =
pdfDoc.getPageCount();



createPageList();



}

catch(error){


console.error(error);


alert(
"Unable to read PDF"
);


}


}









// ==========================================
// CREATE PAGE LIST
// ==========================================


function createPageList(){



const pageList =
document.getElementById("pageList");



pageList.innerHTML="";



for(
let i=0;
i<totalPages;
i++
){



const card =
document.createElement(
"div"
);



card.className =
"page-card";



card.innerHTML = `


<input 
type="checkbox"
value="${i}"
class="pageCheckbox"
>


<div class="page-number">

Page ${i+1}

</div>


`;



pageList.appendChild(card);



}



}









// ==========================================
// DELETE SELECTED PAGES
// ==========================================


async function deleteSelectedPages(){



if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;


}




const checkboxes =
document.querySelectorAll(
".pageCheckbox:checked"
);



deletePages=[];



checkboxes.forEach(
(box)=>{


deletePages.push(
parseInt(box.value)
);


});





if(deletePages.length===totalPages){


alert(
"You cannot delete all pages"
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
"⏳ Removing pages...";


progress.style.width="30%";





const bytes =
await selectedPDF.arrayBuffer();





const oldPDF =
await PDFLib.PDFDocument.load(
bytes
);





const newPDF =
await PDFLib.PDFDocument.create();





const keepPages=[];



for(
let i=0;
i<totalPages;
i++
){


if(
!deletePages.includes(i)
){


keepPages.push(i);


}


}





const copiedPages =
await newPDF.copyPages(
oldPDF,
keepPages
);





copiedPages.forEach(
(page)=>{


newPDF.addPage(page);


});





progress.style.width="80%";





const pdfBytes =
await newPDF.save(
{

useObjectStreams:true

}
);





const blob =
new Blob(
[pdfBytes],
{
type:"application/pdf"
}
);



const url =
URL.createObjectURL(blob);





downloadArea.innerHTML = `


<button
class="download-btn"
id="downloadPDF">

Download Updated PDF

</button>


`;





document
.getElementById(
"downloadPDF"
)
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"deleted-pages.pdf";


link.click();


};





progress.style.width="100%";



status.innerHTML = `

✅ Pages removed successfully

<br>

Removed Pages:

${deletePages.length}

`;



}

catch(error){


console.error(
error
);


status.innerHTML =
"❌ Unable to delete pages";


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
