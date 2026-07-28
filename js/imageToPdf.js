// ==========================================
// FAST MAGIC PDF - IMAGE TO PDF JAVASCRIPT
// ==========================================


let selectedImages = [];



document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const imageInput =
document.getElementById("imageFiles");


const createBtn =
document.getElementById("createBtn");




// CLICK UPLOAD

dropzone.addEventListener(
"click",
function(){

    imageInput.click();

});




// SELECT IMAGES

imageInput.addEventListener(
"change",
function(){

    addImages(this.files);

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




// DROP IMAGES

dropzone.addEventListener(
"drop",
function(e){

    e.preventDefault();

    dropzone.classList.remove("dragover");


    addImages(
        e.dataTransfer.files
    );

});




// CREATE PDF

createBtn.addEventListener(
"click",
createPDF
);


});







// ==========================================
// ADD IMAGES
// ==========================================


function addImages(files){


Array.from(files).forEach(
(file)=>{


if(file.type.startsWith("image/")){


selectedImages.push(file);


}


});


renderPreview();


}







// ==========================================
// IMAGE PREVIEW
// ==========================================


function renderPreview(){


const preview =
document.getElementById("imagePreview");


preview.innerHTML="";



selectedImages.forEach(
(file,index)=>{


const reader =
new FileReader();



reader.onload=function(e){


const div =
document.createElement("div");


div.className =
"image-card";



div.innerHTML = `


<button 
class="remove-image"
onclick="removeImage(${index})">

×

</button>


<img src="${e.target.result}">


<div class="image-name">

${file.name}

</div>


`;



preview.appendChild(div);



};



reader.readAsDataURL(file);



});


}







// ==========================================
// REMOVE IMAGE
// ==========================================


function removeImage(index){


selectedImages.splice(
index,
1
);


renderPreview();


}






// ==========================================
// CREATE PDF
// ==========================================


async function createPDF(){



if(selectedImages.length===0){


alert(
"Please select images first"
);


return;


}





const status =
document.getElementById("status");


const progress =
document.getElementById("progressBar");



try{


status.innerHTML =
"⏳ Creating PDF...";


progress.style.width="10%";





const pdfDoc =
await PDFLib.PDFDocument.create();





const size =
document.getElementById(
"pageSize"
).value;





let pageWidth = 595;

let pageHeight = 842;





if(size==="LETTER"){


pageWidth=612;

pageHeight=792;


}



if(size==="A3"){


pageWidth=842;

pageHeight=1191;


}






const quality =
parseFloat(
document.getElementById(
"imageQuality"
).value
);






for(
let i=0;
i<selectedImages.length;
i++
){



const file =
selectedImages[i];




const imageBytes =
await file.arrayBuffer();





let image;



if(
file.type==="image/png"
){


image =
await pdfDoc.embedPng(
imageBytes
);


}
else{


image =
await pdfDoc.embedJpg(
imageBytes
);


}







const page =
pdfDoc.addPage(
[
pageWidth,
pageHeight
]
);






const scale =
Math.min(
pageWidth / image.width,
pageHeight / image.height
);






page.drawImage(
image,
{

x:
(pageWidth -
image.width * scale)
/2,


y:
(pageHeight -
image.height * scale)
/2,


width:
image.width * scale,


height:
image.height * scale


});







progress.style.width =
(
((i+1)
/selectedImages.length)
*80
+
"%"
);



}






const pdfBytes =
await pdfDoc.save(
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





const area =
document.getElementById(
"downloadArea"
);



area.innerHTML = `


<button
class="download-btn"
id="downloadPDF">

Download PDF

</button>


`;






document
.getElementById("downloadPDF")
.onclick=function(){


const link =
document.createElement("a");


link.href=url;


link.download =
"images.pdf";


link.click();


};






progress.style.width="100%";


status.innerHTML =
"✅ PDF Created Successfully";



}

catch(error){


console.error(error);


status.innerHTML =
"❌ Unable to create PDF";


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


return (
bytes/(1024*1024)
)
.toFixed(2)
+
" MB";


}
