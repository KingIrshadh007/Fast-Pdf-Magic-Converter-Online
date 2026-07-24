let selectedImages=[];


const imageInput=document.getElementById("images");

const imageDropzone=document.getElementById("dropzone");

const imageFileList=document.getElementById("fileList");



if(imageDropzone){


imageDropzone.onclick=()=>{

imageInput.click();

};


}



if(imageInput){


imageInput.addEventListener("change",()=>{


selectedImages=[
...selectedImages,
...imageInput.files
];


displayImages();


});


}




function displayImages(){


if(!imageFileList)
return;


imageFileList.innerHTML="";


selectedImages.forEach((file,index)=>{


let div=document.createElement("div");


div.className="file-item";


div.innerHTML=`

<span>${file.name}</span>

<button onclick="removeImage(${index})">
❌
</button>

`;


imageFileList.appendChild(div);


});


}




function removeImage(index){


selectedImages.splice(index,1);

displayImages();


}




const convertBtn=document.getElementById("convertBtn");


if(convertBtn){


convertBtn.onclick=createImagePDF;


}




async function createImagePDF(){


if(selectedImages.length===0){

alert("Select images first");

return;

}



const pdfDoc =
await PDFLib.PDFDocument.create();



for(const file of selectedImages){


const jpegBlob =
await convertToJPEG(file);



const bytes =
await jpegBlob.arrayBuffer();



let image;


if(file.type === "image/jpeg" || file.type === "image/jpg"){

    image = await pdfDoc.embedJpg(bytes);

}
else{

    image = await pdfDoc.embedPng(bytes);

}



const page =
pdfDoc.addPage([595,842]);



const scale =
Math.min(
595/image.width,
842/image.height
);



page.drawImage(image,{

x:(595-image.width*scale)/2,

y:(842-image.height*scale)/2,

width:image.width*scale,

height:image.height*scale

});


}



const pdfBytes =
await pdfDoc.save();



downloadPDF(
pdfBytes,
"images.pdf"
);


}

async function convertToJPEG(file){


return new Promise((resolve)=>{


const img=new Image();


img.onload=()=>{


const canvas=document.createElement("canvas");


canvas.width=img.width;

canvas.height=img.height;


const ctx=
canvas.getContext("2d");


ctx.drawImage(
img,
0,
0
);



canvas.toBlob(

(blob)=>resolve(blob),

"image/jpeg",

0.9

);


};



img.src=
URL.createObjectURL(file);


});


}


function downloadPDF(bytes,name){


const blob=
new Blob(
[bytes],
{
type:"application/pdf"
}
);



const url=
URL.createObjectURL(blob);



const a=document.createElement("a");


a.href=url;

a.download=name;

a.click();


URL.revokeObjectURL(url);


}
