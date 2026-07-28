// ==========================================
// FAST MAGIC PDF - MERGE PDF TOOL
// ==========================================


let pdfFiles = [];



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const fileInput =
document.getElementById("pdfFiles");


const fileList =
document.getElementById("fileList");


const mergeBtn =
document.getElementById("mergeBtn");


const clearBtn =
document.getElementById("clearBtn");





// CLICK UPLOAD AREA

dropzone.addEventListener(
"click",
function(){

    fileInput.click();

});






// SELECT FILES

fileInput.addEventListener(
"change",
function(){

    addFiles(this.files);

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








// DROP FILES

dropzone.addEventListener(
"drop",
function(e){


    e.preventDefault();


    dropzone.classList.remove("dragover");


    addFiles(
        e.dataTransfer.files
    );


});







// MERGE BUTTON

mergeBtn.addEventListener(
"click",
mergePDF
);






// CLEAR BUTTON

clearBtn.addEventListener(
"click",
function(){

    pdfFiles=[];

    renderFiles();

    document.getElementById("status").innerHTML="";

    document.getElementById("downloadArea").innerHTML="";


});



});








// ==========================================
// ADD PDF FILES
// ==========================================


function addFiles(files){


Array.from(files).forEach(
(file)=>{


if(file.type==="application/pdf"){


pdfFiles.push(file);


}


});


renderFiles();


}








// ==========================================
// DISPLAY FILE LIST
// ==========================================


function renderFiles(){


const fileList =
document.getElementById("fileList");


fileList.innerHTML="";



pdfFiles.forEach(
(file,index)=>{


const div =
document.createElement("div");


div.className="file-card";



div.innerHTML=`

<div class="file-details">


<span>
📄
</span>


<div>

<div class="file-name">

${file.name}

</div>


<div class="file-size">

${formatSize(file.size)}

</div>


</div>


</div>



<div class="file-buttons">


<button 
class="move-btn"
onclick="moveUp(${index})">

⬆

</button>



<button 
class="move-btn"
onclick="moveDown(${index})">

⬇

</button>



<button 
class="remove-btn"
onclick="removeFile(${index})">

❌

</button>


</div>

`;



fileList.appendChild(div);



});


}








// ==========================================
// REMOVE FILE
// ==========================================


function removeFile(index){


pdfFiles.splice(
index,
1
);


renderFiles();


}







// ==========================================
// MOVE FILE UP
// ==========================================


function moveUp(index){


if(index===0)
return;



[
pdfFiles[index-1],
pdfFiles[index]
]
=
[
pdfFiles[index],
pdfFiles[index-1]
];



renderFiles();


}







// ==========================================
// MOVE FILE DOWN
// ==========================================


function moveDown(index){


if(index===pdfFiles.length-1)
return;



[
pdfFiles[index],
pdfFiles[index+1]
]
=
[
pdfFiles[index+1],
pdfFiles[index]
];



renderFiles();


}







// ==========================================
// MERGE PDF FUNCTION
// ==========================================


async function mergePDF(){



const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");



if(pdfFiles.length < 2){


alert(
"Please select at least 2 PDF files"
);


return;


}



try{


status.innerHTML=
"⏳ Merging PDFs...";



progress.style.width="20%";





const mergedPDF =
await PDFLib.PDFDocument.create();






for(
let i=0;
i<pdfFiles.length;
i++
){



const bytes =
await pdfFiles[i].arrayBuffer();




const pdf =
await PDFLib.PDFDocument.load(
bytes
);




const pages =
await mergedPDF.copyPages(
pdf,
pdf.getPageIndices()
);




pages.forEach(
(page)=>{

mergedPDF.addPage(page);

});


progress.style.width =
(
((i+1)
/pdfFiles.length)
*80
)
+
"%";



}






const mergedBytes =
await mergedPDF.save();




const blob =
new Blob(
[mergedBytes],
{
type:"application/pdf"
}
);





const url =
URL.createObjectURL(blob);





const downloadArea =
document.getElementById(
"downloadArea"
);



downloadArea.innerHTML=`


<button 
class="download-btn"
id="downloadMerged">

Download Merged PDF

</button>


`;






document
.getElementById("downloadMerged")
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download=
"merged.pdf";


link.click();


};




progress.style.width="100%";


status.innerHTML=
"✅ PDF merged successfully";




}

catch(error){


console.error(error);


status.innerHTML=
"❌ Merge failed. Try again";


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
