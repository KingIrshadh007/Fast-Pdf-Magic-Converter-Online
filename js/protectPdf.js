// ==========================================
// FAST MAGIC PDF
// REAL PASSWORD ZIP PROTECTION
// ==========================================


let selectedPDF = null;



document.addEventListener(
"DOMContentLoaded",
()=>{


const input =
document.getElementById("pdfFile");


input.addEventListener(
"change",
function(){

selectedPDF=this.files[0];


document.getElementById("fileInfo").innerHTML =

`
<b>${selectedPDF.name}</b>
<br>
${formatSize(selectedPDF.size)}
`;

});


});






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
document.getElementById("status");



try{


status.innerHTML =
"⏳ Encrypting PDF...";





const pdfData =
await selectedPDF.arrayBuffer();






const blobWriter =
new zip.BlobWriter(
"application/zip"
);






const writer =
new zip.ZipWriter(
blobWriter,
{

password:password

}

);






await writer.add(
selectedPDF.name,
new zip.Uint8ArrayReader(
new Uint8Array(pdfData)
)

);






await writer.close();






const zipBlob =
await blobWriter.getData();






const url =
URL.createObjectURL(zipBlob);





const link =
document.createElement("a");



link.href=url;


link.download =
"protected-pdf.zip";



link.click();






status.innerHTML =

`
✅ Password protected ZIP created

<br><br>

File:
<b>protected-pdf.zip</b>

`;



}

catch(error){


console.error(error);


status.innerHTML =
"❌ Failed creating protected file";


}



}






window.protectPDF =
protectPDF;






function formatSize(bytes){


if(bytes < 1024)
return bytes+" Bytes";


if(bytes < 1024*1024)
return (bytes/1024).toFixed(2)+" KB";


return (bytes/(1024*1024)).toFixed(2)+" MB";


}
