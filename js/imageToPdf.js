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

    if(selectedImages.length === 0){

        alert("Select images first");
        return;

    }


    const pdfDoc = await PDFLib.PDFDocument.create();


    for(const file of selectedImages){


        const jpegBlob = await convertToJPEG(file);


        const bytes = await jpegBlob.arrayBuffer();


        const image = await pdfDoc.embedJpg(bytes);


        const page = pdfDoc.addPage([595,842]);


        const imgWidth = image.width;
        const imgHeight = image.height;


        const scale = Math.min(
            500 / imgWidth,
            750 / imgHeight
        );


        const width = imgWidth * scale;
        const height = imgHeight * scale;


        page.drawImage(
            image,
            {
                x:(595 - width) / 2,
                y:(842 - height) / 2,
                width:width,
                height:height
            }
        );


    }


    const pdfBytes = await pdfDoc.save();


    downloadPDF(
        pdfBytes,
        "images.pdf"
    );

}

function convertToJPEG(file){

return new Promise((resolve,reject)=>{


const img = new Image();


img.onload=function(){


const canvas=document.createElement("canvas");


canvas.width=this.naturalWidth;

canvas.height=this.naturalHeight;


const ctx=canvas.getContext("2d");


ctx.drawImage(
this,
0,
0
);



canvas.toBlob(
(blob)=>{

if(blob){

resolve(blob);

}
else{

reject("Conversion failed");

}

},
"image/jpeg",
0.90
);



};


img.onerror=function(){

reject("Image loading failed");

};



img.src =
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
