// ==========================================
// FAST MAGIC PDF
// PASSWORD ZIP PROTECT
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const pdfInput =
document.getElementById("pdfFile");


const dropzone =
document.getElementById("dropzone");





dropzone.addEventListener(
"click",
()=>{

pdfInput.click();

});





pdfInput.addEventListener(
"change",
()=>{

handlePDF(pdfInput.files[0]);

});





dropzone.addEventListener(
"dragover",
(e)=>{

e.preventDefault();

dropzone.classList.add("dragover");

});






dropzone.addEventListener(
"dragleave",
()=>{

dropzone.classList.remove("dragover");

});






dropzone.addEventListener(
"drop",
(e)=>{


e.preventDefault();


dropzone.classList.remove("dragover");


handlePDF(
e.dataTransfer.files[0]
);


});



});









function handlePDF(file){



if(!file){

return;

}



if(file.type !== "application/pdf"){


alert(
"Please upload PDF only"
);


return;

}



selectedPDF=file;



document.getElementById(
"fileInfo"
).innerHTML = `

<b>${file.name}</b>

<br>

${formatSize(file.size)}

`;



}









async function protectPDF(){



if(!selectedPDF){


alert(
"Please upload PDF first"
);


return;

}





const password =
document.getElementById(
"pdfPassword"
).value;




if(!password){


alert(
"Enter password"
);


return;

}




const status =
document.getElementById(
"status"
);



try{


status.innerHTML =
"⏳ Creating password ZIP...";





const writer =
new zip.ZipWriter(
new zip.BlobWriter("application/zip")
);



await writer.add(

selectedPDF.name,

new zip.BlobReader(selectedPDF),

{

password:password,

level:6

}

);






const blob =
await writer.close();






const url =
URL.createObjectURL(blob);





const link =
document.createElement("a");


link.href=url;


link.download =
"protected-pdf.zip";


link.click();






status.innerHTML = `

✅ Protected file created

<br><br>

Download:

<b>
protected-pdf.zip
</b>

`;



}

catch(error){


console.error(
"ZIP ERROR:",
error
);


status.innerHTML =
"❌ Failed: " + error.message;


}



}







window.protectPDF =
protectPDF;









function formatSize(bytes){


if(bytes < 1024){

return bytes+" Bytes";

}



if(bytes < 1024*1024){

return (
bytes/1024
).toFixed(2)+" KB";

}



return (
bytes/(1024*1024)
).toFixed(2)+" MB";


}
