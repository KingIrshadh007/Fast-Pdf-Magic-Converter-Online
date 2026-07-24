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



const pdfDoc=
await PDFLib.PDFDocument.create();



for(const file of selectedImages){


const bytes=
await file.arrayBuffer();


const image=
await pdfDoc.embedJpg(bytes);



const page=
pdfDoc.addPage();


page.drawImage(image,{

x:50,

y:50,

width:400,

height:500

});


}



const pdfBytes=
await pdfDoc.save();



downloadPDF(
pdfBytes,
"images.pdf"
);



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
