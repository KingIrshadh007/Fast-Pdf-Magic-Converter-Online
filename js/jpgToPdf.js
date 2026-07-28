// ==========================================
// FAST MAGIC PDF - JPG TO PDF JAVASCRIPT
// ==========================================


let selectedImages = [];





document.addEventListener(
"DOMContentLoaded",
function(){


const dropzone =
document.getElementById("dropzone");


const imageInput =
document.getElementById("imageInput");


const convertBtn =
document.getElementById("convertBtn");




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







// CONVERT BUTTON

convertBtn.addEventListener(
"click",
convertToPDF
);



});









// ==========================================
// ADD IMAGES
// ==========================================


function addImages(files){



Array.from(files).forEach(
file=>{


if(file.type.startsWith("image/")){


selectedImages.push(file);


}



});



showPreview();


}









// ==========================================
// SHOW PREVIEW
// ==========================================


function showPreview(){



const previewArea =
document.getElementById("previewArea");



previewArea.innerHTML="";





selectedImages.forEach(
(image,index)=>{



const reader =
new FileReader();




reader.onload=function(e){



const card =
document.createElement("div");


card.className =
"preview-card";




card.innerHTML = `


<img src="${e.target.result}">


<button

class="remove-btn"

onclick="removeImage(${index})">

×

</button>


`;




previewArea.appendChild(card);



};





reader.readAsDataURL(image);



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



showPreview();



}





window.removeImage =
removeImage;









// ==========================================
// CONVERT TO PDF
// ==========================================


async function convertToPDF(){



if(selectedImages.length===0){


alert(
"Please select images first"
);


return;


}





const status =
document.getElementById("status");


const downloadArea =
document.getElementById("downloadArea");




try{


status.innerHTML =
"⏳ Creating PDF...";





const pdfDoc =
await PDFLib.PDFDocument.create();





const pageSize =
document.getElementById(
"pageSize"
)
.value;







for(
let imageFile of selectedImages
){



const imageBytes =
await imageFile.arrayBuffer();





let image;



if(
imageFile.type==="image/png"
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






let pageWidth = 595;

let pageHeight = 842;



if(pageSize==="LETTER"){


pageWidth=612;

pageHeight=792;


}



if(pageSize==="A3"){


pageWidth=842;

pageHeight=1191;


}






const page =
pdfDoc.addPage(
[
pageWidth,
pageHeight
]
);






const imgSize =
image.scale(
1
);





let scale =
Math.min(

pageWidth / imgSize.width,

pageHeight / imgSize.height

);






const imgWidth =
imgSize.width * scale;


const imgHeight =
imgSize.height * scale;






page.drawImage(
image,
{


x:
(pageWidth-imgWidth)/2,


y:
(pageHeight-imgHeight)/2,


width:
imgWidth,


height:
imgHeight


}

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







downloadArea.innerHTML = `


<button

class="download-btn"

id="downloadPDF">

Download PDF

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
"images-to-pdf.pdf";


link.click();


};







status.innerHTML = `


✅ PDF Created Successfully

<br>

${selectedImages.length} images converted.


`;



}

catch(error){


console.error(
error
);



status.innerHTML =

"❌ PDF creation failed";


}



}
